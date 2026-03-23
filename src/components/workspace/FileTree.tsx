'use client';

/**
 * File Tree Component
 * Tree view of files and folders with icons
 */

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { File, Folder } from '@/lib/db/schema';

// File type icons based on mime type / extension
const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  // Documents
  'application/pdf': { icon: '📕', color: 'text-red-400' },
  'text/markdown': { icon: '📝', color: 'text-blue-400' },
  'text/plain': { icon: '📄', color: 'text-gray-400' },
  // Images
  'image/png': { icon: '🖼️', color: 'text-green-400' },
  'image/jpeg': { icon: '🖼️', color: 'text-green-400' },
  'image/gif': { icon: '🖼️', color: 'text-green-400' },
  'image/svg+xml': { icon: '🎨', color: 'text-purple-400' },
  // Code
  'text/javascript': { icon: '📜', color: 'text-yellow-400' },
  'application/json': { icon: '📋', color: 'text-orange-400' },
  'text/html': { icon: '🌐', color: 'text-orange-400' },
  'text/css': { icon: '🎨', color: 'text-blue-400' },
  // Default
  default: { icon: '📄', color: 'text-gray-400' },
};

function getFileIcon(mimeType: string | null): { icon: string; color: string } {
  if (!mimeType) return FILE_ICONS.default;
  return FILE_ICONS[mimeType] ?? FILE_ICONS.default;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: TreeNode[];
  mimeType?: string | null;
  size?: number | null;
}

interface FileTreeProps {
  files: File[];
  folders: Folder[];
  selectedId: string | null;
  onSelectFile: (file: File) => void;
  onSelectFolder: (folder: Folder) => void;
  onContextMenu?: (e: React.MouseEvent, type: 'file' | 'folder', id: string) => void;
  searchTerm?: string;
}

/**
 * Build tree structure from flat lists
 */
function buildTree(files: File[], folders: Folder[]): TreeNode[] {
  const folderMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // Create folder nodes
  const sortedFolders = [...folders].sort((a, b) => a.path.localeCompare(b.path));
  for (const folder of sortedFolders) {
    const node: TreeNode = {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      path: folder.path,
      children: [],
    };
    folderMap.set(folder.id, node);

    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId)!.children!.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  // Add files to their parent folders
  for (const file of files) {
    const fileNode: TreeNode = {
      id: file.id,
      name: file.name,
      type: 'file',
      path: file.path,
      mimeType: file.mimeType,
      size: file.size,
    };

    // Find parent folder by matching path
    const parentPath = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
    const parentFolder = folders.find((f) => f.path === parentPath);

    if (parentFolder && folderMap.has(parentFolder.id)) {
      folderMap.get(parentFolder.id)!.children!.push(fileNode);
    } else {
      // Root level file
      rootNodes.push(fileNode);
    }
  }

  // Sort children: folders first, then files, alphabetically
  const sortChildren = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Recursively sort all children
  const sortTree = (nodes: TreeNode[]): TreeNode[] => {
    return sortChildren(nodes).map((node) => ({
      ...node,
      children: node.children ? sortTree(node.children) : undefined,
    }));
  };

  return sortTree(rootNodes);
}

/**
 * Filter tree by search term
 */
function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  const lowerTerm = term.toLowerCase();

  return nodes
    .map((node) => {
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filterTree(node.children, term);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }

      if (node.name.toLowerCase().includes(lowerTerm)) {
        return node;
      }

      return null;
    })
    .filter((node): node is TreeNode => node !== null);
}

interface TreeNodeComponentProps {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  onContextMenu?: (e: React.MouseEvent, type: 'file' | 'folder', id: string) => void;
}

function TreeNodeComponent({
  node,
  depth,
  selectedId,
  expandedFolders,
  onToggleFolder,
  onSelect,
  onContextMenu,
}: TreeNodeComponentProps) {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = node.id === selectedId;

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleFolder(node.id);
    }
    onSelect(node);
  };

  const handleDoubleClick = () => {
    if (node.type === 'folder') {
      onToggleFolder(node.id);
    }
  };

  const fileIcon = node.type === 'file' ? getFileIcon(node.mimeType ?? null) : null;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer rounded text-sm',
          'hover:bg-surface-hover transition-colors',
          isSelected && 'bg-accent/20 text-accent'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.(e, node.type, node.id);
        }}
      >
        {/* Expand/collapse arrow for folders */}
        {node.type === 'folder' && (
          <span className="w-4 text-foreground-secondary">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}

        {/* Icon */}
        {node.type === 'folder' ? (
          <span className="text-yellow-500">{isExpanded ? '📂' : '📁'}</span>
        ) : (
          <span className={fileIcon?.color}>{fileIcon?.icon}</span>
        )}

        {/* Name */}
        <span className="truncate">{node.name}</span>
      </div>

      {/* Children */}
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  files,
  folders,
  selectedId,
  onSelectFile,
  onSelectFolder,
  onContextMenu,
  searchTerm = '',
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const tree = useMemo(() => {
    const built = buildTree(files, folders);
    if (searchTerm) {
      return filterTree(built, searchTerm);
    }
    return built;
  }, [files, folders, searchTerm]);

  const handleToggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (node: TreeNode) => {
    if (node.type === 'file') {
      const file = files.find((f) => f.id === node.id);
      if (file) onSelectFile(file);
    } else {
      const folder = folders.find((f) => f.id === node.id);
      if (folder) onSelectFolder(folder);
    }
  };

  if (tree.length === 0 && searchTerm) {
    return (
      <div className="p-4 text-center text-foreground-secondary text-sm">
        No files match "{searchTerm}"
      </div>
    );
  }

  return (
    <div className="py-1">
      {tree.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedFolders={expandedFolders}
          onToggleFolder={handleToggleFolder}
          onSelect={handleSelect}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
}
