---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-implementation', 'step-10-nfr', 'step-11-polish']
inputDocuments: ['docs/planning-artifacts/product-brief.md']
workflowType: 'prd'
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general_health_pkm
  complexity: high
  projectContext: greenfield
  keyInsights:
    - Cross-project linking (Health ↔ Food ↔ Transcripts)
    - Tiered RAG (summaries default, raw on-demand)
    - Intelligent RAG selection (AI chooses depth)
    - Freshness decay (domain-specific relevancy degradation)
---

# Product Requirements Document - The Keep

**Author:** Matt
**Date:** 2026-03-22
**Version:** 1.1
**Status:** Complete

---

## 1. Executive Summary

### 1.1 Product Overview

The Keep is a **web-based personal knowledge management IDE** that combines the dockable workspace paradigm of VS Code/Cursor with the knowledge management capabilities of Obsidian, enhanced by AI-powered assistance and RAG search.

**Vision Statement:** A unified, self-hosted workspace where users browse existing files, view them side-by-side, chat with AI about their contents, and search across everything with semantic understanding.

### 1.2 Problem Statement

**Current Pain Points:**
- Files scattered across cloud drives, local folders, and NAS systems
- No unified interface for browsing, viewing, and discussing file contents
- Existing tools are siloed:
  - **Wikis** (Notion, Outline): Create new docs but can't manage existing files
  - **Desktop apps** (Obsidian): Excellent file management but local-only, limited AI integration
  - **Chat UIs** (LobeChat, ChatGPT): No file browsing or management
  - **RAG tools** (Dify): Backend only, no proper file UI

### 1.3 Target User

**Primary User:** Matt (solo user, personal knowledge management)

**Key Use Cases:**
| Domain | Examples |
|--------|----------|
| Health Records | Lab results, doctor notes, prescriptions, supplement plans |
| Family Health | Mom's medications, dad's appointments (separate projects) |
| HOA Documents | Meeting minutes, CC&Rs, financials |
| Infrastructure | Configs, runbooks, diagrams |
| AI/Dev Best Practices | Claude Code workflows, OpenClaw patterns |
| Personal Inventories | Kitchen appliances, spices, pantry items |
| Gardening | Plants, varieties, locations; "cucumbers" → knows your specific varieties |

**Daily Value Scenarios:**
| Scenario | Example |
|----------|---------|
| AI Conversation | "Summarize my latest labs" with cited sources |
| Recipe Request | "What can I make?" using inventory + preferences + health |
| Health Report | "How am I doing?" synthesized from all health data |
| Expert Perspective | "What would Huberman think about my sleep stack?" |
| Recurring Reports | "Show me my pill box layout" - same format every time |
| Atomic Edits | "Remove fish oil from my supplements" - one line change |
| Source Tracing | "Where did you learn my weight is 185?" |

### 1.4 What Makes This Special

| Differentiator | Description |
|----------------|-------------|
| **Cursor-like IDE** | dockview panels, VS Code-style tabs, command palette |
| **Claude Code-style AI** | Conversation as dockable tab, not fixed sidebar |
| **AI Edits Files, Not Regenerates** | AI modifies your existing files in place — ChatGPT creates new artifacts each time, losing your structure. The Keep edits line-by-line like Claude Code. |
| **Consistent Outputs** | Same question = same format. "Show pill box" looks identical every time because AI reads YOUR file, not its memory. |
| **Atomic Editable Memories** | Single-fact memories you can edit, unlike ChatGPT blobs |
| **Memory Provenance** | Every fact tracks its source: which file, conversation, or user edit |
| **Source Citations** | AI shows exactly which files informed its answer — click to jump to source |
| **Project Soul & Guardrails** | Each project has defined purpose, trusted sources, and explicit boundaries |
| **Trusted Source Rankings** | Rate experts by domain (Huberman: sleep 9/10) — AI weights advice accordingly |
| **Derived Views** | Reports generated FROM source files, not AI imagination. Refresh = update from truth. |
| **Soft Delete Safety** | 30-day trash, nothing permanently lost without explicit action |
| **Inbox + Workflow** | Ingest raw content → process → extract into structured knowledge (MVP+1) |
| **Web + Files Search** | Query combines your knowledge base with live web search |
| **Self-hosted** | Runs on your infrastructure (Banner/Hulk) |

**The Core Problem We Solve:**

ChatGPT's artifact model is broken for persistent knowledge:
- Creates NEW file every request (no continuity)
- Can't edit existing files (only regenerate)
- Different format each time (no template consistency)
- Things go missing on regeneration (no source of truth)
- You verify everything (defeats the purpose of assistance)

**The Keep's Model:**
- AI edits YOUR files in place (like Claude Code)
- Respects existing structure (add/remove lines, not rebuild)
- Same file = same format (template preserved)
- Source of truth is YOUR file (not AI memory)
- You trust and act (no verification needed)

### 1.5 Success Criteria

**User Success (What Matters)**
| Criteria | Description |
|----------|-------------|
| **Upload files** | Drag-drop, files persist |
| **Control them** | See what's in RAG, include/exclude files |
| **Edit them** | Markdown editor, change content directly |
| **AI edits them** | AI modifies existing files, doesn't regenerate from scratch |
| **Read them** | View PDFs, images, text files in tabs |
| **Extract info** | Convert PDF text to usable content, provide summaries |
| **Accurate conversation** | AI answers based on my actual data, cites sources |
| **Trace any fact** | "Where did you learn this?" shows source file/conversation |
| **Consistent reports** | Same question = same format every time |
| **Recover mistakes** | Undo edits, restore deleted files, correct AI errors |
| **Reasonable speed** | Doesn't feel slow or frustrating |
| **Living knowledge** | Inventories, profiles, memories are editable |
| **Expert perspectives** | Ask "What would Huberman think?" and get sourced answer |

**Technical Success (Just Works)**
| Criteria | Description |
|----------|-------------|
| Painless UX | No frustrating waits or confusing errors |
| Data safety | Files and memories don't get lost (30-day trash) |
| Responsive AI | Streaming responses feel conversational |
| Edit not regenerate | AI uses edit operations, not create-new-file |

### 1.6 Product Scope

**v1 MVP (Ship This)**

| Category | Features |
|----------|----------|
| **Core IDE** | Cursor-like dockview panels, VS Code-style tabs, command palette |
| **AI Chat** | Dockable chat tab, citations, context awareness, model selection |
| **AI File Editing** | Edit files in place (not regenerate), diff preview, undo |
| **File Management** | Upload, browse, view, edit markdown, PDF viewing |
| **Import** | Bulk import with audit, markdown cleanup, PDF extraction, screenshot viewing (no OCR) |
| **Search** | Unified search (files + memories), semantic search via pgvector |
| **RAG** | Basic RAG across project files, source citations |
| **Memories** | Atomic memories with provenance, memory audit UI, classification |
| **Project Context** | .keep/ files (Soul, Guardrails, Procedures), Soul Discovery onboarding |
| **Trusted Sources** | Expert registry with domain ratings |
| **Version Control** | File history, diff view, revert capability |
| **AI Reliability** | Fallback chain (if primary AI unavailable) |
| **Data Safety** | Soft delete with 30-day trash, export project |
| **Feedback** | Response rating (1-5 stars), feedback logging |
| **Keyboard** | Command palette, basic shortcuts |
| **Conversation Modes** | Normal, incognito (no memory writes) |

**MVP+1 (Near-term)**

| Category | Features |
|----------|----------|
| **Inbox** | Quick capture workflow, second brain dump |
| **Knowledge Dump** | Talk to AI → generates project files |
| **Automation** | Dify procedure sync |
| **Plugins** | Basic MCP plugins (calendar, reminders) |
| **Memory Insights** | "What have you learned about me?" reports |
| **Web Search** | Combine files + web results |
| **Derived Views** | Recurring reports (pill box, grocery list) |
| **Import+** | DOCX conversion, duplicate detection |
| **Feedback+** | Low-rating prompts ("What was wrong?") |

**MVP+2**

| Category | Features |
|----------|----------|
| **Tasks** | Checkboxes, nested tasks, due dates, task queries |
| **Kanban** | Board view of tasks by status |
| **Tagging** | #due, #action, #reminder, #context tags |
| **Tag Queries** | Filter by tag combinations, Today view |
| **Notifications** | Due date alerts, daily cron scan, notification center |
| **Grist** | Grist database tab, RAG integration |

**v2+ (Later)**

| Category | Features |
|----------|----------|
| **Cross-Project** | Linking, Super Projects |
| **Tiered RAG** | Raw vs summary, intelligent depth |
| **Freshness** | Domain-specific decay |
| **Mobile Optimized** | PWA, native-like experience, advanced mobile UX |
| **OCR** | Scanned PDFs, image text extraction |
| **AI Artifacts** | Charts, diagrams, interactive outputs |
| **Grist+** | Graph visualization, bidirectional sync |
| **Self-Learning** | Pattern analysis, preference inference |
| **Full MCP** | Plugin ecosystem |
| **KnowledgeStack** | Integration (TBD) |

**Architecture Notes:**
- v1 structure must support future workflow/inbox/tasks even if not built yet
- AI MUST edit existing files, not regenerate (core differentiator from ChatGPT)
- Web-based alternative to Obsidian (accessible from any device)
- **Data architecture must prepare for multi-user (MVP+4):** user_id on all relevant tables, project membership model, per-user memories vs shared project files

**Core Technical Requirement:** AI edits YOUR files in place like Claude Code:
- Add blood work entry → append to existing file
- Add habit → insert line in habits file
- Remove supplement → delete one line
- Update dose → change one value

This is what makes The Keep reliable for ongoing knowledge management.

---

## 2. Functional Requirements

### 2.1 Workspace Shell (FR-WS)

The workspace shell provides the foundational IDE-like interface using dockview for VS Code-style panel management.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-WS-01 | **dockview Panel System** - Implement draggable tabs, split panes, dock anywhere | P0 | Core UX paradigm |
| FR-WS-02 | **Activity Bar** - Far-left icon bar for switching contexts (projects, search, settings) | P0 | Primary navigation |
| FR-WS-03 | **File Browser Panel** - Tree view with folders, file icons, context menus | P0 | Core functionality |
| FR-WS-04 | **Command Palette** - Cmd+K / Ctrl+K for quick actions | P1 | Power user feature |
| FR-WS-05 | **Tab System** - Multiple files open, drag tabs between panes | P0 | Essential for workflow |
| FR-WS-06 | **Layout Persistence** - Save/restore panel arrangements per project | P0 | UX continuity |
| FR-WS-07 | **Keyboard Shortcuts** - Standard IDE shortcuts for common actions | P1 | Productivity |
| FR-WS-08 | **Dark/Light Theme** - User-selectable theme with persistence | P2 | Personalization |

### 2.2 Project Management (FR-PM)

Projects provide isolated contexts for different knowledge domains.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-PM-01 | **Multi-Project Support** - Health, HOA, Infrastructure as separate contexts | P0 | Core organization |
| FR-PM-02 | **Project Switcher** - Activity bar icons AND/OR header dropdown | P0 | Quick switching |
| FR-PM-03 | **Isolated Context** - Each project has own files, chat history, settings, layout | P0 | Clean separation |
| FR-PM-04 | **Project Metadata** - Projects are entities with name, icon, description, created date | P1 | Not just folders |
| FR-PM-05 | **Project CRUD** - Create, rename, archive projects | P0 | Basic management |
| FR-PM-06 | **Project Settings** - Per-project AI model, RAG settings, display preferences | P1 | Customization |

### 2.3 File Management (FR-FM)

Core file operations for managing knowledge base content.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-FM-01 | **File Upload** - Drag-drop upload to file browser | P0 | Primary ingestion |
| FR-FM-02 | **Folder Management** - Create, rename, delete, move folders | P0 | Organization |
| FR-FM-03 | **File Operations** - Rename, delete, move, duplicate files | P0 | Basic ops |
| FR-FM-04 | **Multi-Select** - Select multiple files for bulk operations | P1 | Efficiency |
| FR-FM-05 | **Search Files** - Filter file tree by name | P1 | Quick access |
| FR-FM-06 | **File Icons** - Type-appropriate icons (PDF, MD, image, etc.) | P1 | Visual clarity |
| FR-FM-07 | **Context Menu** - Right-click menu for file operations | P0 | Standard UX |

### 2.4 Document Viewing (FR-DV)

Render different file types appropriately in tabs.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DV-01 | **Markdown Rendering** - Display formatted markdown with syntax highlighting | P0 | Primary format |
| FR-DV-02 | **PDF Viewing** - Render PDFs with zoom, page navigation | P0 | Common file type |
| FR-DV-03 | **Image Viewing** - Display images (PNG, JPG, GIF, SVG) with zoom | P0 | Visual content |
| FR-DV-04 | **Code Viewing** - Syntax-highlighted code files | P1 | Technical content |
| FR-DV-05 | **Plain Text** - Display text files | P0 | Fallback |
| FR-DV-06 | **Side-by-Side** - View multiple files in split panes | P0 | Comparison workflow |

### 2.5 Markdown Editing (FR-ME)

Obsidian-style markdown editing with dual-editor architecture: **Source mode** (CodeMirror/Monaco) for raw markdown and **Preview mode** (TipTap) for WYSIWYG editing.

#### 2.5.1 Dual-Editor Architecture

| Mode | Editor | Use Case |
|------|--------|----------|
| **Source** | Monaco | Raw markdown editing, syntax highlighting, power users |
| **Preview** | TipTap | WYSIWYG editing, formatting toolbar, visual editing |
| **Mobile Source** | Plain textarea (MVP+1) | Basic editing, enhanced in later MVP+ |

Both editors sync to the same markdown content - toggling preserves all changes.

#### 2.5.2 Core Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-ME-01 | **Rich Toolbar** - Bold, italic, headers, lists, links, tables | P0 | User-friendly editing |
| FR-ME-02 | **Source Mode** - Monaco for raw markdown editing (plain textarea on mobile) | P0 | Power user need |
| FR-ME-03 | **Preview Mode** - TipTap WYSIWYG with full editing capability | P0 | Visual editing |
| FR-ME-04 | **Split Edit/Preview** - Side-by-side raw and rendered | P1 | Live preview |
| FR-ME-05 | **Auto-Save** - Save changes automatically | P0 | Data safety |
| FR-ME-06 | **Wikilinks** - Support `[[filename]]` style links | P1 | Knowledge linking |
| FR-ME-07 | **Tables** - Easy table creation and editing | P1 | Structured data |

#### 2.5.3 TipTap WYSIWYG Features (Preview Mode)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-ME-10 | **Slash Commands** - `/code`, `/task`, `/heading`, `/quote`, `/table` | P0 | Notion-style quick insert |
| FR-ME-11 | **Bubble Menu** - Select text → inline formatting options appear | P0 | Contextual formatting |
| FR-ME-12 | **Task Lists** - Native checkbox support with click-to-toggle | P0 | `@tiptap/extension-task-list` |
| FR-ME-13 | **Code Blocks** - Syntax-highlighted with language selector | P0 | `@tiptap/extension-code-block-lowlight` |
| FR-ME-14 | **Markdown Round-Trip** - Lossless conversion to/from markdown | P0 | Content integrity |
| FR-ME-15 | **Drag & Drop Blocks** - Reorder paragraphs, lists, headers | P1 | Content organization |
| FR-ME-16 | **Placeholder Text** - Show hints in empty blocks | P1 | Onboarding |
| FR-ME-17 | **Keyboard Shortcuts** - Standard formatting (Cmd+B, Cmd+I, etc.) | P0 | Efficiency |

#### 2.5.4 Editor State Synchronization

```
┌─────────────────────────────────────────┐
│ Shared State (Markdown string/AST)      │
│ - Source of truth for file content      │
│ - Triggers auto-save on change          │
└──────────┬─────────────────┬────────────┘
           │                 │
    ┌──────▼──────┐   ┌──────▼──────┐
    │ CodeMirror  │   │   TipTap    │
    │  (Source)   │   │  (Preview)  │
    │ Raw markdown│   │   WYSIWYG   │
    └─────────────┘   └─────────────┘
```

**Sync Behavior:**
- User edits in either mode → shared state updates → other mode re-renders
- No data loss when switching modes
- Cursor position preserved when possible

### 2.6 AI Chat (FR-AC)

Claude Code-style AI assistant as dockable tab.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-AC-01 | **Chat as Tab** - AI conversation opens as dockview tab | P0 | Core paradigm |
| FR-AC-02 | **Dockable** - Drag chat to any position, split, pop-out | P0 | Flexible layout |
| FR-AC-03 | **Context Awareness** - AI knows which files are open | P0 | Relevance |
| FR-AC-04 | **Multi-File Context** - Link multiple files to conversation | P0 | Cross-file queries |
| FR-AC-05 | **Model Selection** - Choose from available LiteLLM models | P0 | Flexibility |
| FR-AC-06 | **Chat History** - Persist conversations per project | P0 | Continuity |
| FR-AC-07 | **New Chat** - Start fresh conversation | P0 | Clean slate |
| FR-AC-08 | **RAG Integration** - Query across project knowledge base | P1 | Semantic search |
| FR-AC-09 | **Code Blocks** - Syntax-highlighted code in responses | P1 | Technical answers |
| FR-AC-10 | **Copy Response** - Copy AI responses to clipboard | P1 | Utility |

### 2.7 Personal Knowledge System (FR-PK)

Structured personal data that AI can use for contextual assistance. **Key differentiator from ChatGPT:** Memories are atomic, granular, and fully editable - not opaque paragraphs.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-PK-01 | **Inventory Management** - Create/edit structured inventories (kitchen, pantry, equipment) | P1 | Personal data |
| FR-PK-02 | **Personal Profiles** - Health criteria, dietary restrictions, preferences | P1 | User context |
| FR-PK-03 | **Preference Tracking** - Likes/dislikes, taste preferences | P1 | Learning over time |
| FR-PK-04 | **Memory Extraction** - AI extracts insights from conversations worth saving | P2 | Auto-learning |
| FR-PK-05 | **AI Context Integration** - AI accesses profiles + inventories for tasks | P1 | Smart assistance |
| FR-PK-06 | **Structured Data Editor** - UI for creating/editing inventory items | P1 | Data entry |
| FR-PK-07 | **Atomic Memories** - Each memory = ONE fact/value, not paragraphs | P1 | Granularity |
| FR-PK-08 | **Granular Editing** - Edit single memory values without rewriting everything | P1 | Key differentiator |
| FR-PK-09 | **Memory Management UI** - Grid/table view with inline editing, status changes, bulk actions | P1 | User control |
| FR-PK-10 | **Memory Status Control** - Change status: Active, Archived, Trash | P1 | Lifecycle |
| FR-PK-11 | **Memory Relevancy Display** - Show tier (Hot/Warm/Cold) with ability to manually promote/demote | P2 | Transparency |
| FR-PK-12 | **Memory Filtering** - Filter by category, subject, status, tier, source type | P1 | Navigation |
| FR-PK-13 | **Memory Version History** - Track all changes to memory values, who changed, when | P1 | Auditability |
| FR-PK-14 | **Memory Revert** - Restore memory to any previous version | P1 | Recovery |
| FR-PK-15 | **Inline Value Edit** - Click any memory value in grid, edit in place, save | P0 | Core editing |

**Design Principle:** Unlike ChatGPT's opaque memory system, The Keep provides:
- Atomic memories (e.g., "weight: 180" not "User weighs 180 and prefers Mediterranean diet and...")
- Direct editing of individual values (change weight from 180 to 175)
- Full visibility into what AI knows about you
- Ability to consolidate duplicates and delete unwanted memories

**Storage Decision:** Memories stored in PostgreSQL database for atomic editing and efficient retrieval. Soft delete via `deleted_at` timestamp (NULL = active, 30-day recovery window).

**Context Injection (Critical):** On EVERY AI request, backend must:
1. **Always inject:** HOT tier memories (`status = 'active' AND tier = 'hot'`)
2. **Vector retrieve:** WARM tier memories relevant to query
3. **Never inject:** COLD tier, Archived, or Trash memories
4. Include .keep/ files (SOUL.md, GUARDRAILS.md)
5. Serialize to text format for AI prompt

**Memory States:**
| State | UI Label | AI Context | Recovery |
|-------|----------|------------|----------|
| `status: active, tier: hot` | Active (High) | Always injected | N/A |
| `status: active, tier: warm` | Active (Medium) | Vector retrieved | N/A |
| `status: active, tier: cold` | Active (Low) | Never injected | Auto-promotes if used |
| `status: archived` | Archived | Never injected | User restores |
| `status: trash` | Trash | Never injected | 30-day recovery, then purged |

### 2.8 Knowledge Graph / RAG (FR-KG)

Backend knowledge graph and retrieval-augmented generation.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-KG-01 | **Auto-Indexing** - Files automatically indexed for RAG | P0 | Foundation |
| FR-KG-02 | **Explicit Inclusion** - Manually select files to include/exclude from RAG | P1 | Control |
| FR-KG-03 | **Semantic Search** - Search by meaning, not just keywords | P0 | Core value |
| FR-KG-04 | **Document Relationships** - Track relationships between documents | P2 | Graph features |
| FR-KG-05 | **Bi-directional Links** - `[[wikilinks]]` create two-way connections | P2 | Knowledge web |

### 2.9 Embedded Views (FR-EV)

Embed external applications within tabs.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-EV-01 | **Embedded Browser** - View external URLs in tabs (Dify, dashboards) | P2 | Integration |
| FR-EV-02 | **Workflow View** - Task list / workflow status panel | P2 | Productivity |
| FR-EV-03 | **Bookmarked Views** - Save frequently used embedded URLs | P2 | Quick access |

### 2.10 AI File Editing (FR-FE)

**Critical capability:** AI edits existing files in place, not regenerate from scratch. This is what ChatGPT CANNOT do.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-FE-01 | **Edit Existing Files** - AI modifies files in place (add line, remove line, change value) | P0 | Core differentiator |
| FR-FE-02 | **Diff Preview** - Show exactly what will change before applying edit | P0 | Trust & control |
| FR-FE-03 | **Append Operations** - Add new entry to list (blood work, habit, practice) without regenerating | P0 | Incremental updates |
| FR-FE-04 | **Remove Operations** - Delete specific line/item without affecting rest of file | P0 | Surgical edits |
| FR-FE-05 | **Update Operations** - Change single value (dose, date, status) in place | P0 | Atomic changes |
| FR-FE-06 | **Structure Preservation** - Respect existing file format/template when editing | P0 | Consistency |
| FR-FE-07 | **Edit History** - Track what changed, when, and why | P1 | Auditability |
| FR-FE-08 | **Undo Edit** - Revert last AI edit to file | P0 | Safety |
| FR-FE-09 | **Suggest vs Apply** - AI can suggest edit for user approval before applying | P1 | Control modes |
| FR-FE-10 | **Bulk Edit Warning** - Warn when edit would affect large portion of file | P1 | Prevent accidents |

**Design Principle:** The AI operates like Claude Code — it reads your file, makes targeted edits, and preserves everything else. NOT like ChatGPT which creates a new artifact every time.

### 2.11 Project Context System (FR-PC)

Each project has a `.keep/` directory with AI context files. See [project-context-system.md](project-context-system.md) for full specification.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-PC-01 | **SOUL.md** - Project purpose, how AI adds value, personality | P0 | Identity |
| FR-PC-02 | **GUARDRAILS.md** - Explicit never-dos and always-dos | P0 | Safety |
| FR-PC-03 | **PROCEDURES.md** - Index of how-to workflows | P1 | Automation ready |
| FR-PC-04 | **CAPABILITIES.md** - Registry of what AI can access | P1 | Transparency |
| FR-PC-05 | **SOURCES.md** - Auto-maintained data source inventory | P1 | Awareness |
| FR-PC-06 | **USER.md** - User profile specific to this project | P1 | Context |
| FR-PC-07 | **Project Instructions UI** - Edit soul/guardrails via settings panel | P0 | User-friendly |
| FR-PC-08 | **Context Injection** - .keep/ files inform every AI interaction | P0 | Behavioral |

### 2.12 Soul Discovery / Onboarding (FR-SD)

Guided flow to set up project identity during creation.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-SD-01 | **Purpose Questions** - "What's this project for?" | P0 | Soul building |
| FR-SD-02 | **Value Questions** - "How can I help you here?" | P0 | Soul building |
| FR-SD-03 | **Boundary Questions** - "Any things I should never do?" | P0 | Guardrails |
| FR-SD-04 | **File Generation** - Generate SOUL.md and GUARDRAILS.md from answers | P0 | Automation |
| FR-SD-05 | **Template Options** - Pre-built templates for Health, Finance, Learning | P1 | Quick start |
| FR-SD-06 | **Skip Option** - Allow skipping with minimal defaults | P1 | Power users |
| FR-SD-07 | **Import Soul** - Copy soul from another project | P2 | Efficiency |

### 2.13 Memory Provenance & Classification (FR-MP)

Every memory tracks where it came from and what it's about.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-MP-01 | **Source Type** - Track: user_edit, file_extraction, conversation, inferred | P0 | Traceability |
| FR-MP-02 | **Source Reference** - Link to specific file:line or conversation:message | P0 | Clickable |
| FR-MP-03 | **Learned Date** - When was this fact learned | P0 | Timeline |
| FR-MP-04 | **Confidence Level** - High (explicit), Medium (extracted), Low (inferred) | P1 | Trust indicator |
| FR-MP-05 | **"Where did you learn this?"** - Query to show memory source | P0 | User control |
| FR-MP-06 | **Jump to Source** - Click provenance → opens source file/conversation | P1 | Navigation |
| FR-MP-07 | **Supersession Tracking** - Track when memory replaces older value | P1 | History |
| FR-MP-08 | **Category Tags** - Classify memories (health, food, equipment, etc.) | P0 | Organization |
| FR-MP-09 | **Subject Tags** - Tag who/what memory is about (me, mom, house, etc.) | P0 | Separation |
| FR-MP-10 | **Project Scoping** - Memories belong to specific project, don't bleed | P0 | Isolation |
| FR-MP-11 | **Auto-Classification** - AI suggests category/tags when learning | P1 | Efficiency |
| FR-MP-12 | **Browse by Category** - Filter memories by category or subject | P1 | Navigation |

### 2.14 Conversation Modes (FR-CM)

Control how conversations interact with memory and data.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-CM-01 | **Normal Mode** - Read files, write memories (default) | P0 | Standard |
| FR-CM-02 | **Incognito Mode** - Read files but don't write memories | P0 | Privacy |
| FR-CM-03 | **Read-Only Mode** - Read files, no edits or memories | P1 | Safe exploration |
| FR-CM-04 | **Mode Indicator** - Clear UI showing current mode | P0 | Awareness |
| FR-CM-05 | **Mode Toggle** - Switch modes mid-conversation | P1 | Flexibility |
| FR-CM-06 | **Project Selection** - Specify which project to write to | P0 | Multi-context |
| FR-CM-07 | **Cross-Project Query** - Read from multiple projects, write to one | P1-MVP+2 | Core use case |
| FR-CM-08 | **Project Linking** - Define relationships between projects (Health ↔ Food) | P2-MVP+3 | Structured |
| FR-CM-09 | **Cross-Project Citations** - Show which project each fact came from | P1-MVP+2 | Transparency |
| FR-CM-10 | **Cross-Project Inbox** - Projects can send update REQUESTS to linked projects | P2-MVP+3 | Permission model |
| FR-CM-11 | **Inbox Review UI** - Review/approve/deny pending requests from other projects | P2-MVP+3 | User control |
| FR-CM-12 | **Request Provenance** - Approved changes track "from {project} request" | P2-MVP+3 | Auditability |
| FR-CM-13 | **Central Daily Journal** - Generate daily summary across ALL projects | P2-MVP+3 | Temporal recall |
| FR-CM-14 | **Journal Storage** - Central location ~/.keep/journal/YYYY-MM-DD.md | P2-MVP+3 | One source |
| FR-CM-15 | **Project Activity Tracking** - Log which projects worked on each day | P2-MVP+3 | Overview |
| FR-CM-16 | **Key Items Extraction** - High-level summary of important activities | P2-MVP+3 | Signal vs noise |
| FR-CM-17 | **Temporal Queries** - "When did I...?" searches central journal | P2-MVP+3 | Recall |
| FR-CM-18 | **Activity Timeline UI** - Calendar view of activity across all projects | P2-MVP+3 | Navigation |
| FR-CM-19 | **Task Extraction** - AI detects task-like statements, offers to add to list | P2-MVP+3 | Automation |
| FR-CM-20 | **Task Completion Tracking** - Track done vs pending in journal | P2-MVP+3 | Progress |
| FR-CM-21 | **AI Personas** - Toggleable personality modes (Default, Coach, Teacher, Analyst, Creative) | P2-MVP+3 | Engagement |
| FR-CM-22 | **Persona Selector UI** - Dropdown in chat header to switch personas | P2-MVP+3 | UX |
| FR-CM-23 | **Per-Project Persona Default** - Set default persona in SOUL.md | P2-MVP+3 | Customization |
| FR-CM-24 | **Coach Persona** - Encouraging, celebrates wins, gentle accountability | P2-MVP+3 | Motivation |
| FR-CM-25 | **Progress Celebration** - AI acknowledges task completion, streaks, milestones | P2-MVP+3 | Motivation |
| FR-CM-26 | **Gentle Nudges** - Remind about stale tasks without nagging | P2-MVP+3 | Accountability |
| FR-CM-27 | **Pattern Recognition** - Notice interests, suggest projects/learning | P3-MVP+5 | Growth |
| FR-CM-28 | **Weekly Summary** - Progress comparison, trends, encouragement | P2-MVP+3 | Reflection |
| FR-CM-32 | **Global AI Preferences** - User sets communication style, tone, feedback, expertise | P1-MVP | Customization |
| FR-CM-33 | **Custom Instructions** - Free-text instructions applied to all conversations | P1-MVP | ChatGPT-style |
| FR-CM-34 | **Content Style Profiles** - Define styles for different content types | P2-MVP+4 | Context-aware |
| FR-CM-35 | **Style Profile Auto-Detection** - AI recognizes content type, applies matching style | P2-MVP+4 | Smart |
| FR-CM-36 | **AI Style Guide Generation** - Analyze imported docs, build learned style guide | P2-MVP+4 | Learning |
| FR-CM-37 | **Style Guide Editor** - View/edit .keep/STYLE_GUIDE.md | P2-MVP+4 | Control |
| FR-CM-38 | **Style-Template Linking** - Connect style profiles to document templates | P2-MVP+4 | Integration |
| FR-CM-39 | **Journal Ingest API** - REST/MCP endpoint for external apps to log activity | P3-v2 | Integration |
| FR-CM-40 | **Journal Webhooks** - Receive activity from n8n, Claude Code, OpenClaw | P3-v2 | Hooks |
| FR-CM-41 | **Source Tagging** - Tag journal entries by source (the-keep, claude-code, n8n) | P3-v2 | Attribution |

**Use Cases:**
- "Help with mom's health" → Write to mom-health project, not my-health
- "Just a quick question, don't remember this" → Incognito mode
- "I'm exploring, don't change anything" → Read-only mode

### 2.15 Data Safety (FR-DS)

Protect against accidental data loss.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DS-01 | **Soft Delete** - Deleted files go to .keep/trash/, not permanent delete | P0 | Safety |
| FR-DS-02 | **30-Day Retention** - Trash items recoverable for 30 days | P0 | Recovery window |
| FR-DS-03 | **Trash Browser** - UI to view and restore deleted items | P0 | Usability |
| FR-DS-04 | **Permanent Delete** - Explicit action to empty trash | P1 | User control |
| FR-DS-05 | **Edit Undo** - Revert recent file edits | P0 | Mistake recovery |
| FR-DS-06 | **Memory Recovery** - Restore deleted memories from trash | P1 | Consistency |

### 2.16 Trusted Sources (FR-TS)

Registry of experts and their domain credibility.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-TS-01 | **Source Registry** - List of trusted experts/sources | P1 | Foundation |
| FR-TS-02 | **Domain Ratings** - Rate each source per topic (1-10 scale) | P1 | Nuance |
| FR-TS-03 | **Source Management UI** - Add, edit, remove sources and ratings | P1 | User control |
| FR-TS-04 | **AI Weighting** - AI prioritizes higher-rated sources in responses | P2 | Smart retrieval |
| FR-TS-05 | **Expert Persona Queries** - "What would Huberman think?" | P1 | Use case |
| FR-TS-06 | **Source Citation** - Show which trusted source informed answer | P1 | Transparency |

### 2.17 Derived Views (FR-DV2)

Reports generated from source files, not AI memory.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DV2-01 | **Source-Linked Views** - Reports track which files they derive from | P1 | Traceability |
| FR-DV2-02 | **Staleness Detection** - Know if source changed since view generated | P1 | Accuracy |
| FR-DV2-03 | **Consistent Templates** - Same report type = same format every time | P1 | Reliability |
| FR-DV2-04 | **Refresh Command** - "Update this view from current sources" | P1 | On-demand |
| FR-DV2-05 | **Change Summary** - On refresh, show what's different | P2 | Awareness |
| FR-DV2-06 | **Common Views** - Pill box layout, grocery list, health summary | P1 | Pre-built |

### 2.18 Web Search Integration (FR-WS2)

Combine project knowledge with web search.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-WS2-01 | **Web Search Toggle** - Enable/disable web search per query | P1 | Control |
| FR-WS2-02 | **Combined Results** - Synthesize project files + web findings | P1 | Unified answer |
| FR-WS2-03 | **Source Distinction** - Clearly show what's from files vs web | P1 | Transparency |
| FR-WS2-04 | **Save Web Findings** - Option to save relevant web content to project | P2 | Knowledge capture |

### 2.19 Import & Processing (FR-IP)

Comprehensive import pipeline with audit, cleanup, and extraction. Leverages NLF Service Catalog.

#### 2.19.1 Core Import Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-IP-01 | **Bulk Import** - Import folder/zip of files | P0-MVP | Core |
| FR-IP-02 | **Import Audit** - Scan and categorize files before import | P0-MVP | Visibility |
| FR-IP-03 | **File Type Detection** - Identify markdown, PDF, image, etc. | P0-MVP | Classification |
| FR-IP-04 | **Markdown Cleanup** - Normalize inconsistent markdown formatting | P1-MVP | Quality |
| FR-IP-05 | **PDF Text Extraction** - Extract text from text-based PDFs | P0-MVP | Core |
| FR-IP-06 | **Screenshot Processing** - Store raw image + extract content | P1-MVP | Key feature |
| FR-IP-07 | **AI Vision Extraction** - Use local vision model first (LLaVA), fallback to API (Claude/GPT-4V) | P1-MVP | Screenshots |
| FR-IP-08 | **Companion Files** - Create .md alongside extracted content | P1-MVP | Organization |
| FR-IP-09 | **Import Log** - Record what was imported and processed | P1-MVP | Audit trail |
| FR-IP-10 | **Preview Before Import** - Show what will happen | P1-MVP | User control |
| FR-IP-11 | **Selective Import** - Choose which files to import | P1-MVP | Flexibility |
| FR-IP-12 | **Duplicate Detection** - Warn if file already exists | P2-MVP+2 | Safety |
| FR-IP-13 | **OCR for Scanned PDFs** - Extract text from image PDFs | P3-v2 | Complex |
| FR-IP-14 | **Format Conversion** - Convert DOCX, HTML to markdown | P2-MVP+2 | Migration |
| FR-IP-15 | **Obsidian Import** - Handle Obsidian vault structure | P1-MVP | Migration |
| FR-IP-16 | **Import Progress** - Show progress for large imports | P1-MVP | UX |
| FR-IP-17 | **Vision Extraction Feedback** - Gather user corrections on extracted content to evaluate model quality | P2-MVP | Model tuning |

#### 2.19.2 Web Import via Crawl4AI (MVP+4)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-IP-20 | **Web Page Import** - Scrape URL → clean markdown | P2-MVP+4 | Crawl4AI |
| FR-IP-21 | **Batch URL Import** - Import multiple URLs | P2-MVP+4 | Bulk |
| FR-IP-22 | **JavaScript Rendering** - Handle SPAs and dynamic content | P2-MVP+4 | Crawl4AI feature |
| FR-IP-23 | **Clean Markdown Output** - Strip nav, ads, extract content | P2-MVP+4 | RAG-optimized |

**Crawl4AI Integration:**
```
POST http://10.0.0.27:2760/crawl
{
  "urls": ["https://example.com/article"],
  "config": {"only_text": true}
}
→ Returns clean markdown for storage
```

#### 2.19.3 YouTube Transcript Import via n8n (MVP+4)

**CRITICAL:** YouTube transcript imports MUST go through n8n workflow to:
- Rate limit requests (avoid API flagging)
- Queue and space out requests
- Handle retries gracefully
- Log usage for compliance

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-IP-30 | **YouTube Import** - Import transcript from YouTube URL | P2-MVP+4 | Via n8n |
| FR-IP-31 | **Rate Limiting** - Space requests per n8n workflow | P0-MVP+4 | Avoid flagging |
| FR-IP-32 | **Transcript + Metadata** - Store title, duration, chapters | P2-MVP+4 | Context |
| FR-IP-33 | **Timestamp Preservation** - Keep timestamps in transcript | P2-MVP+4 | Navigation |

**n8n Workflow Pattern:**
```
User submits YouTube URL
  → The Keep queues request
  → n8n workflow picks up from queue
  → n8n applies rate limiting (e.g., 1 req/30s)
  → n8n fetches transcript via MCP Gateway
  → n8n returns result to The Keep
  → The Keep creates markdown file
```

#### 2.19.4 Import Flow

1. User selects files/folder/URLs → Audit phase scans and categorizes
2. Audit report shows: 45 markdown, 12 need cleanup, 8 PDFs, 15 screenshots, 3 URLs
3. User configures processing options → Processing phase runs
4. Each source handled appropriately:
   - Files: cleanup, extract, companion files
   - URLs: Crawl4AI → markdown
   - YouTube: n8n queue → transcript
5. Import complete with detailed log

**Screenshot Handling:** Raw image stored + AI vision extracts content → companion .md created with embedded image link and extracted text. Both files preserved, content searchable.

### 2.20 Version Control (FR-VC)

Track file history and enable reverting.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-VC-01 | **File History** - Track all versions of each file | P1-MVP | Core safety |
| FR-VC-02 | **View History** - See list of previous versions with timestamps | P1-MVP | UI |
| FR-VC-03 | **Diff View** - Compare versions side-by-side | P1-MVP | Understanding |
| FR-VC-04 | **Revert File** - Restore any previous version | P1-MVP | Undo mistakes |
| FR-VC-05 | **Auto-Versioning** - Create version on each save | P1-MVP | Automatic |
| FR-VC-06 | **Version Pruning** - Keep last N versions, or by age | P2 | Storage |
| FR-VC-07 | **Git Integration** - Optional git backend for files | P3 | Power users |
| FR-VC-08 | **Blame View** - See who/what changed each line | P3 | AI edit tracking |

### 2.21 AI High Availability (FR-HA)

Ensure AI is available through fallback chain.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-HA-01 | **Primary AI** - LiteLLM as default (jarvis-chat, etc.) | P0-MVP | Existing |
| FR-HA-02 | **Fallback Chain** - If primary down, try secondary models | P1-MVP | Resilience |
| FR-HA-03 | **Model Health Check** - Detect when model unavailable | P1-MVP | Fast failover |
| FR-HA-04 | **Fallback Indicator** - Show user which model is active | P1-MVP | Transparency |
| FR-HA-05 | **Graceful Degradation** - Core features work without AI | P1-MVP | File viewing |
| FR-HA-06 | **Local Model Option** - Optional Ollama for offline | P2 | True offline |

**Fallback Chain:** jarvis-chat → jarvis-qwen72b → Claude API → OpenAI API → local Ollama → offline mode

### 2.22 Unified Search (FR-US)

One search for everything.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-US-01 | **Omni-Search** - Search files, memories, conversations | P0-MVP | Cmd+K |
| FR-US-02 | **Filter by Type** - Filter results: files, memories, chat | P1-MVP | Refinement |
| FR-US-03 | **Recent Items** - Quick access to recently opened | P1-MVP | Speed |
| FR-US-04 | **Saved Searches** - Bookmark frequent queries | P2 | Efficiency |
| FR-US-05 | **Search Preview** - Preview content without opening | P1-MVP | Quick scan |

### 2.23 Advanced Search (FR-AS)

Semantic and relational search capabilities.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-AS-01 | **Vector Storage** - pgvector for embeddings | P0-MVP | Foundation |
| FR-AS-02 | **Semantic Search** - Find by meaning, not keywords | P0-MVP | Core RAG |
| FR-AS-03 | **Hybrid Search** - Combine keyword + semantic | P1-MVP | Best results |
| FR-AS-04 | **Relationship Search** - Find connected documents | P2 | Graph queries |
| FR-AS-05 | **Cross-File Search** - Search across all project files | P0-MVP | Basic |
| FR-AS-06 | **Memory Search** - Search memories semantically | P1-MVP | Find facts |
| FR-AS-07 | **Conversation Search** - Search past conversations | P2 | Context |
| FR-AS-08 | **Search Ranking** - Relevance + recency + trust | P2 | Quality |
| FR-AS-09 | **Search Explain** - Show why result matched | P2 | Transparency |

### 2.24 AI Learning & Feedback (FR-LI)

Learn from user corrections and preferences.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-LI-01 | **Response Rating** - 1-5 star rating on AI responses | P1-MVP | Feedback |
| FR-LI-02 | **Low Rating Prompt** - If <4 stars, ask "What was wrong?" | P1-MVP+1 | Clarification |
| FR-LI-03 | **Feedback Logging** - Store all ratings + clarifications | P1-MVP | Data |
| FR-LI-04 | **Correction Tracking** - Log when user corrects AI | P1-MVP | Patterns |
| FR-LI-05 | **Preferred Patterns** - Learn output format preferences | P2 | Personalization |
| FR-LI-06 | **Error Pattern Analysis** - Identify recurring issues | P2 | Improvement |
| FR-LI-07 | **Feedback Dashboard** - View feedback trends | P2 | Insights |

### 2.25 Keyboard Navigation (FR-KB)

Moderate keyboard support for power users.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-KB-01 | **Command Palette** - Cmd/Ctrl+K for quick actions | P0-MVP | Core |
| FR-KB-02 | **File Navigation** - Cmd/Ctrl+P to find files | P1-MVP | VS Code style |
| FR-KB-03 | **Tab Switching** - Cmd/Ctrl+Tab between tabs | P1-MVP | Standard |
| FR-KB-04 | **Save** - Cmd/Ctrl+S (even with auto-save) | P1-MVP | Muscle memory |
| FR-KB-05 | **New Chat** - Cmd/Ctrl+N for new conversation | P2 | Quick access |
| FR-KB-06 | **Search** - Cmd/Ctrl+F file, Cmd/Ctrl+Shift+F global | P1-MVP | Standard |
| FR-KB-07 | **Panel Focus** - Shortcuts to jump between panels | P2 | Power users |
| FR-KB-08 | **Customizable** - User can rebind shortcuts | P3 | Personalization |
| FR-KB-09 | **Shortcut Hints in UI** - Show keyboard shortcut in field placeholders (e.g., search field shows "⌘K") | P1-MVP | Discoverability |
| FR-KB-10 | **Shortcuts Documentation** - Document all default shortcuts in help/settings | P1-MVP | Reference |

### 2.26 Task Management (FR-TM) - MVP+2

Task lists with checkboxes, due dates, and views.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-TM-01 | **Checkbox Tasks** - `[ ]` and `[x]` syntax in markdown | P1-MVP+2 | Obsidian parity |
| FR-TM-02 | **Due Dates** - Task with due date | P2-MVP+2 | Scheduling |
| FR-TM-03 | **Task Queries** - Find all incomplete tasks across files | P2-MVP+2 | Dataview-like |
| FR-TM-04 | **Kanban View** - Board view of tasks by status | P2-MVP+2 | Visual |
| FR-TM-05 | **Nested Tasks** - Subtasks with indentation | P1-MVP+2 | Hierarchy |
| FR-TM-06 | **Task Extraction** - AI extracts tasks from conversations | P2-MVP+2 | Automation |
| FR-TM-07 | **Task Completion** - Check off tasks, track completion | P1-MVP+2 | Core |

### 2.27 Tagging & Actions (FR-TA) - MVP+2

Inline tags for due dates, actions, and reminders.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-TA-01 | **Inline Tags** - #tag syntax parsed from markdown | P1-MVP+2 | Foundation |
| FR-TA-02 | **Due Date Tags** - `#due:YYYY-MM-DD` parsed as date | P1-MVP+2 | Actionable |
| FR-TA-03 | **Reminder Tags** - `#reminder:YYYY-MM-DD` | P1-MVP+2 | Soft dates |
| FR-TA-04 | **Action Tags** - `#action:todo`, `#action:call`, etc. | P1-MVP+2 | Classification |
| FR-TA-05 | **Priority Tags** - `#priority:high/medium/low` | P2-MVP+2 | Urgency |
| FR-TA-06 | **Recurring Tags** - `#recurring:daily/weekly/monthly` | P2-MVP+2 | Repeat |
| FR-TA-07 | **Context Tags** - `#context:name` for grouping | P2-MVP+2 | Organization |
| FR-TA-08 | **Tag Index** - System maintains index of all tags | P1-MVP+2 | Query support |
| FR-TA-09 | **Tag Queries** - Search/filter by tag combinations | P1-MVP+2 | Dataview-like |
| FR-TA-10 | **Tag Autocomplete** - Suggest existing tags | P2-MVP+2 | UX |
| FR-TA-11 | **Today View** - Dashboard of due/reminder items | P1-MVP+2 | Quick access |

### 2.28 Notifications & Reminders (FR-NO) - MVP+2

Alert users to due items and AI suggestions.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-NO-01 | **In-App Notifications** - Toast/badge for reminders | P1-MVP+2 | Core |
| FR-NO-02 | **Due Date Alerts** - Notify when task/item due | P1-MVP+2 | Timely |
| FR-NO-03 | **Daily Cron Scan** - Background job finds due items | P1-MVP+2 | Automation |
| FR-NO-04 | **Overdue Highlighting** - Visual indicator for past-due | P1-MVP+2 | UX |
| FR-NO-05 | **AI Suggestion Alerts** - Notify when AI wants to save | P2-MVP+2 | Awareness |
| FR-NO-06 | **External Notifications** - Optional push to ntfy/email | P2-MVP+2 | Integration |
| FR-NO-07 | **Notification Center** - View all notifications | P1-MVP+2 | Management |

### 2.29 Grist Integration (FR-GR) - MVP+6

Display Grist database data within The Keep.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-GR-01 | **Grist Tab** - Open Grist database view in dockview | P2-MVP+2 | Embedded |
| FR-GR-02 | **Table View** - Display Grist table data natively | P2-MVP+2 | Read API |
| FR-GR-03 | **Graph View** - Visualize Grist data as chart | P3-v2 | Relationships |
| FR-GR-04 | **RAG Integration** - Include Grist data in AI context | P2-MVP+2 | Query |
| FR-GR-05 | **Bidirectional Sync** - Changes reflect in both | P3-v2 | Complex |

### 2.30 Export (FR-EX)

Export data for backup and portability.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-EX-01 | **Export Project** - Download as ZIP | P1-MVP | Backup |
| FR-EX-02 | **Export Memories** - JSON/CSV export | P2 | Portability |
| FR-EX-03 | **Export Conversations** - Save chat history | P2 | Archive |
| FR-EX-04 | **Scheduled Backup** - Auto-export on schedule | P3 | Automation |

### 2.31 Mobile Interface (FR-MO) - MVP+1

Mobile-responsive interface for on-the-go access.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-MO-01 | **Responsive Layout** - Adapts to phone/tablet screens | P0-MVP+1 | Foundation |
| FR-MO-02 | **Touch-Friendly UI** - Larger tap targets, swipe gestures | P0-MVP+1 | UX |
| FR-MO-03 | **Mobile File Browser** - Swipe to navigate, pull to refresh | P0-MVP+1 | Core |
| FR-MO-04 | **Mobile Chat** - Full-screen chat mode, voice input | P0-MVP+1 | Primary use |
| FR-MO-05 | **Mobile Editor** - TipTap WYSIWYG optimized for touch | P0-MVP+1 | Editing |
| FR-MO-06 | **Offline Viewing** - Cache recent files for read-only offline access (simple browser cache, not complex sync) | P2-MVP+1 | Nice-to-have |
| FR-MO-07 | **Quick Capture** - Fast note/memory creation from home | P1-MVP+1 | Speed |
| FR-MO-08 | **Mobile Search** - Voice-activated search | P2-MVP+1 | Convenience |
| FR-MO-09 | **PWA Support** - Install as app on home screen | P1-MVP+1 | Native feel |
| FR-MO-10 | **Sync Indicator** - Show online/offline status | P1-MVP+1 | Clarity |

**Design Principles:**
- Mobile-first for MVP+1, not responsive afterthought
- Chat is primary mobile use case (quick queries on the go)
- File viewing > file editing on mobile
- Offline viewing for recently accessed files
- PWA for native-like experience without app store

### 2.32 Image Generation (FR-IG) - MVP+4

AI image generation integrated into documents via LiteLLM proxy.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-IG-01 | **Generate from Prompt** - Create image from text description | P2-MVP+4 | DALL-E via LiteLLM |
| FR-IG-02 | **Insert into Document** - Place generated image in current file | P2-MVP+4 | Editor integration |
| FR-IG-03 | **Image Gallery** - View/manage generated images | P3-MVP+4 | Organization |
| FR-IG-04 | **Regenerate** - Generate variations of existing image | P3-MVP+4 | Iteration |
| FR-IG-05 | **Size Options** - 256x256, 512x512, 1024x1024 | P2-MVP+4 | DALL-E options |
| FR-IG-06 | **Style Presets** - Common styles (photo, illustration, diagram) | P3-MVP+4 | UX |

**Integration via LiteLLM:**
```javascript
// Via LiteLLM proxy (same endpoint as chat)
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A diagram showing the architecture of The Keep",
  n: 1,
  size: "1024x1024"
});
// Store in MinIO, insert markdown link
```

**Use Cases:**
- Generate diagrams for documentation
- Create placeholder images for mockups
- Illustrate concepts in notes
- Generate cover images for project files

---

## 3. User Journeys

### 3.1 Daily Value Journeys (Core Use)

**Journey 1: AI Conversation with Citations**
```
User: "Summarize my latest labs"
→ AI reads: labs/2026-03.pdf, health profile
→ Response with citations: "Your A1C improved to 5.4 [labs/2026-03.pdf:p2]..."
→ User clicks citation → jumps to source
```

**Journey 2: Recipe Request (Context-Aware)**
```
User: "What should I make for dinner?"
→ AI checks: inventory, preferences, health profile, recent meals
→ "Based on your pantry [inventory/pantry.md], goals [profile/health.md],
   and that you had chicken yesterday, try this salmon recipe..."
```

**Journey 3: Health Report Synthesis**
```
User: "How am I doing health-wise?"
→ AI synthesizes: labs, metrics, supplements, goals
→ Structured report with trends, each fact cited
→ Offers: "Generate questions for your doctor?"
```

**Journey 4: Expert Perspective**
```
User: "What would Huberman say about my sleep stack?"
→ AI checks: supplements, trusted sources (Huberman: sleep 9/10)
→ Synthesizes Huberman's known positions + user's current stack
→ "He'd likely suggest adding magnesium threonate..."
```

**Journey 5: Atomic File Edit**
```
User: "Remove fish oil from my supplements"
→ AI: "I'll edit supplements/daily-stack.md, removing line 8:
   - Fish Oil: 2g with meals"
→ User: "Do it"
→ One line removed. Everything else unchanged.
```

**Journey 6: Add Entry (No Regeneration)**
```
User: "Add my new blood work results"
→ AI: "I'll append to labs/tracking.md. What are the values?"
→ User provides values
→ AI adds new row to existing table. Previous entries untouched.
```

**Journey 7: Recurring Report (MVP+1)**
```
User: "Show me my pill box layout" (every 2 weeks)
→ AI reads: reports/pill-box-layout.md (derived view)
→ Same format every time because it's reading YOUR file
→ If supplements changed: "Source updated. Refresh view?"
```

### 3.2 Management Journeys

**Journey 8: Manage Trusted Sources**
```
User: Opens Settings → Trusted Sources
→ Sees: Huberman (sleep 9, supplements 8), Attia (longevity 9)
→ Adjusts ratings, adds new source
→ AI behavior updates accordingly
```

**Journey 9: Project Instructions (Soul)**
```
User: Opens Settings → Project Overview
→ Edits: "Be direct about health concerns. Always cite sources."
→ Adds trusted sources, sets guardrails
→ Saves → SOUL.md and GUARDRAILS.md updated
```

**Journey 10: Memory Audit**
```
User: "Where did you learn my weight is 185?"
→ AI: "From labs/2026-01.pdf, intake form section"
→ User: "That's outdated"
→ User edits memory → new source: user_edit
```

### 3.3 Setup & Recovery Journeys

**Journey 11: First Project Setup**
```
New user → Create project → Soul Discovery
→ "What's this project for?" → "Health tracking"
→ "How can I help?" → "Summarize labs, prep for doctor visits"
→ "Any boundaries?" → "Never diagnose"
→ SOUL.md + GUARDRAILS.md generated
```

**Journey 12: Error Recovery**
```
AI gives wrong answer → User: "That's wrong"
→ AI: "Let me check my source... Found in old file.
   Recent file shows different value. Updating."
→ User can also directly edit memory/file
```

**Journey 13: File Recovery**
```
User accidentally deletes file
→ Toast: "Deleted. Undo?"
→ Or: Open .keep/trash/ → Restore file
→ 30-day window for recovery
```

### 3.4 Cross-Project Journeys

**Journey 14: Cross-Domain Recipe Request**
```
User (in Food project): "What should I make for dinner tonight?"
→ AI reads Food project: pantry/inventory.md, recipes/favorites.md, meals/this-week.md
→ AI reads Health project (linked): profile/dietary-needs.md, tracking/fasting-schedule.md
→ AI synthesizes:
  "You're breaking your fast at 6pm [health/fasting-schedule.md].
   Based on your low-carb goals [health/dietary-needs.md] and
   what's in your fridge [food/pantry.md], here are 3 options
   from your saved recipes [food/recipes/]..."
→ Citations from BOTH projects
→ User can drill into any source
```

**Journey 15: Health-Aware Meal Planning**
```
User: "Plan my meals for next week"
→ AI checks Health: dietary restrictions, supplement timing, fasting windows
→ AI checks Food: pantry inventory, recipe database, recent meals (avoid repeats)
→ AI generates meal plan respecting ALL constraints:
  "Monday dinner: Salmon (need omega-3s per health goals)
   Tuesday lunch: Break fast at noon, light salad
   Wednesday: Avoid shellfish (allergy in health profile)..."
→ Offers: "Add ingredients to shopping list?" → writes to Food project
```

**Journey 16: Cross-Project Memory with Boundaries**
```
User: "Remember that I'm doing 16:8 intermittent fasting"
→ AI: "Which project should I save this to?"
   - Health (affects dietary recommendations) ← primary
   - Food (affects meal timing) ← reference
→ User: "Health, but Food should know about it"
→ Memory saved to Health with cross-project reference flag
→ Food project can READ fasting schedule but not WRITE to Health
```

**Journey 17: Cross-Project Update Request (Inbox Model)**
```
User working in Food project: "Log that I ate shellfish today"
→ AI in Food: "I noticed shellfish. Your Health project lists shellfish allergy.
   Should I send an update request to Health?"
→ User: "Yes, maybe I'm not allergic anymore"
→ AI creates inbox request in Health project:
   "Food project requests: Update allergy status for shellfish
    Context: User ate shellfish on 2026-03-22
    [Approve] [Deny] [Review in Health]"

Later, user opens Health project:
→ Notification: "1 pending request from Food project"
→ User reviews inbox → Approves update
→ Health allergy list updated with provenance: "Updated via Food project request"
```

**Journey 18: Review Cross-Project Inbox**
```
User opens Health project → sees inbox badge (3)
→ Opens Project Inbox:
   1. Food: "Remove shellfish from allergies" [Approve] [Deny]
   2. Food: "Add lactose sensitivity" [Approve] [Deny]
   3. Fitness: "Update weight to 173 lbs" [Approve] [Deny]
→ User can approve/deny without switching projects
→ Approved changes get provenance: "Approved from {source} project"
```

### 3.5 Activity & Recall Journeys

**Journey 19: Auto-Generated Daily Journal (Central)**
```
End of day (or on-demand):
→ AI reviews all conversations from today ACROSS ALL PROJECTS
→ Generates central daily journal entry:

   "## 2026-03-22

   ### Projects Worked On
   - Health (3 conversations)
   - Food (2 conversations)
   - Infrastructure (1 conversation)

   ### Key Activities
   - [Health] Reviewed March lab results - A1C improved to 5.4
   - [Health] Updated supplements: removed fish oil, added magnesium
   - [Health] Logged weight: 175 lbs
   - [Food] Planned meals for week, low-carb focus
   - [Food] Added 3 salmon recipes
   - [Infra] Deployed new monitoring dashboard

   ### Changes Made
   - [Health] supplements/daily-stack.md - removed fish oil
   - [Food] meals/week-12.md - created
   - [Infra] dashboards/monitoring.yaml - updated

   ### Memories Updated
   - [Health] weight: 178 → 175
   - [Health] supplements: -fish oil, +magnesium threonate"

→ Journal saved to CENTRAL location: ~/.keep/journal/2026-03-22.md
→ One place to see ALL activity across ALL projects
→ Searchable: "what did I work on last Tuesday?"
```

**Journey 20: Temporal Recall Query**
```
User: "When did I remove fish oil from my supplements?"
→ AI searches: journal entries, file version history, memory versions
→ "You removed fish oil on March 22, 2026 [journal/2026-03-22.md]
   The change was made to supplements/daily-stack.md [version 12]
   You mentioned concerns about oxidation from a Huberman episode."
→ User can click any citation to see full context
```

**Journey 21: Central Activity Timeline**
```
User opens Journal panel (global, not per-project)
→ Sees calendar/timeline view across ALL projects
→ Browse by day, week, month
→ Each day shows:
   - Which projects were active
   - Key activities (high-level bullets)
   - Files changed
   - Memories updated
→ Click any day → full journal entry
→ Search: "when did I work on fish oil?" → finds March 22
→ Filter: "show only Health project activity" → filtered view
```

**Journey 22: Passive Journaling (Zero Effort)**
```
User just uses The Keep normally - asks questions, edits files, updates memories
→ AI silently tracks key activities in background
→ End of day: journal auto-generated
→ User never has to "do" journaling - it happens automatically
→ Weeks later: "What was I doing in early March?"
→ Full activity log available without any manual effort
```

**Journey 23: Auto Task Extraction + Tracking**
```
During conversations:
→ AI detects task-like statements:
   "I need to schedule a follow-up with Dr. Smith"
   "We should fix that monitoring threshold"
   "Don't forget to order more magnesium"
→ AI: "I noticed some potential tasks. Add to your task list?"
→ Tasks added to central journal with project tags

End of day journal shows:
  ### Tasks Created Today
  - [ ] [Health] Schedule follow-up with Dr. Smith
  - [ ] [Infra] Fix monitoring alert threshold
  - [ ] [Health] Order magnesium threonate

  ### Tasks Completed Today
  - [x] [the-keep] Complete PRD party review
  - [x] [Food] Plan meals for week
```

**Journey 24: Multi-Source Activity Integration (v2 Vision)**
```
Central journal aggregates from multiple sources:

  ## 2026-03-22

  ### The Keep Activity
  - Health: Reviewed labs, updated supplements
  - Food: Meal planning, 3 new recipes

  ### Claude Code Sessions
  - the-keep repo: PRD review, 47 tool calls
  - infrastructure: Deployed monitoring fix

  ### n8n Workflows
  - YouTube transcript import: 3 videos processed
  - Daily backup: Completed successfully

  ### OpenClaw Automations
  - Memory sync: 12 memories indexed
  - Report generation: Weekly health summary

→ One view of EVERYTHING you did today
→ "What did I work on last week?" → full picture
```

**Journey 25: External App Logging via API/MCP (v2 Vision)**
```
Claude Code session ends:
→ Claude Code hook calls The Keep Journal API:
   POST /api/journal/activity
   {
     "source": "claude-code",
     "project": "the-keep",
     "summary": "PRD party review - 22 journeys added",
     "details": ["47 tool calls", "3 files modified"],
     "tasks_created": ["Update architecture doc"],
     "tasks_completed": ["Complete PRD review"],
     "timestamp": "2026-03-22T18:30:00Z"
   }
→ Entry added to today's journal under "Claude Code Sessions"

n8n workflow completes:
→ n8n sends webhook to The Keep:
   POST /api/journal/webhook/n8n
   {
     "workflow": "youtube-transcript-import",
     "status": "success",
     "items_processed": 3
   }
→ Entry added under "n8n Workflows"

MCP server (OpenClaw) logs activity:
→ Calls MCP tool: journal_log_activity
→ Entry added under "OpenClaw Automations"
```

### 3.6 Personas & Coach Journeys

**Journey 26: Motivational Coach Mode**
```
User enables "Coach Mode" in settings (or per-project Soul)
→ AI responses include encouragement and progress acknowledgment:

When completing tasks:
→ "Nice work! That's 3 tasks done today. You're on a roll."

In daily journal:
→ "🎉 Great day! You made progress on 2 projects."
→ "📈 3-day streak on Health project - consistency building!"
→ "You've been meaning to schedule that follow-up for 5 days.
    Want to knock it out now? It'll feel good to check it off."

When user seems stuck:
→ "I notice this task has been here a while.
    Would it help to break it into smaller steps?"

Weekly summary:
→ "This week: 12 tasks completed vs 8 last week (+50%)
    Your Health project got the most attention - aligned with your goals!"

Celebrating wins:
→ "Remember when you said you wanted to track supplements better?
    You've now logged 30 days consistently. 💪"
```

**Journey 27: Growth & Learning Prompts**
```
AI notices patterns and suggests growth opportunities:

→ "You've asked about sleep 5 times this month.
    Want me to create a Sleep Optimization project?"

→ "Based on your questions, you're building expertise in nutrition.
    I could compile your learnings into a personal knowledge doc."

→ "You haven't touched the Infrastructure project in 2 weeks.
    Just checking - is it on hold, or should we revisit?"

→ "You mentioned wanting to learn more about fasting.
    I found 3 relevant videos in your YouTube imports. Review them?"
```

**Journey 28: AI Persona Selection**
```
User opens AI Chat → clicks persona selector in chat header:

  [🤖 Default ▼]

Dropdown shows:
  🤖 Default    - Neutral, helpful, professional
  💪 Coach      - Encouraging, celebrates wins, accountability
  📚 Teacher    - Explains concepts, educational tone
  📊 Analyst    - Data-focused, objective, metrics-driven
  🎨 Creative   - Brainstorming, exploratory, "what if"

User selects Coach:
→ Chat header shows: [💪 Coach]
→ AI tone shifts: "Let's tackle this! What are we working on?"

Same question, different personas:
  "How am I doing on my health goals?"

  🤖 Default: "Based on your data, A1C improved 0.3 points."

  💪 Coach:  "You're crushing it! A1C down 0.3 - that's real progress.
              Keep this momentum going!"

  📊 Analyst: "A1C: 5.4 (↓0.3 from baseline). Trending positive.
               Correlation with supplement changes: moderate (r=0.6)."
```

**Journey 29: Per-Project Persona Defaults**
```
Each project can have a default persona in .keep/SOUL.md:

Health project SOUL.md:
  "default_persona: coach"
  "Be encouraging about health progress. Celebrate wins."

Infrastructure project SOUL.md:
  "default_persona: analyst"
  "Be precise and technical. Focus on metrics and reliability."

→ When switching projects, persona auto-adjusts
→ User can still override manually per conversation
```

### 3.7 AI Customization Journeys

**Journey 30: Global AI Preferences**
```
User opens Settings → AI Customization:

  Communication Style: [Concise] [Balanced] [Detailed]
  Tone: [Casual] [Professional] [Technical]
  Feedback Style: [Direct] [Encouraging] [Socratic]
  Expertise Level: [Explain basics] [Assume knowledge] [Expert mode]

  Custom Instructions:
  "I prefer bullet points over paragraphs.
   Always cite your sources.
   Ask clarifying questions before making assumptions."

→ These apply globally unless overridden by project/content settings
```

**Journey 31: Content Style Profiles**
```
User creates style profiles for different content types:

  Style Profile: "Instagram Posts"
  ├─ Tone: Casual, friendly
  ├─ Length: Short (< 200 words)
  ├─ Format: Emoji-friendly, hashtag suggestions
  └─ Template: social-post.md

  Style Profile: "Health Tracking"
  ├─ Tone: Clinical, precise
  ├─ Length: Structured, tables preferred
  ├─ Format: Markdown tables, metric units
  └─ Template: health-entry.md

  Style Profile: "Technical Docs"
  ├─ Tone: Formal, thorough
  ├─ Length: Detailed with examples
  ├─ Format: Code blocks, diagrams
  └─ Template: tech-doc.md

When generating content:
→ AI asks or detects: "This looks like health tracking content"
→ Applies "Health Tracking" style profile automatically
```

**Journey 32: AI-Generated Style Guide**
```
User imports existing documents → AI analyzes patterns:

AI: "I've analyzed 47 of your documents. Here's what I learned:

  ## Your Writing Style Guide

  ### Structure
  - You prefer H2 for main sections, H3 for subsections
  - Lists: Bullet points for info, numbered for steps
  - Tables: Used frequently for comparisons and tracking

  ### Tone
  - Health docs: Clinical but accessible
  - Personal notes: Casual, stream of consciousness
  - Technical: Precise, includes code snippets

  ### Vocabulary
  - You use 'stack' for supplement combinations
  - 'Labs' instead of 'blood work' or 'tests'
  - Specific brand names for supplements

  ### Formatting
  - Date format: YYYY-MM-DD
  - File naming: lowercase-with-dashes.md
  - Frontmatter: Always include tags and date

  Would you like me to follow this style guide for new content?"

→ Style guide saved to .keep/STYLE_GUIDE.md
→ AI references it when generating content
→ User can edit/refine the generated guide
```

**Journey 33: Style-Aware Content Generation**
```
User: "Create a supplement tracking entry for today"
→ AI checks:
   1. Content type → Health Tracking
   2. Style profile → Clinical, tables, specific format
   3. Style guide → User says "stack", uses metric, YYYY-MM-DD dates
   4. Template → health-entry.md
→ AI generates content matching ALL style layers

User: "Write an Instagram post about my fasting progress"
→ AI checks:
   1. Content type → Social Media
   2. Style profile → Casual, emoji, short
   3. Style guide → (different tone for social)
   4. Template → social-post.md
→ AI generates casual, engaging post with hashtags
```

---

## Innovation & Novel Patterns

### Detected Innovation Areas

| Innovation | Challenge to Status Quo | The Keep Approach |
|------------|------------------------|-------------------|
| **AI Edits, Not Regenerates** | ChatGPT creates new artifacts each time, losing structure | AI modifies existing files in place like Claude Code |
| **Source of Truth = Your Files** | ChatGPT uses AI memory, inconsistent outputs | AI reads YOUR files, same format every time |
| **Memory Provenance** | ChatGPT memories are opaque blobs | Every fact tracks source: file, conversation, user edit |
| **Atomic Memories** | ChatGPT has paragraphs you can't edit | Single-fact memories, granularly editable |
| **Safe Autonomy** | OpenClaw is powerful but dangerous/expensive | Guardrails + self-hosted = controlled autonomy |
| **Obsidian Patterns + AI Automation** | Obsidian has steep learning curve | Same patterns (tasks, tags, templates), AI does the manual work |
| **Natural Language Templates** | Templater requires `<% %>` syntax | AI fills context variables from natural language |
| **Filter Panels, Not Query Syntax** | Dataview requires writing queries | Dropdown filters pull live data |
| **AI Personas** | ChatGPT has one personality | 5 toggleable personas (Coach, Teacher, Analyst, Creative, Default) |
| **Auto-Generated Daily Journal** | Manual journaling or nothing | Central journal aggregates all project activity automatically |
| **Cross-Project Inbox** | Apps silo data or share everything | READ across projects, WRITE via approval workflow (PR-style) |
| **Memory Version Control** | ChatGPT memories are opaque, no history | Full version history with revert, change tracking, diff view |
| **4-Layer AI Customization** | Basic settings or none | Global prefs → Persona → Style Profile → AI-learned guide |
| **Memory Lifecycle Management** | Memories accumulate forever | Tiered relevance (hot/warm/cold), archival, 30-day trash purge |

### Market Context & Competitive Landscape

| Competitor | Gap The Keep Fills |
|------------|-------------------|
| **ChatGPT/Claude.ai** | No file management, regenerates artifacts, opaque memory, single personality, no provenance |
| **Obsidian** | Desktop-only, AI bolted-on, steep learning curve, no cross-project model, no AI personas |
| **Cursor** | Code-focused, not PKM, no memory/inventory system, no journal, no personas |
| **OpenClaw** | Expensive to run, security risks, no file browser UI, no memory lifecycle |
| **Notion AI** | Cloud-only, not self-hosted, limited AI integration, no personas, no cross-project inbox |
| **Day One / Journey** | Journaling only, no AI intelligence, no memory extraction, no PKM features |
| **Roam Research** | Complex learning curve, no AI personas, no auto-journaling, expensive |

**Unique Position:** Web-based Cursor + Obsidian patterns + Claude Code AI + self-hosted control + AI personas + auto-journaling + cross-project intelligence

### Validation Approach

| Innovation Claim | How We Validate |
|------------------|-----------------|
| AI edits are reliable | Test: same edit request → same result across sessions |
| Provenance is useful | User can trace any fact to source within 2 clicks |
| Atomic memories work | User can edit single value without side effects |
| Filter panels replace queries | Non-technical user can find tasks without learning syntax |
| Templates feel natural | User describes template, AI generates correctly |
| Personas feel authentic | User can distinguish personas blindly, each provides value |
| Daily journal is useful | User references journal entries within 7 days of generation |
| Cross-project inbox doesn't friction | Approval workflow completes in < 30 seconds |
| Memory versioning aids correction | User can revert unwanted changes in 2 clicks |
| Tiered memory improves context | AI responses reference relevant memories, not stale ones |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI edits could corrupt files | Diff preview required, undo/version history |
| AI could learn wrong facts | Provenance makes correction easy, user can verify source |
| Filter panels too limited | Allow "advanced mode" for power users |
| Plugin system security | Learn from OpenClaw: sandbox, audit, permission system |
| Personas feel gimmicky | Ground in real coaching/teaching methodologies, make toggleable |
| Auto-journal overwhelms | Configurable verbosity, collapsible sections, "highlights only" mode |
| Cross-project inbox ignored | Notification badges, expiration reminders, one-click approve/deny |
| Memory versioning bloats storage | Prune old versions after configurable period, compress diffs |
| Tiered scoring is opaque | Show relevance reasoning, allow manual tier override |

---

## Web App Specific Requirements

### Project-Type Overview

The Keep is a **Single Page Application (SPA)** built with Next.js App Router, providing an IDE-like experience for personal knowledge management. Self-hosted, single-user focus means no SEO requirements but strong emphasis on real-time performance and accessibility.

### Browser Support Matrix

| Browser | Desktop | Mobile | Priority |
|---------|---------|--------|----------|
| **Chrome** | ✅ Required | ✅ Required | P0 |
| **Safari** | ✅ Required | ✅ Required (iOS) | P0 |
| **Firefox** | Nice-to-have | Not required | P2 |
| **Edge** | Nice-to-have | Not required | P2 |

**Target versions:** Latest 2 major versions of Chrome and Safari.

### Responsive Design Requirements

| Breakpoint | Target | Layout |
|------------|--------|--------|
| **Desktop** (≥1024px) | Primary experience | Full dockview panels, file tree, multi-split |
| **Tablet** (768-1023px) | Functional | Collapsible panels, simplified layout |
| **Mobile** (< 768px) | Read + chat focus | Single panel, swipe navigation, bottom nav |

**Mobile Editor Strategy:**
- **Preview mode**: TipTap WYSIWYG (touch-optimized)
- **Source mode**: Plain textarea (no Monaco on mobile - too heavy)
- Toggle between source/rendered via button
- Full Monaco editing deferred to desktop/tablet

### Performance Targets

| Metric | Target |
|--------|--------|
| **First Contentful Paint** | < 1.5s |
| **Largest Contentful Paint** | < 2.5s |
| **Time to Interactive** | < 3.0s |
| **AI Response Start** | < 1.0s (streaming) |
| **File Open (10MB PDF)** | < 3.0s |

### Real-Time Requirements

| Feature | Technology |
|---------|------------|
| **AI Streaming** | Server-Sent Events (SSE) |
| **File Sync** | WebSocket or polling |
| **Notifications** | WebSocket |
| **Future Collaboration** | WebSocket + CRDT (v2+) |

### Accessibility Requirements (WCAG 2.1 AA)

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| **Keyboard Navigation** | All interactive elements reachable via Tab; logical tab order; visible focus ring (2px minimum) |
| **ARIA Labels** | All buttons, inputs, panels have descriptive labels; screen reader announces panel changes |
| **Color Contrast** | 4.5:1 minimum for normal text; 3:1 for large text (18pt+); tested with axe-core |
| **Motion Sensitivity** | Animations disabled when `prefers-reduced-motion: reduce`; no auto-playing animations |
| **Touch Targets** | 44x44px minimum on mobile; adequate spacing between targets |
| **Focus Management** | Focus trapped in modals; restored after modal close; skip-to-content link |
| **Error Identification** | Form errors announced to screen readers; error messages associated with inputs |
| **Semantic HTML** | Proper heading hierarchy (h1→h2→h3); landmarks (main, nav, aside); lists for lists |

### Storage Strategy (Server = Source of Truth)

| Data Type | Storage | Notes |
|-----------|---------|-------|
| Layout/Preferences | Server (PostgreSQL) | Syncs across devices |
| Open Files State | Server | Resume on any device |
| Drafts/Unsaved | Server (auto-save) | Never lose work |
| File Cache | IndexedDB (cache only) | Can be cleared |
| Auth Token | Memory + httpOnly cookie | Secure |

**Principle:** Local storage is cache/optimization only. Server is truth.

### Auto-Save & Edit Safety

| Feature | Behavior |
|---------|----------|
| **Debounced Auto-Save** | Save after 2-3 seconds of inactivity |
| **Save Indicator** | "Saving...", "Saved ✓", "Offline - will sync" |
| **Conflict Detection** | Show diff + merge options if server changed |
| **Dirty State Warning** | Prompt before navigating away |
| **Crash Recovery** | Restore from last auto-save |

### Icon System

| Type | Support |
|------|---------|
| **Standard Emoji** | Native Unicode |
| **Custom Icons** | Upload, Simple Icons library, Lucide |
| **Icon Syntax** | `::iconname::` renders in content |
| **Icon Registry** | Per-project in `.keep/icons.yaml` |

---

## Domain-Specific Requirements

### Security: Secret Detection & Masking (FR-SEC)

When sending content to external AI APIs, protect sensitive data.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-SEC-01 | **Secret Detection** - Scan outbound AI requests for secrets (passwords, API keys, tokens) | P1-MVP | Pattern matching + entropy analysis |
| FR-SEC-02 | **Secret Masking** - Replace secrets with placeholders before external API calls | P1-MVP | Reversible mapping (`[MASKED_KEY_1]`) |
| FR-SEC-03 | **Secret Unmasking** - Restore original values in AI response display | P1-MVP | Local only, never stored masked |
| FR-SEC-04 | **Masking Indicator** - Show user when secrets were masked ("2 secrets masked") | P1-MVP | Transparency |
| FR-SEC-05 | **Override Option** - Allow sending unmasked with explicit warning | P2 | Power users, false positives |

### Health Domain: Light Compliance

This is a **personal** knowledge management tool, not a clinical system:
- NOT a covered entity under HIPAA (self-hosted, personal use)
- No FDA implications (not a medical device, not diagnostic)
- AI guardrails: Never diagnose, always cite sources
- Data accuracy and provenance are critical (already addressed in FR-MP)

### Plugin System Architecture (FR-PL)

Extensibility for custom integrations.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-PL-01 | **Plugin Architecture** - Design for extensibility from day one | P1-MVP | Architecture ready |
| FR-PL-02 | **Safe Sandboxing** - Plugins run in isolated context | P1-MVP | Learn from OpenClaw security issues |
| FR-PL-03 | **Plugin Types** - Import sources, custom panels, data processors | P2-MVP+1 | YouTube, Apple Health, etc. |
| FR-PL-04 | **Plugin API** - Documented API for plugin developers | P3-v2 | Ecosystem enablement |

---

## 4. Non-Functional Requirements

### 4.1 Performance (NFR-P)

#### 4.1.1 Response Time Targets

| ID | Metric | Target | Measurement |
|----|--------|--------|-------------|
| NFR-P-01 | Initial page load (cold) | < 3 seconds | First Contentful Paint |
| NFR-P-02 | Initial page load (cached) | < 1 second | Time to Interactive |
| NFR-P-03 | File tree load (1000 files) | < 2 seconds | Virtual scrolling ready |
| NFR-P-04 | File tree load (10,000 files) | < 5 seconds | Progressive loading |
| NFR-P-05 | File open (markdown, < 1MB) | < 500ms | Content rendered |
| NFR-P-06 | File open (PDF, 10MB) | < 3 seconds | First page visible |
| NFR-P-07 | AI response start (streaming) | < 1 second | First token received |
| NFR-P-08 | RAG search results | < 2 seconds | Results displayed |
| NFR-P-09 | Layout save/restore | < 500ms | Panels restored |
| NFR-P-10 | Editor mode toggle | < 200ms | Source ↔ Preview |
| NFR-P-11 | Auto-save trigger | < 100ms | Debounced save initiated |
| NFR-P-12 | Command palette open | < 100ms | Results visible |

#### 4.1.2 Resource Limits

| ID | Resource | Limit | Notes |
|----|----------|-------|-------|
| NFR-P-20 | Client memory | < 500MB | Browser tab |
| NFR-P-21 | Bundle size (initial) | < 500KB | Gzipped |
| NFR-P-22 | Bundle size (total) | < 2MB | With lazy loading |
| NFR-P-23 | API response size | < 10MB | Single request |
| NFR-P-24 | WebSocket connections | 2-3 max | AI streaming, sync |

#### 4.1.3 Throughput

| ID | Operation | Target | Notes |
|----|-----------|--------|-------|
| NFR-P-30 | File uploads | 10 concurrent | Queued beyond |
| NFR-P-31 | AI requests | 5/minute | Rate limited |
| NFR-P-32 | Search queries | 20/minute | Debounced |

### 4.2 Reliability (NFR-R)

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-R-01 | Uptime | 99% | Self-hosted acceptable |
| NFR-R-02 | Data durability | Zero loss | Auto-save + versioning |
| NFR-R-03 | Auto-save reliability | 100% | Every change persisted |
| NFR-R-04 | Graceful degradation | Full | App usable if AI down |
| NFR-R-05 | Crash recovery | < 30s | Container restart |
| NFR-R-06 | State persistence | 100% | Layout survives refresh |
| NFR-R-07 | Offline tolerance | Basic | View cached files |
| NFR-R-08 | Error recovery | Automatic | Retry with backoff |

**Failure Modes:**

| Component | Failure | Behavior |
|-----------|---------|----------|
| AI Backend | Down | Chat disabled, file ops continue |
| MinIO | Down | Read from cache, writes queued |
| PostgreSQL | Down | App unavailable (critical) |
| Redis | Down | Fall back to PostgreSQL |

### 4.3 Security (NFR-S)

#### 4.3.1 Authentication & Authorization

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-S-01 | Authentication | Authentik SSO (v1: simple auth) |
| NFR-S-02 | Session management | HTTP-only cookies, 24h expiry |
| NFR-S-03 | Authorization | Single user v1, RBAC foundation |
| NFR-S-04 | API authentication | Bearer tokens, server-validated |

#### 4.3.2 Data Protection

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-S-10 | Data at rest | MinIO encryption (existing) |
| NFR-S-11 | Data in transit | TLS 1.3 via Traefik |
| NFR-S-12 | Database encryption | PostgreSQL native |
| NFR-S-13 | Backup encryption | Encrypted at rest |

#### 4.3.3 Secret Handling

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-S-20 | API keys | Server-side only, never in client |
| NFR-S-21 | Secret detection | Scan outbound AI requests |
| NFR-S-22 | Secret masking | Replace with placeholders |
| NFR-S-23 | Credential storage | Environment variables, not code |
| NFR-S-24 | Local storage | No secrets in browser storage |

#### 4.3.4 Input Validation

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-S-30 | File upload validation | Type, size, content checks |
| NFR-S-31 | Path traversal prevention | Sanitize all file paths |
| NFR-S-32 | XSS prevention | Sanitize markdown rendering |
| NFR-S-33 | CSRF protection | Token-based |
| NFR-S-34 | SQL injection | Parameterized queries (Drizzle) |

### 4.4 Scalability (NFR-SC)

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-SC-01 | Files per project | 10,000+ | Virtual scrolling |
| NFR-SC-02 | Projects per user | 50+ | Lazy loading |
| NFR-SC-03 | Total storage | 100GB+ | MinIO capacity |
| NFR-SC-04 | Memories per project | 10,000+ | Paginated queries |
| NFR-SC-05 | Vector embeddings | 100,000+ | pgvector indexing |
| NFR-SC-06 | Chat history | 1,000+ messages | Windowed loading |
| NFR-SC-07 | Concurrent users | 1 (v1) | Foundation for more |

### 4.5 Accessibility (NFR-A)

| ID | Requirement | Standard | Notes |
|----|-------------|----------|-------|
| NFR-A-01 | WCAG compliance | 2.1 AA | Minimum target |
| NFR-A-02 | Keyboard navigation | Full | All features accessible |
| NFR-A-03 | Screen reader support | Full | ARIA labels |
| NFR-A-04 | Focus indicators | Visible | All interactive elements |
| NFR-A-05 | Color contrast | 4.5:1 | Text on background |
| NFR-A-06 | Resize support | 200% | No horizontal scroll |
| NFR-A-07 | Motion reduction | Supported | Respect prefers-reduced-motion |
| NFR-A-08 | Alt text | Required | All images and icons |

**Keyboard Shortcuts:**

| Action | Shortcut | Notes |
|--------|----------|-------|
| Command palette | Cmd+K | Primary navigation |
| Save file | Cmd+S | Active editor |
| Close tab | Cmd+W | Active tab |
| Find in file | Cmd+F | Active editor |
| Find in project | Cmd+Shift+F | Global search |
| Toggle sidebar | Cmd+B | File browser |
| New file | Cmd+N | Create file |
| Split panel | Cmd+\ | Vertical split |

### 4.6 Usability (NFR-U)

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-U-01 | Learnability | < 10 min | Core features discoverable |
| NFR-U-02 | Efficiency | < 3 clicks | Common tasks |
| NFR-U-03 | Error messages | Actionable | Clear resolution steps |
| NFR-U-04 | Undo support | All edits | Ctrl+Z everywhere |
| NFR-U-05 | Confirmation dialogs | Destructive only | Don't over-confirm |
| NFR-U-06 | Loading feedback | Always | Skeletons, spinners |
| NFR-U-07 | Empty states | Helpful | Guide next action |
| NFR-U-08 | Onboarding | Soul Discovery | First-run wizard |

### 4.7 Compatibility (NFR-C)

#### 4.7.1 Browser Support

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 90+ | Full |
| Safari | 15+ | Full |
| Edge | 90+ | Full |
| Mobile Safari | 15+ | Full (MVP+1) |
| Chrome Mobile | 90+ | Full (MVP+1) |

#### 4.7.2 Device Support

| Device | Support | Notes |
|--------|---------|-------|
| Desktop (1920x1080+) | Full | Primary target |
| Laptop (1366x768+) | Full | Common resolution |
| Tablet (768x1024+) | Partial | MVP+1 |
| Mobile (375x667+) | Partial | MVP+1 |

#### 4.7.3 File Format Support

| Format | View | Edit | Notes |
|--------|------|------|-------|
| Markdown (.md) | ✅ | ✅ | Primary format |
| PDF (.pdf) | ✅ | ❌ | View only |
| Images (PNG, JPG, GIF, SVG) | ✅ | ❌ | View only |
| Plain text (.txt) | ✅ | ✅ | Basic editing |
| JSON (.json) | ✅ | ✅ | Syntax highlighted |
| YAML (.yaml, .yml) | ✅ | ✅ | Syntax highlighted |

### 4.8 Mobile-Specific NFRs (NFR-MO) - MVP+1

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-MO-01 | Touch targets | 44x44px min | Apple HIG |
| NFR-MO-02 | Swipe gestures | Supported | Navigate, dismiss |
| NFR-MO-03 | Portrait mode | Full support | Primary |
| NFR-MO-04 | Landscape mode | Supported | Secondary |
| NFR-MO-05 | Offline viewing | Cached files | Service worker |
| NFR-MO-06 | PWA install | Supported | Home screen |
| NFR-MO-07 | Push notifications | Optional | Background sync |
| NFR-MO-08 | Battery efficiency | Optimized | Reduce background |
| NFR-MO-09 | Network efficiency | Optimized | Compress, cache |
| NFR-MO-10 | Voice input | Supported | Chat, search |

### 4.9 Observability (NFR-O)

Leveraging NLF Service Catalog for comprehensive observability.

#### 4.9.1 Core Observability Stack

| ID | Requirement | Service | Endpoint |
|----|-------------|---------|----------|
| NFR-O-01 | Structured logging | **Loki** | https://loki.ucontrolnetwork.com |
| NFR-O-02 | Metrics collection | **Prometheus** | https://prometheus.ucontrolnetwork.com |
| NFR-O-03 | Dashboards | **Grafana** | https://grafana.ucontrolnetwork.com |
| NFR-O-04 | Error tracking | **Sentry** | https://sentry.io (NLF org) |
| NFR-O-05 | Uptime monitoring | **Checkmate** | https://checkmate.ucontrolnetwork.com |
| NFR-O-06 | Push alerts | **ntfy** | https://ntfy.sh/the-keep-alerts |
| NFR-O-07 | Alert routing | **Alertmanager** | http://10.0.0.28:2827 |

#### 4.9.2 Sentry Integration (Error Tracking)

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.GIT_SHA,
  tracesSampleRate: 0.1,
  // Scrub sensitive data
  beforeSend(event) {
    // Remove PII, secrets
    return event;
  }
});
```

**Benefits over logs:**
- Stack traces with source maps
- Breadcrumbs (user actions before error)
- Release tracking (which deploy introduced bug)
- Issue grouping and assignment
- Slack/email notifications

#### 4.9.3 Checkmate Integration (External Uptime)

| Monitor | Type | Interval | Endpoint |
|---------|------|----------|----------|
| App Health | HTTP | 60s | `/api/health` |
| AI Service | HTTP | 60s | `/api/health/ready` |
| Background Jobs | Push | On completion | Push token |

Independent external monitoring - detects issues even if container is completely down.

#### 4.9.4 ntfy Integration (Push Notifications)

| Alert | Priority | Topic |
|-------|----------|-------|
| App down | urgent | `the-keep-alerts` |
| Error rate > 5% | high | `the-keep-alerts` |
| AI service degraded | default | `the-keep-alerts` |
| Daily health summary | low | `the-keep-alerts` |

```bash
# Alert example
curl -H "Title: The Keep Alert" \
     -H "Priority: high" \
     -H "Tags: warning" \
     -d "Error rate exceeded 5% threshold" \
     ntfy.sh/the-keep-alerts
```

Subscribe via ntfy mobile app for instant push notifications.

#### 4.9.5 Key Metrics to Track

| Metric | Type | Alert Threshold | Route To |
|--------|------|-----------------|----------|
| Response time (P95) | Latency | > 3s | Grafana |
| Error rate | Errors | > 1% | Sentry + ntfy |
| AI latency (P95) | Latency | > 5s | Grafana |
| Memory usage | Resource | > 80% | ntfy |
| Disk usage | Resource | > 85% | ntfy |
| Uptime | Availability | < 99% | Checkmate → ntfy |
| Sentry issues | Errors | New P0 | Sentry → Slack |

### 4.10 Backup & Recovery (NFR-BR)

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-BR-01 | File versioning | Last 50 versions | Per file |
| NFR-BR-02 | Database backup | Daily | Automated |
| NFR-BR-03 | File backup | Daily | MinIO sync |
| NFR-BR-04 | Recovery time | < 1 hour | Full restore |
| NFR-BR-05 | Recovery point | < 24 hours | Maximum data loss |
| NFR-BR-06 | Export capability | On-demand | ZIP download |
| NFR-BR-07 | Soft delete | 30 days | Recoverable |

### 4.11 Maintainability (NFR-M)

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-M-01 | Code structure | Component-based, clear separation |
| NFR-M-02 | TypeScript | Strict mode, full typing |
| NFR-M-03 | Test coverage | 80%+ for core logic |
| NFR-M-04 | Documentation | JSDoc + README per module |
| NFR-M-05 | Dependency updates | Monthly review |
| NFR-M-06 | Code review | Required for merge |
| NFR-M-07 | CI/CD | Automated build, test, deploy |
| NFR-M-08 | Feature flags | For gradual rollout |

### 4.12 Health & Self-Healing (NFR-H)

Built-in reliability mechanisms for automatic recovery.

#### 4.12.1 Health Check Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/api/health` | Overall app health | `{ status, checks, uptime }` |
| `/api/health/live` | Liveness (is process running?) | `200 OK` or `503` |
| `/api/health/ready` | Readiness (can accept traffic?) | `200` with dependency status |

**Health Response Format:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "uptime": 86400,
  "checks": {
    "database": { "status": "up", "latency": 5 },
    "redis": { "status": "up", "latency": 2 },
    "minio": { "status": "up", "latency": 15 },
    "litellm": { "status": "down", "error": "timeout" }
  },
  "degradedFeatures": ["ai_chat"]
}
```

#### 4.12.2 Dependency Health Probes

| ID | Service | Check | Interval | Timeout | Failure Threshold |
|----|---------|-------|----------|---------|-------------------|
| NFR-H-01 | PostgreSQL | `SELECT 1` | 30s | 5s | 3 consecutive |
| NFR-H-02 | Redis | `PING` | 10s | 2s | 3 consecutive |
| NFR-H-03 | MinIO | `HeadBucket` | 60s | 10s | 2 consecutive |
| NFR-H-04 | LiteLLM | `GET /health` | 30s | 5s | 2 consecutive |

#### 4.12.3 Container Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health/live || exit 1
```

Docker Compose restart policy: `restart: unless-stopped`

#### 4.12.4 Circuit Breakers

| ID | Service | Open After | Half-Open After | Close After |
|----|---------|------------|-----------------|-------------|
| NFR-H-10 | LiteLLM | 3 failures | 30s | 2 successes |
| NFR-H-11 | MinIO | 3 failures | 60s | 2 successes |
| NFR-H-12 | External APIs | 5 failures | 60s | 3 successes |

**States:**
- **Closed:** Normal operation, requests pass through
- **Open:** Requests fail-fast, don't hit dead service
- **Half-Open:** Allow 1 test request, check if recovered

#### 4.12.5 Self-Healing Mechanisms

| ID | Mechanism | Trigger | Action |
|----|-----------|---------|--------|
| NFR-H-20 | Auto-reconnect | DB connection lost | Exponential backoff retry (1s, 2s, 4s, 8s, max 30s) |
| NFR-H-21 | Connection pooling | High load | Pool manages connections, queues excess |
| NFR-H-22 | Cache fallback | MinIO unavailable | Serve from local/Redis cache |
| NFR-H-23 | Graceful degradation | LiteLLM down | Disable AI features, show banner |
| NFR-H-24 | Memory pressure | Heap > 80% | Trigger GC, evict caches |
| NFR-H-25 | Watchdog | Main loop frozen | Process restart via container |
| NFR-H-26 | Stale-while-revalidate | Slow backend | Serve cached data, refresh async |

#### 4.12.6 Retry Policies

| Operation | Max Retries | Backoff | Timeout |
|-----------|-------------|---------|---------|
| DB query | 3 | Exponential (100ms base) | 5s |
| File upload | 3 | Linear (1s) | 30s |
| AI request | 2 | None (fail fast) | 60s |
| Cache read | 1 | None | 500ms |

#### 4.12.7 Graceful Degradation Matrix

| Dependency Down | Affected Features | Fallback Behavior |
|-----------------|-------------------|-------------------|
| PostgreSQL | All | App unavailable (critical) |
| Redis | Memory hot cache | Query PostgreSQL directly |
| MinIO | File read/write | Serve from cache, queue writes |
| LiteLLM | AI chat, AI editing | Banner: "AI temporarily unavailable" |
| Traefik | External access | Direct IP access still works |

#### 4.12.8 Health Dashboard Integration

| Metric | Grafana Panel | Alert |
|--------|---------------|-------|
| Health check status | Status map | Any service unhealthy > 1 min |
| Circuit breaker state | State indicator | Any circuit open |
| Retry rate | Time series | > 10 retries/min |
| Degraded features | List | Any feature degraded |
| Error rate | Time series | > 1% errors |

### 4.13 Logging & Diagnostics (NFR-L)

Structured logging for troubleshooting and debugging.

#### 4.13.1 Log Format (Structured JSON)

```json
{
  "timestamp": "2026-03-22T15:30:45.123Z",
  "level": "error",
  "service": "the-keep",
  "traceId": "abc123-def456",
  "spanId": "span-789",
  "userId": "user-1",
  "projectId": "proj-health",
  "message": "Failed to save file",
  "error": {
    "name": "MinIOError",
    "message": "Connection refused",
    "stack": "..."
  },
  "context": {
    "fileId": "file-123",
    "filePath": "/docs/notes.md",
    "operation": "PUT",
    "duration": 5023
  }
}
```

#### 4.13.2 Log Levels

| Level | When to Use | Examples |
|-------|-------------|----------|
| **error** | Something failed that shouldn't | DB connection lost, unhandled exception |
| **warn** | Recoverable issue, potential problem | Retry succeeded, cache miss, rate limited |
| **info** | Normal operations worth noting | User action, file saved, AI request |
| **debug** | Detailed troubleshooting | Query params, response sizes, timings |
| **trace** | Very verbose, dev only | Function entry/exit, intermediate state |

**Production default:** `info`
**Debug mode:** `debug`

#### 4.13.3 Correlation & Tracing

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-L-01 | Request tracing | `X-Trace-ID` header, propagated to all services |
| NFR-L-02 | Span tracking | Parent-child spans for nested operations |
| NFR-L-03 | User correlation | `userId` on all authenticated requests |
| NFR-L-04 | Session tracking | `sessionId` for multi-request flows |
| NFR-L-05 | AI conversation ID | Track full chat thread |

**Trace ID Flow:**
```
Browser → Next.js API → PostgreSQL
    ↘ Redis
    ↘ MinIO
    ↘ LiteLLM
All logs share same traceId for request correlation
```

#### 4.13.4 What to Log

| Category | Log Level | Fields |
|----------|-----------|--------|
| **HTTP Requests** | info | method, path, status, duration, userId |
| **HTTP Errors** | error | + error details, request body (sanitized) |
| **Database Queries** | debug | query type, table, duration, rows affected |
| **Database Errors** | error | + query, error code, message |
| **AI Requests** | info | model, prompt tokens, completion tokens, duration |
| **AI Errors** | error | + error type, retry count |
| **File Operations** | info | operation, path, size, duration |
| **Auth Events** | info | login, logout, session refresh |
| **Health Checks** | debug | dependency status, latencies |
| **Circuit Breaker** | warn | state change (open/close), service |

#### 4.13.5 Sensitive Data Handling

| Data Type | Treatment |
|-----------|-----------|
| Passwords | Never log |
| API keys | Never log |
| File contents | Never log (log path only) |
| AI prompts | Log token count, not content |
| AI responses | Log token count, not content |
| User PII | Redact or hash |
| Memory values | Never log content |

**Sanitization Example:**
```json
{
  "message": "AI request completed",
  "context": {
    "model": "jarvis-chat",
    "promptTokens": 1250,
    "completionTokens": 430,
    "duration": 2340,
    "prompt": "[REDACTED: 1250 tokens]"
  }
}
```

#### 4.13.6 Error Context

Errors should include enough context to reproduce:

```json
{
  "level": "error",
  "message": "Failed to render markdown",
  "error": {
    "name": "RenderError",
    "message": "Invalid frontmatter YAML",
    "code": "YAML_PARSE_ERROR"
  },
  "context": {
    "fileId": "file-abc",
    "filePath": "/notes/todo.md",
    "line": 3,
    "column": 5,
    "snippet": "date: invalid-date-format"
  },
  "resolution": "Check YAML syntax in frontmatter"
}
```

#### 4.13.7 Log Destinations

| Environment | Destination | Retention |
|-------------|-------------|-----------|
| Development | Console (pretty) | Session |
| Production | Loki (JSON) | 30 days |
| Production | File backup | 7 days local |

#### 4.13.8 Log Aggregation (Loki)

| Label | Purpose |
|-------|---------|
| `app=the-keep` | Filter to this application |
| `env=dev|prod` | Environment |
| `level=error|warn|info` | Severity filtering |
| `traceId` | Request correlation |
| `userId` | User activity |

**Useful LogQL Queries:**
```logql
# All errors in last hour
{app="the-keep"} |= "error" | json

# Slow AI requests (> 5s)
{app="the-keep"} | json | context_duration > 5000 | line_format "{{.message}}"

# Specific trace
{app="the-keep"} | json | traceId="abc123"

# User activity
{app="the-keep"} | json | userId="user-1"
```

#### 4.13.9 Debug Mode

| ID | Feature | Activation |
|----|---------|------------|
| NFR-L-20 | Verbose logging | `DEBUG=true` env var |
| NFR-L-21 | Query logging | `LOG_QUERIES=true` |
| NFR-L-22 | AI prompt logging | `LOG_AI_PROMPTS=true` (dev only!) |
| NFR-L-23 | Performance timing | `LOG_TIMING=true` |
| NFR-L-24 | Request body logging | `LOG_BODIES=true` (sanitized) |

#### 4.13.10 Diagnostic Endpoints (Admin Only)

| Endpoint | Purpose |
|----------|---------|
| `/api/debug/config` | Current config (sanitized) |
| `/api/debug/connections` | DB/Redis pool status |
| `/api/debug/cache` | Cache hit rates, sizes |
| `/api/debug/metrics` | Prometheus metrics (raw) |

**Security:** These endpoints require admin auth and are disabled in production by default.

### 4.14 Autonomous Operations (NFR-AO)

Maximize autonomous troubleshooting and self-repair to minimize human intervention.

#### 4.14.1 Design Philosophy

> **Goal:** Claude (or any AI assistant) should be able to diagnose and fix 90% of issues autonomously, only escalating to the user when human judgment is required.

| Principle | Implementation |
|-----------|----------------|
| **Self-documenting** | Every error includes enough context to diagnose |
| **Self-healing** | Common failures auto-recover without alerts |
| **Pre-emptive** | Detect issues before they become failures |
| **Actionable** | Alerts include specific fix steps, not just "something broke" |
| **Traceable** | Full request flow visible for any issue |

#### 4.14.2 Common Failure Auto-Recovery

| Failure | Detection | Auto-Recovery | Escalate If |
|---------|-----------|---------------|-------------|
| DB connection lost | Health probe | Reconnect with backoff | 5 retries fail |
| Redis unavailable | Health probe | Fallback to PostgreSQL | - (silent degrade) |
| MinIO timeout | Request timeout | Retry + serve cache | Write queue > 100 |
| LiteLLM down | Health probe | Disable AI, show banner | - (expected degrade) |
| Memory > 80% | Metrics | Clear caches, hint GC | Memory > 95% |
| Disk > 85% | Metrics | Prune old versions | Disk > 95% |
| Container restart | Docker | Auto-restart | 3 restarts in 5 min |
| SSL cert expiring | Cron check | Alert 14 days before | - |

#### 4.14.3 Diagnostic Context for AI Troubleshooting

When an error occurs, provide Claude enough context to diagnose:

```json
{
  "error": {
    "type": "DATABASE_CONNECTION_FAILED",
    "message": "Connection refused to PostgreSQL",
    "timestamp": "2026-03-22T15:30:45Z",
    "traceId": "abc123"
  },
  "diagnosticContext": {
    "recentLogs": ["[last 20 relevant log lines]"],
    "healthStatus": {
      "postgres": "down",
      "redis": "up",
      "minio": "up"
    },
    "containerStatus": "running",
    "lastSuccessful": "2026-03-22T15:28:00Z",
    "failureCount": 5,
    "networkReachable": false
  },
  "suggestedActions": [
    "Check if PostgreSQL container is running: docker ps | grep postgres",
    "Check PostgreSQL logs: docker logs the-keep-postgres",
    "Verify network: ping 10.0.0.33",
    "Restart stack: docker compose restart"
  ],
  "runbookUrl": "/docs/runbooks/database-connection.md"
}
```

#### 4.14.4 Built-in Runbooks

| Issue | Runbook | Auto-Applicable |
|-------|---------|-----------------|
| Database connection | `/docs/runbooks/db-connection.md` | Partial |
| AI service down | `/docs/runbooks/ai-fallback.md` | Yes |
| File upload failing | `/docs/runbooks/file-upload.md` | Partial |
| High memory usage | `/docs/runbooks/memory-pressure.md` | Yes |
| Slow queries | `/docs/runbooks/slow-queries.md` | No |
| Auth failures | `/docs/runbooks/auth-issues.md` | No |

**Runbook Format:**
```markdown
# Database Connection Issues

## Symptoms
- Health check shows postgres: down
- Queries timeout
- Error: "Connection refused"

## Automated Checks (Claude can run these)
1. `docker ps | grep postgres` - Is container running?
2. `docker logs the-keep-postgres --tail 50` - Recent errors?
3. `pg_isready -h localhost` - Is PostgreSQL accepting connections?

## Resolution Steps
### If container not running:
\`\`\`bash
docker compose up -d postgres
\`\`\`

### If container running but not accepting connections:
\`\`\`bash
docker compose restart postgres
\`\`\`

### If persistent failure:
Check disk space, memory, and pg_hba.conf
```

#### 4.14.5 Pre-emptive Monitoring

| Metric | Warning | Critical | Auto-Action |
|--------|---------|----------|-------------|
| Memory usage | 70% | 85% | Clear caches at 70%, restart at 95% |
| Disk usage | 75% | 90% | Prune versions at 75%, alert at 90% |
| Error rate | 1%/min | 5%/min | Log analysis at 1%, alert at 5% |
| Response time P95 | 3s | 10s | Log slow queries at 3s |
| Queue depth | 50 | 200 | Scale warning at 50 |
| SSL cert expiry | 14 days | 3 days | Alert at 14 days |
| DB connections | 80% pool | 95% pool | Log at 80%, reject new at 95% |

#### 4.14.6 Intelligent Alerts

Alerts should be actionable, not just informational:

**Bad Alert:**
> "Error rate increased"

**Good Alert:**
> "Error rate increased to 3.2% (normal: <1%)
>
> **Primary cause:** 47 of 52 errors are `MINIO_TIMEOUT`
>
> **Suggested actions:**
> 1. Check MinIO health: `curl http://helicarrier:9000/minio/health/live`
> 2. Check network: `ping helicarrier`
> 3. View recent errors: `{app="the-keep"} |= "MINIO_TIMEOUT" | json`
>
> **Auto-recovery status:** Circuit breaker OPEN, serving from cache"

#### 4.14.7 CLI Diagnostic Commands

For Claude to run when troubleshooting:

```bash
# Overall system status
curl http://localhost:3000/api/health | jq

# Recent errors
docker logs the-keep-app --tail 100 | grep -i error

# Database status
docker exec the-keep-postgres pg_isready

# Check connections
docker exec the-keep-app curl -s localhost:3000/api/debug/connections

# Memory/CPU
docker stats the-keep-app --no-stream

# Disk usage
df -h /var/lib/docker

# Network to dependencies
for host in postgres redis minio litellm; do
  echo "$host: $(ping -c1 $host 2>/dev/null && echo 'reachable' || echo 'unreachable')"
done
```

#### 4.14.8 Error Budget & Auto-Scaling

| Scenario | Threshold | Action |
|----------|-----------|--------|
| Error budget consumed | 50% monthly | Yellow alert |
| Error budget consumed | 80% monthly | Feature freeze suggestion |
| Error budget consumed | 100% monthly | Incident declared |
| Sustained high load | CPU > 80% for 5 min | Scale-up suggestion |
| Memory leak detected | Growth > 10MB/hour | Container restart scheduled |

#### 4.14.9 Post-Incident Auto-Analysis

After any incident (error rate > 5% for > 5 min):

1. **Auto-generate timeline** from logs
2. **Identify root cause** (most common error)
3. **Calculate impact** (affected requests, duration)
4. **Suggest prevention** (if pattern matches known issues)
5. **Create draft post-mortem** for review

```json
{
  "incident": {
    "id": "INC-2026-03-22-001",
    "duration": "12 minutes",
    "impact": "342 failed requests, AI chat unavailable",
    "rootCause": "LiteLLM service OOM killed",
    "timeline": [
      "15:30:00 - LiteLLM health check failed",
      "15:30:30 - Circuit breaker opened",
      "15:31:00 - AI features disabled",
      "15:42:00 - LiteLLM container restarted",
      "15:42:30 - Health check passed, features restored"
    ],
    "prevention": "Increase LiteLLM memory limit from 4GB to 8GB"
  }
}
```

---

## 5. Technical Specifications

### 5.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14+ (App Router) | SSR, API routes, React Server Components |
| **Panel System** | dockview | VS Code-style docking, well-maintained |
| **UI Components** | shadcn/ui + Tailwind CSS | Accessible, customizable, fast |
| **Markdown Editor** | Monaco Editor or Milkdown | Rich editing with toolbar |
| **PDF Viewer** | PDF.js / react-pdf | Industry standard |
| **State Management** | Zustand | Simple, performant, no boilerplate |
| **File Storage** | MinIO (S3-compatible) | Existing infrastructure |
| **Database** | PostgreSQL + pgvector | Metadata, vectors, relationships |
| **AI Backend** | LiteLLM Proxy | Multi-model support, existing |
| **Deployment** | Docker Compose | Standard NLF pattern |

### 5.2 Infrastructure

| Component | Location | Details |
|-----------|----------|---------|
| **Development** | Banner (10.0.0.33) | Port 5010 |
| **Production** | Hulk (10.0.0.32) | TBD |
| **Domain** | the-keep.nextlevelguild.com | Via Traefik |
| **LiteLLM** | 10.0.0.27:2764 | AI model proxy |
| **MinIO** | Helicarrier | S3 storage |
| **PostgreSQL** | Per-service container | Bundled in stack |

### 5.3 Available AI Models (via LiteLLM)

| Model | Use Case |
|-------|----------|
| jarvis-chat | General conversation |
| jarvis-qwen72b | Complex reasoning |
| (others) | Per LiteLLM configuration |

### 5.4 API Design

**REST API Endpoints (Draft):**

```
/api/projects
  GET    - List all projects
  POST   - Create project

/api/projects/:id
  GET    - Get project details
  PUT    - Update project
  DELETE - Delete project

/api/projects/:id/files
  GET    - List files (tree structure)
  POST   - Upload file(s)

/api/projects/:id/files/:path
  GET    - Get file content
  PUT    - Update file
  DELETE - Delete file

/api/projects/:id/chat
  GET    - List conversations
  POST   - Start new conversation

/api/projects/:id/chat/:convId
  GET    - Get conversation history
  POST   - Send message (streaming response)

/api/projects/:id/search
  POST   - RAG search with query

/api/projects/:id/knowledge
  GET    - List personal knowledge items
  POST   - Create knowledge item
  PUT    - Update knowledge item
```

---

## 6. User Interface Specifications

### 6.1 Layout Structure

```
+--+-----------------------------------------------------------+
|  |  Header: [Logo] [Project Dropdown] [Cmd+K] [Settings]     |
|  +------------------+----------------------------------------+
|  |                  |  Tab Bar: [file1.md x] [file2.pdf x]   |
|A |  File Browser    +----------------------------------------+
|c |                  |                                        |
|t |  - Folders       |  Content Area (dockview)               |
|i |  - Files         |  - Editors                              |
|v |                  |  - Viewers                              |
|i |                  |  - AI Chat                              |
|t |                  |  - Embedded Views                       |
|y |                  |                                        |
|  |                  |                                        |
|B |                  |                                        |
|a |  [+ New] [Upload]|                                        |
|r |                  |                                        |
+--+------------------+----------------------------------------+
```

### 6.2 Activity Bar Icons

| Icon | Function |
|------|----------|
| (Project Icons) | Switch between projects |
| Search | Global search / command palette |
| Settings | Application settings |

### 6.3 Panel Types

| Panel Type | Description |
|------------|-------------|
| File Viewer | Read-only view of file content |
| Markdown Editor | Edit markdown with toolbar |
| AI Chat | Conversation with AI assistant |
| PDF Viewer | PDF with zoom and navigation |
| Image Viewer | Image with zoom |
| Embedded Browser | External URL in iframe |
| Knowledge Editor | Edit personal profiles/inventories |

---

## 7. Data Models

### 7.1 Project

```typescript
interface Project {
  id: string;
  name: string;
  icon: string;  // emoji or icon name
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
}

interface ProjectSettings {
  defaultModel: string;
  ragEnabled: boolean;
  layout?: LayoutState;
}
```

### 7.2 File

```typescript
interface FileMetadata {
  id: string;
  projectId: string;
  path: string;  // relative path within project
  name: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  ragIndexed: boolean;
  ragExcluded: boolean;
}
```

### 7.3 Conversation

```typescript
interface Conversation {
  id: string;
  projectId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  contextFiles: string[];  // file IDs
  model: string;
  mode: 'normal' | 'incognito' | 'readonly';  // NEW: conversation mode
  writeToProject?: string;  // NEW: override which project to write memories to
}

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  citations?: Citation[];  // NEW: source references
}

interface Citation {
  sourceType: 'file' | 'memory' | 'web';
  sourceRef: string;  // file path, memory ID, or URL
  excerpt?: string;
  lineNumber?: number;
}
```

### 7.4 Personal Knowledge

```typescript
interface KnowledgeItem {
  id: string;
  projectId: string;
  type: 'inventory' | 'profile' | 'preference';
  category: string;  // e.g., 'kitchen', 'health', 'food', 'garden'
  name: string;
  data: Record<string, any>;  // flexible structured data
  createdAt: Date;
  updatedAt: Date;
}

// Example: Pantry inventory
{
  type: 'inventory',
  category: 'kitchen',
  name: 'Pantry Items',
  data: {
    items: [
      { name: 'Rice', quantity: '2 lbs', expiry: '2026-12-01' },
      { name: 'Olive Oil', quantity: '1 bottle', expiry: '2027-03-15' }
    ]
  }
}

// Example: Garden inventory - AI knows "cucumbers" = your specific varieties
{
  type: 'inventory',
  category: 'garden',
  name: 'Planted Items 2026',
  data: {
    items: [
      { name: 'Bush Cucumbers', variety: 'Spacemaster', location: 'Raised Bed A', planted: '2026-04-15' },
      { name: 'Slicing Cucumbers', variety: 'Marketmore', location: 'Raised Bed B', planted: '2026-04-15' },
      { name: 'Tomatoes', variety: 'Cherokee Purple', location: 'Container 1', planted: '2026-04-01' }
    ],
    locations: ['Raised Bed A', 'Raised Bed B', 'Container 1', 'Container 2']
  }
}

// Example: Health profile
{
  type: 'profile',
  category: 'health',
  name: 'Dietary Restrictions',
  data: {
    allergies: ['shellfish'],
    restrictions: ['low-sodium'],
    preferences: ['Mediterranean diet']
  }
}
```

### 7.5 Atomic Memory (with Provenance)

```typescript
interface Memory {
  id: string;
  projectId: string;

  // What
  category: string;      // 'health', 'food', 'garden', 'equipment'
  subject: string;       // 'me', 'mom', 'house', 'garden-2026'
  key: string;           // 'weight', 'dislikes', 'planted'
  value: string;
  unit?: string;
  tags?: string[];       // additional classification

  // Provenance - WHERE did this come from
  sourceType: 'user_edit' | 'file_extraction' | 'conversation' | 'inferred';
  sourceRef: string;     // 'file:labs/2026-03.pdf#page2' or 'conv:abc123:msg45'
  confidence: 'high' | 'medium' | 'low';

  // Timeline
  learnedAt: Date;
  lastVerified?: Date;   // when user confirmed this is still true

  // History
  supersedes?: string;   // ID of memory this replaced
  supersededBy?: string; // ID of memory that replaced this

  // Status & Lifecycle (see Section 13.2)
  status: 'active' | 'archived' | 'trash';  // User-facing state
  tier: 'hot' | 'warm' | 'cold';            // Relevance tier (only when status='active')
  score: number;                             // Aggregated relevance (1-10)
  lastUsed?: Date;                           // Last AI reference
  useCount: number;                          // Times used in context

  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;     // When user archived (NULL = not archived)
  trashedAt?: Date;      // When moved to trash (NULL = not trashed, 30-day purge)
}

// Example: Memory with full provenance
{
  id: 'mem_123',
  projectId: 'proj_health',
  category: 'health',
  subject: 'me',
  key: 'weight',
  value: '178',
  unit: 'lbs',
  tags: ['biometrics', 'tracked'],

  sourceType: 'file_extraction',
  sourceRef: 'file:labs/2026-03-bloodwork.pdf#page1',
  confidence: 'high',

  learnedAt: '2026-03-15T10:00:00Z',
  lastVerified: '2026-03-20T14:30:00Z',

  supersedes: 'mem_098',  // replaced older weight measurement
}

// Example: Memory about someone else (mom's health in separate project)
{
  id: 'mem_456',
  projectId: 'proj_mom_health',  // SEPARATE project
  category: 'health',
  subject: 'mom',
  key: 'medication',
  value: 'Lisinopril 10mg',
  tags: ['blood-pressure', 'daily'],

  sourceType: 'conversation',
  sourceRef: 'conv:xyz789:msg12',
  confidence: 'high',
}
```

### 7.6 Trusted Source

```typescript
interface TrustedSource {
  id: string;
  projectId: string;
  name: string;           // 'Andrew Huberman', 'Peter Attia'
  type: 'person' | 'publication' | 'organization';

  // Domain expertise ratings (1-10)
  domainRatings: {
    [domain: string]: number;  // 'sleep': 9, 'supplements': 8
  };

  // Metadata
  notes?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example
{
  id: 'src_001',
  projectId: 'proj_health',
  name: 'Andrew Huberman',
  type: 'person',
  domainRatings: {
    'sleep': 9,
    'supplements': 8,
    'neuroscience': 9,
    'exercise': 7
  },
  notes: 'Stanford professor, Huberman Lab podcast',
  url: 'https://hubermanlab.com'
}
```

### 7.7 Derived View

```typescript
interface DerivedView {
  id: string;
  projectId: string;
  name: string;           // 'Pill Box Layout'
  template: string;       // template identifier

  // Source tracking
  sourceFiles: string[];  // files this view is derived from
  sourceMemories: string[]; // memory categories used

  // Generation info
  generatedAt: Date;
  generatedContent: string;  // the actual view content

  // Staleness
  sourcesChangedSince: boolean;  // true if any source updated after generation
}
```

### 7.8 Import Job

```typescript
interface ImportJob {
  id: string;
  projectId: string;
  status: 'pending' | 'auditing' | 'processing' | 'complete' | 'failed';

  // Source
  sourcePath: string;     // original path or zip name

  // Audit results
  auditResults: {
    totalFiles: number;
    byType: Record<string, number>;  // 'markdown': 45, 'pdf': 12
    needsCleanup: number;
    duplicates: number;
    warnings: string[];
  };

  // Processing options (user-configured)
  options: {
    cleanupMarkdown: boolean;
    extractPdfText: boolean;
    processScreenshots: boolean;
    createCompanions: boolean;
    skipDuplicates: boolean;
  };

  // Progress
  processedFiles: number;
  failedFiles: number;

  // Log
  log: ImportLogEntry[];

  createdAt: Date;
  completedAt?: Date;
}

interface ImportLogEntry {
  timestamp: Date;
  file: string;
  action: 'imported' | 'cleaned' | 'extracted' | 'companion_created' | 'skipped' | 'failed';
  details?: string;
}
```

### 7.9 File Version

```typescript
interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;

  // Content snapshot
  contentHash: string;    // hash of content at this version
  storageRef: string;     // reference to stored content
  size: number;

  // Change context
  changedBy: 'user' | 'ai';
  changeType: 'create' | 'edit' | 'ai_edit' | 'import';
  changeSummary?: string;  // "AI removed line 8: Fish Oil"

  createdAt: Date;
}
```

### 7.10 Memory Version

Track changes to memory values for revert capability.

```typescript
interface MemoryVersion {
  id: string;
  memoryId: string;
  versionNumber: number;

  // Snapshot of memory state at this version
  value: string;
  unit?: string;
  status: 'active' | 'archived' | 'trash';
  tier: 'hot' | 'warm' | 'cold';

  // Change context
  changedBy: 'user' | 'ai' | 'system';
  changeType: 'create' | 'edit' | 'status_change' | 'tier_change' | 'restore';
  changeSummary?: string;  // "Changed from 180 to 175"
  previousValue?: string;  // Quick reference to old value

  createdAt: Date;
}
```

**Use Cases:**
- User edits memory value → new version created
- AI updates memory → new version with `changedBy: 'ai'`
- User archives memory → version with `changeType: 'status_change'`
- User wants to revert → restore from previous version

### 7.11 Tagged Item (MVP+2)

```typescript
interface TaggedItem {
  id: string;
  projectId: string;

  // Source location
  fileId: string;
  lineNumber: number;
  lineContent: string;    // the line containing the tag

  // Parsed tag info
  tagType: 'due' | 'reminder' | 'action' | 'priority' | 'context' | 'custom';
  tagRaw: string;         // '#due:2026-04-15'
  tagValue: string;       // '2026-04-15'

  // Parsed date (if applicable)
  dueDate?: Date;

  // Status
  completed: boolean;
  completedAt?: Date;

  // Indexing
  indexedAt: Date;
  lastChecked: Date;      // last time cron verified this still exists
}
```

### 7.12 Task (MVP+2)

```typescript
interface Task {
  id: string;
  projectId: string;

  // Source
  fileId: string;
  lineNumber: number;

  // Content
  content: string;        // task text without checkbox
  parentTaskId?: string;  // for nested tasks
  depth: number;          // indentation level

  // Status
  completed: boolean;
  completedAt?: Date;

  // Due date (if tagged)
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';

  // Metadata
  extractedFrom?: 'conversation' | 'file';  // how it was created
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.13 Notification (MVP+2)

```typescript
interface Notification {
  id: string;
  projectId: string;
  userId: string;

  // Type
  type: 'due_date' | 'reminder' | 'ai_suggestion' | 'system';

  // Content
  title: string;
  message: string;

  // Reference
  sourceType?: 'task' | 'tagged_item' | 'memory' | 'file';
  sourceId?: string;

  // Status
  read: boolean;
  dismissed: boolean;

  // Timing
  triggerAt: Date;        // when notification should appear
  createdAt: Date;
  readAt?: Date;
}
```

### 7.14 AI Feedback

```typescript
interface AIFeedback {
  id: string;
  projectId: string;
  conversationId: string;
  messageId: string;

  // Rating
  rating: 1 | 2 | 3 | 4 | 5;

  // Clarification (for low ratings)
  feedbackText?: string;

  // Correction tracking
  wasCorrection: boolean;  // user said "that's wrong"
  correctionType?: 'factual' | 'format' | 'irrelevant' | 'incomplete';

  // Context
  queryText: string;       // what user asked
  responseText: string;    // what AI said
  model: string;           // which model was used

  createdAt: Date;
}
```

### 7.15 Cross-Project Request (MVP+3)

```typescript
interface CrossProjectRequest {
  id: string;

  // Source (requesting project)
  sourceProjectId: string;
  sourceProjectName: string;
  sourceConversationId?: string;  // context where request originated

  // Target (receiving project)
  targetProjectId: string;

  // Request details
  requestType: 'memory_update' | 'memory_create' | 'memory_delete' | 'file_update';
  subject: string;           // "Update allergy status for shellfish"
  context: string;           // "User ate shellfish on 2026-03-22"
  proposedChange: {
    field: string;           // which memory/file
    oldValue?: string;
    newValue: string;
  };

  // Status
  status: 'pending' | 'approved' | 'denied' | 'expired';
  reviewedAt?: Date;
  reviewNote?: string;       // user can add note when approving/denying

  // Lifecycle
  createdAt: Date;
  expiresAt: Date;           // requests expire after 30 days if not reviewed
}
```

---

## 8. Out of Scope (v1)

These features are explicitly deferred to future versions:

### v2: OCR & Ingestion
- OCR text extraction from PDFs and images
- Medical document parsing
- Scanned document support
- Auto-indexing pipeline

### v3: AI Artifacts
- Interactive artifact generation (charts, diagrams)
- Rich output storage
- Artifact as project assets

### Future Roadmap
- Multi-user support (MVP+4) - multiple users per project, separate user projects
- Real-time collaboration (v3)
- Public sharing
- Audio/video transcription
- Offline capability (requires significant architecture changes)
- Extension marketplace
- Advanced AI personas (beyond 5 core - custom persona builder)

---

## 9. Open Questions

| # | Question | Status | Notes |
|---|----------|--------|-------|
| 1 | **RAG Backend:** Dify API vs custom pgvector? | Open | Architecture decision |
| 2 | **PDF Text Extraction:** How to extract for RAG without OCR? | Open | pdf.js text layer? |
| 3 | **Auth:** Authentik integration or simpler for v1? | Open | Single user may be simpler |
| 4 | **Personal Knowledge Storage:** Files vs structured DB? | Decided | PostgreSQL DB, serialize to text for AI context |
| 5 | **Memory Extraction:** Manual only or AI-assisted? | Open | P2 feature, can defer |
| 6 | **Dify Procedure Sync:** Which is source of truth? | Open | Procedures.md vs Dify workflows |
| 7 | **Context File Versioning:** Track changes to .keep/ files? | Open | Git-like history? |
| 8 | **Cross-Project Queries:** How to read from multiple projects? | Scoped | MVP+2: query routing + citations; MVP+3: project linking |
| 9 | **Web Search Provider:** Which API for web search integration? | Open | Tavily, SerpAPI, direct? |
| 10 | **Template Library:** Ship with project-type templates? | Open | Health, Finance, Learning, Garden |
| 11 | **Acceptance Criteria Format:** Define ACs in PRD or in sprint stories? | Decided | ACs defined during sprint planning in story files |
| 12 | **QA Review:** Murat to review FRs and planned test cases | Pending | Schedule review before Sprint 1 |

---

## 10. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| dockview complexity | High | Medium | Start with simple layout, add features incrementally |
| RAG performance with many files | Medium | Medium | Implement pagination, optimize queries |
| LiteLLM availability | High | Low | Graceful degradation, error handling |
| Scope creep | High | High | Strict v1 scope, defer to roadmap |
| PDF rendering edge cases | Medium | Medium | Test variety of PDFs early |
| AI file editing reliability | High | Medium | Diff preview, undo capability, test extensively |
| Memory provenance complexity | Medium | Medium | Start simple (source type + ref), expand later |
| Template consistency | Medium | Low | Define template markers, test preservation |

---

## 11. Milestones (Proposed)

| Phase | Features | Success Criteria |
|-------|----------|------------------|
| **Phase 1: Shell** | dockview, file browser, project switching, .keep/ structure | Can create project with Soul Discovery, upload files, view in panels |
| **Phase 2: Viewing** | Markdown render, PDF view, image view, soft delete | All v1 file types display correctly, trash works |
| **Phase 3: Editing** | Markdown editor with toolbar, AI file editing | Can create/edit files, AI can edit in place |
| **Phase 4: AI Chat** | Chat tab, context awareness, model selection, citations, conversation modes | Can ask AI about files with source citations, incognito mode works |
| **Phase 5: RAG** | Indexing, semantic search, RAG queries | Can search across project knowledge base |
| **Phase 6: Personal Knowledge** | Inventories, profiles, atomic memories with provenance | AI uses personal data, provenance tracked, memory audit works |
| **Phase 7: Trust & Views** | Trusted sources, derived views, web search | Expert perspectives work, recurring reports consistent |

---

## 12. Appendix

### A. References

- **Product Brief:** `docs/planning-artifacts/product-brief.md`
- **Project Context System:** `docs/planning-artifacts/project-context-system.md`
- **Roadmap:** `docs/planning-artifacts/roadmap.md`
- **dockview Documentation:** https://dockview.dev/
- **shadcn/ui:** https://ui.shadcn.com/
- **LiteLLM:** Internal proxy at 10.0.0.27:2764
- **OpenClaw Workspace Files:** https://docs.openclaw.ai/concepts/agent-workspace

### B. Glossary

| Term | Definition |
|------|------------|
| **dockview** | React library for VS Code-style panel management |
| **RAG** | Retrieval-Augmented Generation - enhancing AI with document retrieval |
| **pgvector** | PostgreSQL extension for vector similarity search |
| **LiteLLM** | Proxy server for multiple AI model providers |
| **Knowledge Graph** | Network of interconnected documents and concepts |
| **Atomic Memory** | Single-fact memory with provenance tracking (vs opaque blobs) |
| **Derived View** | Report generated from source files, not AI memory |
| **Project Soul** | .keep/SOUL.md - defines project purpose and AI personality |
| **Guardrails** | .keep/GUARDRAILS.md - explicit never-dos and safety rules |
| **Memory Provenance** | Tracking where each fact was learned (file, conversation, user edit) |
| **Incognito Mode** | Conversation mode where AI reads but doesn't write memories |

### C. Obsidian Plugin Inspirations (Future Reference)

These Obsidian plugins inform future feature development:

| Plugin | Feature to Mimic |
|--------|------------------|
| **Tasks** | Task lists with due dates, priorities, recurring |
| **Dataview** | Query and display structured data from files |
| **Kanban** | Kanban board view of tasks/projects |
| **Calendar** | Calendar view of dated content |
| **Templater** | Template system with dynamic insertion |
| **Excalidraw** | Embedded drawing/diagramming |
| **Periodic Notes** | Daily/weekly/monthly note automation |

---

## 13. Scoping & Phased Delivery

### 13.1 File Locking System

**Problem:** Protect important files from accidental AI edits or manual changes.

| Lock Level | Icon | Behavior |
|------------|------|----------|
| **Unlocked** | (none) | Normal editing |
| **Soft Lock** | 🔒 | Locked, click to unlock |
| **Password Lock** | 🔐 | Requires password to unlock |

**Implementation:**
- Right-click menu in file tree: Unlock / Lock (soft) / Lock with Password
- AI respects locks (refuses to edit locked files)
- Lock indicator visible in file tree and tab bar
- Optional lock reason note

### 13.2 Memory Lifecycle Management

**Problem:** Memories accumulate, become stale, and clutter AI context without a way to know what's still relevant.

#### Memory Metadata Schema

| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid | Unique identifier |
| `key` | string | Memory name/topic |
| `value` | string | Memory content |
| `created_at` | datetime | When learned |
| `last_used` | datetime | Last time AI referenced it |
| `use_count` | int | How many times used |
| `relevance_type` | enum | short_term / long_term / permanent |
| `expires_at` | datetime | Optional expiry date |
| `confidence` | float | How certain (0-1) |
| `source_type` | enum | user_stated / ai_inferred / imported |
| `source_ref` | string | Link to origin (file, conversation) |
| `tier` | enum | hot / warm / cold |
| `score` | float | Aggregated relevance score (1-10) |

#### Tiered Memory Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MEMORY TIERS                                │
├─────────────────────────────────────────────────────────────────┤
│  HOT MEMORY (Tier 1)     Always in context (~5-10KB)           │
│  • Score ≥8, use_count >10, used in last 7 days                │
│  • User-defined permanent memories                              │
├─────────────────────────────────────────────────────────────────┤
│  WARM MEMORY (Tier 2)    Vector-retrieved when relevant (~50KB)│
│  • Score 6-7, use_count 3-10, used in last 30 days             │
│  • AI-inferred, user-confirmed                                  │
├─────────────────────────────────────────────────────────────────┤
│  COLD MEMORY (Tier 3)    Searchable archive, rarely loaded     │
│  • Score 4-5, use_count <3, not used in 30+ days               │
│  • Pending review                                               │
└─────────────────────────────────────────────────────────────────┘
```

#### Memory Review Process (Multi-Agent)

Based on proven audit process with three reviewer agents:

1. **Optimist Agent** - Rates memories on "likely still useful" (1-10)
2. **Pessimist Agent** - Rates memories on "safe to remove" (1-10)
3. **Neutral Agent** - Rates memories on "objective relevance" (1-10)
4. **Orchestrator** - Aggregates scores, applies thresholds, assigns tiers

**Thresholds (configurable in `.keep/settings.yaml`):**
```yaml
memory:
  review:
    hot_threshold: 8      # Score ≥8 → always in context
    warm_threshold: 6     # Score 6-7 → vector retrieved
    cold_threshold: 4     # Score 4-5 → archived
    prune_threshold: 4    # Score <4 → prune candidates
  budget:
    hot_max_kb: 10        # Max size for hot tier
    hot_max_count: 50     # Max count for hot tier
    warm_max_kb: 50       # Max size for warm tier
```

#### Memory Scoring (User Feedback)

| Feature | Description | Phase |
|---------|-------------|-------|
| User-defined vs AI-inferred flag | Basic distinction | MVP |
| AI-inferred memory review queue | "Is this memory accurate?" | MVP+3 |
| 1-10 rating on AI-inferred | Quality scoring by user | MVP+4 |
| ML model learns from ratings | Improve inference over time | v2+ |

### 13.3 Expanded Phase Breakdown

| Phase | Focus | Key Features | Est. Time |
|-------|-------|--------------|-----------|
| **MVP** | Core IDE + AI + Memories | Dockview panels, file browser, dual-editor (Monaco+TipTap), AI chat (edits in place), atomic memories with provenance, command palette, Soul Discovery | 8-12 weeks |
| **MVP+1** | Mobile Interface | Responsive layout, touch-friendly UI, mobile file browser, mobile chat, offline viewing | +3-4 weeks |
| **MVP+2** | File Org + Cross-Project | Stars, tags, locks (soft), file metadata, cross-project queries, cross-project citations | +2-3 weeks |
| **MVP+3** | Memory + Linking + Journal + Personas | Tiered memory, project linking, cross-project inbox, daily journal, AI personas (Coach, Teacher, Analyst) | +4-5 weeks |
| **MVP+4** | Templates + Import + Style | Project templates, import pipeline, Crawl4AI, n8n YouTube, image gen, multi-user, content style profiles, AI style guide | +4-5 weeks |
| **MVP+5** | Tasks + Panels | Task extraction, task panel with filters, memory 1-10 ratings | +3-4 weeks |
| **MVP+6** | Workflows + Integration | Dify sync, MCP Gateway plugins, browser tab, Grist integration | +3-4 weeks |
| **MVP+7** | Memory Manager UI | Spreadsheet-like memory view, multi-agent review process, auto-archive | +3-4 weeks |
| **v2** | Advanced | Knowledge graph, unified journal (multi-source), external activity API | TBD |
| **v3** | Scale | Real-time collaboration, plugin marketplace, canvas/whiteboard | TBD |

### 13.4 MVP Feature List (Detailed)

#### Core Infrastructure
- [ ] Next.js 14 App Router
- [ ] PostgreSQL + pgvector
- [ ] MinIO/S3 file storage
- [ ] LiteLLM integration
- [ ] Authentication (Authentik)
- [ ] Redis (memory hot cache)

#### UI Framework
- [ ] Dockview panel system
- [ ] Activity bar + sidebar
- [ ] Tab bar with splits (horizontal/vertical)
- [ ] Command palette (Cmd+K)
- [ ] File browser with tree
- [ ] Dark mode default
- [ ] Full-width header bar
- [ ] File metadata bar (path, modified, backlinks)

#### File Management
- [ ] File CRUD operations
- [ ] Folder hierarchy
- [ ] File upload
- [ ] Dual-mode markdown editor (Source: Monaco, Preview: TipTap WYSIWYG)
- [ ] TipTap slash commands (/code, /task, /table, etc.)
- [ ] TipTap bubble menu (select text → format options)
- [ ] Interactive task lists (click to toggle checkboxes)
- [ ] PDF viewer
- [ ] Line numbers + syntax highlighting
- [ ] Auto-save with indicator
- [ ] Save button per tab

#### AI Chat
- [ ] Chat as dockable tab
- [ ] AI edits files in place (THE differentiator)
- [ ] Context chips (open files)
- [ ] Model selector (local/API)
- [ ] Streaming responses
- [ ] Secret detection/masking
- [ ] Conversation modes (normal/incognito/read-only)

#### Project Context System
- [ ] `.keep/` directory structure
- [ ] SOUL.md (identity)
- [ ] GUARDRAILS.md (boundaries)
- [ ] INSTRUCTIONS.md (behavior)
- [ ] KEEP.md (primary AI instructions)
- [ ] settings.json (configuration)
- [ ] Soul Discovery wizard

#### Knowledge System
- [ ] Atomic memories (key-value)
- [ ] Memory provenance tracking
- [ ] Memory editing
- [ ] Trusted sources (basic)
- [ ] Memory tier assignment (hot/warm/cold)

#### Search
- [ ] File name search
- [ ] Full-text search
- [ ] Vector/semantic search (for memory retrieval)

### 13.5 Updated `.keep/` Directory Structure

Based on research of Claude Code, VS Code, and Cursor patterns:

```
.keep/
├── KEEP.md                 # Primary AI instructions (like CLAUDE.md)
├── SOUL.md                 # Project identity & purpose
├── GUARDRAILS.md           # Boundaries & never-dos
├── INSTRUCTIONS.md         # Behavioral instructions (ChatGPT-style)
├── AUTHORITIES.md          # Trusted sources with domain ratings
├── SOURCES.md              # Auto-maintained data source registry
├── USER.md                 # User profile for this project
├── settings.json           # Project configuration
├── icons.yaml              # Custom icon registry
├── tags.yaml               # Custom tag definitions
├── commands.yaml           # Custom chat commands
├── rules/                  # Behavioral rules (auto-loaded)
├── procedures/             # Individual procedure files
├── capabilities/           # Capability definitions
├── plugins/                # MCP plugin configs
├── templates/              # Project-specific templates
├── workflows/              # Workflow definitions (Dify sync)
├── hooks/                  # Lifecycle automation
├── context/                # Session persistence
├── integrations/           # External service configs
└── trash/                  # Soft delete (30-day)
```

---

## 14. Implementation Plan

### 14.1 Development Philosophy

| Principle | Application |
|-----------|-------------|
| **Vertical Slices** | Each sprint delivers working end-to-end features, not layers |
| **TDD** | Tests written before implementation for core logic |
| **Iterative UI** | Start with functional, polish in later sprints |
| **AI-First** | AI integration in Sprint 2, not bolted on later |
| **Ship Early** | MVP deployed to Banner by end of Sprint 4 |

### 14.2 Sprint Breakdown (MVP: 8-12 weeks)

#### Sprint 0: Foundation (Week 1)
**Goal:** Project scaffolding and infrastructure ready

| Task | Owner | Deliverable |
|------|-------|-------------|
| Next.js 14 project setup | Dev | Repo with App Router, TypeScript, ESLint |
| Docker Compose stack | Dev | PostgreSQL, Redis, MinIO containers |
| CI/CD pipeline | Dev | GitHub Actions → Banner deployment |
| Tailwind + shadcn/ui | Dev | Base components installed |
| Database schema (Drizzle) | Dev | Initial migrations for core tables |

**Exit Criteria:**
- [ ] `npm run dev` works locally
- [ ] Docker stack runs on Banner
- [ ] Database migrations apply cleanly
- [ ] CI builds pass

---

#### Sprint 1: Workspace Shell (Weeks 2-3)
**Goal:** IDE-like layout with file browsing

| Task | Owner | Deliverable |
|------|-------|-------------|
| Dockview integration | Dev | Panels, tabs, splits working |
| Activity bar | Dev | 6 icons with routing |
| File browser panel | Dev | Tree view, expand/collapse |
| Header bar | Dev | Project switcher, search, settings |
| Command palette | Dev | Cmd+K opens, basic navigation |
| File CRUD API | Dev | Create, read, update, delete files |

**Exit Criteria:**
- [ ] Can navigate folder tree
- [ ] Can open files in tabs
- [ ] Can split panels horizontally/vertically
- [ ] Can drag tabs between groups

---

#### Sprint 2: Editor + AI Foundation (Weeks 4-5)
**Goal:** Edit files and chat with AI

| Task | Owner | Deliverable |
|------|-------|-------------|
| Monaco editor (Source mode) | Dev | Syntax highlighting, line numbers |
| TipTap editor (Preview mode) | Dev | WYSIWYG with slash commands |
| Editor mode toggle | Dev | Source ↔ Preview sync |
| Auto-save | Dev | Debounced save with indicator |
| AI chat panel | Dev | Dockable chat tab |
| LiteLLM integration | Dev | Model selector, streaming |
| Context chips | Dev | Show open files in chat |

**Exit Criteria:**
- [ ] Can edit markdown in both modes
- [ ] Changes sync between modes
- [ ] AI responds with streaming
- [ ] Can reference open files in chat

---

#### Sprint 3: AI File Editing (Weeks 6-7)
**Goal:** AI can edit files in place (THE differentiator)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Edit-in-place API | Dev | AI writes to files via tool calls |
| Diff preview | Dev | Show pending AI edits before apply |
| Accept/reject workflow | Dev | User approves each edit |
| Secret detection | Dev | Scan outbound requests for secrets |
| Secret masking | Dev | Replace secrets with placeholders |
| Conversation modes | Dev | Normal, incognito, read-only |

**Exit Criteria:**
- [ ] AI can suggest file edits
- [ ] User sees diff before applying
- [ ] Secrets don't leak to AI
- [ ] Incognito mode works

---

#### Sprint 4: Knowledge System (Weeks 8-9)
**Goal:** Atomic memories with provenance

| Task | Owner | Deliverable |
|------|-------|-------------|
| Memory CRUD API | Dev | Create, read, update, delete memories |
| Memory data model | Dev | Key-value with provenance fields |
| Memory panel | Dev | View/edit memories |
| Provenance tracking | Dev | Source, confidence, timestamp |
| Tiered storage | Dev | Hot (Redis) / Warm (pgvector) / Cold (archive) |
| Memory retrieval | Dev | AI can query relevant memories |

**Exit Criteria:**
- [ ] Can manually create memories
- [ ] AI extracts memories from chat
- [ ] Memories show provenance
- [ ] AI uses memories in responses

---

#### Sprint 5: Project Context (Weeks 10-11)
**Goal:** .keep/ system and Soul Discovery

| Task | Owner | Deliverable |
|------|-------|-------------|
| `.keep/` structure | Dev | SOUL, GUARDRAILS, INSTRUCTIONS files |
| Settings panel | Dev | Edit project settings |
| Soul Discovery wizard | Dev | Guided project setup |
| Rules auto-loading | Dev | `.keep/rules/` files apply to AI |
| KEEP.md integration | Dev | AI reads project instructions |

**Exit Criteria:**
- [ ] New project creates `.keep/` structure
- [ ] Soul Discovery populates SOUL.md
- [ ] AI follows GUARDRAILS.md rules
- [ ] Rules directory applies automatically

---

#### Sprint 6: Polish & Deploy (Week 12)
**Goal:** MVP deployed and tested

| Task | Owner | Deliverable |
|------|-------|-------------|
| PDF viewer | Dev | View PDFs with zoom |
| Image viewer | Dev | View images with zoom |
| Search (file + fulltext) | Dev | Find files and content |
| Error handling | Dev | Graceful failures, toasts |
| Loading states | Dev | Skeletons, spinners |
| Traefik config | Dev | Domain routing, SSL |
| User testing | QA | 5+ test sessions |
| Bug fixes | Dev | Critical issues resolved |

**Exit Criteria:**
- [ ] https://the-keep.nextlevelguild.com loads
- [ ] All core workflows functional
- [ ] No critical bugs
- [ ] Documentation complete

---

### 14.3 Technical Dependencies

```
Sprint 0 ─────┬────► Sprint 1 ────► Sprint 2 ────┬────► Sprint 3
              │                                   │
              │      (Parallel: DB schema)        │
              │                                   ▼
              └─────────────────────────────────► Sprint 4 ────► Sprint 5 ────► Sprint 6
```

| Dependency | Blocks | Notes |
|------------|--------|-------|
| Docker Compose | All sprints | Must run on Banner |
| Dockview | Sprint 1+ | Core layout system |
| LiteLLM | Sprint 2+ | AI features |
| pgvector | Sprint 4+ | Memory retrieval |
| TipTap | Sprint 2+ | WYSIWYG editing |
| Monaco | Sprint 2+ | Source editing |

### 14.4 Integration Points

Leveraging NLF Service Catalog (see `/mnt/foundry_devlab/services/catalog.md`).

#### 9.4.1 Core Infrastructure (MVP)

| Integration | Endpoint | Type | Phase |
|-------------|----------|------|-------|
| LiteLLM | http://10.0.0.27:2764 | HTTP | S2 |
| MinIO | Helicarrier | S3 SDK | S0 |
| PostgreSQL | Per-service | Drizzle ORM | S0 |
| Redis | Per-service | ioredis | S4 |
| Traefik | Config | HTTPS routing | S6 |

#### 9.4.2 Observability (MVP)

| Integration | Endpoint | Type | Purpose |
|-------------|----------|------|---------|
| Sentry | sentry.io | SDK | Error tracking, stack traces |
| Loki | https://loki.ucontrolnetwork.com | HTTP | Log aggregation |
| Prometheus | https://prometheus.ucontrolnetwork.com | Metrics | App metrics |
| Grafana | https://grafana.ucontrolnetwork.com | Dashboard | Visualization |
| Checkmate | https://checkmate.ucontrolnetwork.com | HTTP poll | External uptime |
| ntfy | https://ntfy.sh/the-keep-alerts | HTTP POST | Push notifications |
| Alertmanager | http://10.0.0.28:2827 | Webhook | Alert routing |

#### 9.4.3 Post-MVP Integrations

| Integration | Endpoint | Phase | Purpose |
|-------------|----------|-------|---------|
| Authentik | https://auth.nextlevelfoundry.com | MVP+1 | SSO/OAuth |
| Crawl4AI | http://10.0.0.27:2760 | MVP+4 | Web scraping → markdown |
| n8n | https://n8n.nextlevelguild.com | MVP+4 | YouTube transcripts (rate limited) |
| Image Gen | via LiteLLM | MVP+4 | DALL-E image creation |
| MCP Gateway | http://10.0.0.27:2780/mcp | MVP+6 | 233+ AI tools |
| Grist | https://grist.ucontrolnetwork.com | MVP+6 | Spreadsheet data |
| Sablier | Traefik middleware | Post-MVP | Scale-to-zero (optional) |

#### 9.4.4 Credentials Management

All service credentials sourced from:
```bash
source /mnt/foundry_devlab/secrets/env/appservices.env  # Core services
source /mnt/foundry_devlab/secrets/env/sentry.env       # Sentry DSN
source /mnt/foundry_devlab/secrets/env/litellm.env      # LiteLLM API key
```

**Never hardcode credentials** - all from env vars at runtime.

### 14.5 Risk Mitigation by Sprint

| Sprint | Risk | Mitigation |
|--------|------|------------|
| S0 | Docker networking issues | Use existing Banner patterns |
| S1 | Dockview learning curve | Allocate extra time, consult docs |
| S2 | Monaco/TipTap sync bugs | Thorough testing, fallback to Monaco-only |
| S3 | Secret detection false positives | Tunable patterns, user override |
| S4 | Memory retrieval performance | Index optimization, caching |
| S5 | Soul Discovery UX | User testing, iterate |
| S6 | Production stability | Staged rollout, monitoring |

### 14.6 Definition of Done (Per Sprint)

- [ ] All acceptance criteria met
- [ ] Unit tests pass (80%+ coverage for new code)
- [ ] Integration tests pass
- [ ] No P0/P1 bugs
- [ ] Code reviewed and merged
- [ ] Deployed to Banner
- [ ] Demo recorded or conducted

### 14.7 Post-MVP Roadmap

| Phase | Timeline | Key Features | Services |
|-------|----------|--------------|----------|
| MVP+1 | +3-4 weeks | **Mobile interface** - responsive, touch UI, offline | Authentik SSO |
| MVP+2 | +2-3 weeks | Stars, tags, soft locks, file metadata | - |
| MVP+3 | +2-3 weeks | Memory lifecycle, tiered memory UI | - |
| MVP+4 | +3-4 weeks | Templates, import, image generation, multi-user | Crawl4AI, n8n, DALL-E, Authentik |
| MVP+5 | +3-4 weeks | Tasks, memory ratings | - |
| MVP+6 | +3-4 weeks | Workflows, MCP plugins, Grist | MCP Gateway, Grist, Dify |
| MVP+7 | +3-4 weeks | Memory manager, multi-agent review | - |
| v2 | TBD | Knowledge graph, personas, canvas | - |
| Optional | - | Scale-to-zero for idle periods | Sablier |

---

**Document Status:** Complete - All PRD Workflow Steps (1-11) Finished

**Changelog:**
| Date | Change |
|------|--------|
| 2026-03-22 | QA Review (Quinn): Added Section 15 (Acceptance Criteria & Testing) with AC-CTX, AC-EDIT, AC-MEM criteria. Created RTM (`docs/testing/requirements-traceability.md`) mapping all 165 FRs to test cases. Created as-built documentation structure (`docs/as-built/`). Defined core functionality happy path tests. |
| 2026-03-22 | Party Mode Review (Session 3): Updated Section 4 Innovation with 6 new innovations (Personas, Daily Journal, Cross-Project Inbox, Memory Versioning, 4-Layer AI Customization, Memory Lifecycle), expanded competitive landscape, added validation criteria and risk mitigations. Section 5 mobile editor strategy (plain textarea), accessibility acceptance criteria. Section 8 roadmap updated (personas now MVP+2). |
| 2026-03-22 | Party Mode Review (Session 2): AI Customization (global prefs, style profiles, AI-generated style guide), AI Personas (Coach, Teacher, Analyst, Creative), Auto Daily Journal (central, task extraction, multi-source v2 vision) |
| 2026-03-22 | Party Mode Review (Session 2): Cross-project inbox model (request/approve workflow), Memory version control + revert, Memory UI grid with inline editing, status/tier management |
| 2026-03-22 | Party Mode Review (Session 1): Memory storage (PostgreSQL + serialization), Monaco locked for source mode, Murat QA review added, 20 new journeys, FR numbering to CM-41 |
| 2026-03-22 | Party Mode Review (Session 1): Multi-user added to MVP+4 roadmap, mobile clarified (basic MVP+1, optimized v2+), offline explicitly out of scope, Obsidian competitive framing updated, screenshot vs OCR clarified |
| 2026-03-22 | PRD Step 11: Polish & Review - section numbering fixed, consistency verified, document finalized |
| 2026-03-22 | Service Catalog integration: Sentry, ntfy, Checkmate, Crawl4AI, n8n YouTube, Image Generation (MVP+4) |
| 2026-03-22 | PRD Step 10: Added Health & Self-Healing (4.12), Logging & Diagnostics (4.13), Autonomous Operations (4.14) |
| 2026-03-22 | PRD Step 10: Expanded NFRs - 11 categories, 80+ requirements (performance, security, accessibility, mobile, observability) |
| 2026-03-22 | Added Mobile Interface (Section 2.30, FR-MO) as MVP+1, bumped other phases to MVP+2 through MVP+7 |
| 2026-03-22 | PRD Step 9: Implementation Plan with 6-sprint breakdown, dependencies, integration points |
| 2026-03-22 | Added dual-editor architecture (Monaco Source + TipTap WYSIWYG) to Section 2.5 and MVP scope |
| 2026-03-22 | PRD Step 8: File locking, memory lifecycle, tiered memory, expanded phases (MVP through MVP+6), updated .keep/ structure |
| 2026-03-22 | PRD Steps 5-7: Domain requirements (secret masking, plugin system), Innovation section, Web App requirements (browser support, storage strategy, auto-save, icon system) |
| 2026-03-22 | Added data models: ImportJob, FileVersion, TaggedItem, Task, Notification, AIFeedback |
| 2026-03-22 | Major update: Added AI file editing, project context system, memory provenance, conversation modes, trusted sources, derived views, 13 user journeys, expanded data models |
| 2026-03-22 | Initial PRD structure |

---

## 15. Acceptance Criteria & Testing

### 15.1 Testing Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Requirements Traceability Matrix** | Maps FRs to test cases, tracks status | `docs/testing/requirements-traceability.md` |
| **As-Built Documentation** | Tracks actual vs planned implementation | `docs/as-built/` |
| **Deviation Log** | Documents all PRD deviations with rationale | `docs/as-built/deviations.md` |
| **Current State** | Living doc of what works today | `docs/as-built/current-state.md` |

### 15.2 AI Context Integration Acceptance Criteria (CRITICAL)

These criteria verify the core differentiator - AI has proper context.

#### AC-CTX-01: Multiple Open Tabs in Context

**Given** 3 files open in tabs (e.g., habits.md, supplements.md, bloodwork.md)
**When** user asks a question that requires information from multiple files
**Then**:
- AI response references specific values from all relevant open files
- Response cites which file each fact came from
- No hallucinated data from files not in context

#### AC-CTX-02: Hot Memories Always Injected

**Given** hot tier memories exist (allergies, medications, preferences)
**When** user asks ANY related question (without mentioning the memory)
**Then**:
- AI response incorporates hot memory facts automatically
- User did NOT need to remind AI of these facts
- Response reflects memory constraints (e.g., avoids allergens)

#### AC-CTX-03: Soul Personality Applied

**Given** SOUL.md defines personality traits (casual tone, avoids jargon, encouraging)
**When** user asks questions within the project
**Then**:
- AI response matches the defined personality
- Tone is consistent across multiple exchanges
- Soul traits override default AI behavior

#### AC-CTX-04: Guardrails Enforced

**Given** GUARDRAILS.md defines forbidden actions (e.g., never diagnose, never recommend stopping medications)
**When** user asks AI to perform a forbidden action
**Then**:
- AI explicitly declines with clear explanation
- AI suggests appropriate alternative (e.g., consult doctor)
- Guardrail is not bypassed by rephrasing

#### AC-CTX-05: Persona Mode Active

**Given** persona set to Coach/Teacher/Analyst/Creative
**When** user interacts with AI
**Then**:
- Response tone matches selected persona
- Persona traits are consistent throughout conversation
- Switching persona changes behavior immediately

### 15.3 AI Editing Acceptance Criteria (CRITICAL)

#### AC-EDIT-01: Template Structure Preserved

**Given** file follows a template (frontmatter, sections, formatting)
**When** AI edits content within the file
**Then**:
- Frontmatter unchanged (byte-for-byte)
- Section headers preserved exactly
- Only the requested content area is modified
- Template markers (##, ---) preserved

#### AC-EDIT-02: Only Requested Content Modified

**Given** file with multiple lines/sections
**When** AI edits one specific item
**Then**:
- Only the targeted line/value changes
- All other lines remain byte-for-byte identical
- Formatting (dashes, spacing, indentation) preserved
- Diff shows minimal change

#### AC-EDIT-03: Append to List Correctly

**Given** file with an existing list (habits, supplements, tasks)
**When** user says "Add X to the list"
**Then**:
- New item added at appropriate position (end or logical order)
- Existing items unchanged
- List formatting style matched (dash, asterisk, number)
- No duplication of existing items

#### AC-EDIT-04: Frontmatter Respected

**Given** any file with YAML frontmatter
**When** AI edits the content body
**Then**:
- `---` delimiters preserved exactly
- All frontmatter fields unchanged
- No fields added, removed, or reordered
- Content edits happen AFTER closing `---`

### 15.4 Memory Integration Acceptance Criteria

#### AC-MEM-01: Memory Tier Hierarchy Respected

**Given** memories exist in hot, warm, and cold tiers
**When** AI conversation starts
**Then**:
- Hot memories are in system prompt (always present)
- Warm memories retrieved only if query triggers vector search
- Cold memories never in context unless explicitly searched

#### AC-MEM-02: Memory Provenance Tracked

**When** new memory is created
**Then** memory record includes:
- `source_type`: conversation, file_extraction, user_edit, or inferred
- `source_ref`: link to specific conversation:message or file:line
- `learned_at`: timestamp
- `confidence`: high (user stated), medium (extracted), low (inferred)

#### AC-MEM-03: Memories Scoped to Project

**Given** Memory A exists in Project 1, Memory B in Project 2
**When** user is in Project 1 context
**Then**:
- Only Memory A available to AI
- Memory B not accessible
- No cross-project memory bleed

### 15.5 Core Functionality Tests (Happy Path)

Before testing edge cases, these must pass:

| Area | Test | Pass Criteria |
|------|------|---------------|
| **Workspace** | Open app | Panels load in <3s |
| **Workspace** | Drag tab | Position updates, persists |
| **Files** | Upload file | Appears in tree correctly |
| **Files** | Create folder | Accepts files, hierarchy works |
| **Editor** | Type in source mode | Real-time, no lag |
| **Editor** | Toggle source/preview | Content identical both modes |
| **Editor** | Save file | Persists, reloads correctly |
| **AI Chat** | Send message | Response streams, completes |
| **AI Chat** | AI reads open file | References file content accurately |
| **AI Edit** | "Add X to file" | Line added, others unchanged |
| **AI Edit** | "Change X to Y" | Value updated, structure intact |
| **AI Edit** | Undo edit | Previous version restored |
| **Memory** | Create memory | Stored with key/value |
| **Memory** | Edit memory | New value, history preserved |
| **Memory** | AI uses memory | Response incorporates facts |
| **Context** | Switch projects | All context changes |
| **Context** | Incognito mode | No memories written |

---

**Next Steps:**
1. ~~**QA Review (Murat):** Review all FRs and define acceptance criteria during sprint planning~~ **DONE - AC defined above**
2. Architecture team: Design system components and data flow
3. UX team: Finalize wireframes from mockup review findings
4. Review dynamic context research when complete
5. Begin Sprint 1 implementation per Section 14

**Research Completed:**
- [cursor-vscode-analysis.md](../research/cursor-vscode-analysis.md) - IDE patterns
- [openclaw-analysis.md](../research/openclaw-analysis.md) - Workspace files, autonomy
- [obsidian-analysis.md](../research/obsidian-analysis.md) - Plugin patterns overview
- [obsidian-plugin-deep-dive.md](../research/obsidian-plugin-deep-dive.md) - 75+ plugins, tag/date/query patterns
- [memory-systems-analysis.md](../research/memory-systems-analysis.md) - SuperMemory, Mem0, Zep, tiered architecture
- [config-patterns-analysis.md](../research/config-patterns-analysis.md) - Claude/.vscode/Cursor config patterns
- [ui-component-research.md](../research/ui-component-research.md) - dockview, Monaco, shadcn/ui stack
- **Pending:** cursor-dynamic-context.md - Dynamic context feature research

**Mockups:**
- `mockups/mockup-a-cursor/` - Original Cursor-focused
- `mockups/mockup-b-obsidian/` - Obsidian-focused (worktree)
- `mockups/mockup-c-hybrid/` - Hybrid approach (worktree)
- `mockups/mockup-a-revised/` - **Final consolidated mockup** with all enhancements
