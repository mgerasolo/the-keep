# Roadmap: The Keep

## Overview

The Keep delivers a Cursor-like personal knowledge hub in five phases, following the user's version milestones. Phase 1 builds the foundation shell -- a usable file browser with tree view, tabs, search, and CRUD. Phase 2 adds the Keeper AI assistant and a read-only query API for external agents. Phase 3 upgrades editing with a TipTap rich markdown editor. Phase 4 secures the app behind Authentik SSO and adds IDE-quality UX (command palette, themes, keyboard shortcuts). Phase 5 completes v1 with an inbox system and n8n workflow integration for receiving external data.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation Shell** - File tree, tabs, search, and file CRUD in a Cursor-like web UI (v0.1)
- [ ] **Phase 2: Keeper + Query API** - AI assistant with RAG and diff proposals, plus read-only API for external agents (v0.1)
- [ ] **Phase 3: Rich Editor** - TipTap markdown editor with slash menu, GFM support, and lossless roundtrip (v0.2)
- [ ] **Phase 4: Auth + UI Polish** - Authentik SSO, command palette, themes, and keyboard shortcuts (v0.2)
- [ ] **Phase 5: Inbox + Workflows** - Inbox system for incoming data with n8n webhook integration (v0.3)

## Phase Details

### Phase 1: Foundation Shell
**Goal**: Users can browse, search, and manage their markdown knowledge base through a Cursor-like file explorer
**Depends on**: Nothing (first phase)
**Requirements**: VIEW-01, VIEW-02, VIEW-03, SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05, SHELL-06, SHELL-07, SHELL-08, SHELL-09, SEARCH-01, SEARCH-02, SEARCH-03
**Success Criteria** (what must be TRUE):
  1. User can see their full file/folder hierarchy in a sidebar tree and expand/collapse folders
  2. User can open files in tabs, have multiple tabs open, and close them individually
  3. User can create, rename, delete, and move markdown files and folders
  4. User can search across all files and click a result to open that file in a tab
  5. File viewer displays markdown with line numbers, syntax highlighting for code blocks, and distinct frontmatter styling
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding and file system backend
- [ ] 01-02: File tree sidebar and tab system
- [ ] 01-03: File CRUD operations and full-text search

### Phase 2: Keeper + Query API
**Goal**: Users can converse with an AI assistant grounded in their documents, and external agents can query the knowledge base via REST API
**Depends on**: Phase 1
**Requirements**: KEEPER-01, KEEPER-02, KEEPER-03, KEEPER-04, KEEPER-05, API-01, API-02, API-03
**Success Criteria** (what must be TRUE):
  1. User can open a chat panel and ask Keeper questions about their documents
  2. Keeper searches and cites relevant documents when answering (RAG)
  3. Keeper can propose document changes as visible diffs that the user can approve or reject
  4. External agents can query files and search content via authenticated REST API
**Plans**: TBD

Plans:
- [ ] 02-01: AI infrastructure (embeddings, vector search, LiteLLM integration)
- [ ] 02-02: Keeper chat UI with RAG and diff proposals
- [ ] 02-03: Read-only REST API for external agents

### Phase 3: Rich Editor
**Goal**: Users can edit documents with a rich TipTap editor that stores clean, lossless markdown
**Depends on**: Phase 1
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07, EDIT-08
**Success Criteria** (what must be TRUE):
  1. User can edit files with formatted text (headings, bold, italic, code blocks, tables, checklists)
  2. User can insert blocks via slash menu
  3. Editor saves as clean markdown with no data loss on roundtrip (markdown -> editor -> markdown)
  4. User sees a dirty indicator when changes are unsaved and can save with Cmd+S
  5. Files are auto-formatted with Prettier on save
**Plans**: TBD

Plans:
- [ ] 03-01: TipTap editor integration with markdown roundtrip validation
- [ ] 03-02: Slash menu, GFM extensions, and save mechanics

### Phase 4: Auth + UI Polish
**Goal**: The Keep is secured behind SSO and has the keyboard-driven UX of a professional IDE
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06
**Success Criteria** (what must be TRUE):
  1. User must authenticate via Authentik SSO before accessing the app
  2. Unauthenticated users are redirected to login; API requests require bearer tokens
  3. User can toggle between dark and light themes (defaults to system preference)
  4. User can open command palette with Cmd+K and fuzzy-search files and commands
  5. Standard keyboard shortcuts work (save, search, new file, tab switching)
**Plans**: TBD

Plans:
- [ ] 04-01: Authentik SSO integration (web + API auth)
- [ ] 04-02: Theme system and command palette
- [ ] 04-03: Keyboard shortcuts and UX polish

### Phase 5: Inbox + Workflows
**Goal**: Users can receive, view, and triage incoming information from external sources through an inbox system
**Depends on**: Phase 2
**Requirements**: INBOX-01, INBOX-02, INBOX-03, INBOX-04, INBOX-05, INBOX-06, WORKFLOW-01, WORKFLOW-02
**Success Criteria** (what must be TRUE):
  1. The system has an inbox that external agents and n8n can submit items to via API
  2. User can view inbox items in a list with source metadata
  3. User can triage inbox items (today/later/archive)
  4. Keeper can summarize pending items and propose where to file inbox content
**Plans**: TBD

Plans:
- [ ] 05-01: Inbox data model and API endpoints
- [ ] 05-02: Inbox UI and triage workflow
- [ ] 05-03: Keeper inbox integration and n8n webhooks

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

Note: Phases 3 and 4 depend on Phase 1 (not Phase 2), so they could theoretically execute in parallel with Phase 2. However, sequential execution is recommended for a solo developer.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Shell | 0/3 | Not started | - |
| 2. Keeper + Query API | 0/3 | Not started | - |
| 3. Rich Editor | 0/2 | Not started | - |
| 4. Auth + UI Polish | 0/3 | Not started | - |
| 5. Inbox + Workflows | 0/3 | Not started | - |
