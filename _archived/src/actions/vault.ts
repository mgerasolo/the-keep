'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export interface VaultFile {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: VaultFile[]
}

export interface FileContent {
  content: string
  frontmatter: Record<string, unknown>
}

const VAULT_PATH = process.env.VAULT_PATH || path.join(process.cwd(), 'vault')

/**
 * Safely resolve a user-provided path within the vault.
 * Returns null if the path would escape the vault directory.
 */
function safeResolvePath(userPath: string): string | null {
  // Normalize and resolve to absolute path
  const resolvedPath = path.resolve(VAULT_PATH, userPath)

  // Ensure the resolved path is within VAULT_PATH
  // Must either equal VAULT_PATH or start with VAULT_PATH + separator
  if (resolvedPath === VAULT_PATH || resolvedPath.startsWith(VAULT_PATH + path.sep)) {
    return resolvedPath
  }

  console.error('Path traversal attempt blocked:', userPath)
  return null
}

async function buildFileTree(dirPath: string, relativePath = ''): Promise<VaultFile[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files: VaultFile[] = []

  for (const entry of entries) {
    // Skip hidden files and directories
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dirPath, entry.name)
    const relPath = path.join(relativePath, entry.name)

    if (entry.isDirectory()) {
      const children = await buildFileTree(fullPath, relPath)
      files.push({
        id: relPath,
        name: entry.name,
        path: relPath,
        type: 'folder',
        children,
      })
    } else if (entry.name.endsWith('.md')) {
      files.push({
        id: relPath,
        name: entry.name,
        path: relPath,
        type: 'file',
      })
    }
  }

  // Sort: folders first, then files, both alphabetically
  return files.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

export async function getVaultTree(): Promise<VaultFile[]> {
  try {
    return await buildFileTree(VAULT_PATH)
  } catch (error) {
    console.error('Error reading vault:', error)
    return []
  }
}

export async function getFileContent(filePath: string): Promise<FileContent | null> {
  try {
    const fullPath = safeResolvePath(filePath)
    if (!fullPath) return null

    const fileContent = await fs.readFile(fullPath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      content,
      frontmatter: data,
    }
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
}

export async function createFile(filePath: string, content = ''): Promise<boolean> {
  try {
    const fullPath = safeResolvePath(filePath)
    if (!fullPath) return false

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true })

    // Create file with frontmatter
    const now = new Date().toISOString()
    const fileContent = `---
title: ${path.basename(filePath, '.md')}
created: ${now}
updated: ${now}
tags: []
---

${content}`

    await fs.writeFile(fullPath, fileContent, 'utf-8')
    return true
  } catch (error) {
    console.error('Error creating file:', error)
    return false
  }
}

export async function updateFile(filePath: string, content: string): Promise<boolean> {
  try {
    const fullPath = safeResolvePath(filePath)
    if (!fullPath) return false

    await fs.writeFile(fullPath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('Error updating file:', error)
    return false
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = safeResolvePath(filePath)
    if (!fullPath) return false

    const stat = await fs.stat(fullPath)
    if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true })
    } else {
      await fs.unlink(fullPath)
    }
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

export async function renameFile(oldPath: string, newPath: string): Promise<boolean> {
  try {
    const fullOldPath = safeResolvePath(oldPath)
    const fullNewPath = safeResolvePath(newPath)
    if (!fullOldPath || !fullNewPath) return false

    await fs.rename(fullOldPath, fullNewPath)
    return true
  } catch (error) {
    console.error('Error renaming file:', error)
    return false
  }
}

export async function createFolder(folderPath: string): Promise<boolean> {
  try {
    const fullPath = safeResolvePath(folderPath)
    if (!fullPath) return false

    await fs.mkdir(fullPath, { recursive: true })
    return true
  } catch (error) {
    console.error('Error creating folder:', error)
    return false
  }
}

export interface SearchResult {
  file: VaultFile
  snippet?: string
  matchType: 'filename' | 'content'
}

async function getAllMarkdownFiles(dirPath: string, relativePath = ''): Promise<VaultFile[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files: VaultFile[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dirPath, entry.name)
    const relPath = path.join(relativePath, entry.name)

    if (entry.isDirectory()) {
      const nested = await getAllMarkdownFiles(fullPath, relPath)
      files.push(...nested)
    } else if (entry.name.endsWith('.md')) {
      files.push({
        id: relPath,
        name: entry.name,
        path: relPath,
        type: 'file',
      })
    }
  }

  return files
}

export async function searchVault(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  try {
    const allFiles = await getAllMarkdownFiles(VAULT_PATH)
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    // First, search filenames
    for (const file of allFiles) {
      if (file.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          file,
          matchType: 'filename',
        })
      }
    }

    // Then, search content (limit to avoid performance issues)
    const contentSearchLimit = 50
    let contentSearched = 0

    for (const file of allFiles) {
      if (contentSearched >= contentSearchLimit) break
      // Skip if already matched by filename
      if (results.some((r) => r.file.id === file.id)) continue

      try {
        const fullPath = path.join(VAULT_PATH, file.path)
        const content = await fs.readFile(fullPath, 'utf-8')
        const lowerContent = content.toLowerCase()

        if (lowerContent.includes(lowerQuery)) {
          // Extract snippet around match
          const matchIndex = lowerContent.indexOf(lowerQuery)
          const start = Math.max(0, matchIndex - 30)
          const end = Math.min(content.length, matchIndex + query.length + 30)
          const snippet = (start > 0 ? '...' : '') +
            content.slice(start, end).replace(/\n/g, ' ') +
            (end < content.length ? '...' : '')

          results.push({
            file,
            snippet,
            matchType: 'content',
          })
        }
        contentSearched++
      } catch {
        // Skip files that can't be read
      }
    }

    return results.slice(0, 20) // Limit total results
  } catch (error) {
    console.error('Error searching vault:', error)
    return []
  }
}
