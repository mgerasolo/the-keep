/**
 * Projects Router
 * CRUD operations for projects
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// Input schemas
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  icon: z.string().max(50).optional(),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  icon: z.string().max(50).optional(),
  description: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const projectsRouter = router({
  /**
   * List all projects for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const userProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.userId, ctx.user.id),
          isNull(projects.archivedAt)
        )
      )
      .orderBy(projects.createdAt);

    return userProjects;
  }),

  /**
   * Get a single project by ID
   */
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),

  /**
   * Create a new project
   */
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const [project] = await db
        .insert(projects)
        .values({
          userId: ctx.user.id,
          name: input.name,
          icon: input.icon,
          description: input.description,
        })
        .returning();

      return project;
    }),

  /**
   * Update a project
   */
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      // Verify ownership
      const [existing] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, id),
            eq(projects.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const [project] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, id))
        .returning();

      return project;
    }),

  /**
   * Archive a project (soft delete)
   */
  archive: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const [existing] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const [project] = await db
        .update(projects)
        .set({ archivedAt: new Date() })
        .where(eq(projects.id, input.id))
        .returning();

      return project;
    }),

  /**
   * Restore an archived project
   */
  restore: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [project] = await db
        .update(projects)
        .set({ archivedAt: null })
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.user.id)
          )
        )
        .returning();

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),
});
