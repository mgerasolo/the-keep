"use client";

import { useState } from "react";
import {
  X,
  User,
  Palette,
  Keyboard,
  Brain,
  Shield,
  Users,
  Cloud,
  Bell,
  Eye,
  Hash,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const settingsSections = [
  { id: "general", label: "General", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "editor", label: "Editor", icon: Eye },
  { id: "keyboard", label: "Keyboard Shortcuts", icon: Keyboard },
  { id: "ai", label: "AI Settings", icon: Brain },
  { id: "guardrails", label: "Project Guardrails", icon: Shield },
  { id: "trusted", label: "Trusted Sources", icon: Users },
  { id: "sync", label: "Sync & Backup", icon: Cloud },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState("general");
  const { showLineNumbers, toggleLineNumbers } = useWorkspaceStore();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[80vh] bg-popover border border-border rounded-lg shadow-2xl overflow-hidden flex animate-scale-in">
          {/* Sidebar */}
          <div className="w-56 bg-sidebar border-r border-border py-4">
            <h2 className="px-4 mb-4 text-lg font-semibold">Settings</h2>
            <nav className="space-y-1 px-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === section.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium capitalize">{activeSection}</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-6 space-y-6">
              {activeSection === "general" && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">User Profile</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Demo User</p>
                        <p className="text-sm text-muted-foreground">demo@example.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Language</h4>
                    <select className="w-full px-3 py-2 bg-secondary border border-border rounded">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </>
              )}

              {activeSection === "editor" && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Display Options</h4>

                    <label className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Show Line Numbers</p>
                          <p className="text-xs text-muted-foreground">Display line numbers in the editor</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleLineNumbers}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors",
                          showLineNumbers ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full bg-white transition-transform",
                            showLineNumbers ? "translate-x-5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Link2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Show Backlinks</p>
                          <p className="text-xs text-muted-foreground">Display backlink count in metadata</p>
                        </div>
                      </div>
                      <button className="w-10 h-6 rounded-full bg-primary">
                        <div className="w-4 h-4 rounded-full bg-white translate-x-5" />
                      </button>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Font Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">Font Size</label>
                        <select className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded">
                          <option>12px</option>
                          <option>13px</option>
                          <option selected>14px</option>
                          <option>16px</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Font Family</label>
                        <select className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded">
                          <option>System Default</option>
                          <option selected>Cascadia Code</option>
                          <option>Fira Code</option>
                          <option>JetBrains Mono</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "appearance" && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 bg-card border-2 border-primary rounded-lg text-center">
                        <div className="w-full h-20 bg-[#1e1e1e] rounded mb-2" />
                        <span className="text-sm">Dark</span>
                      </button>
                      <button className="p-4 bg-card border border-border rounded-lg text-center hover:border-primary/50">
                        <div className="w-full h-20 bg-white rounded mb-2" />
                        <span className="text-sm">Light</span>
                      </button>
                      <button className="p-4 bg-card border border-border rounded-lg text-center hover:border-primary/50">
                        <div className="w-full h-20 bg-gradient-to-b from-white to-[#1e1e1e] rounded mb-2" />
                        <span className="text-sm">System</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Accent Color</h4>
                    <div className="flex gap-3">
                      {["#007acc", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"].map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            color === "#007acc" ? "border-white" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === "trusted" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Trusted sources are expert authorities that the AI will prioritize when answering questions.
                  </p>
                  <div className="space-y-2">
                    {["Dr. Andrew Huberman", "Peter Attia", "Rhonda Patrick"].map((source) => (
                      <div
                        key={source}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                      >
                        <span>{source}</span>
                        <button className="text-xs text-destructive">Remove</button>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Add Trusted Source
                  </button>
                </div>
              )}

              {(activeSection === "keyboard" ||
                activeSection === "ai" ||
                activeSection === "guardrails" ||
                activeSection === "sync" ||
                activeSection === "notifications") && (
                <p className="text-muted-foreground">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} settings would appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
