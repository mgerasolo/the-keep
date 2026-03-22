'use client'

import { ChevronDown, ChevronRight, Search, Inbox, CheckSquare, FolderKanban, Settings } from 'lucide-react'
import { FileTree } from '../tree/FileTree'
import { useVaultStore } from '@/stores/vault'
import { cn } from '@/lib/utils'

interface AccordionSectionProps {
  id: string
  title: string
  icon: React.ReactNode
  badge?: number
  children: React.ReactNode
}

function AccordionSection({ id, title, icon, badge, children }: AccordionSectionProps) {
  const expandedSections = useVaultStore((s) => s.expandedSections)
  const toggleSection = useVaultStore((s) => s.toggleSection)
  const isExpanded = expandedSections.includes(id)

  return (
    <div className="border-b border-border">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => toggleSection(id)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {icon}
        <span className="flex-1 text-left">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            {badge}
          </span>
        )}
      </button>
      {isExpanded && <div className="pb-2">{children}</div>}
    </div>
  )
}

function ProjectSelector() {
  // TODO: Wire up to project store
  const currentProject = 'AI Research'

  return (
    <button className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">
          AI
        </div>
        <span className="text-sm font-semibold">{currentProject}</span>
      </div>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}

function SearchButton() {
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen)

  return (
    <button
      className="mx-3 my-2 flex h-8 items-center gap-2 rounded-md bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-muted"
      onClick={() => setCommandPaletteOpen(true)}
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="rounded bg-muted px-1.5 text-xs">K</kbd>
    </button>
  )
}

function InboxPreview() {
  // TODO: Wire up to inbox store
  const items = [
    { id: '1', title: 'Review API docs', source: 'Email' },
    { id: '2', title: 'Check deployment status', source: 'Slack' },
    { id: '3', title: 'Update architecture notes', source: 'n8n' },
  ]

  return (
    <div className="px-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
        >
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="flex-1 truncate text-foreground/90">{item.title}</span>
          <span className="text-xs text-muted-foreground">{item.source}</span>
        </div>
      ))}
      <button className="mt-1 w-full rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50">
        View all
      </button>
    </div>
  )
}

function TasksPreview() {
  // TODO: Wire up to tasks store
  const tasks = [
    { id: '1', title: 'Finish Keep MVP', done: false },
    { id: '2', title: 'Test file tree', done: true },
    { id: '3', title: 'Add search', done: false },
  ]

  return (
    <div className="px-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
        >
          <input
            type="checkbox"
            checked={task.done}
            readOnly
            className="h-4 w-4 rounded border-border"
          />
          <span
            className={cn(
              'flex-1 truncate',
              task.done && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* Project Selector */}
      <div className="border-b border-border">
        <ProjectSelector />
      </div>

      {/* Search */}
      <SearchButton />

      {/* Accordion Sections */}
      <div className="flex-1 overflow-y-auto">
        <AccordionSection
          id="files"
          title="Files"
          icon={<FolderKanban className="h-4 w-4" />}
        >
          <FileTree />
        </AccordionSection>

        <AccordionSection
          id="inbox"
          title="Inbox"
          icon={<Inbox className="h-4 w-4" />}
          badge={3}
        >
          <InboxPreview />
        </AccordionSection>

        <AccordionSection
          id="tasks"
          title="Tasks"
          icon={<CheckSquare className="h-4 w-4" />}
          badge={2}
        >
          <TasksPreview />
        </AccordionSection>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
