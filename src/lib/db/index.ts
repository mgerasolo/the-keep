/**
 * Database Client
 * PostgreSQL connection using drizzle-orm
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

// Get connection string from environment
const connectionString = process.env.DATABASE_URL ?? 'postgresql://thekeep:password@localhost:5432/thekeep';

// Create postgres.js client for queries
// Using max 1 connection for serverless compatibility
const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle client with schema
export const db = drizzle(queryClient, { schema });

// Re-export schema for convenience
export { schema };

// Export raw client for health checks and raw queries
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
