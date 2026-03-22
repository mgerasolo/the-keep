'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { Search, File, Folder, FileText, Settings, MessageSquare, Sun, Moon, X } from 'lucide-react'
import { useVaultStore, VaultFile } from '@/stores/vault'
import { searchVault, SearchResult } from '@/actions/vault'

export function CommandPalette() {
  const open = useVaultStore((s) => s.commandPaletteOpen)
  const setOpen = useVaultStore((s) => s.setCommandPaletteOpen)
  const files = useVaultStore((s) => s.files)
  const openTab = useVaultStore((s) => s.openTab)
  const selectFile = useVaultStore((s) => s.selectFile)
  const toggleKeeperPanel = useVaultStore((s) => s.toggleKeeperPanel)

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
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

  const handleSelect = useCallback(
    (file: VaultFile) => {
      selectFile(file)
      openTab(file)
      setOpen(false)
      setSearch('')
    },
    [selectFile, openTab, setOpen]
  )

  const handleCommand = useCallback(
    (command: string) => {
      switch (command) {
        case 'keeper':
          toggleKeeperPanel()
          break
        case 'theme-light':
          document.documentElement.classList.remove('dark')
          break
        case 'theme-dark':
          document.documentElement.classList.add('dark')
          break
      }
      setOpen(false)
      setSearch('')
    },
    [toggleKeeperPanel, setOpen]
  )

  // Flatten file tree for quick access
  const flattenFiles = (items: VaultFile[]): VaultFile[] => {
    const result: VaultFile[] = []
    for (const item of items) {
      if (item.type === 'file') {
        result.push(item)
      }
      if (item.children) {
        result.push(...flattenFiles(item.children))
      }
    }
    return result
  }

  const allFiles = flattenFiles(files)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => {
          setOpen(false)
          setSearch('')
        }}
      />

      {/* Command palette */}
      <Command
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
        shouldFilter={false}
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search files, commands..."
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
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

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          {searching && (
            <Command.Loading className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </Command.Loading>
          )}

          <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {/* Search results */}
          {searchResults.length > 0 && (
            <Command.Group heading="Search Results">
              {searchResults.map((result) => (
                <Command.Item
                  key={result.file.id}
                  value={result.file.path}
                  onSelect={() => handleSelect(result.file)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
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
            <Command.Group heading="Recent Files">
              {allFiles.slice(0, 5).map((file) => (
                <Command.Item
                  key={file.id}
                  value={file.path}
                  onSelect={() => handleSelect(file)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
                >
                  <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {file.path.split('/').slice(0, -1).join('/')}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Commands */}
          {!search && (
            <Command.Group heading="Commands">
              <Command.Item
                value="keeper"
                onSelect={() => handleCommand('keeper')}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Toggle Keeper Panel</span>
              </Command.Item>
              <Command.Item
                value="theme-light"
                onSelect={() => handleCommand('theme-light')}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
              >
                <Sun className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Light Theme</span>
              </Command.Item>
              <Command.Item
                value="theme-dark"
                onSelect={() => handleCommand('theme-dark')}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
              >
                <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Dark Theme</span>
              </Command.Item>
            </Command.Group>
          )}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="rounded bg-muted px-1.5 py-0.5">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rounded bg-muted px-1.5 py-0.5">↵</kbd> Select
            </span>
            <span>
              <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd> Close
            </span>
          </div>
        </div>
      </Command>
    </div>
  )
}
