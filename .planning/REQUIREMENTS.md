# Requirements: The Keep

**Defined:** 2026-03-18
**Core Value:** A single source of truth that all my AI agents can reference and update, with a human-friendly web UI for oversight

## v1 Requirements

Requirements for initial release, organized by version milestone.

### v0.1 — MVP Shell + Query API

Minimum viable product: basic navigation, search, and AI agent query access.

- [ ] **SHELL-01**: User can see all markdown files in a tree view sidebar
- [ ] **SHELL-02**: User can expand/collapse folders in the tree view
- [ ] **SHELL-03**: User can open files in tabs
- [ ] **SHELL-04**: User can have multiple tabs open simultaneously
- [ ] **SHELL-05**: User can close tabs individually
- [ ] **SHELL-06**: User can create new markdown files
- [ ] **SHELL-07**: User can rename files and folders
- [ ] **SHELL-08**: User can delete files and folders
- [ ] **SHELL-09**: User can move files between folders (drag-drop or move command)
- [ ] **SEARCH-01**: User can search across all files (full-text)
- [ ] **SEARCH-02**: Search results show file name and matching context
- [ ] **SEARCH-03**: User can click search result to open file
- [ ] **API-01**: External agents can query files via REST API (read-only)
- [ ] **API-02**: API returns file content in structured format
- [ ] **API-03**: API supports search queries
- [ ] **KEEPER-01**: User can chat with Keeper in a sidebar panel
- [ ] **KEEPER-02**: Keeper can search documents to answer questions (RAG)
- [ ] **KEEPER-03**: Keeper can propose document updates as diffs
- [ ] **KEEPER-04**: User can approve or reject proposed diffs
- [ ] **KEEPER-05**: Approved diffs are applied to the document

### v0.2 — Rich Editor + Auth + Polish

Full editing experience with authentication.

- [ ] **EDIT-01**: User can edit files with TipTap rich markdown editor
- [ ] **EDIT-02**: Editor supports headings, bold, italic, code blocks
- [ ] **EDIT-03**: Editor supports tables and checklists (GFM)
- [ ] **EDIT-04**: Editor supports slash menu for block insertion
- [ ] **EDIT-05**: Editor saves as clean markdown (lossless roundtrip)
- [ ] **EDIT-06**: Editor shows dirty indicator when unsaved
- [ ] **EDIT-07**: User can save with Cmd+S
- [ ] **AUTH-01**: User must authenticate via Authentik SSO
- [ ] **AUTH-02**: Unauthenticated users cannot access the app
- [ ] **AUTH-03**: API requests require bearer token authentication
- [ ] **UI-01**: User can toggle between dark and light theme
- [ ] **UI-02**: Theme follows system preference by default
- [ ] **UI-03**: User can open command palette with Cmd+K
- [ ] **UI-04**: Command palette supports fuzzy search for files
- [ ] **UI-05**: Command palette supports fuzzy search for commands
- [ ] **UI-06**: Keyboard shortcuts work (save, search, new file, tab switch)

### v0.3 — Inbox + Workflows

Receive and process external inputs.

- [ ] **INBOX-01**: System has an inbox for incoming items
- [ ] **INBOX-02**: External agents can submit to inbox via API
- [ ] **INBOX-03**: User can view inbox items in a list
- [ ] **INBOX-04**: User can triage inbox items (today/later/archive)
- [ ] **INBOX-05**: Keeper can summarize pending inbox items
- [ ] **INBOX-06**: Keeper can propose where to file inbox content
- [ ] **WORKFLOW-01**: n8n can send webhooks to inbox API
- [ ] **WORKFLOW-02**: Inbox items include source metadata

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Entity Graph

- **ENTITY-01**: System extracts entities (people, projects, tech) from documents
- **ENTITY-02**: Entities are stored in graph database
- **ENTITY-03**: User can view entity pages showing all mentions
- **ENTITY-04**: Keeper can query entity relationships

### Advanced Features

- **DAILY-01**: User can create daily notes from template
- **BACKLINK-01**: User can see what documents link to current document
- **HISTORY-01**: User can view version history of a document (git)
- **HISTORY-02**: User can restore previous versions
- **MEMORY-01**: Keeper remembers past conversations across sessions
- **WRITE-01**: User can get inline AI writing assistance

### Platform

- **MULTI-01**: User can organize files into projects with separate permissions
- **AGENT-01**: External agents can write to documents (with approval queue)

### Future Research (Obsidian-Inspired)

*Items to research from popular Obsidian plugins and use cases:*

- **TASK-01**: Automatic task management system (like Obsidian Tasks plugin)
- **KANBAN-01**: Kanban board view for tasks/projects
- **TEMPLATE-01**: Template system for common document types
- **CALENDAR-01**: Calendar view for dated notes and tasks
- **DATAVIEW-01**: Query language for structured data in notes

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Plugin ecosystem | The Keep exists to avoid Obsidian's over-engineering trap |
| Graph visualization (force-directed) | Visually impressive but rarely actionable |
| Real-time collaboration | Single-user system, massive engineering cost |
| Mobile native app | Web-first, PWA stretch goal |
| Kanban / project management | Knowledge hub, not project manager |
| E2E encryption | Incompatible with server-side AI processing |
| Custom themes/CSS | Opinionated design, focus on function |

## Technical Constraints

| Constraint | Requirement |
|------------|-------------|
| Port Block | 5000-5099 (web: 5000, db: 5010, api: 5020) |
| Dev Target | Banner (10.0.0.33) |
| Prod Target | Hulk (10.0.0.32) |
| LLM Proxy | LiteLLM at http://10.0.0.27:2764/v1 |
| Auth | Authentik SSO |
| File Storage | Markdown files on disk (git-tracked) |
| Database | PostgreSQL with pgvector |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHELL-01 to SHELL-09 | Phase 1 | Pending |
| SEARCH-01 to SEARCH-03 | Phase 1 | Pending |
| API-01 to API-03 | Phase 1 | Pending |
| KEEPER-01 to KEEPER-05 | Phase 2 | Pending |
| EDIT-01 to EDIT-07 | Phase 2 | Pending |
| AUTH-01 to AUTH-03 | Phase 3 | Pending |
| UI-01 to UI-06 | Phase 3 | Pending |
| INBOX-01 to INBOX-06 | Phase 4 | Pending |
| WORKFLOW-01 to WORKFLOW-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-18*
*Last updated: 2026-03-18 after initial definition*
