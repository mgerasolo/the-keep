# VS Code & Cursor IDE UX Analysis for The Keep

**Date:** 2026-03-22
**Purpose:** Research VS Code and Cursor IDE UX patterns to inform The Keep's dockview-based UI design
**BMAD Phase:** Step 4 - UX Design (research input)

---

## Executive Summary

VS Code has established the gold standard for IDE-like web interfaces, with patterns that users expect in professional tools. Cursor IDE builds on this foundation with AI-native features that represent the cutting edge of developer experience. For The Keep, adopting these patterns via dockview will provide users with a familiar, powerful interface while enabling our unique knowledge management features.

**Key Takeaway:** Don't reinvent navigation patterns. Adopt VS Code's proven UI architecture (Activity Bar, Sidebars, Editor Groups, Command Palette) and Cursor's AI integration patterns (Cmd+K inline edits, Cmd+L chat panel, full codebase context).

---

## 1. Command Palette

### How VS Code Does It

The Command Palette is the universal entry point for all functionality, accessed via `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux).

**Architecture:**
- Single searchable interface exposing all registered commands
- Commands registered via `vscode.commands.registerCommand` with unique IDs
- Conditional display via `when` clauses (e.g., only show Markdown commands in .md files)
- Commands grouped by topic prefix (e.g., "Terminal:", "Git:", "View:")
- Recently used commands appear first

**UX Patterns:**
| Pattern | Description |
|---------|-------------|
| Fuzzy search | Type partial matches, skip words |
| Quick access variants | `Cmd+P` = files, `Cmd+Shift+P` = commands, `Ctrl+G` = go to line |
| Keyboard-first | Arrow keys + Enter, no mouse needed |
| Context-aware | Available commands change based on active file type |
| Extensible | Extensions add their own commands seamlessly |

### What The Keep Should Adopt

- **Single command palette** for all operations (search documents, run AI tasks, navigate, settings)
- **Contextual commands** based on active panel type (knowledge base, inbox, AI chat)
- **Fuzzy matching** with recently-used prioritization
- **Keyboard shortcuts** displayed inline with command names
- **Quick access modes:**
  - `Cmd+P` = Quick open document
  - `Cmd+Shift+P` = Command palette
  - `Cmd+K` = AI inline action (Cursor-style)

---

## 2. Panel System (Dockview Integration)

### How VS Code Does It

VS Code uses a structured layout with distinct regions:

```
+----------------+------------------+----------------+
|  Activity Bar  |  Primary Sidebar |  Editor Area   |
|  (icons)       |  (tree views)    |  (tabs/groups) |
|                |                  |                |
|                |                  +----------------+
|                |                  |     Panel      |
|                |                  | (terminal/etc) |
+----------------+------------------+----------------+
```

**Core Components:**
| Component | Purpose | Position |
|-----------|---------|----------|
| Activity Bar | Navigation icons | Left edge (or top/bottom) |
| Primary Sidebar | Tree views, explorers | Left of editor |
| Secondary Sidebar | Additional views | Right of editor |
| Editor Area | Tabbed documents | Center |
| Panel | Terminal, output, problems | Bottom (or side) |

**Dockview Alignment:**

Dockview provides all the primitives needed to replicate this:
- **Splitviews and Gridviews** - Directly inspired by VS Code's codebase
- **Tabbed groups** - VS Code-style tab management
- **Drag and drop** - Rearrange panels freely
- **Floating groups** - Pop-out windows
- **Layout persistence** - Save/restore arrangements

### What The Keep Should Adopt

**Panel Types for The Keep:**

| Panel Type | Purpose | Default Position |
|------------|---------|------------------|
| Knowledge Tree | File/folder navigator | Primary Sidebar |
| Inbox | Unprocessed captures | Primary Sidebar (tab) |
| AI Chat | Claude/LLM conversation | Secondary Sidebar |
| Document Editor | Markdown editing | Editor Area |
| Document Viewer | Read-only preview | Editor Area |
| Search Results | Global search | Panel (bottom) |
| AI Actions | Organization suggestions | Panel (bottom) |

**Layout Zones:**
```
+------------+------------------+------------------+
| Activity   | Primary Sidebar  |    Editor        | Secondary
|   Bar      | - Knowledge Tree |    Groups        | Sidebar
|            | - Inbox          | +------+-------+ | - AI Chat
| [Tree]     | - Tags           | | Doc1 | Doc2  | | - Context
| [Inbox]    | - Saved Searches | |      |       | |
| [Search]   |                  | +------+-------+ |
| [AI]       |                  | |   Preview     | |
| [Settings] |                  | |               | |
+------------+------------------+-----------------+
             |       Panel: Search / AI Suggestions / Output      |
             +----------------------------------------------------+
```

---

## 3. File Explorer (Knowledge Tree)

### How VS Code Does It

**Tree View Architecture:**
- Implemented via `TreeDataProvider` API
- Each node is a `TreeItem` with customizable properties
- Icons via `ThemeIcon` or custom `iconPath`
- Collapsible state tracked per item
- Context menus via `viewItem` contextValue

**UX Patterns:**
| Pattern | Implementation |
|---------|----------------|
| Custom icons | File type icons (Seti, Material, etc.) |
| Inline actions | Buttons that appear on hover |
| Context menus | Right-click with contextual options |
| Drag-drop | Reorder files, move between folders |
| Multi-select | Cmd+click or Shift+click |
| Keyboard nav | Arrow keys, Enter to open |
| Filtering | Type to filter visible items |
| Decoration | Badges, colors for git status, errors |

### What The Keep Should Adopt

**Knowledge Tree Features:**

| Feature | Description |
|---------|-------------|
| **Document icons** | Markdown, PDF, URL bookmark, note types |
| **Status decorations** | Unread badge, AI-suggested tag, needs-review indicator |
| **Inline actions** | Quick AI analyze, pin, archive |
| **Context menu** | Open, Open Preview, Rename, Move, Tag, AI Actions, Delete |
| **Drag-drop** | Move docs between folders, reorganize |
| **Virtual folders** | Tags-as-folders, saved searches |
| **Keyboard navigation** | Full keyboard control |

---

## 4. Tab Management

### How VS Code Does It

**Features:**
- Tabs represent open editors in a group
- Multiple editor groups (side-by-side, grid)
- Pinned tabs (shown as icon or compact)
- Tab multi-select (Cmd+click)
- Tab history (navigate back/forward)
- Drag tabs between groups
- Dirty indicator (dot on unsaved files)
- Close on middle-click

**Configuration Options:**
| Setting | Purpose |
|---------|---------|
| `workbench.editor.showTabs` | Show/hide tab bar |
| `workbench.editor.pinnedTabsOnSeparateRow` | Pin row at top |
| `workbench.editor.tabSizing` | Fit, shrink, or fixed width |
| `workbench.editor.limit.enabled` | Limit open tabs |

### What The Keep Should Adopt

**Tab Features for The Keep:**

| Feature | Priority | Notes |
|---------|----------|-------|
| Pinned tabs | High | Keep important docs always open |
| Tab groups | High | Compare docs side-by-side |
| Recent tabs history | High | Cmd+Tab to cycle recent |
| Modified indicator | High | Show unsaved changes |
| Tab drag-drop | Medium | Reorder, move to groups |
| Preview mode | Medium | Single-click = preview, double = open |
| Tab overflow menu | Medium | Access all tabs when many open |

---

## 5. Keyboard Shortcuts

### How VS Code Does It

**Architecture:**
- Keybindings stored in `keybindings.json`
- Default + user overrides
- GUI editor (`Cmd+K Cmd+S`) and JSON editing
- Context-aware (`when` clauses)
- Chord support (two-key sequences like `Cmd+K Cmd+C`)
- Keymap extensions for other editors

**Essential Shortcuts:**
| Action | Mac | Windows |
|--------|-----|---------|
| Command Palette | Cmd+Shift+P | Ctrl+Shift+P |
| Quick Open | Cmd+P | Ctrl+P |
| Close Tab | Cmd+W | Ctrl+W |
| Split Editor | Cmd+\ | Ctrl+\ |
| Toggle Sidebar | Cmd+B | Ctrl+B |
| Toggle Panel | Cmd+J | Ctrl+J |
| Find | Cmd+F | Ctrl+F |
| Find in Files | Cmd+Shift+F | Ctrl+Shift+F |
| Go to Definition | F12 | F12 |
| Go Back | Ctrl+- | Alt+Left |

### What The Keep Should Adopt

**The Keep Shortcut Map:**

| Action | Mac | Windows | Priority |
|--------|-----|---------|----------|
| Command Palette | Cmd+Shift+P | Ctrl+Shift+P | Critical |
| Quick Open Doc | Cmd+P | Ctrl+P | Critical |
| AI Chat Focus | Cmd+L | Ctrl+L | Critical |
| AI Inline Action | Cmd+K | Ctrl+K | Critical |
| Global Search | Cmd+Shift+F | Ctrl+Shift+F | Critical |
| New Document | Cmd+N | Ctrl+N | High |
| Save | Cmd+S | Ctrl+S | High |
| Toggle Sidebar | Cmd+B | Ctrl+B | High |
| Toggle AI Panel | Cmd+Shift+L | Ctrl+Shift+L | High |
| Close Tab | Cmd+W | Ctrl+W | High |
| Focus Inbox | Cmd+Shift+I | Ctrl+Shift+I | Medium |
| Zen Mode | Cmd+K Z | Ctrl+K Z | Medium |

**Customization:**
- Allow JSON-based override
- Provide GUI editor
- Support chord sequences

---

## 6. Settings UI

### How VS Code Does It

**Dual-mode approach:**
1. **GUI Editor** - Searchable, categorized settings with descriptions
2. **JSON Editor** - Direct `settings.json` editing for power users

**Features:**
| Feature | Description |
|---------|-------------|
| Search | Fuzzy search across all settings |
| Categories | Grouped by feature area |
| Scope | User vs Workspace settings |
| Defaults | Clearly marked default values |
| Modified indicator | Highlight changed settings |
| Reset option | Revert individual settings |

**Scope Hierarchy:**
```
Default < User Settings < Workspace Settings < Folder Settings
```

### What The Keep Should Adopt

**Settings Architecture:**

| Scope | Use Case |
|-------|----------|
| User Settings | Personal preferences (theme, keybindings) |
| Vault Settings | Per-vault configuration |

**Settings Categories:**
- **Editor** - Font, line height, word wrap
- **Appearance** - Theme, icon set, layout defaults
- **AI** - Model selection, context window, temperature
- **Knowledge Base** - Sync interval, ignored patterns
- **Inbox** - Auto-processing rules, default actions
- **Keyboard** - Shortcut customization

**UI Pattern:**
- Default to GUI editor for discoverability
- JSON view for power users (`workbench.settings.editor: json`)
- Real-time apply (no save button needed)

---

## 7. Extension/Plugin Architecture

### How VS Code Does It

**Architecture:**
- Extensions run in isolated **Extension Host** process
- Communicate via well-defined API surface
- Declarative contributions in `package.json`
- Activation events (lazy loading)

**Contribution Points:**
| Point | What It Adds |
|-------|--------------|
| commands | New commands |
| views | Sidebar views |
| viewsContainers | New Activity Bar items |
| menus | Context menu items |
| keybindings | Default shortcuts |
| configuration | Settings schema |
| languages | Language support |
| themes | Color themes |

### What The Keep Should Adopt (Future)

**Phase 1 - Internal Plugins:**
- Modular architecture from day one
- Core features as "built-in plugins"
- Clear extension points

**Phase 2 - User Plugins (future):**
| Extension Type | Capability |
|----------------|------------|
| Views | Add sidebar panels |
| Commands | Add to command palette |
| AI Actions | Custom AI workflows |
| Processors | Inbox content handlers |
| Themes | Visual customization |

**For MVP:** Defer plugin system, but architect with modularity in mind.

---

## 8. Cursor AI Features

### How Cursor Does It

Cursor (built on VS Code) adds three core AI interaction modes:

**1. Cmd+K (Inline Edit)**
- Select code/text, press Cmd+K
- Type instruction ("add error handling", "simplify this")
- See diff preview of proposed changes
- Accept (Tab) or Reject (Esc)
- Can accept word-by-word (Ctrl+Arrow)

**2. Cmd+L (Chat Panel)**
- Opens sidebar chat
- Full conversation with codebase context
- AI pulls relevant files automatically
- Suggests code snippets to apply

**3. Tab Completion (Ghost Text)**
- Inline suggestions as you type
- Multi-line, context-aware
- Can edit/delete around cursor (not just append)
- Accept with Tab, reject with Esc

**4. Composer Mode (New 2026)**
- Agent-centric interface
- Works autonomously on larger tasks
- Runs in cloud (not local)
- Can be triggered from browser/phone/Slack

**Key Innovation - Full Codebase Context:**
- Custom embedding model indexes entire project
- Retrieves relevant files automatically
- Works across massive repositories

### What The Keep Should Adopt

**AI Integration Patterns:**

| Pattern | The Keep Equivalent |
|---------|---------------------|
| Cmd+K inline | AI refine/summarize selected text |
| Cmd+L chat | AI chat panel with knowledge context |
| Ghost text | AI completion in editor |
| Codebase context | Knowledge base embeddings |

**The Keep AI Features:**

| Feature | Shortcut | Description |
|---------|----------|-------------|
| AI Chat | Cmd+L | Open AI panel, ask questions about knowledge base |
| AI Inline | Cmd+K | Select text, ask AI to transform (summarize, expand, etc.) |
| AI Suggest | Cmd+Shift+K | Get AI suggestions for current document (tags, links, etc.) |
| AI Process | Cmd+Enter (inbox) | AI categorize and file inbox item |

**Context Strategy:**
- Index entire knowledge base with embeddings
- Auto-retrieve relevant documents for context
- Show "context pills" indicating which docs are included

---

## 9. Search

### How VS Code Does It

**Architecture:**
- Powered by ripgrep (blazing fast)
- Search panel in sidebar
- Find in files (`Cmd+Shift+F`)
- Find in current file (`Cmd+F`)

**Features:**
| Feature | Description |
|---------|-------------|
| Regex support | Full regex patterns |
| Case sensitivity | Toggle on/off |
| Whole word | Match complete words only |
| Include/exclude | Glob patterns for files |
| Replace | Find and replace across files |
| Search history | Recent searches saved |
| Result preview | See matches in context |
| Click to open | Jump to file and line |

### What The Keep Should Adopt

**Search Features:**

| Feature | Priority | Notes |
|---------|----------|-------|
| Global search | Critical | Across all documents |
| Search panel | Critical | Results with preview |
| Regex support | High | Power user feature |
| Saved searches | High | Persistent search views |
| Filter by type | Medium | Documents, URLs, notes |
| Filter by date | Medium | Recent, this week, etc. |
| Filter by tag | Medium | Narrow by metadata |
| Semantic search | High | AI-powered meaning search |

**Hybrid Search:**
- Traditional text search (fast, exact)
- Semantic search (AI embeddings, meaning-based)
- Combined results ranked by relevance

---

## 10. Layout Persistence

### How VS Code Does It

**Automatic Persistence:**
- Editor layout restored on reopen
- Open files and tabs restored
- Sidebar state preserved
- Panel visibility and size saved
- Window position remembered

**Storage:**
- Workspace state in `.vscode/` folder
- User settings in user data directory
- `window.restoreWindows` setting controls behavior

**Options:**
| Value | Behavior |
|-------|----------|
| `all` | Restore all previous windows |
| `one` | Restore last active window |
| `folders` | Only restore folder windows |
| `none` | Fresh start every time |

### What The Keep Should Adopt

**Persistence Strategy:**

| What to Persist | Where | When |
|-----------------|-------|------|
| Layout arrangement | IndexedDB | On layout change |
| Open documents | IndexedDB | On open/close |
| Sidebar state | IndexedDB | On toggle/resize |
| Panel sizes | IndexedDB | On resize |
| Scroll position | IndexedDB | Periodically |
| Unsaved drafts | IndexedDB | Auto-save interval |

**Implementation:**
- Use IndexedDB for structured data storage
- Auto-save on changes (debounced)
- Manual layout save/restore (named layouts)
- URL-shareable layout configurations (future)

---

## 11. What The Keep Should Adopt - Summary

### Critical (MVP Must-Have)

| Pattern | Source | Implementation |
|---------|--------|----------------|
| Command Palette | VS Code | Dockview + custom command registry |
| Panel Docking | VS Code/Dockview | Dockview native |
| Tabbed Documents | VS Code | Dockview tabs |
| Keyboard Shortcuts | VS Code | Hotkeys library + customization |
| AI Chat Panel | Cursor | Sidebar panel with LLM integration |
| AI Inline Actions | Cursor | Cmd+K modal over selected text |
| Global Search | VS Code | Search panel with results tree |
| Layout Persistence | VS Code | IndexedDB for state |

### High Priority (Near-term)

| Pattern | Source | Implementation |
|---------|--------|----------------|
| File Explorer Tree | VS Code | Custom tree component |
| Context Menus | VS Code | Right-click menus |
| Settings UI | VS Code | GUI + JSON dual mode |
| Pinned Tabs | VS Code | Tab state management |
| Semantic Search | Cursor | Embeddings + RAG |

### Medium Priority (Future)

| Pattern | Source | Implementation |
|---------|--------|----------------|
| Multiple Sidebars | VS Code | Secondary sidebar |
| Tab Groups | VS Code | Dockview groups |
| Plugin System | VS Code | Extension architecture |
| Floating Windows | VS Code | Dockview popout |
| AI Tab Completion | Cursor | Ghost text suggestions |

---

## 12. Web Considerations

### Browser Limitations

| Desktop Feature | Web Alternative |
|-----------------|-----------------|
| Native file system | File System Access API (Chrome) / uploads |
| Multiple windows | Dockview popout (new tab) |
| System shortcuts | Must avoid browser-reserved shortcuts |
| Offline storage | IndexedDB + Service Workers |
| Background sync | Service Workers + periodic sync |
| Native menus | Custom context menus |

### Storage Strategy

**IndexedDB for:**
- Document content and metadata
- Layout state
- User preferences
- Search index
- Offline cache

**Estimated Storage:**
- IndexedDB quota: 50% of available disk (Chrome)
- Typically 10-50GB available
- More than enough for text-based knowledge

### Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Large document trees | Virtual scrolling |
| Many open tabs | Lazy loading content |
| Search performance | Web Worker for indexing |
| AI calls | Stream responses |
| Initial load | Code splitting, lazy imports |

### PWA Capabilities

| Feature | Implementation |
|---------|----------------|
| Offline access | Service Worker cache |
| Install prompt | Web App Manifest |
| Push notifications | Not needed for v1 |
| Background sync | Periodic sync API |
| File handling | File System Access API |

### Monaco Editor Considerations

If using Monaco for document editing:
- Version 0.52+ recommended for better performance
- Safari performance can be problematic
- Large files (>100KB) may need virtualization
- Consider CodeMirror 6 as alternative for Markdown

---

## Appendix: Implementation Stack

### Recommended Libraries

| Purpose | Library | Notes |
|---------|---------|-------|
| Panel System | dockview-react | VS Code-style docking |
| Text Editor | Monaco or CodeMirror 6 | Monaco for code, CM6 for prose |
| Markdown | MDX or Markdoc | React-friendly rendering |
| Command Palette | kbar or cmdk | React command menu |
| Keyboard Shortcuts | hotkeys-js or react-hotkeys-hook | Cross-platform |
| Tree View | react-arborist | Virtual scrolling tree |
| State Management | Zustand or Jotai | Lightweight, persist to IndexedDB |
| IndexedDB | Dexie.js | Promise-based wrapper |
| Search | Fuse.js or FlexSearch | Client-side text search |
| Embeddings | @anthropic-ai/sdk | For AI features |

### Architecture Sketch

```
src/
├── components/
│   ├── panels/           # Dockview panel components
│   │   ├── KnowledgeTree/
│   │   ├── DocumentEditor/
│   │   ├── AIChat/
│   │   ├── SearchResults/
│   │   └── Inbox/
│   ├── command-palette/  # Cmd+Shift+P
│   └── settings/         # Settings UI
├── hooks/
│   ├── useLayout.ts      # Dockview layout management
│   ├── useKeyboard.ts    # Keyboard shortcuts
│   └── useAI.ts          # AI integration
├── stores/
│   ├── documents.ts      # Document state
│   ├── layout.ts         # Layout persistence
│   └── settings.ts       # User settings
└── lib/
    ├── indexeddb/        # Dexie setup
    ├── search/           # Text + semantic search
    └── ai/               # LLM integration
```

---

## Sources

### VS Code Documentation
- [Command Palette UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/command-palette)
- [User Interface Overview](https://code.visualstudio.com/docs/getstarted/userinterface)
- [Tree View API](https://code.visualstudio.com/api/extension-guides/tree-view)
- [Keyboard Shortcuts](https://code.visualstudio.com/docs/configure/keybindings)
- [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)
- [Custom Layout](https://code.visualstudio.com/docs/configure/custom-layout)
- [Activity Bar Guidelines](https://code.visualstudio.com/api/ux-guidelines/activity-bar)
- [Sidebars Guidelines](https://code.visualstudio.com/api/ux-guidelines/sidebars)
- [Extension API](https://code.visualstudio.com/api)

### Cursor IDE
- [Cursor Features](https://cursor.com/features)
- [Cursor Tab Completion Docs](https://cursor.com/docs/tab/overview)
- [Cursor AI Review 2026](https://www.eesel.ai/blog/cursor-reviews)
- [Cursor Complete Guide 2026](https://crazyrouter.com/en/blog/cursor-ai-ide-complete-guide-2026)
- [Cursor Tab vs GitHub Copilot](https://apidog.com/blog/cursor-tab/)
- [Cursor AI Review (Prismic)](https://prismic.io/blog/cursor-ai)

### Dockview
- [Dockview Official Site](https://dockview.dev/)
- [Dockview GitHub](https://github.com/mathuo/dockview)
- [Dockview Tabs Documentation](https://dockview.dev/docs/core/panels/tabs/)

### Web Technologies
- [IndexedDB and SQLite in 2025](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)
- [Browser Storage Guide 2025](https://medium.com/@osamajavaid/master-browser-storage-in-2025-the-ultimate-guide-for-front-end-developers-7b2735b4cc13)
- [PWA Offline Data](https://web.dev/learn/pwa/offline-data)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

*This research informs The Keep's UX design phase (BMAD Step 4).*
