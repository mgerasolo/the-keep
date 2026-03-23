'use client';

/**
 * Diff Viewer Component
 * Shows side-by-side or unified diff of file changes
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface DiffViewerProps {
  original: string;
  modified: string;
  fileName?: string;
  mode?: 'unified' | 'split';
  onApply?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

/**
 * Simple line-based diff algorithm
 */
function computeDiff(original: string, modified: string): DiffLine[] {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = originalLines.length;
  const n = modifiedLines.length;

  // Build LCS table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalLines[i - 1] === modifiedLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  let i = m;
  let j = n;
  const reversedResult: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
      reversedResult.push({
        type: 'unchanged',
        content: originalLines[i - 1],
        oldLineNum: i,
        newLineNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      reversedResult.push({
        type: 'added',
        content: modifiedLines[j - 1],
        newLineNum: j,
      });
      j--;
    } else {
      reversedResult.push({
        type: 'removed',
        content: originalLines[i - 1],
        oldLineNum: i,
      });
      i--;
    }
  }

  return reversedResult.reverse();
}

export function DiffViewer({
  original,
  modified,
  fileName,
  mode = 'unified',
  onApply,
  onReject,
  showActions = true,
}: DiffViewerProps) {
  const diff = useMemo(() => computeDiff(original, modified), [original, modified]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const line of diff) {
      if (line.type === 'added') added++;
      if (line.type === 'removed') removed++;
    }
    return { added, removed };
  }, [diff]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          {fileName && (
            <span className="text-sm font-medium text-foreground">{fileName}</span>
          )}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">+{stats.added}</span>
            <span className="text-red-400">-{stats.removed}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReject}
              className="px-3 py-1 text-sm text-foreground-secondary hover:text-foreground bg-background border border-border rounded hover:bg-surface-hover"
            >
              Reject
            </button>
            <button
              onClick={onApply}
              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-500"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Diff content */}
      <div className="flex-1 overflow-auto">
        {mode === 'unified' ? (
          <UnifiedDiff diff={diff} />
        ) : (
          <SplitDiff diff={diff} />
        )}
      </div>
    </div>
  );
}

function UnifiedDiff({ diff }: { diff: DiffLine[] }) {
  return (
    <div className="font-mono text-sm">
      {diff.map((line, index) => (
        <div
          key={index}
          className={cn(
            'px-4 py-0.5 flex',
            line.type === 'added' && 'bg-green-900/30',
            line.type === 'removed' && 'bg-red-900/30'
          )}
        >
          {/* Line numbers */}
          <span className="w-12 text-right pr-3 text-foreground-secondary select-none">
            {line.oldLineNum || ''}
          </span>
          <span className="w-12 text-right pr-3 text-foreground-secondary select-none">
            {line.newLineNum || ''}
          </span>

          {/* Change indicator */}
          <span
            className={cn(
              'w-4 text-center select-none',
              line.type === 'added' && 'text-green-400',
              line.type === 'removed' && 'text-red-400'
            )}
          >
            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          </span>

          {/* Content */}
          <span
            className={cn(
              'flex-1 whitespace-pre',
              line.type === 'added' && 'text-green-300',
              line.type === 'removed' && 'text-red-300',
              line.type === 'unchanged' && 'text-foreground'
            )}
          >
            {line.content || ' '}
          </span>
        </div>
      ))}
    </div>
  );
}

function SplitDiff({ diff }: { diff: DiffLine[] }) {
  // Build paired lines for split view
  const pairedLines: Array<{
    left?: DiffLine;
    right?: DiffLine;
  }> = [];

  let leftBuffer: DiffLine[] = [];
  let rightBuffer: DiffLine[] = [];

  for (const line of diff) {
    if (line.type === 'unchanged') {
      // Flush buffers
      const maxLen = Math.max(leftBuffer.length, rightBuffer.length);
      for (let i = 0; i < maxLen; i++) {
        pairedLines.push({
          left: leftBuffer[i],
          right: rightBuffer[i],
        });
      }
      leftBuffer = [];
      rightBuffer = [];

      // Add unchanged line to both sides
      pairedLines.push({ left: line, right: line });
    } else if (line.type === 'removed') {
      leftBuffer.push(line);
    } else {
      rightBuffer.push(line);
    }
  }

  // Flush remaining
  const maxLen = Math.max(leftBuffer.length, rightBuffer.length);
  for (let i = 0; i < maxLen; i++) {
    pairedLines.push({
      left: leftBuffer[i],
      right: rightBuffer[i],
    });
  }

  return (
    <div className="flex font-mono text-sm">
      {/* Left (original) */}
      <div className="flex-1 border-r border-border">
        {pairedLines.map((pair, index) => (
          <div
            key={index}
            className={cn(
              'px-2 py-0.5 flex',
              pair.left?.type === 'removed' && 'bg-red-900/30'
            )}
          >
            <span className="w-8 text-right pr-2 text-foreground-secondary select-none">
              {pair.left?.oldLineNum || ''}
            </span>
            <span
              className={cn(
                'flex-1 whitespace-pre',
                pair.left?.type === 'removed'
                  ? 'text-red-300'
                  : 'text-foreground'
              )}
            >
              {pair.left?.content || ' '}
            </span>
          </div>
        ))}
      </div>

      {/* Right (modified) */}
      <div className="flex-1">
        {pairedLines.map((pair, index) => (
          <div
            key={index}
            className={cn(
              'px-2 py-0.5 flex',
              pair.right?.type === 'added' && 'bg-green-900/30'
            )}
          >
            <span className="w-8 text-right pr-2 text-foreground-secondary select-none">
              {pair.right?.newLineNum || ''}
            </span>
            <span
              className={cn(
                'flex-1 whitespace-pre',
                pair.right?.type === 'added'
                  ? 'text-green-300'
                  : 'text-foreground'
              )}
            >
              {pair.right?.content || ' '}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
