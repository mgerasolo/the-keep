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

**Version:** 1.0
**Date:** 2026-03-22
**Status:** Complete

---

## 1. Executive Summary

The Keep is a web-based personal knowledge management IDE built with Next.js 14+, featuring VS Code-style dockable panels (dockview), AI-powered chat with smart LLM routing, and a personal knowledge system with atomic memories. This architecture document provides the technical blueprint for consistent AI agent implementation.

### Architecture Highlights

| Aspect | Decision |
|--------|----------|
| **Frontend** | Next.js 14+ App Router, dockview panels, Monaco Editor |
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
| Markdown Editing (FR-ME) | 7 | Medium |
| AI Chat (FR-AC) | 10 | High - LLM routing |
| Personal Knowledge (FR-PK) | 9 | High - memory system |
| Knowledge Graph/RAG (FR-KG) | 5 | High - pgvector |
| Embedded Views (FR-EV) | 3 | Low |

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
- **Estimated Components:** 45-50 React components
- **Database Tables:** 8-10 core tables
- **API Endpoints:** 20-25 routes

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

| Component | Library | Version |
|-----------|---------|---------|
| Code/Markdown Editor | Monaco Editor | 0.47+ |
| Markdown Preview | react-markdown + remark-gfm | 9.0+ |
| PDF Viewer | react-pdf | 7.7+ |
| Image Viewer | Custom (native img + zoom) | - |

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

**Memory Schema:**

```typescript
interface Memory {
  id: string;
  projectId: string;
  category: 'preference' | 'fact' | 'inventory' | 'profile';
  key: string;           // e.g., "weight", "likes_spicy_food"
  value: string;         // e.g., "180", "true"
  confidence: number;    // 0-1, for AI-extracted memories
  source: 'manual' | 'extracted' | 'imported';
  sourceConversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

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
  category: varchar('category', { length: 50 }).notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  value: text('value').notNull(),
  confidence: real('confidence').default(1.0),
  source: varchar('source', { length: 20 }).notNull(), // 'manual' | 'extracted' | 'imported'
  sourceConversationId: uuid('source_conversation_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectKeyIdx: uniqueIndex('project_key_idx').on(table.projectId, table.key),
}));

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
│   │   │   │   ├── editor-panel.tsx
│   │   │   │   ├── monaco-editor.tsx
│   │   │   │   ├── markdown-preview.tsx
│   │   │   │   └── editor-toolbar.tsx
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

## 9. Infrastructure & Deployment

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
| FR-ME (Editing) | ✅ 100% | Monaco + toolbar planned |
| FR-AC (AI Chat) | ✅ 100% | LLM routing designed |
| FR-PK (Knowledge) | ✅ 100% | Atomic memory system |
| FR-KG (RAG) | ✅ 100% | pgvector pipeline |
| FR-EV (Embedded) | ✅ 100% | iframe component |
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

**Next Steps:**
1. UX Design - Wireframes and interaction patterns
2. Epic/Story creation based on implementation phases
3. Sprint planning for Phase 1
