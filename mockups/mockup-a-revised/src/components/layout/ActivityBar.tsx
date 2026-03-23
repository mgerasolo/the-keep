"use client";

import {
  Heart,
  Home,
  Server,
  Search,
  Settings,
  Plus,
  FileText,
  Brain,
  BookOpen,
  Star,
  Clock,
  Inbox,
  Calendar,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";

interface ActivityBarProps {
  onSettings: () => void;
  onNewProject: () => void;
  onOpenPanel?: (panel: "inbox" | "journal" | "memory-grid") => void;
}

const projectIcons: Record<string, typeof Heart> = {
  heart: Heart,
  home: Home,
  server: Server,
};

// Extension-like icons below projects
const extensionIcons = [
  { icon: Brain, label: "AI Features", id: "ai" },
  { icon: BookOpen, label: "Documentation", id: "docs" },
  { icon: Database, label: "Memory Grid", id: "memory-grid" },
  { icon: Calendar, label: "Daily Journal", id: "journal" },
];

export function ActivityBar({ onSettings, onNewProject, onOpenPanel }: ActivityBarProps) {
  const { projects, activeProjectId, setActiveProject, setCommandPaletteOpen, sidebarTab, setSidebarTab, inboxCount } =
    useWorkspaceStore();

  return (
    <div className="w-12 bg-activity-bar flex flex-col items-center py-2 border-r border-border">
      {/* Projects */}
      <div className="flex flex-col items-center gap-1">
        {projects.map((project) => {
          const Icon = projectIcons[project.icon] || FileText;
          const isActive = project.id === activeProjectId;
          return (
            <button
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={cn(
                "w-12 h-12 flex items-center justify-center relative group",
                "text-activity-bar-foreground hover:text-foreground transition-colors",
                isActive && "text-foreground"
              )}
              title={project.name}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-foreground rounded-r" />
              )}
              <Icon className="w-6 h-6" />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                {project.name}
              </div>
            </button>
          );
        })}

        {/* New Project Button */}
        <button
          onClick={onNewProject}
          className="w-12 h-12 flex items-center justify-center text-activity-bar-foreground hover:text-foreground transition-colors group relative"
          title="New Project"
        >
          <Plus className="w-5 h-5" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            New Project
          </div>
        </button>
      </div>

      {/* Separator */}
      <div className="w-8 h-px bg-border my-2" />

      {/* Obsidian-style extension icons */}
      <div className="flex flex-col items-center gap-1">
        {extensionIcons.map((ext) => (
          <button
            key={ext.id}
            onClick={() => onOpenPanel?.(ext.id as "inbox" | "journal" | "memory-grid")}
            className="w-12 h-10 flex items-center justify-center text-activity-bar-foreground hover:text-foreground transition-colors group relative"
            title={ext.label}
          >
            <ext.icon className="w-5 h-5" />
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {ext.label}
            </div>
          </button>
        ))}
      </div>

      {/* Cross-Project Inbox with badge */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          onClick={() => onOpenPanel?.("inbox")}
          className="w-12 h-10 flex items-center justify-center text-activity-bar-foreground hover:text-foreground transition-colors group relative"
          title="Cross-Project Inbox"
        >
          <div className="relative">
            <Inbox className="w-5 h-5" />
            {inboxCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                {inboxCount}
              </span>
            )}
          </div>
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Cross-Project Inbox
          </div>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Separator */}
      <div className="w-8 h-px bg-border my-2" />

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-12 h-12 flex items-center justify-center text-activity-bar-foreground hover:text-foreground transition-colors group relative"
          title="Search (Cmd+K)"
        >
          <Search className="w-5 h-5" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Search (Cmd+K)
          </div>
        </button>

        <button
          onClick={onSettings}
          className="w-12 h-12 flex items-center justify-center text-activity-bar-foreground hover:text-foreground transition-colors group relative"
          title="Settings (Cmd+,)"
        >
          <Settings className="w-5 h-5" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Settings (Cmd+,)
          </div>
        </button>
      </div>
    </div>
  );
}
