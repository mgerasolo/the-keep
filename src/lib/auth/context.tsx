'use client';

/**
 * User Context Provider
 * Provides current user data to client components
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@/lib/db/schema';

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  user: User | null;
}

/**
 * Provider component - wrap in layout with server-fetched user
 */
export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={{ user, isLoading: false }}>{children}</UserContext.Provider>;
}

/**
 * Hook to access current user in client components
 */
export function useCurrentUser(): UserContextValue {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  return context;
}

/**
 * Hook that throws if no user (for protected components)
 */
export function useRequireUser(): User {
  const { user } = useCurrentUser();

  if (!user) {
    throw new Error('User required but not authenticated');
  }

  return user;
}
