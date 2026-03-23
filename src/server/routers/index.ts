/**
 * Root Router
 * Combines all API routers
 */

import { router, publicProcedure, createCallerFactory } from '../trpc';
import { projectsRouter } from './projects';
import { filesRouter } from './files';

/**
 * Main app router
 * All sub-routers are merged here
 */
export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Feature routers
  projects: projectsRouter,
  files: filesRouter,
});

/**
 * Export type for client
 */
export type AppRouter = typeof appRouter;

/**
 * Create server-side caller
 */
export const createCaller = createCallerFactory(appRouter);
