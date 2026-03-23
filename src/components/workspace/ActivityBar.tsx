'use client';

/**
 * Activity Bar Component
 * Far-left sidebar for project switching and global actions
 */

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  icon: string;
}

interface ActivityBarProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
  onGlobalAction: (action: 'search' | 'knowledge' | 'settings' | 'ai') => void;
}

export function ActivityBar({
  projects,
  activeProjectId,
  onProjectSelect,
  onNewProject,
  onGlobalAction,
}: ActivityBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div data-testid="activity-bar" className="flex flex-col h-full w-12 bg-background-secondary border-r border-border">
      {/* Project icons - top section */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {projects.map((project) => (
          <ActivityBarItem
            key={project.id}
            icon={project.icon}
            label={project.name}
            isActive={project.id === activeProjectId}
            isHovered={project.id === hoveredId}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onProjectSelect(project.id)}
            testId={`project-${project.id}`}
          />
        ))}

        {/* New project button */}
        <ActivityBarItem
          icon="➕"
          label="New Project"
          isActive={false}
          isHovered={hoveredId === 'new'}
          onMouseEnter={() => setHoveredId('new')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={onNewProject}
          className="opacity-60 hover:opacity-100"
          testId="new-project-action"
        />
      </div>

      {/* Divider */}
      <div className="mx-2 border-t border-border" />

      {/* Global actions - bottom section */}
      <div className="py-2 space-y-1">
        <ActivityBarItem
          icon="🤖"
          label="AI Chat"
          isActive={false}
          isHovered={hoveredId === 'ai'}
          onMouseEnter={() => setHoveredId('ai')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onGlobalAction('ai')}
          testId="ai-action"
        />
        <ActivityBarItem
          icon="🔍"
          label="Search"
          isActive={false}
          isHovered={hoveredId === 'search'}
          onMouseEnter={() => setHoveredId('search')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onGlobalAction('search')}
          testId="search-action"
        />
        <ActivityBarItem
          icon="🧠"
          label="Knowledge"
          isActive={false}
          isHovered={hoveredId === 'knowledge'}
          onMouseEnter={() => setHoveredId('knowledge')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onGlobalAction('knowledge')}
          testId="knowledge-action"
        />
        <ActivityBarItem
          icon="⚙️"
          label="Settings"
          isActive={false}
          isHovered={hoveredId === 'settings'}
          onMouseEnter={() => setHoveredId('settings')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onGlobalAction('settings')}
          testId="settings-action"
        />
      </div>
    </div>
  );
}

interface ActivityBarItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  className?: string;
  testId?: string;
}

function ActivityBarItem({
  icon,
  label,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  testId,
}: ActivityBarItemProps) {
  return (
    <div className="relative px-1">
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-testid={testId}
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-colors',
          isActive
            ? 'bg-accent text-white'
            : 'hover:bg-surface-hover text-foreground',
          className
        )}
        title={label}
      >
        {icon}
      </button>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r" />
      )}

      {/* Tooltip */}
      {isHovered && !isActive && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-surface border border-border rounded text-sm whitespace-nowrap shadow-lg">
          {label}
        </div>
      )}
    </div>
  );
}
