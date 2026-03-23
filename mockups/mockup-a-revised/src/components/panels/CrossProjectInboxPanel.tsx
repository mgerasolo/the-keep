"use client";

import { useState } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  Inbox,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  ArrowRight,
  AlertCircle,
  GitPullRequest,
  Database,
  FileEdit,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RequestStatus = "pending" | "approved" | "denied";
type RequestType = "memory_update" | "file_reference" | "context_share";

interface InboxRequest {
  id: string;
  sourceProject: string;
  sourceIcon: string;
  type: RequestType;
  title: string;
  description: string;
  proposedChange?: string;
  currentValue?: string;
  timestamp: string;
  status: RequestStatus;
  priority: "low" | "medium" | "high";
}

const sampleRequests: InboxRequest[] = [
  {
    id: "req-1",
    sourceProject: "Infrastructure",
    sourceIcon: "server",
    type: "memory_update",
    title: "Update preferred AI model",
    description: "Infrastructure project wants to sync model preference",
    currentValue: "jarvis-chat",
    proposedChange: "claude-4-opus",
    timestamp: "2 hours ago",
    status: "pending",
    priority: "medium",
  },
  {
    id: "req-2",
    sourceProject: "Family Recipes",
    sourceIcon: "heart",
    type: "context_share",
    title: "Share dietary restrictions",
    description: "Family Recipes project requests access to your dietary preferences for meal planning",
    timestamp: "1 day ago",
    status: "pending",
    priority: "high",
  },
  {
    id: "req-3",
    sourceProject: "Work Projects",
    sourceIcon: "server",
    type: "file_reference",
    title: "Link health insurance docs",
    description: "Work Projects wants to reference your insurance provider information",
    timestamp: "3 days ago",
    status: "approved",
    priority: "low",
  },
  {
    id: "req-4",
    sourceProject: "Fitness Tracker",
    sourceIcon: "heart",
    type: "memory_update",
    title: "Sync exercise goals",
    description: "Fitness Tracker wants to update your exercise frequency goal",
    currentValue: "3x per week",
    proposedChange: "4x per week",
    timestamp: "1 week ago",
    status: "denied",
    priority: "low",
  },
];

const typeConfig: Record<RequestType, { icon: typeof Database; label: string; color: string }> = {
  memory_update: { icon: Database, label: "Memory Update", color: "text-blue-400" },
  file_reference: { icon: FileEdit, label: "File Reference", color: "text-green-400" },
  context_share: { icon: Eye, label: "Context Share", color: "text-purple-400" },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  high: { color: "text-red-400", bg: "bg-red-500/20" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/20" },
  low: { color: "text-gray-400", bg: "bg-gray-500/20" },
};

export function CrossProjectInboxPanel(props: IDockviewPanelProps) {
  const [requests, setRequests] = useState<InboxRequest[]>(sampleRequests);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const filteredRequests = requests.filter(
    (r) => filter === "all" || r.status === filter
  );

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as RequestStatus } : r))
    );
  };

  const handleDeny = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "denied" as RequestStatus } : r))
    );
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          <span className="font-medium">Cross-Project Inbox</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors flex items-center gap-1",
              filter === "pending" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <Clock className="w-3 h-3" />
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors flex items-center gap-1",
              filter === "approved" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <Check className="w-3 h-3" />
            Approved
          </button>
          <button
            onClick={() => setFilter("denied")}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors flex items-center gap-1",
              filter === "denied" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <X className="w-3 h-3" />
            Denied
          </button>
        </div>
      </div>

      {/* Request List */}
      <div className="flex-1 overflow-auto">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Inbox className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No requests</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRequests.map((request) => {
              const TypeIcon = typeConfig[request.type].icon;
              const isExpanded = expandedId === request.id;

              return (
                <div key={request.id} className="p-3">
                  {/* Request Header */}
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    {/* Expand indicator */}
                    <button className="mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* Type Icon */}
                    <div className={cn("p-1.5 rounded", typeConfig[request.type].color, "bg-current/10")}>
                      <TypeIcon className={cn("w-4 h-4", typeConfig[request.type].color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm">{request.title}</span>
                        <span className={cn("px-1.5 py-0.5 text-xs rounded", priorityConfig[request.priority].bg, priorityConfig[request.priority].color)}>
                          {request.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>From: {request.sourceProject}</span>
                        <span>•</span>
                        <span>{request.timestamp}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {request.status === "pending" ? (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                          Pending
                        </span>
                      ) : request.status === "approved" ? (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Denied
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-3 ml-7 space-y-3">
                      <p className="text-sm text-muted-foreground">{request.description}</p>

                      {/* Proposed Change */}
                      {request.type === "memory_update" && request.proposedChange && (
                        <div className="bg-card border border-border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-2">Proposed Change</div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-sm line-through">
                              {request.currentValue}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-sm">
                              {request.proposedChange}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {request.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-sm transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(request.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
