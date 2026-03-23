"use client";

import { useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  Home,
  Briefcase,
  BookOpen,
  Dumbbell,
  DollarSign,
  Brain,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewProjectWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const projectTypes = [
  { id: "health", label: "Health & Wellness", icon: Heart, color: "text-red-400" },
  { id: "home", label: "Home & Property", icon: Home, color: "text-blue-400" },
  { id: "work", label: "Work & Career", icon: Briefcase, color: "text-purple-400" },
  { id: "learning", label: "Learning & Education", icon: BookOpen, color: "text-green-400" },
  { id: "fitness", label: "Fitness & Sports", icon: Dumbbell, color: "text-orange-400" },
  { id: "finance", label: "Finance & Investing", icon: DollarSign, color: "text-yellow-400" },
  { id: "custom", label: "Custom Project", icon: Brain, color: "text-pink-400" },
];

export function NewProjectWizard({ open, onOpenChange }: NewProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!open) return null;

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && projectName) {
      setStep(3);
      // Simulate AI generation
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setProjectName("");
    setIsGenerating(false);
    onOpenChange(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-popover border border-border rounded-lg shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">New Project</h2>
            </div>
            <button onClick={handleClose} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "w-12 h-0.5",
                        step > s ? "bg-primary" : "bg-secondary"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Choose Type</span>
              <span>Name Project</span>
              <span>AI Setup</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  What kind of knowledge will you manage in this project?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border transition-colors text-left",
                        selectedType === type.id
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border hover:bg-secondary"
                      )}
                    >
                      <type.icon className={cn("w-5 h-5", type.color)} />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Give your project a name. This will be visible in the sidebar.
                </p>
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., My Health Records"
                    className="w-full mt-2 px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <textarea
                    placeholder="What will you track in this project?"
                    className="w-full mt-2 px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center py-8">
                {isGenerating ? (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-lg font-medium">Setting Up Your Project</h3>
                    <p className="text-sm text-muted-foreground">
                      AI is analyzing your project type and creating personalized settings...
                    </p>
                    <div className="flex justify-center gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium">Project Created!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your project "{projectName}" is ready. The AI has configured:
                    </p>
                    <ul className="text-sm text-left bg-card p-4 rounded-lg space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Default folder structure
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Suggested tags and categories
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        AI guardrails for this topic
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Recommended trusted sources
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                step === 1
                  ? "text-muted-foreground cursor-not-allowed"
                  : "hover:bg-secondary"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedType) || (step === 2 && !projectName)
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  (step === 1 && !selectedType) || (step === 2 && !projectName)
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isGenerating ? "Creating..." : "Open Project"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
