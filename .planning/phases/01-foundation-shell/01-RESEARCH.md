# Phase 1: Foundation Shell - Research

**Researched:** 2026-03-18
**Domain:** Cursor-like file explorer UI with markdown rendering, file tree, tabs, search, and file CRUD
**Confidence:** HIGH

## Summary

Phase 1 builds the foundational shell of The Keep -- a Cursor/VS Code-like web interface for browsing, searching, and managing a markdown knowledge base. The core technical challenges are: (1) a virtualized file tree with drag-drop and inline rename, (2) a tab system with session persistence, (3) server-side file system operations via Next.js Server Actions, (4) full-text search across markdown files, and (5) markdown rendering with syntax highlighting and frontmatter styling.

The stack is well-established. Next.js 16 App Router provides Server Components for reading the file system and Server Actions for mutations. react-arborist 3.4.3 handles the tree view with built-in virtualization, drag-drop, and keyboard navigation -- and has confirmed React 19 compatibility. shadcn/ui provides the resizable panel layout (via react-resizable-panels), tabs, and command components. Zustand with persist middleware handles session state (sidebar width, open tabs, active tab). Markdown rendering uses react-markdown + rehype-pretty-code + shiki for VS Code-quality syntax highlighting.

**Primary recommendation:** Build a three-panel layout (sidebar tree | main content with tabs | future right panel) using react-resizable-panels, with all file operations as Server Actions, and Zustand for client state persistence.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
| Decision | Choice | Notes |
|----------|--------|-------|
| Sidebar behavior | Collapsible + Resizable | Drag handle on edge, collapse button in header |
| Default sidebar width | ~280px | Standard for code editors |
| Keeper panel location | Toggleable right/bottom | User can switch; right for chat, bottom for wide diffs |
| Session persistence | Full | Remember sidebar width, collapsed state, open tabs, active tab |

### Claude's Discretion
- Exact pixel values for min/max sidebar width
- Animation/transition timing for collapse
- Keyboard shortcuts for panel toggles
- Which state persistence library to use (likely Zustand)
- File tree virtualization approach (react-arborist or fallback)

### Deferred Ideas (OUT OF SCOPE)
| Idea | Target | Notes |
|------|--------|-------|
| Right drawer for properties | v0.2+ | File metadata, tags, backlinks |
| Inbox panel | v0.3 | Phase 5 scope |
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIEW-01 | File viewer displays markdown with line numbers | react-markdown + custom line numbering via rehype plugin or CSS counters |
| VIEW-02 | File viewer has syntax highlighting for code blocks | rehype-pretty-code + shiki (VS Code-quality highlighting, zero client JS) |
| VIEW-03 | File viewer highlights frontmatter/YAML distinctly | gray-matter for parsing + custom styled frontmatter block component |
| SHELL-01 | User can see all markdown files in a tree view sidebar | react-arborist 3.4.3 with data from Server Component reading fs |
| SHELL-02 | User can expand/collapse folders in the tree view | react-arborist built-in open/close with persisted state |
| SHELL-03 | User can open files in tabs | Zustand tab store + shadcn Tabs component |
| SHELL-04 | User can have multiple tabs open simultaneously | Zustand array of open tabs with unique file path keys |
| SHELL-05 | User can close tabs individually | Tab store action + close button on each tab |
| SHELL-06 | User can create new markdown files | Server Action: fs.writeFile() with path validation |
| SHELL-07 | User can rename files and folders | Server Action: fs.rename() + react-arborist onRename handler |
| SHELL-08 | User can delete files and folders | Server Action: fs.rm() with confirmation dialog |
| SHELL-09 | User can move files between folders (drag-drop or move command) | react-arborist onMove handler + Server Action: fs.rename() |
| SEARCH-01 | User can search across all files (full-text) | flexsearch index built server-side, queried via Server Action |
| SEARCH-02 | Search results show file name and matching context | flexsearch Document index with stored context snippets |
| SEARCH-03 | User can click search result to open file | Search result dispatches tab store openFile action |
</phase_requirements>

## Standard Stack

### Core (Phase 1 Only)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js (App Router) | 16.1.7 | Full-stack framework | Server Components read vault fs; Server Actions mutate files; API routes for future agent API |
| React | 19.2.4 | UI library | Required by Next.js 16 |
| TypeScript | 5.9.3 | Type safety | Already installed in project |
| Tailwind CSS | 4.2.1 | Utility-first styling | Pairs with shadcn/ui for Cursor-like dark aesthetic |

### UI Components

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn/ui | CLI v4 | Component library (copied into project) | Provides Tabs, Resizable (react-resizable-panels wrapper), Dialog, Input, ContextMenu, DropdownMenu |
| react-resizable-panels | 4.7.3 | Resizable panel layout | Powers shadcn Resizable; built-in collapsible, min/max constraints, layout persistence via storage API |
| react-arborist | 3.4.3 | File tree component | Virtualized tree with drag-drop, inline rename, keyboard nav, multi-select. React 19 compatible (confirmed v3.4.3) |
| cmdk | 1.1.1 | Command palette primitive | Powers shadcn Command component for search UI |
| lucide-react | 0.577.0 | Icons | Consistent with shadcn ecosystem |

### State & Data

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Zustand | 5.0.12 | Client state (tabs, sidebar, UI) | persist middleware with localStorage for session persistence. ~3kb, minimal boilerplate |
| flexsearch | 0.8.212 | Full-text search index | Server-side index for searching markdown content. Up to 1M queries faster than alternatives. Zero dependencies |

### Markdown Rendering

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 10.1.0 | Markdown to React components | Client-side markdown rendering with custom components for frontmatter, line numbers |
| rehype-pretty-code | 0.14.3 | Code block syntax highlighting | Server-side highlighting via shiki -- zero client JS for syntax colors |
| shiki | 4.0.2 | Syntax highlighting engine | VS Code's highlighting engine (TextMate grammars). Accurate, themeable, server-rendered |
| gray-matter | 4.0.3 | Frontmatter parsing | Extract YAML frontmatter from markdown files for metadata display |
| remark-gfm | 4.0.1 | GFM markdown extensions | Tables, strikethrough, task lists, autolinks |
| remark-frontmatter | 5.0.0 | Frontmatter AST support | Parses YAML frontmatter as AST node (pairs with gray-matter for extraction) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-arborist | Custom tree with react-virtuoso | More control but 3-5x more code. Only switch if react-arborist has unforeseen React 19 issues |
| flexsearch | fuse.js 7.1.0 | Fuse has simpler API but is fuzzy-only (no full-text indexing). FlexSearch better for document search |
| rehype-pretty-code | @shikijs/rehype 4.0.2 | Lower-level shiki integration. rehype-pretty-code adds line highlighting, titles, copy button features |
| react-markdown | unified pipeline (manual) | More flexible but requires building your own React component rendering layer |
| Zustand | Jotai | Jotai is atomic; Zustand is single-store. Tabs/sidebar state is centralized, so Zustand fits better |

### Installation (Phase 1)

```bash
# Framework
npx create-next-app@latest the-keep --typescript --tailwind --eslint --app --src-dir --use-npm

# UI components (shadcn)
npx shadcn@latest init
npx shadcn@latest add tabs resizable dialog input context-menu dropdown-menu command scroll-area separator tooltip badge

# File tree
npm install react-arborist

# State
npm install zustand

# Search
npm install flexsearch
npm install -D @types/flexsearch

# Markdown rendering
npm install react-markdown rehype-pretty-code shiki gray-matter remark-gfm remark-frontmatter

# Icons (included with shadcn but explicit)
npm install lucide-react

# Already in project (dev tools)
# vitest, playwright, eslint, prettier, typescript already installed
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: providers, fonts, metadata
│   ├── page.tsx                # Main app page (single-page app feel)
│   ├── globals.css             # Tailwind + custom CSS variables
│   └── api/                    # Future: agent API routes (Phase 2)
├── components/
│   ├── ui/                     # shadcn components (auto-generated)
│   ├── layout/
│   │   ├── app-shell.tsx       # ResizablePanelGroup: sidebar + main + future right
│   │   ├── sidebar.tsx         # Sidebar container with collapse button
│   │   └── panel-layout.tsx    # Panel configuration and persistence
│   ├── file-tree/
│   │   ├── file-tree.tsx       # react-arborist Tree wrapper
│   │   ├── tree-node.tsx       # Custom node renderer (icon, name, context menu)
│   │   └── tree-actions.tsx    # Create/rename/delete dialogs
│   ├── tabs/
│   │   ├── tab-bar.tsx         # Tab strip with close buttons
│   │   └── tab-content.tsx     # Content area rendering active tab
│   ├── viewer/
│   │   ├── markdown-viewer.tsx # Markdown rendering with line numbers
│   │   ├── code-block.tsx      # Syntax-highlighted code block component
│   │   └── frontmatter.tsx     # Styled frontmatter display
│   └── search/
│       ├── search-dialog.tsx   # Command palette search (cmdk)
│       └── search-results.tsx  # Result list with context snippets
├── lib/
│   ├── actions/
│   │   ├── file-actions.ts     # Server Actions: CRUD operations on vault files
│   │   └── search-actions.ts   # Server Action: search index query
│   ├── vault/
│   │   ├── vault.ts            # Vault path resolution, safety checks
│   │   ├── file-reader.ts      # Read file tree structure from disk
│   │   └── search-index.ts     # FlexSearch index management
│   └── utils.ts                # Shared utilities (cn, etc.)
├── stores/
│   ├── tab-store.ts            # Zustand: open tabs, active tab
│   ├── sidebar-store.ts        # Zustand: width, collapsed state
│   └── tree-store.ts           # Zustand: expanded folders, selected node
├── hooks/
│   ├── use-file-tree.ts        # Hook: fetch + cache file tree data
│   ├── use-file-content.ts     # Hook: fetch + cache file content
│   └── use-search.ts           # Hook: search with debounce
└── types/
    ├── file.ts                 # FileNode, FolderNode, TreeData types
    └── tab.ts                  # Tab, TabState types
```

### Pattern 1: Vault Path Safety

**What:** All file system operations go through a vault module that resolves paths and prevents directory traversal.
**When to use:** Every Server Action that touches the file system.
**Example:**

```typescript
// src/lib/vault/vault.ts
import path from 'node:path';

const VAULT_ROOT = process.env.VAULT_PATH || path.join(process.cwd(), 'vault');

export function resolveVaultPath(relativePath: string): string {
  const resolved = path.resolve(VAULT_ROOT, relativePath);

  // Prevent directory traversal
  if (!resolved.startsWith(VAULT_ROOT)) {
    throw new Error('Path traversal detected');
  }

  return resolved;
}

export function toRelativePath(absolutePath: string): string {
  return path.relative(VAULT_ROOT, absolutePath);
}
```

### Pattern 2: Server Actions for File CRUD

**What:** All file mutations are Server Actions with 'use server' directive.
**When to use:** Create, rename, delete, move operations.
**Example:**

```typescript
// src/lib/actions/file-actions.ts
'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { resolveVaultPath } from '@/lib/vault/vault';

export async function createFile(parentPath: string, fileName: string) {
  const fullPath = resolveVaultPath(path.join(parentPath, fileName));

  // Ensure .md extension
  const finalPath = fullPath.endsWith('.md') ? fullPath : `${fullPath}.md`;

  // Check if file already exists
  try {
    await fs.access(finalPath);
    return { error: 'File already exists' };
  } catch {
    // File doesn't exist, good
  }

  // Create parent directory if needed
  await fs.mkdir(path.dirname(finalPath), { recursive: true });

  // Write empty file with frontmatter
  const content = `---\ntitle: ${path.basename(fileName, '.md')}\ncreated: ${new Date().toISOString()}\n---\n\n`;
  await fs.writeFile(finalPath, content, 'utf-8');

  revalidatePath('/');
  return { success: true, path: finalPath };
}

export async function renameFile(oldPath: string, newName: string) {
  const resolvedOld = resolveVaultPath(oldPath);
  const resolvedNew = resolveVaultPath(
    path.join(path.dirname(oldPath), newName)
  );

  await fs.rename(resolvedOld, resolvedNew);
  revalidatePath('/');
  return { success: true };
}

export async function deleteFile(filePath: string) {
  const resolved = resolveVaultPath(filePath);
  const stat = await fs.stat(resolved);

  await fs.rm(resolved, { recursive: stat.isDirectory() });
  revalidatePath('/');
  return { success: true };
}

export async function moveFile(sourcePath: string, destFolder: string) {
  const resolvedSource = resolveVaultPath(sourcePath);
  const resolvedDest = resolveVaultPath(
    path.join(destFolder, path.basename(sourcePath))
  );

  await fs.mkdir(path.dirname(resolvedDest), { recursive: true });
  await fs.rename(resolvedSource, resolvedDest);
  revalidatePath('/');
  return { success: true };
}
```

### Pattern 3: Zustand Store with Persistence

**What:** Client state stored in Zustand with localStorage persistence for session continuity.
**When to use:** Tabs, sidebar width, expanded folders.
**Example:**

```typescript
// src/stores/tab-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tab {
  id: string;       // file path as unique key
  path: string;     // relative path in vault
  name: string;     // display name
  isDirty: boolean; // unsaved changes (future)
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (path: string, name: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (path, name) => {
        const { tabs } = get();
        const existing = tabs.find((t) => t.path === path);
        if (existing) {
          set({ activeTabId: existing.id });
          return;
        }
        const newTab: Tab = { id: path, path, name, isDirty: false };
        set({ tabs: [...tabs, newTab], activeTabId: path });
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter((t) => t.id !== id);
        let newActive = activeTabId;
        if (activeTabId === id) {
          const idx = tabs.findIndex((t) => t.id === id);
          newActive = newTabs[Math.min(idx, newTabs.length - 1)]?.id ?? null;
        }
        set({ tabs: newTabs, activeTabId: newActive });
      },

      setActiveTab: (id) => set({ activeTabId: id }),

      closeOtherTabs: (id) => {
        const { tabs } = get();
        set({ tabs: tabs.filter((t) => t.id === id), activeTabId: id });
      },

      closeAllTabs: () => set({ tabs: [], activeTabId: null }),
    }),
    {
      name: 'the-keep-tabs',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);
```

### Pattern 4: File Tree Data Loading

**What:** Server Component reads vault directory structure; client component renders with react-arborist.
**When to use:** Initial page load and after file mutations.
**Example:**

```typescript
// src/lib/vault/file-reader.ts
import fs from 'node:fs/promises';
import path from 'node:path';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isFolder: boolean;
}

export async function readVaultTree(dirPath: string): Promise<TreeNode[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    // Skip hidden files/folders
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(
      process.env.VAULT_PATH || path.join(process.cwd(), 'vault'),
      fullPath
    );

    if (entry.isDirectory()) {
      const children = await readVaultTree(fullPath);
      nodes.push({
        id: relativePath,
        name: entry.name,
        children,
        isFolder: true,
      });
    } else if (entry.name.endsWith('.md')) {
      nodes.push({
        id: relativePath,
        name: entry.name,
        isFolder: false,
      });
    }
  }

  // Folders first, then files, alphabetical within each
  return nodes.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });
}
```

### Pattern 5: Resizable Panel Layout with Persistence

**What:** Three-panel layout using react-resizable-panels with localStorage persistence.
**When to use:** The main app shell.
**Example:**

```typescript
// src/components/layout/app-shell.tsx
'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export function AppShell() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="the-keep-layout" // Persists to localStorage automatically
    >
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={40}
        collapsible
        collapsedSize={0}
      >
        <Sidebar />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={80}>
        <MainContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
```

### Anti-Patterns to Avoid

- **Client-side file operations:** Never read/write files from client components. Always use Server Components (read) or Server Actions (write).
- **Storing file content in Zustand:** File content belongs on the server. Use Server Components to fetch content on navigation, not client-side cache. Only store UI state (tabs, sidebar, expanded folders) in Zustand.
- **Building a custom virtual tree:** react-arborist handles virtualization, keyboard nav, drag-drop, and inline rename. Don't rebuild it unless you hit a blocking compatibility issue.
- **Polling for file changes:** In Phase 1, rely on revalidatePath after Server Actions. File watching (chokidar) is a Phase 2+ concern when external agents modify files.
- **Using API routes for internal file operations:** Server Actions are colocated, type-safe, and progressively enhanced. API routes are for external consumers (agents in Phase 2).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Resizable panels | Custom drag-to-resize divs | react-resizable-panels via shadcn Resizable | Accessibility, keyboard support, constraints, persistence |
| File tree with virtualization | Recursive component + react-window | react-arborist | Handles 10K+ nodes, drag-drop, rename, keyboard -- 3000+ lines of battle-tested code |
| Syntax highlighting | Custom regex parser or highlight.js | shiki + rehype-pretty-code | VS Code-grade accuracy via TextMate grammars, zero client JS, themeable |
| Full-text search | Custom string matching loops | flexsearch | Handles indexing, tokenization, relevance scoring, partial matching |
| Command palette | Custom modal with search input | shadcn Command (cmdk) | Accessible, composable, handles keyboard navigation, grouping, filtering |
| YAML frontmatter parsing | Custom regex extraction | gray-matter | Handles edge cases (multiline values, nested objects, multiple delimiters) |
| Markdown rendering pipeline | Manual HTML generation | react-markdown + remark/rehype plugins | AST-based, extensible, handles all GFM, custom component mapping |

**Key insight:** Phase 1 is 80% composition of existing libraries and 20% glue code. The libraries listed above have collectively absorbed thousands of hours of edge-case handling. The value is in wiring them together with a clean architecture, not reimplementing their functionality.

## Common Pitfalls

### Pitfall 1: Zustand Hydration Mismatch in Next.js

**What goes wrong:** Server renders with default state, client hydrates with persisted state from localStorage, causing a mismatch error.
**Why it happens:** Server has no access to localStorage, so initial render differs from client.
**How to avoid:** Use the `onRehydrateStorage` callback and render a loading state until hydration completes, OR use `skipHydration: true` and manually trigger hydration in a `useEffect`.
**Warning signs:** React hydration warnings in console, UI flickering on initial load.

```typescript
// Option 1: Skip hydration, manually trigger
const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'the-keep-tabs',
      skipHydration: true,
    }
  )
);

// In a client component:
useEffect(() => {
  useTabStore.persist.rehydrate();
}, []);
```

### Pitfall 2: Path Traversal in File Operations

**What goes wrong:** Malicious or malformed paths escape the vault directory (e.g., `../../etc/passwd`).
**Why it happens:** Joining user-supplied paths without validation.
**How to avoid:** Always resolve paths with `path.resolve()` and verify the result starts with the vault root. Never concatenate paths with string operations.
**Warning signs:** File paths containing `..` or absolute paths in user input.

### Pitfall 3: react-arborist Controlled vs Uncontrolled Mode

**What goes wrong:** Mixing controlled and uncontrolled tree state causes tree to stop responding to changes.
**Why it happens:** react-arborist has two modes. Providing `data` prop makes it controlled -- you MUST update data on every change. Using `initialData` makes it uncontrolled -- tree manages its own state.
**How to avoid:** For Phase 1, use controlled mode with Server Component data. Pass tree data as prop, update via revalidation after Server Actions.
**Warning signs:** Tree not reflecting file system changes, stale nodes after rename/delete.

### Pitfall 4: FlexSearch Index Stale After File Mutations

**What goes wrong:** Search returns results for deleted/renamed files or misses newly created ones.
**Why it happens:** The search index is built once on startup and not updated when files change.
**How to avoid:** Rebuild the index (or update it incrementally) after every file mutation Server Action. Use a module-level singleton for the index with add/remove/update methods.
**Warning signs:** Search results pointing to non-existent files.

### Pitfall 5: Markdown Rendering Performance with Large Files

**What goes wrong:** Large markdown files with many code blocks cause visible render delay.
**Why it happens:** shiki processes each code block for syntax highlighting, which is CPU-intensive.
**How to avoid:** Use server-side rendering for markdown via a Server Component. shiki runs at build/request time, not in the browser. For very large files, consider streaming or lazy rendering of code blocks.
**Warning signs:** Noticeable delay when opening files with 10+ code blocks.

### Pitfall 6: Tab Close Leaves Active Tab Null

**What goes wrong:** Closing the last tab results in a blank screen with no way to navigate.
**Why it happens:** Tab store doesn't handle the edge case of closing all tabs.
**How to avoid:** When all tabs are closed, show a welcome/empty state component. The tab store should set `activeTabId` to null, and the UI should render a placeholder.
**Warning signs:** Blank content area with no instructions for the user.

## Code Examples

### Markdown Viewer with Line Numbers and Syntax Highlighting

```typescript
// src/components/viewer/markdown-viewer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypePrettyCode from 'rehype-pretty-code';
import matter from 'gray-matter';

interface MarkdownViewerProps {
  content: string;
  filePath: string;
}

export async function MarkdownViewer({ content, filePath }: MarkdownViewerProps) {
  const { data: frontmatter, content: body } = matter(content);

  return (
    <div className="markdown-viewer">
      {/* Frontmatter block */}
      {Object.keys(frontmatter).length > 0 && (
        <div className="frontmatter-block border rounded-md p-4 mb-4 bg-muted/50 font-mono text-sm">
          <div className="text-muted-foreground mb-2">---</div>
          {Object.entries(frontmatter).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-blue-400">{key}:</span>
              <span className="text-green-400">{String(value)}</span>
            </div>
          ))}
          <div className="text-muted-foreground mt-2">---</div>
        </div>
      )}

      {/* Markdown body with line numbers */}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            [rehypePrettyCode, {
              theme: 'github-dark',
              keepBackground: true,
            }],
          ]}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
```

### Search Implementation with FlexSearch

```typescript
// src/lib/vault/search-index.ts
import FlexSearch from 'flexsearch';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { resolveVaultPath } from './vault';

// Singleton index
let index: FlexSearch.Document<{
  id: string;
  title: string;
  content: string;
  path: string;
}> | null = null;

export async function getSearchIndex() {
  if (!index) {
    index = new FlexSearch.Document({
      document: {
        id: 'id',
        index: ['title', 'content'],
        store: ['title', 'path'],
      },
      tokenize: 'forward',
    });
    await buildIndex();
  }
  return index;
}

async function buildIndex() {
  // Walk vault directory and index all markdown files
  const vaultPath = process.env.VAULT_PATH || path.join(process.cwd(), 'vault');
  await indexDirectory(vaultPath);
}

async function indexDirectory(dirPath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await indexDirectory(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const { data, content: body } = matter(content);
      const relativePath = path.relative(
        process.env.VAULT_PATH || path.join(process.cwd(), 'vault'),
        fullPath
      );

      index!.add({
        id: relativePath,
        title: data.title || path.basename(entry.name, '.md'),
        content: body,
        path: relativePath,
      });
    }
  }
}

// Call after file mutations to keep index current
export async function reindexFile(filePath: string) {
  const resolved = resolveVaultPath(filePath);
  const content = await fs.readFile(resolved, 'utf-8');
  const { data, content: body } = matter(content);

  // Remove old entry and add new
  index?.remove(filePath);
  index?.add({
    id: filePath,
    title: data.title || path.basename(filePath, '.md'),
    content: body,
    path: filePath,
  });
}

export function removeFromIndex(filePath: string) {
  index?.remove(filePath);
}
```

### Tree Node with Context Menu

```typescript
// src/components/file-tree/tree-node.tsx
'use client';

import { NodeRendererProps } from 'react-arborist';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { File, Folder, FolderOpen, ChevronRight } from 'lucide-react';
import { useTabStore } from '@/stores/tab-store';
import { TreeNode } from '@/types/file';

export function FileTreeNode({ node, style, dragHandle }: NodeRendererProps<TreeNode>) {
  const openTab = useTabStore((s) => s.openTab);

  const handleClick = () => {
    if (node.isLeaf) {
      openTab(node.data.id, node.data.name);
    } else {
      node.toggle();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={dragHandle}
          style={style}
          className={`flex items-center gap-1 px-2 py-0.5 cursor-pointer hover:bg-accent/50 text-sm
            ${node.isSelected ? 'bg-accent' : ''}`}
          onClick={handleClick}
        >
          {!node.isLeaf && (
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform ${
                node.isOpen ? 'rotate-90' : ''
              }`}
            />
          )}
          {node.isLeaf ? (
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : node.isOpen ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-blue-400" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-blue-400" />
          )}

          {node.isEditing ? (
            <input
              type="text"
              defaultValue={node.data.name}
              onBlur={() => node.reset()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') node.submit(e.currentTarget.value);
                if (e.key === 'Escape') node.reset();
              }}
              autoFocus
              className="bg-transparent border border-primary px-1 text-sm outline-none"
            />
          ) : (
            <span className="truncate">{node.data.name}</span>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        {node.isLeaf && (
          <ContextMenuItem onClick={() => openTab(node.data.id, node.data.name)}>
            Open
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => node.edit()}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {/* trigger delete dialog */}}
          className="text-destructive"
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side file APIs (FileSystem Access API) | Server Actions with fs module | Next.js 14+ (2024) | Server Actions are type-safe, progressively enhanced, and work without client JS |
| highlight.js / Prism.js | shiki (TextMate grammars) | 2023-2024 | VS Code-accurate highlighting, server-rendered, zero client JS |
| CSS-in-JS (styled-components) | Tailwind CSS 4 + CSS variables | 2024-2025 | Zero runtime, smaller bundles, better server component support |
| Redux for all state | Zustand for client + Server Components for server state | 2024-2025 | Eliminates boilerplate, leverages React 19 server/client split |
| Custom panel drag-resize | react-resizable-panels (react-aria based) | 2023+ | Accessible, keyboard-navigable, constraint-aware, tested |
| react-window + custom tree | react-arborist | 2022+ | Purpose-built tree with virtualization, DnD, rename, keyboard nav |

**Deprecated/outdated:**
- **highlight.js/Prism.js:** Still functional but shiki provides VS Code-identical output with zero client JS when server-rendered.
- **react-window for trees:** react-arborist wraps react-window internally and adds tree-specific features. Don't use react-window directly for trees.
- **moment.js:** Replaced by date-fns (tree-shakeable) or Temporal API (not yet widely supported).

## Open Questions

1. **FlexSearch Document vs Index API**
   - What we know: FlexSearch offers both a simple Index and a Document API. Document supports field-specific search and stored attributes.
   - What's unclear: Exact TypeScript types for FlexSearch 0.8.x are community-maintained and may have gaps.
   - Recommendation: Use Document API for multi-field search (title + content). If types are problematic, create local type declarations.

2. **react-arborist Performance at Scale**
   - What we know: Uses react-window for virtualization, which handles 10K+ nodes efficiently.
   - What's unclear: Performance with deeply nested folder structures (10+ levels deep) with frequent expand/collapse.
   - Recommendation: Test early with a realistic vault structure (100+ files, 5+ folder levels). The user's personal knowledge base is unlikely to exceed this.

3. **Markdown Line Numbers**
   - What we know: rehype-pretty-code supports line numbers for code blocks. For the full document, line numbers need a custom approach.
   - What's unclear: Whether to show line numbers for the full markdown document or only for code blocks.
   - Recommendation: Implement line numbers for code blocks via rehype-pretty-code's `showLineNumbers` option. For full-document line numbers (like Cursor), use CSS counters on a wrapper element. Phase 1 should support both -- code block line numbers by default, full-document line numbers as a visual option.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + Playwright 1.58.2 |
| Config file | vitest.config.ts (needs creation -- Wave 0) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run && npx playwright test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIEW-01 | Markdown renders with line numbers | unit | `npx vitest run src/__tests__/viewer/markdown-viewer.test.tsx -t "line numbers"` | No -- Wave 0 |
| VIEW-02 | Code blocks have syntax highlighting | unit | `npx vitest run src/__tests__/viewer/code-block.test.tsx` | No -- Wave 0 |
| VIEW-03 | Frontmatter renders distinctly | unit | `npx vitest run src/__tests__/viewer/frontmatter.test.tsx` | No -- Wave 0 |
| SHELL-01 | Tree view shows all markdown files | integration | `npx vitest run src/__tests__/file-tree/file-tree.test.tsx -t "displays files"` | No -- Wave 0 |
| SHELL-02 | Folders expand/collapse | integration | `npx vitest run src/__tests__/file-tree/file-tree.test.tsx -t "expand collapse"` | No -- Wave 0 |
| SHELL-03 | File opens in tab | integration | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "open tab"` | No -- Wave 0 |
| SHELL-04 | Multiple tabs open | unit | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "multiple tabs"` | No -- Wave 0 |
| SHELL-05 | Tab closes individually | unit | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "close tab"` | No -- Wave 0 |
| SHELL-06 | Create new markdown file | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "create"` | No -- Wave 0 |
| SHELL-07 | Rename file/folder | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "rename"` | No -- Wave 0 |
| SHELL-08 | Delete file/folder | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "delete"` | No -- Wave 0 |
| SHELL-09 | Move file between folders | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "move"` | No -- Wave 0 |
| SEARCH-01 | Full-text search across files | unit | `npx vitest run src/__tests__/search/search-index.test.ts -t "search"` | No -- Wave 0 |
| SEARCH-02 | Results show name and context | unit | `npx vitest run src/__tests__/search/search-index.test.ts -t "results context"` | No -- Wave 0 |
| SEARCH-03 | Click result opens file | integration | `npx vitest run src/__tests__/search/search-dialog.test.tsx -t "opens tab"` | No -- Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npx playwright test --project=chromium`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` -- Vitest configuration with jsdom environment, path aliases
- [ ] `src/__tests__/actions/file-actions.test.ts` -- covers SHELL-06, SHELL-07, SHELL-08, SHELL-09
- [ ] `src/__tests__/tabs/tab-store.test.ts` -- covers SHELL-03, SHELL-04, SHELL-05
- [ ] `src/__tests__/file-tree/file-tree.test.tsx` -- covers SHELL-01, SHELL-02
- [ ] `src/__tests__/viewer/markdown-viewer.test.tsx` -- covers VIEW-01
- [ ] `src/__tests__/viewer/code-block.test.tsx` -- covers VIEW-02
- [ ] `src/__tests__/viewer/frontmatter.test.tsx` -- covers VIEW-03
- [ ] `src/__tests__/search/search-index.test.ts` -- covers SEARCH-01, SEARCH-02
- [ ] `src/__tests__/search/search-dialog.test.tsx` -- covers SEARCH-03
- [ ] `@testing-library/react` + `@testing-library/jest-dom` -- testing utilities
- [ ] `vault/` test fixtures directory with sample markdown files

## Sources

### Primary (HIGH confidence)
- npm registry: Next.js 16.1.7, React 19.2.4, react-arborist 3.4.3, Zustand 5.0.12, shiki 4.0.2, react-markdown 10.1.0 -- all version-verified via `npm view`
- [Next.js 16 Blog](https://nextjs.org/blog/next-16) -- Server Components, Server Actions, Turbopack stable
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) -- App Router file conventions
- [Next.js Server Actions](https://nextjs.org/docs/app/api-reference/directives/use-server) -- 'use server' directive, file mutations
- [react-arborist GitHub](https://github.com/brimdata/react-arborist) -- API, React 19 support confirmed in v3.4.3
- [react-resizable-panels GitHub](https://github.com/bvaughn/react-resizable-panels) -- Collapsible panels, persistence API
- [shadcn/ui Resizable](https://ui.shadcn.com/docs/components/radix/resizable) -- shadcn wrapper for react-resizable-panels
- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar) -- Sidebar component patterns
- [rehype-pretty-code](https://rehype-pretty.pages.dev/) -- Shiki-powered syntax highlighting for rehype
- [Zustand persist middleware](https://deepwiki.com/pmndrs/zustand/3.1-persist-middleware) -- localStorage/sessionStorage persistence

### Secondary (MEDIUM confidence)
- [MakerKit: Next.js 16 App Router Project Structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) -- Feature-based folder structure recommendations
- [FlexSearch GitHub](https://github.com/nextapps-de/flexsearch) -- Document search API, benchmarks
- [shadcn-resizable-sidebar GitHub](https://github.com/lumpinif/shadcn-resizable-sidebar) -- VS Code-like resizable sidebar pattern for Next.js
- [react-arborist tutorials on DEV.to](https://dev.to/igorfilippov3/build-tree-view-with-react-arborist-part-1-b5l) -- Practical implementation patterns
- [Zustand persist in Next.js](https://dev.to/abdulsamad/how-to-use-zustands-persist-middleware-in-nextjs-4lb5) -- Hydration patterns for SSR

### Tertiary (LOW confidence)
- FlexSearch TypeScript types: Community-maintained `@types/flexsearch` -- may have gaps in 0.8.x Document API typing. Needs validation during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All packages verified against npm registry with current versions. Core stack (Next.js, React, shadcn, Zustand) is mainstream and well-documented.
- Architecture: HIGH -- Patterns follow Next.js App Router conventions. File system access via Server Components/Actions is the documented approach.
- Pitfalls: HIGH -- Hydration mismatches, path traversal, controlled/uncontrolled tree modes are well-documented issues with known solutions.
- react-arborist React 19 compat: MEDIUM -- v3.4.3 bumped react-window for React 19 support, but peer deps say ">= 16.14" which is broad. Test early.
- FlexSearch TypeScript types: LOW -- Community types may lag behind 0.8.x API. May need local type declarations.

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable stack, 30-day window)
