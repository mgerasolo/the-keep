"use client";

import {
  Search,
  Settings,
  Bell,
  User,
  Moon,
  Sun,
  HelpCircle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";

interface HeaderBarProps {
  onSettings: () => void;
}

export function HeaderBar({ onSettings }: HeaderBarProps) {
  const { setCommandPaletteOpen, projects, activeProjectId } = useWorkspaceStore();
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="h-9 bg-header-bar flex items-center justify-between px-3 border-b border-border shrink-0">
      {/* Left side - App name and project */}
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-secondary rounded transition-colors" title="Menu">
          <Menu className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">The Keep</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">{activeProject?.name}</span>
      </div>

      {/* Center - Search box */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1 w-[400px]",
          "bg-secondary/50 hover:bg-secondary border border-border rounded",
          "text-sm text-muted-foreground transition-colors"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search or type a command...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">
          Cmd+K
        </kbd>
      </button>

      {/* Right side - Global actions */}
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 hover:bg-secondary rounded transition-colors"
          title="Toggle Theme"
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-secondary rounded transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-secondary rounded transition-colors"
          title="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onSettings}
          className="p-1.5 hover:bg-secondary rounded transition-colors"
          title="Settings (Cmd+,)"
        >
          <Settings className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          title="User Profile"
        >
          <User className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}
