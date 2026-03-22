'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-popover p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 hover:bg-muted"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

interface DialogInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function DialogInput({
  value,
  onChange,
  placeholder,
  autoFocus = true,
  onKeyDown,
}: DialogInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className={cn(
        'w-full rounded-md border border-border bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring'
      )}
    />
  )
}

interface DialogButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'danger'
  disabled?: boolean
}

export function DialogButton({
  onClick,
  children,
  variant = 'default',
  disabled = false,
}: DialogButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        variant === 'default' && 'bg-muted hover:bg-muted/80',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}

export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}
