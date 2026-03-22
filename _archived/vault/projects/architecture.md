---
title: Architecture Notes
type: reference
parent: the-keep
tags: [architecture, design]
created: 2026-03-18
---

# Architecture Notes

## Component Hierarchy

```
App
├── Layout
│   ├── Sidebar (resizable)
│   │   ├── FileTree
│   │   └── SearchBar
│   ├── EditorPanel (resizable)
│   │   ├── TabBar
│   │   └── MarkdownEditor
│   └── PreviewPanel (optional)
│       └── MarkdownPreview
└── CommandPalette (modal)
```

## State Management

Using Zustand for:
- Current file/folder state
- Open tabs
- Panel sizes
- User preferences

## File System

Vault files stored in `vault/` directory:
- Read at build time for static generation
- API routes for dynamic operations
- Gray-matter for frontmatter parsing

## Key Decisions

1. **Local-first** - Files stored on disk, not in database
2. **Markdown-native** - Full CommonMark + GFM support
3. **Dark theme default** - Matches Obsidian aesthetic
