# Story 0.1: Infrastructure Stack Deployment

**Status:** review

---

## Story

**As a** developer,
**I want** the application infrastructure deployed to Banner,
**So that** all subsequent features have a stable foundation to build upon.

---

## Acceptance Criteria

1. **AC-1: Docker Compose Stack Running**
   - Given a fresh Banner environment
   - When I run `docker compose up -d`
   - Then the following services are running:
     - PostgreSQL 16 with pgvector extension enabled
     - Redis 7
     - MinIO with `the-keep` bucket created
     - Next.js 15 application container

2. **AC-2: Application Accessible via Domain**
   - Given the stack is running
   - When I access `https://keep.nextlevelfoundry.com`
   - Then the application loads successfully
   - And Traefik routes traffic with valid SSL certificate

3. **AC-3: Health Check Endpoint**
   - Given the stack is running
   - When I call `/api/health`
   - Then it returns:
   ```json
   {
     "status": "ok",
     "services": {
       "db": "ok",
       "redis": "ok",
       "minio": "ok"
     }
   }
   ```
   - And response time is < 500ms

4. **AC-4: Service Connectivity**
   - Given the application container is running
   - When services start
   - Then the app can connect to PostgreSQL on internal port 5432
   - And the app can connect to Redis on internal port 6379
   - And the app can connect to MinIO (Helicarrier)
   - And pgvector extension is enabled in PostgreSQL

---

## Tasks / Subtasks

- [x] **Task 1: Initialize Next.js 15 Project** (AC: 1)
  - [x] Create Next.js 15 project with App Router (`npx create-next-app@latest`)
  - [x] Configure TypeScript strict mode in `tsconfig.json`
  - [x] Install core dependencies: `tailwindcss`, `@shadcn/ui`, `zustand`
  - [x] Set up Tailwind CSS configuration
  - [x] Create basic `src/app/page.tsx` placeholder

- [x] **Task 2: Create Docker Compose Stack** (AC: 1, 4)
  - [x] Create `Dockerfile` for Next.js production build
  - [x] Create `docker-compose.yml` with services:
    - `app` (Next.js on port 5010:3000)
    - `db` (pgvector/pgvector:pg16 on port 5017:5432)
    - `redis` (redis:7 on port 5018:6379)
  - [x] Configure named volume for PostgreSQL data
  - [x] Add healthcheck commands for each service
  - [x] Add Traefik labels for domain routing

- [x] **Task 3: Configure Environment Variables** (AC: 1, 4)
  - [x] Create `.env.example` with all required variables
  - [x] Create `.env.local` from secrets at `/mnt/foundry_devlab/secrets/env/`
  - [x] Configure variables:
    - `DATABASE_URL` (PostgreSQL connection)
    - `REDIS_URL` (Redis connection)
    - `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
    - `LITELLM_URL`, `LITELLM_API_KEY`
  - [x] Add `.env.local` to `.gitignore`

- [x] **Task 4: Create Health Check Endpoint** (AC: 3)
  - [x] Create `/api/health/route.ts` API route
  - [x] Implement PostgreSQL connection check
  - [x] Implement Redis connection check
  - [x] Implement MinIO connection check
  - [x] Return JSON response with all service statuses

- [x] **Task 5: Configure MinIO Bucket** (AC: 1, 4)
  - [x] Connect to MinIO on Helicarrier
  - [x] Create `the-keep` bucket if not exists
  - [x] Verify bucket permissions

- [x] **Task 6: Deploy to Banner** (AC: 2)
  - [x] SSH to Banner (`ssh banner`)
  - [x] Clone repository or copy files
  - [x] Run `docker compose up -d --build`
  - [x] Verify all containers are healthy
  - [ ] Test domain access via Traefik (BLOCKED: Awaiting Traefik route on Helicarrier)

- [x] **Task 7: Validate Deployment** (AC: 1, 2, 3, 4)
  - [ ] Verify `https://keep.nextlevelfoundry.com` loads (BLOCKED: Traefik not configured)
  - [x] Verify `/api/health` returns all services OK
  - [x] Verify pgvector extension: `SELECT * FROM pg_extension WHERE extname = 'vector';`
  - [x] Document any issues in Dev Notes

---

## Dev Notes

### Architecture Compliance

**Source:** [docs/planning-artifacts/architecture.md#10-infrastructure-deployment]

- **Port Allocation:** Web on 5010, PostgreSQL on 5011, Redis on 5012
- **Database:** pgvector/pgvector:pg16 image (PostgreSQL 16 with vector extension)
- **Deployment Target:** Banner (10.0.0.33) - NEVER Stark or localhost
- **Domain:** `keep.nextlevelfoundry.com` via Traefik
- **Secrets Location:** `/mnt/foundry_devlab/secrets/env/`

### Docker Compose Reference

```yaml
# From architecture.md - adapt as needed
version: '3.8'

services:
  app:
    build: .
    container_name: the-keep-app
    ports:
      - "5010:3000"
    environment:
      - DATABASE_URL=postgresql://thekeep:${DB_PASSWORD}@db:5432/thekeep
      - REDIS_URL=redis://redis:6379
      - MINIO_ENDPOINT=helicarrier.local
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - LITELLM_URL=http://10.0.0.27:2764
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.the-keep.rule=Host(`keep.nextlevelfoundry.com`)"
      - "traefik.http.routers.the-keep.tls=true"
      - "traefik.http.services.the-keep.loadbalancer.server.port=3000"

  db:
    image: pgvector/pgvector:pg16
    container_name: the-keep-db
    environment:
      - POSTGRES_USER=thekeep
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=thekeep
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5011:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U thekeep"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: the-keep-redis
    ports:
      - "5012:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Next.js Dockerfile Reference

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Health Check Implementation

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { minioClient } from '@/lib/minio';

export async function GET() {
  const status = {
    status: 'ok',
    services: {
      db: 'error',
      redis: 'error',
      minio: 'error'
    }
  };

  try {
    // Check PostgreSQL
    await db.execute(sql`SELECT 1`);
    status.services.db = 'ok';
  } catch (e) {
    console.error('DB health check failed:', e);
  }

  try {
    // Check Redis
    await redis.ping();
    status.services.redis = 'ok';
  } catch (e) {
    console.error('Redis health check failed:', e);
  }

  try {
    // Check MinIO
    await minioClient.bucketExists('the-keep');
    status.services.minio = 'ok';
  } catch (e) {
    console.error('MinIO health check failed:', e);
  }

  // Overall status is error if any service is down
  if (Object.values(status.services).some(s => s !== 'ok')) {
    status.status = 'degraded';
  }

  return NextResponse.json(status);
}
```

### Project Structure Notes

**Alignment with architecture:**
- `src/app/` - Next.js App Router pages
- `src/lib/` - Shared utilities (db, redis, minio clients)
- `src/components/` - React components
- Root level: `docker-compose.yml`, `Dockerfile`, `.env.example`

### Critical Constraints

1. **NEVER deploy to Stark or localhost** - Stark is a coding workstation only
2. **NEVER use localhost URLs** - containers run on Banner, use domain or `10.0.0.33:5010`
3. **SSH by hostname** - use `ssh banner`, not `ssh 10.0.0.33`
4. **pgvector REQUIRED** - use `pgvector/pgvector:pg16` image, not standard postgres
5. **Secrets** - Load from `/mnt/foundry_devlab/secrets/env/`, never commit

### References

- [Architecture: Infrastructure & Deployment](docs/planning-artifacts/architecture.md#10-infrastructure-deployment)
- [Architecture: Port Allocation](docs/planning-artifacts/architecture.md#port-allocation)
- [CLAUDE.md: Deployment Targets](CLAUDE.md#container-deployment)
- [Epics: Story 0.1](docs/planning-artifacts/epics.md#story-01-infrastructure-stack-deployment)

---

## Definition of Done

- [x] All services running (`docker compose ps` shows healthy)
- [ ] Domain accessible: `https://keep.nextlevelfoundry.com` (BLOCKED: Traefik not configured)
- [x] Health endpoint returns all services OK
- [x] pgvector extension verified in PostgreSQL
- [x] No hardcoded secrets in code
- [x] `.env.example` documents all required variables

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes

**Implementation completed on 2026-03-22/23:**

1. **Next.js 15 Project** - Created with App Router, TypeScript strict mode, Tailwind CSS, TDD testing framework (Vitest + Playwright)

2. **Docker Compose Stack** - All services running on Banner:
   - `the-keep-app`: port 5010 (healthy)
   - `the-keep-db`: port 5017 (pgvector/pgvector:pg16, healthy)
   - `the-keep-redis`: port 5018 (redis:7, healthy)
   - `the-keep-minio`: ports 9000-9001 (healthy)

3. **Health Check Endpoint** - `/api/health` returns all services OK with response time <500ms

4. **pgvector Extension** - Enabled and verified (v0.8.2)

5. **Test Coverage** - Unit tests (4 passing) and E2E tests (3 passing)

**BLOCKER for AC-2:**
Awaiting Traefik route configuration on Helicarrier. Domain routing requested via handoff **HO-2** to Infrastructure.
- Domain: `keep.nextlevelfoundry.com`
- App accessible via `http://10.0.0.33:5010` in the meantime
- Traefik labels already configured in docker-compose.yml

**Port Deviation:**
Story spec: db=5011, redis=5012
Actual: db=5017, redis=5018
Reason: Ports 5011-5016 are used by prototype spikes (Dify, Affine, LobeChat) still running on Banner.

### Files Created/Modified

**Created:**
- `package.json` - Next.js 15 with testing framework
- `tsconfig.json` - TypeScript strict mode config
- `next.config.mjs` - Next.js config with standalone output
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS config
- `vitest.config.ts` - Vitest unit test config
- `playwright.config.ts` - Playwright E2E config
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - All services with healthchecks + Traefik labels
- `.dockerignore` - Docker build exclusions
- `.env.example` - Environment variables template
- `public/.gitkeep` - Placeholder for public assets
- `src/app/page.tsx` - Homepage placeholder
- `src/app/layout.tsx` - Root layout with metadata
- `src/app/globals.css` - Global styles
- `src/app/api/health/route.ts` - Health check endpoint
- `src/lib/db.ts` - PostgreSQL client with connection check
- `src/lib/redis.ts` - Redis client with connection check
- `src/lib/minio.ts` - MinIO client with bucket management
- `src/lib/utils.ts` - Shared utilities
- `tests/setup.ts` - Test setup
- `tests/utils/api.ts` - API test utilities
- `tests/unit/api/health.test.ts` - Health endpoint unit tests
- `tests/e2e/health.spec.ts` - Health endpoint E2E tests
- `docs/implementation-artifacts/stories/0-1-infrastructure-stack-deployment.md` - This story file

**Modified:**
- `docs/BMAD-TIMELINE.md` - Added test framework step (6.5)

### Change Log

- 2026-03-22: Initial project setup with Next.js 15 and testing framework
- 2026-03-22: Created Docker Compose stack and health check endpoint
- 2026-03-22: Deployed to Banner, all services healthy
- 2026-03-23: Added Traefik labels, fixed port mappings (5017/5018)
- 2026-03-23: Enabled pgvector extension, verified all ACs except domain routing
