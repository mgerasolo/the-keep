'use client'

import { useEffect } from 'react'
import { useVaultStore } from '@/stores/vault'

export function KeyboardShortcuts() {
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen)
  const toggleKeeperPanel = useVaultStore((s) => s.toggleKeeperPanel)
  const toggleTheme = useVaultStore((s) => s.toggleTheme)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Command palette (already handled by CommandPalette)
      // Skip if we're in an input field
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to close things
        if (e.key !== 'Escape') return
      }

      // Cmd/Ctrl + J - Toggle Keeper
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault()
        toggleKeeperPanel()
      }

      // Cmd/Ctrl + . - Toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        toggleTheme()
      }

      // Cmd/Ctrl + N - New file (future)
      // This could trigger the create file dialog
      // For now, just opening command palette is good enough

      // Cmd/Ctrl + , - Settings (future)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setCommandPaletteOpen, toggleKeeperPanel, toggleTheme])

  return null
}
