/**
 * Custom render utilities for testing React components
 * Wraps components with necessary providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider } from '@/lib/auth/context';

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Mock user for testing - matches seeded user
 */
export const mockUser = {
  id: 'e08cc546-fa29-4559-93f9-ceb658f66668',
  username: 'mgerasolo',
  email: 'matt@gerasolo.com',
  name: 'Matt',
  createdAt: new Date('2026-03-22'),
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: typeof mockUser | null;
}

/**
 * All providers needed for testing
 */
function AllProviders({
  children,
  user,
}: WrapperProps & { user?: typeof mockUser | null }) {
  return <UserProvider initialUser={user ?? null}>{children}</UserProvider>;
}

/**
 * Custom render function that wraps component with all providers
 */
function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { user = mockUser, ...renderOptions } = options;

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => <AllProviders user={user}>{children}</AllProviders>,
      ...renderOptions,
    }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };
