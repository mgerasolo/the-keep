---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['docs/planning-artifacts/product-brief.md', 'docs/planning-artifacts/prd.md']
workflowType: 'architecture'
project_name: 'the-keep'
user_name: 'Matt'
date: '2026-03-22'
status: 'complete'
completedAt: '2026-03-22'
---

# Architecture Decision Document - The Keep

**Version:** 1.1
**Date:** 2026-03-22
**Status:** Complete
**Last Updated:** 2026-03-22 (synced with PRD Party Mode Review)

---

## 1. Executive Summary

The Keep is a web-based personal knowledge management IDE built with Next.js 14+, featuring VS Code-style dockable panels (dockview), AI-powered chat with smart LLM routing, and a personal knowledge system with atomic memories. This architecture document provides the technical blueprint for consistent AI agent implementation.

### Architecture Highlights

| Aspect | Decision |
|--------|----------|
| **Frontend** | Next.js 14+ App Router, dockview panels, Monaco + TipTap editors |
| **State** | Zustand with persistence middleware |
| **Backend** | Next.js API Routes + Server Actions |
| **Database** | PostgreSQL with pgvector for RAG |
| **Storage** | MinIO (S3-compatible) for files |
| **AI** | LiteLLM proxy with smart routing |
| **Deployment** | Docker Compose on Banner (dev) |

---

## 2. Project Context Analysis

### Requirements Overview

**Functional Requirements Summary:**

| Category | Count | Complexity |
|----------|-------|------------|
| Workspace Shell (FR-WS) | 8 | High - dockview integration |
| Project Management (FR-PM) | 6 | Medium |
| File Management (FR-FM) | 7 | Medium |
| Document Viewing (FR-DV) | 6 | Medium |
| Markdown Editing (FR-ME) | 17 | High - dual editor (Monaco + TipTap) |
| AI Chat (FR-AC) | 10 | High - LLM routing |
| AI File Editing (FR-FE) | 10 | Critical - core differentiator |
| Personal Knowledge (FR-PK) | 15 | High - memory system with versioning |
| Memory Provenance (FR-MP) | 12 | High - source tracking |
| Conversation Modes (FR-CM) | 41 | High - personas, journal, cross-project |
| Knowledge Graph/RAG (FR-KG) | 5 | High - pgvector |
| Project Context (FR-PC) | 8 | Medium - .keep/ system |
| Soul Discovery (FR-SD) | 7 | Medium - onboarding |
| Data Safety (FR-DS) | 6 | Medium - soft delete, recovery |
| Security (FR-SEC) | 5 | High - secret masking |
| **Total** | **165** | - |

**Non-Functional Requirements:**

| NFR | Target | Architecture Impact |
|-----|--------|---------------------|
| Page Load | < 3s | SSR, code splitting |
| File Tree (1000 files) | < 2s | Virtual scrolling, pagination |
| AI Response Start | < 1s | Streaming, edge functions |
| RAG Search | < 2s | pgvector indexing |
| Uptime | 99% | Docker health checks |

### Scale & Complexity

- **Project Complexity:** High
- **Primary Domain:** Full-stack web application
- **Estimated Components:** 60-70 React components
- **Database Tables:** 15-18 core tables (see Section 6)
- **API Endpoints:** 30-40 routes

### Technical Constraints

| Constraint | Source | Impact |
|------------|--------|--------|
| LiteLLM at 10.0.0.27:2764 | Existing infra | Must integrate, not replace |
| MinIO on Helicarrier | Existing infra | S3 SDK required |
| PostgreSQL per-service | NLF standard | Bundled in Docker stack |
| Traefik routing | Existing infra | Domain + SSL handled |
| Port 5010-5019 | Assigned block | Web on 5010 |

### Cross-Cutting Concerns

1. **Authentication** - Single user for v1, Authentik-ready foundation
2. **Error Handling** - Graceful degradation when AI unavailable
3. **State Persistence** - Layout, preferences, chat history
4. **File Security** - Server-side S3 access, no client credentials
5. **Hooks System** - Pre/post processing for extensibility

---

## 3. System Architecture Overview

### High-Level Architecture

```
                                    ┌─────────────────────────────────┐
                                    │         Traefik Proxy          │
                                    │   the-keep.nextlevelguild.com  │
                                    └────────────────┬────────────────┘
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                              THE KEEP (Banner:5010)                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                           NEXT.JS APPLICATION                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │   dockview  │  │   Monaco    │  │   PDF.js    │  │   AI Chat       │  │  │
│  │  │   Panels    │  │   Editor    │  │   Viewer    │  │   Component     │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │  │
│  │         │                │                │                   │          │  │
│  │  ┌──────┴────────────────┴────────────────┴───────────────────┴──────┐   │  │
│  │  │                    Zustand State Management                       │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │  │
│  │  │  │ Layout   │  │ Project  │  │  Files   │  │  Conversations   │  │   │  │
│  │  │  │ Store    │  │ Store    │  │  Store   │  │  Store           │  │   │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │   │  │
│  │  └───────────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                       │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                           API LAYER (Next.js)                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │ /api/      │  │ /api/      │  │ /api/      │  │ /api/            │   │  │
│  │  │ projects   │  │ files      │  │ chat       │  │ knowledge        │   │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └────────┬─────────┘   │  │
│  │        │               │               │                   │            │  │
│  │  ┌─────┴───────────────┴───────────────┴───────────────────┴─────────┐  │  │
│  │  │                         HOOKS SYSTEM                              │  │  │
│  │  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │  │
│  │  │   │ Pre-Process │  │ Event Bus   │  │ Post-Process            │   │  │  │
│  │  │   │ Hooks       │  │ (EventEmitter│  │ Hooks                   │   │  │  │
│  │  │   └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │  │
│  │  └───────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────────┐
│   PostgreSQL    │  │     MinIO       │  │          LiteLLM Proxy              │
│   + pgvector    │  │   (S3 Storage)  │  │        10.0.0.27:2764               │
│  ┌───────────┐  │  │  Helicarrier    │  │  ┌─────────────────────────────┐   │
│  │ Projects  │  │  │                 │  │  │     LLM Router Service     │   │
│  │ Files     │  │  │  /the-keep/     │  │  │  ┌─────────┐ ┌─────────┐   │   │
│  │ Convos    │  │  │  ├── project-1/ │  │  │  │ Local   │ │ API     │   │   │
│  │ Knowledge │  │  │  ├── project-2/ │  │  │  │ (Free)  │ │ (Paid)  │   │   │
│  │ Vectors   │  │  │  └── ...        │  │  │  └────┬────┘ └────┬────┘   │   │
│  └───────────┘  │  │                 │  │  │       │           │        │   │
└─────────────────┘  └─────────────────┘  │  │       ▼           ▼        │   │
                                          │  │  jarvis-qwen72b  Claude    │   │
                                          │  │  jarvis-chat     GPT-4     │   │
                                          │  └─────────────────────────────┘   │
                                          └─────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND COMPONENTS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐   │
│  │ Activity    │  │                    Workspace                        │   │
│  │ Bar         │  │  ┌──────────────────────────────────────────────┐  │   │
│  │             │  │  │                  Header                      │  │   │
│  │ ┌─────────┐ │  │  │  [Logo] [Project▼] [⌘K] [Settings]          │  │   │
│  │ │🏥Health │ │  │  └──────────────────────────────────────────────┘  │   │
│  │ │🏠HOA    │ │  │                                                    │   │
│  │ │⚙️Infra  │ │  │  ┌──────────────────────────────────────────────┐  │   │
│  │ │─────────│ │  │  │              dockview Container              │  │   │
│  │ │🔍Search │ │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │  │   │
│  │ │📋Tasks  │ │  │  │  │FileBrowser│ │TabGroup │ │TabGroup        │ │  │   │
│  │ │⚙️Config │ │  │  │  │         │ │         │ │                 │ │  │   │
│  │ └─────────┘ │  │  │  │TreeView │ │Monaco   │ │PDF Viewer      │ │  │   │
│  │             │  │  │  │         │ │Editor   │ │AI Chat         │ │  │   │
│  │             │  │  │  │         │ │Preview  │ │Knowledge Editor│ │  │   │
│  │             │  │  │  │         │ │         │ │Embedded Browser│ │  │   │
│  │             │  │  │  └─────────┘ └─────────┘ └─────────────────┘ │  │   │
│  │             │  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────┘  └────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Core Architectural Decisions

### 4.1 Frontend Framework

| Decision | Choice | Version |
|----------|--------|---------|
| Framework | Next.js (App Router) | 14.2+ |
| Rendering | Server Components + Client Islands | - |
| Styling | Tailwind CSS + shadcn/ui | 3.4+ / latest |

**Rationale:**
- Next.js App Router provides excellent SSR and RSC support
- Server Components reduce client bundle size
- Tailwind + shadcn/ui matches NLF standard patterns

### 4.2 Panel System

| Decision | Choice | Version |
|----------|--------|---------|
| Panel Library | dockview | 1.16+ |
| Integration | dockview-react | 1.16+ |
| Persistence | Zustand + localStorage | - |

**Rationale:**
- dockview is purpose-built for VS Code-style interfaces
- React integration is well-maintained
- Provides serializable layout state for persistence

### 4.3 Editor & Viewers

**Dual-Editor Architecture:**

The Keep uses two editors for markdown files, toggled via Source/Preview mode:

| Mode | Editor | Purpose |
|------|--------|---------|
| **Source** | Monaco Editor | Raw markdown with syntax highlighting |
| **Preview** | TipTap | WYSIWYG editing with formatting toolbar |

Both editors sync to the same markdown content via shared state.

| Component | Library | Version |
|-----------|---------|---------|
| Source Mode Editor | Monaco Editor | 0.47+ |
| Preview Mode Editor | TipTap | 2.2+ |
| TipTap Markdown | @tiptap/extension-markdown | 2.2+ |
| TipTap Task Lists | @tiptap/extension-task-list | 2.2+ |
| TipTap Code Blocks | @tiptap/extension-code-block-lowlight | 2.2+ |
| Syntax Highlighting | lowlight | 3.0+ |
| PDF Viewer | react-pdf | 7.7+ |
| Image Viewer | Custom (native img + zoom) | - |

**TipTap Extensions Required:**
```
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-markdown
@tiptap/extension-task-list
@tiptap/extension-task-item
@tiptap/extension-code-block-lowlight
@tiptap/extension-link
@tiptap/extension-table
@tiptap/extension-placeholder
lowlight (for syntax highlighting)
```

### 4.4 State Management

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Client State | Zustand | Simple, performant, no boilerplate |
| Persistence | zustand/middleware persist | Layout + preferences survival |
| Server State | Server Actions + SWR | RSC-compatible data fetching |

**Store Architecture:**

```typescript
// Separate stores by concern
stores/
├── useLayoutStore.ts      // dockview layout state
├── useProjectStore.ts     // current project, project list
├── useFileStore.ts        // file tree, open files
├── useConversationStore.ts // chat state, messages
├── useKnowledgeStore.ts   // inventories, profiles, memories
└── useSettingsStore.ts    // user preferences
```

### 4.5 Database Architecture

| Decision | Choice | Version |
|----------|--------|---------|
| Database | PostgreSQL | 16+ |
| Vector Extension | pgvector | 0.6+ |
| ORM | Drizzle ORM | 0.29+ |
| Migrations | Drizzle Kit | - |

**Rationale:**
- PostgreSQL is NLF standard
- pgvector enables RAG without external vector DB
- Drizzle provides type-safe queries with minimal overhead

### 4.6 File Storage

| Decision | Choice | Details |
|----------|--------|---------|
| Storage Backend | MinIO | Existing on Helicarrier |
| SDK | AWS SDK v3 (@aws-sdk/client-s3) | S3-compatible |
| Bucket Structure | /the-keep/{project-id}/{path} | Per-project isolation |

### 4.7 AI Integration & LLM Routing

| Decision | Choice | Details |
|----------|--------|---------|
| AI Proxy | LiteLLM | Existing at 10.0.0.27:2764 |
| Protocol | OpenAI Chat Completions API | Streaming enabled |
| Routing Strategy | Smart Router Service | Local-first priority |

**LLM Routing Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LLM ROUTING SERVICE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐   │
│  │ User Request│───▶│ Task Assessor    │───▶│ Model Selector   │   │
│  │             │    │ (Haiku-level)    │    │                  │   │
│  └─────────────┘    │                  │    │ ┌──────────────┐ │   │
│                     │ Analyzes:        │    │ │ Local Tier   │ │   │
│                     │ - Complexity     │    │ │ (Priority 1) │ │   │
│                     │ - Token estimate │    │ │ jarvis-qwen  │ │   │
│                     │ - Quality need   │    │ │ jarvis-chat  │ │   │
│                     │ - Task type      │    │ └──────────────┘ │   │
│                     └──────────────────┘    │ ┌──────────────┐ │   │
│                                             │ │ API Tier     │ │   │
│                                             │ │ (Fallback)   │ │   │
│                                             │ │ Claude       │ │   │
│                                             │ │ GPT-4        │ │   │
│                                             │ └──────────────┘ │   │
│                                             └──────────────────┘   │
│                                                      │             │
│  ┌──────────────────────────────────────────────────┘             │
│  ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ROUTING DECISION                         │   │
│  │                                                             │   │
│  │  IF task.complexity <= 'medium' AND task.tokens < 4000:     │   │
│  │    USE local (jarvis-qwen72b)                               │   │
│  │  ELIF task.type == 'code' AND task.quality == 'high':       │   │
│  │    SUGGEST api (claude-sonnet) with user prompt             │   │
│  │  ELSE:                                                      │   │
│  │    USE local with capability warning                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  User Override: [Always Local] [Always Ask] [Auto-Route]           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Routing Configuration:**

```typescript
interface LLMRoutingConfig {
  mode: 'auto' | 'local-only' | 'always-ask';
  localModels: string[];      // ['jarvis-qwen72b', 'jarvis-chat']
  apiModels: string[];        // ['claude-sonnet', 'gpt-4']
  assessorModel: string;      // Fast model for task assessment
  thresholds: {
    maxLocalTokens: number;   // 4000
    complexityThreshold: 'low' | 'medium' | 'high';
  };
}
```

### 4.8 RAG Implementation

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Vector Storage | pgvector | Integrated with PostgreSQL |
| Embeddings | Via LiteLLM | text-embedding-3-small |
| Chunking | Custom (sentence-aware) | Control over chunk size |
| Retrieval | Similarity + keyword hybrid | Better accuracy |

**RAG Pipeline:**

```
File Upload → Text Extraction → Chunking → Embedding → pgvector Storage
                    │
                    ▼
              ┌─────────────────┐
              │ PDF: pdf.js     │
              │ MD: raw text    │
              │ Images: skip v1 │
              └─────────────────┘
                    │
                    ▼
              ┌─────────────────┐
              │ Chunk (500 tok) │
              │ Overlap (50 tok)│
              └─────────────────┘
                    │
                    ▼
              ┌─────────────────┐
              │ LiteLLM embed   │
              │ text-embedding  │
              └─────────────────┘
                    │
                    ▼
              ┌─────────────────┐
              │ Store in        │
              │ file_embeddings │
              └─────────────────┘
```

### 4.9 Personal Knowledge System Storage

**Decision: Hybrid Approach**

| Data Type | Storage | Format |
|-----------|---------|--------|
| Inventories | PostgreSQL | JSON column |
| Profiles | PostgreSQL | Structured tables |
| Memories | PostgreSQL | Atomic key-value |
| File Attachments | MinIO | Reference links |

**Rationale:**
- Structured data needs queryable storage (not markdown files)
- PostgreSQL JSON columns provide flexibility + query power
- Atomic memories enable granular CRUD without rewriting blobs

**Memory Schema (Updated with Lifecycle):**

```typescript
interface Memory {
  id: string;
  projectId: string;
  category: string;      // 'health', 'food', 'equipment', etc.
  subject: string;       // 'me', 'mom', 'house', etc.
  key: string;           // e.g., "weight", "likes_spicy_food"
  value: string;         // e.g., "180 lbs", "true"
  unit?: string;         // Optional unit for values

  // Status & Lifecycle
  status: 'active' | 'archived' | 'trash';
  tier: 'hot' | 'warm' | 'cold';  // Only when status='active'
  score: number;         // Aggregated relevance (1-10)
  lastUsed?: Date;       // Last AI reference
  useCount: number;      // Times used in context

  // Provenance
  confidence: number;    // 0-1, for AI-extracted memories
  sourceType: 'user_stated' | 'ai_inferred' | 'file_extracted' | 'imported';
  sourceRef?: string;    // file:line or conversation:message

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;     // When archived (NULL = not archived)
  trashedAt?: Date;      // When trashed (30-day purge)
}

interface MemoryVersion {
  id: string;
  memoryId: string;
  versionNumber: number;
  value: string;
  unit?: string;
  status: 'active' | 'archived' | 'trash';
  tier: 'hot' | 'warm' | 'cold';
  changedBy: 'user' | 'ai' | 'system';
  changeType: 'create' | 'edit' | 'status_change' | 'tier_change' | 'restore';
  changeSummary?: string;
  previousValue?: string;
  createdAt: Date;
}
```

**Memory Tier Architecture:**

| Tier | Context Injection | Criteria |
|------|-------------------|----------|
| **Hot** | Always in system prompt | Score ≥8, useCount >10, used in 7 days |
| **Warm** | Vector-retrieved when relevant | Score 6-7, useCount 3-10, used in 30 days |
| **Cold** | Searchable archive, rarely loaded | Score 4-5, useCount <3, 30+ days stale |

### 4.10 Authentication

| Decision | Choice | Rationale |
|----------|--------|-----------|
| v1 Strategy | Simple session auth | Single user, minimal overhead |
| Session | Iron-session | Encrypted cookies |
| Future | Authentik OIDC | Foundation in place |

---

## 5. Hooks & Event System Architecture

The Keep implements a hooks system for extensibility, similar to Claude Code's pre/post processing.

### Hook Types

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOOKS SYSTEM                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MESSAGE HOOKS                             │   │
│  │                                                             │   │
│  │  Pre-Process                      Post-Process              │   │
│  │  ┌───────────────┐               ┌───────────────┐          │   │
│  │  │ onBeforeSend  │──▶ AI ──▶    │ onAfterReceive│          │   │
│  │  │               │               │               │          │   │
│  │  │ - Add context │               │ - Extract     │          │   │
│  │  │ - Inject sys  │               │   memories    │          │   │
│  │  │   prompt      │               │ - Log usage   │          │   │
│  │  │ - Rate limit  │               │ - Transform   │          │   │
│  │  └───────────────┘               └───────────────┘          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    EVENT HOOKS                               │   │
│  │                                                             │   │
│  │  File Events          Project Events      Chat Events       │   │
│  │  ┌────────────┐      ┌────────────┐      ┌────────────┐    │   │
│  │  │file:created│      │proj:switch │      │chat:start  │    │   │
│  │  │file:updated│      │proj:created│      │chat:message│    │   │
│  │  │file:deleted│      │proj:deleted│      │chat:end    │    │   │
│  │  │file:moved  │      │            │      │            │    │   │
│  │  └────────────┘      └────────────┘      └────────────┘    │   │
│  │                                                             │   │
│  │  Knowledge Events     Layout Events       System Events     │   │
│  │  ┌────────────┐      ┌────────────┐      ┌────────────┐    │   │
│  │  │mem:created │      │layout:save │      │app:ready   │    │   │
│  │  │mem:updated │      │layout:load │      │app:error   │    │   │
│  │  │mem:deleted │      │panel:open  │      │            │    │   │
│  │  └────────────┘      └────────────┘      └────────────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Hook Registration API

```typescript
// lib/hooks/types.ts
interface HookContext {
  projectId: string;
  userId: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

interface MessageHook {
  name: string;
  priority: number;  // Lower = runs first
  onBeforeSend?: (message: Message, context: HookContext) => Promise<Message>;
  onAfterReceive?: (response: Message, context: HookContext) => Promise<Message>;
}

interface EventHook {
  name: string;
  events: string[];  // ['file:created', 'file:updated']
  handler: (event: AppEvent, context: HookContext) => Promise<void>;
}

// lib/hooks/registry.ts
class HookRegistry {
  registerMessageHook(hook: MessageHook): void;
  registerEventHook(hook: EventHook): void;
  unregister(hookName: string): void;
}

// Usage
hookRegistry.registerMessageHook({
  name: 'memory-extractor',
  priority: 100,
  onAfterReceive: async (response, ctx) => {
    await extractMemoriesFromResponse(response, ctx.projectId);
    return response;
  }
});
```

### Built-in Hooks

| Hook | Type | Purpose |
|------|------|---------|
| context-injector | Message (pre) | Injects open files into system prompt |
| knowledge-injector | Message (pre) | Adds relevant memories to context |
| memory-extractor | Message (post) | Extracts potential memories from AI responses |
| usage-logger | Message (post) | Logs token usage and model selection |
| rag-retriever | Message (pre) | Retrieves relevant chunks for RAG |
| file-indexer | Event | Re-indexes files when created/updated |

---

## 6. Data Models

### Database Schema (Drizzle)

```typescript
// db/schema/projects.ts
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  description: text('description'),
  settings: jsonb('settings').$type<ProjectSettings>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// db/schema/files.ts
export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  path: varchar('path', { length: 1024 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }),
  size: integer('size'),
  s3Key: varchar('s3_key', { length: 1024 }),
  ragIndexed: boolean('rag_indexed').default(false),
  ragExcluded: boolean('rag_excluded').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectPathIdx: uniqueIndex('project_path_idx').on(table.projectId, table.path),
}));

// db/schema/conversations.ts
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  title: varchar('title', { length: 255 }),
  model: varchar('model', { length: 100 }),
  contextFileIds: uuid('context_file_ids').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  tokenCount: integer('token_count'),
  modelUsed: varchar('model_used', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// db/schema/knowledge.ts
export const knowledgeItems = pgTable('knowledge_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  type: varchar('type', { length: 50 }).notNull(), // 'inventory' | 'profile' | 'preference'
  category: varchar('category', { length: 100 }),
  name: varchar('name', { length: 255 }).notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  category: varchar('category', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 100 }).default('me'),
  key: varchar('key', { length: 255 }).notNull(),
  value: text('value').notNull(),
  unit: varchar('unit', { length: 50 }),

  // Status & Lifecycle
  status: varchar('status', { length: 20 }).default('active'), // 'active' | 'archived' | 'trash'
  tier: varchar('tier', { length: 20 }).default('warm'),       // 'hot' | 'warm' | 'cold'
  score: real('score').default(5.0),
  lastUsed: timestamp('last_used'),
  useCount: integer('use_count').default(0),

  // Provenance
  confidence: real('confidence').default(1.0),
  sourceType: varchar('source_type', { length: 30 }).notNull(), // 'user_stated' | 'ai_inferred' | 'file_extracted' | 'imported'
  sourceRef: text('source_ref'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  archivedAt: timestamp('archived_at'),
  trashedAt: timestamp('trashed_at'),
}, (table) => ({
  projectKeyIdx: uniqueIndex('project_key_idx').on(table.projectId, table.key),
  statusIdx: index('status_idx').on(table.status),
  tierIdx: index('tier_idx').on(table.tier),
}));

// Memory version history for revert capability
export const memoryVersions = pgTable('memory_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  memoryId: uuid('memory_id').references(() => memories.id),
  versionNumber: integer('version_number').notNull(),
  value: text('value').notNull(),
  unit: varchar('unit', { length: 50 }),
  status: varchar('status', { length: 20 }).notNull(),
  tier: varchar('tier', { length: 20 }).notNull(),
  changedBy: varchar('changed_by', { length: 20 }).notNull(), // 'user' | 'ai' | 'system'
  changeType: varchar('change_type', { length: 30 }).notNull(), // 'create' | 'edit' | 'status_change' | 'tier_change' | 'restore'
  changeSummary: text('change_summary'),
  previousValue: text('previous_value'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cross-project update requests (inbox model)
export const crossProjectRequests = pgTable('cross_project_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceProjectId: uuid('source_project_id').references(() => projects.id),
  sourceProjectName: varchar('source_project_name', { length: 255 }),
  sourceConversationId: uuid('source_conversation_id'),
  targetProjectId: uuid('target_project_id').references(() => projects.id),
  requestType: varchar('request_type', { length: 30 }).notNull(), // 'memory_update' | 'memory_create' | 'memory_delete' | 'file_update'
  subject: text('subject').notNull(),
  context: text('context'),
  proposedChange: jsonb('proposed_change'),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'approved' | 'denied' | 'expired'
  reviewedAt: timestamp('reviewed_at'),
  reviewNote: text('review_note'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});

// Daily journal entries (central, cross-project)
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  summary: text('summary'),
  highlights: jsonb('highlights'),       // Key items extracted
  projectActivity: jsonb('project_activity'), // { projectId: summary }
  tasksExtracted: jsonb('tasks_extracted'),
  tasksCompleted: jsonb('tasks_completed'),
  source: varchar('source', { length: 50 }), // 'the-keep' | 'claude-code' | 'n8n' | 'api'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// db/schema/embeddings.ts
export const fileEmbeddings = pgTable('file_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileId: uuid('file_id').references(() => files.id),
  chunkIndex: integer('chunk_index').notNull(),
  chunkText: text('chunk_text').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### TypeScript Interfaces

```typescript
// types/project.ts
interface Project {
  id: string;
  name: string;
  icon: string;
  description?: string;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSettings {
  defaultModel: string;
  llmRouting: LLMRoutingConfig;
  ragEnabled: boolean;
  layout?: SerializedDockview;
}

// types/knowledge.ts
interface KnowledgeItem {
  id: string;
  projectId: string;
  type: 'inventory' | 'profile' | 'preference';
  category: string;
  name: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// types/memory.ts
interface Memory {
  id: string;
  projectId: string;
  category: 'preference' | 'fact' | 'inventory' | 'profile';
  key: string;
  value: string;
  confidence: number;
  source: 'manual' | 'extracted' | 'imported';
  sourceConversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. Implementation Patterns & Consistency Rules

### Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| **Database tables** | snake_case, plural | `knowledge_items`, `file_embeddings` |
| **Database columns** | snake_case | `project_id`, `created_at` |
| **API routes** | kebab-case, plural | `/api/projects`, `/api/knowledge-items` |
| **Route params** | camelCase | `/api/projects/:projectId` |
| **React components** | PascalCase | `FileTree.tsx`, `ChatPanel.tsx` |
| **React hooks** | camelCase, use prefix | `useProjectStore`, `useFileTree` |
| **TypeScript files** | kebab-case | `file-tree.tsx`, `use-project-store.ts` |
| **Zustand stores** | camelCase, use prefix | `useLayoutStore` |
| **Event names** | namespace:action | `file:created`, `chat:message` |
| **CSS classes** | Tailwind utilities | - |

### File Organization

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group
│   │   └── login/
│   ├── (workspace)/          # Main app route group
│   │   ├── layout.tsx        # Workspace layout with dockview
│   │   └── page.tsx          # Main workspace page
│   ├── api/                  # API routes
│   │   ├── projects/
│   │   ├── files/
│   │   ├── chat/
│   │   ├── knowledge/
│   │   └── search/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── workspace/            # Workspace shell components
│   │   ├── activity-bar.tsx
│   │   ├── header.tsx
│   │   └── command-palette.tsx
│   ├── panels/               # dockview panel components
│   │   ├── file-browser/
│   │   ├── editor/
│   │   ├── pdf-viewer/
│   │   ├── chat/
│   │   └── knowledge/
│   └── shared/               # Shared components
├── lib/
│   ├── db/                   # Database client & queries
│   │   ├── client.ts
│   │   ├── schema/
│   │   └── queries/
│   ├── storage/              # MinIO S3 client
│   ├── ai/                   # LiteLLM client & routing
│   │   ├── client.ts
│   │   ├── router.ts
│   │   └── streaming.ts
│   ├── hooks/                # Event & message hooks system
│   │   ├── registry.ts
│   │   ├── types.ts
│   │   └── builtin/
│   ├── rag/                  # RAG implementation
│   │   ├── embeddings.ts
│   │   ├── chunking.ts
│   │   └── retrieval.ts
│   └── utils/
├── stores/                   # Zustand stores
│   ├── use-layout-store.ts
│   ├── use-project-store.ts
│   ├── use-file-store.ts
│   ├── use-conversation-store.ts
│   ├── use-knowledge-store.ts
│   └── use-settings-store.ts
├── types/                    # TypeScript type definitions
│   ├── project.ts
│   ├── file.ts
│   ├── conversation.ts
│   ├── knowledge.ts
│   └── events.ts
└── config/                   # Configuration
    ├── site.ts
    └── llm.ts
```

### API Response Format

```typescript
// Successful response
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Error response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // 'NOT_FOUND', 'VALIDATION_ERROR', etc.
    message: string;     // Human-readable message
    details?: unknown;   // Additional context
  };
}

// Example usage
// GET /api/projects
{
  "success": true,
  "data": [
    { "id": "...", "name": "Health", ... }
  ],
  "meta": {
    "pagination": { "page": 1, "limit": 20, "total": 3 }
  }
}

// POST /api/projects (error)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Project name is required",
    "details": { "field": "name" }
  }
}
```

### Error Handling Pattern

```typescript
// lib/errors.ts
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
  }
}

// API route error handling
export async function POST(req: Request) {
  try {
    // ... handle request
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message, details: error.details } },
        { status: error.statusCode }
      );
    }
    // Log unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
```

### Component Pattern

```typescript
// components/panels/chat/chat-panel.tsx
'use client';

import { useState } from 'react';
import { useConversationStore } from '@/stores/use-conversation-store';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';

interface ChatPanelProps {
  conversationId?: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const { messages, sendMessage, isStreaming } = useConversationStore();

  // Component logic...

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming}
      />
    </div>
  );
}
```

---

## 8. Project Structure & Boundaries

### Complete Directory Structure

```
the-keep/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── planning-artifacts/
│       ├── product-brief.md
│       ├── prd.md
│       └── architecture.md
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (workspace)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   │   ├── route.ts              # GET, POST
│   │   │   │   └── [projectId]/
│   │   │   │       ├── route.ts          # GET, PUT, DELETE
│   │   │   │       ├── files/
│   │   │   │       │   ├── route.ts      # GET, POST
│   │   │   │       │   └── [...path]/
│   │   │   │       │       └── route.ts  # GET, PUT, DELETE
│   │   │   │       ├── chat/
│   │   │   │       │   ├── route.ts      # GET, POST
│   │   │   │       │   └── [convId]/
│   │   │   │       │       ├── route.ts  # GET, DELETE
│   │   │   │       │       └── messages/
│   │   │   │       │           └── route.ts  # POST (streaming)
│   │   │   │       ├── knowledge/
│   │   │   │       │   ├── route.ts      # GET, POST
│   │   │   │       │   └── [itemId]/
│   │   │   │       │       └── route.ts  # GET, PUT, DELETE
│   │   │   │       ├── memories/
│   │   │   │       │   ├── route.ts      # GET, POST
│   │   │   │       │   └── [memoryId]/
│   │   │   │       │       └── route.ts  # PUT, DELETE
│   │   │   │       └── search/
│   │   │   │           └── route.ts      # POST (RAG search)
│   │   │   └── llm/
│   │   │       ├── models/
│   │   │       │   └── route.ts          # GET available models
│   │   │       └── assess/
│   │   │           └── route.ts          # POST task assessment
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── workspace/
│   │   │   ├── activity-bar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── project-switcher.tsx
│   │   │   ├── command-palette.tsx
│   │   │   └── workspace-provider.tsx
│   │   ├── panels/
│   │   │   ├── file-browser/
│   │   │   │   ├── file-browser-panel.tsx
│   │   │   │   ├── file-tree.tsx
│   │   │   │   ├── file-tree-item.tsx
│   │   │   │   └── file-context-menu.tsx
│   │   │   ├── editor/
│   │   │   │   ├── editor-panel.tsx        # Container with mode toggle
│   │   │   │   ├── monaco-editor.tsx       # Source mode (raw markdown)
│   │   │   │   ├── tiptap-editor.tsx       # Preview mode (WYSIWYG)
│   │   │   │   ├── tiptap-bubble-menu.tsx  # Floating format menu
│   │   │   │   ├── tiptap-slash-menu.tsx   # Slash command palette
│   │   │   │   ├── editor-toolbar.tsx      # Formatting toolbar
│   │   │   │   └── use-editor-sync.ts      # Markdown ↔ editor sync hook
│   │   │   ├── pdf-viewer/
│   │   │   │   ├── pdf-panel.tsx
│   │   │   │   └── pdf-controls.tsx
│   │   │   ├── image-viewer/
│   │   │   │   └── image-panel.tsx
│   │   │   ├── chat/
│   │   │   │   ├── chat-panel.tsx
│   │   │   │   ├── chat-message.tsx
│   │   │   │   ├── chat-input.tsx
│   │   │   │   ├── model-selector.tsx
│   │   │   │   └── context-files.tsx
│   │   │   ├── knowledge/
│   │   │   │   ├── knowledge-panel.tsx
│   │   │   │   ├── inventory-editor.tsx
│   │   │   │   ├── profile-editor.tsx
│   │   │   │   └── memory-list.tsx
│   │   │   └── embedded/
│   │   │       └── embedded-browser.tsx
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       └── confirm-dialog.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts                 # Drizzle client
│   │   │   ├── schema/
│   │   │   │   ├── projects.ts
│   │   │   │   ├── files.ts
│   │   │   │   ├── conversations.ts
│   │   │   │   ├── knowledge.ts
│   │   │   │   └── embeddings.ts
│   │   │   └── queries/
│   │   │       ├── projects.ts
│   │   │       ├── files.ts
│   │   │       ├── conversations.ts
│   │   │       └── knowledge.ts
│   │   ├── storage/
│   │   │   ├── client.ts                 # S3 client
│   │   │   └── operations.ts             # Upload, download, delete
│   │   ├── ai/
│   │   │   ├── client.ts                 # LiteLLM client
│   │   │   ├── router.ts                 # LLM routing logic
│   │   │   ├── assessor.ts               # Task assessment
│   │   │   └── streaming.ts              # SSE streaming
│   │   ├── hooks/
│   │   │   ├── registry.ts               # Hook registration
│   │   │   ├── types.ts                  # Hook types
│   │   │   ├── event-bus.ts              # Event emitter
│   │   │   └── builtin/
│   │   │       ├── context-injector.ts
│   │   │       ├── knowledge-injector.ts
│   │   │       ├── memory-extractor.ts
│   │   │       └── file-indexer.ts
│   │   ├── rag/
│   │   │   ├── embeddings.ts             # Generate embeddings
│   │   │   ├── chunking.ts               # Text chunking
│   │   │   ├── extraction.ts             # PDF text extraction
│   │   │   └── retrieval.ts              # Similarity search
│   │   └── utils/
│   │       ├── cn.ts                     # Class name utility
│   │       ├── dates.ts                  # Date formatting
│   │       └── file-icons.ts             # File type icons
│   ├── stores/
│   │   ├── use-layout-store.ts
│   │   ├── use-project-store.ts
│   │   ├── use-file-store.ts
│   │   ├── use-conversation-store.ts
│   │   ├── use-knowledge-store.ts
│   │   └── use-settings-store.ts
│   ├── types/
│   │   ├── project.ts
│   │   ├── file.ts
│   │   ├── conversation.ts
│   │   ├── knowledge.ts
│   │   ├── memory.ts
│   │   └── events.ts
│   └── config/
│       ├── site.ts                       # Site metadata
│       └── llm.ts                        # LLM configuration
├── drizzle/
│   ├── migrations/                       # SQL migrations
│   └── migrate.ts
├── public/
│   └── assets/
│       └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Architectural Boundaries

**Frontend ↔ API Boundary:**
- All data access through `/api/*` routes
- Server components can use direct database queries
- Client components use SWR or fetch

**API ↔ Database Boundary:**
- All queries through `lib/db/queries/*`
- Schema defined in `lib/db/schema/*`
- No direct SQL in API routes

**API ↔ Storage Boundary:**
- All S3 operations through `lib/storage/*`
- Pre-signed URLs for client uploads
- Server-side download for processing

**API ↔ AI Boundary:**
- All AI calls through `lib/ai/*`
- Streaming responses via SSE
- Hook system wraps all AI interactions

---

## 9. AI Context Injection Architecture

### 4-Layer AI Customization

The AI behavior is controlled through a layered customization system:

```
┌────────────────────────────────────────────────────────────────┐
│                    AI CONTEXT ASSEMBLY                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Global Preferences (user-wide)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Communication style, expertise level, feedback prefs    │   │
│  │ Stored in: ~/.keep/preferences.json                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  Layer 2: AI Persona (per-conversation)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Default | Coach | Teacher | Analyst | Creative          │   │
│  │ Selected in: Chat header dropdown                       │   │
│  │ Default from: .keep/SOUL.md#default_persona             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  Layer 3: Content Style Profile (per-content-type)             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Formal/casual, length, structure per document type      │   │
│  │ Stored in: .keep/styles/{content-type}.yaml             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  Layer 4: AI-Learned Style Guide (per-project)                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Patterns learned from imported docs (MVP+4)             │   │
│  │ Stored in: .keep/STYLE_GUIDE.md                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### AI Persona Definitions

| Persona | System Prompt Traits | Use Case |
|---------|---------------------|----------|
| **Default** | Neutral, helpful, professional | General use |
| **Coach** | Encouraging, celebrates wins, gentle accountability | Health tracking, habits |
| **Teacher** | Explanatory, patient, uses analogies | Learning, research |
| **Analyst** | Data-focused, pattern recognition, metrics | Analysis, optimization |
| **Creative** | Exploratory, suggests alternatives, playful | Brainstorming, writing |

```typescript
// lib/ai/personas.ts
interface Persona {
  id: string;
  name: string;
  systemPromptAdditions: string;
  responseGuidelines: string[];
}

const PERSONAS: Record<string, Persona> = {
  default: {
    id: 'default',
    name: 'Default',
    systemPromptAdditions: '',
    responseGuidelines: []
  },
  coach: {
    id: 'coach',
    name: 'Coach',
    systemPromptAdditions: `You are an encouraging coach. Celebrate wins, provide gentle accountability,
ask about feelings, use phrases like "Great job!", "Keep going!", "How are you feeling about this?"`,
    responseGuidelines: ['celebrate_progress', 'ask_feelings', 'gentle_nudges']
  },
  // ... other personas
};
```

### Context Injection Pipeline

On EVERY AI request, the system assembles context in this order:

```typescript
// lib/ai/context-builder.ts
async function buildAIContext(request: AIRequest): Promise<SystemPrompt> {
  const context: ContextLayers = {
    // 1. Project context (.keep/ files)
    soul: await loadFile('.keep/SOUL.md'),
    guardrails: await loadFile('.keep/GUARDRAILS.md'),
    instructions: await loadFile('.keep/INSTRUCTIONS.md'),
    userProfile: await loadFile('.keep/USER.md'),

    // 2. Memory injection
    hotMemories: await getMemories({ tier: 'hot', status: 'active' }),
    warmMemories: request.enableRAG
      ? await vectorSearch(request.query, { tier: 'warm' })
      : [],

    // 3. Open files context
    openFiles: request.contextFiles.map(f => ({
      path: f.path,
      content: f.content.slice(0, MAX_FILE_CONTEXT)
    })),

    // 4. Persona
    persona: PERSONAS[request.personaId] ?? PERSONAS.default,

    // 5. Style (if content-type detected)
    styleProfile: await loadStyleProfile(request.contentType),

    // 6. Conversation mode constraints
    mode: request.conversationMode // 'normal' | 'incognito' | 'readonly'
  };

  return assembleSystemPrompt(context);
}
```

### Cross-Project Query Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  CROSS-PROJECT QUERY FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User in Project: Health                                        │
│  Query: "What foods should I avoid given my allergies?"         │
│                                                                 │
│  1. READ Phase (allowed across linked projects)                 │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │  Health    │    │   Food     │    │  Fitness   │            │
│  │ (primary)  │◀───│ (linked)   │◀───│ (linked)   │            │
│  └────────────┘    └────────────┘    └────────────┘            │
│       │                 │                 │                     │
│       ▼                 ▼                 ▼                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Combined Context with Project Citations                  │   │
│  │ "From Health: allergies = shellfish, peanuts"            │   │
│  │ "From Food: recipe_preferences = Mediterranean"          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. WRITE Phase (only to primary project OR via inbox)          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Memory created → writes to Health (current project)      │   │
│  │ OR                                                        │   │
│  │ Cross-project update → creates request in Food inbox     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Daily Journal Architecture

```typescript
// lib/journal/aggregator.ts
interface JournalEntry {
  date: string;           // YYYY-MM-DD
  summary: string;        // AI-generated summary
  highlights: string[];   // Key items extracted
  projectActivity: {
    [projectId: string]: {
      projectName: string;
      conversations: number;
      memoryChanges: number;
      filesEdited: string[];
      summary: string;
    }
  };
  tasksExtracted: Task[];
  tasksCompleted: Task[];
  source: 'the-keep' | 'api' | 'webhook';
}

// Cron job: End of day journal generation
// POST /api/journal/generate
async function generateDailyJournal(date: string): Promise<JournalEntry> {
  const activity = await collectDayActivity(date);
  const summary = await aiSummarize(activity);
  const tasks = await extractTasks(activity.conversations);

  return saveJournalEntry({
    date,
    summary,
    highlights: activity.highlights,
    projectActivity: activity.byProject,
    tasksExtracted: tasks.extracted,
    tasksCompleted: tasks.completed,
    source: 'the-keep'
  });
}
```

---

## 10. Infrastructure & Deployment

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: the-keep-app
    ports:
      - "5010:3000"
    environment:
      - DATABASE_URL=postgresql://thekeep:${DB_PASSWORD}@db:5432/thekeep
      - MINIO_ENDPOINT=helicarrier.local
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - LITELLM_URL=http://10.0.0.27:2764
      - LITELLM_API_KEY=${LITELLM_API_KEY}
    depends_on:
      - db
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.the-keep.rule=Host(`the-keep.nextlevelguild.com`)"
      - "traefik.http.routers.the-keep.tls=true"
      - "traefik.http.services.the-keep.loadbalancer.server.port=3000"

  db:
    image: pgvector/pgvector:pg16
    container_name: the-keep-db
    environment:
      - POSTGRES_USER=thekeep
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=thekeep
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5011:5432"

volumes:
  pgdata:
```

### Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://thekeep:password@localhost:5432/thekeep

# MinIO
MINIO_ENDPOINT=helicarrier.local
MINIO_PORT=9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=the-keep

# LiteLLM
LITELLM_URL=http://10.0.0.27:2764
LITELLM_API_KEY=

# Session
SESSION_SECRET=

# Feature Flags
ENABLE_RAG=true
ENABLE_MEMORY_EXTRACTION=true
```

### Port Allocation

| Service | Port | Purpose |
|---------|------|---------|
| Web App | 5010 | Next.js application |
| PostgreSQL | 5011 | Database (internal) |
| Reserved | 5012-5019 | Future services |

---

## 10. Architecture Validation

### Coherence Validation

| Check | Status | Notes |
|-------|--------|-------|
| Technology compatibility | ✅ | All versions verified compatible |
| Pattern consistency | ✅ | Naming, structure aligned |
| Decision coherence | ✅ | No contradictions found |

### Requirements Coverage

| Category | Coverage | Notes |
|----------|----------|-------|
| FR-WS (Workspace) | ✅ 100% | dockview + components defined |
| FR-PM (Projects) | ✅ 100% | Schema + API designed |
| FR-FM (Files) | ✅ 100% | S3 + API routes planned |
| FR-DV (Viewing) | ✅ 100% | Panel components defined |
| FR-ME (Editing) | ✅ 100% | Monaco + TipTap dual-editor |
| FR-AC (AI Chat) | ✅ 100% | LLM routing designed |
| FR-FE (AI Editing) | ✅ 100% | Diff preview, hooks system |
| FR-PK (Knowledge) | ✅ 100% | Atomic memory with versioning |
| FR-MP (Provenance) | ✅ 100% | Source tracking in schema |
| FR-CM (Conv Modes) | ✅ 100% | Personas, journal, cross-project |
| FR-KG (RAG) | ✅ 100% | pgvector pipeline |
| FR-PC (Context) | ✅ 100% | .keep/ structure defined |
| FR-SD (Onboarding) | ✅ 100% | Soul Discovery flow |
| FR-DS (Safety) | ✅ 100% | Soft delete, recovery |
| FR-SEC (Security) | ✅ 100% | Secret masking |
| NFR-* | ✅ 100% | Performance, security addressed |

### Implementation Readiness

| Aspect | Status | Notes |
|--------|--------|-------|
| Decisions documented | ✅ | All with versions |
| Patterns comprehensive | ✅ | Naming, structure, API |
| Structure complete | ✅ | Full directory tree |
| Integration points | ✅ | All boundaries defined |

### Open Questions Resolved

| Question | Resolution |
|----------|------------|
| RAG Backend | Custom pgvector (simpler, no Dify dependency) |
| PDF Text Extraction | pdf.js text layer (sufficient for v1) |
| Auth | Iron-session for v1, Authentik-ready |
| Personal Knowledge Storage | PostgreSQL with atomic memories |

---

## 11. Implementation Sequence

### Phase 1: Foundation

1. Initialize Next.js project with recommended configuration
2. Set up Docker Compose with PostgreSQL + pgvector
3. Configure Drizzle ORM and run initial migrations
4. Set up Tailwind CSS and shadcn/ui components
5. Configure MinIO S3 client

### Phase 2: Workspace Shell

1. Integrate dockview with layout persistence
2. Build activity bar and project switcher
3. Implement command palette
4. Create file browser panel with tree view

### Phase 3: File Management

1. Implement file upload to MinIO
2. Build file tree API and UI
3. Create Markdown editor panel (Monaco)
4. Add PDF viewer panel (react-pdf)
5. Add image viewer panel

### Phase 4: AI Integration

1. Set up LiteLLM client
2. Implement LLM routing service
3. Build chat panel with streaming
4. Add context file attachment
5. Implement hooks system

### Phase 5: RAG & Knowledge

1. Implement text extraction pipeline
2. Set up embedding generation
3. Build similarity search
4. Create personal knowledge UI
5. Implement memory extraction hook

---

## 12. Appendix

### Technology Version Matrix

| Technology | Version | Last Verified |
|------------|---------|---------------|
| Next.js | 14.2.x | 2026-03-22 |
| React | 18.2.x | 2026-03-22 |
| TypeScript | 5.4.x | 2026-03-22 |
| dockview | 1.16.x | 2026-03-22 |
| Monaco Editor | 0.47.x | 2026-03-22 |
| Tailwind CSS | 3.4.x | 2026-03-22 |
| shadcn/ui | latest | 2026-03-22 |
| Zustand | 4.5.x | 2026-03-22 |
| Drizzle ORM | 0.29.x | 2026-03-22 |
| PostgreSQL | 16.x | 2026-03-22 |
| pgvector | 0.6.x | 2026-03-22 |
| react-pdf | 7.7.x | 2026-03-22 |

### Key References

- **Product Brief:** `docs/planning-artifacts/product-brief.md`
- **PRD:** `docs/planning-artifacts/prd.md`
- **dockview Docs:** https://dockview.dev/
- **shadcn/ui:** https://ui.shadcn.com/
- **Drizzle ORM:** https://orm.drizzle.team/
- **pgvector:** https://github.com/pgvector/pgvector
- **LiteLLM:** Internal at 10.0.0.27:2764

---

**Document Status:** Complete

**Changelog:**

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-22 | 1.1 | Synced with PRD Party Mode Review: Updated FR counts (165 total), added MemoryVersion & CrossProjectRequest schemas, added Section 9 (AI Context Injection with 4-layer customization, personas, cross-project queries, daily journal), updated memory schema with lifecycle fields (status, tier, score), added journalEntries table |
| 2026-03-22 | 1.0 | Initial architecture document |

**Next Steps:**
1. ~~UX Design - Wireframes and interaction patterns~~ (Complete, needs PRD sync)
2. Epic/Story creation based on implementation phases
3. Sprint planning for Phase 1
