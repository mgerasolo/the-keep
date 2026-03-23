'use client';

/**
 * Error Boundary Component
 * Catches unhandled errors and displays a fallback UI
 */

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-4 text-6xl">😵</div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-foreground-secondary mb-6">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-6">
            <summary className="cursor-pointer text-sm text-foreground-secondary hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 p-4 bg-surface-hover rounded text-xs overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

/**
 * Hook-friendly error boundary wrapper
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
