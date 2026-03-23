'use client';

/**
 * File Browser Panel Component
 * Tree view of project files with context menu operations
 */

import { useState, useCallback } from 'react';
import type { IDockviewPanelProps } from 'dockview-react';
import { EmptyFiles } from '@/components/ui/empty-state';
import { FileTree } from '../FileTree';
import { FileUploadDialog } from '../FileUploadDialog';
import { FileContextMenu, getFileMenuItems, getFolderMenuItems, getEmptySpaceMenuItems, type ContextMenuItem } from '../FileContextMenu';
import { useProjectStore, useWorkspaceStore } from '@/stores';
import { api } from '@/lib/trpc/react';
import { toast } from '@/components/ui/toaster';
import type { File, Folder } from '@/lib/db/schema';

interface ContextMenuState {
  x: number;
  y: number;
  type: 'file' | 'folder' | 'empty';
  targetId?: string;
}

interface RenameDialogState {
  isOpen: boolean;
  type: 'file' | 'folder';
  id: string;
  currentName: string;
}

interface CreateDialogState {
  isOpen: boolean;
  type: 'file' | 'folder';
  parentId?: string;
}

export function FileBrowserPanel(_props: IDockviewPanelProps) {
  const { activeProjectId } = useProjectStore();
  const { openFile } = useWorkspaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renameDialog, setRenameDialog] = useState<RenameDialogState | null>(null);
  const [createDialog, setCreateDialog] = useState<CreateDialogState | null>(null);
  const [inputValue, setInputValue] = useState('');

  const utils = api.useUtils();

  // Fetch files for the active project
  const { data, isLoading } = api.files.list.useQuery(
    { projectId: activeProjectId! },
    { enabled: !!activeProjectId }
  );

  // Mutations
  const deleteFileMutation = api.files.deleteFile.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success('File deleted');
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteFolderMutation = api.files.deleteFolder.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success('Folder deleted');
    },
    onError: (err) => toast.error(err.message),
  });

  const renameFileMutation = api.files.renameFile.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success('File renamed');
      setRenameDialog(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const renameFolderMutation = api.files.renameFolder.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success('Folder renamed');
      setRenameDialog(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const createFolderMutation = api.files.createFolder.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success('Folder created');
      setCreateDialog(null);
      setInputValue('');
    },
    onError: (err) => toast.error(err.message),
  });

  const createFileMutation = api.files.createFile.useMutation({
    onSuccess: (file) => {
      utils.files.list.invalidate();
      toast.success('File created');
      setCreateDialog(null);
      setInputValue('');
      // Open the new file
      openFile(file.id, file.name, file.mimeType ?? undefined);
    },
    onError: (err) => toast.error(err.message),
  });

  const duplicateFileMutation = api.files.duplicateFile.useMutation({
    onSuccess: (file) => {
      utils.files.list.invalidate();
      toast.success('File duplicated');
      openFile(file.id, file.name, file.mimeType ?? undefined);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSelectFile = useCallback((file: File) => {
    setSelectedId(file.id);
    openFile(file.id, file.name, file.mimeType ?? undefined);
  }, [openFile]);

  const handleSelectFolder = useCallback((folder: Folder) => {
    setSelectedId(folder.id);
  }, []);

  const handleUpload = useCallback(() => {
    setShowUploadDialog(true);
  }, []);

  // Context menu handlers
  const handleContextMenu = useCallback((e: React.MouseEvent, type: 'file' | 'folder', id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type, targetId: id });
  }, []);

  const handleEmptySpaceContextMenu = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-tree-item]')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'empty' });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Build context menu items
  const getContextMenuItems = useCallback((): ContextMenuItem[] => {
    if (!contextMenu || !activeProjectId) return [];

    if (contextMenu.type === 'file' && contextMenu.targetId) {
      const file = data?.files.find(f => f.id === contextMenu.targetId);
      if (!file) return [];

      return getFileMenuItems({
        onOpen: () => openFile(file.id, file.name, file.mimeType ?? undefined),
        onRename: () => {
          setRenameDialog({
            isOpen: true,
            type: 'file',
            id: file.id,
            currentName: file.name,
          });
          setInputValue(file.name);
        },
        onDuplicate: () => {
          duplicateFileMutation.mutate({ id: file.id });
        },
        onDelete: () => deleteFileMutation.mutate({ id: file.id }),
      });
    }

    if (contextMenu.type === 'folder' && contextMenu.targetId) {
      const folder = data?.folders.find(f => f.id === contextMenu.targetId);
      if (!folder) return [];

      return getFolderMenuItems({
        onNewFolder: () => {
          setCreateDialog({ isOpen: true, type: 'folder', parentId: folder.id });
          setInputValue('');
        },
        onNewFile: () => {
          setCreateDialog({ isOpen: true, type: 'file', parentId: folder.id });
          setInputValue('');
        },
        onRename: () => {
          setRenameDialog({
            isOpen: true,
            type: 'folder',
            id: folder.id,
            currentName: folder.name,
          });
          setInputValue(folder.name);
        },
        onDelete: () => deleteFolderMutation.mutate({ id: folder.id }),
      });
    }

    if (contextMenu.type === 'empty') {
      return getEmptySpaceMenuItems({
        onNewFolder: () => {
          setCreateDialog({ isOpen: true, type: 'folder' });
          setInputValue('');
        },
        onNewFile: () => {
          setCreateDialog({ isOpen: true, type: 'file' });
          setInputValue('');
        },
        onUpload: handleUpload,
      });
    }

    return [];
  }, [contextMenu, data, activeProjectId, openFile, handleUpload, deleteFileMutation, deleteFolderMutation, duplicateFileMutation]);

  // Handle rename submit
  const handleRenameSubmit = useCallback(() => {
    if (!renameDialog || !inputValue.trim()) return;

    if (renameDialog.type === 'file') {
      renameFileMutation.mutate({ id: renameDialog.id, name: inputValue.trim() });
    } else {
      renameFolderMutation.mutate({ id: renameDialog.id, name: inputValue.trim() });
    }
  }, [renameDialog, inputValue, renameFileMutation, renameFolderMutation]);

  // Handle create submit
  const handleCreateSubmit = useCallback(() => {
    if (!createDialog || !inputValue.trim() || !activeProjectId) return;

    if (createDialog.type === 'folder') {
      createFolderMutation.mutate({
        projectId: activeProjectId,
        name: inputValue.trim(),
        parentId: createDialog.parentId,
      });
    } else {
      createFileMutation.mutate({
        projectId: activeProjectId,
        name: inputValue.trim(),
        folderId: createDialog.parentId,
      });
    }
  }, [createDialog, inputValue, activeProjectId, createFolderMutation, createFileMutation]);

  // No project selected
  if (!activeProjectId) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-2 border-b border-border">
          <input
            type="text"
            placeholder="Search files..."
            disabled
            className="w-full px-3 py-1.5 text-sm bg-surface border border-border rounded focus:outline-none opacity-50"
          />
        </div>
        <div className="p-4 text-center text-foreground-secondary text-sm">
          Select a project to view files
        </div>
      </div>
    );
  }

  const hasFiles = data && (data.files.length > 0 || data.folders.length > 0);

  return (
    <div className="h-full overflow-auto bg-background flex flex-col">
      {/* Search input */}
      <div className="p-2 border-b border-border flex-shrink-0">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* File tree or empty state */}
      <div
        className="flex-1 overflow-auto"
        onContextMenu={handleEmptySpaceContextMenu}
      >
        {isLoading ? (
          <div className="p-4 text-center text-foreground-secondary text-sm">
            Loading...
          </div>
        ) : hasFiles ? (
          <FileTree
            files={data.files}
            folders={data.folders}
            selectedId={selectedId}
            onSelectFile={handleSelectFile}
            onSelectFolder={handleSelectFolder}
            onContextMenu={handleContextMenu}
            searchTerm={searchTerm}
          />
        ) : (
          <div className="p-4">
            <EmptyFiles onUploadFile={handleUpload} />
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems()}
          onClose={closeContextMenu}
        />
      )}

      {/* Rename Dialog */}
      {renameDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-lg p-4 w-80">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Rename {renameDialog.type}
            </h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') setRenameDialog(null);
              }}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setRenameDialog(null)}
                className="px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:bg-accent/90"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      {createDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-lg p-4 w-80">
            <h3 className="text-sm font-medium text-foreground mb-3">
              New {createDialog.type}
            </h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubmit();
                if (e.key === 'Escape') setCreateDialog(null);
              }}
              placeholder={createDialog.type === 'folder' ? 'Folder name' : 'filename.md'}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCreateDialog(null)}
                className="px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:bg-accent/90"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <FileUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      />
    </div>
  );
}
