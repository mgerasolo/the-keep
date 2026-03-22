'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import { useVaultStore } from '@/stores/vault'
import { sendKeeperMessage } from '@/actions/keeper'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function KeeperPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Greetings. I'm the Keeper, your vault librarian. I can search your notes, answer questions, or help organize your thoughts. What brings you to the archives today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const showKeeperPanel = useVaultStore((s) => s.showKeeperPanel)
  const toggleKeeperPanel = useVaultStore((s) => s.toggleKeeperPanel)
  const keeperPanelPosition = useVaultStore((s) => s.keeperPanelPosition)
  const openTabs = useVaultStore((s) => s.openTabs)
  const activeTabId = useVaultStore((s) => s.activeTabId)

  // Get current file context
  const activeTab = openTabs.find((t) => t.id === activeTabId)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare conversation history for the API (last 10 messages)
      const historyForApi = messages.slice(-10).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const response = await sendKeeperMessage({
        messages: [...historyForApi, { role: 'user', content: userMessage.content }],
        currentFilePath: activeTab?.path,
        currentFileContent: activeTab?.content,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Keeper error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "My apologies - the arcane energies are temporarily disrupted. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!showKeeperPanel) return null

  const isRight = keeperPanelPosition === 'right'

  return (
    <div
      className={cn(
        'flex flex-col border-border bg-muted/30',
        isRight ? 'h-full border-l' : 'h-full border-t'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Keeper</span>
          {activeTab && (
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              ({activeTab.name})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={toggleKeeperPanel}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            title="Close Keeper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Consulting the archives...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Keeper..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {activeTab ? `Context: ${activeTab.name}` : 'Open a file for context'}
        </p>
      </form>
    </div>
  )
}
