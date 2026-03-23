/**
 * Database Seed Script
 * Seeds initial data for The Keep development
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users } from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('Seeding database...');

  // Seed user per AC-2 requirements
  const seedUser = {
    username: 'mgerasolo',
    email: 'matt@gerasolo.com',
    name: 'Matt',
  };

  try {
    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, seedUser.username))
      .limit(1);

    if (existing.length > 0) {
      console.log('Seed user already exists:', existing[0].username);
    } else {
      const [inserted] = await db.insert(users).values(seedUser).returning();
      console.log('Created seed user:', inserted.username, '(id:', inserted.id + ')');
    }

    // Verify seed data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, seedUser.username));

    console.log('Verified seed user:', {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    });

  } catch (error) {
    console.error('Seeding failed:', error);
    await client.end();
    process.exit(1);
  }

  await client.end();
  console.log('Seeding complete!');
}

seed();
