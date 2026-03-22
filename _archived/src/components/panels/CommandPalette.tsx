'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import {
  Search,
  FileText,
  FolderPlus,
  FilePlus,
  Settings,
  MessageSquare,
  Inbox,
  CheckSquare,
  Sun,
  Moon,
  X,
} from 'lucide-react'
import { useVaultStore, VaultFile } from '@/stores/vault'
import { searchVault, SearchResult } from '@/actions/vault'
import { cn } from '@/lib/utils'

export function CommandPalette() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const open = useVaultStore((s) => s.commandPaletteOpen)
  const setOpen = useVaultStore((s) => s.setCommandPaletteOpen)
  const files = useVaultStore((s) => s.files)
  const openTab = useVaultStore((s) => s.openTab)
  const selectFile = useVaultStore((s) => s.selectFile)
  const toggleKeeperPanel = useVaultStore((s) => s.toggleKeeperPanel)

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  // Search with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      const results = await searchVault(search)
      setSearchResults(results)
      setSearching(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [search])

  // Flatten file tree for quick access
  const flattenFiles = useCallback((items: VaultFile[]): VaultFile[] => {
    const result: VaultFile[] = []
    const traverse = (nodes: VaultFile[]) => {
      for (const node of nodes) {
        if (node.type === 'file') {
          result.push(node)
        }
        if (node.children) {
          traverse(node.children)
        }
      }
    }
    traverse(items)
    return result
  }, [])

  const allFiles = flattenFiles(files)

  const handleSelect = (file: VaultFile) => {
    selectFile(file)
    openTab(file)
    setOpen(false)
    setSearch('')
  }

  const handleClose = () => {
    setOpen(false)
    setSearch('')
    setSearchResults([])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Command palette */}
      <div className="absolute left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4">
        <Command
          className="rounded-lg border border-border bg-popover shadow-2xl"
          shouldFilter={!search}
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search files, commands..."
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="rounded p-1 hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            {searching && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Server search results */}
            {searchResults.length > 0 && (
              <Command.Group heading="Search Results" className="text-xs text-muted-foreground">
                {searchResults.map((result) => (
                  <Command.Item
                    key={result.file.id}
                    value={`search-${result.file.path}`}
                    onSelect={() => handleSelect(result.file)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                      'aria-selected:bg-accent aria-selected:text-accent-foreground'
                    )}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate">{result.file.name}</div>
                      {result.snippet && (
                        <div className="truncate text-xs text-muted-foreground">
                          {result.snippet}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.matchType === 'filename' ? 'name' : 'content'}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Recent files (when no search) */}
            {!search && allFiles.length > 0 && (
              <Command.Group heading="Recent Files" className="text-xs text-muted-foreground">
                {allFiles.slice(0, 8).map((file) => (
                  <Command.Item
                    key={file.id}
                    value={file.path}
                    onSelect={() => handleSelect(file)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                      'aria-selected:bg-accent aria-selected:text-accent-foreground'
                    )}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{file.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {file.path.split('/').slice(0, -1).join('/')}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Actions */}
            {!search && (
              <Command.Group heading="Actions" className="text-xs text-muted-foreground">
                <Command.Item
                  onSelect={() => {
                    // TODO: Implement new file dialog
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <FilePlus className="h-4 w-4 text-muted-foreground" />
                  <span>New File</span>
                  <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">N</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    // TODO: Implement new folder dialog
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <FolderPlus className="h-4 w-4 text-muted-foreground" />
                  <span>New Folder</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    toggleKeeperPanel()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Toggle Keeper</span>
                  <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">J</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    document.documentElement.classList.remove('dark')
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <span>Light Theme</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    document.documentElement.classList.add('dark')
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <span>Dark Theme</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Navigation */}
            {!search && (
              <Command.Group heading="Navigation" className="text-xs text-muted-foreground">
                <Command.Item
                  onSelect={() => setOpen(false)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                  <span>Go to Inbox</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => setOpen(false)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Go to Tasks</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => setOpen(false)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm',
                    'aria-selected:bg-accent aria-selected:text-accent-foreground'
                  )}
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                  <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">,</kbd>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <div className="flex gap-2">
              <span><kbd className="rounded bg-muted px-1">↑↓</kbd> Navigate</span>
              <span><kbd className="rounded bg-muted px-1">↵</kbd> Select</span>
              <span><kbd className="rounded bg-muted px-1">Esc</kbd> Close</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}
