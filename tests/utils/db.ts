/**
 * Database Testing Utilities
 * Mocks and helpers for testing database operations
 */

import { vi } from 'vitest';

/**
 * Mock database client
 * Use this to mock database operations in unit tests
 */
export const mockDb = {
  execute: vi.fn(),
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  transaction: vi.fn(),
};

/**
 * Reset all database mocks
 */
export function resetDbMocks() {
  Object.values(mockDb).forEach((mock) => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
}

/**
 * Create a mock select chain
 * Simulates drizzle-orm's chainable select API
 */
export function createMockSelectChain<T>(data: T[]) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue(data),
    then: vi.fn().mockImplementation((resolve) => resolve(data)),
  };
  return chain;
}

/**
 * Create a mock insert chain
 */
export function createMockInsertChain<T>(data: T) {
  const chain = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([data]),
    then: vi.fn().mockImplementation((resolve) => resolve([data])),
  };
  return chain;
}

/**
 * Test fixture: Sample user data
 */
export const fixtures = {
  user: {
    id: 1,
    username: 'mgerasolo',
    email: 'matt@gerasolo.com',
    name: 'Matt',
    createdAt: new Date('2026-03-22'),
  },
  project: {
    id: 1,
    userId: 1,
    name: 'Test Project',
    icon: 'folder',
    description: 'A test project',
    settings: {},
    createdAt: new Date('2026-03-22'),
    archivedAt: null,
  },
};
