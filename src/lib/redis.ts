/**
 * Redis Client
 * Connection using ioredis
 */

import Redis from 'ioredis';
import { env } from './utils';

// Create Redis connection
const redisUrl = env('REDIS_URL', 'redis://localhost:6379');

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Handle connection errors
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

/**
 * Check Redis connectivity
 * @returns true if connected, false otherwise
 */
export async function checkRedisConnection(): Promise<boolean> {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}
