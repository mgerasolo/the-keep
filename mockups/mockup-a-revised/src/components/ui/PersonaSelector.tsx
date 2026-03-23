"use client";

import { useState } from "react";
import { ChevronDown, Bot, GraduationCap, BarChart3, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type Persona = "default" | "coach" | "teacher" | "analyst" | "creative";

interface PersonaSelectorProps {
  value: Persona;
  onChange: (persona: Persona) => void;
}

const personas: { id: Persona; name: string; icon: typeof Bot; description: string }[] = [
  { id: "default", name: "Default", icon: Bot, description: "Balanced assistant" },
  { id: "coach", name: "Coach", icon: Sparkles, description: "Motivational guidance" },
  { id: "teacher", name: "Teacher", icon: GraduationCap, description: "Educational explanations" },
  { id: "analyst", name: "Analyst", icon: BarChart3, description: "Data-driven insights" },
  { id: "creative", name: "Creative", icon: Lightbulb, description: "Creative exploration" },
];

export function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPersona = personas.find((p) => p.id === value) || personas[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-secondary transition-colors text-sm"
      >
        <selectedPersona.icon className="w-4 h-4 text-primary" />
        <span>{selectedPersona.name}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
            <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
              AI Persona
            </div>
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  onChange(persona.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors text-left",
                  value === persona.id && "bg-secondary"
                )}
              >
                <persona.icon className={cn("w-4 h-4", value === persona.id ? "text-primary" : "text-muted-foreground")} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{persona.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{persona.description}</div>
                </div>
                {value === persona.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
