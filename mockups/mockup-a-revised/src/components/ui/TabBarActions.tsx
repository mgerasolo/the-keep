"use client";

import { useState } from "react";
import {
  Plus,
  SplitSquareHorizontal,
  SplitSquareVertical,
  FileText,
  MessageSquare,
  ListTodo,
  Workflow,
  Globe,
  Brain,
  Users,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore, NewTabOption } from "@/stores/workspace";

interface TabBarActionsProps {
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
}

const newTabOptions: { type: NewTabOption; label: string; icon: typeof FileText }[] = [
  { type: "file", label: "New File", icon: FileText },
  { type: "chat", label: "AI Chat", icon: MessageSquare },
  { type: "tasks", label: "Task List", icon: ListTodo },
  { type: "workflow", label: "Workflow", icon: Workflow },
  { type: "browser", label: "Browser", icon: Globe },
  { type: "memories", label: "Memories", icon: Brain },
  { type: "trusted-sources", label: "Trusted Sources", icon: Users },
];

export function TabBarActions({ onSplitHorizontal, onSplitVertical }: TabBarActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { addNewTab } = useWorkspaceStore();

  const handleAddTab = (type: NewTabOption) => {
    addNewTab(type);
    setDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Add Tab Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
            "hover:bg-secondary text-muted-foreground hover:text-foreground",
            dropdownOpen && "bg-secondary text-foreground"
          )}
          title="Add New Tab"
        >
          <Plus className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-scale-in">
              {newTabOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleAddTab(option.type)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
                >
                  <option.icon className="w-4 h-4 text-muted-foreground" />
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-border mx-1" />

      {/* Split Horizontal */}
      <button
        onClick={onSplitHorizontal}
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded transition-colors",
          "hover:bg-secondary text-muted-foreground hover:text-foreground"
        )}
        title="Split Horizontal"
      >
        <SplitSquareHorizontal className="w-4 h-4" />
      </button>

      {/* Split Vertical */}
      <button
        onClick={onSplitVertical}
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded transition-colors",
          "hover:bg-secondary text-muted-foreground hover:text-foreground"
        )}
        title="Split Vertical"
      >
        <SplitSquareVertical className="w-4 h-4" />
      </button>
    </div>
  );
}
