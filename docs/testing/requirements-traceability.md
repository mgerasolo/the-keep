# Requirements Traceability Matrix (RTM)

**Purpose:** Map every PRD requirement to test cases and track implementation status.

**Rule:** No FR ships without test coverage. No deviation ships without documentation.

---

## How to Use

1. **Before implementing an FR:** Find it in this matrix, note the test cases needed
2. **When writing tests:** Add `@requirement FR-XX-YY` annotation to test
3. **When FR is complete:** Update status and as-built notes
4. **When deviating from PRD:** Document in `../as-built/deviations.md` FIRST

## Status Legend

| Status | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Implemented as specified |
| `[!]` | Implemented with deviation (see as-built notes) |
| `[-]` | Descoped (reason noted) |
| `[?]` | Needs test coverage (BLOCKING) |

---

## FR-WS: Workspace Shell

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-WS-01 | dockview Panel System - draggable tabs, split panes | `workspace.spec.ts#panel-system` | `[ ]` | - |
| FR-WS-02 | Activity Bar - far-left icon bar for context switching | `workspace.spec.ts#activity-bar` | `[ ]` | - |
| FR-WS-03 | File Browser Panel - tree view with folders, icons, menus | `file-browser.spec.ts#tree-view` | `[ ]` | - |
| FR-WS-04 | Command Palette - Cmd+K for quick actions | `workspace.spec.ts#command-palette` | `[ ]` | - |
| FR-WS-05 | Tab System - multiple files, drag between panes | `workspace.spec.ts#tabs` | `[ ]` | - |
| FR-WS-06 | Layout Persistence - save/restore per project | `workspace.spec.ts#layout-persist` | `[ ]` | - |
| FR-WS-07 | Keyboard Shortcuts - standard IDE shortcuts | `workspace.spec.ts#shortcuts` | `[ ]` | - |
| FR-WS-08 | Dark/Light Theme - user-selectable | `workspace.spec.ts#theme` | `[ ]` | - |

---

## FR-PM: Project Management

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-PM-01 | Multi-Project Support - isolated contexts | `project.spec.ts#multi-project` | `[ ]` | - |
| FR-PM-02 | Project Switcher - activity bar or dropdown | `project.spec.ts#switcher` | `[ ]` | - |
| FR-PM-03 | Isolated Context - own files, chat, settings, layout | `project.spec.ts#isolation` | `[ ]` | - |
| FR-PM-04 | Project Metadata - name, icon, description, date | `project.spec.ts#metadata` | `[ ]` | - |
| FR-PM-05 | Project CRUD - create, rename, archive | `project.spec.ts#crud` | `[ ]` | - |
| FR-PM-06 | Project Settings - per-project AI model, RAG, prefs | `project.spec.ts#settings` | `[ ]` | - |

---

## FR-FM: File Management

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-FM-01 | File Upload - drag-drop to file browser | `file-management.spec.ts#upload` | `[ ]` | - |
| FR-FM-02 | Folder Management - create, rename, delete, move | `file-management.spec.ts#folders` | `[ ]` | - |
| FR-FM-03 | File Operations - rename, delete, move, duplicate | `file-management.spec.ts#file-ops` | `[ ]` | - |
| FR-FM-04 | Multi-Select - select multiple for bulk operations | `file-management.spec.ts#multi-select` | `[ ]` | - |
| FR-FM-05 | Search Files - filter tree by name | `file-management.spec.ts#search` | `[ ]` | - |
| FR-FM-06 | File Icons - type-appropriate icons | `file-management.spec.ts#icons` | `[ ]` | - |
| FR-FM-07 | Context Menu - right-click for operations | `file-management.spec.ts#context-menu` | `[ ]` | - |

---

## FR-DV: Document Viewing

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-DV-01 | Markdown Rendering - formatted with syntax highlighting | `viewing.spec.ts#markdown` | `[ ]` | - |
| FR-DV-02 | PDF Viewing - render with zoom, page navigation | `viewing.spec.ts#pdf` | `[ ]` | - |
| FR-DV-03 | Image Viewing - PNG, JPG, GIF, SVG with zoom | `viewing.spec.ts#images` | `[ ]` | - |
| FR-DV-04 | Code Viewing - syntax-highlighted code files | `viewing.spec.ts#code` | `[ ]` | - |
| FR-DV-05 | Plain Text - display text files | `viewing.spec.ts#plaintext` | `[ ]` | - |
| FR-DV-06 | Side-by-Side - multiple files in split panes | `viewing.spec.ts#split-view` | `[ ]` | - |

---

## FR-ME: Markdown Editing

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-ME-01 | Rich Toolbar - bold, italic, headers, lists, links, tables | `editor.spec.ts#toolbar` | `[ ]` | - |
| FR-ME-02 | Source Mode - Monaco for raw markdown | `editor.spec.ts#source-mode` | `[ ]` | - |
| FR-ME-03 | Preview Mode - TipTap WYSIWYG | `editor.spec.ts#preview-mode` | `[ ]` | - |
| FR-ME-04 | Split Edit/Preview - side-by-side raw and rendered | `editor.spec.ts#split-edit` | `[ ]` | - |
| FR-ME-05 | Auto-Save - save changes automatically | `editor.spec.ts#auto-save` | `[ ]` | - |
| FR-ME-06 | Wikilinks - support `[[filename]]` style links | `editor.spec.ts#wikilinks` | `[ ]` | - |
| FR-ME-07 | Tables - easy table creation and editing | `editor.spec.ts#tables` | `[ ]` | - |
| FR-ME-10 | Slash Commands - /code, /task, /heading, /quote, /table | `editor.spec.ts#slash-commands` | `[ ]` | - |
| FR-ME-11 | Bubble Menu - select text for inline formatting | `editor.spec.ts#bubble-menu` | `[ ]` | - |
| FR-ME-12 | Task Lists - checkbox support with click-to-toggle | `editor.spec.ts#task-lists` | `[ ]` | - |
| FR-ME-13 | Code Blocks - syntax-highlighted with language selector | `editor.spec.ts#code-blocks` | `[ ]` | - |
| FR-ME-14 | Markdown Round-Trip - lossless conversion | `editor.spec.ts#round-trip` | `[ ]` | - |
| FR-ME-15 | Drag & Drop Blocks - reorder content | `editor.spec.ts#drag-blocks` | `[ ]` | - |
| FR-ME-16 | Placeholder Text - hints in empty blocks | `editor.spec.ts#placeholders` | `[ ]` | - |
| FR-ME-17 | Keyboard Shortcuts - Cmd+B, Cmd+I, etc. | `editor.spec.ts#editor-shortcuts` | `[ ]` | - |

---

## FR-AC: AI Chat

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-AC-01 | Chat as Tab - AI conversation as dockview tab | `ai-chat.spec.ts#chat-tab` | `[ ]` | - |
| FR-AC-02 | Dockable - drag chat to any position | `ai-chat.spec.ts#dockable` | `[ ]` | - |
| FR-AC-03 | Context Awareness - AI knows open files | `ai-chat.spec.ts#context-open-files` | `[ ]` | - |
| FR-AC-04 | Multi-File Context - link multiple files to conversation | `ai-chat.spec.ts#multi-file-context` | `[ ]` | - |
| FR-AC-05 | Model Selection - choose from LiteLLM models | `ai-chat.spec.ts#model-selection` | `[ ]` | - |
| FR-AC-06 | Chat History - persist conversations per project | `ai-chat.spec.ts#history` | `[ ]` | - |
| FR-AC-07 | New Chat - start fresh conversation | `ai-chat.spec.ts#new-chat` | `[ ]` | - |
| FR-AC-08 | RAG Integration - query across knowledge base | `ai-chat.spec.ts#rag` | `[ ]` | - |
| FR-AC-09 | Code Blocks - syntax-highlighted in responses | `ai-chat.spec.ts#code-in-response` | `[ ]` | - |
| FR-AC-10 | Copy Response - copy to clipboard | `ai-chat.spec.ts#copy-response` | `[ ]` | - |

---

## FR-FE: AI File Editing (CRITICAL)

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-FE-01 | Edit Existing Files - modify in place | `ai-editing.spec.ts#edit-in-place`, `ai-editing.spec.ts#append`, `ai-editing.spec.ts#remove`, `ai-editing.spec.ts#update` | `[ ]` | - |
| FR-FE-02 | Diff Preview - show changes before applying | `ai-editing.spec.ts#diff-preview` | `[ ]` | - |
| FR-FE-03 | Append Operations - add entry without regenerating | `ai-editing.spec.ts#append-to-list` | `[ ]` | - |
| FR-FE-04 | Remove Operations - delete specific line | `ai-editing.spec.ts#remove-line` | `[ ]` | - |
| FR-FE-05 | Update Operations - change single value | `ai-editing.spec.ts#update-value` | `[ ]` | - |
| FR-FE-06 | Structure Preservation - respect template/format | `ai-editing.spec.ts#preserve-structure`, `ai-editing.spec.ts#preserve-frontmatter` | `[ ]` | - |
| FR-FE-07 | Edit History - track what/when/why | `ai-editing.spec.ts#edit-history` | `[ ]` | - |
| FR-FE-08 | Undo Edit - revert last AI edit | `ai-editing.spec.ts#undo` | `[ ]` | - |
| FR-FE-09 | Suggest vs Apply - approval before applying | `ai-editing.spec.ts#suggest-mode` | `[ ]` | - |
| FR-FE-10 | Bulk Edit Warning - warn on large changes | `ai-editing.spec.ts#bulk-warning` | `[ ]` | - |

---

## FR-PK: Personal Knowledge System

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-PK-01 | Inventory Management - structured inventories | `memory.spec.ts#inventories` | `[ ]` | - |
| FR-PK-02 | Personal Profiles - health, dietary, preferences | `memory.spec.ts#profiles` | `[ ]` | - |
| FR-PK-03 | Preference Tracking - likes/dislikes | `memory.spec.ts#preferences` | `[ ]` | - |
| FR-PK-04 | Memory Extraction - AI extracts insights | `memory.spec.ts#ai-extraction` | `[ ]` | - |
| FR-PK-05 | AI Context Integration - AI accesses profiles | `memory.spec.ts#context-integration`, `ai-context.spec.ts#memory-injection` | `[ ]` | - |
| FR-PK-06 | Structured Data Editor - UI for inventories | `memory.spec.ts#editor-ui` | `[ ]` | - |
| FR-PK-07 | Atomic Memories - one fact per memory | `memory.spec.ts#atomic` | `[ ]` | - |
| FR-PK-08 | Granular Editing - edit single values | `memory.spec.ts#granular-edit` | `[ ]` | - |
| FR-PK-09 | Memory Management UI - grid with inline edit | `memory.spec.ts#grid-ui` | `[ ]` | - |
| FR-PK-10 | Memory Status Control - active/archived/trash | `memory.spec.ts#status-transitions` | `[ ]` | - |
| FR-PK-11 | Memory Relevancy Display - show tier | `memory.spec.ts#tier-display` | `[ ]` | - |
| FR-PK-12 | Memory Filtering - by category, status, tier | `memory.spec.ts#filtering` | `[ ]` | - |
| FR-PK-13 | Memory Version History - track changes | `memory.spec.ts#version-history` | `[ ]` | - |
| FR-PK-14 | Memory Revert - restore previous version | `memory.spec.ts#revert` | `[ ]` | - |
| FR-PK-15 | Inline Value Edit - click to edit in grid | `memory.spec.ts#inline-edit` | `[ ]` | - |

---

## FR-PC: Project Context System

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-PC-01 | SOUL.md - project purpose, personality | `project-context.spec.ts#soul` | `[ ]` | - |
| FR-PC-02 | GUARDRAILS.md - never-dos and always-dos | `project-context.spec.ts#guardrails` | `[ ]` | - |
| FR-PC-03 | PROCEDURES.md - workflow index | `project-context.spec.ts#procedures` | `[ ]` | - |
| FR-PC-04 | CAPABILITIES.md - AI access registry | `project-context.spec.ts#capabilities` | `[ ]` | - |
| FR-PC-05 | SOURCES.md - data source inventory | `project-context.spec.ts#sources` | `[ ]` | - |
| FR-PC-06 | USER.md - user profile for project | `project-context.spec.ts#user-profile` | `[ ]` | - |
| FR-PC-07 | Project Instructions UI - edit via settings | `project-context.spec.ts#settings-ui` | `[ ]` | - |
| FR-PC-08 | Context Injection - .keep/ informs AI | `ai-context.spec.ts#keep-injection` | `[ ]` | - |

---

## FR-MP: Memory Provenance

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-MP-01 | Source Type - user_edit, file_extraction, conversation, inferred | `provenance.spec.ts#source-type` | `[ ]` | - |
| FR-MP-02 | Source Reference - link to file:line or conversation:message | `provenance.spec.ts#source-ref` | `[ ]` | - |
| FR-MP-03 | Learned Date - when fact was learned | `provenance.spec.ts#learned-date` | `[ ]` | - |
| FR-MP-04 | Confidence Level - high/medium/low | `provenance.spec.ts#confidence` | `[ ]` | - |
| FR-MP-05 | "Where did you learn this?" - query source | `provenance.spec.ts#query-source` | `[ ]` | - |
| FR-MP-06 | Jump to Source - click to open source | `provenance.spec.ts#jump-to-source` | `[ ]` | - |
| FR-MP-07 | Supersession Tracking - old value history | `provenance.spec.ts#supersession` | `[ ]` | - |
| FR-MP-08 | Category Tags - health, food, equipment | `provenance.spec.ts#categories` | `[ ]` | - |
| FR-MP-09 | Subject Tags - me, mom, house | `provenance.spec.ts#subjects` | `[ ]` | - |
| FR-MP-10 | Project Scoping - memories don't bleed | `provenance.spec.ts#project-scope` | `[ ]` | - |
| FR-MP-11 | Auto-Classification - AI suggests tags | `provenance.spec.ts#auto-classify` | `[ ]` | - |
| FR-MP-12 | Browse by Category - filter memories | `provenance.spec.ts#browse-category` | `[ ]` | - |

---

## FR-CM: Conversation Modes

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-CM-01 | Normal Mode - read files, write memories | `conversation.spec.ts#normal-mode` | `[ ]` | - |
| FR-CM-02 | Incognito Mode - read files, no memories | `conversation.spec.ts#incognito-mode` | `[ ]` | - |
| FR-CM-03 | Read-Only Mode - no edits or memories | `conversation.spec.ts#readonly-mode` | `[ ]` | - |
| FR-CM-04 | Mode Indicator - clear UI showing mode | `conversation.spec.ts#mode-indicator` | `[ ]` | - |
| FR-CM-05 | Mode Toggle - switch mid-conversation | `conversation.spec.ts#mode-toggle` | `[ ]` | - |
| FR-CM-06 | Project Selection - specify write target | `conversation.spec.ts#project-select` | `[ ]` | - |
| FR-CM-07 | Cross-Project Query - read multiple, write one | `cross-project.spec.ts#query` | `[ ]` | - |
| FR-CM-08 | Project Linking - define relationships | `cross-project.spec.ts#linking` | `[ ]` | - |
| FR-CM-09 | Cross-Project Citations - show source project | `cross-project.spec.ts#citations` | `[ ]` | - |
| FR-CM-10 | Cross-Project Inbox - send update requests | `cross-project.spec.ts#inbox-send` | `[ ]` | - |
| FR-CM-11 | Inbox Review UI - approve/deny requests | `cross-project.spec.ts#inbox-review` | `[ ]` | - |
| FR-CM-12 | Request Provenance - track approved changes | `cross-project.spec.ts#request-provenance` | `[ ]` | - |
| FR-CM-13 | Central Daily Journal - summary across projects | `journal.spec.ts#daily-generation` | `[ ]` | - |
| FR-CM-14 | Journal Storage - ~/.keep/journal/YYYY-MM-DD.md | `journal.spec.ts#storage` | `[ ]` | - |
| FR-CM-15 | Project Activity Tracking - log daily work | `journal.spec.ts#activity-tracking` | `[ ]` | - |
| FR-CM-16 | Key Items Extraction - important activities | `journal.spec.ts#key-items` | `[ ]` | - |
| FR-CM-17 | Temporal Queries - "When did I...?" | `journal.spec.ts#temporal-query` | `[ ]` | - |
| FR-CM-18 | Activity Timeline UI - calendar view | `journal.spec.ts#timeline-ui` | `[ ]` | - |
| FR-CM-19 | Task Extraction - detect task statements | `tasks.spec.ts#extraction` | `[ ]` | - |
| FR-CM-20 | Task Completion Tracking - done vs pending | `tasks.spec.ts#completion` | `[ ]` | - |
| FR-CM-21 | AI Personas - 5 toggleable modes | `personas.spec.ts#persona-modes` | `[ ]` | - |
| FR-CM-22 | Persona Selector UI - dropdown in chat | `personas.spec.ts#selector-ui` | `[ ]` | - |
| FR-CM-23 | Per-Project Persona Default - in SOUL.md | `personas.spec.ts#project-default` | `[ ]` | - |
| FR-CM-24 | Coach Persona - encouraging, accountability | `personas.spec.ts#coach-behavior` | `[ ]` | - |
| FR-CM-25 | Progress Celebration - acknowledge wins | `personas.spec.ts#celebration` | `[ ]` | - |
| FR-CM-26 | Gentle Nudges - remind about stale tasks | `personas.spec.ts#nudges` | `[ ]` | - |
| FR-CM-27 | Pattern Recognition - notice interests | `personas.spec.ts#patterns` | `[ ]` | - |
| FR-CM-28 | Weekly Summary - progress, trends | `personas.spec.ts#weekly-summary` | `[ ]` | - |
| FR-CM-32 | Global AI Preferences - communication style | `ai-settings.spec.ts#global-prefs` | `[ ]` | - |
| FR-CM-33 | Custom Instructions - free-text instructions | `ai-settings.spec.ts#custom-instructions` | `[ ]` | - |
| FR-CM-34 | Content Style Profiles - per content type | `ai-settings.spec.ts#style-profiles` | `[ ]` | - |
| FR-CM-35 | Style Profile Auto-Detection - recognize type | `ai-settings.spec.ts#style-detection` | `[ ]` | - |
| FR-CM-36 | AI Style Guide Generation - learn from docs | `ai-settings.spec.ts#style-guide-gen` | `[ ]` | - |
| FR-CM-37 | Style Guide Editor - edit STYLE_GUIDE.md | `ai-settings.spec.ts#style-editor` | `[ ]` | - |
| FR-CM-38 | Style-Template Linking - connect styles | `ai-settings.spec.ts#style-template` | `[ ]` | - |
| FR-CM-39 | Journal Ingest API - REST/MCP endpoint | `journal.spec.ts#ingest-api` | `[ ]` | - |
| FR-CM-40 | Journal Webhooks - receive from n8n, etc. | `journal.spec.ts#webhooks` | `[ ]` | - |
| FR-CM-41 | Source Tagging - tag by source app | `journal.spec.ts#source-tags` | `[ ]` | - |

---

## FR-SD: Soul Discovery / Onboarding

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-SD-01 | Purpose Questions - "What's this project for?" | `onboarding.spec.ts#purpose` | `[ ]` | - |
| FR-SD-02 | Value Questions - "How can I help?" | `onboarding.spec.ts#value` | `[ ]` | - |
| FR-SD-03 | Boundary Questions - "Things I should never do?" | `onboarding.spec.ts#boundaries` | `[ ]` | - |
| FR-SD-04 | File Generation - generate SOUL.md and GUARDRAILS.md | `onboarding.spec.ts#file-gen` | `[ ]` | - |
| FR-SD-05 | Template Options - Health, Finance, Learning | `onboarding.spec.ts#templates` | `[ ]` | - |
| FR-SD-06 | Skip Option - minimal defaults | `onboarding.spec.ts#skip` | `[ ]` | - |
| FR-SD-07 | Import Soul - copy from another project | `onboarding.spec.ts#import-soul` | `[ ]` | - |

---

## FR-DS: Data Safety

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-DS-01 | Soft Delete - to .keep/trash/, not permanent | `data-safety.spec.ts#soft-delete` | `[ ]` | - |
| FR-DS-02 | 30-Day Retention - recoverable for 30 days | `data-safety.spec.ts#retention` | `[ ]` | - |
| FR-DS-03 | Trash Browser - view and restore | `data-safety.spec.ts#trash-browser` | `[ ]` | - |
| FR-DS-04 | Permanent Delete - explicit empty trash | `data-safety.spec.ts#permanent-delete` | `[ ]` | - |
| FR-DS-05 | Edit Undo - revert recent edits | `data-safety.spec.ts#edit-undo` | `[ ]` | - |
| FR-DS-06 | Memory Recovery - restore deleted memories | `data-safety.spec.ts#memory-recovery` | `[ ]` | - |

---

## FR-SEC: Security

| ID | Requirement | Test Case(s) | Status | As-Built Notes |
|----|-------------|--------------|--------|----------------|
| FR-SEC-01 | Secret Detection - scan for API keys, passwords | `security.spec.ts#secret-detection` | `[ ]` | - |
| FR-SEC-02 | Secret Masking - replace with placeholders | `security.spec.ts#secret-masking` | `[ ]` | - |
| FR-SEC-03 | Secret Unmasking - restore in display only | `security.spec.ts#secret-unmasking` | `[ ]` | - |
| FR-SEC-04 | Masking Indicator - show "N secrets masked" | `security.spec.ts#masking-indicator` | `[ ]` | - |
| FR-SEC-05 | Override Option - send unmasked with warning | `security.spec.ts#override` | `[ ]` | - |

---

## AI Context Integration Tests (CRITICAL)

These verify the core value proposition - AI has proper context.

| Test ID | Requirement Area | Test Case | Status | Notes |
|---------|------------------|-----------|--------|-------|
| AC-CTX-01 | FR-AC-03, FR-AC-04 | Multiple open tabs in AI context | `[ ]` | - |
| AC-CTX-02 | FR-PK-05 | Hot memories always injected | `[ ]` | - |
| AC-CTX-03 | FR-PC-01, FR-PC-08 | Soul personality applied to responses | `[ ]` | - |
| AC-CTX-04 | FR-PC-02, FR-PC-08 | Guardrails enforced in responses | `[ ]` | - |
| AC-CTX-05 | FR-CM-21-28 | Persona mode affects response tone | `[ ]` | - |
| AC-EDIT-01 | FR-FE-06 | Template structure preserved on edit | `[ ]` | - |
| AC-EDIT-02 | FR-FE-01 | Only requested content modified | `[ ]` | - |
| AC-EDIT-03 | FR-FE-03 | Appends to list correctly | `[ ]` | - |
| AC-EDIT-04 | FR-FE-06 | Frontmatter preserved on edit | `[ ]` | - |
| AC-MEM-01 | FR-PK-05, FR-PK-11 | Memory tier hierarchy respected | `[ ]` | - |
| AC-MEM-02 | FR-MP-01-03 | Memory provenance tracked | `[ ]` | - |
| AC-MEM-03 | FR-MP-10 | Memories scoped to project | `[ ]` | - |

---

## Coverage Summary

Updated: _Not yet started_

| Category | Total FRs | Covered | Passing | Failing | Blocked |
|----------|-----------|---------|---------|---------|---------|
| FR-WS | 8 | 0 | 0 | 0 | 0 |
| FR-PM | 6 | 0 | 0 | 0 | 0 |
| FR-FM | 7 | 0 | 0 | 0 | 0 |
| FR-DV | 6 | 0 | 0 | 0 | 0 |
| FR-ME | 15 | 0 | 0 | 0 | 0 |
| FR-AC | 10 | 0 | 0 | 0 | 0 |
| FR-FE | 10 | 0 | 0 | 0 | 0 |
| FR-PK | 15 | 0 | 0 | 0 | 0 |
| FR-PC | 8 | 0 | 0 | 0 | 0 |
| FR-MP | 12 | 0 | 0 | 0 | 0 |
| FR-CM | 38 | 0 | 0 | 0 | 0 |
| FR-SD | 7 | 0 | 0 | 0 | 0 |
| FR-DS | 6 | 0 | 0 | 0 | 0 |
| FR-SEC | 5 | 0 | 0 | 0 | 0 |
| AC-* | 12 | 0 | 0 | 0 | 0 |
| **TOTAL** | **165** | **0** | **0** | **0** | **0** |

---

## Sprint Scope Mapping

| Sprint | FRs In Scope | Must Have Tests Before Ship |
|--------|--------------|----------------------------|
| Sprint 1 | FR-WS-*, FR-PM-01-03, FR-FM-01-03 | All listed |
| Sprint 2 | FR-FM-*, FR-DV-*, FR-ME-01-05 | All listed |
| Sprint 3 | FR-AC-*, FR-FE-*, AC-CTX-*, AC-EDIT-* | All listed |
| Sprint 4 | FR-PK-*, FR-PC-*, FR-MP-*, AC-MEM-* | All listed |
| Sprint 5 | FR-CM-01-06, FR-SD-*, FR-DS-* | All listed |
| Sprint 6 | FR-SEC-*, FR-CM-07-12 | All listed |
