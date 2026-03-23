'use client';

/**
 * Loading Spinner Component
 * Shows an animated spinner while content is loading
 */

import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

/**
 * Spinning loader indicator
 */
export function Spinner({ className, size = 'md', label }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label ?? 'Loading'}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-accent border-t-transparent',
          sizeClasses[size]
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

/**
 * Full page loading spinner
 */
export function PageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" label={label} />
        <p className="mt-4 text-foreground-secondary">{label}</p>
      </div>
    </div>
  );
}

/**
 * Inline loading indicator with text
 */
export function LoadingIndicator({
  className,
  text = 'Loading...',
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 text-foreground-secondary', className)}>
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

/**
 * Button loading state
 */
export function ButtonSpinner({ className }: { className?: string }) {
  return <Spinner size="sm" className={cn('mr-2', className)} />;
}
