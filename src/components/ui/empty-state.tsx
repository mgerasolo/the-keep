'use client';

/**
 * Empty State Component
 * Shows helpful UI when there's no data to display
 */

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'py-6',
    icon: 'text-3xl mb-2',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'text-5xl mb-4',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'text-6xl mb-6',
    title: 'text-xl',
    description: 'text-base',
  },
};

/**
 * Generic empty state component
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', sizes.container, className)}>
      {icon && <div className={cn('text-foreground-secondary', sizes.icon)}>{icon}</div>}
      <h3 className={cn('font-semibold text-foreground', sizes.title)}>{title}</h3>
      {description && (
        <p className={cn('mt-2 text-foreground-secondary max-w-md', sizes.description)}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Pre-configured empty states for common scenarios
 */

export function EmptyProjects({ onCreateProject }: { onCreateProject?: () => void }) {
  return (
    <EmptyState
      icon="📁"
      title="No projects yet"
      description="Create your first project to start organizing your knowledge."
      action={
        onCreateProject
          ? {
              label: 'Create Project',
              onClick: onCreateProject,
            }
          : undefined
      }
    />
  );
}

export function EmptyFiles({ onUploadFile }: { onUploadFile?: () => void }) {
  return (
    <EmptyState
      icon="📄"
      title="No files here"
      description="Upload files or create new documents to get started."
      action={
        onUploadFile
          ? {
              label: 'Upload Files',
              onClick: onUploadFile,
            }
          : undefined
      }
    />
  );
}

export function EmptyChat() {
  return (
    <EmptyState
      icon="💬"
      title="Start a conversation"
      description="Ask me anything about your files or get help with your knowledge."
      size="lg"
    />
  );
}

export function EmptyMemories({ onCreateMemory }: { onCreateMemory?: () => void }) {
  return (
    <EmptyState
      icon="🧠"
      title="No memories yet"
      description="Memories are facts and preferences I learn from our conversations."
      action={
        onCreateMemory
          ? {
              label: 'Add Memory',
              onClick: onCreateMemory,
            }
          : undefined
      }
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term.`}
      size="sm"
    />
  );
}

export function EmptyTrash() {
  return (
    <EmptyState
      icon="🗑️"
      title="Trash is empty"
      description="Deleted items will appear here for 30 days before being permanently removed."
      size="sm"
    />
  );
}
