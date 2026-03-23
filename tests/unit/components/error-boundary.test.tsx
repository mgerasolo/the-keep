/**
 * Error Boundary Component Tests
 * Tests for Story 0-5: Toast & Error Handling Framework
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from '@/components/ui/error-boundary';

// Suppress console.error during tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// Component that throws an error
function ThrowingComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

// Component that works fine
function WorkingComponent() {
  return <div>Working content</div>;
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Working content')).toBeDefined();
  });

  it('should render default fallback on error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText(/unexpected error/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeDefined();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeDefined();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should log error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('should have refresh button that reloads the page', () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});

describe('withErrorBoundary HOC', () => {
  it('should wrap component with error boundary', () => {
    const WrappedWorking = withErrorBoundary(WorkingComponent);

    render(<WrappedWorking />);

    expect(screen.getByText('Working content')).toBeDefined();
  });

  it('should catch errors in wrapped component', () => {
    const WrappedThrowing = withErrorBoundary(ThrowingComponent);

    render(<WrappedThrowing />);

    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  it('should use custom fallback in HOC', () => {
    const customFallback = <div>HOC custom fallback</div>;
    const WrappedThrowing = withErrorBoundary(ThrowingComponent, customFallback);

    render(<WrappedThrowing />);

    expect(screen.getByText('HOC custom fallback')).toBeDefined();
  });

  it('should pass props to wrapped component', () => {
    function PropsComponent({ message }: { message: string }) {
      return <div>{message}</div>;
    }

    const WrappedProps = withErrorBoundary(PropsComponent);

    render(<WrappedProps message="Hello from props" />);

    expect(screen.getByText('Hello from props')).toBeDefined();
  });
});

describe('DefaultErrorFallback', () => {
  it('should show error details in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Should have error details section
    expect(screen.getByText('Error details')).toBeDefined();
    expect(screen.getByText(/Test error message/)).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('should hide error details in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Should NOT have error details in production
    expect(screen.queryByText('Error details')).toBeNull();

    process.env.NODE_ENV = originalEnv;
  });
});
