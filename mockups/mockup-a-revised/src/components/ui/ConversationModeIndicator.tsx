"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConversationMode = "normal" | "incognito" | "readonly";

interface ConversationModeIndicatorProps {
  value: ConversationMode;
  onChange: (mode: ConversationMode) => void;
}

const modes: { id: ConversationMode; name: string; icon: typeof Eye; description: string; color: string }[] = [
  { id: "normal", name: "Normal", icon: Eye, description: "Memories saved", color: "text-green-400" },
  { id: "incognito", name: "Incognito", icon: EyeOff, description: "Memories disabled", color: "text-yellow-400" },
  { id: "readonly", name: "Read-only", icon: Lock, description: "No edits allowed", color: "text-blue-400" },
];

export function ConversationModeIndicator({ value, onChange }: ConversationModeIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMode = modes.find((m) => m.id === value) || modes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-xs",
          value === "normal" && "hover:bg-secondary",
          value === "incognito" && "bg-yellow-500/20 hover:bg-yellow-500/30",
          value === "readonly" && "bg-blue-500/20 hover:bg-blue-500/30"
        )}
        title={`${selectedMode.name} Mode - ${selectedMode.description}`}
      >
        <selectedMode.icon className={cn("w-3.5 h-3.5", selectedMode.color)} />
        <span className={selectedMode.color}>{selectedMode.name}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
            <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
              Conversation Mode
            </div>
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onChange(mode.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors text-left",
                  value === mode.id && "bg-secondary"
                )}
              >
                <mode.icon className={cn("w-4 h-4", mode.color)} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{mode.name}</div>
                  <div className="text-xs text-muted-foreground">{mode.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
