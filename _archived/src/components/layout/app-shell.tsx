'use client'

import { AppLayout } from './AppLayout'
import { Sidebar } from '../sidebar'
import { Editor } from '../editor'
import { CommandPalette } from '../panels'
import { ThemeProvider } from '../ThemeProvider'
import { KeyboardShortcuts } from '../KeyboardShortcuts'

export function AppShell() {
  return (
    <ThemeProvider>
      <KeyboardShortcuts />
      <AppLayout
        sidebar={<Sidebar />}
        editor={<Editor />}
      />
      <CommandPalette />
    </ThemeProvider>
  )
}
