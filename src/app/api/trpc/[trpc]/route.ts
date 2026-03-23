/**
 * tRPC HTTP Handler
 * Handles all /api/trpc/* requests with structured logging
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers';
import { createTRPCContext } from '@/server/trpc';
import { createRequestLogger, logRequestComplete } from '@/lib/logger';

const handler = async (req: Request) => {
  const start = Date.now();
  const traceId = req.headers.get('x-trace-id') ?? crypto.randomUUID();
  const url = new URL(req.url);

  const requestLogger = createRequestLogger({
    method: req.method,
    path: url.pathname,
    traceId,
    userAgent: req.headers.get('user-agent') ?? undefined,
  });

  requestLogger.debug('tRPC request started');

  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: createTRPCContext,
      onError: ({ path, error, ctx }) => {
        requestLogger.error(
          {
            procedure: path,
            userId: ctx?.user?.id,
            err: {
              code: error.code,
              message: error.message,
              stack: error.stack,
            },
          },
          `tRPC procedure failed: ${path ?? '<no-path>'}`
        );
      },
    });

    const duration = Date.now() - start;
    logRequestComplete(requestLogger, response.status, duration);

    // Add trace ID to response
    const headers = new Headers(response.headers);
    headers.set('X-Trace-ID', traceId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    const duration = Date.now() - start;
    logRequestComplete(
      requestLogger,
      500,
      duration,
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};

export { handler as GET, handler as POST };
