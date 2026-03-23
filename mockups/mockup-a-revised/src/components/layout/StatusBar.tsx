"use client";

import { GitBranch, Zap, Bell, Wifi, Hash, Link2 } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace";

export function StatusBar() {
  const { projects, activeProjectId, openTabs, activeTabId, getFileById } = useWorkspaceStore();
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const activeFile = activeTab ? getFileById(activeTab.fileId) : null;

  return (
    <div className="h-6 bg-status-bar text-white flex items-center px-2 text-xs shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5" />
          main
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          {activeProject?.name || "No Project"}
        </span>
        {activeFile?.backlinks !== undefined && (
          <span className="flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />
            {activeFile.backlinks} backlinks
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5" />
          Connected
        </span>
        <span className="flex items-center gap-1">
          <Bell className="w-3.5 h-3.5" />
          0
        </span>
        <span className="opacity-75">jarvis-chat</span>
        <span className="opacity-75">Ln 1, Col 1</span>
        <span className="opacity-75">UTF-8</span>
      </div>
    </div>
  );
}
