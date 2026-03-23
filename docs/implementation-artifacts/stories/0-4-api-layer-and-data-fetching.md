# Story 0.4: API Layer & Data Fetching

**Status:** in-progress

---

## Story

**As a** developer,
**I want** a consistent API pattern with data fetching hooks,
**So that** all features follow the same patterns for reliability and maintainability.

---

## Acceptance Criteria

1. **AC-1: tRPC Routers with Type Safety**
   - Given I need to create an API endpoint
   - When I define a tRPC router
   - Then I have end-to-end TypeScript type safety from server to client

2. **AC-2: React Query Integration**
   - Given I need to fetch data
   - When I use the API layer
   - Then React Query handles caching, refetching, and loading states

3. **AC-3: Standardized Error Format**
   - Given an API error occurs
   - When the error is returned
   - Then it follows format: `{ error: { code, message, action } }`

4. **AC-4: User Context in Requests**
   - Given I make an API request
   - When the request is processed
   - Then it automatically includes user context from session

---

## Tasks / Subtasks

- [ ] **Task 1: Install tRPC and React Query** (AC: 1, 2)
  - [ ] Install @trpc/server, @trpc/client, @trpc/react-query, @trpc/next
  - [ ] Install @tanstack/react-query (already installed)

- [ ] **Task 2: Create tRPC Server Configuration** (AC: 1, 4)
  - [ ] Create `src/server/trpc.ts` with context and router base
  - [ ] Create context that includes current user
  - [ ] Set up procedure helpers (publicProcedure, protectedProcedure)

- [ ] **Task 3: Create tRPC HTTP Handler** (AC: 1)
  - [ ] Create `src/app/api/trpc/[trpc]/route.ts`
  - [ ] Configure for Next.js App Router

- [ ] **Task 4: Create tRPC Client** (AC: 2)
  - [ ] Create `src/lib/trpc/client.ts`
  - [ ] Create `src/lib/trpc/react.tsx` with provider
  - [ ] Set up React Query client

- [ ] **Task 5: Create Error Handling** (AC: 3)
  - [ ] Create standardized TRPCError responses
  - [ ] Create error transformation for client
  - [ ] Define error codes enum

- [ ] **Task 6: Create Example Router** (AC: 1, 2, 4)
  - [ ] Create projects router with CRUD operations
  - [ ] Demonstrate query and mutation patterns
  - [ ] Include user_id filtering

- [ ] **Task 7: Integration with Providers** (AC: 2)
  - [ ] Update layout.tsx with QueryClientProvider
  - [ ] Update layout.tsx with tRPC provider

- [ ] **Task 8: Tests** (AC: 1, 2, 3, 4)
  - [ ] Unit test for tRPC procedures
  - [ ] Test error formatting
  - [ ] E2E test for API calls

---

## Dev Notes

### Architecture Compliance

**Source:** [docs/planning-artifacts/architecture.md]

| Decision | Choice |
|----------|--------|
| API Layer | tRPC v11 |
| Data Fetching | React Query v5 |
| Type Safety | End-to-end TypeScript |

### tRPC Setup Pattern

```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { getCurrentUser } from '@/lib/auth';

export const createTRPCContext = async () => {
  const user = await getCurrentUser();
  return { user };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

### References

- [tRPC v11 Docs](https://trpc.io/docs)
- [React Query v5 Docs](https://tanstack.com/query/latest)

---

## Definition of Done

- [ ] tRPC routers work with full type safety
- [ ] React Query manages caching and loading states
- [ ] Errors follow standardized format
- [ ] All API calls include user context
- [ ] Unit and E2E tests passing
