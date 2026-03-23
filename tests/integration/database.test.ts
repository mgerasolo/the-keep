/**
 * Database Integration Tests
 * Verifies Story 0-2: Database Schema & Migrations
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '../../src/lib/db/schema';

// Skip if no DATABASE_URL (unit test mode)
const shouldRun = !!process.env.DATABASE_URL;

describe.skipIf(!shouldRun)('Database Integration', () => {
  let client: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle>;

  beforeAll(() => {
    client = postgres(process.env.DATABASE_URL!);
    db = drizzle(client, { schema });
  });

  afterAll(async () => {
    await client.end();
  });

  describe('AC-1: Core Tables Exist', () => {
    it('should have users table', async () => {
      const result = await client`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
      `;
      expect(result.length).toBe(1);
    });

    it('should have projects table', async () => {
      const result = await client`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'projects'
      `;
      expect(result.length).toBe(1);
    });

    it('should have files table', async () => {
      const result = await client`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'files'
      `;
      expect(result.length).toBe(1);
    });

    it('should have folders table', async () => {
      const result = await client`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'folders'
      `;
      expect(result.length).toBe(1);
    });

    it('users table should have correct columns', async () => {
      const result = await client`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY column_name
      `;
      const columns = result.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('username');
      expect(columns).toContain('email');
      expect(columns).toContain('name');
      expect(columns).toContain('created_at');
    });

    it('projects table should have correct columns', async () => {
      const result = await client`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'projects'
        ORDER BY column_name
      `;
      const columns = result.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('name');
      expect(columns).toContain('icon');
      expect(columns).toContain('description');
      expect(columns).toContain('settings');
      expect(columns).toContain('created_at');
      expect(columns).toContain('archived_at');
    });

    it('files table should have correct columns', async () => {
      const result = await client`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'files'
        ORDER BY column_name
      `;
      const columns = result.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('project_id');
      expect(columns).toContain('path');
      expect(columns).toContain('name');
      expect(columns).toContain('mime_type');
      expect(columns).toContain('size');
      expect(columns).toContain('minio_key');
      expect(columns).toContain('created_at');
      expect(columns).toContain('deleted_at');
    });

    it('folders table should have correct columns', async () => {
      const result = await client`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'folders'
        ORDER BY column_name
      `;
      const columns = result.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('project_id');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('name');
      expect(columns).toContain('path');
      expect(columns).toContain('created_at');
      expect(columns).toContain('deleted_at');
    });
  });

  describe('AC-2: Seed Data', () => {
    it('should have seed user mgerasolo', async () => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, 'mgerasolo'));

      expect(user).toBeDefined();
      expect(user.username).toBe('mgerasolo');
      expect(user.email).toBe('matt@gerasolo.com');
      expect(user.name).toBe('Matt');
    });
  });

  describe('AC-3: Foreign Key Relationships', () => {
    it('should have projects.user_id -> users.id FK', async () => {
      const result = await client`
        SELECT conname FROM pg_constraint
        WHERE conname = 'projects_user_id_users_id_fk'
      `;
      expect(result.length).toBe(1);
    });

    it('should have files.project_id -> projects.id FK', async () => {
      const result = await client`
        SELECT conname FROM pg_constraint
        WHERE conname = 'files_project_id_projects_id_fk'
      `;
      expect(result.length).toBe(1);
    });

    it('should have folders.project_id -> projects.id FK', async () => {
      const result = await client`
        SELECT conname FROM pg_constraint
        WHERE conname = 'folders_project_id_projects_id_fk'
      `;
      expect(result.length).toBe(1);
    });
  });

  describe('AC-4: Drizzle ORM Integration', () => {
    it('should query using Drizzle ORM', async () => {
      const users = await db.select().from(schema.users).limit(1);
      expect(Array.isArray(users)).toBe(true);
    });

    it('should have correct TypeScript types', async () => {
      // This test verifies types at compile time
      const user: schema.User = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'test',
        email: 'test@test.com',
        name: 'Test',
        createdAt: new Date(),
      };
      expect(user.username).toBe('test');
    });
  });

  describe('AC-5: pgvector Ready', () => {
    it('should have pgvector extension enabled', async () => {
      const result = await client`
        SELECT extname FROM pg_extension WHERE extname = 'vector'
      `;
      expect(result.length).toBe(1);
      expect(result[0].extname).toBe('vector');
    });

    it('should support vector column type', async () => {
      // Test that we can create a vector column (don't actually create it)
      const result = await client`
        SELECT typname FROM pg_type WHERE typname = 'vector'
      `;
      expect(result.length).toBe(1);
    });
  });
});
