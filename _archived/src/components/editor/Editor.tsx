'use client'

import { useEffect, useState } from 'react'
import { FileText, X, MoreHorizontal } from 'lucide-react'
import { useVaultStore, OpenTab } from '@/stores/vault'
import { getFileContent } from '@/actions/vault'
import { MarkdownViewer } from './MarkdownViewer'
import { cn } from '@/lib/utils'

function TabBar() {
  const openTabs = useVaultStore((s) => s.openTabs)
  const activeTabId = useVaultStore((s) => s.activeTabId)
  const setActiveTab = useVaultStore((s) => s.setActiveTab)
  const closeTab = useVaultStore((s) => s.closeTab)

  if (openTabs.length === 0) {
    return null
  }

  return (
    <div className="flex items-center border-b border-border bg-muted/30">
      <div className="flex flex-1 items-center overflow-x-auto">
        {openTabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTab(tab.id)}
            onClose={() => closeTab(tab.id)}
          />
        ))}
      </div>
    </div>
  )
}

function Tab({
  tab,
  isActive,
  onActivate,
  onClose,
}: {
  tab: OpenTab
  isActive: boolean
  onActivate: () => void
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        'group flex h-9 cursor-pointer items-center gap-2 border-b-2 px-3 text-sm transition-colors',
        isActive
          ? 'border-primary bg-background text-foreground'
          : 'border-transparent text-muted-foreground hover:bg-muted/50'
      )}
      onClick={onActivate}
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="max-w-32 truncate">{tab.name}</span>
      {tab.isDirty && <span className="h-2 w-2 rounded-full bg-primary" />}
      <button
        className={cn(
          'ml-1 rounded p-0.5 hover:bg-muted',
          'opacity-0 group-hover:opacity-100',
          isActive && 'opacity-100'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <div className="text-6xl">📚</div>
      <h2 className="text-2xl font-semibold text-foreground">Welcome to The Keep</h2>
      <p className="max-w-md text-center">
        Your personal knowledge base. Select a file from the sidebar to get started,
        or press <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Cmd+K</kbd> to search.
      </p>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Cmd+K</kbd>
          <span>Search files & commands</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Cmd+J</kbd>
          <span>Toggle Keeper AI</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Cmd+.</kbd>
          <span>Toggle theme</span>
        </div>
      </div>
    </div>
  )
}

function EditorContent() {
  const activeTabId = useVaultStore((s) => s.activeTabId)
  const openTabs = useVaultStore((s) => s.openTabs)
  const setTabContent = useVaultStore((s) => s.setTabContent)
  const [loading, setLoading] = useState(false)

  const activeTab = openTabs.find((t) => t.id === activeTabId)

  useEffect(() => {
    if (!activeTab || activeTab.content !== undefined) return

    const loadContent = async () => {
      setLoading(true)
      const result = await getFileContent(activeTab.path)
      if (result) {
        setTabContent(activeTab.id, result.content, result.frontmatter)
      }
      setLoading(false)
    }

    loadContent()
  }, [activeTab, setTabContent])

  if (!activeTab) {
    return <WelcomeScreen />
  }

  if (loading || activeTab.content === undefined) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      {/* Frontmatter display */}
      {activeTab.frontmatter && Object.keys(activeTab.frontmatter).length > 0 && (
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {activeTab.frontmatter.title ? (
              <h1 className="w-full text-lg font-semibold text-foreground">
                {String(activeTab.frontmatter.title)}
              </h1>
            ) : null}
            {Array.isArray(activeTab.frontmatter.tags) ? (
              <div className="flex gap-1">
                {(activeTab.frontmatter.tags as string[]).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            {activeTab.frontmatter.created ? (
              <span className="text-xs text-muted-foreground">
                Created: {new Date(String(activeTab.frontmatter.created)).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Markdown content */}
      <div className="px-6 py-4">
        <MarkdownViewer content={activeTab.content} />
      </div>
    </div>
  )
}

export function Editor() {
  return (
    <div className="flex h-full flex-col bg-background">
      <TabBar />
      <div className="flex-1 overflow-hidden">
        <EditorContent />
      </div>
    </div>
  )
}
