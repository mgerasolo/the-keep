"use client";

import { FileText, Clock, Link2, Folder } from "lucide-react";
import { FileNode } from "@/stores/workspace";

interface FileMetadataBarProps {
  file: FileNode;
}

export function FileMetadataBar({ file }: FileMetadataBarProps) {
  return (
    <div className="h-6 bg-card border-b border-border flex items-center px-3 text-xs text-muted-foreground gap-4">
      {/* Full path */}
      <div className="flex items-center gap-1.5 truncate">
        <Folder className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{file.path || `/${file.name}`}</span>
      </div>

      {/* Separator */}
      <div className="w-px h-3 bg-border" />

      {/* Last modified */}
      {file.lastModified && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="w-3 h-3" />
          <span>{file.lastModified}</span>
        </div>
      )}

      {/* Separator */}
      {file.backlinks !== undefined && <div className="w-px h-3 bg-border" />}

      {/* Backlinks */}
      {file.backlinks !== undefined && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Link2 className="w-3 h-3" />
          <span>{file.backlinks} backlinks</span>
        </div>
      )}
    </div>
  );
}
