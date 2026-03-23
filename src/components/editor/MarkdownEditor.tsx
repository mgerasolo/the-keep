'use client';

/**
 * Markdown Editor Component
 * Unified editor with Source/Preview/Split modes and AI editing
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';

// Dynamic imports to avoid SSR issues with Monaco
const MonacoEditor = dynamic(() => import('./MonacoEditor').then((m) => m.MonacoEditor), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-foreground-secondary">Loading editor...</div>,
});

const TipTapEditor = dynamic(() => import('./TipTapEditor').then((m) => m.TipTapEditor), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-foreground-secondary">Loading editor...</div>,
});

const DiffViewer = dynamic(() => import('./DiffViewer').then((m) => m.DiffViewer), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-foreground-secondary">Loading diff viewer...</div>,
});

export type EditorMode = 'source' | 'preview' | 'split' | 'diff';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  defaultMode?: EditorMode;
  readOnly?: boolean;
  fileName?: string;
}

interface AIEditState {
  isOpen: boolean;
  isLoading: boolean;
  instruction: string;
  proposedContent: string | null;
}

export function MarkdownEditor({
  content,
  onChange,
  onSave,
  defaultMode = 'source',
  readOnly = false,
  fileName,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<EditorMode>(defaultMode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiEdit, setAiEdit] = useState<AIEditState>({
    isOpen: false,
    isLoading: false,
    instruction: '',
    proposedContent: null,
  });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  // Handle content changes with auto-save debounce
  const handleChange = useCallback(
    (newContent: string) => {
      onChange(newContent);
      setHasUnsavedChanges(true);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        onSave?.();
        setHasUnsavedChanges(false);
      }, 2000);
    },
    [onChange, onSave]
  );

  // Handle TipTap changes (receives both HTML and markdown)
  const handleTipTapChange = useCallback(
    (_html: string, markdown: string) => {
      handleChange(markdown);
    },
    [handleChange]
  );

  // Manual save
  const handleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave?.();
    setHasUnsavedChanges(false);
  }, [onSave]);

  // Open AI edit mode
  const openAIEdit = useCallback(() => {
    setAiEdit((prev) => ({ ...prev, isOpen: true }));
    setTimeout(() => aiInputRef.current?.focus(), 100);
  }, []);

  // Close AI edit mode
  const closeAIEdit = useCallback(() => {
    setAiEdit({
      isOpen: false,
      isLoading: false,
      instruction: '',
      proposedContent: null,
    });
    if (mode === 'diff') {
      setMode('source');
    }
  }, [mode]);

  // Submit AI edit request
  const submitAIEdit = useCallback(async () => {
    if (!aiEdit.instruction.trim()) return;

    setAiEdit((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          instruction: aiEdit.instruction,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI edit');
      }

      const data = await response.json();
      setAiEdit((prev) => ({
        ...prev,
        isLoading: false,
        proposedContent: data.edited,
      }));
      setMode('diff');
    } catch (error) {
      console.error('AI edit error:', error);
      toast.error('Failed to get AI suggestion');
      setAiEdit((prev) => ({ ...prev, isLoading: false }));
    }
  }, [content, aiEdit.instruction, fileName]);

  // Apply AI edit
  const applyAIEdit = useCallback(() => {
    if (aiEdit.proposedContent) {
      onChange(aiEdit.proposedContent);
      handleSave();
      toast.success('Changes applied');
      closeAIEdit();
    }
  }, [aiEdit.proposedContent, onChange, handleSave, closeAIEdit]);

  // Reject AI edit
  const rejectAIEdit = useCallback(() => {
    setAiEdit((prev) => ({ ...prev, proposedContent: null }));
    setMode('source');
    toast.info('Changes discarded');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+E - toggle modes
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setMode((prev) => {
          if (prev === 'source') return 'preview';
          if (prev === 'preview') return 'source';
          return prev;
        });
      }
      // Ctrl+\ - toggle split
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setMode((prev) => (prev === 'split' ? 'source' : 'split'));
      }
      // Ctrl+I - open AI edit
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        openAIEdit();
      }
      // Escape - close AI edit
      if (e.key === 'Escape' && aiEdit.isOpen) {
        closeAIEdit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiEdit.isOpen, openAIEdit, closeAIEdit]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          {fileName && (
            <span className="text-sm text-foreground">
              {fileName}
              {hasUnsavedChanges && <span className="ml-1 text-accent">●</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* AI Edit button */}
          {!readOnly && (
            <button
              onClick={openAIEdit}
              className="flex items-center gap-1.5 px-2.5 py-1 text-sm text-foreground-secondary hover:text-foreground bg-background border border-border rounded hover:bg-surface-hover transition-colors"
              title="AI Edit (Ctrl+I)"
            >
              <span>🤖</span>
              <span>AI Edit</span>
            </button>
          )}

          {/* Mode toggle buttons */}
          <div className="flex items-center gap-1 bg-background rounded-lg p-0.5">
            <button
              onClick={() => setMode('source')}
              disabled={mode === 'diff'}
              className={cn(
                'px-3 py-1 text-sm rounded transition-colors',
                mode === 'source'
                  ? 'bg-accent text-white'
                  : 'text-foreground-secondary hover:text-foreground disabled:opacity-50'
              )}
            >
              Source
            </button>
            <button
              onClick={() => setMode('split')}
              disabled={mode === 'diff'}
              className={cn(
                'px-3 py-1 text-sm rounded transition-colors',
                mode === 'split'
                  ? 'bg-accent text-white'
                  : 'text-foreground-secondary hover:text-foreground disabled:opacity-50'
              )}
            >
              Split
            </button>
            <button
              onClick={() => setMode('preview')}
              disabled={mode === 'diff'}
              className={cn(
                'px-3 py-1 text-sm rounded transition-colors',
                mode === 'preview'
                  ? 'bg-accent text-white'
                  : 'text-foreground-secondary hover:text-foreground disabled:opacity-50'
              )}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* AI Edit bar */}
      {aiEdit.isOpen && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-hover">
          <span className="text-sm text-foreground-secondary">🤖</span>
          <input
            ref={aiInputRef}
            type="text"
            value={aiEdit.instruction}
            onChange={(e) => setAiEdit((prev) => ({ ...prev, instruction: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !aiEdit.isLoading) {
                submitAIEdit();
              }
            }}
            placeholder="Describe the changes you want to make..."
            disabled={aiEdit.isLoading}
            className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
          <button
            onClick={submitAIEdit}
            disabled={!aiEdit.instruction.trim() || aiEdit.isLoading}
            className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:bg-accent/90 disabled:opacity-50"
          >
            {aiEdit.isLoading ? 'Processing...' : 'Submit'}
          </button>
          <button
            onClick={closeAIEdit}
            className="p-1.5 text-foreground-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'diff' && aiEdit.proposedContent !== null ? (
          <DiffViewer
            original={content}
            modified={aiEdit.proposedContent}
            fileName={fileName}
            onApply={applyAIEdit}
            onReject={rejectAIEdit}
          />
        ) : mode === 'source' ? (
          <MonacoEditor
            value={content}
            onChange={handleChange}
            onSave={handleSave}
            readOnly={readOnly}
          />
        ) : mode === 'preview' ? (
          <TipTapEditor
            content={content}
            onChange={handleTipTapChange}
            onSave={handleSave}
            readOnly={readOnly}
          />
        ) : (
          <div className="flex h-full">
            <div className="flex-1 border-r border-border">
              <MonacoEditor
                value={content}
                onChange={handleChange}
                onSave={handleSave}
                readOnly={readOnly}
              />
            </div>
            <div className="flex-1">
              <TipTapEditor
                content={content}
                onChange={handleTipTapChange}
                onSave={handleSave}
                readOnly={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
