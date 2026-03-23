'use client';

/**
 * File Context Menu
 * Right-click menu for file and folder operations
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface FileContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function FileContextMenu({ x, y, items, onClose }: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 36 - 20);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[160px]"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div key={index} className="h-px bg-border my-1" />
          );
        }

        return (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={cn(
              'w-full px-3 py-1.5 text-sm text-left flex items-center gap-2',
              'hover:bg-surface-hover transition-colors',
              item.danger && 'text-red-400 hover:text-red-300'
            )}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Helper to build menu items for files
export function getFileMenuItems(options: {
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}): ContextMenuItem[] {
  return [
    { label: 'Open', icon: '📄', action: options.onOpen },
    { label: 'Rename', icon: '✏️', action: options.onRename },
    { label: 'Duplicate', icon: '📋', action: options.onDuplicate },
    { separator: true, label: '', action: () => {} },
    { label: 'Delete', icon: '🗑️', action: options.onDelete, danger: true },
  ];
}

// Helper to build menu items for folders
export function getFolderMenuItems(options: {
  onNewFolder: () => void;
  onNewFile: () => void;
  onRename: () => void;
  onDelete: () => void;
}): ContextMenuItem[] {
  return [
    { label: 'New Folder', icon: '📁', action: options.onNewFolder },
    { label: 'New File', icon: '📄', action: options.onNewFile },
    { separator: true, label: '', action: () => {} },
    { label: 'Rename', icon: '✏️', action: options.onRename },
    { separator: true, label: '', action: () => {} },
    { label: 'Delete', icon: '🗑️', action: options.onDelete, danger: true },
  ];
}

// Helper to build menu items for empty space
export function getEmptySpaceMenuItems(options: {
  onNewFolder: () => void;
  onNewFile: () => void;
  onUpload: () => void;
}): ContextMenuItem[] {
  return [
    { label: 'New Folder', icon: '📁', action: options.onNewFolder },
    { label: 'New File', icon: '📄', action: options.onNewFile },
    { separator: true, label: '', action: () => {} },
    { label: 'Upload Files', icon: '⬆️', action: options.onUpload },
  ];
}
