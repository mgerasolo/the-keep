'use client'

import { useEffect, useState, useCallback } from 'react'
import { Tree, NodeRendererProps } from 'react-arborist'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, FilePlus, FolderPlus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { useVaultStore } from '@/stores/vault'
import { getVaultTree, VaultFile, createFile, createFolder, deleteFile, renameFile } from '@/actions/vault'
import { cn } from '@/lib/utils'
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/ContextMenu'
import { Dialog, DialogInput, DialogButton, DialogActions } from '@/components/ui/Dialog'

interface TreeNode {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

interface ContextMenuState {
  open: boolean
  x: number
  y: number
  node: TreeNode | null
}

interface DialogState {
  type: 'create-file' | 'create-folder' | 'rename' | 'delete' | null
  node: TreeNode | null
  inputValue: string
}

function Node({
  node,
  style,
  dragHandle,
  onContextMenu,
}: NodeRendererProps<TreeNode> & { onContextMenu?: (e: React.MouseEvent, node: TreeNode) => void }) {
  const openTab = useVaultStore((s) => s.openTab)
  const selectedFile = useVaultStore((s) => s.selectedFile)
  const selectFile = useVaultStore((s) => s.selectFile)

  const isFolder = node.data.type === 'folder'
  const isSelected = selectedFile?.id === node.data.id

  const handleClick = () => {
    if (isFolder) {
      node.toggle()
    } else {
      selectFile(node.data as VaultFile)
      openTab(node.data as VaultFile)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, node.data)
  }

  return (
    <div
      ref={dragHandle}
      style={style}
      className={cn(
        'flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 text-sm',
        'hover:bg-accent/50',
        isSelected && 'bg-accent text-accent-foreground'
      )}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Expand/collapse chevron */}
      <span className="flex h-4 w-4 items-center justify-center">
        {isFolder ? (
          node.isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )
        ) : null}
      </span>

      {/* Icon */}
      {isFolder ? (
        node.isOpen ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-blue-400" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-blue-400" />
        )
      ) : (
        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}

      {/* Name */}
      <span className="truncate">{node.data.name}</span>
    </div>
  )
}

export function FileTree() {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const setFiles = useVaultStore((s) => s.setFiles)
  const closeTab = useVaultStore((s) => s.closeTab)
  const treeRefreshKey = useVaultStore((s) => s.treeRefreshKey)

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
    node: null,
  })

  // Dialog state
  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    node: null,
    inputValue: '',
  })

  const loadTree = useCallback(async () => {
    const files = await getVaultTree()
    setTreeData(files as TreeNode[])
    setFiles(files)
  }, [setFiles])

  const refreshTree = useCallback(async () => {
    setRefreshing(true)
    await loadTree()
    setRefreshing(false)
  }, [loadTree])

  useEffect(() => {
    setLoading(true)
    loadTree().finally(() => setLoading(false))
  }, [loadTree, treeRefreshKey])

  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    setContextMenu({
      open: true,
      x: e.clientX,
      y: e.clientY,
      node,
    })
  }

  const closeContextMenu = () => {
    setContextMenu({ open: false, x: 0, y: 0, node: null })
  }

  const openDialog = (type: DialogState['type'], node: TreeNode | null = null) => {
    closeContextMenu()
    setDialog({
      type,
      node,
      inputValue: type === 'rename' && node ? node.name : '',
    })
  }

  const closeDialog = () => {
    setDialog({ type: null, node: null, inputValue: '' })
  }

  const handleCreateFile = async () => {
    if (!dialog.inputValue.trim()) return

    const parentPath = dialog.node?.type === 'folder' ? dialog.node.path : ''
    const fileName = dialog.inputValue.endsWith('.md')
      ? dialog.inputValue
      : `${dialog.inputValue}.md`
    const filePath = parentPath ? `${parentPath}/${fileName}` : fileName

    const success = await createFile(filePath)
    if (success) {
      await refreshTree()
      closeDialog()
    }
  }

  const handleCreateFolder = async () => {
    if (!dialog.inputValue.trim()) return

    const parentPath = dialog.node?.type === 'folder' ? dialog.node.path : ''
    const folderPath = parentPath
      ? `${parentPath}/${dialog.inputValue}`
      : dialog.inputValue

    const success = await createFolder(folderPath)
    if (success) {
      await refreshTree()
      closeDialog()
    }
  }

  const handleRename = async () => {
    if (!dialog.inputValue.trim() || !dialog.node) return

    const parentPath = dialog.node.path.split('/').slice(0, -1).join('/')
    const newName = dialog.node.type === 'file' && !dialog.inputValue.endsWith('.md')
      ? `${dialog.inputValue}.md`
      : dialog.inputValue
    const newPath = parentPath ? `${parentPath}/${newName}` : newName

    const success = await renameFile(dialog.node.path, newPath)
    if (success) {
      // Close tab if file was renamed
      if (dialog.node.type === 'file') {
        closeTab(dialog.node.id)
      }
      await refreshTree()
      closeDialog()
    }
  }

  const handleDelete = async () => {
    if (!dialog.node) return

    const success = await deleteFile(dialog.node.path)
    if (success) {
      // Close tab if file was deleted
      if (dialog.node.type === 'file') {
        closeTab(dialog.node.id)
      }
      await refreshTree()
      closeDialog()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (dialog.type === 'create-file') handleCreateFile()
      else if (dialog.type === 'create-folder') handleCreateFolder()
      else if (dialog.type === 'rename') handleRename()
    }
  }

  // Render wrapped node with context menu handler
  const renderNode = (props: NodeRendererProps<TreeNode>) => (
    <Node {...props} onContextMenu={handleContextMenu} />
  )

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border px-2 py-1">
        <button
          onClick={() => openDialog('create-file')}
          className="rounded p-1 hover:bg-muted"
          title="New File"
        >
          <FilePlus className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => openDialog('create-folder')}
          className="rounded p-1 hover:bg-muted"
          title="New Folder"
        >
          <FolderPlus className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          onClick={refreshTree}
          className={cn('rounded p-1 hover:bg-muted', refreshing && 'animate-spin')}
          title="Refresh"
          disabled={refreshing}
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tree */}
      {treeData.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <Folder className="h-8 w-8" />
          <span>No files yet</span>
          <button
            onClick={() => openDialog('create-file')}
            className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
          >
            Create your first note
          </button>
        </div>
      ) : (
        <Tree<TreeNode>
          data={treeData}
          openByDefault={false}
          width="100%"
          height={600}
          indent={16}
          rowHeight={28}
          overscanCount={5}
          disableDrag={false}
          disableDrop={false}
        >
          {renderNode}
        </Tree>
      )}

      {/* Context Menu */}
      {contextMenu.open && contextMenu.node && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu}>
          {contextMenu.node.type === 'folder' && (
            <>
              <ContextMenuItem onClick={() => openDialog('create-file', contextMenu.node)}>
                <FilePlus className="h-4 w-4" />
                New File
              </ContextMenuItem>
              <ContextMenuItem onClick={() => openDialog('create-folder', contextMenu.node)}>
                <FolderPlus className="h-4 w-4" />
                New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={() => openDialog('rename', contextMenu.node)}>
            <Pencil className="h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openDialog('delete', contextMenu.node)} variant="danger">
            <Trash2 className="h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenu>
      )}

      {/* Create File Dialog */}
      <Dialog
        open={dialog.type === 'create-file'}
        onClose={closeDialog}
        title="Create New File"
      >
        <DialogInput
          value={dialog.inputValue}
          onChange={(v) => setDialog((d) => ({ ...d, inputValue: v }))}
          placeholder="filename.md"
          onKeyDown={handleKeyDown}
        />
        <DialogActions>
          <DialogButton onClick={closeDialog}>Cancel</DialogButton>
          <DialogButton onClick={handleCreateFile} variant="primary">
            Create
          </DialogButton>
        </DialogActions>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={dialog.type === 'create-folder'}
        onClose={closeDialog}
        title="Create New Folder"
      >
        <DialogInput
          value={dialog.inputValue}
          onChange={(v) => setDialog((d) => ({ ...d, inputValue: v }))}
          placeholder="folder name"
          onKeyDown={handleKeyDown}
        />
        <DialogActions>
          <DialogButton onClick={closeDialog}>Cancel</DialogButton>
          <DialogButton onClick={handleCreateFolder} variant="primary">
            Create
          </DialogButton>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={dialog.type === 'rename'}
        onClose={closeDialog}
        title={`Rename ${dialog.node?.type === 'folder' ? 'Folder' : 'File'}`}
      >
        <DialogInput
          value={dialog.inputValue}
          onChange={(v) => setDialog((d) => ({ ...d, inputValue: v }))}
          placeholder="new name"
          onKeyDown={handleKeyDown}
        />
        <DialogActions>
          <DialogButton onClick={closeDialog}>Cancel</DialogButton>
          <DialogButton onClick={handleRename} variant="primary">
            Rename
          </DialogButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialog.type === 'delete'}
        onClose={closeDialog}
        title={`Delete ${dialog.node?.type === 'folder' ? 'Folder' : 'File'}`}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{dialog.node?.name}</strong>?
          {dialog.node?.type === 'folder' && ' This will delete all files inside.'}
        </p>
        <DialogActions>
          <DialogButton onClick={closeDialog}>Cancel</DialogButton>
          <DialogButton onClick={handleDelete} variant="danger">
            Delete
          </DialogButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
