"use client";

import { IDockviewPanelProps } from "dockview-react";
import {
  FileText,
  Upload,
  Sparkles,
  Book,
  Keyboard,
  ArrowRight,
  Heart,
  Home,
  Server,
  Star,
  Clock,
  Hash,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace";
import { cn } from "@/lib/utils";

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

export function WelcomePanel(props: IDockviewPanelProps) {
  const { projects, activeProjectId, setActiveProject, getRecentFiles, getStarredFiles, getAllTags, openFile } = useWorkspaceStore();
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const recentFiles = getRecentFiles().slice(0, 5);
  const starredFiles = getStarredFiles().slice(0, 3);
  const tags = getAllTags().slice(0, 8);

  const quickActions = [
    { icon: FileText, label: "New Document", shortcut: "Cmd+N" },
    { icon: Upload, label: "Upload Files", shortcut: "Cmd+U" },
    { icon: Sparkles, label: "Start AI Chat", shortcut: "Cmd+L" },
    { icon: Keyboard, label: "Command Palette", shortcut: "Cmd+K" },
  ];

  const projectIcons: Record<string, typeof Heart> = {
    heart: Heart,
    home: Home,
    server: Server,
  };

  return (
    <div className="h-full overflow-y-auto bg-editor-bg">
      <div className="max-w-2xl mx-auto py-12 px-8">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <Book className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to The Keep</h1>
          <p className="text-muted-foreground">
            Your personal knowledge management IDE
          </p>
        </div>

        {/* Current Project */}
        <div className="mb-8 p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeProject && (
                <>
                  {(() => {
                    const Icon = projectIcons[activeProject.icon] || FileText;
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()}
                  <div>
                    <h2 className="font-semibold">{activeProject.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeProject.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            <button className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors">
              Switch Project
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 p-3 bg-card hover:bg-secondary border border-border rounded-lg transition-colors group"
              >
                <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                <div className="flex-1 text-left">
                  <div className="text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.shortcut}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Starred Files */}
        {starredFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Starred Files
            </h3>
            <div className="space-y-1">
              {starredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => openFile(file.id)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded transition-colors group"
                >
                  <FileText className={cn("w-4 h-4", getFileIcon(file.name))} />
                  <span className={cn("text-sm", getFileIcon(file.name))}>{file.name}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Files */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Files
          </h3>
          <div className="space-y-1">
            {recentFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => openFile(file.id)}
                className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded transition-colors group"
              >
                <FileText className={cn("w-4 h-4", getFileIcon(file.name))} />
                <div className="flex-1 text-left">
                  <div className={cn("text-sm", getFileIcon(file.name))}>{file.name}</div>
                </div>
                <span className="text-xs text-muted-foreground">{file.lastModified}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Your Projects
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {projects.map((project) => {
              const Icon = projectIcons[project.icon] || FileText;
              const isActive = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                    isActive
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:bg-secondary"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm">{project.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Cmd+K</kbd> anywhere
                to open the command palette and quickly navigate, search, or run AI actions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
