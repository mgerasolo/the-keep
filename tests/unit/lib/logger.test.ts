/**
 * Logger Utility Tests
 * Tests for Story 0-6: Logging & Observability
 *
 * Note: Tests the sanitizeBody function directly.
 * Logger functions are tested via integration tests due to pino mock complexity.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeBody } from '@/lib/logger';

describe('Logger Utility', () => {
  describe('sanitizeBody', () => {
    it('should return non-objects as-is', () => {
      expect(sanitizeBody('string')).toBe('string');
      expect(sanitizeBody(123)).toBe(123);
      expect(sanitizeBody(null)).toBe(null);
      expect(sanitizeBody(undefined)).toBe(undefined);
    });

    it('should redact password fields', () => {
      const body = { username: 'test', password: 'secret123' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.username).toBe('test');
      expect(result.password).toBe('[REDACTED]');
    });

    it('should redact token fields', () => {
      const body = { accessToken: 'abc123', refreshToken: 'xyz789' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.accessToken).toBe('[REDACTED]');
      expect(result.refreshToken).toBe('[REDACTED]');
    });

    it('should redact apiKey fields', () => {
      const body = { apiKey: 'key123', api_key: 'key456' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.apiKey).toBe('[REDACTED]');
      expect(result.api_key).toBe('[REDACTED]');
    });

    it('should redact authorization fields', () => {
      const body = { authorization: 'Bearer xyz' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.authorization).toBe('[REDACTED]');
    });

    it('should handle nested objects', () => {
      const body = {
        user: {
          name: 'test',
          credentials: {
            password: 'secret',
          },
        },
      };
      const result = sanitizeBody(body) as Record<string, unknown>;
      const user = result.user as Record<string, unknown>;
      const credentials = user.credentials as Record<string, unknown>;
      expect(user.name).toBe('test');
      expect(credentials.password).toBe('[REDACTED]');
    });

    it('should preserve non-sensitive fields', () => {
      const body = {
        name: 'test',
        email: 'test@example.com',
        data: { value: 123 },
      };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.name).toBe('test');
      expect(result.email).toBe('test@example.com');
      expect((result.data as Record<string, unknown>).value).toBe(123);
    });

    it('should redact session fields', () => {
      const body = { sessionId: 'abc', session: { token: 'xyz' } };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.sessionId).toBe('[REDACTED]');
      expect(result.session).toBe('[REDACTED]');
    });

    it('should redact secret fields', () => {
      const body = { secretKey: 'abc', clientSecret: 'xyz' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.secretKey).toBe('[REDACTED]');
      expect(result.clientSecret).toBe('[REDACTED]');
    });

    it('should redact cookie fields', () => {
      const body = { cookie: 'session=abc' };
      const result = sanitizeBody(body) as Record<string, unknown>;
      expect(result.cookie).toBe('[REDACTED]');
    });
  });
});
