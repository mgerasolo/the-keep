# Story 0.3: Auth-Ready Architecture

**Status:** in-progress

---

## Story

**As a** developer,
**I want** all requests tied to the seeded user,
**So that** the app works immediately and supports multi-user later.

---

## Acceptance Criteria

1. **AC-1: getCurrentUser() Returns Seeded User**
   - Given MVP is single-user
   - When any API request is made
   - Then `getCurrentUser()` returns the seeded `mgerasolo` user record from database

2. **AC-2: No Login Screen**
   - Given the user navigates to the app
   - When the page loads
   - Then they go directly to the app (no login required)

3. **AC-3: User-Scoped Queries**
   - Given a feature queries data
   - When the query runs
   - Then it filters by `user_id` from the current user

4. **AC-4: Session Cookie**
   - Given a user visits the app
   - When no session exists
   - Then middleware auto-creates session with seeded user's ID
   - And session persists across requests

---

## Tasks / Subtasks

- [ ] **Task 1: Create Session Middleware** (AC: 2, 4)
  - [ ] Create middleware that checks for session cookie
  - [ ] If no session, create one with seeded user ID
  - [ ] Set httpOnly, secure, sameSite cookie

- [ ] **Task 2: Create getCurrentUser Function** (AC: 1)
  - [ ] Create `src/lib/auth/index.ts`
  - [ ] Implement `getCurrentUser()` that reads session and queries DB
  - [ ] Return full user object with id, username, email, name

- [ ] **Task 3: Create User Context Provider** (AC: 1, 3)
  - [ ] Create React context for current user
  - [ ] Wrap app in provider
  - [ ] Create `useCurrentUser()` hook

- [ ] **Task 4: Create Server-Side Auth Utilities** (AC: 3)
  - [ ] Create `getServerUser()` for server components
  - [ ] Create `requireUser()` that throws if no session
  - [ ] Add user_id helper for query building

- [ ] **Task 5: Integration Test** (AC: 1, 2, 3, 4)
  - [ ] Test middleware creates session
  - [ ] Test getCurrentUser returns seeded user
  - [ ] Test session persists across requests
  - [ ] E2E test: app loads without login

---

## Dev Notes

### Architecture Compliance

**Source:** [docs/planning-artifacts/architecture.md]

| Decision | Choice |
|----------|--------|
| Session Storage | Cookie-based with httpOnly |
| Auth Pattern | Middleware-first, swap for Authentik later |
| User Query | Drizzle ORM from `users` table |

### Implementation Pattern

```typescript
// src/lib/auth/index.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SEEDED_USER_ID = 'e08cc546-fa29-4559-93f9-ceb658f66668'; // From seed

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  // MVP: Always return seeded user
  // Later: Parse session, validate token, return actual user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, SEEDED_USER_ID));

  return user;
}
```

### Middleware Pattern

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check for existing session
  const session = request.cookies.get('session');

  if (!session) {
    // Create session with seeded user
    response.cookies.set('session', JSON.stringify({
      userId: 'e08cc546-fa29-4559-93f9-ceb658f66668',
      createdAt: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Future Auth Integration

When Authentik is added:
1. Middleware validates JWT from Authentik
2. Session contains Authentik user ID
3. `getCurrentUser()` queries by session userId (not hardcoded)
4. Zero downstream code changes needed

### References

- [Architecture: Authentication](docs/planning-artifacts/architecture.md#authentication)
- [Story 0.2: Database Schema](docs/implementation-artifacts/stories/0-2-database-schema-and-migrations.md)

---

## Definition of Done

- [ ] `getCurrentUser()` returns seeded user record
- [ ] No login screen - direct to app
- [ ] Session cookie auto-created on first visit
- [ ] Unit tests for auth utilities
- [ ] E2E test verifying app loads without auth

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes

_To be filled after implementation_

### Files Created/Modified

_To be filled after implementation_

### Change Log

_To be filled after implementation_
