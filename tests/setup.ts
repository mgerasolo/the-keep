/**
 * Vitest Global Setup
 * This file runs before each test file
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for testing (only if not already set)
// Integration tests set real env vars; don't override them
beforeAll(() => {
  if (!process.env.DATABASE_URL) {
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
  }
  if (!process.env.REDIS_URL) {
    vi.stubEnv('REDIS_URL', 'redis://localhost:6379');
  }
  if (!process.env.MINIO_ENDPOINT) {
    vi.stubEnv('MINIO_ENDPOINT', 'localhost');
    vi.stubEnv('MINIO_ACCESS_KEY', 'test');
    vi.stubEnv('MINIO_SECRET_KEY', 'test');
  }
  if (!process.env.LITELLM_URL) {
    vi.stubEnv('LITELLM_URL', 'http://localhost:4000');
  }
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock ResizeObserver (used by many UI libraries)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
