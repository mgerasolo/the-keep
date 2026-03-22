# The Keep - Product Brief

**Version:** 1.1
**Date:** 2026-03-22
**Status:** Draft

---

## Product Vision

The Keep is a **Web-based Cursor-like IDE for personal knowledge management** - a self-hosted workspace where you manage documents, chat with AI agents, view embedded apps, and navigate an interconnected knowledge graph.

**One-liner:** Web Based Cursor meets Obsidian - a dockable workspace with AI agents and knowledge graphs.

**Potential Relationship to KnowledgeStack (TBD):**
- **KnowledgeStack** (separate project, if built) = Knowledge ingestion engine (transcripts, videos, experts)
- **The Keep** = Day-to-day personal workspace, inbox, best practices, files
- Integration TBD based on how both projects evolve

---

## Problem Statement

### Current Pain
- Files scattered across cloud drives, local folders, NAS
- No unified way to browse, view, and chat about file contents
- Existing tools are either:
  - **Wikis** (Notion, Outline) - create new docs, can't manage existing files
  - **Chat UIs** (LobeChat, ChatGPT) - no file browsing or management
  - **RAG tools** (Dify) - backend only, no proper file UI

### What's Needed
A single interface where you can:
1. Browse and organize existing files (PDFs, markdown, docs, images)
2. View multiple files side-by-side
3. Chat with AI about file contents
4. Search across everything with RAG

---

## Target User

**Primary:** Matt (solo user, personal knowledge management)

**Use Cases:**
- Health records: Lab results, doctor notes, prescriptions
- HOA documents: Meeting minutes, CC&Rs, financials
- Infrastructure docs: Configs, runbooks, diagrams
- Learning materials: Research papers, course notes, reference docs
- **Personal inventories**: Kitchen appliances, spices, pantry items
- **Recipe assistance**: AI uses health criteria + inventory + preferences to suggest recipes
- **Preference tracking**: Food likes/dislikes, taste preferences, dietary restrictions

---

## Core Requirements

### 1. Workspace Shell (Cursor-like Foundation)

| Feature | Description |
|---------|-------------|
| **dockview Panels** | VS Code-style draggable tabs, split panes, dockable anywhere |
| **Activity Bar** | Far-left icon bar for switching contexts (projects, search, settings) |
| **File Browser** | Tree view with folders, file icons, context menus |
| **Command Palette** | Cmd+K / Ctrl+K for quick actions |
| **Tab System** | Multiple files open, drag between panes |
| **Layout Persistence** | Save/restore panel arrangements |

### 2. Project Management

| Feature | Description |
|---------|-------------|
| **Multi-Project** | Health, HOA, Infrastructure, etc. as separate contexts |
| **Project Switcher** | Far-left icons OR top dropdown (maybe both) |
| **Clean Context** | Each project has isolated files, chat history, settings |
| **Project Linking** | Link related projects (Health ↔ Food, transcripts → summaries) |
| **Super Projects** | Combine multiple projects into unified AI context on demand |
| **Selective Integration** | Include/exclude linked projects from RAG dynamically |
| **Access Control** | Foundation for future multi-user with role-based permissions |
| **Project != Folder** | Projects are first-class entities with metadata, not just directories |

### 2b. Content Hierarchy & Tiered RAG

| Feature | Description |
|---------|-------------|
| **Three-Tier Content** | Raw (full labs, full transcripts) → Summary → Key Points |
| **Intelligent RAG Selection** | AI determines what content tier to query based on the question |
| **Query-Aware Expansion** | System automatically reaches into raw content when exact data needed |
| **Bulk Ingestion** | Handle 2,000+ video transcripts (1-5 hrs each) without context pollution |
| **Context Budget** | Don't pollute context window with irrelevant raw data |
| **Freshness Decay** | Content relevancy score degrades over time, factored into RAG ranking |
| **Domain-Specific Decay** | Finance/AI/Tech = high decay rate; Health fundamentals = low decay |
| **Time-Weighted RAG** | Newer content ranked higher for domains where freshness matters |
| **Source Trust (v2/v3)** | Basic trust: top categories + 1-10 scale per source per topic |
| **Cross-Project References** | Link food/recipes to health criteria, link transcripts to summaries |

**Key Requirement:** Must be able to get exact quotes/items from raw content on demand, even when not in default context.

**Open Architecture Question:** How to implement tiered RAG?
- Option A: Separate projects (Raw Health vs Health Summary) with linking
- Option B: Within-project hierarchy (/raw/ folder excluded from RAG by default)
- Option C: Document-level settings (each doc has raw/summary/keypoints with level selector)
- Option D: Graph-based (summary nodes link to raw nodes, AI traverses when needed)
- Option E: **Multi-tier indexing** (summaries in primary RAG, raw in secondary "deep search" - AI can dive deeper for exact quotes)

### 3. AI Chat (Claude Code-style)

| Feature | Description |
|---------|-------------|
| **Chat as Tab** | AI conversation opens as dockview tab, not fixed sidebar |
| **Dockable Anywhere** | Drag to right, bottom, split pane, pop out |
| **Multiple Agents** | Support for different AI agents/personas |
| **Context Aware** | Knows which files are open, can reference them |
| **Multi-File Context** | Link multiple files to a conversation, summarize across them |
| **RAG Integration** | Query across entire project knowledge base |
| **Model Selection** | Choose from LiteLLM models (jarvis-chat, jarvis-qwen72b, etc.) |
| **LLM Priority** | Prioritize local/free LLMs first, fallback to paid APIs |
| **Smart Routing** | Haiku-level assessment recommends best LLM for task |
| **Intelligent RAG** | AI determines what content depth to query (summary vs raw) based on question |
| **Model Recommendations** | System suggests: "This would work better with [model] - switch?" |
| **Artifact Output** | AI can create new files/documents as conversation outputs |
| **Editable AI Outputs** | Unlike ChatGPT - AI creates files you can edit directly, change one item without regenerating entire file |

### 4. Document Editing (Obsidian-style)

| Feature | Description |
|---------|-------------|
| **Markdown Native** | Primary format, AI-friendly, plain text |
| **Rich Toolbar** | Tables, formatting, links (like Obsidian plugins) |
| **Plain Text Mode** | Easy to view/edit raw markdown |
| **Preview Mode** | Rendered markdown view |
| **Split Edit/Preview** | Side-by-side editing |

### 5. Personal Knowledge System

| Feature | Description |
|---------|-------------|
| **Inventories** | Structured data: kitchen appliances, spices, pantry, equipment |
| **Personal Profiles** | Health criteria, dietary restrictions, preferences |
| **Preference Tracking** | Likes/dislikes, taste preferences, learned over time |
| **Memory Extraction** | AI auto-extracts insights from conversations worth saving |
| **Memory Storage** | TBD: Explicit files in project OR secondary memory system |
| **Atomic Memories** | Each memory = single fact/value, NOT giant blobs with 27 points |
| **Editable Memories** | Unlike ChatGPT - granular editing of individual values (e.g., update weight without rewriting paragraph) |
| **Memory Management** | View all, edit specific items, consolidate duplicates, delete individual memories |
| **Contextual AI** | AI uses profiles + inventories + preferences for tasks (e.g., recipes) |
| **Second Brain / Quick Capture (MVP+1)** | Dump ideas quickly, create tasks/follow-ups from notes |
| **Inbox Workflow (MVP+1/+2)** | Ingest raw content → process → extract into structured knowledge |
| **Task Extraction (MVP+1)** | "Remind me to ask doctor about X" → creates task with context |
| **Data Standardization** | Normalize data (e.g., lab results) into standard formats for better RAG |
| **Automated Ingestion (MVP+2/3)** | Pull from YouTube, emails, Grok API, reports automatically |
| **Best Practices Synthesis** | Incoming content → extract → build evolving best practices docs |
| **Action Plan Generation** | Synthesize advice into actionable plans (secure, manage, optimize) |
| **Raw Content Archive** | Store source material for deep-dive queries |

### 6. Knowledge Graph

| Feature | Description |
|---------|-------------|
| **Auto-Integration** | All files automatically indexed into RAG knowledge base |
| **Explicit Integration** | Manually select specific files to include/exclude from RAG |
| **Backend Graph** | Understand document relationships and connections |
| **Link Tracking** | Bi-directional links between documents |
| **Smart Retrieval** | Find related content via graph traversal |
| **RAG Enhancement** | Graph context improves AI responses |

### 6. Embedded Views

| Feature | Description |
|---------|-------------|
| **Embedded Browser** | View external apps (Dify, dashboards) in tabs |
| **Workflow View** | Task list / workflow status panel |
| **Custom Views** | Extensible for future data types |

### 7. Hooks & Extensions

| Feature | Description |
|---------|-------------|
| **Message Hooks** | Pre/post hooks on AI message processing (like Claude Code) |
| **Custom Processing** | Inject custom logic before/after AI responses |
| **Event System** | Hook into file events, project events, conversation events |
| **Extension System** | Plugin architecture for custom functionality (future) |
| **Custom Panels** | Add new panel types (future) |
| **Custom Actions** | Add command palette actions (future) |

### 8. Infrastructure

| Feature | Description |
|---------|-------------|
| **Self-Hosted** | Runs on personal infrastructure (Banner/Hulk) |
| **LiteLLM Backend** | Existing AI proxy (jarvis-chat, jarvis-qwen72b) |
| **PostgreSQL** | Metadata, user data, graph relationships |
| **MinIO/S3** | File blob storage |
| **pgvector** | Vector embeddings for RAG |
| **Standards Compliant** | Follows NLF infrastructure standards |

---

## UI Concept

```
┌──┬─────────────────────────────────────────────────────────────────────┐
│  │  The Keep                              [Health ▼] [⌘K] [Settings]  │
│  ├─────────────────┬───────────────────────────────────────────────────┤
│  │                 │ [notes.md ×] [labs.pdf ×] [AI Chat ×] [+]        │
│🏥│  FILE BROWSER   ├───────────────────────────┬───────────────────────┤
│  │                 │                           │                       │
│🏠│  ▼ Labs         │   MARKDOWN EDITOR         │  AI CHAT TAB          │
│  │    2024-03.md   │   ─────────────────────   │  (Claude Code style)  │
│⚙️│    2024-01.md   │   ## Lab Results          │                       │
│  │  ▼ Doctors      │   | Test | Value |       │  Context: notes.md    │
│🔍│    dr-smith.md  │   |------|-------|       │  ───────────────────── │
│  │                 │   | A1C  | 5.4   |       │  "Summarize my latest │
│📋│  [+ New File]   │                           │   lab results"        │
│  │  [↑ Upload]     │   [Bold][Italic][Table]   │                       │
│  │                 │   ← Obsidian-style toolbar│  [Send] [Model ▼]     │
├──┴─────────────────┴───────────────────────────┴───────────────────────┤
│  [Workflow Tasks ×] [Dify Workflows ×]  ← Embedded views, dockable     │
│  ☑ Review lab results    ☐ Schedule follow-up    ☐ Update health log   │
└─────────────────────────────────────────────────────────────────────────┘

ACTIVITY BAR (far left):
🏥 = Health Project (active)
🏠 = HOA Project
⚙️ = Infrastructure Project
🔍 = Global Search
📋 = Workflows/Tasks
```

**dockview Features:**
- Drag any tab to create splits (horizontal/vertical)
- AI Chat is a tab, not fixed sidebar - dock anywhere
- Embedded browser tabs (Dify, dashboards, external tools)
- Pop out panels to separate windows
- Save/restore layout per project

**Project Switching:**
- Activity bar (far left icons) for quick switch
- Dropdown in header for list view
- Each project = isolated context (files, chat history, layout)

---

## Tech Stack (Recommended)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, API routes, modern React |
| Panel System | **dockview** | VS Code-style docking |
| UI Components | shadcn/ui + Tailwind | Accessible, customizable |
| Markdown | Monaco Editor or MDX | Rich editing |
| PDF | PDF.js / react-pdf | Standard solution |
| State | Zustand | Simple, performant |
| File Storage | MinIO (S3) | Existing infrastructure |
| Database | PostgreSQL + pgvector | Metadata + RAG vectors |
| AI | LiteLLM proxy | Existing, multi-model |

---

## Out of Scope (v1) - Future Roadmap

### v2: OCR & Ingestion
| Feature | Description |
|---------|-------------|
| **OCR Processing** | Extract text from PDFs, images (JPEG, PNG, GIF) |
| **Medical Doc Extraction** | Parse MRI reports, blood work, lab results - extract key values |
| **Auto-indexing** | Automatically process uploads for RAG knowledge base |
| **Scanned Doc Support** | Handle scanned documents, photos of whiteboards, screenshots |
| **Structured Data** | Extract key-value pairs from medical/financial docs for querying |

### v3: AI Artifacts & Source Trust
| Feature | Description |
|---------|-------------|
| **Artifact Generation** | AI creates interactive outputs (like Claude/ChatGPT artifacts) |
| **Rich Outputs** | Charts, tables, code blocks, diagrams |
| **Artifact Storage** | Save generated artifacts as project assets |
| **Source Trust Scoring** | Per-source, per-topic trust ratings (1-10 scale) |
| **Trust-Weighted RAG** | Higher-trust sources ranked higher in results |
| **KnowledgeStack Integration** | Connect to external trust/authority management (TBD) |

### Future
- Real-time collaboration / multi-user
- Mobile app
- Public sharing
- File versioning/history
- Audio/video transcription
- Extension marketplace

---

## v1 MVP Scope (Priority)

**Focus:** Cursor-like IDE + Claude Code-style AI + basic RAG + memory

| v1 MVP Feature | Description |
|----------------|-------------|
| **Cursor-like IDE** | dockview panels, file browser, tabs, layout persistence |
| **AI Chat as Tab** | Claude Code-style conversation, dockable anywhere |
| **File Management** | Upload, browse, view (PDF, MD, images) |
| **Basic RAG** | Query across project files |
| **Memory System** | Atomic, editable memories (profiles, preferences) |
| **LLM Integration** | LiteLLM with model selection |

**NOT v1:** Cross-project linking, tiered RAG, freshness decay, intelligent depth selection, source trust, OCR, artifacts

## Success Criteria

| Metric | Target |
|--------|--------|
| Upload files | Drag-drop works, files persist |
| View files | PDF, MD, images, code render correctly |
| Panel system | Tabs drag, panes split, layout saves |
| AI chat | Can ask questions about open files |
| RAG search | Can query across all files in workspace |
| Memory | Can view/edit atomic memories |

---

## Open Questions

1. **RAG Backend:** Dify API vs custom pgvector implementation?
2. **File Processing:** How to extract text from PDFs for RAG?
3. **Auth:** Authentik integration or simpler?
4. **Deployment:** Banner (dev) then Hulk (prod)?

---

## Next Steps

1. PRD - Detailed requirements
2. Architecture - Component design, data flow
3. UX Design - Wireframes, interaction patterns
4. Phase 1 Stories - File browser + dockview MVP
