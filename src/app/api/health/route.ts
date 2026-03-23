/**
 * Health Check Endpoint
 * Returns status of all connected services
 *
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';
import { checkRedisConnection } from '@/lib/redis';
import { checkMinioConnection } from '@/lib/minio';
import { createLogger } from '@/lib/logger';

const logger = createLogger({ component: 'health' });

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: {
    db: 'ok' | 'error';
    redis: 'ok' | 'error';
    minio: 'ok' | 'error';
  };
  version: string;
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const startTime = Date.now();

  // Check all services in parallel
  const [dbOk, redisOk, minioOk] = await Promise.all([
    checkDbConnection(),
    checkRedisConnection(),
    checkMinioConnection(),
  ]);

  const services = {
    db: dbOk ? ('ok' as const) : ('error' as const),
    redis: redisOk ? ('ok' as const) : ('error' as const),
    minio: minioOk ? ('ok' as const) : ('error' as const),
  };

  // Determine overall status
  const allOk = dbOk && redisOk && minioOk;
  const allDown = !dbOk && !redisOk && !minioOk;

  let status: HealthStatus['status'];
  if (allOk) {
    status = 'ok';
  } else if (allDown) {
    status = 'error';
  } else {
    status = 'degraded';
  }

  const response: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    services,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  };

  // Set appropriate status code
  const statusCode = status === 'ok' ? 200 : status === 'degraded' ? 200 : 503;

  // Log health check (for observability)
  const duration = Date.now() - startTime;
  logger.info({ duration, status, services }, 'Health check completed');

  return NextResponse.json(response, { status: statusCode });
}
