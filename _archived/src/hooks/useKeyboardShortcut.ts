'use client'

import { useEffect, useCallback } from 'react'

type KeyModifier = 'meta' | 'ctrl' | 'alt' | 'shift'

interface ShortcutOptions {
  key: string
  modifiers?: KeyModifier[]
  callback: () => void
  enabled?: boolean
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcut({
  key,
  modifiers = [],
  callback,
  enabled = true,
}: ShortcutOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const keyMatches = event.key.toLowerCase() === key.toLowerCase()
      const metaMatches = modifiers.includes('meta') === event.metaKey
      const ctrlMatches = modifiers.includes('ctrl') === event.ctrlKey
      const altMatches = modifiers.includes('alt') === event.altKey
      const shiftMatches = modifiers.includes('shift') === event.shiftKey

      if (keyMatches && metaMatches && ctrlMatches && altMatches && shiftMatches) {
        event.preventDefault()
        callback()
      }
    },
    [key, modifiers, callback, enabled]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Common shortcuts helper
 */
export const shortcuts = {
  commandPalette: { key: 'k', modifiers: ['meta'] as KeyModifier[] },
  newNote: { key: 'n', modifiers: ['meta'] as KeyModifier[] },
  save: { key: 's', modifiers: ['meta'] as KeyModifier[] },
  togglePreview: { key: 'p', modifiers: ['meta', 'shift'] as KeyModifier[] },
  closeTab: { key: 'w', modifiers: ['meta'] as KeyModifier[] },
}
