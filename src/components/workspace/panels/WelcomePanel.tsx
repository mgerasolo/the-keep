'use client';

/**
 * Welcome Panel Component
 * Default panel shown when workspace opens
 */

import type { IDockviewPanelProps } from 'dockview-react';
import { useCurrentUser } from '@/lib/auth/context';

export function WelcomePanel(_props: IDockviewPanelProps) {
  const { user } = useCurrentUser();

  return (
    <div className="h-full overflow-auto bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to The Keep</h1>
          <p className="text-foreground-secondary text-lg">
            Your personal knowledge management system
          </p>
        </div>

        {user && (
          <div className="mb-8 p-4 bg-surface rounded-lg border border-border text-center">
            <p className="text-sm text-foreground-secondary">Signed in as</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAction
            icon="📁"
            title="Create Project"
            description="Start a new knowledge project"
          />
          <QuickAction
            icon="📄"
            title="Upload Files"
            description="Add documents to your workspace"
          />
          <QuickAction
            icon="💬"
            title="Start Chat"
            description="Ask questions about your files"
          />
          <QuickAction
            icon="🔍"
            title="Search"
            description="Find anything in your knowledge base"
          />
        </div>

        <div className="mt-12 text-center text-foreground-secondary text-sm">
          <p>Drag tabs to split the view • Right-click for options</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button className="flex items-start gap-4 p-4 bg-surface hover:bg-surface-hover rounded-lg border border-border transition-colors text-left">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-foreground-secondary">{description}</p>
      </div>
    </button>
  );
}
