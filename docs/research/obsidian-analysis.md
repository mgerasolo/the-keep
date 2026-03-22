# Obsidian Analysis: Research Findings for The Keep

> **Research Date:** March 22, 2026
> **Purpose:** Inform The Keep's product development by understanding what makes Obsidian successful, where it falls short, and what patterns we should adopt or improve upon.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Obsidian Features](#core-obsidian-features)
3. [Most Popular Plugins](#most-popular-plugins)
4. [Plugin Deep Dives](#plugin-deep-dives)
5. [Plugin Architecture](#plugin-architecture)
6. [What We Should Steal](#what-we-should-steal)
7. [What We Should Improve](#what-we-should-improve)
8. [Web-First Considerations](#web-first-considerations)
9. [Sources](#sources)

---

## Executive Summary

Obsidian has become the dominant personal knowledge management tool by 2026, with over 2,500 community plugins. Its success stems from three core principles:

1. **Local-first, markdown files** - Full data ownership
2. **Bidirectional linking with graph visualization** - Networked thinking
3. **Extreme extensibility** - Plugin architecture that lets users build their perfect tool

**The Keep's Opportunity:** Obsidian's desktop-only nature and lack of real-time collaboration create a significant gap for a web-first IDE approach. By combining Obsidian's knowledge management strengths with VS Code's workspace paradigm and native AI integration, The Keep can capture users who need accessibility, collaboration, and modern tooling.

---

## Core Obsidian Features

### Philosophy & Architecture

| Principle | Implementation |
|-----------|----------------|
| **Local-First** | Plain markdown files stored in a "vault" folder on your device |
| **Future-Proofing** | No proprietary format; files work with any text editor |
| **Networked Thinking** | Bidirectional links create a web of connected knowledge |
| **Privacy** | No forced cloud sync; optional Obsidian Sync ($8/month) |
| **Free Core** | Full-featured app free for personal use |

### Key Native Features

#### 1. Bidirectional Linking
- Use `[[Note Name]]` syntax to link to any note
- Both notes become "aware" of the connection
- Backlinks panel shows all notes linking TO the current note
- Creates emergent structure through organic linking

#### 2. Graph View
- **Global Graph:** Visualizes entire vault as force-directed network
- **Local Graph:** Shows notes connected to current note (configurable depth)
- Node size = number of incoming backlinks
- Links rendered as connecting lines
- Useful for discovering clusters and orphaned notes

#### 3. Canvas
- **Infinite zoomable workspace** introduced in v1.1.0
- Embed notes, images, PDFs, videos, audio, web pages
- Drag-and-drop positioning
- Connect cards with labeled arrows (concept mapping)
- JSON Canvas open file format (`.canvas` files)
- Great for brainstorming, project planning, research visualization

#### 4. Daily Notes
- Date-based markdown files (e.g., `2026-03-22.md`)
- Template-based creation
- Links to calendar UI
- Foundation for journaling workflows

#### 5. Core Search
- Full-text search across vault
- Tag-based filtering (`#tag`)
- Path-based filtering (`path:folder/`)
- Property-based filtering (frontmatter YAML)

#### 6. Properties (Frontmatter)
```yaml
---
title: My Note
tags: [concept, important]
created: 2026-03-22
status: draft
---
```
- YAML frontmatter for structured metadata
- Queryable via Dataview
- Powers organization without folders

#### 7. Web Viewer (Plugin)
- Embed web pages within Obsidian
- Navigate external links without leaving app
- Limited compared to full browser

---

## Most Popular Plugins

### Top 10 Most Downloaded (All-Time, March 2026)

| Rank | Plugin | Downloads | Primary Function |
|------|--------|-----------|------------------|
| 1 | **Excalidraw** | #1 | Visual whiteboard/sketching |
| 2 | **Templater** | #2 | Dynamic template engine |
| 3 | **Dataview** | #3 | Query language for notes |
| 4 | **Tasks** | #4 | Task management with queries |
| 5 | **Advanced Tables** | #5 | Excel-like table editing |
| 6 | **Calendar** | #6 | Calendar UI + daily notes |
| 7 | **Git** | #7 | Version control integration |
| 8 | **Kanban** | #8 | Board-style task management |
| 9 | **Style Settings** | #9 | Theme customization UI |
| 10 | **Iconize** | #10 | Custom icons for files/folders |

### Essential Plugin Categories

**Core Workflow (Master First):**
- Calendar, Periodic Notes, Dataview, Tasks, Templater

**Visual Thinking:**
- Excalidraw, Canvas (built-in), Mind Map

**Organization:**
- Folder Note, File Tree Alternative, Tag Wrangler

**Writing:**
- Linter, Outliner, Longform

**AI Integration (Growing Fast):**
- Copilot, Smart Connections, AI assistants

### Recent Trending (Last 30 Days)
1. Excalidraw
2. Templater
3. Tasks
4. Dataview
5. Git
6. Copilot (AI integration)

---

## Plugin Deep Dives

### Dataview

**Purpose:** Add a live query language to query, filter, and display data from your notes.

**Query Types:**

| Type | Description |
|------|-------------|
| `TABLE` | Results as table with customizable columns |
| `LIST` | Bullet point list of matching pages |
| `TASK` | Interactive task list from across vault |
| `CALENDAR` | Calendar visualization of dates |

**Basic Query Structure:**
```dataview
TABLE file.ctime as "Created", status
FROM #project
WHERE status != "completed"
SORT file.ctime DESC
```

**Data Sources (FROM):**
- `FROM "folder/path"` - All notes in folder
- `FROM #tag` - Notes with specific tag
- `FROM [[Note Name]]` - Notes linking to/from note
- Combine with `AND`, `OR`

**Data Commands:**
- `WHERE` - Filter results
- `SORT` - Order results
- `GROUP BY` - Group results
- `LIMIT` - Cap number of results
- `FLATTEN` - Expand arrays to rows

**Query Methods:**
1. **DQL (Dataview Query Language)** - SQL-like, most common
2. **Inline** - Single values: `` `= this.status` ``
3. **JavaScript** - Full JS for complex queries

**Implicit Metadata Available:**
- `file.name`, `file.path`, `file.ctime`, `file.mtime`
- `file.size`, `file.tags`, `file.frontmatter`
- `file.inlinks`, `file.outlinks`

**The Keep Implication:** We need a query system. Dataview's approach is powerful but the syntax is a barrier. Consider SQL-like syntax OR visual query builder OR natural language queries via AI.

---

### Tasks Plugin

**Purpose:** Track tasks across entire vault with due dates, priorities, queries, and recurring tasks.

**Task Syntax:**
```markdown
- [ ] Basic task
- [x] Completed task
- [ ] Task with due date 📅 2026-03-25
- [ ] High priority task ⏫
- [ ] Task with time ⏰ 14:00
- [ ] Recurring task 🔁 every week
- [ ] Task with start date 🛫 2026-03-20
- [ ] Task with scheduled date ⏳ 2026-03-21
- [ ] Auto-delete after completion 🏁
```

**Priority Levels:**
| Emoji | Level |
|-------|-------|
| ⏫ | High |
| 🔼 | Medium |
| 🔽 | Low |

**Date Types:**
| Emoji | Purpose |
|-------|---------|
| 📅 | Due date |
| 🛫 | Start date |
| ⏳ | Scheduled date |
| ✅ | Done date (auto-added) |

**Query Blocks:**
````markdown
```tasks
not done
due before tomorrow
sort by due
limit 10
group by filename
```
````

**Query Operators:**
- `not done`, `done`
- `due [before|after|on] DATE`
- `has due date`, `no due date`
- `path includes X`
- `tags include #tag`
- `priority is [high|medium|low]`

**Key Features:**
- Toggle task completion from any query view (updates source file)
- Recurring tasks auto-create next occurrence
- Global task dashboard views
- Integration with Daily Notes

**The Keep Implication:** Task management is essential. The emoji-based syntax is clever for portability but not ideal UX. We can do better with a proper task UI that stores task metadata structurally.

---

### Kanban Plugin

**Purpose:** Visual board-style task management using markdown files.

**How It Works:**
- Creates `.md` files with special formatting
- Each list (column) is a markdown heading
- Each card is a bullet point
- Drag-and-drop in visual mode
- Syncs back to markdown

**Features:**
- Auto-complete tasks when moved to "Done" column
- Date picker with `@` symbol
- Link dates to Daily Notes
- Turn cards into full notes
- Mobile drag-and-drop support

**File Format (Markdown):**
```markdown
---
kanban-plugin: basic
---

## Backlog
- [ ] Research competitors
- [ ] Define MVP scope

## In Progress
- [ ] Build prototype

## Done
- [x] Write requirements
```

**Newer Alternative: Base Board Plugin**
- Property-driven Kanban powered by Obsidian Bases
- More database-like approach
- Works with note properties vs inline tasks

**The Keep Implication:** Board view is essential for project management. We should support multiple board types (Kanban, timeline, table) with the same underlying data.

---

### Templater Plugin

**Purpose:** Dynamic template engine with JavaScript execution capabilities.

**Syntax:**
Uses Eta templating language with `<% %>` delimiters.

**Basic Examples:**
```markdown
# Daily Note for <% tp.date.now("YYYY-MM-DD") %>

Created: <% tp.file.creation_date("YYYY-MM-DD HH:mm") %>
Author: <% tp.user.name() %>

## Tasks
<% tp.file.include("[[templates/daily-tasks]]") %>
```

**Built-in Modules:**

| Module | Functions |
|--------|-----------|
| `tp.date` | Date formatting, arithmetic, now, yesterday, tomorrow |
| `tp.file` | File creation, renaming, moving, including other files |
| `tp.system` | Clipboard access, user prompts, command execution |
| `tp.web` | Fetch data from URLs |
| `tp.frontmatter` | Access YAML frontmatter |
| `tp.user` | Custom user functions |

**Advanced Features:**
- **User Prompts:** `<% tp.system.prompt("Enter title") %>`
- **Clipboard:** `<% tp.system.clipboard() %>`
- **Conditionals:** `<% if (tp.file.tags.includes("work")) { %>...<%}%>`
- **Loops:** `<% for (let i = 0; i < 5; i++) { %>...<%}%>`
- **Web Fetch:** `<% tp.web.request("https://api.example.com") %>`
- **File Operations:** Create, rename, move files programmatically

**Trigger Options:**
- On file creation
- On specific templates
- Via command palette
- Hotkey triggered

**The Keep Implication:** Templater's power comes from executing code. For web, we need a sandboxed equivalent. Consider:
- Template DSL with safe built-ins
- AI-powered template generation
- Visual template builder

---

### Excalidraw Plugin

**Purpose:** Full whiteboard/sketching tool embedded in Obsidian.

**Core Features:**
- Hand-drawn aesthetic (like whiteboard sketches)
- Shapes: rectangles, ellipses, arrows, lines, text
- Freehand drawing
- Infinite canvas
- Groups and layers
- Library of reusable components

**Obsidian Integration:**
- Embed drawings in markdown notes
- Link from drawings TO notes (and vice versa)
- Preview drawings inline
- Search drawing text content

**Advanced Features:**
- LaTeX support for math
- Markdown text within drawings
- Script engine for automation
- ExcaliAI for AI-powered features
- Template support
- Export to PNG, SVG

**Why It's #1:**
- Visual thinkers love it
- Perfect for diagrams, architecture, UI mockups
- Bridges visual and textual knowledge

**The Keep Implication:** Visual workspace is crucial. We should integrate a whiteboard tool, whether Excalidraw itself (MIT licensed) or TLDraw (also excellent, also MIT).

---

## Plugin Architecture

### How Obsidian Plugins Work

**Base Class:**
```typescript
import { Plugin, App, Vault, Workspace } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    // Register resources here
  }

  async onunload() {
    // Optional cleanup (most resources auto-cleanup)
  }
}
```

**Core APIs Available:**

| API | Purpose |
|-----|---------|
| `App` | Main application access |
| `Vault` | File system operations |
| `Workspace` | UI panes and views |
| `MetadataCache` | Note metadata, links, tags |
| `FileManager` | High-level file operations |

**Extension Points:**

| Type | Method |
|------|--------|
| Commands | `this.addCommand()` |
| Settings | `this.addSettingTab()` |
| Ribbon Icons | `this.addRibbonIcon()` |
| Views | `this.registerView()` |
| Event Handlers | `this.registerEvent()` |
| Markdown Processors | `this.registerMarkdownCodeBlockProcessor()` |
| Editor Extensions | `this.registerEditorExtension()` |

**Lifecycle:**
- `onload()` - Plugin activated, register all extensions
- `onunload()` - Plugin deactivated, auto-cleanup runs
- Resources registered via `this.add*()` auto-cleanup
- Manual cleanup only needed for non-framework resources

**Development:**
- TypeScript-based
- Official sample plugin: github.com/obsidianmd/obsidian-sample-plugin
- Hot reload supported during development
- API types: github.com/obsidianmd/obsidian-api

**The Keep Implication:** We need an extension system. Consider:
- Plugin API for custom views, commands, processors
- Sandboxed execution (critical for web security)
- Plugin marketplace
- First-party "blessed" plugins for core functionality

---

## What We Should Steal

### Must-Have Features

| Feature | Why | Implementation Notes |
|---------|-----|---------------------|
| **Bidirectional Linking** | Core to networked knowledge | `[[]]` syntax, backlinks panel, auto-suggest |
| **Graph View** | Visual discovery of connections | Force-directed layout, local + global |
| **Markdown-First** | Portability, familiarity | Standard markdown + extensions |
| **Quick Capture** | Low friction note creation | Hotkey, slash commands, mobile quick add |
| **Daily Notes** | Journaling + task foundation | Date-based with templates |
| **Canvas/Whiteboard** | Visual thinking | Infinite canvas, embed notes |
| **Properties/Frontmatter** | Structured metadata | YAML, queryable |
| **Template System** | Reduce repetition | Dynamic with variables |

### Query/Data Layer

| Feature | Dataview Approach | The Keep Opportunity |
|---------|-------------------|---------------------|
| Query notes | DQL syntax | Natural language OR visual builder |
| Filter by metadata | WHERE clauses | Faceted search UI |
| Aggregate data | GROUP BY | Dashboard widgets |
| Display formats | TABLE, LIST, etc. | More view types + charts |

### Task Management

| Feature | Tasks Plugin | The Keep Enhancement |
|---------|-------------|---------------------|
| Due dates | Emoji syntax | Proper date picker UI |
| Priorities | Emoji levels | Visual priority flags |
| Recurring | Text rules | Natural language + calendar |
| Queries | Code blocks | Saved filters + views |
| Projects | Tags/folders | First-class project entity |

### Visual Tools

| Feature | Obsidian Way | The Keep Approach |
|---------|--------------|-------------------|
| Whiteboard | Excalidraw plugin | Integrated (TLDraw?) |
| Diagrams | Mermaid blocks | Visual + code |
| Kanban | Plugin | Core feature |
| Timeline | Plugin | Core feature |
| Table | Plugin | Excel-like native |

### Plugin Patterns Worth Adopting

1. **Calendar integration** - Visual date navigation
2. **Periodic notes hierarchy** - Daily → Weekly → Monthly → Yearly
3. **Style Settings** - User customization without code
4. **QuickAdd** - Rapid capture workflows
5. **Linter** - Auto-format and clean notes
6. **Outliner** - Vim-like outline manipulation
7. **Folder notes** - Folders as navigable notes

---

## What We Should Improve

### Obsidian's Pain Points → Our Opportunities

#### 1. Learning Curve
**Problem:** Obsidian takes weeks/months to set up properly
**Our Solution:**
- Guided onboarding with templates
- AI-assisted setup ("What do you want to track?")
- Sensible defaults that work immediately
- Gradual complexity disclosure

#### 2. Collaboration
**Problem:** No real-time collaboration, no comments, no sharing
**Our Solution:**
- Real-time co-editing (CRDT-based)
- Comments on any content
- Easy publish/share workflows
- Team workspaces

#### 3. Search
**Problem:** Basic search lacks boolean operators, metadata queries
**Our Solution:**
- Advanced search with visual query builder
- Natural language search ("notes from last week about AI")
- Saved searches as dynamic views
- Full-text + metadata + semantic search

#### 4. Sync
**Problem:** Manual setup or paid Obsidian Sync
**Our Solution:**
- Built-in cloud sync (free tier)
- Real-time across devices
- Conflict resolution UI
- Offline-first with auto-sync

#### 5. Web Access
**Problem:** Desktop-only, can't access from random computer
**Our Solution:**
- **Web-first** - access anywhere with a browser
- PWA for mobile
- Native apps for performance

#### 6. Organization at Scale
**Problem:** Vaults become chaos without discipline
**Our Solution:**
- Smart suggestions for linking/tagging
- AI-powered organization
- Automatic cleanup of orphaned notes
- Health dashboard for vault

#### 7. PDF/Document Handling
**Problem:** No good PDF annotation
**Our Solution:**
- PDF viewer with highlights/annotations
- Link to specific PDF locations
- Extract highlights to notes
- OCR for image text

#### 8. Plugin Quality
**Problem:** Plugin ecosystem is hit-or-miss quality
**Our Solution:**
- First-party "blessed" extensions
- Sandboxed third-party plugins
- Quality verification process
- Better discovery

#### 9. Mobile Experience
**Problem:** Mobile apps are compromised vs desktop
**Our Solution:**
- Same feature parity across devices
- Mobile-optimized UI
- Voice capture
- Camera → OCR → notes

#### 10. AI Integration
**Problem:** AI plugins exist but feel bolted-on
**Our Solution:**
- **Native AI throughout:**
  - AI search and summarization
  - AI-assisted linking suggestions
  - AI writing assistance
  - AI-powered queries
  - AI organization suggestions

### Feature Comparison: Obsidian vs The Keep Target

| Capability | Obsidian | The Keep Target |
|------------|----------|-----------------|
| Platform | Desktop + Mobile apps | **Web-first** + PWA + native |
| Collaboration | None | **Real-time** |
| AI | Plugin | **Native, throughout** |
| Sync | Paid add-on | **Built-in** |
| Query UI | Code-only | **Visual + code + NL** |
| Onboarding | DIY | **Guided** |
| Task UI | Emoji syntax | **Rich UI** |
| Search | Basic | **Advanced + semantic** |

---

## Web-First Considerations

### What Changes Moving Desktop → Web

#### Storage
| Desktop | Web |
|---------|-----|
| Local filesystem | IndexedDB + cloud sync |
| Direct file access | File System Access API (limited) |
| Large vaults cheap | Storage quotas apply |

**Implications:**
- Need efficient sync strategy
- IndexedDB for offline cache
- Cloud as source of truth
- Import/export for local files

#### Performance
| Desktop | Web |
|---------|-----|
| Native code | JavaScript/WASM |
| Full system memory | Browser memory limits |
| Direct disk I/O | Async everything |

**Implications:**
- Lazy loading mandatory
- Virtual scrolling for large lists
- Web Workers for computation
- Consider WASM for graph layout

#### Plugins/Extensions
| Desktop | Web |
|---------|-----|
| Node.js available | Browser sandbox |
| File system access | Restricted |
| Native modules | Web APIs only |

**Implications:**
- Sandboxed iframe execution for plugins
- Web-compatible API surface
- May need to reimplement popular plugins as first-party
- Extension manifest for permissions

#### Security
| Desktop | Web |
|---------|-----|
| User's machine | Shared environment |
| Trust user code | Sandbox required |
| Local encryption optional | TLS + encryption required |

**Implications:**
- End-to-end encryption for sensitive data
- CSP headers
- Sandboxed plugin execution
- OAuth/SSO for enterprise

#### Offline Support
| Desktop | Web |
|---------|-----|
| Always works | Requires Service Worker |
| Files always there | Cache management |

**Implications:**
- PWA with Service Worker
- IndexedDB for offline data
- Sync queue for offline changes
- Conflict resolution UI

### Web Advantages We Should Leverage

| Advantage | How to Use |
|-----------|------------|
| **Zero install** | Instant access, easy onboarding |
| **Cross-platform** | One codebase, any device |
| **URL-based** | Share specific notes/views via URL |
| **Real-time** | WebSockets for collaboration |
| **Automatic updates** | No user action needed |
| **Integration** | OAuth, embeds, iframes |

### Technology Considerations

**Editor Core:**
- Monaco Editor (VS Code's editor) - proven at scale
- CodeMirror 6 - lighter, more customizable
- ProseMirror - excellent for rich text
- TipTap - ProseMirror wrapper, good DX

**Real-time Sync:**
- Yjs - CRDT library, mature
- Automerge - alternative CRDT
- Custom OT - more control, more work

**Storage:**
- IndexedDB via Dexie.js
- Cloud: PostgreSQL + object storage
- File format: Markdown + JSON metadata

**Canvas/Whiteboard:**
- TLDraw - excellent, MIT licensed
- Excalidraw - also MIT, hand-drawn style
- Custom - maximum control

---

## Sources

### Official Resources
- [Obsidian Home](https://obsidian.md/)
- [Obsidian Plugins Directory](https://obsidian.md/plugins)
- [Obsidian Developer Documentation](https://docs.obsidian.md/)
- [Obsidian API (GitHub)](https://github.com/obsidianmd/obsidian-api)
- [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)

### Plugin Documentation
- [Dataview Documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [Tasks User Guide](https://publish.obsidian.md/tasks/)
- [Templater Documentation](https://silentvoid13.github.io/Templater/)
- [Excalidraw Plugin (GitHub)](https://github.com/zsviczian/obsidian-excalidraw-plugin)
- [Kanban Plugin (GitHub)](https://github.com/mgmeyers/obsidian-kanban)
- [Periodic Notes (GitHub)](https://github.com/liamcain/obsidian-periodic-notes)

### Community Analysis
- [Obsidian Stats - Plugin Rankings](https://www.obsidianstats.com/)
- [The Best Obsidian Plugins for 2026](https://www.dsebastien.net/the-must-have-obsidian-plugins-for-2026/)
- [Top Obsidian Plugins 2026 - Obsibrain](https://www.obsibrain.com/blog/top-obsidian-plugins-in-2026-the-essential-list-for-power-users)
- [Obsidian in 2025 - Productivity Work](https://productivitywork.com/obsidian-in-2025-the-revolutionary-knowledge-management-tool-thats-transforming-how-we-think-and-learn/)

### Reviews & Analysis
- [2025 Obsidian Report Card](https://practicalpkm.com/2025-obsidian-report-card/)
- [Obsidian Review - Lindy AI](https://www.lindy.ai/blog/obsidian-review)
- [Complete Obsidian Overview 2025 - eesel.ai](https://www.eesel.ai/blog/obsidian-overview)
- [Obsidian Weaknesses - Medium](https://medium.com/@theo-james/10-problems-with-obsidian-youll-realize-when-it-s-too-late-17e903886847)

### Feature Documentation
- [Obsidian Canvas](https://obsidian.md/canvas)
- [Graph View - Obsidian Help](https://help.obsidian.md/plugins/graph)
- [Daily Notes - Obsidian Help](https://help.obsidian.md/plugins/daily-notes)
- [Canvas Documentation](https://help.obsidian.md/plugins/canvas)

### Web/Self-Hosting Discussion
- [Obsidian for Web - Feature Request](https://forum.obsidian.md/t/obsidian-for-web/2049)
- [Self-Hosting Obsidian - XDA](https://www.xda-developers.com/i-self-hosted-obsidian-so-i-can-access-it-in-web-browser-anywhere/)

---

## Summary: Key Takeaways for The Keep

### Obsidian's Winning Formula
1. **Own your data** (markdown files)
2. **Think in networks** (bidirectional links + graph)
3. **Build your tool** (extensibility)

### Our Differentiation
1. **Web-first** - Access anywhere
2. **Collaboration-native** - Real-time with teams
3. **AI-native** - Not bolted on
4. **Lower barrier** - Guided, discoverable
5. **IDE workspace** - VS Code's layout paradigm

### Priority Features for MVP
1. Markdown editor with bidirectional linking
2. Graph view (local + global)
3. Canvas/whiteboard
4. Task management (better than emoji syntax)
5. Daily notes + calendar
6. Search (full-text + metadata)
7. Cloud sync

### Post-MVP
1. Query builder (visual + natural language)
2. Real-time collaboration
3. Plugin/extension system
4. AI assistance throughout
5. PDF annotation
6. Mobile PWA optimization
