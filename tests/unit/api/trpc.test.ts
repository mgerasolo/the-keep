/**
 * tRPC API Tests
 * Tests for Story 0-4: API Layer & Data Fetching
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCaller } from '@/server/routers';
import type { Context } from '@/server/trpc';

// Mock user for testing
const mockUser = {
  id: 'e08cc546-fa29-4559-93f9-ceb658f66668',
  username: 'mgerasolo',
  email: 'matt@gerasolo.com',
  name: 'Matt',
  createdAt: new Date(),
};

describe('tRPC API', () => {
  describe('health endpoint', () => {
    it('should return ok status', async () => {
      const ctx: Context = { user: null };
      const caller = createCaller(ctx);

      const result = await caller.health();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('projects router', () => {
    let caller: ReturnType<typeof createCaller>;

    beforeEach(() => {
      const ctx: Context = { user: mockUser };
      caller = createCaller(ctx);
    });

    it('should require authentication for list', async () => {
      const unauthCtx: Context = { user: null };
      const unauthCaller = createCaller(unauthCtx);

      await expect(unauthCaller.projects.list()).rejects.toThrow('logged in');
    });

    // Note: Full CRUD tests would require database setup
    // These are structure tests to verify the router compiles correctly
    it('should have list procedure', () => {
      expect(typeof caller.projects.list).toBe('function');
    });

    it('should have get procedure', () => {
      expect(typeof caller.projects.get).toBe('function');
    });

    it('should have create procedure', () => {
      expect(typeof caller.projects.create).toBe('function');
    });

    it('should have update procedure', () => {
      expect(typeof caller.projects.update).toBe('function');
    });

    it('should have archive procedure', () => {
      expect(typeof caller.projects.archive).toBe('function');
    });

    it('should have restore procedure', () => {
      expect(typeof caller.projects.restore).toBe('function');
    });
  });
});
