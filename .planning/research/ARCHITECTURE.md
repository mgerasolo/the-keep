# Architecture Research

**Domain:** Personal knowledge management hub with AI assistant
**Researched:** 2026-03-18
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
                                 EXTERNAL AGENTS
                          ┌──────────────────────────┐
                          │  OpenClaw   Claude Code   │
                          │  n8n flows  Other agents  │
                          └────────┬─────────────────┘
                                   │ MCP / REST API
                                   │
┌──────────────────────────────────┴──────────────────────────────────┐
│                        THE KEEP APPLICATION                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WEB UI LAYER (Next.js)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │   │
│  │  │File Tree │  │BlockNote │  │  Command  │  │  Keeper   │  │   │
│  │  │Explorer  │  │ Editor   │  │  Palette  │  │  Chat UI  │  │   │
│  │  └──────────┘  └──────────┘  └───────────┘  └───────────┘  │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │ tRPC / Server Actions                  │
│  ┌─────────────────────────┴───────────────────────────────────┐   │
│  │                    API LAYER (Next.js API)                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │   │
│  │  │  File    │  │  Search  │  │  Inbox    │  │  Agent    │  │   │
│  │  │  CRUD    │  │  Query   │  │  Process  │  │  Gateway  │  │   │
│  │  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬─────┘  │   │
│  └───────┼──────────────┼──────────────┼──────────────┼────────┘   │
│          │              │              │              │             │
│  ┌───────┴──────────────┴──────────────┴──────────────┴────────┐   │
│  │                    SERVICE LAYER                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │   │
│  │  │  File    │  │  Entity  │  │  AI       │  │  Inbox    │  │   │
│  │  │  System  │  │  Graph   │  │  Pipeline │  │  Manager  │  │   │
│  │  │  Service │  │  Service │  │  Service  │  │  Service  │  │   │
│  │  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬─────┘  │   │
│  └───────┼──────────────┼──────────────┼──────────────┼────────┘   │
│          │              │              │              │             │
│  ┌───────┴──────────────┴──────────────┴──────────────┴────────┐   │
│  │                    DATA LAYER                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐                 │   │
│  │  │ Markdown │  │PostgreSQL│  │ LiteLLM   │                 │   │
│  │  │  Files   │  │+pgvector │  │  Proxy    │                 │   │
│  │  │ (disk)   │  │+graph ext│  │(external) │                 │   │
│  │  └──────────┘  └──────────┘  └───────────┘                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MCP SERVER (Sidecar)                      │   │
│  │  tools: search, read, write, query_entities, inbox_submit   │   │
│  │  resources: project_list, entity_graph, file_index           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    BACKGROUND WORKERS                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐                 │   │
│  │  │  File    │  │  Entity  │  │  Inbox    │                 │   │
│  │  │  Watcher │  │ Extractor│  │  Triager  │                 │   │
│  │  └──────────┘  └──────────┘  └───────────┘                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                          ┌────────┴────────┐
                          │   n8n Webhooks  │
                          │  (inbox feeds)  │
                          └─────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| File Tree Explorer | Navigate project hierarchy, open files | React tree component with virtual scrolling |
| BlockNote Editor | Rich editing of markdown documents | BlockNote.js, stores as JSON blocks, exports as markdown |
| Command Palette | Quick actions, navigation, search | cmdk library, keyboard-driven |
| Keeper Chat UI | Conversational AI interface for search/updates | Chat component with streaming responses |
| File CRUD API | Create, read, update, delete markdown files | Next.js API routes / tRPC procedures |
| Search/Query API | Full-text and semantic search across content | pgvector similarity + PostgreSQL FTS |
| Inbox Process API | Receive, triage, and route incoming items | Queue-based processing with AI classification |
| Agent Gateway API | External agent access (MCP + REST) | MCP server + REST endpoints |
| File System Service | Read/write markdown files, watch for changes | Node.js fs + chokidar watcher |
| Entity Graph Service | Extract, store, query entities and relationships | PostgreSQL with recursive CTEs or Apache AGE extension |
| AI Pipeline Service | LLM calls for extraction, summarization, chat | LiteLLM proxy client with structured outputs |
| Inbox Manager Service | Queue management, triage logic, routing | Job queue (BullMQ or pg-boss) |
| MCP Server | External agent interface following MCP protocol | TypeScript MCP SDK, Streamable HTTP transport |
| Background Workers | File watching, entity extraction, inbox triage | Event-driven processing, triggered by file changes or inbox arrivals |

## Recommended Project Structure

```
the-keep/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages
│       │   ├── (editor)/       # Editor layout group
│       │   │   ├── layout.tsx  # Sidebar + editor layout
│       │   │   └── [[...path]]/page.tsx  # File viewer/editor
│       │   ├── inbox/          # Inbox views
│       │   ├── graph/          # Entity graph explorer
│       │   ├── keeper/         # AI chat interface
│       │   └── api/            # API routes
│       │       ├── trpc/       # tRPC handler
│       │       ├── files/      # File operations REST
│       │       ├── inbox/      # Inbox webhook receivers
│       │       └── mcp/        # MCP endpoint (Streamable HTTP)
│       ├── components/         # React components
│       │   ├── editor/         # BlockNote editor wrapper
│       │   ├── explorer/       # File tree
│       │   ├── palette/        # Command palette
│       │   ├── chat/           # Keeper chat interface
│       │   └── layout/         # Shell, sidebar, tabs
│       └── lib/                # Client-side utilities
├── packages/
│   ├── core/                   # Business logic (framework-agnostic)
│   │   ├── files/              # File system operations
│   │   ├── entities/           # Entity extraction & graph
│   │   ├── inbox/              # Inbox processing logic
│   │   ├── ai/                 # LLM integration layer
│   │   └── search/             # Search indexing & querying
│   ├── db/                     # Database schema & migrations
│   │   ├── schema/             # Drizzle schema definitions
│   │   ├── migrations/         # SQL migrations
│   │   └── seed/               # Seed data
│   ├── mcp-server/             # MCP server implementation
│   │   ├── tools/              # MCP tool definitions
│   │   ├── resources/          # MCP resource definitions
│   │   └── server.ts           # MCP server entry point
│   └── shared/                 # Shared types & utilities
│       ├── types/              # TypeScript type definitions
│       ├── schemas/            # Zod validation schemas
│       └── constants/          # Shared constants
├── content/                    # Markdown file storage (git-tracked)
│   ├── _inbox/                 # Incoming items awaiting triage
│   ├── ai-research/            # Project: AI Research Profile
│   │   ├── _meta.yaml          # Project metadata & permissions
│   │   ├── tech-stack.md
│   │   └── ...
│   ├── health/                 # Project: Health & Lifestyle
│   │   ├── _meta.yaml
│   │   └── ...
│   ├── religious-studies/      # Project: Religious Studies
│   └── finance/                # Project: Finance & Data News
├── docker/                     # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # pnpm workspace config
└── package.json                # Root package.json
```

### Structure Rationale

- **apps/web/:** Single Next.js app handles both the web UI and API. No need for a separate backend server -- Next.js API routes and Server Actions handle all server-side logic. This keeps deployment simple (one container) while maintaining clear separation between UI and API code.

- **packages/core/:** Framework-agnostic business logic. The entity extraction, file operations, inbox processing, and AI pipeline code live here, importable by both the web app and the MCP server. This prevents coupling business logic to Next.js and enables the MCP server to share the same services.

- **packages/db/:** Database schema using Drizzle ORM. Centralized schema definitions used by both the web app and background workers. Drizzle over Prisma because Drizzle produces raw SQL, supports PostgreSQL features like pgvector natively, and has better edge/serverless compatibility.

- **packages/mcp-server/:** Standalone MCP server that external agents (OpenClaw, Claude Code, etc.) connect to. Runs as a sidecar process alongside the web app. Uses the same `core` package for business logic, ensuring agents and the web UI operate on identical data through identical logic.

- **content/:** Markdown files organized by project. This is the canonical content store -- human-readable, git-trackable. Each project directory has a `_meta.yaml` for project-level configuration. The `_inbox/` directory receives new items before triage.

## Architectural Patterns

### Pattern 1: Dual-Source-of-Truth with Sync

**What:** Markdown files on disk are the canonical content. PostgreSQL is the derived index. A file watcher keeps them in sync. Edits through the UI write to disk first, then PostgreSQL updates via the watcher (or synchronously for responsiveness). Edits through git (or direct file access) are picked up by the watcher and synced to PostgreSQL.

**When to use:** When you need both human-readable file storage and fast structured queries over the same content.

**Trade-offs:**
- PRO: Content is always accessible as plain files, git-friendly, can edit in any text editor
- PRO: PostgreSQL enables fast search, entity queries, and vector similarity without scanning files
- CON: Sync can lag or conflict if file and DB diverge
- CON: Need a reconciliation strategy for startup and crash recovery

**Example:**
```typescript
// File watcher detects change, triggers sync pipeline
const watcher = new FileWatcher(contentDir);

watcher.on('change', async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  const parsed = parseMarkdownWithFrontmatter(content);

  await db.transaction(async (tx) => {
    // Update document record
    await tx.upsert(documents, {
      path: filePath,
      title: parsed.frontmatter.title,
      content: parsed.body,
      contentHash: hash(content),
      updatedAt: new Date(),
    });

    // Update search index (full-text + vector)
    const embedding = await ai.embed(parsed.body);
    await tx.upsert(documentEmbeddings, {
      documentId: filePath,
      embedding: embedding,
      chunkText: parsed.body,
    });

    // Queue entity extraction (async, not blocking)
    await inboxQueue.add('extract-entities', { filePath });
  });
});
```

### Pattern 2: Entity Extraction Pipeline (Extract-on-Write)

**What:** When a document is created or modified, an AI pipeline extracts structured entities (people, technologies, concepts, dates) and their relationships. These populate a graph stored in PostgreSQL using either Apache AGE (graph extension) or a simple adjacency table pattern. Extraction runs asynchronously via a job queue so it does not block the editor.

**When to use:** When you need semantic understanding of unstructured content without requiring users to manually tag or structure data.

**Trade-offs:**
- PRO: Automatic knowledge graph construction -- users just write markdown
- PRO: Enables powerful cross-document queries ("What technologies does Project X use?")
- CON: LLM extraction costs (tokens) on every document change
- CON: Extraction quality varies; needs human review mechanism

**Example:**
```typescript
// Entity extraction job handler
async function extractEntities(filePath: string) {
  const content = await fileService.read(filePath);

  const extracted = await ai.structuredOutput({
    model: 'gpt-4o-mini',  // Cost-effective for extraction
    schema: entityExtractionSchema,
    prompt: `Extract entities and relationships from this document.
             Categories: person, technology, concept, project, date, location.
             Return structured JSON with entities and relationships.`,
    content: content,
  });

  // Upsert entities
  for (const entity of extracted.entities) {
    await db.upsert(entities, {
      name: entity.name,
      type: entity.type,
      projectId: getProjectFromPath(filePath),
    });
  }

  // Upsert relationships
  for (const rel of extracted.relationships) {
    await db.upsert(entityRelationships, {
      sourceEntity: rel.source,
      targetEntity: rel.target,
      relationship: rel.type,  // "uses", "authored_by", "related_to"
      sourceDocument: filePath,
    });
  }
}
```

### Pattern 3: AI Gateway Pattern (LiteLLM Abstraction)

**What:** All LLM calls go through an AI service layer that talks to the existing LiteLLM proxy. The service layer defines "intents" (extract entities, summarize, chat, triage) and maps them to appropriate models. Cheap tasks (extraction, classification) use small models (gpt-4o-mini, local Ollama). Expensive tasks (long-form chat, creative writing) use capable models (Claude, GPT-4o). The application never calls LLM providers directly.

**When to use:** When you have multiple AI tasks with different quality/cost requirements and want centralized control over model selection.

**Trade-offs:**
- PRO: Switch models per task without code changes
- PRO: Cost control -- expensive models only where needed
- PRO: LiteLLM already deployed; reuse existing infrastructure
- CON: Extra network hop (app -> LiteLLM -> provider)
- CON: Need to manage model mapping configuration

**Example:**
```typescript
// AI service with intent-based model routing
const AI_MODEL_MAP = {
  'entity-extraction': 'gpt-4o-mini',    // Fast, cheap, good at structured output
  'inbox-triage':      'gpt-4o-mini',    // Classification task
  'document-summary':  'gpt-4o-mini',    // Summarization
  'keeper-chat':       'claude-sonnet',   // Conversational quality matters
  'embedding':         'text-embedding-3-small',
} as const;

class AIService {
  private client: OpenAI; // OpenAI-compatible client pointing to LiteLLM

  constructor() {
    this.client = new OpenAI({
      baseURL: 'http://10.0.0.27:2764/v1',
      apiKey: process.env.LITELLM_API_KEY,
    });
  }

  async call(intent: keyof typeof AI_MODEL_MAP, messages: Message[]) {
    return this.client.chat.completions.create({
      model: AI_MODEL_MAP[intent],
      messages,
    });
  }
}
```

### Pattern 4: Inbox as Event Bus

**What:** The inbox is a queue-based system where items arrive from external sources (n8n webhooks, API calls, email forwarding, manual entry) and go through a triage pipeline: classify -> prioritize -> suggest action -> await human approval or auto-apply. Items in the inbox are represented as files in `content/_inbox/` with YAML frontmatter tracking their processing state.

**When to use:** When multiple data sources feed into the system and you need structured processing with human oversight.

**Trade-offs:**
- PRO: Decouples data ingestion from processing
- PRO: Human always has oversight; nothing auto-applies without rules
- PRO: n8n already deployed and handles the "gather from sources" work
- CON: Needs UI for inbox management and triage review

**Example:**
```typescript
// Inbox item structure (stored as markdown in _inbox/)
interface InboxItem {
  id: string;
  source: 'n8n' | 'api' | 'manual' | 'email';
  status: 'pending' | 'triaged' | 'applied' | 'dismissed';
  priority: 'high' | 'medium' | 'low';
  suggestedProject: string;      // AI-suggested target project
  suggestedAction: 'create' | 'update' | 'reference';
  suggestedPath: string;         // Where to file this
  content: string;               // The actual content
  aiSummary: string;             // AI-generated summary
  receivedAt: Date;
  triagedAt?: Date;
}

// n8n sends items via webhook
// POST /api/inbox/webhook
async function handleInboxWebhook(req: Request) {
  const item = createInboxItem(req.body);

  // Write to _inbox/ as markdown file
  await fileService.write(
    `content/_inbox/${item.id}.md`,
    serializeInboxItem(item)
  );

  // Queue AI triage (async)
  await jobQueue.add('triage-inbox', { itemId: item.id });
}
```

## Data Flow

### Core Data Flows

```
1. DOCUMENT EDITING FLOW
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  User    │────>│BlockNote │────>│  File    │────>│  File    │
   │  edits   │     │ Editor   │     │  System  │     │  on Disk │
   └──────────┘     └──────────┘     │ Service  │     └────┬─────┘
                                     └──────────┘          │
                                                           │ (watcher)
                                                           v
                                     ┌──────────┐     ┌──────────┐
                                     │ Entity   │<────│PostgreSQL│
                                     │ Extract  │     │  Index   │
                                     │ (async)  │     └──────────┘
                                     └──────────┘

2. SEARCH FLOW
   ┌──────────┐     ┌──────────┐     ┌──────────────────┐     ┌──────────┐
   │  User    │────>│ Search   │────>│ PostgreSQL FTS   │────>│ Results  │
   │  query   │     │ Service  │     │ + pgvector       │     │ ranked   │
   └──────────┘     └──────────┘     │ similarity       │     └──────────┘
                                     └──────────────────┘

3. KEEPER CHAT FLOW
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  User    │────>│ Keeper   │────>│ RAG      │────>│ LiteLLM  │
   │ message  │     │ Chat     │     │ Pipeline │     │ (LLM)    │
   └──────────┘     └──────────┘     │          │     └────┬─────┘
                                     │ 1. embed │          │
                                     │ 2. search│          │
                                     │ 3. build │          │
                                     │   context│          │
                                     └──────────┘          │
                                          ^                │
                                          │                v
                                     ┌──────────┐     ┌──────────┐
                                     │PostgreSQL│     │ Streamed │
                                     │ vectors  │     │ Response │
                                     └──────────┘     └──────────┘

4. INBOX FLOW
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ n8n      │────>│ Webhook  │────>│ _inbox/  │────>│ Triage   │
   │ workflow │     │ receiver │     │ as file  │     │ Worker   │
   └──────────┘     └──────────┘     └──────────┘     │ (AI)     │
                                                       └────┬─────┘
                                                            │
                                                            v
                                          ┌─────────────────────────┐
                                          │ Inbox UI: review,       │
                                          │ approve, dismiss, file  │
                                          └─────────────────────────┘

5. EXTERNAL AGENT FLOW
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ OpenClaw │────>│ MCP      │────>│ Core     │────>│ File +   │
   │ or Agent │     │ Server   │     │ Services │     │ Database │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
       ^                                                    │
       │              ┌──────────┐                          │
       └──────────────│ Response │<─────────────────────────┘
                      └──────────┘
```

### Key Data Flows

1. **Document Editing Flow:** User edits in BlockNote -> JSON blocks -> markdown export -> write to disk -> file watcher triggers -> PostgreSQL index update + entity extraction queue. Editor saves to disk first (ensuring the file is always the authority), then derived stores update asynchronously.

2. **Search Flow:** Query goes to PostgreSQL which combines full-text search (tsvector) with vector similarity (pgvector). Results ranked by a weighted combination of keyword match and semantic similarity. Entity graph can augment results ("show me documents about technologies used by Project X").

3. **Keeper Chat Flow:** User message -> embed query -> pgvector similarity search to find relevant document chunks -> build context window with retrieved chunks -> send to LLM via LiteLLM -> stream response back. This is standard RAG with the twist that Keeper can also write back to files (90% AI-managed vision).

4. **Inbox Flow:** External sources push items via n8n webhooks -> items written as markdown in `_inbox/` -> AI triage worker classifies, prioritizes, suggests destination -> human reviews in Inbox UI -> approved items get filed to appropriate project directory.

5. **External Agent Flow:** Agent connects via MCP (Streamable HTTP) -> calls tools like `search_documents`, `read_file`, `write_file`, `query_entities` -> tools invoke core services -> results returned. REST API available as fallback for agents that do not support MCP.

## Multi-Project Architecture

### Single Instance, Project Isolation via Directory Convention

Use a single Keep deployment with project isolation through directory structure and metadata, not separate instances or databases.

```
content/
├── _inbox/                    # Global inbox (items land here first)
├── _shared/                   # Cross-project reference docs
├── ai-research/               # Project boundary
│   ├── _meta.yaml             # Project config + permissions
│   ├── tech-stack/
│   ├── projects/
│   └── interests/
├── health/                    # Project boundary
│   ├── _meta.yaml
│   ├── medications/
│   ├── bloodwork/
│   └── nutrition/
└── finance/                   # Project boundary
    ├── _meta.yaml
    ├── sources/
    └── research/
```

**_meta.yaml per project:**
```yaml
name: "Health & Lifestyle"
icon: "heart"
visibility: "private"        # Controls API access scope
allowCrossReference: true     # Can other projects link to docs here?
agentAccess:
  read: ["openclaw", "keeper"]
  write: ["keeper"]
defaultTags: ["health"]
```

**Why this over multi-tenant:**
- Single-user system -- complexity of true multi-tenancy is waste
- Cross-referencing is a first-class need ("my AI research uses these health APIs")
- All content in one git repo, one backup, one deployment
- Project boundaries are enforced in the service layer, not the infrastructure layer

**Permission enforcement at the service layer:**
```typescript
class FileService {
  async read(path: string, agentId?: string): Promise<string> {
    const project = getProjectFromPath(path);
    const meta = await this.getProjectMeta(project);

    if (agentId && !meta.agentAccess.read.includes(agentId)) {
      throw new AccessDeniedError(`Agent ${agentId} cannot read from ${project}`);
    }

    return fs.readFile(path, 'utf-8');
  }
}
```

## Database Schema Approach

### PostgreSQL as the Universal Index

Use PostgreSQL with pgvector for everything: document index, entity graph, embeddings, inbox queue, and search. Do not introduce a separate graph database -- PostgreSQL handles this workload well for a single-user system with a recursive CTE or the Apache AGE extension.

**Core tables:**
```
documents
├── id (uuid)
├── path (text, unique)           -- Relative path within content/
├── project (text)                -- Derived from path
├── title (text)
├── content_hash (text)           -- For change detection
├── frontmatter (jsonb)           -- Parsed YAML frontmatter
├── created_at, updated_at

document_chunks
├── id (uuid)
├── document_id (fk -> documents)
├── chunk_index (int)
├── chunk_text (text)
├── embedding (vector(1536))      -- pgvector

entities
├── id (uuid)
├── name (text)
├── type (text)                   -- person, technology, concept, project
├── properties (jsonb)
├── source_documents (text[])     -- Which docs mention this entity

entity_relationships
├── id (uuid)
├── source_entity_id (fk -> entities)
├── target_entity_id (fk -> entities)
├── relationship_type (text)      -- "uses", "authored_by", "treats"
├── source_document (text)
├── confidence (float)

inbox_items
├── id (uuid)
├── source (text)
├── status (text)
├── priority (text)
├── content (text)
├── ai_summary (text)
├── suggested_project (text)
├── suggested_action (text)
├── created_at, triaged_at, resolved_at
```

**Why PostgreSQL over SurrealDB or Neo4j:**
- Already available in infrastructure (bundled per-service)
- pgvector is production-proven and avoids a separate vector DB
- Adjacency list + recursive CTEs handle graph queries at this scale
- Single database means single backup, single connection pool, simple ops
- Apache AGE extension available if graph queries grow complex later
- SurrealDB is interesting but adds operational overhead for marginal benefit at single-user scale

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single user (target) | Monolith Next.js app + PostgreSQL + MCP sidecar. Everything in one Docker Compose stack. This is the right architecture for v1 and likely v2. |
| 5-10 agents querying concurrently | Connection pooling on PostgreSQL, rate limiting on MCP/API endpoints. No architecture changes needed. |
| 10K+ documents | Chunking strategy becomes important for embeddings. Incremental re-indexing instead of full rebuild. Consider partitioning document_chunks by project. |
| Complex graph queries | Evaluate Apache AGE extension or migrate graph data to dedicated Neo4j. This is unlikely at personal scale. |

### Scaling Priorities

1. **First bottleneck: Embedding generation speed.** Entity extraction and embedding on every document change will be slow if done synchronously. Use a job queue (pg-boss runs inside PostgreSQL, no Redis needed) to process async. Debounce rapid edits (500ms) before triggering extraction.

2. **Second bottleneck: Search quality.** As document count grows, naive vector similarity returns too many irrelevant results. Implement hybrid search (keyword FTS + vector similarity with weighted scoring) and project-scoped filtering.

## Anti-Patterns

### Anti-Pattern 1: Separate Graph Database for Entity Storage

**What people do:** Deploy Neo4j or SurrealDB alongside PostgreSQL specifically for the entity graph.
**Why it's wrong:** For a single-user personal knowledge base, this adds operational complexity (two databases to backup, monitor, and version) for minimal benefit. PostgreSQL adjacency tables with recursive CTEs handle thousands of entities and relationships efficiently. You are not building a social network.
**Do this instead:** Store entities and relationships in PostgreSQL tables. Use recursive CTEs for graph traversals. Only consider a dedicated graph DB if query patterns genuinely demand it after v1.

### Anti-Pattern 2: Real-Time Sync Between Files and Database

**What people do:** Try to keep the database perfectly synchronized with file changes in real-time, with two-way sync (DB writes also update files).
**Why it's wrong:** Bidirectional sync creates race conditions, conflict resolution nightmares, and "which is the truth?" ambiguity. Real-time sync also wastes resources on intermediate saves.
**Do this instead:** Files are always the authority. Database is a derived, eventually-consistent index. Writes go to files first. A debounced watcher updates the DB. On startup, a reconciliation pass ensures consistency. One-directional data flow only.

### Anti-Pattern 3: Building a Plugin System

**What people do:** Design an extensible plugin architecture for the editor, new content types, custom views.
**Why it's wrong:** This is explicitly what killed the Obsidian experience for the user. Plugin ecosystems create over-engineering traps, configuration sprawl, and "which plugin broke my workflow?" debugging sessions.
**Do this instead:** Build opinionated features directly into the application. If you need new functionality, add it to the codebase. The app serves one user -- it does not need to be extensible for a community.

### Anti-Pattern 4: Using BlockNote's JSON as the Storage Format

**What people do:** Store BlockNote's native JSON block format as the canonical document representation in the database or on disk.
**Why it's wrong:** BlockNote JSON is an editor-internal format. Storing it means documents are only readable through BlockNote. It violates the "human-readable, git-friendly" constraint. It also locks you into BlockNote's schema evolution.
**Do this instead:** Store markdown on disk (the canonical format). Convert to BlockNote JSON on load, convert back to markdown on save. The conversion is lossy for some exotic block types, but standard markdown (headings, lists, links, code, tables) round-trips cleanly. Accept the lossiness -- it is a feature, not a bug, because it keeps content portable.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| LiteLLM (10.0.0.27:2764) | OpenAI-compatible HTTP client | All LLM calls route through LiteLLM. Configure model routing in Keep's config, not in LiteLLM. |
| n8n (10.0.0.27:2750) | Webhook receiver | n8n workflows push inbox items to The Keep's webhook endpoint. Keep does not poll n8n. |
| Authentik (auth.nextlevelfoundry.com) | OAuth2/OIDC for web UI login | Protects the web UI. Agent API uses API keys, not OAuth. |
| MinIO (Helicarrier) | S3-compatible file uploads | For binary attachments (images, PDFs) that should not be stored as markdown. Reference in markdown via URL. |
| Traefik | Reverse proxy, TLS termination | Routes the-keep.nextlevelguild.com to the container. |
| PostgreSQL | Bundled in Docker Compose | Dedicated instance per service -- do not share with other apps. |
| Loki + Grafana (Coulson) | Structured logging | Application logs ship to Loki for monitoring. Use pino logger with JSON output. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Web UI <-> API Layer | tRPC (type-safe RPC) | Avoid REST for internal app calls. tRPC gives end-to-end type safety. |
| API Layer <-> Core Services | Direct function calls | Same process, no network boundary. Core is just TypeScript modules. |
| Core Services <-> File System | Node.js `fs` module | Direct file I/O. Content directory mounted as a Docker volume. |
| Core Services <-> PostgreSQL | Drizzle ORM | Type-safe queries, raw SQL escape hatch when needed. |
| MCP Server <-> Core Services | Direct function imports | MCP server is a separate process but imports from `packages/core`. |
| n8n <-> Keep | HTTP webhook | One-way: n8n pushes to Keep. Keep never calls n8n. |
| External Agents <-> Keep | MCP (Streamable HTTP) + REST fallback | MCP is preferred. REST for agents that cannot speak MCP. |

## Build Order (Dependencies)

The following build order respects component dependencies. Each phase builds on the previous.

```
Phase 1: Foundation
├── Content directory structure + _meta.yaml schema
├── PostgreSQL schema + Drizzle setup
├── File System Service (read/write/list/watch)
├── Basic Next.js shell (sidebar, file tree, tabs)
└── Markdown viewer (read-only first)
    Dependencies: None. This is the base.

Phase 2: Editor + Search
├── BlockNote editor integration (markdown <-> blocks)
├── Full-text search (PostgreSQL tsvector)
├── Command palette
└── File CRUD through UI
    Dependencies: Phase 1 (file system, database, shell)

Phase 3: AI Layer
├── AI Service (LiteLLM integration)
├── Embedding generation pipeline
├── Vector search (pgvector)
├── Entity extraction pipeline
├── Entity graph storage + basic queries
└── Background job queue (pg-boss)
    Dependencies: Phase 2 (documents in DB, search foundation)

Phase 4: Keeper + Inbox
├── Keeper chat interface (RAG pipeline)
├── Inbox webhook receiver
├── Inbox triage pipeline (AI classification)
├── Inbox management UI
└── n8n workflow integration
    Dependencies: Phase 3 (AI service, embeddings, entity graph)

Phase 5: Agent API
├── MCP server implementation
├── REST API endpoints
├── Agent authentication (API keys)
├── Rate limiting
└── Documentation
    Dependencies: Phase 4 (all core services operational)
```

**Phase ordering rationale:**
- Phase 1 is pure infrastructure -- nothing works without files and database
- Phase 2 makes the app usable by a human -- can browse, edit, search
- Phase 3 adds AI capabilities that Phase 4 depends on (you cannot do RAG chat or AI triage without embeddings and entity extraction)
- Phase 4 is where the "AI assistant" vision comes alive -- but it requires the AI foundation
- Phase 5 exposes everything to external agents -- must be last because it needs all services to be stable before exposing them externally

## Sources

- [BlockNote.js - Block-based React editor](https://www.blocknotejs.org/)
- [BlockNote Markdown conversion](https://www.blocknotejs.org/docs/features/export/markdown)
- [Chokidar - File system watcher](https://github.com/paulmillr/chokidar)
- [pgvector vs dedicated vector databases (Encore)](https://encore.dev/blog/you-probably-dont-need-a-vector-database)
- [PostgreSQL as Vector Database (2025)](https://dbadataverse.com/poetry/2025/12/postgresql-beat-vector-databases-dba-perspective)
- [LiteLLM Proxy documentation](https://docs.litellm.ai/docs/simple_proxy)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification (Nov 2025)](https://modelcontextprotocol.io/specification/2025-11-25)
- [SurrealDB features & JavaScript SDK](https://surrealdb.com/features)
- [Neo4j LLM Knowledge Graph Builder](https://neo4j.com/blog/developer/llm-knowledge-graph-builder-release/)
- [Flexible GraphRAG architecture](https://github.com/stevereiner/flexible-graphrag)
- [n8n webhook integration](https://n8n.io/integrations/webhook/)
- [RAG architecture (AWS)](https://aws.amazon.com/what-is/retrieval-augmented-generation/)
- [Turborepo + pnpm monorepo pattern](https://medium.com/@mernstackdevbykevin/full-stack-react-in-2025-combining-next-js-c96bd2d74c9c)
- [Event-driven AI triage (Knative)](https://knative.dev/blog/articles/knative-eventing-eda-agents/)
- [Building intelligent email triage with n8n](https://quellant.com/blog/intelligent-email-triage-n8n-workflow/)

---
*Architecture research for: The Keep - Personal Knowledge Management Hub with AI Assistant*
*Researched: 2026-03-18*
