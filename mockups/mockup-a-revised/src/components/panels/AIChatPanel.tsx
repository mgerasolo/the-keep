"use client";

import { useState, useRef, useEffect } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  Send,
  Plus,
  Paperclip,
  Bot,
  User,
  FileText,
  ChevronDown,
  Sparkles,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { PersonaSelector, Persona } from "@/components/ui/PersonaSelector";
import { ConversationModeIndicator, ConversationMode } from "@/components/ui/ConversationModeIndicator";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";

export function AIChatPanel(props: IDockviewPanelProps) {
  const {
    chatMessages,
    addChatMessage,
    projects,
    activeProjectId,
    selectedPersona,
    setSelectedPersona,
    conversationMode,
    setConversationMode,
  } = useWorkspaceStore();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("jarvis-chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input;
    setInput("");
    addChatMessage("user", userMessage);

    // Simulate AI response
    setIsStreaming(true);
    setTimeout(() => {
      const response = generateMockResponse(userMessage);
      addChatMessage("assistant", response);
      setIsStreaming(false);
    }, 1500);
  };

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("lab") || query.toLowerCase().includes("blood")) {
      return `Based on your latest lab results from March 2026, here's a summary:

**Key Findings:**
- **A1C:** 5.4% (improved from 5.6%) - This is within the normal range (<5.7%)
- **Glucose:** 92 mg/dL - Normal fasting glucose
- **Cholesterol:** 185 mg/dL - Within healthy range
- **LDL:** 110 mg/dL - Slightly elevated, target is <100

**Recommendations:**
1. Continue your current diet and exercise regimen
2. Consider increasing omega-3 intake for LDL management
3. Schedule follow-up bloodwork in 3 months

*Sources: [2026-03-bloodwork.md], [profile.md]*`;
    }

    if (query.toLowerCase().includes("supplement")) {
      return `Here's your current supplement stack from daily-stack.md:

**Morning (with breakfast):**
- Vitamin D3: 5000 IU
- Omega-3 Fish Oil: 2g
- Magnesium Glycinate: 400mg

**Evening (before bed):**
- Magnesium Threonate: 144mg
- Zinc: 15mg
- Vitamin K2: 100mcg

Would you like me to suggest any adjustments based on your health goals?`;
    }

    return `I understand you're asking about "${query}". I have access to your ${activeProject?.name || "project"} files and can help you find relevant information.

Would you like me to:
1. Search through your documents for related content?
2. Summarize specific files?
3. Help you create or update documentation?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium">AI Assistant</span>
          {/* Persona Selector */}
          <PersonaSelector
            value={selectedPersona}
            onChange={setSelectedPersona}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Conversation Mode Indicator */}
          <ConversationModeIndicator
            value={conversationMode}
            onChange={setConversationMode}
          />
          {/* New chat */}
          <button
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context pills */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
        <span className="text-xs text-muted-foreground">Context:</span>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary rounded text-xs">
            <FileText className="w-3 h-3" />
            {activeProject?.name}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary rounded text-xs">
            <FileText className="w-3 h-3" />
            2026-03-bloodwork.md
          </span>
          <button className="p-0.5 hover:bg-secondary rounded">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "flex-1 max-w-[85%]",
                message.role === "user" && "flex justify-end"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>

              {/* Actions for assistant messages */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-1 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 hover:bg-secondary rounded"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    className="p-1 hover:bg-secondary rounded"
                    title="Regenerate"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    className="p-1 hover:bg-secondary rounded"
                    title="Good response"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    className="p-1 hover:bg-secondary rounded"
                    title="Bad response"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        {/* Model selector */}
        <div className="flex items-center justify-between mb-2">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <span>{selectedModel}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {conversationMode === "incognito" && (
            <span className="text-xs text-yellow-400">
              Incognito - memories disabled
            </span>
          )}
          {conversationMode === "readonly" && (
            <span className="text-xs text-blue-400">
              Read-only - edits disabled
            </span>
          )}
        </div>

        {/* Input box */}
        <div className="flex items-end gap-2 bg-card border border-border rounded-lg p-2">
          <button
            className="p-1.5 hover:bg-secondary rounded transition-colors shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            className="flex-1 bg-transparent resize-none text-sm focus:outline-none min-h-[24px] max-h-[120px]"
            placeholder="Ask about your documents..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={cn(
              "p-1.5 rounded transition-colors shrink-0",
              input.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground"
            )}
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            title="Send (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Cmd+K for inline actions | Cmd+L to focus chat
        </p>
      </div>
    </div>
  );
}
