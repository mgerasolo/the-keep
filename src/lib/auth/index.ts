/**
 * Authentication Utilities
 * MVP: Single-user mode with seeded user
 * Future: Swap middleware for Authentik SSO
 */

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, type User } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Seeded user ID from database
const SEEDED_USER_ID = 'e08cc546-fa29-4559-93f9-ceb658f66668';

export interface Session {
  userId: string;
  createdAt: number;
}

/**
 * Get the current user from session
 * MVP: Always returns seeded user
 * Future: Returns user based on Authentik session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    // Parse session to get userId
    const session: Session = JSON.parse(sessionCookie.value);

    // MVP: Query user from database
    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);

    return user ?? null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get current user or throw if not authenticated
 * Use in protected routes/actions
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Get the seeded user directly (for middleware/server contexts)
 * MVP: Returns the single seeded user
 */
export async function getSeededUser(): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, SEEDED_USER_ID)).limit(1);

    return user ?? null;
  } catch (error) {
    console.error('Error getting seeded user:', error);
    return null;
  }
}

/**
 * Create session data for cookie
 */
export function createSessionData(userId: string): Session {
  return {
    userId,
    createdAt: Date.now(),
  };
}

/**
 * Serialize session for cookie storage
 */
export function serializeSession(session: Session): string {
  return JSON.stringify(session);
}

/**
 * Parse session from cookie string
 */
export function parseSession(cookieValue: string): Session | null {
  try {
    return JSON.parse(cookieValue);
  } catch {
    return null;
  }
}

// Export constants for use elsewhere
export { SEEDED_USER_ID };
