"use client";

import { useState } from "react";
import {
  Save,
  History,
  Copy,
  X,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OpenTab, useWorkspaceStore } from "@/stores/workspace";

interface TabHoverMenuProps {
  tab: OpenTab;
  isHovered: boolean;
}

export function TabHoverMenu({ tab, isHovered }: TabHoverMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { saveTab, closeTab, closeOtherTabs, closeAllTabs } = useWorkspaceStore();

  return (
    <div
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity",
        isHovered || menuOpen ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Dirty indicator */}
      {tab.dirty && (
        <span className="w-2 h-2 rounded-full bg-orange-400 mr-1" title="Unsaved changes" />
      )}

      {/* Save button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          saveTab(tab.id);
        }}
        className={cn(
          "p-0.5 rounded hover:bg-secondary/80 transition-colors",
          !tab.dirty && "opacity-50"
        )}
        title="Save"
      >
        <Save className="w-3 h-3" />
      </button>

      {/* More menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-0.5 rounded hover:bg-secondary/80 transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-scale-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveTab(tab.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                View History
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(tab.title);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Path
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeOtherTabs(tab.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Close Others
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeAllTabs();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-secondary text-destructive transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Close All
              </button>
            </div>
          </>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeTab(tab.id);
        }}
        className="p-0.5 rounded hover:bg-secondary/80 transition-colors"
        title="Close"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
