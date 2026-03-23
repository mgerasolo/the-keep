"use client";

import { useState } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FileText,
  Folder,
  FolderOpen,
  Image,
  FileCode,
  MoreHorizontal,
  Plus,
  Upload,
  RefreshCw,
  Star,
  Clock,
  Hash,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore, FileNode, SidebarTab } from "@/stores/workspace";

interface TreeItemProps {
  node: FileNode;
  depth: number;
}

function getFileIcon(node: FileNode) {
  if (node.type === "folder") {
    return null;
  }

  const extension = node.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "md":
      return <FileText className="w-4 h-4" style={{ color: "var(--file-md)" }} />;
    case "pdf":
      return <File className="w-4 h-4" style={{ color: "var(--file-pdf)" }} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <Image className="w-4 h-4" style={{ color: "var(--file-image)" }} />;
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode className="w-4 h-4" style={{ color: "var(--file-code)" }} />;
    default:
      return <File className="w-4 h-4 text-muted-foreground" />;
  }
}

function getColorfulTabName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  const colors: Record<string, string> = {
    md: "text-[#519aba]",
    pdf: "text-[#e44d26]",
    png: "text-[#8dc149]",
    jpg: "text-[#8dc149]",
    jpeg: "text-[#8dc149]",
    gif: "text-[#8dc149]",
    ts: "text-[#3178c6]",
    tsx: "text-[#3178c6]",
    js: "text-[#cbcb41]",
    jsx: "text-[#cbcb41]",
  };
  return colors[extension || ""] || "text-foreground";
}

function TreeItem({ node, depth }: TreeItemProps) {
  const {
    selectedFileId,
    setSelectedFile,
    expandedFolders,
    toggleFolder,
    openFile,
    toggleStar,
  } = useWorkspaceStore();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFileId === node.id;
  const isFolder = node.type === "folder";

  const handleClick = () => {
    setSelectedFile(node.id);
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  return (
    <div>
      <div
        className={cn("tree-item group", isSelected && "selected")}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={handleClick}
        onDoubleClick={() => !isFolder && openFile(node.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse icon for folders */}
        {isFolder ? (
          <>
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="tree-item-icon" style={{ color: "var(--file-folder)" }} />
            ) : (
              <Folder className="tree-item-icon" style={{ color: "var(--file-folder)" }} />
            )}
          </>
        ) : (
          <>
            <span className="w-4 h-4 shrink-0" />
            <span className="tree-item-icon">{getFileIcon(node)}</span>
          </>
        )}
        <span className={cn("tree-item-label", !isFolder && getColorfulTabName(node.name))}>
          {node.name}
        </span>

        {/* Star button */}
        {!isFolder && (
          <button
            className={cn(
              "ml-auto p-1 rounded transition-opacity",
              node.starred ? "opacity-100 text-yellow-400" : "opacity-0 group-hover:opacity-100",
              "hover:bg-secondary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(node.id);
            }}
            title={node.starred ? "Remove star" : "Add star"}
          >
            <Star className={cn("w-3 h-3", node.starred && "fill-yellow-400")} />
          </button>
        )}

        {/* More actions */}
        <button
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded ml-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
      </div>

      {/* Children */}
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilesView() {
  const { files } = useWorkspaceStore();
  return (
    <div className="flex-1 overflow-y-auto py-1">
      {files.map((node) => (
        <TreeItem key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
}

function TagsView() {
  const { getAllTags, files, openFile } = useWorkspaceStore();
  const tags = getAllTags();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get files for selected tag
  const getFilesWithTag = (tag: string): FileNode[] => {
    const result: FileNode[] = [];
    const collect = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.tags?.includes(tag)) result.push(node);
        if (node.children) collect(node.children);
      });
    };
    collect(files);
    return result;
  };

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {!selectedTag ? (
        tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-secondary/50 transition-colors"
          >
            <Hash className="w-4 h-4 text-primary" />
            <span>{tag}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {getFilesWithTag(tag).length}
            </span>
          </button>
        ))
      ) : (
        <>
          <button
            onClick={() => setSelectedTag(null)}
            className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-secondary/50 text-primary"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to tags</span>
          </button>
          <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">
            #{selectedTag}
          </div>
          {getFilesWithTag(selectedTag).map((file) => (
            <button
              key={file.id}
              onClick={() => openFile(file.id)}
              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-secondary/50 transition-colors"
            >
              {getFileIcon(file)}
              <span className={getColorfulTabName(file.name)}>{file.name}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function StarredView() {
  const { getStarredFiles, openFile, toggleStar } = useWorkspaceStore();
  const starredFiles = getStarredFiles();

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {starredFiles.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No starred files yet</p>
          <p className="text-xs mt-1">Click the star icon on files to add them here</p>
        </div>
      ) : (
        starredFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-secondary/50 transition-colors group cursor-pointer"
            onClick={() => openFile(file.id)}
          >
            {getFileIcon(file)}
            <span className={cn("flex-1", getColorfulTabName(file.name))}>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(file.id);
              }}
              className="p-1 hover:bg-secondary rounded"
            >
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function RecentView() {
  const { getRecentFiles, openFile } = useWorkspaceStore();
  const recentFiles = getRecentFiles();

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {recentFiles.map((file) => (
        <button
          key={file.id}
          onClick={() => openFile(file.id)}
          className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-secondary/50 transition-colors"
        >
          {getFileIcon(file)}
          <div className="flex-1 text-left min-w-0">
            <div className={cn("truncate", getColorfulTabName(file.name))}>{file.name}</div>
            <div className="text-xs text-muted-foreground truncate">{file.lastModified}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function FileExplorer(props: IDockviewPanelProps) {
  const { projects, activeProjectId, sidebarTab, setSidebarTab } = useWorkspaceStore();
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const tabs: { id: SidebarTab; label: string; icon: typeof Files }[] = [
    { id: "files", label: "Files", icon: Files },
    { id: "tags", label: "Tags", icon: Hash },
    { id: "starred", label: "", icon: Star },
    { id: "recent", label: "", icon: Clock },
  ];

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Sidebar Tabs */}
      <div className="flex items-center border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
              sidebarTab === tab.id
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={tab.label || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
        <span>{activeProject?.name || "Explorer"}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="New File">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Upload">
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content based on selected tab */}
      {sidebarTab === "files" && <FilesView />}
      {sidebarTab === "tags" && <TagsView />}
      {sidebarTab === "starred" && <StarredView />}
      {sidebarTab === "recent" && <RecentView />}

      {/* Footer Actions */}
      <div className="border-t border-border p-2">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New File
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
