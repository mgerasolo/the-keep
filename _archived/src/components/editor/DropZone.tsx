'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Check, Loader2 } from 'lucide-react'
import { createFile } from '@/actions/vault'
import { useVaultStore } from '@/stores/vault'

interface DropZoneProps {
  children: React.ReactNode
}

interface UploadingFile {
  name: string
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export function DropZone({ children }: DropZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const triggerTreeRefresh = useVaultStore((s) => s.triggerTreeRefresh)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Filter to only accept markdown files or convert text files
    const validFiles = acceptedFiles.filter(
      (file) => file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type.startsWith('text/')
    )

    if (validFiles.length === 0) {
      return
    }

    // Start uploading
    setUploadingFiles(
      validFiles.map((f) => ({ name: f.name, status: 'uploading' as const }))
    )

    // Process each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      try {
        const content = await file.text()
        const fileName = file.name.endsWith('.md')
          ? file.name
          : file.name.replace(/\.[^.]+$/, '.md')

        const success = await createFile(fileName, content)

        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: success ? 'success' : 'error', error: success ? undefined : 'Failed to create file' }
              : f
          )
        )
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'error', error: 'Failed to read file' }
              : f
          )
        )
      }
    }

    // Refresh the file tree
    triggerTreeRefresh()

    // Clear upload status after delay
    setTimeout(() => {
      setUploadingFiles([])
    }, 3000)
  }, [triggerTreeRefresh])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'text/plain': ['.txt', '.md'],
      'text/markdown': ['.md'],
    },
  })

  return (
    <div {...getRootProps()} className="relative h-full w-full">
      <input {...getInputProps()} />

      {/* Main content */}
      {children}

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-primary bg-background/90 p-12 shadow-xl">
            <Upload className="h-16 w-16 text-primary" />
            <div className="text-center">
              <p className="text-xl font-semibold text-foreground">Drop files here</p>
              <p className="text-sm text-muted-foreground">
                Markdown (.md) and text files will be added to your vault
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload progress toast */}
      {uploadingFiles.length > 0 && (
        <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2">
          {uploadingFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-border bg-popover px-4 py-3 shadow-lg"
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm">{file.name}</span>
              {file.status === 'uploading' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {file.status === 'success' && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {file.status === 'error' && (
                <X className="h-4 w-4 text-destructive" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
