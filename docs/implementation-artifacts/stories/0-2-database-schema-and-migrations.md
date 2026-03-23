# Story 0.2: Database Schema & Migrations

**Status:** ready-for-dev

---

## Story

**As a** developer,
**I want** the core database schema created with Drizzle ORM and a seeded user,
**So that** features can persist data tied to a real user record.

---

## Acceptance Criteria

1. **AC-1: Core Tables Exist**
   - Given the PostgreSQL database is running
   - When I run database migrations
   - Then the following tables exist:
     - `users` (id, username, email, name, created_at)
     - `projects` (id, user_id, name, icon, description, settings, created_at, archived_at)
     - `files` (id, project_id, path, name, mime_type, size, minio_key, created_at, deleted_at)
     - `folders` (id, project_id, parent_id, name, path, created_at, deleted_at)

2. **AC-2: Seed Data**
   - Given the migrations have run
   - When I query the users table
   - Then a user exists with:
     ```
     id: 1
     username: mgerasolo
     email: matt@gerasolo.com
     name: Matt
     ```

3. **AC-3: Foreign Key Relationships**
   - Given the tables exist
   - When I inspect the schema
   - Then all tables reference `user_id` foreign key where applicable
   - And `projects.user_id` references `users.id`
   - And `files.project_id` references `projects.id`
   - And `folders.project_id` references `projects.id`

4. **AC-4: Drizzle ORM Integration**
   - Given Drizzle ORM is configured
   - When I import schema types
   - Then TypeScript types are generated for all tables
   - And `npm run db:migrate` runs migrations successfully
   - And `npm run db:generate` generates migration files

5. **AC-5: pgvector Ready**
   - Given pgvector extension is enabled (from Story 0.1)
   - When I create tables with vector columns
   - Then the database supports `vector(1536)` column type for embeddings

---

## Tasks / Subtasks

- [ ] **Task 1: Install Drizzle ORM Dependencies** (AC: 4)
  - [ ] Install `drizzle-orm` and `drizzle-kit`
  - [ ] Install `postgres` driver (pg or postgres.js)
  - [ ] Add db scripts to package.json: `db:generate`, `db:migrate`, `db:push`, `db:studio`

- [ ] **Task 2: Configure Drizzle** (AC: 4)
  - [ ] Create `drizzle.config.ts` with PostgreSQL connection
  - [ ] Create `src/lib/db/index.ts` for Drizzle client export
  - [ ] Configure connection to use `DATABASE_URL` from environment

- [ ] **Task 3: Create Users Schema** (AC: 1, 2, 3)
  - [ ] Create `src/lib/db/schema/users.ts`
  - [ ] Define users table with: id (uuid), username, email, name, created_at
  - [ ] Add unique constraints on username and email
  - [ ] Write unit tests for user schema validation

- [ ] **Task 4: Create Projects Schema** (AC: 1, 3)
  - [ ] Create `src/lib/db/schema/projects.ts`
  - [ ] Define projects table with: id, user_id (FK), name, icon, description, settings (json), created_at, archived_at
  - [ ] Add foreign key relationship to users
  - [ ] Write unit tests for project schema validation

- [ ] **Task 5: Create Files Schema** (AC: 1, 3)
  - [ ] Create `src/lib/db/schema/files.ts`
  - [ ] Define files table with: id, project_id (FK), path, name, mime_type, size, minio_key, created_at, deleted_at
  - [ ] Add soft delete support via deleted_at
  - [ ] Write unit tests for file schema validation

- [ ] **Task 6: Create Folders Schema** (AC: 1, 3)
  - [ ] Create `src/lib/db/schema/folders.ts`
  - [ ] Define folders table with: id, project_id (FK), parent_id (self-FK), name, path, created_at, deleted_at
  - [ ] Add self-referential foreign key for nested folders
  - [ ] Write unit tests for folder schema validation

- [ ] **Task 7: Create Schema Index** (AC: 4)
  - [ ] Create `src/lib/db/schema/index.ts` exporting all schemas
  - [ ] Ensure all relations are properly defined for Drizzle
  - [ ] Verify TypeScript types are correctly inferred

- [ ] **Task 8: Generate and Run Migrations** (AC: 1, 4)
  - [ ] Run `npm run db:generate` to create migration files
  - [ ] Review generated SQL for correctness
  - [ ] Run `npm run db:migrate` to apply migrations
  - [ ] Verify all tables created in PostgreSQL

- [ ] **Task 9: Create Seed Script** (AC: 2)
  - [ ] Create `src/lib/db/seed.ts` with seed data
  - [ ] Add `db:seed` script to package.json
  - [ ] Insert user: mgerasolo, matt@gerasolo.com, Matt
  - [ ] Run seed script and verify data

- [ ] **Task 10: Integration Test** (AC: 1, 2, 3, 4, 5)
  - [ ] Create integration test that verifies all tables exist
  - [ ] Test foreign key constraints work correctly
  - [ ] Test seed data is present
  - [ ] Test pgvector column type works (create test table with vector)

---

## Dev Notes

### Architecture Compliance

**Source:** [docs/planning-artifacts/architecture.md#4.5-database-architecture]

| Decision | Choice | Version |
|----------|--------|---------|
| Database | PostgreSQL | 16+ |
| Vector Extension | pgvector | 0.8+ |
| ORM | Drizzle ORM | 0.29+ |
| Migrations | Drizzle Kit | latest |

### Drizzle Schema Pattern

Follow the architecture-defined schema pattern:

```typescript
// src/lib/db/schema/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// src/lib/db/schema/projects.ts
import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  description: text('description'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  archivedAt: timestamp('archived_at'),
});
```

### Database Connection

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

### Package.json Scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/lib/db/seed.ts"
  }
}
```

### Previous Story Learnings (Story 0-1)

**From Story 0-1 Implementation:**
- PostgreSQL running on Banner port 5017 (not 5432 - ports 5011-5016 taken by prototypes)
- pgvector v0.8.2 already enabled via `CREATE EXTENSION vector;`
- Database connection URL: `postgresql://thekeep:${DB_PASSWORD}@db:5432/thekeep` (internal)
- Health check at `/api/health` verifies db connectivity
- Existing `src/lib/db.ts` has basic postgres.js client - will need to refactor for Drizzle

**Files from Story 0-1 that may need updates:**
- `src/lib/db.ts` - Refactor to use Drizzle instead of raw postgres.js
- `src/app/api/health/route.ts` - Update to use Drizzle for health check

### Critical Constraints

1. **Use Drizzle ORM** - Not Prisma, not raw SQL. Architecture specifies Drizzle.
2. **UUID primary keys** - All IDs should be UUIDs, not auto-increment integers
3. **Soft delete pattern** - Use `deleted_at` timestamp, not hard deletes
4. **TypeScript strict** - All schema types must be properly typed
5. **Migration files** - Check in migration files to git for reproducibility

### Testing Strategy

- **Unit tests** for schema validation (column types, constraints)
- **Integration tests** for database operations (requires running PostgreSQL)
- Use same Vitest setup from Story 0-1

### References

- [Architecture: Database Architecture](docs/planning-artifacts/architecture.md#45-database-architecture)
- [Architecture: Database Schema](docs/planning-artifacts/architecture.md#database-schema-drizzle)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Story 0.1 Files](docs/implementation-artifacts/stories/0-1-infrastructure-stack-deployment.md)

---

## Definition of Done

- [ ] All 4 tables created (users, projects, files, folders)
- [ ] Seed user exists (mgerasolo)
- [ ] Foreign key relationships verified
- [ ] `npm run db:migrate` works in CI
- [ ] TypeScript types generated
- [ ] Unit and integration tests passing
- [ ] Health check still works after refactor

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Completion Notes

_To be filled after implementation_

### Files Created/Modified

_To be filled after implementation_

### Change Log

_To be filled after implementation_
