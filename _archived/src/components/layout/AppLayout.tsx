'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Menu, X, GripVertical, GripHorizontal } from 'lucide-react'
import { useVaultStore } from '@/stores/vault'
import { Header } from './Header'
import { KeeperPanel } from '../panels/KeeperPanel'
import { DropZone } from '../editor/DropZone'

interface AppLayoutProps {
  sidebar: React.ReactNode
  editor: React.ReactNode
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Vertical resize handle (for horizontal splits - drag left/right)
function VerticalResizeHandle({ onDrag }: { onDrag: (deltaX: number) => void }) {
  const isDragging = useRef(false)
  const lastX = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastX.current = e.clientX
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - lastX.current
      lastX.current = e.clientX
      onDrag(deltaX)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onDrag])

  return (
    <div
      className="group flex w-2 cursor-col-resize items-center justify-center bg-border/50 transition-all hover:w-3 hover:bg-primary/30 active:bg-primary/50"
      onMouseDown={handleMouseDown}
    >
      <GripVertical className="h-6 w-3 text-muted-foreground/50 group-hover:text-primary" />
    </div>
  )
}

// Horizontal resize handle (for vertical splits - drag up/down)
function HorizontalResizeHandle({ onDrag }: { onDrag: (deltaY: number) => void }) {
  const isDragging = useRef(false)
  const lastY = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastY.current = e.clientY
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaY = e.clientY - lastY.current
      lastY.current = e.clientY
      onDrag(deltaY)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onDrag])

  return (
    <div
      className="group flex h-2 cursor-row-resize items-center justify-center bg-border/50 transition-all hover:h-3 hover:bg-primary/30 active:bg-primary/50"
      onMouseDown={handleMouseDown}
    >
      <GripHorizontal className="h-3 w-6 text-muted-foreground/50 group-hover:text-primary" />
    </div>
  )
}

export function AppLayout({ sidebar, editor }: AppLayoutProps) {
  const showKeeperPanel = useVaultStore((s) => s.showKeeperPanel)
  const keeperPanelPosition = useVaultStore((s) => s.keeperPanelPosition)

  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Panel sizes
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [keeperWidth, setKeeperWidth] = useState(350)
  const [keeperHeight, setKeeperHeight] = useState(300)

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  const handleSidebarDrag = useCallback((deltaX: number) => {
    setSidebarWidth(w => Math.min(Math.max(w + deltaX, 200), 500))
  }, [])

  const handleKeeperWidthDrag = useCallback((deltaX: number) => {
    // Negative because dragging right should shrink keeper
    setKeeperWidth(w => Math.min(Math.max(w - deltaX, 250), 600))
  }, [])

  const handleKeeperHeightDrag = useCallback((deltaY: number) => {
    // Negative because dragging down should shrink keeper
    setKeeperHeight(h => Math.min(Math.max(h - deltaY, 150), 500))
  }, [])

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
        {/* Mobile Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-semibold">The Keep</span>
          <div className="w-9" />
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-12 z-40 bg-background/95 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebar}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {showKeeperPanel ? (
            <>
              <div className="flex-1 overflow-hidden"><DropZone>{editor}</DropZone></div>
              <HorizontalResizeHandle onDrag={handleKeeperHeightDrag} />
              <div style={{ height: keeperHeight, minHeight: 150 }} className="overflow-hidden">
                <KeeperPanel />
              </div>
            </>
          ) : (
            <div className="h-full overflow-hidden"><DropZone>{editor}</DropZone></div>
          )}
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {keeperPanelPosition === 'bottom' ? (
          // Keeper at bottom
          <div className="flex h-full w-full flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div
                className="h-full overflow-hidden border-r border-border"
                style={{ width: sidebarWidth, minWidth: 200, maxWidth: 500 }}
              >
                {sidebar}
              </div>
              <VerticalResizeHandle onDrag={handleSidebarDrag} />
              {/* Editor */}
              <div className="flex-1 overflow-hidden"><DropZone>{editor}</DropZone></div>
            </div>
            {showKeeperPanel && (
              <>
                <HorizontalResizeHandle onDrag={handleKeeperHeightDrag} />
                <div style={{ height: keeperHeight, minHeight: 150 }} className="overflow-hidden">
                  <KeeperPanel />
                </div>
              </>
            )}
          </div>
        ) : (
          // Keeper at right (default)
          <div className="flex h-full w-full">
            {/* Sidebar */}
            <div
              className="h-full overflow-hidden border-r border-border"
              style={{ width: sidebarWidth, minWidth: 200, maxWidth: 500 }}
            >
              {sidebar}
            </div>
            <VerticalResizeHandle onDrag={handleSidebarDrag} />
            {/* Editor */}
            <div className="flex-1 overflow-hidden"><DropZone>{editor}</DropZone></div>
            {showKeeperPanel && (
              <>
                <VerticalResizeHandle onDrag={handleKeeperWidthDrag} />
                <div
                  className="h-full overflow-hidden border-l border-border"
                  style={{ width: keeperWidth, minWidth: 250, maxWidth: 600 }}
                >
                  <KeeperPanel />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
