---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type']
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
**Status:** Draft (Extended - Journey Mapping + Data Models Complete)

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
| **Import** | Bulk import with audit, markdown cleanup, PDF extraction, screenshot processing |
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
| **Mobile** | Responsive view, PWA support |
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

Obsidian-style markdown editing experience.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-ME-01 | **Rich Toolbar** - Bold, italic, headers, lists, links, tables | P0 | User-friendly editing |
| FR-ME-02 | **Raw Mode** - Toggle to view/edit raw markdown | P0 | Power user need |
| FR-ME-03 | **Preview Mode** - Rendered markdown view | P0 | Reading mode |
| FR-ME-04 | **Split Edit/Preview** - Side-by-side raw and rendered | P1 | Live preview |
| FR-ME-05 | **Auto-Save** - Save changes automatically | P0 | Data safety |
| FR-ME-06 | **Wikilinks** - Support `[[filename]]` style links | P1 | Knowledge linking |
| FR-ME-07 | **Tables** - Easy table creation and editing | P1 | Structured data |

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
| FR-PK-09 | **Memory Management UI** - View all memories, edit items, consolidate duplicates, delete | P1 | User control |

**Design Principle:** Unlike ChatGPT's opaque memory system, The Keep provides:
- Atomic memories (e.g., "weight: 180" not "User weighs 180 and prefers Mediterranean diet and...")
- Direct editing of individual values (change weight from 180 to 175)
- Full visibility into what AI knows about you
- Ability to consolidate duplicates and delete unwanted memories

**Note:** Storage mechanism TBD in Architecture - either explicit markdown files in project OR secondary structured memory system.

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
| FR-CM-07 | **Cross-Project Query** - Read from multiple projects, write to one | P2 | Advanced |

**Use Cases:**
- "Help with mom's health" → Write to mom-health project, not my-health
- "Just a quick question, don't remember this" → Incognito mode
- "I'm exploring, don't change anything" → Read-only mode

### 2.14 Data Safety (FR-DS)

Protect against accidental data loss.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DS-01 | **Soft Delete** - Deleted files go to .keep/trash/, not permanent delete | P0 | Safety |
| FR-DS-02 | **30-Day Retention** - Trash items recoverable for 30 days | P0 | Recovery window |
| FR-DS-03 | **Trash Browser** - UI to view and restore deleted items | P0 | Usability |
| FR-DS-04 | **Permanent Delete** - Explicit action to empty trash | P1 | User control |
| FR-DS-05 | **Edit Undo** - Revert recent file edits | P0 | Mistake recovery |
| FR-DS-06 | **Memory Recovery** - Restore deleted memories from trash | P1 | Consistency |

### 2.15 Trusted Sources (FR-TS)

Registry of experts and their domain credibility.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-TS-01 | **Source Registry** - List of trusted experts/sources | P1 | Foundation |
| FR-TS-02 | **Domain Ratings** - Rate each source per topic (1-10 scale) | P1 | Nuance |
| FR-TS-03 | **Source Management UI** - Add, edit, remove sources and ratings | P1 | User control |
| FR-TS-04 | **AI Weighting** - AI prioritizes higher-rated sources in responses | P2 | Smart retrieval |
| FR-TS-05 | **Expert Persona Queries** - "What would Huberman think?" | P1 | Use case |
| FR-TS-06 | **Source Citation** - Show which trusted source informed answer | P1 | Transparency |

### 2.16 Derived Views (FR-DV2)

Reports generated from source files, not AI memory.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-DV2-01 | **Source-Linked Views** - Reports track which files they derive from | P1 | Traceability |
| FR-DV2-02 | **Staleness Detection** - Know if source changed since view generated | P1 | Accuracy |
| FR-DV2-03 | **Consistent Templates** - Same report type = same format every time | P1 | Reliability |
| FR-DV2-04 | **Refresh Command** - "Update this view from current sources" | P1 | On-demand |
| FR-DV2-05 | **Change Summary** - On refresh, show what's different | P2 | Awareness |
| FR-DV2-06 | **Common Views** - Pill box layout, grocery list, health summary | P1 | Pre-built |

### 2.17 Web Search Integration (FR-WS2)

Combine project knowledge with web search.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-WS2-01 | **Web Search Toggle** - Enable/disable web search per query | P1 | Control |
| FR-WS2-02 | **Combined Results** - Synthesize project files + web findings | P1 | Unified answer |
| FR-WS2-03 | **Source Distinction** - Clearly show what's from files vs web | P1 | Transparency |
| FR-WS2-04 | **Save Web Findings** - Option to save relevant web content to project | P2 | Knowledge capture |

### 2.18 Import & Processing (FR-IP)

Comprehensive import pipeline with audit, cleanup, and extraction.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-IP-01 | **Bulk Import** - Import folder/zip of files | P0-MVP | Core |
| FR-IP-02 | **Import Audit** - Scan and categorize files before import | P0-MVP | Visibility |
| FR-IP-03 | **File Type Detection** - Identify markdown, PDF, image, etc. | P0-MVP | Classification |
| FR-IP-04 | **Markdown Cleanup** - Normalize inconsistent markdown formatting | P1-MVP | Quality |
| FR-IP-05 | **PDF Text Extraction** - Extract text from text-based PDFs | P0-MVP | Core |
| FR-IP-06 | **Screenshot Processing** - Store raw image + extract content | P1-MVP | Key feature |
| FR-IP-07 | **AI Vision Extraction** - Use vision model for image content | P1-MVP | Screenshots |
| FR-IP-08 | **Companion Files** - Create .md alongside extracted content | P1-MVP | Organization |
| FR-IP-09 | **Import Log** - Record what was imported and processed | P1-MVP | Audit trail |
| FR-IP-10 | **Preview Before Import** - Show what will happen | P1-MVP | User control |
| FR-IP-11 | **Selective Import** - Choose which files to import | P1-MVP | Flexibility |
| FR-IP-12 | **Duplicate Detection** - Warn if file already exists | P2-MVP+1 | Safety |
| FR-IP-13 | **OCR for Scanned PDFs** - Extract text from image PDFs | P3-v2 | Complex |
| FR-IP-14 | **Format Conversion** - Convert DOCX, HTML to markdown | P2-MVP+1 | Migration |
| FR-IP-15 | **Obsidian Import** - Handle Obsidian vault structure | P1-MVP | Migration |
| FR-IP-16 | **Import Progress** - Show progress for large imports | P1-MVP | UX |

**Import Flow:**
1. User selects files/folder → Audit phase scans and categorizes
2. Audit report shows: 45 markdown, 12 need cleanup, 8 PDFs, 15 screenshots
3. User configures processing options → Processing phase runs
4. Each file type handled appropriately (cleanup, extract, companion files)
5. Import complete with detailed log

**Screenshot Handling:** Raw image stored + AI vision extracts content → companion .md created with embedded image link and extracted text. Both files preserved, content searchable.

### 2.19 Version Control (FR-VC)

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

### 2.20 AI High Availability (FR-HA)

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

### 2.21 Unified Search (FR-US)

One search for everything.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-US-01 | **Omni-Search** - Search files, memories, conversations | P0-MVP | Cmd+K |
| FR-US-02 | **Filter by Type** - Filter results: files, memories, chat | P1-MVP | Refinement |
| FR-US-03 | **Recent Items** - Quick access to recently opened | P1-MVP | Speed |
| FR-US-04 | **Saved Searches** - Bookmark frequent queries | P2 | Efficiency |
| FR-US-05 | **Search Preview** - Preview content without opening | P1-MVP | Quick scan |

### 2.22 Advanced Search (FR-AS)

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

### 2.23 AI Learning & Feedback (FR-LI)

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

### 2.24 Keyboard Navigation (FR-KB)

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

### 2.25 Task Management (FR-TM) - MVP+2

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

### 2.26 Tagging & Actions (FR-TA) - MVP+2

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

### 2.27 Notifications & Reminders (FR-NO) - MVP+2

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

### 2.28 Grist Integration (FR-GR) - MVP+2

Display Grist database data within The Keep.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-GR-01 | **Grist Tab** - Open Grist database view in dockview | P2-MVP+2 | Embedded |
| FR-GR-02 | **Table View** - Display Grist table data natively | P2-MVP+2 | Read API |
| FR-GR-03 | **Graph View** - Visualize Grist data as chart | P3-v2 | Relationships |
| FR-GR-04 | **RAG Integration** - Include Grist data in AI context | P2-MVP+2 | Query |
| FR-GR-05 | **Bidirectional Sync** - Changes reflect in both | P3-v2 | Complex |

### 2.29 Export (FR-EX)

Export data for backup and portability.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-EX-01 | **Export Project** - Download as ZIP | P1-MVP | Backup |
| FR-EX-02 | **Export Memories** - JSON/CSV export | P2 | Portability |
| FR-EX-03 | **Export Conversations** - Save chat history | P2 | Archive |
| FR-EX-04 | **Scheduled Backup** - Auto-export on schedule | P3 | Automation |

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

**Journey 7: Recurring Report**
```
User: "Show me my pill box layout" (every 2 weeks)
→ AI reads: reports/pill-box-layout.md
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

### Market Context & Competitive Landscape

| Competitor | Gap The Keep Fills |
|------------|-------------------|
| **ChatGPT/Claude.ai** | No file management, regenerates artifacts, opaque memory |
| **Obsidian** | Desktop-only, AI bolted-on, steep learning curve |
| **Cursor** | Code-focused, not PKM, no memory/inventory system |
| **OpenClaw** | Expensive to run, security risks, no file browser UI |
| **Notion AI** | Cloud-only, not self-hosted, limited AI integration |

**Unique Position:** Web-based Cursor + Obsidian patterns + Claude Code AI + self-hosted control

### Validation Approach

| Innovation Claim | How We Validate |
|------------------|-----------------|
| AI edits are reliable | Test: same edit request → same result across sessions |
| Provenance is useful | User can trace any fact to source within 2 clicks |
| Atomic memories work | User can edit single value without side effects |
| Filter panels replace queries | Non-technical user can find tasks without learning syntax |
| Templates feel natural | User describes template, AI generates correctly |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI edits could corrupt files | Diff preview required, undo/version history |
| AI could learn wrong facts | Provenance makes correction easy, user can verify source |
| Filter panels too limited | Allow "advanced mode" for power users |
| Plugin system security | Learn from OpenClaw: sandbox, audit, permission system |

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

- Full keyboard navigation with visible focus indicators
- ARIA labels and semantic HTML
- 4.5:1 color contrast minimum
- Respect `prefers-reduced-motion`
- 44px minimum touch targets on mobile

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

### 3.1 Performance (NFR-P)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P-01 | Initial page load | < 3 seconds |
| NFR-P-02 | File tree load (1000 files) | < 2 seconds |
| NFR-P-03 | File open (10MB PDF) | < 3 seconds |
| NFR-P-04 | AI response start (streaming) | < 1 second |
| NFR-P-05 | RAG search results | < 2 seconds |
| NFR-P-06 | Layout save/restore | < 500ms |

### 3.2 Reliability (NFR-R)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R-01 | Uptime | 99% (self-hosted acceptable) |
| NFR-R-02 | Data durability | No data loss on crash |
| NFR-R-03 | Auto-save reliability | Every change persisted |
| NFR-R-04 | Graceful degradation | App usable if AI backend down |

### 3.3 Security (NFR-S)

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-S-01 | Authentication | Authentik SSO integration (or simpler for v1) |
| NFR-S-02 | Authorization | Single user for v1, foundation for multi-user |
| NFR-S-03 | Data at rest | Files stored in MinIO (existing security) |
| NFR-S-04 | Data in transit | HTTPS via Traefik |
| NFR-S-05 | AI API keys | Server-side only, never exposed to client |

### 3.4 Scalability (NFR-SC)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SC-01 | Files per project | Support 10,000+ files |
| NFR-SC-02 | Total storage | Limited by MinIO capacity |
| NFR-SC-03 | Concurrent users | 1 (v1), foundation for more |
| NFR-SC-04 | Vector embeddings | Scale with pgvector |

### 3.5 Maintainability (NFR-M)

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-M-01 | Code structure | Component-based, clear separation |
| NFR-M-02 | Logging | Structured logs to Loki |
| NFR-M-03 | Monitoring | Metrics to Prometheus/Grafana |
| NFR-M-04 | Deployment | Docker Compose, standard NLF pattern |

---

## 4. Technical Specifications

### 4.1 Technology Stack

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

### 4.2 Infrastructure

| Component | Location | Details |
|-----------|----------|---------|
| **Development** | Banner (10.0.0.33) | Port 5010 |
| **Production** | Hulk (10.0.0.32) | TBD |
| **Domain** | the-keep.nextlevelguild.com | Via Traefik |
| **LiteLLM** | 10.0.0.27:2764 | AI model proxy |
| **MinIO** | Helicarrier | S3 storage |
| **PostgreSQL** | Per-service container | Bundled in stack |

### 4.3 Available AI Models (via LiteLLM)

| Model | Use Case |
|-------|----------|
| jarvis-chat | General conversation |
| jarvis-qwen72b | Complex reasoning |
| (others) | Per LiteLLM configuration |

### 4.4 API Design

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

## 5. User Interface Specifications

### 5.1 Layout Structure

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

### 5.2 Activity Bar Icons

| Icon | Function |
|------|----------|
| (Project Icons) | Switch between projects |
| Search | Global search / command palette |
| Settings | Application settings |

### 5.3 Panel Types

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

## 6. Data Models

### 6.1 Project

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

### 6.2 File

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

### 6.3 Conversation

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

### 6.4 Personal Knowledge

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

### 6.5 Atomic Memory (with Provenance)

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

  createdAt: Date;
  updatedAt: Date;
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

### 6.6 Trusted Source

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

### 6.7 Derived View

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

### 6.8 Import Job

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

### 6.9 File Version

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

### 6.10 Tagged Item (MVP+2)

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

### 6.11 Task (MVP+2)

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

### 6.12 Notification (MVP+2)

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

### 6.13 AI Feedback

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

---

## 7. Out of Scope (v1)

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
- Real-time collaboration / multi-user
- Mobile application
- Public sharing
- File versioning / history
- Audio/video transcription
- Extension marketplace
- Multiple AI agents/personas

---

## 8. Open Questions

| # | Question | Status | Notes |
|---|----------|--------|-------|
| 1 | **RAG Backend:** Dify API vs custom pgvector? | Open | Architecture decision |
| 2 | **PDF Text Extraction:** How to extract for RAG without OCR? | Open | pdf.js text layer? |
| 3 | **Auth:** Authentik integration or simpler for v1? | Open | Single user may be simpler |
| 4 | **Personal Knowledge Storage:** Files vs structured DB? | Open | Architecture decision |
| 5 | **Memory Extraction:** Manual only or AI-assisted? | Open | P2 feature, can defer |
| 6 | **Dify Procedure Sync:** Which is source of truth? | Open | Procedures.md vs Dify workflows |
| 7 | **Context File Versioning:** Track changes to .keep/ files? | Open | Git-like history? |
| 8 | **Cross-Project Queries:** How to read from multiple projects? | Open | Query routing, project selection UI |
| 9 | **Web Search Provider:** Which API for web search integration? | Open | Tavily, SerpAPI, direct? |
| 10 | **Template Library:** Ship with project-type templates? | Open | Health, Finance, Learning, Garden |

---

## 9. Risks and Mitigations

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

## 10. Milestones (Proposed)

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

## 11. Appendix

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

**Document Status:** In Progress - PRD Workflow Step 7 (Project Type) complete, Steps 8-11 remaining

**Changelog:**
| Date | Change |
|------|--------|
| 2026-03-22 | PRD Steps 5-7: Domain requirements (secret masking, plugin system), Innovation section, Web App requirements (browser support, storage strategy, auto-save, icon system) |
| 2026-03-22 | Added data models: ImportJob, FileVersion, TaggedItem, Task, Notification, AIFeedback |
| 2026-03-22 | Major update: Added AI file editing, project context system, memory provenance, conversation modes, trusted sources, derived views, 13 user journeys, expanded data models |
| 2026-03-22 | Initial PRD structure |

**Next Steps:**
1. Complete PRD Steps 8-11 (Scoping, Functional detail, NFRs, Polish)
2. Update Project Context System with new files (INSTRUCTIONS.md, AUTHORITIES.md, tags.yaml, commands.yaml, workflows/)
3. Architecture team: Design system components and data flow
4. UX team: Create wireframes and interaction patterns (use research docs)
5. Resolve open questions during architecture phase

**Research Completed:**
- [cursor-vscode-analysis.md](../research/cursor-vscode-analysis.md) - IDE patterns
- [openclaw-analysis.md](../research/openclaw-analysis.md) - Workspace files, autonomy
- [obsidian-analysis.md](../research/obsidian-analysis.md) - Plugin patterns overview
- [obsidian-plugin-deep-dive.md](../research/obsidian-plugin-deep-dive.md) - 75+ plugins, tag/date/query patterns
