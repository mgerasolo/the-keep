"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeaderBar } from "./HeaderBar";
import { ActivityBar } from "./ActivityBar";
import { StatusBar } from "./StatusBar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { SettingsPanel } from "@/components/panels/SettingsPanel";
import { NewProjectWizard } from "@/components/panels/NewProjectWizard";
import { useWorkspaceStore } from "@/stores/workspace";

// Dynamic import for dockview to avoid SSR issues
const DockviewWorkspace = dynamic(
  () => import("./DockviewWorkspace").then((mod) => mod.DockviewWorkspace),
  { ssr: false }
);

export function WorkspaceLayout() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const { commandPaletteOpen, setCommandPaletteOpen } = useWorkspaceStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      // Escape to close modals
      if (e.key === "Escape") {
        if (commandPaletteOpen) setCommandPaletteOpen(false);
        if (settingsOpen) setSettingsOpen(false);
        if (newProjectOpen) setNewProjectOpen(false);
      }
      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setSettingsOpen(!settingsOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, settingsOpen, newProjectOpen]);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading The Keep...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header Bar - Full width at top */}
      <HeaderBar onSettings={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar
          onSettings={() => setSettingsOpen(true)}
          onNewProject={() => setNewProjectOpen(true)}
        />

        {/* Dockview Workspace */}
        <div className="flex-1 overflow-hidden">
          <DockviewWorkspace />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onSettings={() => setSettingsOpen(true)}
        onNewProject={() => setNewProjectOpen(true)}
      />

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* New Project Wizard */}
      <NewProjectWizard open={newProjectOpen} onOpenChange={setNewProjectOpen} />
    </div>
  );
}
