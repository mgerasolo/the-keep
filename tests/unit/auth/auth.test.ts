/**
 * Auth Utilities Tests
 * Tests for Story 0-3: Auth-Ready Architecture
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSessionData,
  serializeSession,
  parseSession,
  SEEDED_USER_ID,
} from '@/lib/auth';

describe('Auth Utilities', () => {
  describe('SEEDED_USER_ID', () => {
    it('should be a valid UUID', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(SEEDED_USER_ID).toMatch(uuidRegex);
    });

    it('should match the database seeded user', () => {
      // This is the actual seeded user ID from the database
      expect(SEEDED_USER_ID).toBe('e08cc546-fa29-4559-93f9-ceb658f66668');
    });
  });

  describe('createSessionData', () => {
    it('should create session with userId and timestamp', () => {
      const before = Date.now();
      const session = createSessionData('test-user-id');
      const after = Date.now();

      expect(session.userId).toBe('test-user-id');
      expect(session.createdAt).toBeGreaterThanOrEqual(before);
      expect(session.createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe('serializeSession', () => {
    it('should serialize session to JSON string', () => {
      const session = { userId: 'test-123', createdAt: 1234567890 };
      const serialized = serializeSession(session);

      expect(serialized).toBe('{"userId":"test-123","createdAt":1234567890}');
    });
  });

  describe('parseSession', () => {
    it('should parse valid session JSON', () => {
      const json = '{"userId":"test-123","createdAt":1234567890}';
      const session = parseSession(json);

      expect(session).toEqual({ userId: 'test-123', createdAt: 1234567890 });
    });

    it('should return null for invalid JSON', () => {
      const session = parseSession('not-valid-json');

      expect(session).toBeNull();
    });

    it('should return null for empty string', () => {
      const session = parseSession('');

      expect(session).toBeNull();
    });
  });
});

describe('Session Flow', () => {
  it('should create and parse session round-trip', () => {
    const original = createSessionData(SEEDED_USER_ID);
    const serialized = serializeSession(original);
    const parsed = parseSession(serialized);

    expect(parsed).toEqual(original);
  });
});
