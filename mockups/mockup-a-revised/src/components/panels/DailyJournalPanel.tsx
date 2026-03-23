"use client";

import { useState } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  Brain,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  type: "task" | "note" | "memory" | "conversation" | "insight";
  content: string;
  timestamp: string;
  completed?: boolean;
  project?: string;
  source?: string;
}

interface DayData {
  date: string;
  entries: JournalEntry[];
  summary?: string;
}

// Sample data for the mockup
const sampleDays: Record<string, DayData> = {
  "2026-03-22": {
    date: "2026-03-22",
    summary: "Reviewed lab results, updated supplement stack, 3 tasks completed",
    entries: [
      {
        id: "e1",
        type: "task",
        content: "Review March bloodwork results",
        timestamp: "10:30 AM",
        completed: true,
        project: "Health Records",
      },
      {
        id: "e2",
        type: "conversation",
        content: "Discussed A1C improvements with AI assistant",
        timestamp: "10:45 AM",
        source: "AI Chat",
      },
      {
        id: "e3",
        type: "memory",
        content: "Extracted: Health goal - Maintain A1C below 5.5",
        timestamp: "10:50 AM",
        source: "Auto-extracted",
      },
      {
        id: "e4",
        type: "task",
        content: "Update daily supplement stack documentation",
        timestamp: "11:15 AM",
        completed: true,
        project: "Health Records",
      },
      {
        id: "e5",
        type: "insight",
        content: "Pattern detected: Lab results improving since January",
        timestamp: "11:30 AM",
        source: "AI Analysis",
      },
      {
        id: "e6",
        type: "note",
        content: "Schedule follow-up appointment with Dr. Smith",
        timestamp: "2:00 PM",
      },
      {
        id: "e7",
        type: "task",
        content: "Research omega-3 dosage for LDL management",
        timestamp: "3:30 PM",
        completed: false,
        project: "Health Records",
      },
    ],
  },
  "2026-03-21": {
    date: "2026-03-21",
    summary: "Project planning session, 5 tasks completed",
    entries: [
      {
        id: "e8",
        type: "task",
        content: "Review HOA meeting minutes",
        timestamp: "9:00 AM",
        completed: true,
        project: "HOA Documents",
      },
      {
        id: "e9",
        type: "conversation",
        content: "Planned infrastructure updates with AI",
        timestamp: "10:00 AM",
        source: "AI Chat",
      },
      {
        id: "e10",
        type: "note",
        content: "New server deployment scheduled for next week",
        timestamp: "10:30 AM",
      },
    ],
  },
  "2026-03-20": {
    date: "2026-03-20",
    summary: "Documentation day, 2 files updated",
    entries: [
      {
        id: "e11",
        type: "task",
        content: "Update profile.md with new health info",
        timestamp: "11:00 AM",
        completed: true,
        project: "Health Records",
      },
    ],
  },
};

const typeConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  task: { icon: CheckCircle2, color: "text-green-400", label: "Task" },
  note: { icon: FileText, color: "text-blue-400", label: "Note" },
  memory: { icon: Brain, color: "text-purple-400", label: "Memory" },
  conversation: { icon: MessageSquare, color: "text-cyan-400", label: "Conversation" },
  insight: { icon: Sparkles, color: "text-yellow-400", label: "Insight" },
};

export function DailyJournalPanel(props: IDockviewPanelProps) {
  const [currentDate, setCurrentDate] = useState("2026-03-22");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const currentDay = sampleDays[currentDate];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(date.toISOString().split("T")[0]);
  };

  // Generate calendar days for the week view
  const getWeekDays = () => {
    const current = new Date(currentDate);
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: day.getDate(),
        hasEntries: !!sampleDays[dateStr],
        isToday: dateStr === "2026-03-22",
        isSelected: dateStr === currentDate,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const stats = currentDay
    ? {
        tasks: currentDay.entries.filter((e) => e.type === "task").length,
        completed: currentDay.entries.filter((e) => e.type === "task" && e.completed).length,
        conversations: currentDay.entries.filter((e) => e.type === "conversation").length,
        memories: currentDay.entries.filter((e) => e.type === "memory").length,
      }
    : { tasks: 0, completed: 0, conversations: 0, memories: 0 };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-medium">Daily Journal</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("day")}
            className={cn(
              "px-2 py-1 text-xs rounded",
              viewMode === "day" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={cn(
              "px-2 py-1 text-xs rounded",
              viewMode === "week" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            Week
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDay("prev")}
            className="p-1 hover:bg-secondary rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">{formatDate(currentDate)}</span>
          <button
            onClick={() => navigateDay("next")}
            className="p-1 hover:bg-secondary rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Week View Calendar Strip */}
        {viewMode === "week" && (
          <div className="flex items-center gap-1 mt-3">
            {weekDays.map((day) => (
              <button
                key={day.date}
                onClick={() => setCurrentDate(day.date)}
                className={cn(
                  "flex-1 flex flex-col items-center py-2 rounded transition-colors",
                  day.isSelected && "bg-primary text-primary-foreground",
                  !day.isSelected && day.isToday && "bg-primary/20",
                  !day.isSelected && !day.isToday && "hover:bg-secondary"
                )}
              >
                <span className="text-xs text-muted-foreground">{day.dayName}</span>
                <span className="text-sm font-medium">{day.dayNum}</span>
                {day.hasEntries && !day.isSelected && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>
              {stats.completed}/{stats.tasks} tasks
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.conversations} chats</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>{stats.memories} memories</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        {currentDay ? (
          <div className="p-4">
            {/* Summary */}
            {currentDay.summary && (
              <div className="mb-4 p-3 bg-card/50 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Daily Summary</span>
                </div>
                <p className="text-sm">{currentDay.summary}</p>
              </div>
            )}

            {/* Timeline Entries */}
            <div className="space-y-3">
              {currentDay.entries.map((entry, index) => {
                const TypeIcon = typeConfig[entry.type].icon;
                return (
                  <div key={entry.id} className="flex gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          entry.type === "task" && entry.completed
                            ? "bg-green-500/20"
                            : "bg-card border border-border"
                        )}
                      >
                        {entry.type === "task" ? (
                          entry.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )
                        ) : (
                          <TypeIcon className={cn("w-4 h-4", typeConfig[entry.type].color)} />
                        )}
                      </div>
                      {index < currentDay.entries.length - 1 && (
                        <div className="w-px flex-1 bg-border my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                        {entry.project && (
                          <span className="px-1.5 py-0.5 bg-secondary rounded text-xs">
                            {entry.project}
                          </span>
                        )}
                        {entry.source && (
                          <span className="text-xs text-muted-foreground italic">
                            {entry.source}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          entry.type === "task" && entry.completed && "text-muted-foreground line-through"
                        )}
                      >
                        {entry.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Calendar className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No entries for this day</p>
            <button className="mt-2 flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm">
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        )}
      </div>

      {/* Add Entry Button */}
      {currentDay && (
        <div className="px-4 py-3 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Add Journal Entry
          </button>
        </div>
      )}
    </div>
  );
}
