'use client';

/**
 * tRPC React Integration
 * Provides React Query hooks for tRPC procedures
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState, type ReactNode } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '@/server/routers';
import { toast } from '@/components/ui/toaster';

/**
 * tRPC React hooks
 */
export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Extract user-friendly error message from tRPC error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Parse tRPC error structure
    if ('message' in error) {
      // tRPC errors have a message property
      const message = error.message;
      // Don't show technical error codes to users
      if (message.includes('UNAUTHORIZED')) {
        return 'You need to be logged in to do that';
      }
      if (message.includes('NOT_FOUND')) {
        return 'The requested item could not be found';
      }
      if (message.includes('FORBIDDEN')) {
        return "You don't have permission to do that";
      }
      if (message.includes('BAD_REQUEST')) {
        return 'Invalid request. Please check your input.';
      }
      return message;
    }
  }
  return 'An unexpected error occurred';
}

/**
 * Provider component for tRPC and React Query
 */
export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 1 minute
            staleTime: 60 * 1000,
            // Retry once on failure
            retry: 1,
            // Refetch on window focus
            refetchOnWindowFocus: true,
          },
          mutations: {
            // Retry once on failure
            retry: 1,
            // Auto-show error toast on mutation failure
            onError: (error) => {
              toast.error(getErrorMessage(error));
            },
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          // Include credentials for session cookie
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
