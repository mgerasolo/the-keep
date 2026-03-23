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
 * Uses UUIDs matching the actual database schema
 */
export const fixtures = {
  user: {
    id: 'e08cc546-fa29-4559-93f9-ceb658f66668',
    username: 'mgerasolo',
    email: 'matt@gerasolo.com',
    name: 'Matt',
    createdAt: new Date('2026-03-22'),
  },
  project: {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    userId: 'e08cc546-fa29-4559-93f9-ceb658f66668',
    name: 'Test Project',
    icon: 'folder',
    description: 'A test project',
    settings: {},
    createdAt: new Date('2026-03-22'),
    updatedAt: new Date('2026-03-22'),
    archivedAt: null,
  },
  folder: {
    id: 'f1234567-89ab-cdef-0123-456789abcdef',
    projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    parentId: null,
    name: 'Test Folder',
    path: '/Test Folder',
    createdAt: new Date('2026-03-22'),
    updatedAt: new Date('2026-03-22'),
  },
  file: {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    folderId: 'f1234567-89ab-cdef-0123-456789abcdef',
    name: 'test-file.md',
    path: '/Test Folder/test-file.md',
    mimeType: 'text/markdown',
    sizeBytes: 1024,
    storageKey: 'test-storage-key',
    metadata: {},
    createdAt: new Date('2026-03-22'),
    updatedAt: new Date('2026-03-22'),
    deletedAt: null,
  },
};

/**
 * Generate a random UUID for tests
 */
export function generateTestId(): string {
  return crypto.randomUUID();
}
