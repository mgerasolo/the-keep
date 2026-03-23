'use client';

/**
 * File Browser Panel Component
 * Tree view of project files
 */

import type { IDockviewPanelProps } from 'dockview-react';
import { EmptyFiles } from '@/components/ui/empty-state';

export function FileBrowserPanel(_props: IDockviewPanelProps) {
  // TODO: Implement file tree with tRPC query
  // For now, show empty state

  return (
    <div className="h-full overflow-auto bg-background">
      {/* Search input */}
      <div className="p-2 border-b border-border">
        <input
          type="text"
          placeholder="Search files..."
          className="w-full px-3 py-1.5 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* File tree or empty state */}
      <div className="p-4">
        <EmptyFiles onUploadFile={() => console.log('Upload files')} />
      </div>
    </div>
  );
}
