/**
 * tRPC Server Configuration
 * Sets up context, router, and procedure helpers
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/db/schema';

/**
 * Context passed to every tRPC procedure
 */
export interface Context {
  user: User | null;
}

/**
 * Create tRPC context for each request
 */
export const createTRPCContext = async (): Promise<Context> => {
  const user = await getCurrentUser();
  return { user };
};

/**
 * Initialize tRPC with context and transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a router
 */
export const router = t.router;

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Public procedure - no auth required
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authenticated user
 * Throws UNAUTHORIZED if no user in context
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      // Narrow the type to non-null user
      user: ctx.user,
    },
  });
});

/**
 * Middleware for logging (optional, can be added to procedures)
 */
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  if (result.ok) {
    console.log(`[tRPC] ${type} ${path} - ${duration}ms`);
  } else {
    console.error(`[tRPC] ${type} ${path} - ${duration}ms - ERROR`);
  }

  return result;
});
