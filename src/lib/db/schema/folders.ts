/**
 * Folders Schema
 * Folder structure for organizing files in The Keep
 */

import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const folders = pgTable('folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .references(() => projects.id)
    .notNull(),
  parentId: uuid('parent_id'), // Self-referential FK added via SQL for circular reference
  name: varchar('name', { length: 255 }).notNull(),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Type exports for TypeScript
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
