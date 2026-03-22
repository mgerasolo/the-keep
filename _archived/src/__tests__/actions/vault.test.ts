import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'

// Mock fs/promises before importing the actions
const mockReaddir = vi.fn()
const mockReadFile = vi.fn()
const mockWriteFile = vi.fn()
const mockMkdir = vi.fn()
const mockUnlink = vi.fn()
const mockRm = vi.fn()
const mockRename = vi.fn()
const mockStat = vi.fn()

vi.mock('fs/promises', () => ({
  default: {
    readdir: (...args: unknown[]) => mockReaddir(...args),
    readFile: (...args: unknown[]) => mockReadFile(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
    mkdir: (...args: unknown[]) => mockMkdir(...args),
    unlink: (...args: unknown[]) => mockUnlink(...args),
    rm: (...args: unknown[]) => mockRm(...args),
    rename: (...args: unknown[]) => mockRename(...args),
    stat: (...args: unknown[]) => mockStat(...args),
  },
  readdir: (...args: unknown[]) => mockReaddir(...args),
  readFile: (...args: unknown[]) => mockReadFile(...args),
  writeFile: (...args: unknown[]) => mockWriteFile(...args),
  mkdir: (...args: unknown[]) => mockMkdir(...args),
  unlink: (...args: unknown[]) => mockUnlink(...args),
  rm: (...args: unknown[]) => mockRm(...args),
  rename: (...args: unknown[]) => mockRename(...args),
  stat: (...args: unknown[]) => mockStat(...args),
}))

// Import after mocking
import {
  getVaultTree,
  getFileContent,
  createFile,
  updateFile,
  deleteFile,
  renameFile,
  createFolder,
} from '@/actions/vault'

describe('vault actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getVaultTree', () => {
    it('should return file tree for vault directory', async () => {
      mockReaddir.mockResolvedValueOnce([
        { name: 'notes', isDirectory: () => true },
        { name: 'readme.md', isDirectory: () => false },
        { name: '.hidden', isDirectory: () => false },
      ])
      mockReaddir.mockResolvedValueOnce([
        { name: 'todo.md', isDirectory: () => false },
      ])

      const result = await getVaultTree()

      expect(result).toHaveLength(2) // Folder + file (hidden excluded)
      expect(result[0]).toEqual({
        id: 'notes',
        name: 'notes',
        path: 'notes',
        type: 'folder',
        children: [
          {
            id: path.join('notes', 'todo.md'),
            name: 'todo.md',
            path: path.join('notes', 'todo.md'),
            type: 'file',
          },
        ],
      })
      expect(result[1]).toEqual({
        id: 'readme.md',
        name: 'readme.md',
        path: 'readme.md',
        type: 'file',
      })
    })

    it('should sort folders before files', async () => {
      mockReaddir.mockResolvedValueOnce([
        { name: 'zebra.md', isDirectory: () => false },
        { name: 'archive', isDirectory: () => true },
        { name: 'alpha.md', isDirectory: () => false },
      ])
      mockReaddir.mockResolvedValueOnce([]) // Empty archive folder

      const result = await getVaultTree()

      expect(result[0].type).toBe('folder')
      expect(result[0].name).toBe('archive')
      expect(result[1].name).toBe('alpha.md')
      expect(result[2].name).toBe('zebra.md')
    })

    it('should return empty array on error', async () => {
      mockReaddir.mockRejectedValueOnce(new Error('Access denied'))

      const result = await getVaultTree()

      expect(result).toEqual([])
    })

    it('should skip hidden files and non-md files', async () => {
      mockReaddir.mockResolvedValueOnce([
        { name: '.gitignore', isDirectory: () => false },
        { name: 'image.png', isDirectory: () => false },
        { name: 'valid.md', isDirectory: () => false },
      ])

      const result = await getVaultTree()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('valid.md')
    })
  })

  describe('getFileContent', () => {
    it('should return parsed file content with frontmatter', async () => {
      const fileContent = `---
title: Test Note
tags: [test, demo]
---

# Hello World

This is the content.`

      mockReadFile.mockResolvedValueOnce(fileContent)

      const result = await getFileContent('notes/test.md')

      expect(result).not.toBeNull()
      expect(result?.frontmatter).toEqual({
        title: 'Test Note',
        tags: ['test', 'demo'],
      })
      expect(result?.content).toContain('# Hello World')
    })

    it('should handle files without frontmatter', async () => {
      mockReadFile.mockResolvedValueOnce('# Just content')

      const result = await getFileContent('simple.md')

      expect(result?.content).toBe('# Just content')
      expect(result?.frontmatter).toEqual({})
    })

    it('should return null on read error', async () => {
      mockReadFile.mockRejectedValueOnce(new Error('File not found'))

      const result = await getFileContent('nonexistent.md')

      expect(result).toBeNull()
    })

    it('should prevent directory traversal attacks', async () => {
      const result = await getFileContent('../../../etc/passwd')

      // Should return null because path traversal is blocked
      expect(result).toBeNull()
    })
  })

  describe('createFile', () => {
    it('should create file with default frontmatter', async () => {
      mockMkdir.mockResolvedValueOnce(undefined)
      mockWriteFile.mockResolvedValueOnce(undefined)

      const result = await createFile('notes/new-note.md')

      expect(result).toBe(true)
      expect(mockMkdir).toHaveBeenCalled()
      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining('new-note.md'),
        expect.stringContaining('title: new-note'),
        'utf-8'
      )
    })

    it('should create file with provided content', async () => {
      mockMkdir.mockResolvedValueOnce(undefined)
      mockWriteFile.mockResolvedValueOnce(undefined)

      const result = await createFile('note.md', 'Initial content')

      expect(result).toBe(true)
      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Initial content'),
        'utf-8'
      )
    })

    it('should return false on error', async () => {
      mockMkdir.mockRejectedValueOnce(new Error('Permission denied'))

      const result = await createFile('note.md')

      expect(result).toBe(false)
    })

    it('should block path traversal', async () => {
      const result = await createFile('../../../tmp/exploit.md')

      expect(result).toBe(false)
      expect(mockWriteFile).not.toHaveBeenCalled()
    })
  })

  describe('updateFile', () => {
    it('should update file content', async () => {
      mockWriteFile.mockResolvedValueOnce(undefined)

      const result = await updateFile('note.md', '# Updated content')

      expect(result).toBe(true)
      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining('note.md'),
        '# Updated content',
        'utf-8'
      )
    })

    it('should return false on error', async () => {
      mockWriteFile.mockRejectedValueOnce(new Error('Write failed'))

      const result = await updateFile('note.md', 'content')

      expect(result).toBe(false)
    })
  })

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      mockStat.mockResolvedValueOnce({ isDirectory: () => false })
      mockUnlink.mockResolvedValueOnce(undefined)

      const result = await deleteFile('note.md')

      expect(result).toBe(true)
      expect(mockUnlink).toHaveBeenCalled()
    })

    it('should delete a directory recursively', async () => {
      mockStat.mockResolvedValueOnce({ isDirectory: () => true })
      mockRm.mockResolvedValueOnce(undefined)

      const result = await deleteFile('folder')

      expect(result).toBe(true)
      expect(mockRm).toHaveBeenCalledWith(expect.any(String), { recursive: true })
    })

    it('should return false on error', async () => {
      mockStat.mockRejectedValueOnce(new Error('Not found'))

      const result = await deleteFile('nonexistent.md')

      expect(result).toBe(false)
    })
  })

  describe('renameFile', () => {
    it('should rename a file', async () => {
      mockRename.mockResolvedValueOnce(undefined)

      const result = await renameFile('old.md', 'new.md')

      expect(result).toBe(true)
      expect(mockRename).toHaveBeenCalled()
    })

    it('should return false on error', async () => {
      mockRename.mockRejectedValueOnce(new Error('Rename failed'))

      const result = await renameFile('old.md', 'new.md')

      expect(result).toBe(false)
    })

    it('should block path traversal in source path', async () => {
      const result = await renameFile('../secret.md', 'new.md')

      expect(result).toBe(false)
      expect(mockRename).not.toHaveBeenCalled()
    })

    it('should block path traversal in destination path', async () => {
      const result = await renameFile('old.md', '../../../tmp/exploit.md')

      expect(result).toBe(false)
      expect(mockRename).not.toHaveBeenCalled()
    })
  })

  describe('createFolder', () => {
    it('should create a folder', async () => {
      mockMkdir.mockResolvedValueOnce(undefined)

      const result = await createFolder('new-folder')

      expect(result).toBe(true)
      expect(mockMkdir).toHaveBeenCalledWith(
        expect.stringContaining('new-folder'),
        { recursive: true }
      )
    })

    it('should return false on error', async () => {
      mockMkdir.mockRejectedValueOnce(new Error('Failed'))

      const result = await createFolder('folder')

      expect(result).toBe(false)
    })
  })
})
