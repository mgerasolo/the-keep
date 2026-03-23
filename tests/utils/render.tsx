/**
 * Custom render utilities for testing React components
 * Wraps components with necessary providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import providers here when created
// import { QueryClientProvider } from '@tanstack/react-query';

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * All providers needed for testing
 */
function AllProviders({ children }: WrapperProps) {
  // Add providers here as they are created
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: { retry: false },
  //   },
  // });

  return (
    // <QueryClientProvider client={queryClient}>
    <>{children}</>
    // </QueryClientProvider>
  );
}

/**
 * Custom render function that wraps component with all providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };
