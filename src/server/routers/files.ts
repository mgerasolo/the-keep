/**
 * Files Router
 * CRUD operations for files and folders
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { files, folders } from '@/lib/db/schema';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { minioClient, BUCKET_NAME } from '@/lib/minio';

// Input schemas
const listFilesSchema = z.object({
  projectId: z.string().uuid(),
});

const createFolderSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  parentId: z.string().uuid().optional(),
});

export const filesRouter = router({
  /**
   * List all files and folders for a project
   * Returns a flat list - client builds the tree
   */
  list: protectedProcedure.input(listFilesSchema).query(async ({ input }) => {
    const [projectFiles, projectFolders] = await Promise.all([
      db
        .select()
        .from(files)
        .where(and(eq(files.projectId, input.projectId), isNull(files.deletedAt)))
        .orderBy(asc(files.path)),
      db
        .select()
        .from(folders)
        .where(and(eq(folders.projectId, input.projectId), isNull(folders.deletedAt)))
        .orderBy(asc(folders.path)),
    ]);

    return {
      files: projectFiles,
      folders: projectFolders,
    };
  }),

  /**
   * Create a new folder
   */
  createFolder: protectedProcedure.input(createFolderSchema).mutation(async ({ input }) => {
    // Build path from parent
    let path = '/';
    if (input.parentId) {
      const [parent] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.parentId))
        .limit(1);

      if (!parent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Parent folder not found',
        });
      }
      path = parent.path === '/' ? `/${input.name}` : `${parent.path}/${input.name}`;
    } else {
      path = `/${input.name}`;
    }

    const [folder] = await db
      .insert(folders)
      .values({
        projectId: input.projectId,
        parentId: input.parentId,
        name: input.name,
        path,
      })
      .returning();

    return folder;
  }),

  /**
   * Delete a folder (soft delete)
   */
  deleteFolder: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [folder] = await db
        .update(folders)
        .set({ deletedAt: new Date() })
        .where(eq(folders.id, input.id))
        .returning();

      if (!folder) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Folder not found',
        });
      }

      return folder;
    }),

  /**
   * Delete a file (soft delete)
   */
  deleteFile: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [file] = await db
        .update(files)
        .set({ deletedAt: new Date() })
        .where(eq(files.id, input.id))
        .returning();

      if (!file) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        });
      }

      return file;
    }),

  /**
   * Rename a file
   */
  renameFile: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db.select().from(files).where(eq(files.id, input.id)).limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        });
      }

      // Update path to reflect new name
      const parentPath = existing.path.substring(0, existing.path.lastIndexOf('/'));
      const newPath = parentPath ? `${parentPath}/${input.name}` : `/${input.name}`;

      const [file] = await db
        .update(files)
        .set({ name: input.name, path: newPath })
        .where(eq(files.id, input.id))
        .returning();

      return file;
    }),

  /**
   * Rename a folder
   */
  renameFolder: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db.select().from(folders).where(eq(folders.id, input.id)).limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Folder not found',
        });
      }

      // Update path to reflect new name
      const parentPath = existing.path.substring(0, existing.path.lastIndexOf('/'));
      const newPath = parentPath ? `${parentPath}/${input.name}` : `/${input.name}`;

      const [folder] = await db
        .update(folders)
        .set({ name: input.name, path: newPath })
        .where(eq(folders.id, input.id))
        .returning();

      return folder;
    }),

  /**
   * Create a new file with initial content
   */
  createFile: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().min(1).max(255),
        folderId: z.string().uuid().optional(),
        content: z.string().optional().default(''),
      })
    )
    .mutation(async ({ input }) => {
      // Determine mime type from file extension
      const ext = input.name.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        md: 'text/markdown',
        txt: 'text/plain',
        json: 'application/json',
        js: 'text/javascript',
        ts: 'text/javascript',
        html: 'text/html',
        css: 'text/css',
      };
      const mimeType = mimeTypes[ext || ''] || 'text/plain';

      // Build path from folder
      let path = `/${input.name}`;
      if (input.folderId) {
        const [folder] = await db
          .select()
          .from(folders)
          .where(eq(folders.id, input.folderId))
          .limit(1);

        if (folder) {
          path = folder.path === '/' ? `/${input.name}` : `${folder.path}/${input.name}`;
        }
      }

      // Generate MinIO key
      const fileId = crypto.randomUUID();
      const minioKey = `${input.projectId}/${fileId}.${ext || 'txt'}`;

      // Upload empty/initial content to MinIO
      const contentBuffer = Buffer.from(input.content, 'utf-8');
      await minioClient.putObject(BUCKET_NAME, minioKey, contentBuffer, contentBuffer.length, {
        'Content-Type': mimeType,
      });

      // Create file record
      const [file] = await db
        .insert(files)
        .values({
          id: fileId,
          projectId: input.projectId,
          name: input.name,
          path,
          mimeType,
          size: contentBuffer.length,
          minioKey,
        })
        .returning();

      return file;
    }),

  /**
   * Duplicate a file
   */
  duplicateFile: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // Get original file
      const [original] = await db.select().from(files).where(eq(files.id, input.id)).limit(1);

      if (!original) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        });
      }

      // Get original content from MinIO
      const stream = await minioClient.getObject(BUCKET_NAME, original.minioKey);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      const content = Buffer.concat(chunks);

      // Generate new file info
      const newId = crypto.randomUUID();
      const ext = original.name.split('.').pop() || 'txt';
      const baseName = original.name.replace(/\.[^/.]+$/, '');
      const newName = `Copy of ${baseName}.${ext}`;
      const newMinioKey = `${original.projectId}/${newId}.${ext}`;
      const parentPath = original.path.substring(0, original.path.lastIndexOf('/'));
      const newPath = parentPath ? `${parentPath}/${newName}` : `/${newName}`;

      // Upload to MinIO
      await minioClient.putObject(BUCKET_NAME, newMinioKey, content, content.length, {
        'Content-Type': original.mimeType || 'text/plain',
      });

      // Create new file record
      const [file] = await db
        .insert(files)
        .values({
          id: newId,
          projectId: original.projectId,
          name: newName,
          path: newPath,
          mimeType: original.mimeType,
          size: content.length,
          minioKey: newMinioKey,
        })
        .returning();

      return file;
    }),
});
