# Phase 1 Context: Foundation Shell

**Created:** 2026-03-18
**Phase:** 1 of 5
**Goal:** Users can browse, search, and manage their markdown knowledge base through a Cursor-like file explorer

## Phase Boundary

This phase delivers:
- File tree sidebar with expand/collapse
- Tab system (open, close, multiple tabs)
- File CRUD (create, rename, delete, move)
- Full-text search with results navigation
- Markdown file viewer with line numbers, syntax highlighting, frontmatter styling

**NOT in this phase:** Rich editor, Keeper AI, auth, inbox, workflows.

## User Decisions

### Layout & Panels

| Decision | Choice | Notes |
|----------|--------|-------|
| Sidebar behavior | Collapsible + Resizable | Drag handle on edge, collapse button in header |
| Default sidebar width | ~280px | Standard for code editors |
| Keeper panel location | Toggleable right/bottom | User can switch; right for chat, bottom for wide diffs |
| Session persistence | Full | Remember sidebar width, collapsed state, open tabs, active tab |

### Deferred Ideas

These came up during discussion but belong to later phases:

| Idea | Target | Notes |
|------|--------|-------|
| Right drawer for properties | v0.2+ | File metadata, tags, backlinks |
| Inbox panel | v0.3 | Phase 5 scope |

## Claude's Discretion

These areas are implementation details Claude will decide:

- Exact pixel values for min/max sidebar width
- Animation/transition timing for collapse
- Keyboard shortcuts for panel toggles
- Which state persistence library to use (likely Zustand)
- File tree virtualization approach (react-arborist or fallback)

## Code Context

### Existing Assets

None yet - greenfield project.

### Stack Decisions (from Research)

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | Next.js 16 (App Router) | Server Components, modern patterns |
| File Tree | react-arborist | Virtualized, drag-drop, keyboard nav |
| State | Zustand 5.x | Simple, persistent storage built-in |
| UI | shadcn/ui + Tailwind 4 | Cursor-like aesthetic |
| Icons | Lucide | Matches shadcn ecosystem |

### Technical Constraints

| Constraint | Value |
|------------|-------|
| Port Block | 5000-5099 |
| Dev Target | Banner (10.0.0.33) |
| Prod Target | Hulk (10.0.0.32) |

## Success Criteria (from Roadmap)

1. User can see their full file/folder hierarchy in a sidebar tree and expand/collapse folders
2. User can open files in tabs, have multiple tabs open, and close them individually
3. User can create, rename, delete, and move markdown files and folders
4. User can search across all files and click a result to open that file in a tab
5. File viewer displays markdown with line numbers, syntax highlighting for code blocks, and distinct frontmatter styling

## Requirements Covered

VIEW-01, VIEW-02, VIEW-03, SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05, SHELL-06, SHELL-07, SHELL-08, SHELL-09, SEARCH-01, SEARCH-02, SEARCH-03

---
*Context captured: 2026-03-18*
*Ready for: /gsd:plan-phase 1*
