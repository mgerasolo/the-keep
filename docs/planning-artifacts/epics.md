---
stepsCompleted: [1, 2, '3-partial']
storiesWritten:
  - epic0: 9
  - epic1: 9
  - epic2: 13
  - epic3: 11
  - epic4: 10
  - epic5: 10
  - epic6: 4
  - epic7: 4
  - epic8: 5
  - epic9: 5
  - epic10: 4
  - epic11: 4
storiesPending: []
inputDocuments:
  - docs/planning-artifacts/prd.md
  - docs/planning-artifacts/architecture.md
  - docs/planning-artifacts/ux-design.md
---

# The Keep - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for The Keep, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements (165 Total)

#### FR-WS: Workspace Shell (8)
- FR-WS-01: dockview Panel System - Draggable tabs, split panes, dock anywhere (P0)
- FR-WS-02: Activity Bar - Far-left icon bar for context switching (P0)
- FR-WS-03: File Browser Panel - Tree view with folders, file icons, context menus (P0)
- FR-WS-04: Command Palette - Cmd+K / Ctrl+K for quick actions (P1)
- FR-WS-05: Tab System - Multiple files open, drag tabs between panes (P0)
- FR-WS-06: Layout Persistence - Save/restore panel arrangements per project (P0)
- FR-WS-07: Keyboard Shortcuts - Standard IDE shortcuts (P1)
- FR-WS-08: Dark/Light Theme - User-selectable theme (P2)

#### FR-PM: Project Management (6)
- FR-PM-01: Multi-Project Support - Isolated project contexts (P0)
- FR-PM-02: Project Switcher - Activity bar icons AND/OR header dropdown (P0)
- FR-PM-03: Isolated Context - Each project has own files, chat, settings, layout (P0)
- FR-PM-04: Project Metadata - Name, icon, description, created date (P1)
- FR-PM-05: Project CRUD - Create, rename, archive projects (P0)
- FR-PM-06: Project Settings - Per-project AI model, RAG settings (P1)

#### FR-FM: File Management (7)
- FR-FM-01: File Upload - Drag-drop upload (P0)
- FR-FM-02: Folder Management - Create, rename, delete, move folders (P0)
- FR-FM-03: File Operations - Rename, delete, move, duplicate files (P0)
- FR-FM-04: Multi-Select - Select multiple files for bulk operations (P1)
- FR-FM-05: Search Files - Filter file tree by name (P1)
- FR-FM-06: File Icons - Type-appropriate icons (P1)
- FR-FM-07: Context Menu - Right-click menu for file operations (P0)

#### FR-DV: Document Viewing (6)
- FR-DV-01: Markdown Rendering - Display formatted markdown (P0)
- FR-DV-02: PDF Viewing - Render PDFs with zoom, page navigation (P0)
- FR-DV-03: Image Viewing - Display images with zoom (P0)
- FR-DV-04: Code Viewing - Syntax-highlighted code files (P1)
- FR-DV-05: Plain Text - Display text files (P0)
- FR-DV-06: Side-by-Side - View multiple files in split panes (P0)

#### FR-ME: Markdown Editing (17)
- FR-ME-01: Rich Toolbar - Bold, italic, headers, lists, links, tables (P0)
- FR-ME-02: Source Mode - Monaco for raw markdown editing (P0)
- FR-ME-03: Preview Mode - TipTap WYSIWYG with full editing (P0)
- FR-ME-04: Split Edit/Preview - Side-by-side raw and rendered (P1)
- FR-ME-05: Auto-Save - Save changes automatically (P0)
- FR-ME-06: Wikilinks - Support `[[filename]]` style links (P1)
- FR-ME-07: Tables - Easy table creation and editing (P1)
- FR-ME-10: Slash Commands - `/code`, `/task`, `/heading`, etc. (P0)
- FR-ME-11: Bubble Menu - Select text → inline formatting options (P0)
- FR-ME-12: Task Lists - Native checkbox support (P0)
- FR-ME-13: Code Blocks - Syntax-highlighted with language selector (P0)
- FR-ME-14: Markdown Round-Trip - Lossless conversion (P0)
- FR-ME-15: Drag & Drop Blocks - Reorder content (P1)
- FR-ME-16: Placeholder Text - Show hints in empty blocks (P1)
- FR-ME-17: Keyboard Shortcuts - Standard formatting (P0)

#### FR-AC: AI Chat (10)
- FR-AC-01: Chat as Tab - AI conversation opens as dockview tab (P0)
- FR-AC-02: Dockable - Drag chat to any position, split, pop-out (P0)
- FR-AC-03: Context Awareness - AI knows which files are open (P0)
- FR-AC-04: Multi-File Context - Link multiple files to conversation (P0)
- FR-AC-05: Model Selection - Choose from available LiteLLM models (P0)
- FR-AC-06: Chat History - Persist conversations per project (P0)
- FR-AC-07: New Chat - Start fresh conversation (P0)
- FR-AC-08: RAG Integration - Query across project knowledge base (P1)
- FR-AC-09: Code Blocks - Syntax-highlighted code in responses (P1)
- FR-AC-10: Copy Response - Copy AI responses to clipboard (P1)

#### FR-PK: Personal Knowledge System (15)
- FR-PK-01: Inventory Management - Create/edit structured inventories (P1)
- FR-PK-02: Personal Profiles - Health criteria, dietary restrictions (P1)
- FR-PK-03: Preference Tracking - Likes/dislikes, taste preferences (P1)
- FR-PK-04: Memory Extraction - AI extracts insights from conversations (P2)
- FR-PK-05: AI Context Integration - AI accesses profiles + inventories (P1)
- FR-PK-06: Structured Data Editor - UI for creating/editing inventory items (P1)
- FR-PK-07: Atomic Memories - Each memory = ONE fact/value (P1)
- FR-PK-08: Granular Editing - Edit single memory values (P1)
- FR-PK-09: Memory Management UI - Grid/table view with inline editing (P1)
- FR-PK-10: Memory Status Control - Active, Archived, Trash (P1)
- FR-PK-11: Memory Relevancy Display - Show tier (Hot/Warm/Cold) (P2)
- FR-PK-12: Memory Filtering - Filter by category, status, tier (P1)
- FR-PK-13: Memory Version History - Track all changes (P1)
- FR-PK-14: Memory Revert - Restore to any previous version (P1)
- FR-PK-15: Inline Value Edit - Click any memory value, edit in place (P0)

#### FR-KG: Knowledge Graph/RAG (5)
- FR-KG-01: Auto-Indexing - Files automatically indexed for RAG (P0)
- FR-KG-02: Explicit Inclusion - Manually select files to include/exclude (P1)
- FR-KG-03: Semantic Search - Search by meaning, not just keywords (P0)
- FR-KG-04: Document Relationships - Track relationships between documents (P2)
- FR-KG-05: Bi-directional Links - `[[wikilinks]]` create two-way connections (P2)

#### FR-EV: Embedded Views (3)
- FR-EV-01: Embedded Browser - View external URLs in tabs (P2)
- FR-EV-02: Workflow View - Task list / workflow status panel (P2)
- FR-EV-03: Bookmarked Views - Save frequently used embedded URLs (P2)

#### FR-FE: AI File Editing (10) - CORE DIFFERENTIATOR
- FR-FE-01: Edit Existing Files - AI modifies files in place (P0)
- FR-FE-02: Diff Preview - Show exactly what will change before applying (P0)
- FR-FE-03: Append Operations - Add new entry to list (P0)
- FR-FE-04: Remove Operations - Delete specific line/item (P0)
- FR-FE-05: Update Operations - Change single value in place (P0)
- FR-FE-06: Structure Preservation - Respect existing file format/template (P0)
- FR-FE-07: Edit History - Track what changed, when, and why (P1)
- FR-FE-08: Undo Edit - Revert last AI edit (P0)
- FR-FE-09: Suggest vs Apply - AI can suggest edit for approval (P1)
- FR-FE-10: Bulk Edit Warning - Warn when edit would affect large portion (P1)

#### FR-PC: Project Context System (8)
- FR-PC-01: SOUL.md - Project purpose, how AI adds value (P0)
- FR-PC-02: GUARDRAILS.md - Explicit never-dos and always-dos (P0)
- FR-PC-03: PROCEDURES.md - Index of how-to workflows (P1)
- FR-PC-04: CAPABILITIES.md - Registry of what AI can access (P1)
- FR-PC-05: SOURCES.md - Auto-maintained data source inventory (P1)
- FR-PC-06: USER.md - User profile specific to this project (P1)
- FR-PC-07: Project Instructions UI - Edit soul/guardrails via settings (P0)
- FR-PC-08: Context Injection - .keep/ files inform every AI interaction (P0)

#### FR-SD: Soul Discovery/Onboarding (7)
- FR-SD-01: Purpose Questions - "What's this project for?" (P0)
- FR-SD-02: Value Questions - "How can I help you here?" (P0)
- FR-SD-03: Boundary Questions - "Any things I should never do?" (P0)
- FR-SD-04: File Generation - Generate SOUL.md and GUARDRAILS.md (P0)
- FR-SD-05: Template Options - Pre-built templates (P1)
- FR-SD-06: Skip Option - Allow skipping with minimal defaults (P1)
- FR-SD-07: Import Soul - Copy soul from another project (P2)

#### FR-MP: Memory Provenance & Classification (12)
- FR-MP-01: Source Type - Track: user_edit, file_extraction, conversation (P0)
- FR-MP-02: Source Reference - Link to specific file:line or conversation (P0)
- FR-MP-03: Learned Date - When was this fact learned (P0)
- FR-MP-04: Confidence Level - High, Medium, Low (P1)
- FR-MP-05: "Where did you learn this?" - Query to show memory source (P0)
- FR-MP-06: Jump to Source - Click provenance → opens source (P1)
- FR-MP-07: Supersession Tracking - Track when memory replaces older value (P1)
- FR-MP-08: Category Tags - Classify memories (P0)
- FR-MP-09: Subject Tags - Tag who/what memory is about (P0)
- FR-MP-10: Project Scoping - Memories belong to specific project (P0)
- FR-MP-11: Auto-Classification - AI suggests category/tags (P1)
- FR-MP-12: Browse by Category - Filter memories by category (P1)

#### FR-CM: Conversation Modes (41)
- FR-CM-01 to FR-CM-06: Basic modes (Normal, Incognito, Read-Only, indicators)
- FR-CM-07 to FR-CM-12: Cross-project features (MVP+2-3)
- FR-CM-13 to FR-CM-20: Daily Journal features (MVP+3)
- FR-CM-21 to FR-CM-28: AI Personas (MVP+3)
- FR-CM-32 to FR-CM-41: Global preferences, style profiles, integrations

#### FR-DS: Data Safety (6)
- FR-DS-01: Soft Delete - Deleted files go to trash (P0)
- FR-DS-02: 30-Day Retention - Trash items recoverable (P0)
- FR-DS-03: Trash Browser - UI to view and restore (P0)
- FR-DS-04: Permanent Delete - Explicit action to empty trash (P1)
- FR-DS-05: Edit Undo - Revert recent file edits (P0)
- FR-DS-06: Memory Recovery - Restore deleted memories (P1)

#### FR-TS: Trusted Sources (6)
- FR-TS-01 to FR-TS-06: Source registry, domain ratings, AI weighting

#### FR-DV2: Derived Views (6)
- FR-DV2-01 to FR-DV2-06: Source-linked views, staleness detection, templates

#### FR-WS2: Web Search Integration (4)
- FR-WS2-01 to FR-WS2-04: Web search toggle, combined results, source distinction

#### FR-IP: Import & Processing (33)
- FR-IP-01 to FR-IP-17: Core import (bulk, audit, cleanup, extraction)
- FR-IP-20 to FR-IP-23: Web import via Crawl4AI (MVP+4)
- FR-IP-30 to FR-IP-33: YouTube transcript import via n8n (MVP+4)

#### FR-VC: Version Control (8)
- FR-VC-01 to FR-VC-08: File history, diff view, revert, auto-versioning

#### FR-HA: AI High Availability (6)
- FR-HA-01 to FR-HA-06: Primary AI, fallback chain, health check

#### FR-US: Unified Search (5)
- FR-US-01 to FR-US-05: Omni-search, filters, recent items, saved searches

#### FR-AS: Advanced Search (9)
- FR-AS-01 to FR-AS-09: Vector storage, semantic search, hybrid search

#### FR-LI: AI Learning & Feedback (7)
- FR-LI-01 to FR-LI-07: Response rating, feedback logging, correction tracking

#### FR-KB: Keyboard Navigation (10)
- FR-KB-01 to FR-KB-10: Command palette, file navigation, shortcuts

#### FR-TM: Task Management (7) - MVP+2
- FR-TM-01 to FR-TM-07: Checkbox tasks, due dates, kanban view

#### FR-TA: Tagging & Actions (11) - MVP+2
- FR-TA-01 to FR-TA-11: Inline tags, due dates, reminders, tag queries

#### FR-NO: Notifications (7) - MVP+2
- FR-NO-01 to FR-NO-07: In-app notifications, due date alerts, notification center

#### FR-GR: Grist Integration (5) - MVP+6
- FR-GR-01 to FR-GR-05: Grist tab, table view, RAG integration

#### FR-EX: Export (4)
- FR-EX-01 to FR-EX-04: Export project, memories, conversations

#### FR-MO: Mobile Interface (10) - MVP+1
- FR-MO-01 to FR-MO-10: Responsive layout, touch-friendly, PWA support

#### FR-IG: Image Generation (6) - MVP+4
- FR-IG-01 to FR-IG-06: Generate from prompt, insert into document

#### FR-AD: Admin & System Settings (NEW - identified during epic extraction)
- FR-AD-01: Admin Dashboard - System-level settings panel (MVP+1)
- FR-AD-02: Plugin Management - Install, enable, disable, configure plugins (MVP+2)
- FR-AD-03: Integration Registry - Manage external data source connections (MVP+2)
- FR-AD-04: User Management - Add, edit, disable users (MVP+4 multi-user)
- FR-AD-05: Role Management - Define roles and permissions (MVP+4)
- FR-AD-06: System Health Dashboard - View service status, storage usage (MVP+1)
- FR-AD-07: Backup Settings - Configure backup schedules, retention (MVP+1)
- FR-AD-08: AI Model Configuration - Add/remove models from LiteLLM (MVP+1)
- FR-AD-09: External Data Sources - Configure database connections, APIs (MVP+2)
- FR-AD-10: Audit Log - View system-level activity log (MVP+2)

### Non-Functional Requirements (75+ Total)

#### NFR-P: Performance (24)
- Page load, file operations, AI response times, memory limits, concurrency

#### NFR-R: Reliability (8)
- 99% uptime, zero data loss, auto-save, graceful degradation

#### NFR-S: Security (24)
- Authentication (Authentik SSO), session management, encryption, input validation

#### NFR-SC: Scalability (7)
- 10,000+ files per project, 100GB+ storage, 10,000+ memories

#### NFR-A: Accessibility (8)
- WCAG 2.1 AA, keyboard navigation, screen reader support, color contrast

#### NFR-U: Usability (8)
- <10 min learnability, <3 clicks for common tasks, undo support

#### NFR-C: Compatibility
- Chrome/Firefox/Safari/Edge, desktop-first, mobile MVP+1

#### NFR-MO: Mobile-Specific (10) - MVP+1
- Touch targets, swipe gestures, PWA, offline viewing

#### NFR-O: Observability (7)
- Loki logging, Prometheus metrics, Grafana dashboards, Sentry errors

#### NFR-BR: Backup & Recovery (7)
- File versioning, daily backup, <1 hour recovery time

#### NFR-M: Maintainability (8)
- TypeScript strict mode, 80%+ test coverage, CI/CD

#### NFR-H: Health & Self-Healing (26)
- Health checks, circuit breakers, auto-recovery

#### NFR-L: Logging & Diagnostics (24)
- Request tracing, structured logging, debug modes

#### NFR-AO: Autonomous Operations
- Self-healing, auto-scaling preparation

### Additional Requirements (from Architecture)

**Starter Template:** Greenfield Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- dockview for panel management
- PostgreSQL + pgvector for data and embeddings
- MinIO for file storage
- Redis for caching and sessions
- LiteLLM proxy for AI models

**Infrastructure:**
- Docker Compose deployment
- Traefik reverse proxy
- Authentik SSO integration
- Observability stack (Loki/Prometheus/Grafana)

**Data Architecture:**
- Multi-user ready schema (user_id on all tables)
- Soft delete with 30-day retention
- File versioning

**Plugin & Integration Architecture (MVP+2 foundation):**
- MCP plugin system for extensibility
- External data source connectors (databases, APIs)
- KnowledgeStack integration preparation (v2+)
- Plugin registry and lifecycle management
- Secure credential storage for integrations

**Admin Architecture (MVP+1 foundation):**
- System settings separate from user/project settings
- Role-based access control foundation
- Audit logging infrastructure

### UX Design Requirements

#### UX-DR-01: Dockview Panel System
- Implement VS Code-style dockable panels with dockview library
- Support drag-and-drop tabs, split views, floating panels

#### UX-DR-02: Activity Bar Navigation
- 48px fixed activity bar on far left
- Project icons in top section, global actions in bottom section
- Hover tooltips, active state indicators

#### UX-DR-03: File Browser Sidebar
- Resizable (180-400px), tree view with expand/collapse
- File type icons with semantic colors
- Context menu for operations

#### UX-DR-04: Tab System
- 36px tab bar with file type icons
- Modified indicator (●), drag to reorder
- Pinned tabs support

#### UX-DR-05: AI Chat Panel
- Model selector with local/API categorization
- Context file chips (add/remove)
- Streaming responses with markdown rendering

#### UX-DR-06: Memory Editor Component
- Inline editing capability
- Pending review section for AI-extracted suggestions
- Source provenance display

#### UX-DR-07: Command Palette (Cmd+K)
- Full-width overlay, fuzzy search
- Categorized results (files, commands, recent)

#### UX-DR-08: Dark Theme (Default)
- Background: #1a1a1a to #252525
- Text: #ffffff primary, #888888 secondary
- Accent: #569cd6 (blue)

#### UX-DR-09: Cursor-Style Editor Features
- Breadcrumb path bar
- Syntax highlighting (prettify)
- Indent guide lines
- Collapsible headers (code folding)
- Line numbers

#### UX-DR-10: TipTap WYSIWYG Mode
- Source/Preview toggle with keyboard shortcut
- Bubble menu for inline formatting
- Slash commands for block insertion

#### UX-DR-11: AI Personas Selector (Party Mode)
- Dropdown with 5 personas: Default, Coach, Teacher, Analyst, Creative
- Badge display in chat header

#### UX-DR-12: Memory Grid View (Party Mode)
- Spreadsheet-like interface for bulk memory management
- Column configuration (Key, Value, Category, Tier, Status)
- Inline editing, multi-select, bulk actions

#### UX-DR-13: Cross-Project Inbox (Party Mode)
- Panel showing pending requests from other projects
- Approve/Deny workflow with diff preview

#### UX-DR-14: Daily Journal View (Party Mode)
- Timeline of activities across all projects
- Calendar navigation
- Activity type filtering

#### UX-DR-15: Conversation Mode Indicator (Party Mode)
- Visual badge showing Normal/Incognito mode
- Purple border for incognito

#### UX-DR-16: Memory Version History (Party Mode)
- Full version list with timestamps
- Revert capability with confirmation

### FR Coverage Map

| FR Category | Epic | Description |
|-------------|------|-------------|
| Infrastructure/NFRs | Epic 0 | Developer foundation (deploy, DB, API, logging, CI/CD, testing) |
| FR-WS-01 to FR-WS-08 | Epic 1 | Workspace Shell (dockview, activity bar, tabs) |
| FR-PM-01 to FR-PM-06 | Epic 1 | Project Management |
| FR-FM-01 to FR-FM-07 | Epic 1 | File Management |
| FR-DV-01 to FR-DV-06 | Epic 1 | Document Viewing |
| FR-ME-01 to FR-ME-17 | Epic 2 | Markdown Editing |
| FR-AC-01 to FR-AC-10 | Epic 3 | AI Chat |
| FR-KG-01 to FR-KG-05 | Epic 3 | Knowledge Graph/RAG |
| FR-AS-01 to FR-AS-09 | Epic 3 | Advanced Search |
| FR-FE-01 to FR-FE-10 | Epic 4 | AI File Editing (Core Differentiator) |
| FR-PK-01 to FR-PK-15 | Epic 5 | Personal Knowledge System |
| FR-MP-01 to FR-MP-12 | Epic 5 | Memory Provenance |
| FR-PC-01 to FR-PC-08 | Epic 6 | Project Context System |
| FR-SD-01 to FR-SD-07 | Epic 6 | Soul Discovery |
| FR-DS-01 to FR-DS-06 | Epic 7 | Data Safety |
| FR-VC-01 to FR-VC-08 | Epic 7 | Version Control |
| FR-IP-01 to FR-IP-17 | Epic 8 | Import & Processing (Core) |
| FR-US-01 to FR-US-05 | Epic 9 | Unified Search |
| FR-KB-01 to FR-KB-10 | Epic 9 | Keyboard Navigation |
| FR-HA-01 to FR-HA-06 | Epic 10 | AI High Availability |
| FR-LI-01 to FR-LI-07 | Epic 10 | AI Learning & Feedback |
| FR-CM-01 to FR-CM-06 | Epic 11 | Conversation Modes |
| FR-MO-01 to FR-MO-10 | Epic 12 (MVP+1) | Mobile Interface |
| FR-AD-01 to FR-AD-10 | Epic 13 (MVP+1) | Admin & System Settings |
| FR-TM, FR-TA, FR-NO | Epic 14 (MVP+2) | Task Management |
| FR-EV, FR-TS, FR-DV2, FR-WS2, FR-EX, FR-GR, FR-IG | Epic 15 (MVP+2+) | Advanced Features |

---

---

## Epic 0: Infrastructure & Developer Foundation

**Goal:** Developers have a fully operational platform with deployment, observability, testing, and API patterns established. No direct user value - this is the foundation that enables everything else.

---

### Story 0.1: Infrastructure Stack Deployment

**As a** developer,
**I want** the application infrastructure deployed to Banner,
**So that** all subsequent features have a stable foundation to build upon.

**Acceptance Criteria:**

**Given** a fresh Banner environment
**When** I run `docker compose up -d`
**Then** the following services are running:
- PostgreSQL 16 with pgvector extension
- Redis 7
- MinIO with `the-keep` bucket created
- Next.js 15 application container

**And** the app is accessible at `https://the-keep.nextlevelguild.com`
**And** `/api/health` returns `{ "status": "ok", "services": { "db": "ok", "redis": "ok", "minio": "ok" } }`
**And** Traefik routes traffic with valid SSL certificate

**Technical Notes:**
- Port: 5010 (primary app)
- Docker context: Banner
- Secrets from `/mnt/foundry_devlab/secrets/env/`

---

### Story 0.2: Database Schema & Migrations

**As a** developer,
**I want** the core database schema created with a seeded user,
**So that** features can persist data tied to a real user record.

**Acceptance Criteria:**

**Given** the infrastructure stack is running
**When** I run database migrations
**Then** the following tables exist:
- `users` (id, username, email, name, created_at)
- `projects` (id, user_id, name, icon, description, settings, created_at, archived_at)
- `files` (id, project_id, path, name, mime_type, size, minio_key, created_at, deleted_at)
- `folders` (id, project_id, parent_id, name, path, created_at, deleted_at)

**And** seed data creates user:
```
id: 1
username: mgerasolo
email: matt@gerasolo.com
name: Matt
```

**And** all tables reference `user_id` foreign key
**And** pgvector extension is enabled
**And** Drizzle ORM configured with TypeScript types
**And** `npm run db:migrate` runs migrations in CI/CD

---

### Story 0.3: Auth-Ready Architecture

**As a** developer,
**I want** all requests tied to the seeded user,
**So that** the app works immediately and supports multi-user later.

**Acceptance Criteria:**

**Given** MVP is single-user
**When** any API request is made
**Then** `getCurrentUser()` returns the seeded `mgerasolo` user record from database

**And** no login screen exists (direct to app)
**And** all data queries filter by `user_id`
**And** session cookie contains `userId: 1` (auto-set on first visit)

**Technical Notes:**
- Middleware sets session cookie if missing
- `getCurrentUser()` queries `users` table by session userId
- When auth added later: middleware validates token, sets userId from Authentik
- Zero code changes downstream - just middleware swap

---

### Story 0.4: API Layer & Data Fetching

**As a** developer,
**I want** a consistent API pattern with data fetching hooks,
**So that** all features follow the same patterns for reliability and maintainability.

**Acceptance Criteria:**

**Given** I need to fetch or mutate data
**When** I use the API layer
**Then** I have access to:
- tRPC routers with TypeScript end-to-end type safety
- React Query integration for caching and refetching
- Standardized error response format: `{ error: { code, message, action } }`
- Optimistic updates pattern for mutations

**And** API errors automatically trigger the toast system
**And** loading states are handled by React Query
**And** requests include user context from session

---

### Story 0.5: Toast & Error Handling Framework

**As a** user,
**I want** clear feedback for actions, errors, and loading states,
**So that** I always know what's happening and how to recover from issues.

**Acceptance Criteria:**

**Given** I perform any action in the app
**When** the action succeeds
**Then** I see a success toast (green) that auto-dismisses after 3 seconds

**Given** I perform any action in the app
**When** the action fails
**Then** I see an error toast (red) with:
- Clear error message (not technical jargon)
- Suggested action to resolve
- Dismissible but persists until dismissed

**And** toast system supports: stacking, types (success/error/warning/info), action buttons
**And** centralized error boundary catches unexpected crashes with "Something went wrong" UI

---

### Story 0.6: Logging & Observability

**As a** developer,
**I want** structured logging and error tracking from day one,
**So that** I can debug issues in production.

**Acceptance Criteria:**

**Given** the app is running on Banner
**When** I check observability tools
**Then** I can see:
- Structured logs in Loki (JSON format with timestamp, level, message, context)
- Errors tracked in Sentry with stack traces
- Request tracing with `X-Trace-ID` header propagation

**And** every API request logs: method, path, duration, status, user_id
**And** errors include context: user, route, request body (sanitized)
**And** log levels configurable via environment variable

---

### Story 0.7: CI/CD Pipeline

**As a** developer,
**I want** automated build, test, and deployment,
**So that** code changes deploy reliably to Banner.

**Acceptance Criteria:**

**Given** I push to `main` branch
**When** GitHub Actions runs
**Then** the pipeline:
1. Runs linting (ESLint, Prettier check)
2. Runs type checking (tsc --noEmit)
3. Runs unit tests (Vitest)
4. Builds Docker image
5. Pushes to container registry
6. Deploys to Banner via SSH
7. Runs database migrations
8. Verifies health endpoint responds

**And** failed steps block deployment
**And** notifications sent to ntfy on success/failure

---

### Story 0.8: Testing Framework

**As a** developer,
**I want** testing infrastructure in place,
**So that** I can write tests as I build features.

**Acceptance Criteria:**

**Given** I want to write tests
**When** I run test commands
**Then** I can:
- Run unit tests: `npm run test` (Vitest)
- Run E2E tests: `npm run test:e2e` (Playwright)
- Generate coverage report: `npm run test:coverage`

**And** test utilities exist for:
- Mocking tRPC context
- Rendering components with providers
- Database test fixtures
- API request helpers

**And** CI runs tests on every PR

---

### Story 0.9: Empty States & Loading Skeletons

**As a** user,
**I want** helpful feedback when there's no data or content is loading,
**So that** the app never feels broken or unresponsive.

**Acceptance Criteria:**

**Given** a section has no data
**When** I view it
**Then** I see an empty state with:
- Friendly illustration or icon
- Clear message ("No projects yet")
- Call to action button ("Create your first project")

**Given** content is loading
**When** I view the area
**Then** I see skeleton placeholders matching the content shape

**And** reusable components exist: `<EmptyState>`, `<Skeleton>`, `<LoadingSpinner>`
**And** empty states are contextual (different for files vs projects vs memories)

---

## Epic 1: Project Foundation & File Workspace

**Goal:** Users can create projects, upload files, browse them in a familiar IDE-like interface, and view files in tabs.

**FRs Covered:** FR-WS-01 to FR-WS-08, FR-PM-01 to FR-PM-06, FR-FM-01 to FR-FM-07, FR-DV-01 to FR-DV-06 (27 FRs)

---

### Story 1.1: Dockview Workspace Shell

**As a** user,
**I want** a VS Code-style workspace with draggable panels and tabs,
**So that** I can arrange my workspace how I prefer.

**Acceptance Criteria:**

**Given** I am in The Keep
**When** I view the main workspace
**Then** I see a dockview-based panel system with:
- Draggable tabs between panel groups
- Ability to split panels horizontally and vertically
- Tab close buttons with unsaved indicator (●)
- Panel resize handles

**And** clicking a file opens it in a new tab
**And** I can drag a tab to create a split view
**And** the "+" button in tab bar allows opening new content

**FRs:** FR-WS-01, FR-WS-05

---

### Story 1.2: Activity Bar & Project Context

**As a** user,
**I want** a left sidebar to switch between projects and access global features,
**So that** I can navigate quickly between different knowledge domains.

**Acceptance Criteria:**

**Given** I am in The Keep
**When** I view the activity bar (far left)
**Then** I see:
- Project icons in top section (scrollable if many)
- Divider line
- Global actions in bottom section (Search, Knowledge, Settings)

**And** clicking a project icon switches to that project's context
**And** the active project has a highlighted indicator
**And** hovering shows project name tooltip

**FRs:** FR-WS-02, FR-PM-01, FR-PM-02, FR-PM-03

---

### Story 1.3: Project CRUD

**As a** user,
**I want** to create, edit, and archive projects,
**So that** I can organize my knowledge into separate domains.

**Acceptance Criteria:**

**Given** I click "New Project"
**When** I fill in the project form
**Then** I can set: name, icon (emoji picker), description

**Given** I right-click a project in the activity bar
**When** I select "Edit Project"
**Then** I can modify name, icon, description, and settings

**Given** I right-click a project
**When** I select "Archive Project"
**Then** the project moves to archived state and hides from activity bar
**And** I can view archived projects in settings and restore them

**FRs:** FR-PM-04, FR-PM-05, FR-PM-06

---

### Story 1.4: File Browser Panel

**As a** user,
**I want** a tree view of my project files,
**So that** I can navigate and find my documents.

**Acceptance Criteria:**

**Given** I am in a project
**When** I view the file browser panel
**Then** I see:
- Search/filter input at top
- Tree view with expandable folders
- File icons based on type (PDF red, MD blue, images green, etc.)
- Selected file highlighted

**And** clicking a file opens it in the editor area
**And** double-clicking a folder expands/collapses it
**And** I can resize the panel width (180-400px)

**FRs:** FR-WS-03, FR-FM-06

---

### Story 1.5: File Upload

**As a** user,
**I want** to upload files to my project,
**So that** I can add documents to my knowledge base.

**Acceptance Criteria:**

**Given** I am in the file browser
**When** I drag files onto the panel
**Then** I see a drop zone highlight
**And** files upload to MinIO with progress indicator

**Given** I drag a folder
**When** I drop it
**Then** the entire folder structure is preserved

**Given** I click the upload button
**When** I select files
**Then** I can select multiple files or a directory

**And** upload errors show clear message with retry option
**And** unsupported files are stored but marked as "unsupported for viewing"

**FRs:** FR-FM-01

---

### Story 1.6: Folder Management

**As a** user,
**I want** to organize files into folders,
**So that** I can keep my project structured.

**Acceptance Criteria:**

**Given** I right-click in the file browser
**When** I select "New Folder"
**Then** a new folder is created and I can name it inline

**Given** I right-click a folder
**When** I select "Rename"
**Then** I can edit the folder name inline

**Given** I right-click a folder
**When** I select "Delete"
**Then** I see confirmation dialog
**And** folder moves to trash (soft delete)

**And** I can drag files/folders to move them
**And** nested folders are supported

**FRs:** FR-FM-02

---

### Story 1.7: File Operations

**As a** user,
**I want** to manage my files (rename, delete, move, duplicate),
**So that** I can organize my knowledge base.

**Acceptance Criteria:**

**Given** I right-click a file
**When** I view the context menu
**Then** I see: Open, Rename, Duplicate, Move to..., Delete

**Given** I select multiple files (Ctrl/Cmd+click or Shift+click)
**When** I right-click
**Then** bulk operations are available (Delete, Move to...)

**Given** I delete a file
**When** I confirm
**Then** the file moves to trash with 30-day recovery

**And** keyboard shortcuts work: Delete key, F2 for rename
**And** move shows folder picker dialog

**FRs:** FR-FM-03, FR-FM-04, FR-FM-05, FR-FM-07

---

### Story 1.8: Document Viewers

**As a** user,
**I want** to view different file types in tabs,
**So that** I can read my documents without external applications.

**Acceptance Criteria:**

**Given** I open a Markdown file
**When** it loads in a tab
**Then** I see formatted markdown with syntax highlighting

**Given** I open a PDF file
**When** it loads in a tab
**Then** I see PDF viewer with:
- Page navigation (prev/next, page input)
- Zoom controls
- Scroll through pages

**Given** I open an image (PNG, JPG, GIF, SVG)
**When** it loads in a tab
**Then** I see the image with zoom controls

**Given** I open a code file (.js, .py, .ts, etc.)
**When** it loads in a tab
**Then** I see syntax-highlighted code (read-only)

**Given** I open an unsupported file
**When** it loads
**Then** I see a message with file info and "Download" option

**And** I can view multiple files side-by-side in split panes

**FRs:** FR-DV-01 to FR-DV-06

---

### Story 1.9: Layout & Theme Persistence

**As a** user,
**I want** my workspace arrangement saved,
**So that** I can resume work exactly where I left off.

**Acceptance Criteria:**

**Given** I arrange panels and open files
**When** I close and reopen the app
**Then** my layout is restored exactly (panel positions, sizes, open tabs)

**Given** I switch between projects
**When** I return to a project
**Then** that project's saved layout is restored

**Given** I open settings
**When** I toggle theme
**Then** I can switch between dark (default) and light mode
**And** theme preference persists

**And** standard keyboard shortcuts work:
- Cmd/Ctrl+S: Save
- Cmd/Ctrl+W: Close tab
- Cmd/Ctrl+Tab: Next tab

**FRs:** FR-WS-06, FR-WS-07, FR-WS-08

---

## Epic 2: Markdown Editing & Knowledge Creation

**Goal:** Users can create and edit markdown documents with rich editing (WYSIWYG + source mode), formatting, slash commands, diff viewing, and version management.

**FRs Covered:** FR-ME-01 to FR-ME-17 (17 FRs)

**User Value:** Users can create content, not just view it. Full Obsidian-style editing with version history.

---

### Story 2.1: Monaco Source Editor

**As a** user,
**I want** to edit raw markdown in a Monaco editor,
**So that** I have full control over my document's source.

**Acceptance Criteria:**

**Given** I open a markdown file
**When** I select "Source" mode (or it's the default for .md files)
**Then** I see Monaco editor with:
- Markdown syntax highlighting
- Line numbers
- Code folding for headers
- Minimap (optional, toggleable)

**Given** I type in the editor
**When** I make changes
**Then** changes auto-save after 2-second debounce
**And** unsaved indicator (●) shows in tab until saved

**And** standard editor keybindings work (Ctrl+Z undo, etc.)
**And** find/replace (Ctrl+F, Ctrl+H) is available

**FRs:** FR-ME-02, FR-ME-05

---

### Story 2.2: TipTap WYSIWYG Editor

**As a** user,
**I want** to edit markdown in a rich WYSIWYG view,
**So that** I can see formatting as I write without knowing markdown syntax.

**Acceptance Criteria:**

**Given** I open a markdown file
**When** I select "Preview" mode (toggle button)
**Then** I see TipTap editor with:
- Rendered markdown (bold, italic, headers display visually)
- Editable content (not read-only)
- Click-to-edit on any element

**Given** I edit in WYSIWYG mode
**When** I switch to Source mode
**Then** the raw markdown reflects my changes (round-trip lossless)

**Given** I make edits
**When** I save (auto or manual)
**Then** the underlying .md file is updated

**And** keyboard shortcut (Cmd+E / Ctrl+E) toggles between Source/Preview

**FRs:** FR-ME-03, FR-ME-14

---

### Story 2.3: Split Edit/Preview Mode

**As a** user,
**I want** to see source and preview side-by-side,
**So that** I can write markdown while seeing the rendered result.

**Acceptance Criteria:**

**Given** I'm editing a markdown file
**When** I click the split-view button (or Cmd+\)
**Then** the editor splits into two panes:
- Left: Monaco source editor
- Right: TipTap preview (read-only or editable, configurable)

**Given** I'm in split view
**When** I scroll in one pane
**Then** the other pane syncs scroll position (linked scrolling)

**Given** I click the split button again
**When** toggling
**Then** it cycles: Source → Split → Preview → Source

**FRs:** FR-ME-04

---

### Story 2.4: Rich Formatting Toolbar

**As a** user,
**I want** a formatting toolbar in the editor,
**So that** I can apply formatting without memorizing markdown syntax.

**Acceptance Criteria:**

**Given** I'm editing a markdown file (either mode)
**When** I view the toolbar
**Then** I see buttons for:
- Bold (Cmd+B)
- Italic (Cmd+I)
- Strikethrough
- Headers (H1, H2, H3 dropdown)
- Bullet list
- Numbered list
- Task list (checkbox)
- Link (Cmd+K)
- Code (inline)
- Code block
- Quote
- Table

**Given** I select text and click a toolbar button
**When** formatting is applied
**Then** the appropriate markdown syntax is inserted
**And** in Preview mode, visual formatting updates instantly

**And** toolbar is visible at top of editor area
**And** tooltips show keyboard shortcuts on hover

**FRs:** FR-ME-01, FR-ME-17

---

### Story 2.5: Slash Commands

**As a** user,
**I want** to type `/` to insert blocks,
**So that** I can quickly add elements without leaving the keyboard.

**Acceptance Criteria:**

**Given** I'm in the editor (TipTap or Monaco)
**When** I type `/` at the start of a line
**Then** a command menu appears with:
- /heading, /h1, /h2, /h3
- /bullet, /numbered, /task
- /code (code block)
- /quote
- /table
- /divider (horizontal rule)
- /link

**Given** the menu is open
**When** I type to filter (e.g., `/ta`)
**Then** menu filters to matching commands (/table, /task)

**Given** I select a command
**When** I press Enter or click
**Then** the appropriate element is inserted at cursor position
**And** the `/` trigger text is removed

**FRs:** FR-ME-10

---

### Story 2.6: Bubble Menu (Inline Formatting)

**As a** user,
**I want** formatting options to appear when I select text,
**So that** I can format without moving to the toolbar.

**Acceptance Criteria:**

**Given** I'm in Preview (TipTap) mode
**When** I select text
**Then** a bubble menu appears above the selection with:
- Bold, Italic, Strikethrough
- Link
- Code (inline)
- Highlight

**Given** the bubble menu is visible
**When** I click a formatting option
**Then** the formatting is applied to the selection
**And** the menu remains visible for additional formatting

**Given** I click outside the selection
**When** focus is lost
**Then** the bubble menu dismisses

**FRs:** FR-ME-11

---

### Story 2.7: Tables Support

**As a** user,
**I want** to create and edit tables visually,
**So that** I can organize data without writing markdown table syntax.

**Acceptance Criteria:**

**Given** I insert a table (via slash command or toolbar)
**When** the table is created
**Then** I see a visual table with:
- Default 3x3 grid
- Click cells to edit
- Tab to move between cells

**Given** I'm in a table
**When** I right-click
**Then** I see options: Add row above/below, Add column left/right, Delete row, Delete column

**Given** I'm in Source mode
**When** I view the table
**Then** I see proper markdown table syntax with alignment pipes

**FRs:** FR-ME-07

---

### Story 2.8: Task Lists (Checkboxes)

**As a** user,
**I want** to create interactive task lists,
**So that** I can track todos within my documents.

**Acceptance Criteria:**

**Given** I type `- [ ]` in Source mode
**When** I continue typing
**Then** it creates a task list item

**Given** I'm in Preview mode
**When** I click a checkbox
**Then** it toggles between `[ ]` and `[x]`
**And** the underlying markdown is updated

**Given** I use slash command `/task`
**When** selected
**Then** a task list item is inserted

**And** pressing Enter after a task creates another task
**And** pressing Enter twice exits task list mode

**FRs:** FR-ME-12

---

### Story 2.9: Code Blocks with Syntax Highlighting

**As a** user,
**I want** to insert code blocks with language selection,
**So that** I can include formatted code snippets.

**Acceptance Criteria:**

**Given** I insert a code block
**When** created
**Then** I see:
- Language selector dropdown (js, python, sql, bash, etc.)
- Syntax-highlighted code area
- Copy button

**Given** I type ```python in Source mode
**When** the fence is closed with ```
**Then** the code block renders with Python syntax highlighting

**Given** I'm in Preview mode viewing a code block
**When** I click the copy button
**Then** the code content is copied to clipboard
**And** toast confirms "Copied!"

**FRs:** FR-ME-13

---

### Story 2.10: Diff Viewer

**As a** user,
**I want** to compare versions of a file,
**So that** I can see exactly what changed.

**Acceptance Criteria:**

**Given** I have a file with version history
**When** I select "Compare versions" (from version history panel or file menu)
**Then** I see Monaco's built-in diff editor with:
- Side-by-side view (old left, new right)
- Inline diff highlighting (red deletions, green additions)
- Navigation between changes

**Given** I'm viewing a diff
**When** I click "Previous change" / "Next change"
**Then** I jump to the next difference

**And** diff viewer opens in a new tab
**And** tab title shows "filename (diff)"

**FRs:** FR-VC-02 (related)

**Technical Notes:**
- Use Monaco's built-in `monaco.editor.createDiffEditor()`
- Leverages file version history from Story 2.11

---

### Story 2.11: File Version History Panel

**As a** user,
**I want** to see previous versions of my file,
**So that** I can review changes and restore old versions.

**Acceptance Criteria:**

**Given** I have a file open
**When** I click "Version History" (in file menu or sidebar)
**Then** I see a panel listing versions:
- Timestamp
- Brief change summary (if available)
- File size

**Given** I click a version
**When** selected
**Then** I see preview of that version (read-only)

**Given** I select a version
**When** I click "Restore this version"
**Then** confirmation dialog appears
**And** on confirm, the file is restored and a new version is created

**Given** I select two versions
**When** I click "Compare"
**Then** the diff viewer (Story 2.10) opens with those versions

**FRs:** FR-VC-01, FR-VC-03, FR-VC-04, FR-VC-05

**Technical Notes:**
- Versions stored in database with file content snapshots
- Auto-version on save (configurable: every save, every 5 minutes, etc.)

---

### Story 2.12: Frontmatter & Metadata Editor

**As a** user,
**I want** to view and edit file metadata (frontmatter, tags),
**So that** I can organize and classify my documents.

**Acceptance Criteria:**

**Given** I have a file open
**When** I click "Properties" or press Cmd+Shift+P
**Then** I see a metadata panel/modal with:
- YAML frontmatter fields (if present)
- Tags (editable, autocomplete from existing tags)
- Created date (read-only)
- Modified date (read-only)
- File size

**Given** the file has frontmatter (---)
**When** I edit fields in the panel
**Then** the frontmatter YAML is updated in the file

**Given** the file has no frontmatter
**When** I add a tag or field
**Then** frontmatter block is created at the top of the file

**Given** I type in the Tags field
**When** typing
**Then** I see autocomplete suggestions from existing project tags

**And** panel can be docked in sidebar or opened as modal

**FRs:** Related to FR-TA (tags), document organization

---

### Story 2.13: Markdown Auto-Formatting

**As a** user,
**I want** automatic markdown formatting that I can toggle,
**So that** my documents stay consistent without constant manual cleanup.

**Acceptance Criteria:**

**Given** I'm editing a markdown file
**When** I save (auto or manual) and auto-format is enabled
**Then** the document is formatted:
- Consistent heading spacing
- List indentation normalized
- Code block fences aligned
- Trailing whitespace removed
- Consistent line breaks between blocks

**Given** I'm working with a custom file type or structure
**When** I want to disable auto-formatting
**Then** I can toggle it off via the editor toolbar
**And** the toggle is a small icon/switch in the formatting toolbar (alongside bold, italic, etc.)

**Given** auto-format is disabled
**When** I save
**Then** no automatic formatting is applied

**And** auto-format preference persists per file (stored in frontmatter or per-project setting)
**And** toggle state is visible at a glance (icon highlighted when on)

**FRs:** Related to FR-ME-14 (round-trip), document consistency

**Technical Notes:**
- Use Prettier with markdown plugin for formatting
- Toggle icon in toolbar (e.g., small "Aa" or format icon) shows enabled/disabled state
- Per-file override stored in frontmatter: `autoformat: false`

---

## Epic 3: AI Conversation & RAG

**Goal:** Users can chat with AI about their files, get answers with citations, search semantically across their knowledge base.

**FRs Covered:** FR-AC-01 to FR-AC-10, FR-KG-01 to FR-KG-05, FR-AS-01 to FR-AS-09 (24 FRs)

**User Value:** AI becomes useful - can answer questions from your files with source citations.

---

### Story 3.1: AI Chat Panel as Dockview Tab

**As a** user,
**I want** to open AI chat as a dockable tab,
**So that** I can position it anywhere in my workspace.

**Acceptance Criteria:**

**Given** I click the chat icon in the activity bar
**When** the chat opens
**Then** it appears as a dockview tab that I can:
- Drag to any position (right, bottom, floating)
- Split with other panels
- Close and reopen

**Given** I have a chat tab open
**When** I drag it to the right side
**Then** it docks as a sidebar panel

**And** chat maintains its conversation when moved
**And** multiple chat tabs can be open simultaneously
**And** each chat tab shows its conversation title in the tab

**FRs:** FR-AC-01, FR-AC-02

---

### Story 3.2: Model Selection

**As a** user,
**I want** to choose which AI model to use,
**So that** I can balance speed, cost, and capability.

**Acceptance Criteria:**

**Given** I'm in a chat panel
**When** I click the model selector dropdown
**Then** I see available models from LiteLLM:
- Grouped by provider (OpenAI, Anthropic, Local)
- Model names with brief descriptions
- Cost indicator ($$$ for expensive, $ for cheap)

**Given** I select a model
**When** I send my next message
**Then** it uses the selected model
**And** the model name shows in the chat header

**And** model selection persists per chat
**And** default model configurable in project settings

**FRs:** FR-AC-05

**Technical Notes:**
- Fetch available models from LiteLLM `/models` endpoint
- Cache model list for 5 minutes

---

### Story 3.3: Context-Aware Chat

**As a** user,
**I want** the AI to know which files I have open,
**So that** it can answer questions about my current work.

**Acceptance Criteria:**

**Given** I have files open in tabs
**When** I start a chat
**Then** I see "Context" chips showing currently open files
**And** I can click X to remove files from context

**Given** I ask about content in an open file
**When** the AI responds
**Then** it references the correct file content
**And** includes file:line citations where relevant

**Given** I open/close files while chatting
**When** context changes
**Then** the context chips update in real-time
**And** I can manually pin/unpin files from context

**Given** I right-click a file in the file tree
**When** I select "Add to AI context"
**Then** the file appears as a context chip in the active chat

**Given** I drag a file from the file tree
**When** I drop it on the AI chat panel
**Then** the file is added to context
**And** a visual indicator shows the drop zone

**FRs:** FR-AC-03, FR-AC-04

---

### Story 3.11: Image Support in Chat

**As a** user,
**I want** to include images in my AI conversations,
**So that** I can ask questions about visual content.

**Acceptance Criteria:**

**Given** I'm in a chat
**When** I click the image/attachment button
**Then** I can select images from:
- My computer (upload)
- My project files (existing images)

**Given** I paste an image from clipboard
**When** pasting in the chat input
**Then** the image is attached to my message
**And** I see a preview thumbnail

**Given** I send a message with an image
**When** the AI responds
**Then** it can reference and analyze the image content
**And** the image is displayed in the chat thread

**Given** an image is uploaded in chat
**When** the upload completes
**Then** the image is saved to the project's `.uploads/` folder
**And** retained for 30 days (configurable)
**And** shown in file browser under .uploads

**And** supported formats: PNG, JPG, GIF, WebP
**And** max image size: 10MB

**FRs:** Related to FR-AC (image-aware AI)

**Technical Notes:**
- Send images via LiteLLM's multimodal API
- Store uploads in MinIO with cleanup job

---

### Story 3.4: Chat History & Persistence

**As a** user,
**I want** my conversations saved,
**So that** I can continue past discussions.

**Acceptance Criteria:**

**Given** I have a conversation
**When** I close and reopen the app
**Then** my conversations are preserved

**Given** I'm in the chat panel
**When** I click "History" or conversation list icon
**Then** I see list of past conversations:
- Grouped by date (Today, Yesterday, Last 7 days)
- Auto-generated titles from first message
- Last message timestamp

**Given** I click a past conversation
**When** it loads
**Then** the full conversation history appears
**And** I can continue from where I left off

**Given** I click "New Chat"
**When** starting fresh
**Then** a new conversation begins with empty context

**FRs:** FR-AC-06, FR-AC-07

---

### Story 3.5: Streaming Responses with Code Blocks

**As a** user,
**I want** to see AI responses stream in real-time,
**So that** I don't wait for the entire response.

**Acceptance Criteria:**

**Given** I send a message
**When** the AI begins responding
**Then** text streams in word-by-word
**And** a typing indicator shows while streaming

**Given** the AI includes code in its response
**When** rendering
**Then** code blocks have:
- Syntax highlighting
- Language label
- Copy button
- Line numbers (optional)

**Given** a response completes
**When** I hover over it
**Then** I see Copy response button
**And** can copy full response to clipboard

**FRs:** FR-AC-09, FR-AC-10

---

### Story 3.6: Automatic File Indexing (RAG Foundation)

**As a** user,
**I want** my files automatically indexed,
**So that** the AI can search across my knowledge base.

**Acceptance Criteria:**

**Given** I upload or create a file
**When** the file is saved
**Then** it is automatically:
- Chunked into semantic segments
- Embedded via LiteLLM embeddings
- Stored in pgvector

**Given** a file is updated
**When** saved
**Then** its embeddings are refreshed

**Given** a file is deleted
**When** moved to trash
**Then** its embeddings are removed from active search
**But** preserved for 30 days (matching file retention)

**And** indexing happens asynchronously (doesn't block saves)
**And** indexing status visible in file browser (icon indicator)

**FRs:** FR-KG-01

**Technical Notes:**
- Use text-embedding-3-small via LiteLLM
- Chunk size: 512 tokens with 50 token overlap
- Background job queue for indexing

---

### Story 3.7: Semantic Search

**As a** user,
**I want** to search by meaning, not just keywords,
**So that** I can find content even when I don't remember exact wording.

**Acceptance Criteria:**

**Given** I'm in the command palette (Cmd+K)
**When** I type a search query
**Then** results include:
- Keyword matches (filename, content)
- Semantic matches (meaning-based)

**Given** I search "things to buy at the store"
**When** results return
**Then** I see relevant files like "grocery-list.md" even if they don't contain those exact words

**Given** I view search results
**When** hovering over a result
**Then** I see relevant excerpt with match highlighted

**And** search results ranked by combined keyword + semantic relevance
**And** I can filter results by file type

**FRs:** FR-KG-03, FR-AS-01, FR-AS-02

---

### Story 3.8: RAG-Enhanced Chat

**As a** user,
**I want** the AI to cite sources when answering,
**So that** I can verify information and dig deeper.

**Acceptance Criteria:**

**Given** I ask a question about my files
**When** the AI responds using RAG
**Then** citations appear as clickable links: `[1]`, `[2]`, etc.

**Given** I click a citation
**When** navigating
**Then** the source file opens at the relevant section

**Given** the AI cannot find relevant information
**When** responding
**Then** it clearly states "I couldn't find this in your files"
**And** offers to search more broadly or clarify

**And** AI includes "Sources:" section at end of response
**And** sources show file name and relevant excerpt

**FRs:** FR-AC-08, FR-KG-03

---

### Story 3.9: Explicit Index Inclusion/Exclusion

**As a** user,
**I want** to control which files are searchable,
**So that** I can exclude sensitive or irrelevant content.

**Acceptance Criteria:**

**Given** I right-click a file or folder
**When** I select "Exclude from AI"
**Then** the file/folder is excluded from:
- RAG search results
- Automatic context
- Embeddings index

**Given** I open project settings
**When** I view "AI & Search" section
**Then** I see:
- List of excluded files/folders
- Toggle to exclude by pattern (e.g., *.log)
- Button to re-include items

**Given** a file is excluded
**When** viewing in file browser
**Then** it shows a subtle indicator (e.g., dimmed, icon badge)

**FRs:** FR-KG-02

---

### Story 3.10: Hybrid Search (Vector + FTS)

**As a** user,
**I want** search that combines exact matches and meaning,
**So that** I get comprehensive results.

**Acceptance Criteria:**

**Given** I search for an exact phrase in quotes
**When** results return
**Then** full-text search (FTS) results appear first

**Given** I search without quotes
**When** results return
**Then** results combine:
- FTS matches (exact keyword)
- Vector matches (semantic)
- Ranked by combined score

**And** search explains match type (keyword vs. semantic)
**And** performance: <500ms for 10k files

**FRs:** FR-AS-03, FR-AS-04, FR-AS-05

**Technical Notes:**
- PostgreSQL FTS for keyword search
- pgvector for semantic search
- RRF (Reciprocal Rank Fusion) for combining results

---

## Epic 4: AI File Editing (Core Differentiator)

**Goal:** Users can have AI edit their existing files in place - add entries, remove items, update values - with diff preview and undo.

**FRs Covered:** FR-FE-01 to FR-FE-10 (10 FRs)

**User Value:** THE killer feature - AI edits YOUR files like Claude Code, not ChatGPT's regenerate model.

---

### Story 4.1: AI Edit Commands

**As a** user,
**I want** to ask the AI to edit my files directly,
**So that** I don't have to manually make changes it suggests.

**Acceptance Criteria:**

**Given** I have a file in context
**When** I ask "Add milk to my grocery list"
**Then** the AI understands this as an edit operation
**And** prepares to modify the file

**Given** I ask for an edit
**When** the AI responds
**Then** it shows:
- The proposed change (what will be added/modified/removed)
- Which file will be affected
- A preview of the edit

**And** AI recognizes edit intents: "add", "remove", "update", "change", "delete", "insert"
**And** works with structured files (lists, tables, markdown)

**CRITICAL: Surgical Edit Principle**
**Given** the AI prepares an edit
**When** generating the change
**Then** it targets only the specific lines affected:
- Edits are line-specific, not whole-file rewrites
- Multiple targeted changes allowed (multi-hunk)
- Surrounding content is untouched
- AI NEVER regenerates entire file to make a small change

**And** if edit would affect >10 lines, AI confirms scope first
**And** edit operations use find-and-replace style targeting

**FRs:** FR-FE-01, FR-FE-03, FR-FE-04, FR-FE-05

**Technical Notes:**
- Implement edits as targeted string replacements (like Claude Code's Edit tool)
- AI identifies the minimal diff, not a full file rewrite
- Store edits as patches, not full file snapshots

---

### Story 4.2: Diff Preview Before Apply

**As a** user,
**I want** to see exactly what will change before accepting,
**So that** I can verify the AI understood my intent.

**Acceptance Criteria:**

**Given** the AI proposes an edit
**When** I view the proposal
**Then** I see a diff view showing:
- Red/strikethrough for deletions
- Green/highlighted for additions
- Context lines around changes

**Given** I'm viewing a diff
**When** I hover over a change
**Then** I see the line number and surrounding context

**And** diff appears inline in chat (not a separate modal)
**And** diff is collapsible for long changes
**And** I can scroll through multi-location changes

**FRs:** FR-FE-02

**Technical Notes:**
- Use Monaco's diff rendering component
- Support multi-hunk diffs (multiple changes in one edit)

---

### Story 4.3: Apply/Reject Edit Actions

**As a** user,
**I want** to accept or reject proposed edits,
**So that** I maintain control over my files.

**Acceptance Criteria:**

**Given** the AI shows a diff preview
**When** I click "Apply"
**Then** the edit is applied to the file
**And** the file auto-saves
**And** a version is created (for undo)
**And** the chat shows "Edit applied to [filename]"

**Given** the AI shows a diff preview
**When** I click "Reject"
**Then** the edit is discarded
**And** the chat shows "Edit rejected"
**And** I can explain why and ask for revision

**And** keyboard shortcuts: Enter = Apply, Escape = Reject
**And** I can request "edit this differently" for revision

**FRs:** FR-FE-09

---

### Story 4.4: Edit Undo/History

**As a** user,
**I want** to undo AI edits,
**So that** I can recover from unwanted changes.

**Acceptance Criteria:**

**Given** an AI edit was applied
**When** I click "Undo" (in chat) or Cmd+Z (in editor)
**Then** the edit is reverted
**And** the file returns to pre-edit state

**Given** I'm in a conversation
**When** I view edit history
**Then** I see list of edits made in this conversation:
- Timestamp
- File affected
- Brief description
- Undo button

**Given** I want to see all edits to a file
**When** I open file version history
**Then** AI edits are marked with "AI" badge
**And** I can revert to any previous version

**FRs:** FR-FE-07, FR-FE-08

---

### Story 4.5: Structure-Preserving Edits

**As a** user,
**I want** the AI to respect my file's format,
**So that** edits don't break my document structure.

**Acceptance Criteria:**

**Given** I have a structured file (e.g., YAML, markdown list, table)
**When** the AI adds an entry
**Then** it follows the existing format:
- Indentation matches
- List markers match (-, *, 1.)
- Table columns align

**Given** I have a template-based file
**When** the AI edits
**Then** template structure is preserved
**And** only the content within templates changes

**Given** the AI is unsure of format
**When** proposing an edit
**Then** it shows multiple format options
**Or** asks for clarification

**FRs:** FR-FE-06

---

### Story 4.6: Append Operations

**As a** user,
**I want** to easily add items to lists,
**So that** common additions are effortless.

**Acceptance Criteria:**

**Given** I have a list file (grocery list, todo, inventory)
**When** I say "Add X to Y list"
**Then** the AI appends the item to the appropriate location:
- End of list (default)
- Alphabetical position (if list is sorted)
- Under appropriate category (if categorized)

**Given** I add to a categorized list
**When** the category doesn't exist
**Then** the AI asks "Should I create a new category for this?"

**And** supports adding multiple items: "Add apples, oranges, and bananas"
**And** avoids duplicates: "This item already exists" with option to add anyway

**FRs:** FR-FE-03

---

### Story 4.7: Remove Operations

**As a** user,
**I want** to remove items by description,
**So that** I don't need to find and delete manually.

**Acceptance Criteria:**

**Given** I have a list file
**When** I say "Remove X from the list"
**Then** the AI identifies the matching item
**And** shows it in diff preview for confirmation

**Given** multiple items match
**When** the AI responds
**Then** it shows all matches
**And** asks "Which one?" or "Remove all?"

**Given** no items match
**When** the AI responds
**Then** it says "I couldn't find [X]. Did you mean [similar items]?"

**FRs:** FR-FE-04

---

### Story 4.8: Update Operations

**As a** user,
**I want** to change specific values in place,
**So that** I can update without restructuring.

**Acceptance Criteria:**

**Given** I have a file with a value to change
**When** I say "Change X to Y" or "Update X from A to B"
**Then** the AI:
- Locates the value
- Shows before/after diff
- Proposes the specific change

**Given** the value appears multiple times
**When** the AI responds
**Then** it shows all occurrences
**And** asks "Update all, or just the first?"

**And** works with key-value pairs: "Change the price to $50"
**And** works with inline edits: "Change 'meeting at 3pm' to '4pm'"

**FRs:** FR-FE-05

---

### Story 4.9: Bulk Edit Warning

**As a** user,
**I want** a warning before large changes,
**So that** I don't accidentally transform my file.

**Acceptance Criteria:**

**Given** the AI proposes an edit affecting >30% of the file
**When** showing the diff
**Then** a warning appears: "This is a significant change (X lines affected)"

**Given** the edit would add/remove many items
**When** the count exceeds 10 items
**Then** the AI summarizes: "This will add/remove N items"
**And** allows "Show all" to see full diff

**And** destructive operations (clearing all) require explicit confirmation
**And** warning threshold configurable in settings

**FRs:** FR-FE-10

---

### Story 4.10: Suggest vs. Auto-Apply Mode

**As a** user,
**I want** to choose between reviewing edits or auto-applying,
**So that** I can balance control vs. speed.

**Acceptance Criteria:**

**Given** I'm in "Suggest" mode (default)
**When** the AI proposes an edit
**Then** I see the diff and must click Apply

**Given** I'm in "Auto-apply" mode
**When** the AI proposes an edit
**Then** it applies immediately
**And** shows "Applied: [change description]"
**And** Undo is prominently available

**Given** I want to switch modes
**When** I toggle the mode selector
**Then** mode changes for this conversation
**And** setting persists per project

**And** auto-apply never fires for destructive/bulk edits
**And** mode visible in chat header

**FRs:** FR-FE-09

---

## Epic 5: Personal Knowledge & Memories

**Goal:** Users can manage atomic memories (inventories, profiles, preferences) with full provenance, editing, versioning.

**FRs Covered:** FR-PK-01 to FR-PK-15, FR-MP-01 to FR-MP-12 (27 FRs)

**User Value:** The system knows you and can answer contextually. Unlike ChatGPT's opaque memory.

---

### Story 5.1: Memory Data Model

**As a** developer,
**I want** a well-designed memory schema,
**So that** memories are atomic, queryable, and versionable.

**Acceptance Criteria:**

**Given** the database schema
**When** implemented
**Then** memories table includes:
```
id, project_id, user_id
key (varchar) - unique identifier
value (text) - the actual memory content
category (varchar) - e.g., preference, inventory, profile
subject_tags (array) - who/what this is about
source_type (enum) - user_edit, file_extraction, conversation
source_reference (varchar) - file:line or conversation_id
confidence (enum) - high, medium, low
status (enum) - active, archived, trash
tier (enum) - hot, warm, cold
created_at, updated_at, deleted_at
```

**And** memory_versions table tracks all changes
**And** indexes on project_id, category, subject_tags
**And** soft delete with 30-day retention

**FRs:** FR-PK-07, FR-MP-01 to FR-MP-10

**Technical Notes:**
- Each memory = ONE atomic fact
- "Matt likes spicy food" not "Matt likes spicy food and Italian cuisine"

---

### Story 5.2: Memory Grid View (Management UI)

**As a** user,
**I want** a spreadsheet-like view of my memories,
**So that** I can browse, edit, and manage them efficiently.

**Acceptance Criteria:**

**Given** I click "Memories" in the activity bar
**When** the panel opens
**Then** I see a grid/table with columns:
- Key (sortable)
- Value (editable inline)
- Category (filter dropdown)
- Status (Active/Archived/Trash)
- Last Updated

**Given** I click a cell in the Value column
**When** I start typing
**Then** I can edit inline
**And** changes save on blur

**Given** I select multiple rows
**When** I right-click
**Then** I see bulk actions: Archive, Delete, Change Category

**And** column widths are adjustable
**And** pagination or virtual scrolling for 10,000+ memories

**FRs:** FR-PK-06, FR-PK-08, FR-PK-09, FR-PK-15

---

### Story 5.3: Memory Filtering & Search

**As a** user,
**I want** to filter and search memories,
**So that** I can find specific information quickly.

**Acceptance Criteria:**

**Given** I'm in the memory grid
**When** I type in the search box
**Then** memories filter by key or value containing the query

**Given** I click the category filter
**When** I select a category
**Then** only memories of that category show

**Given** I click the status filter
**When** I select "Archived" or "Trash"
**Then** I see those memories (normally hidden)

**And** filters are combinable (category + status + search)
**And** filter state persists in URL for sharing
**And** "Clear filters" resets to default view

**FRs:** FR-PK-10, FR-PK-12, FR-MP-12

---

### Story 5.4: AI Memory Extraction

**As a** user,
**I want** the AI to suggest memories from conversations,
**So that** important facts are captured automatically.

**Acceptance Criteria:**

**Given** I have a conversation where I share personal info
**When** the AI detects memorable facts
**Then** it suggests them as "Pending memories":
- "I noticed you mentioned [fact]. Save this?"
- Shows key-value preview
- Accept/Reject buttons

**Given** a pending memory is shown
**When** I click Accept
**Then** it's saved with source_type: "conversation"
**And** source_reference links to the conversation

**Given** I want to review all pending memories
**When** I go to "Pending" tab in memories
**Then** I see all AI-suggested memories awaiting approval

**And** AI never auto-saves without approval
**And** extraction respects conversation mode (not in incognito)

**FRs:** FR-PK-04, FR-MP-01, FR-MP-02, FR-MP-11

---

### Story 5.5: Memory Provenance Display

**As a** user,
**I want** to know where each memory came from,
**So that** I can verify and trust the information.

**Acceptance Criteria:**

**Given** I click on a memory row
**When** the detail panel opens
**Then** I see provenance information:
- Source type: "Learned from conversation" / "Extracted from file" / "You entered this"
- Source link: clickable link to original
- Learned date
- Confidence level

**Given** I ask the AI "Where did you learn that?"
**When** the AI references a memory
**Then** it cites the source in its response

**Given** I click "Jump to source"
**When** navigating
**Then** the original file/conversation opens at the relevant location

**FRs:** FR-MP-01 to FR-MP-06

---

### Story 5.6: Memory Version History

**As a** user,
**I want** to see how a memory has changed over time,
**So that** I can track superseded values and revert mistakes.

**Acceptance Criteria:**

**Given** I view a memory's detail panel
**When** I click "History"
**Then** I see all versions:
- Timestamp
- Previous value → New value
- Who/what made the change
- Reason (if provided)

**Given** a memory was superseded
**When** viewing history
**Then** I see "Superseded by: [new memory]" link

**Given** I want to revert
**When** I click "Restore this version"
**Then** confirmation dialog appears
**And** on confirm, memory reverts and new version is created

**FRs:** FR-PK-13, FR-PK-14, FR-MP-07

---

### Story 5.7: AI Context Integration

**As a** user,
**I want** the AI to use my memories when responding,
**So that** it gives personalized, relevant answers.

**Acceptance Criteria:**

**Given** I have memories about dietary preferences
**When** I ask for recipe suggestions
**Then** the AI:
- Considers my preferences
- References them: "Since you like spicy food..."
- Doesn't suggest things I've marked as disliked

**Given** I have inventory memories
**When** I ask "What do I have?"
**Then** the AI lists relevant inventory items

**And** AI weighs memories by confidence and tier
**And** memories from current project prioritized over global
**And** AI states uncertainty when memory is low-confidence

**FRs:** FR-PK-05, FR-PK-11

---

### Story 5.8: Structured Inventories

**As a** user,
**I want** to create structured inventories (pantry, wine, books),
**So that** I can track collections of items.

**Acceptance Criteria:**

**Given** I create a new inventory
**When** setting it up
**Then** I define:
- Inventory name
- Item schema (fields like Name, Quantity, Location, Notes)
- Category classification

**Given** I add items to an inventory
**When** entering data
**Then** I see a form matching the schema
**And** items are saved as individual memories with inventory tag

**Given** I view an inventory
**When** opening it
**Then** I see a table view of all items
**And** can sort, filter, and edit inline

**FRs:** FR-PK-01, FR-PK-06

---

### Story 5.9: Personal Profiles

**As a** user,
**I want** to store personal profiles (health, preferences),
**So that** the AI can give contextually appropriate advice.

**Acceptance Criteria:**

**Given** I create a profile
**When** setting up
**Then** I can add fields like:
- Health: allergies, medications, conditions
- Diet: restrictions, preferences, favorites
- Lifestyle: schedule, habits

**Given** I edit my profile
**When** changing a value
**Then** the old value is versioned (not lost)
**And** I can see history

**Given** the AI accesses my profile
**When** giving advice
**Then** it respects my constraints (e.g., "avoiding gluten...")
**And** doesn't suggest things that conflict with my profile

**FRs:** FR-PK-02, FR-PK-03

---

### Story 5.10: Memory Categories & Tags

**As a** user,
**I want** to organize memories with categories and tags,
**So that** I can find and filter them easily.

**Acceptance Criteria:**

**Given** I create a memory
**When** entering details
**Then** I can assign:
- Category (required): preference, inventory, profile, fact, procedure
- Subject tags (optional): who/what this is about

**Given** I'm in the memory grid
**When** I filter by category or tag
**Then** only matching memories show

**Given** I want to add a tag
**When** typing in the tag field
**Then** I see autocomplete from existing tags
**And** can create new tags inline

**FRs:** FR-MP-08, FR-MP-09

---

## Epic 6: Project Context & Soul

**Goal:** Users can define project identity (SOUL.md), guardrails, and have AI respect project-specific instructions.

**FRs Covered:** FR-PC-01 to FR-PC-08, FR-SD-01 to FR-SD-07 (15 FRs)

**User Value:** Each project has personality and boundaries. AI behaves appropriately per context.

---

### Story 6.1: .keep/ Context Directory

**As a** developer,
**I want** a standard project context directory,
**So that** AI behavior is configured via files.

**Acceptance Criteria:**

**Given** a new project is created
**When** initialized
**Then** a `.keep/` directory is created with:
- `SOUL.md` (project purpose)
- `GUARDRAILS.md` (never-dos, always-dos)
- Empty placeholders for optional files

**Given** these files exist
**When** AI processes any request
**Then** it reads and respects the contents

**And** .keep/ is visible in file browser (special icon)
**And** files editable like any other markdown

**FRs:** FR-PC-01, FR-PC-02, FR-PC-08

---

### Story 6.2: Soul Discovery Wizard

**As a** user,
**I want** a guided setup for my project's soul,
**So that** I don't need to write markdown from scratch.

**Acceptance Criteria:**

**Given** I create a new project
**When** the wizard starts
**Then** it asks:
- "What's this project for?" → generates SOUL.md
- "How can I help you here?" → adds AI role
- "Any things I should never do?" → generates GUARDRAILS.md

**Given** I answer the questions
**When** completing the wizard
**Then** .keep/ files are generated from my answers

**Given** I don't want to answer
**When** I click "Skip"
**Then** minimal defaults are created
**And** I can configure later

**FRs:** FR-SD-01 to FR-SD-06

---

### Story 6.3: Project Instructions UI

**As a** user,
**I want** to edit soul/guardrails via settings UI,
**So that** I don't have to find and edit files directly.

**Acceptance Criteria:**

**Given** I open project settings
**When** I go to "AI Instructions" tab
**Then** I see editors for:
- Soul (SOUL.md content)
- Guardrails (GUARDRAILS.md content)
- Optional: Procedures, Capabilities

**Given** I edit in the UI
**When** I save
**Then** the corresponding .keep/ file is updated

**And** rich text editor with markdown preview
**And** "Reset to defaults" option

**FRs:** FR-PC-07

---

### Story 6.4: Context Injection

**As a** user,
**I want** the AI to always respect my project settings,
**So that** I don't have to repeat instructions.

**Acceptance Criteria:**

**Given** I have .keep/ files configured
**When** I chat with the AI
**Then** the content is automatically included in context
**And** AI behavior reflects the instructions

**Given** my guardrails say "Never suggest X"
**When** I ask about X
**Then** the AI refuses or redirects appropriately

**And** context injection is invisible (no cluttering chat)
**And** I can ask "What are my guardrails?" to see them

**FRs:** FR-PC-08

---

## Epic 7: Data Safety & Version Control

**Goal:** Users can recover from mistakes - undo edits, restore deleted files, view file history, revert to previous versions.

**FRs Covered:** FR-DS-01 to FR-DS-06, FR-VC-01 to FR-VC-08 (14 FRs)

**User Value:** Safety net - nothing is permanently lost. Trust the system.

---

### Story 7.1: Soft Delete & Trash

**As a** user,
**I want** deleted files to go to trash,
**So that** I can recover from accidental deletions.

**Acceptance Criteria:**

**Given** I delete a file
**When** confirming
**Then** the file moves to Trash (soft delete)
**And** remains there for 30 days

**Given** I open the Trash panel
**When** viewing
**Then** I see all deleted files with:
- Original path
- Deletion date
- Days remaining until permanent delete

**Given** I select a file in Trash
**When** I click "Restore"
**Then** the file returns to its original location

**And** "Empty Trash" requires explicit confirmation
**And** toast notification shows undo option after delete

**FRs:** FR-DS-01, FR-DS-02, FR-DS-03, FR-DS-04

---

### Story 7.2: File Version Auto-Save

**As a** user,
**I want** versions automatically created,
**So that** I never lose work.

**Acceptance Criteria:**

**Given** I'm editing a file
**When** auto-save triggers
**Then** a version snapshot is created if content changed

**Given** I manually save
**When** the file saves
**Then** a version is created

**And** versions have timestamps and optional labels
**And** version storage uses delta compression
**And** auto-versioning interval configurable (default: 5 min)

**FRs:** FR-VC-01, FR-VC-08

---

### Story 7.3: Memory Recovery

**As a** user,
**I want** to recover deleted memories,
**So that** I don't lose important facts.

**Acceptance Criteria:**

**Given** I delete a memory
**When** confirming
**Then** it moves to trash with 30-day retention

**Given** I view memories
**When** I filter by "Trash" status
**Then** I see deleted memories
**And** can restore them

**And** bulk restore option available
**And** permanent delete requires confirmation

**FRs:** FR-DS-06

---

### Story 7.4: Edit Undo Stack

**As a** user,
**I want** to undo recent edits quickly,
**So that** I can recover from mistakes instantly.

**Acceptance Criteria:**

**Given** I make an edit
**When** I press Cmd+Z (or click Undo)
**Then** the last change is reverted

**Given** I've made multiple edits
**When** I undo
**Then** edits are undone in reverse order
**And** I can redo (Cmd+Shift+Z)

**And** undo history persists per file during session
**And** AI edits are in the undo stack

**FRs:** FR-DS-05

---

## Epic 8: Import & Migration

**Goal:** Users can bulk import files with audit, cleanup markdown, extract PDF text, process screenshots.

**FRs Covered:** FR-IP-01 to FR-IP-17 (17 FRs)

**User Value:** Bring your existing knowledge into The Keep. Migration path from other tools.

---

### Story 8.1: Bulk File Upload

**As a** user,
**I want** to upload multiple files at once,
**So that** I can import my existing knowledge base.

**Acceptance Criteria:**

**Given** I drag files/folders onto the file browser
**When** dropping
**Then** all files are uploaded:
- Folder structure preserved
- Progress indicator shown
- Success/failure count displayed

**Given** I click "Import"
**When** the dialog opens
**Then** I can select multiple files/folders
**And** see preview of what will be imported

**And** duplicate handling: skip, rename, or replace
**And** max file size: 100MB per file

**FRs:** FR-IP-01

---

### Story 8.2: Import Audit & Report

**As a** user,
**I want** a summary of what was imported,
**So that** I know what succeeded or failed.

**Acceptance Criteria:**

**Given** import completes
**When** viewing results
**Then** I see audit report:
- Files imported: X
- Files skipped: Y (with reasons)
- Files failed: Z (with errors)

**Given** files failed
**When** viewing failures
**Then** I see specific error per file
**And** option to retry individual files

**And** audit report saved to project (optional)
**And** can download as CSV

**FRs:** FR-IP-02

---

### Story 8.3: Format Conversion

**As a** user,
**I want** documents auto-converted to markdown,
**So that** I can edit them in The Keep.

**Acceptance Criteria:**

**Given** I import a Word document (.docx)
**When** processed
**Then** it's converted to markdown:
- Headings, lists, tables preserved
- Images extracted and linked
- Original file optionally kept as attachment

**Given** I import HTML
**When** processed
**Then** it's converted to clean markdown

**And** supported formats: .docx, .html, .rtf
**And** "Keep original" option to store source file

**FRs:** FR-IP-03, FR-IP-04

**Technical Notes:**
- Use Pandoc or similar for conversion
- Run conversion async, show progress

---

### Story 8.4: PDF Text Extraction

**As a** user,
**I want** text extracted from PDFs,
**So that** the content is searchable.

**Acceptance Criteria:**

**Given** I import a PDF
**When** processed
**Then** text is extracted to accompanying .md file
**And** original PDF is kept

**Given** the PDF is image-based (scanned)
**When** processed
**Then** OCR is attempted (best-effort)
**And** I'm notified of confidence level

**And** page breaks preserved as markdown separators
**And** tables converted (best-effort)

**FRs:** FR-IP-05, FR-IP-06

---

### Story 8.5: Markdown Cleanup

**As a** user,
**I want** imported markdown cleaned up,
**So that** it's consistent with my style.

**Acceptance Criteria:**

**Given** I import markdown files
**When** "Cleanup" option is enabled
**Then** files are normalized:
- Consistent heading style (# vs underline)
- List marker consistency (- vs *)
- Excessive whitespace removed

**Given** cleanup is applied
**When** reviewing
**Then** I can see diff of changes
**And** accept/reject per file

**FRs:** FR-IP-07

---

## Epic 9: Unified Search & Navigation

**Goal:** Users can search across files, memories, and conversations from one command palette.

**FRs Covered:** FR-US-01 to FR-US-05, FR-KB-01 to FR-KB-10 (15 FRs)

**User Value:** Find anything fast. Power user keyboard navigation.

---

### Story 9.1: Command Palette (Cmd+K)

**As a** user,
**I want** one search bar to find anything,
**So that** I can navigate quickly.

**Acceptance Criteria:**

**Given** I press Cmd+K (or Ctrl+K)
**When** the palette opens
**Then** I see a search input with:
- Placeholder: "Search files, commands, memories..."
- Recent searches
- Quick actions

**Given** I type a query
**When** results appear
**Then** they're categorized:
- Files (with path)
- Commands (with shortcut)
- Memories (with category)
- Recent items

**And** keyboard navigation: arrows to select, Enter to open
**And** Escape closes palette

**FRs:** FR-US-01, FR-KB-01, FR-KB-02

---

### Story 9.2: Keyboard Navigation

**As a** user,
**I want** to navigate entirely by keyboard,
**So that** I can work faster.

**Acceptance Criteria:**

**Given** I'm using the app
**When** I use standard shortcuts
**Then** they work:
- Cmd+K: Command palette
- Cmd+P: Quick file open
- Cmd+Shift+P: All commands
- Cmd+B: Toggle sidebar
- Cmd+\: Split editor
- Cmd+W: Close tab
- Cmd+Tab: Next tab

**And** shortcuts visible in menus and tooltips
**And** shortcuts configurable in settings

**FRs:** FR-KB-01 to FR-KB-10

---

### Story 9.3: Omni-Search Results

**As a** user,
**I want** search to find content everywhere,
**So that** I don't miss relevant items.

**Acceptance Criteria:**

**Given** I search in the command palette
**When** results load
**Then** I see matches from:
- File names
- File content
- Memory keys and values
- Conversation messages

**Given** I hover over a result
**When** preview shows
**Then** I see context snippet with match highlighted

**And** results ranked by relevance
**And** recency boosted for tie-breaking

**FRs:** FR-US-02, FR-US-03

---

### Story 9.4: Search Filters

**As a** user,
**I want** to filter search results,
**So that** I can narrow down to what I need.

**Acceptance Criteria:**

**Given** I'm in search
**When** I prefix with filter
**Then** results filter:
- `file:` - only files
- `mem:` - only memories
- `chat:` - only conversations
- `tag:` - by tag

**Given** I use multiple filters
**When** combined
**Then** they AND together

**And** filter chips show active filters
**And** click to remove filter

**FRs:** FR-US-04

---

### Story 9.5: Saved Searches

**As a** user,
**I want** to save frequent searches,
**So that** I can re-run them quickly.

**Acceptance Criteria:**

**Given** I perform a search
**When** I click "Save this search"
**Then** it's saved with a name

**Given** I open command palette
**When** I type `saved:`
**Then** I see my saved searches

**And** saved searches appear in recents
**And** can delete saved searches

**FRs:** FR-US-05

---

## Epic 10: AI Reliability & Feedback

**Goal:** AI gracefully handles failures, users can rate responses and track corrections.

**FRs Covered:** FR-HA-01 to FR-HA-06, FR-LI-01 to FR-LI-07 (13 FRs)

**User Value:** AI is reliable and improves over time. System degrades gracefully.

---

### Story 10.1: AI Health Check

**As a** developer,
**I want** to monitor AI service health,
**So that** failures are detected early.

**Acceptance Criteria:**

**Given** the app starts
**When** checking services
**Then** LiteLLM health is verified

**Given** AI service is unhealthy
**When** detected
**Then** status indicator shows warning
**And** fallback behavior triggers

**And** health check runs every 60 seconds
**And** status visible in settings

**FRs:** FR-HA-01, FR-HA-02

---

### Story 10.2: Graceful Degradation

**As a** user,
**I want** the app to work when AI is down,
**So that** I can still access my files.

**Acceptance Criteria:**

**Given** AI service fails
**When** I try to chat
**Then** I see clear error: "AI temporarily unavailable"
**And** retry option available

**Given** AI is down
**When** I use the app
**Then** file browsing, editing, search still work
**And** only AI features show unavailable

**And** queued messages retry when AI recovers
**And** no data loss during outage

**FRs:** FR-HA-03, FR-HA-04

---

### Story 10.3: Response Rating

**As a** user,
**I want** to rate AI responses,
**So that** the system can learn my preferences.

**Acceptance Criteria:**

**Given** the AI responds
**When** I hover over the response
**Then** I see rating buttons: 👍 / 👎

**Given** I click a rating
**When** confirming
**Then** rating is saved with:
- Response ID
- Rating
- Optional comment

**And** ratings visible in response history
**And** aggregate stats in settings

**FRs:** FR-LI-01, FR-LI-02

---

### Story 10.4: Correction Tracking

**As a** user,
**I want** to correct AI mistakes,
**So that** it remembers the right answer.

**Acceptance Criteria:**

**Given** the AI gives wrong information
**When** I click "Correct this"
**Then** I can provide the correct answer
**And** it's saved as a memory

**Given** a correction exists
**When** the AI answers the same question
**Then** it uses the corrected information

**And** corrections visible in memory panel
**And** can edit/delete corrections

**FRs:** FR-LI-03, FR-LI-04, FR-LI-05

---

## Epic 11: Conversation Modes & Privacy

**Goal:** Users can control AI behavior - normal, incognito, read-only modes with clear indicators.

**FRs Covered:** FR-CM-01 to FR-CM-06 (6 FRs)

**User Value:** Privacy controls for sensitive queries. Clear visibility into AI behavior.

---

### Story 11.1: Normal Mode (Default)

**As a** user,
**I want** conversations saved by default,
**So that** I can reference past discussions.

**Acceptance Criteria:**

**Given** I start a new chat
**When** in Normal mode (default)
**Then** conversation is saved to history
**And** memories may be extracted
**And** no special indicator shown

**FRs:** FR-CM-01

---

### Story 11.2: Incognito Mode

**As a** user,
**I want** private conversations,
**So that** sensitive queries aren't saved.

**Acceptance Criteria:**

**Given** I toggle Incognito mode
**When** active
**Then** a clear indicator shows (purple border/badge)
**And** conversation is not saved to history
**And** no memories are extracted
**And** no file changes are auto-saved

**Given** I close an incognito chat
**When** reopening
**Then** the conversation is gone
**And** warning shown before closing

**FRs:** FR-CM-02, FR-CM-03

---

### Story 11.3: Read-Only Mode

**As a** user,
**I want** to prevent AI from editing files,
**So that** I can explore without risk.

**Acceptance Criteria:**

**Given** I toggle Read-Only mode
**When** active
**Then** indicator shows (lock icon)
**And** AI can answer questions but cannot propose edits
**And** "Apply" buttons are disabled

**Given** I ask for an edit in read-only
**When** the AI responds
**Then** it explains the edit conceptually
**But** doesn't show apply option

**FRs:** FR-CM-04

---

### Story 11.4: Mode Indicator UI

**As a** user,
**I want** clear visibility of current mode,
**So that** I always know how my data is being handled.

**Acceptance Criteria:**

**Given** I'm in any chat
**When** viewing the header
**Then** I see current mode indicator:
- Normal: no indicator
- Incognito: purple badge "Incognito"
- Read-Only: lock icon

**Given** I want to change modes
**When** I click the indicator
**Then** dropdown shows available modes

**And** mode change only affects new messages
**And** changing mode shows confirmation

**FRs:** FR-CM-05, FR-CM-06

---

## MVP+1 Epics (Post-Launch - To Be Detailed Later)

### Epic 12: Mobile Experience
**FRs Covered:** FR-MO-01 to FR-MO-10 (10 FRs)

### Epic 13: Admin & System Settings
**FRs Covered:** FR-AD-01 to FR-AD-10 (10 FRs)

---

## MVP+2+ Epics (Future - To Be Detailed Later)

### Epic 14: Task Management & Tagging
**FRs Covered:** FR-TM-01 to FR-TM-07, FR-TA-01 to FR-TA-11, FR-NO-01 to FR-NO-07 (25 FRs)

### Epic 15: Advanced Features
**FRs Covered:** FR-EV, FR-TS, FR-DV2, FR-WS2, FR-EX, FR-GR, FR-IG, advanced FR-CM, advanced FR-IP (~40 FRs)
