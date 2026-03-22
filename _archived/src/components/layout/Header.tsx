'use client'

import { useState } from 'react'
import {
  Search,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  PanelRight,
  PanelBottom,
  Sun,
  Moon,
} from 'lucide-react'
import { useVaultStore } from '@/stores/vault'
import { cn } from '@/lib/utils'

function UserMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          MG
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
            <div className="border-b border-border px-2 py-2 mb-1">
              <p className="text-sm font-medium">Matt Gerasolo</p>
              <p className="text-xs text-muted-foreground">matt@example.com</p>
            </div>

            <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
              <User className="h-4 w-4" />
              Profile
            </button>
            <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <div className="my-1 border-t border-border" />

            <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function Header() {
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen)
  const showKeeperPanel = useVaultStore((s) => s.showKeeperPanel)
  const toggleKeeperPanel = useVaultStore((s) => s.toggleKeeperPanel)
  const keeperPanelPosition = useVaultStore((s) => s.keeperPanelPosition)
  const setKeeperPanelPosition = useVaultStore((s) => s.setKeeperPanelPosition)
  const theme = useVaultStore((s) => s.theme)
  const toggleTheme = useVaultStore((s) => s.toggleTheme)

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">
          <span className="text-primary">The</span> Keep
        </div>
      </div>

      {/* Center: Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-8 w-72 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-sm text-muted-foreground hover:bg-muted/50"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">K</kbd>
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Keeper toggle */}
        <button
          onClick={toggleKeeperPanel}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            showKeeperPanel
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Keeper</span>
        </button>

        {/* Keeper position toggle (only show when Keeper is open) */}
        {showKeeperPanel && (
          <button
            onClick={() =>
              setKeeperPanelPosition(
                keeperPanelPosition === 'right' ? 'bottom' : 'right'
              )
            }
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={`Move Keeper to ${keeperPanelPosition === 'right' ? 'bottom' : 'right'}`}
          >
            {keeperPanelPosition === 'right' ? (
              <PanelBottom className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Separator */}
        <div className="mx-2 h-6 w-px bg-zinc-600" />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-destructive-foreground shadow-sm">
            3
          </span>
        </button>

        {/* Separator */}
        <div className="mx-2 h-6 w-px bg-zinc-600" />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  )
}
