"use client";

import { useState, useEffect, useMemo } from "react";
import { Command } from "cmdk";
import {
  FileText,
  Search,
  Settings,
  Sparkles,
  Plus,
  Upload,
  FolderOpen,
  Heart,
  Home,
  Server,
  Keyboard,
  Moon,
  Sun,
  MessageSquare,
  RefreshCw,
  Trash2,
  Download,
  Users,
  Shield,
  Brain,
  Hash,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettings: () => void;
  onNewProject: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  group: string;
  action: () => void;
}

function getFileIcon(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  const colors: Record<string, string> = {
    md: "text-[#519aba]",
    pdf: "text-[#e44d26]",
    png: "text-[#8dc149]",
    jpg: "text-[#8dc149]",
  };
  return colors[extension || ""] || "text-muted-foreground";
}

export function CommandPalette({
  open,
  onOpenChange,
  onSettings,
  onNewProject,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const { projects, setActiveProject, files, openFile, getAllTags, getStarredFiles } = useWorkspaceStore();

  // Reset search when closed
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const commands: CommandItem[] = useMemo(
    () => [
      // Quick Actions
      {
        id: "new-file",
        label: "New File",
        description: "Create a new document",
        icon: Plus,
        shortcut: "Cmd+N",
        group: "Actions",
        action: () => console.log("New file"),
      },
      {
        id: "upload",
        label: "Upload Files",
        description: "Upload documents to your project",
        icon: Upload,
        shortcut: "Cmd+U",
        group: "Actions",
        action: () => console.log("Upload"),
      },
      {
        id: "ai-chat",
        label: "Focus AI Chat",
        description: "Open the AI assistant",
        icon: Sparkles,
        shortcut: "Cmd+L",
        group: "Actions",
        action: () => console.log("AI chat"),
      },
      {
        id: "new-project",
        label: "New Project",
        description: "Create a new project with Soul Discovery",
        icon: FolderOpen,
        group: "Actions",
        action: () => {
          onOpenChange(false);
          onNewProject();
        },
      },

      // Settings
      {
        id: "settings",
        label: "Open Settings",
        description: "Configure The Keep",
        icon: Settings,
        shortcut: "Cmd+,",
        group: "Settings",
        action: () => {
          onOpenChange(false);
          onSettings();
        },
      },
      {
        id: "keyboard-shortcuts",
        label: "Keyboard Shortcuts",
        description: "View and customize shortcuts",
        icon: Keyboard,
        group: "Settings",
        action: () => {
          onOpenChange(false);
          onSettings();
        },
      },
      {
        id: "theme-dark",
        label: "Switch to Dark Theme",
        icon: Moon,
        group: "Settings",
        action: () => console.log("Dark theme"),
      },
      {
        id: "theme-light",
        label: "Switch to Light Theme",
        icon: Sun,
        group: "Settings",
        action: () => console.log("Light theme"),
      },

      // AI Features
      {
        id: "ai-summarize",
        label: "AI: Summarize Open File",
        description: "Get an AI summary of the current document",
        icon: Brain,
        group: "AI",
        action: () => console.log("Summarize"),
      },
      {
        id: "ai-suggest-tags",
        label: "AI: Suggest Tags",
        description: "Get AI suggestions for tags",
        icon: Sparkles,
        group: "AI",
        action: () => console.log("Suggest tags"),
      },
      {
        id: "trusted-sources",
        label: "Manage Trusted Sources",
        description: "Configure expert authorities",
        icon: Users,
        group: "AI",
        action: () => {
          onOpenChange(false);
          onSettings();
        },
      },
      {
        id: "project-guardrails",
        label: "Edit Project Guardrails",
        description: "Set AI boundaries and rules",
        icon: Shield,
        group: "AI",
        action: () => {
          onOpenChange(false);
          onSettings();
        },
      },

      // Projects
      ...projects.map((project) => ({
        id: `project-${project.id}`,
        label: `Switch to ${project.name}`,
        description: project.description,
        icon:
          project.icon === "heart"
            ? Heart
            : project.icon === "home"
            ? Home
            : Server,
        group: "Projects",
        action: () => {
          setActiveProject(project.id);
          onOpenChange(false);
        },
      })),

      // File operations
      {
        id: "export-project",
        label: "Export Project",
        description: "Download project as ZIP",
        icon: Download,
        group: "Project",
        action: () => console.log("Export"),
      },
      {
        id: "view-trash",
        label: "View Trash",
        description: "See deleted files (30-day retention)",
        icon: Trash2,
        group: "Project",
        action: () => console.log("Trash"),
      },
      {
        id: "refresh-index",
        label: "Refresh RAG Index",
        description: "Re-index project for AI search",
        icon: RefreshCw,
        group: "Project",
        action: () => console.log("Refresh"),
      },
    ],
    [projects, setActiveProject, onOpenChange, onSettings, onNewProject]
  );

  // Flatten files for search
  const flatFiles = useMemo(() => {
    const flatten = (
      nodes: typeof files,
      path = ""
    ): { id: string; name: string; path: string; starred?: boolean }[] => {
      return nodes.flatMap((node) => {
        const currentPath = path ? `${path}/${node.name}` : node.name;
        if (node.type === "folder" && node.children) {
          return flatten(node.children, currentPath);
        }
        return [{ id: node.id, name: node.name, path: currentPath, starred: node.starred }];
      });
    };
    return flatten(files);
  }, [files]);

  const tags = getAllTags();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Command Dialog */}
      <Command
        className={cn(
          "fixed left-1/2 top-[20%] -translate-x-1/2 z-50",
          "w-[600px] max-h-[450px] bg-popover border border-border rounded-lg shadow-2xl overflow-hidden",
          "animate-scale-in",
          !open && "hidden"
        )}
        shouldFilter={true}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search commands, files, tags, or actions..."
            className="flex-1 px-3 py-3 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-xs bg-secondary rounded">Esc</kbd>
        </div>

        {/* Results */}
        <Command.List className="overflow-y-auto max-h-[350px] p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {/* Files */}
          {flatFiles.length > 0 && (
            <Command.Group heading="Files">
              {flatFiles.slice(0, 5).map((file) => (
                <Command.Item
                  key={file.id}
                  value={file.name}
                  onSelect={() => {
                    openFile(file.id);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer aria-selected:bg-secondary"
                >
                  <FileText className={cn("w-4 h-4 shrink-0", getFileIcon(file.name))} />
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm truncate", getFileIcon(file.name))}>{file.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {file.path}
                    </div>
                  </div>
                  {file.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <Command.Group heading="Tags">
              {tags.slice(0, 5).map((tag) => (
                <Command.Item
                  key={tag}
                  value={`tag ${tag}`}
                  onSelect={() => {
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer aria-selected:bg-secondary"
                >
                  <Hash className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm">#{tag}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Command Groups */}
          {["Actions", "AI", "Projects", "Settings", "Project"].map((group) => {
            const groupCommands = commands.filter((c) => c.group === group);
            if (groupCommands.length === 0) return null;

            return (
              <Command.Group key={group} heading={group}>
                {groupCommands.map((command) => (
                  <Command.Item
                    key={command.id}
                    value={`${command.label} ${command.description || ""}`}
                    onSelect={() => {
                      command.action();
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer aria-selected:bg-secondary"
                  >
                    <command.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{command.label}</div>
                      {command.description && (
                        <div className="text-xs text-muted-foreground">
                          {command.description}
                        </div>
                      )}
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-0.5 text-xs bg-secondary rounded">
                        {command.shortcut}
                      </kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command>
    </>
  );
}
