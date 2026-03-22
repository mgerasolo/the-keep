// Common type definitions for The Keep

export interface Frontmatter {
  title?: string
  type?: 'note' | 'project' | 'reference' | 'daily' | 'planning'
  status?: 'active' | 'archived' | 'draft'
  tags?: string[]
  parent?: string
  created?: string
  updated?: string
  [key: string]: unknown
}

export interface MarkdownFile {
  slug: string
  path: string
  content: string
  frontmatter: Frontmatter
}

export interface TreeNode {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

export interface TabState {
  id: string
  path: string
  name: string
  isDirty: boolean
}

export interface PanelConfig {
  sidebar: {
    width: number
    collapsed: boolean
  }
  preview: {
    visible: boolean
    width: number
  }
}
