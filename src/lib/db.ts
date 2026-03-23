/**
 * Database Client
 * PostgreSQL connection using drizzle-orm
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './utils';

// Create the connection
const connectionString = env('DATABASE_URL', 'postgresql://thekeep:password@localhost:5432/thekeep');

// For query purposes
const queryClient = postgres(connectionString);

// Create drizzle client
export const db = drizzle(queryClient);

// Export raw client for health checks
export const pgClient = queryClient;

/**
 * Check database connectivity
 * @returns true if connected, false otherwise
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
