"use client";

import { useState } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  Archive,
  History,
  ChevronDown,
  Check,
  X,
  Flame,
  Sun,
  Snowflake,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MemoryTier = "hot" | "warm" | "cold";
type MemoryStatus = "active" | "archived" | "trash";

interface Memory {
  id: string;
  key: string;
  value: string;
  category: string;
  subject: string;
  tier: MemoryTier;
  status: MemoryStatus;
  source: string;
  lastModified: string;
  versions: MemoryVersion[];
}

interface MemoryVersion {
  id: string;
  value: string;
  timestamp: string;
  source: string;
}

// Sample memories for mockup
const sampleMemories: Memory[] = [
  {
    id: "mem-1",
    key: "preferred_model",
    value: "jarvis-chat",
    category: "preferences",
    subject: "AI Settings",
    tier: "hot",
    status: "active",
    source: "user",
    lastModified: "2026-03-22 10:30 AM",
    versions: [
      { id: "v3", value: "jarvis-chat", timestamp: "2026-03-22 10:30 AM", source: "user" },
      { id: "v2", value: "claude-3", timestamp: "2026-03-15 2:00 PM", source: "user" },
      { id: "v1", value: "gpt-4", timestamp: "2026-01-10 9:00 AM", source: "user" },
    ],
  },
  {
    id: "mem-2",
    key: "health_goal",
    value: "Maintain A1C below 5.5",
    category: "health",
    subject: "Health Goals",
    tier: "hot",
    status: "active",
    source: "extracted",
    lastModified: "2026-03-20 3:15 PM",
    versions: [
      { id: "v2", value: "Maintain A1C below 5.5", timestamp: "2026-03-20 3:15 PM", source: "extracted" },
      { id: "v1", value: "Reduce A1C to normal range", timestamp: "2026-01-05 11:00 AM", source: "user" },
    ],
  },
  {
    id: "mem-3",
    key: "primary_doctor",
    value: "Dr. Sarah Smith",
    category: "contacts",
    subject: "Healthcare",
    tier: "warm",
    status: "active",
    source: "user",
    lastModified: "2026-03-15 4:30 PM",
    versions: [
      { id: "v1", value: "Dr. Sarah Smith", timestamp: "2026-03-15 4:30 PM", source: "user" },
    ],
  },
  {
    id: "mem-4",
    key: "supplement_vitamin_d",
    value: "5000 IU daily with breakfast",
    category: "health",
    subject: "Supplements",
    tier: "warm",
    status: "active",
    source: "extracted",
    lastModified: "2026-03-18 9:00 AM",
    versions: [
      { id: "v2", value: "5000 IU daily with breakfast", timestamp: "2026-03-18 9:00 AM", source: "extracted" },
      { id: "v1", value: "2000 IU daily", timestamp: "2026-01-01 8:00 AM", source: "user" },
    ],
  },
  {
    id: "mem-5",
    key: "old_insurance_provider",
    value: "BlueCross BlueShield",
    category: "insurance",
    subject: "Healthcare",
    tier: "cold",
    status: "archived",
    source: "user",
    lastModified: "2025-12-01 10:00 AM",
    versions: [
      { id: "v1", value: "BlueCross BlueShield", timestamp: "2025-12-01 10:00 AM", source: "user" },
    ],
  },
];

const tierConfig: Record<MemoryTier, { icon: typeof Flame; color: string; label: string }> = {
  hot: { icon: Flame, color: "text-orange-400 bg-orange-500/20", label: "Hot" },
  warm: { icon: Sun, color: "text-yellow-400 bg-yellow-500/20", label: "Warm" },
  cold: { icon: Snowflake, color: "text-blue-400 bg-blue-500/20", label: "Cold" },
};

const statusConfig: Record<MemoryStatus, { color: string; label: string }> = {
  active: { color: "bg-green-500/20 text-green-400", label: "Active" },
  archived: { color: "bg-gray-500/20 text-gray-400", label: "Archived" },
  trash: { color: "bg-red-500/20 text-red-400", label: "Trash" },
};

export function MemoryGridPanel(props: IDockviewPanelProps) {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [filterStatus, setFilterStatus] = useState<MemoryStatus | "all">("all");
  const [filterTier, setFilterTier] = useState<MemoryTier | "all">("all");

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const matchesTier = filterTier === "all" || m.tier === filterTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const startEditing = (memory: Memory) => {
    setEditingId(memory.id);
    setEditValue(memory.value);
  };

  const saveEdit = (memoryId: string) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId
          ? {
              ...m,
              value: editValue,
              lastModified: new Date().toLocaleString(),
              versions: [
                { id: `v${m.versions.length + 1}`, value: editValue, timestamp: new Date().toLocaleString(), source: "user" },
                ...m.versions,
              ],
            }
          : m
      )
    );
    setEditingId(null);
  };

  const toggleStatus = (memoryId: string, newStatus: MemoryStatus) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, status: newStatus } : m))
    );
  };

  const revertToVersion = (memoryId: string, version: MemoryVersion) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId
          ? {
              ...m,
              value: version.value,
              lastModified: new Date().toLocaleString(),
              versions: [
                { id: `v${m.versions.length + 1}`, value: version.value, timestamp: new Date().toLocaleString(), source: "reverted" },
                ...m.versions,
              ],
            }
          : m
      )
    );
    setShowVersionHistory(false);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-medium">Memory Grid</span>
          <span className="text-xs text-muted-foreground">
            {filteredMemories.length} memories
          </span>
        </div>
        <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Add Memory">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-2 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded px-2 py-1.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search memories..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-1.5 rounded hover:bg-secondary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-xs bg-card border border-border rounded px-2 py-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MemoryStatus | "all")}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="trash">Trash</option>
          </select>
          <select
            className="text-xs bg-card border border-border rounded px-2 py-1"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value as MemoryTier | "all")}
          >
            <option value="all">All Tiers</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-card/50 sticky top-0">
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Key</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Value</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tier</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Source</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemories.map((memory) => {
              const TierIcon = tierConfig[memory.tier].icon;
              return (
                <tr
                  key={memory.id}
                  className={cn(
                    "border-b border-border hover:bg-card/50 cursor-pointer",
                    selectedMemory?.id === memory.id && "bg-card"
                  )}
                  onClick={() => setSelectedMemory(memory)}
                >
                  <td className="px-3 py-2 font-mono text-xs">{memory.key}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate">
                    {editingId === memory.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          className="flex-1 bg-card border border-border rounded px-2 py-0.5 text-sm"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEdit(memory.id);
                          }}
                          className="p-0.5 hover:bg-green-500/20 rounded"
                        >
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="p-0.5 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      memory.value
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 bg-secondary rounded text-xs">
                      {memory.category}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs", tierConfig[memory.tier].color)}>
                      <TierIcon className="w-3 h-3" />
                      {tierConfig[memory.tier].label}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("px-1.5 py-0.5 rounded text-xs", statusConfig[memory.status].color)}>
                      {statusConfig[memory.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground text-xs">{memory.source}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(memory);
                        }}
                        className="p-1 hover:bg-secondary rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMemory(memory);
                          setShowVersionHistory(true);
                        }}
                        className="p-1 hover:bg-secondary rounded"
                        title="Version History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(memory.id, memory.status === "active" ? "archived" : "active");
                        }}
                        className="p-1 hover:bg-secondary rounded"
                        title={memory.status === "active" ? "Archive" : "Restore"}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(memory.id, "trash");
                        }}
                        className="p-1 hover:bg-red-500/20 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && selectedMemory && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowVersionHistory(false)} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[80vh] bg-popover border border-border rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <h3 className="font-medium">Version History</h3>
                <p className="text-xs text-muted-foreground font-mono">{selectedMemory.key}</p>
              </div>
              <button onClick={() => setShowVersionHistory(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {selectedMemory.versions.map((version, index) => (
                <div
                  key={version.id}
                  className={cn(
                    "p-3 border border-border rounded-lg",
                    index === 0 && "bg-primary/5 border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {index === 0 ? "Current" : `Version ${selectedMemory.versions.length - index}`}
                      </span>
                      <span className="text-xs text-muted-foreground">{version.timestamp}</span>
                    </div>
                    {index !== 0 && (
                      <button
                        onClick={() => revertToVersion(selectedMemory.id, version)}
                        className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-secondary rounded"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Revert
                      </button>
                    )}
                  </div>
                  <p className="text-sm">{version.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">Source: {version.source}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
