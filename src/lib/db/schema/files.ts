/**
 * Files Schema
 * File metadata for The Keep (content stored in MinIO)
 */

import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  path: text('path').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 127 }),
  size: integer('size'),
  minioKey: text('minio_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Type exports for TypeScript
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
