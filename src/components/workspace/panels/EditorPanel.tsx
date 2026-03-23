'use client';

/**
 * Editor Panel Component
 * Opens files for editing/viewing in dockview tabs
 * Handles: markdown, code, images, PDFs, and other file types
 */

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { IDockviewPanelProps } from 'dockview-react';
import { MarkdownEditor } from '@/components/editor';
import { toast } from '@/components/ui/toaster';

// Dynamic import for Monaco to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@/components/editor/MonacoEditor').then((m) => m.MonacoEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-foreground-secondary">
        Loading editor...
      </div>
    ),
  }
);

interface EditorPanelParams {
  fileId: string;
  fileName: string;
  mimeType?: string;
}

// Get Monaco language from mime type or file extension
function getMonacoLanguage(mimeType?: string, fileName?: string): string {
  const ext = fileName?.split('.').pop()?.toLowerCase();

  const mimeMap: Record<string, string> = {
    'application/json': 'json',
    'text/javascript': 'javascript',
    'application/javascript': 'javascript',
    'text/typescript': 'typescript',
    'text/html': 'html',
    'text/css': 'css',
    'text/yaml': 'yaml',
    'application/x-yaml': 'yaml',
    'text/xml': 'xml',
    'application/xml': 'xml',
    'text/x-python': 'python',
    'text/x-java': 'java',
    'text/x-rust': 'rust',
    'text/x-go': 'go',
    'text/x-sql': 'sql',
    'text/plain': 'plaintext',
  };

  const extMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    py: 'python',
    java: 'java',
    rs: 'rust',
    go: 'go',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    dockerfile: 'dockerfile',
    md: 'markdown',
    txt: 'plaintext',
  };

  if (mimeType && mimeMap[mimeType]) {
    return mimeMap[mimeType];
  }
  if (ext && extMap[ext]) {
    return extMap[ext];
  }
  return 'plaintext';
}

// Determine file type category
function getFileTypeCategory(mimeType?: string, fileName?: string): 'markdown' | 'code' | 'image' | 'pdf' | 'other' {
  const ext = fileName?.split('.').pop()?.toLowerCase();

  if (mimeType === 'text/markdown' || ext === 'md') {
    return 'markdown';
  }
  if (mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    return 'pdf';
  }
  if (
    mimeType?.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/xml' ||
    mimeType === 'application/x-yaml' ||
    ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'scss', 'yaml', 'yml', 'xml', 'py', 'java', 'rs', 'go', 'sql', 'sh', 'bash', 'txt'].includes(ext || '')
  ) {
    return 'code';
  }
  return 'other';
}

export function EditorPanel(props: IDockviewPanelProps<EditorPanelParams>) {
  const { fileId, fileName, mimeType } = props.params as EditorPanelParams;
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const fileType = getFileTypeCategory(mimeType, fileName);
  const isTextBased = fileType === 'markdown' || fileType === 'code';

  // Fetch file content from MinIO
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/files/${fileId}/content`);
        if (!response.ok) {
          throw new Error('Failed to load file');
        }

        if (isTextBased) {
          const text = await response.text();
          setContent(text);
        } else {
          // For binary files (images, PDFs), create blob URL
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      } catch (error) {
        console.error('Error loading file:', error);
        toast.error('Failed to load file');
      } finally {
        setIsLoading(false);
      }
    };

    if (fileId) {
      fetchContent();
    }

    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fileId, isTextBased]);

  // Save file content
  const handleSave = useCallback(async () => {
    if (!isTextBased) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/files/${fileId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: content,
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      toast.success('Saved');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [fileId, content, isTextBased]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground-secondary">
        Loading {fileName}...
      </div>
    );
  }

  // Render based on file type
  switch (fileType) {
    case 'markdown':
      return (
        <MarkdownEditor
          content={content}
          onChange={setContent}
          onSave={handleSave}
          fileName={fileName}
        />
      );

    case 'code':
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface">
            <span className="text-sm text-foreground">{fileName}</span>
            {isSaving ? (
              <span className="text-sm text-foreground-secondary">Saving...</span>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90"
              >
                Save
              </button>
            )}
          </div>
          <div className="flex-1">
            <MonacoEditor
              value={content}
              onChange={setContent}
              onSave={handleSave}
              language={getMonacoLanguage(mimeType, fileName)}
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center px-3 py-2 border-b border-border bg-surface">
            <span className="text-sm text-foreground">{fileName}</span>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            {blobUrl && (
              <img
                src={blobUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded shadow-lg"
              />
            )}
          </div>
        </div>
      );

    case 'pdf':
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center px-3 py-2 border-b border-border bg-surface">
            <span className="text-sm text-foreground">{fileName}</span>
          </div>
          <div className="flex-1">
            {blobUrl && (
              <iframe
                src={blobUrl}
                className="w-full h-full border-none"
                title={fileName}
              />
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center px-3 py-2 border-b border-border bg-surface">
            <span className="text-sm text-foreground">{fileName}</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-foreground-secondary">
                Preview not available for this file type
              </p>
              <p className="text-sm text-foreground-secondary/70 mt-1">
                {mimeType || 'Unknown type'}
              </p>
              {blobUrl && (
                <a
                  href={blobUrl}
                  download={fileName}
                  className="mt-4 inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      );
  }
}
