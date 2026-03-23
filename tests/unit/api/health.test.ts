/**
 * Health Check API Tests
 * Unit tests for /api/health endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, HealthStatus } from '@/app/api/health/route';

// Mock the service connection checkers
vi.mock('@/lib/db', () => ({
  checkDbConnection: vi.fn(),
}));

vi.mock('@/lib/redis', () => ({
  checkRedisConnection: vi.fn(),
}));

vi.mock('@/lib/minio', () => ({
  checkMinioConnection: vi.fn(),
}));

import { checkDbConnection } from '@/lib/db';
import { checkRedisConnection } from '@/lib/redis';
import { checkMinioConnection } from '@/lib/minio';

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ok status when all services are healthy', async () => {
    // Arrange
    vi.mocked(checkDbConnection).mockResolvedValue(true);
    vi.mocked(checkRedisConnection).mockResolvedValue(true);
    vi.mocked(checkMinioConnection).mockResolvedValue(true);

    // Act
    const response = await GET();
    const body: HealthStatus = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.services.db).toBe('ok');
    expect(body.services.redis).toBe('ok');
    expect(body.services.minio).toBe('ok');
    expect(body.timestamp).toBeDefined();
    expect(body.version).toBeDefined();
  });

  it('returns degraded status when some services are down', async () => {
    // Arrange
    vi.mocked(checkDbConnection).mockResolvedValue(true);
    vi.mocked(checkRedisConnection).mockResolvedValue(false);
    vi.mocked(checkMinioConnection).mockResolvedValue(true);

    // Act
    const response = await GET();
    const body: HealthStatus = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.status).toBe('degraded');
    expect(body.services.db).toBe('ok');
    expect(body.services.redis).toBe('error');
    expect(body.services.minio).toBe('ok');
  });

  it('returns error status when all services are down', async () => {
    // Arrange
    vi.mocked(checkDbConnection).mockResolvedValue(false);
    vi.mocked(checkRedisConnection).mockResolvedValue(false);
    vi.mocked(checkMinioConnection).mockResolvedValue(false);

    // Act
    const response = await GET();
    const body: HealthStatus = await response.json();

    // Assert
    expect(response.status).toBe(503);
    expect(body.status).toBe('error');
    expect(body.services.db).toBe('error');
    expect(body.services.redis).toBe('error');
    expect(body.services.minio).toBe('error');
  });

  it('checks all services in parallel', async () => {
    // Arrange
    const dbPromise = vi.mocked(checkDbConnection).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 50))
    );
    const redisPromise = vi.mocked(checkRedisConnection).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 50))
    );
    const minioPromise = vi.mocked(checkMinioConnection).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 50))
    );

    // Act
    const startTime = Date.now();
    await GET();
    const duration = Date.now() - startTime;

    // Assert - if parallel, should be ~50ms, not ~150ms
    expect(duration).toBeLessThan(100);
    expect(dbPromise).toHaveBeenCalled();
    expect(redisPromise).toHaveBeenCalled();
    expect(minioPromise).toHaveBeenCalled();
  });
});
