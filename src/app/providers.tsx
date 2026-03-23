'use client';

/**
 * Client-side Providers
 * Wraps the app with necessary context providers
 */

import { type ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc/react';
import { UserProvider } from '@/lib/auth/context';
import type { User } from '@/lib/db/schema';

interface ProvidersProps {
  children: ReactNode;
  user: User | null;
}

export function Providers({ children, user }: ProvidersProps) {
  return (
    <TRPCProvider>
      <UserProvider user={user}>{children}</UserProvider>
    </TRPCProvider>
  );
}
