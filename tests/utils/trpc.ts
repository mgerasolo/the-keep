/**
 * tRPC Testing Utilities
 * Helpers for testing tRPC procedures
 */

import { createCaller } from '@/server/routers';
import type { Context } from '@/server/trpc';
import { fixtures } from './db';

/**
 * Create a tRPC caller with authenticated context
 */
export function createAuthenticatedCaller(user = fixtures.user) {
  const ctx: Context = { user };
  return createCaller(ctx);
}

/**
 * Create a tRPC caller without authentication
 */
export function createUnauthenticatedCaller() {
  const ctx: Context = { user: null };
  return createCaller(ctx);
}

/**
 * Create a mock context for testing
 */
export function createMockContext(overrides: Partial<Context> = {}): Context {
  return {
    user: fixtures.user,
    ...overrides,
  };
}

/**
 * Expect a tRPC procedure to throw UNAUTHORIZED
 */
export async function expectUnauthorized(fn: () => Promise<unknown>) {
  await expect(fn()).rejects.toThrow(/logged in|UNAUTHORIZED/i);
}

/**
 * Expect a tRPC procedure to throw NOT_FOUND
 */
export async function expectNotFound(fn: () => Promise<unknown>) {
  await expect(fn()).rejects.toThrow(/not found|NOT_FOUND/i);
}

/**
 * Expect a tRPC procedure to throw BAD_REQUEST
 */
export async function expectBadRequest(fn: () => Promise<unknown>) {
  await expect(fn()).rejects.toThrow(/invalid|BAD_REQUEST/i);
}
