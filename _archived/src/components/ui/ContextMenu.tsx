'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  children: React.ReactNode
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  useEffect(() => {
    // Adjust position if menu would overflow viewport
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8
      }
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8
      }

      setPosition({ x: adjustedX, y: adjustedY })
    }
  }, [x, y])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-lg"
      style={{ left: position.x, top: position.y }}
    >
      {children}
    </div>
  )
}

interface ContextMenuItemProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'danger'
  disabled?: boolean
}

export function ContextMenuItem({
  onClick,
  children,
  variant = 'default',
  disabled = false,
}: ContextMenuItemProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground focus:outline-none',
        variant === 'danger' && 'text-destructive hover:bg-destructive/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-border" />
}
