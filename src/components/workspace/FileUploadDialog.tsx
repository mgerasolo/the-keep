'use client';

/**
 * File Upload Dialog
 * Drag-and-drop file upload with progress
 */

import { useState, useCallback, useRef } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores';
import { api } from '@/lib/trpc/react';
import { toast } from '@/components/ui/toaster';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  path?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export function FileUploadDialog({ isOpen, onClose, path = '/' }: FileUploadDialogProps) {
  const { activeProjectId } = useProjectStore();
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [
      ...prev,
      ...fileArray.map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const,
      })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const uploadFile = async (fileData: UploadingFile, index: number): Promise<boolean> => {
    if (!activeProjectId) return false;

    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: 'uploading', progress: 0 } : f))
    );

    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('projectId', activeProjectId);
    formData.append('path', path);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, status: 'complete', progress: 100 } : f))
      );
      return true;
    } catch (error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Failed' }
            : f
        )
      );
      return false;
    }
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');

    // Upload all pending files and collect results
    const results = await Promise.all(
      pendingFiles.map((f) => uploadFile(f, files.indexOf(f)))
    );

    // Refresh file list
    utils.files.list.invalidate();

    // Count successes and failures from results
    const completed = results.filter((success) => success).length;
    const errors = results.filter((success) => !success).length;

    if (errors === 0) {
      toast.success(`Uploaded ${completed} file${completed === 1 ? '' : 's'}`);
      handleClose();
    } else {
      toast.error(`${errors} file${errors === 1 ? '' : 's'} failed to upload`);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setIsDragOver(false);
    onClose();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const isUploading = files.some((f) => f.status === 'uploading');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files">
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragOver ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}
          `}
        >
          <div className="text-4xl mb-2">📁</div>
          <p className="text-foreground">
            {isDragOver ? 'Drop files here' : 'Drag files here or click to browse'}
          </p>
          <p className="text-sm text-foreground-secondary mt-1">
            Supports any file type
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-auto">
            {files.map((fileData, index) => (
              <div
                key={`${fileData.file.name}-${index}`}
                className="flex items-center gap-2 p-2 bg-surface rounded"
              >
                <span className="text-lg">
                  {fileData.status === 'complete' && '✅'}
                  {fileData.status === 'error' && '❌'}
                  {fileData.status === 'uploading' && '⏳'}
                  {fileData.status === 'pending' && '📄'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{fileData.file.name}</p>
                  <p className="text-xs text-foreground-secondary">
                    {formatFileSize(fileData.file.size)}
                    {fileData.error && (
                      <span className="text-red-400 ml-2">{fileData.error}</span>
                    )}
                  </p>
                </div>
                {fileData.status === 'pending' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-foreground-secondary hover:text-red-400 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={pendingCount === 0 || isUploading}
          isLoading={isUploading}
        >
          Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
