# Stack Research

**Domain:** Personal Knowledge Operating System (AI-first knowledge management with graph database, conversational AI, and Cursor-like web IDE)
**Researched:** 2026-03-18
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js (App Router) | 16.1.x | Full-stack framework | Dominant React framework in 2026. App Router provides Server Components for file system access, Server Actions for mutations, and API routes for the agent API. Turbopack stable by default. React 19 support. Self-hostable in Docker on Banner/Hulk. |
| TipTap | 3.20.x | Rich text editor (markdown-backed) | Headless, open-source (MIT core), with official bidirectional markdown extension (@tiptap/markdown). Unlike BlockNote (lossy markdown export), TipTap provides lossless markdown round-tripping via `editor.getMarkdown()` and `contentType: 'markdown'`. The headless architecture means full control over UI styling to match the Cursor aesthetic. |
| PostgreSQL + Apache AGE + pgvector | PG 16 + AGE 1.5.x + pgvector 0.8.x | Relational + Graph + Vector database | Single database engine handles all three data models. Apache AGE adds openCypher graph queries as a PostgreSQL extension (entity graph). pgvector adds vector similarity search (semantic search, RAG). Avoids running Neo4j as a separate service. Already available in the infrastructure. |
| Vercel AI SDK | 6.0.x | LLM integration, streaming chat, tool calling | The standard TypeScript toolkit for AI-powered apps. Unified API across providers (OpenAI, Anthropic, Google). Built-in streaming UI primitives, ToolLoopAgent for agentic workflows, human-in-the-loop approval. Framework-agnostic but first-class Next.js integration. |
| LiteLLM (existing) | Already deployed | LLM gateway/proxy | Already running at 10.0.0.27:2764. Provides OpenAI-compatible endpoint across 100+ providers. The Keep connects to LiteLLM, which routes to OpenAI, Anthropic, Ollama, or local models. No need to implement provider switching -- LiteLLM handles it. |
| Drizzle ORM | 0.45.x | Type-safe database access | Lightweight (~7.4kb), zero dependencies, SQL-like syntax. Native PostgreSQL support. Type-safe schema definitions that serve as documentation. Better DX than Prisma for raw SQL needs (Apache AGE Cypher queries via `sql` template tag). |

### UI Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| shadcn/ui | CLI v4 (March 2026) | Component library | Not a dependency -- copies components into your codebase. Full control over styling. Unified radix-ui package. Built-in AI agent skills for Claude Code integration. Includes command palette (cmdk-based), dialog, tabs, sidebar, and all primitives needed for a Cursor-like UI. |
| Tailwind CSS | 4.x | Utility-first styling | Standard pairing with shadcn/ui. Zero-runtime. Handles the dark theme Cursor-like aesthetic well. |
| cmdk | 1.1.x | Command palette | The command palette primitive used by shadcn/ui's Command component. Unstyled, accessible, composable. Powers the Ctrl+K experience. |
| react-arborist | 3.4.x | File tree component | Purpose-built tree view for React with virtualization, drag-and-drop, inline renaming, keyboard navigation. Handles thousands of nodes. Matches VS Code's sidebar UX. |

### State Management & Data Fetching

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Zustand | 5.0.x | Client-side state management | ~3kb, minimal boilerplate. Module-first (good for editor state, UI panels, sidebar state). Better than Jotai for this use case because editor/file state is centralized, not atomic. |
| TanStack Query | 5.90.x | Server state & data fetching | Caching, background refetching, optimistic updates for file operations. Pairs with Next.js Server Actions. Manages the file tree, inbox items, entity data without manual cache invalidation. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| unified/remark/rehype | Latest | Markdown processing pipeline | Server-side markdown parsing, transformation, and rendering. Entity extraction pre-processing. Convert markdown AST for analysis. |
| gray-matter | 4.x | Frontmatter parsing | Extract YAML frontmatter from markdown files for metadata (tags, domains, dates, entity hints). |
| chokidar | 4.x | File system watcher | Watch markdown directory for external changes (git pull, other agents writing files). Trigger re-indexing on file changes. |
| zod | 3.x | Schema validation | Validate API inputs, form data, LLM structured outputs. Pairs with Drizzle for type-safe schemas. |
| next-auth (Auth.js) | 5.x | Authentication | Authentik integration via OAuth/OIDC. Single-user but still needs auth to protect the API from unauthorized agent access. |
| date-fns | 4.x | Date manipulation | Inbox timestamps, file modification dates, workflow scheduling. Tree-shakeable unlike moment.js. |
| nanoid | 5.x | ID generation | Short, URL-friendly unique IDs for entities, inbox items, workflow instances. |
| lucide-react | Latest | Icons | Icon set used by shadcn/ui. Consistent with the Cursor-like aesthetic. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | 5.x | Type safety across the entire stack |
| drizzle-kit | Database migrations | `npx drizzle-kit push` for dev, `npx drizzle-kit migrate` for prod |
| Turbopack | Bundler (built into Next.js 16) | Stable in Next.js 16, no config needed |
| Vitest | Unit/integration testing | Fast, Vite-compatible, good for testing Server Actions and utilities |
| Playwright | E2E testing | Browser automation for testing the editor, file tree, command palette |
| Docker + docker-compose | Containerization | Deploy to Banner (dev) / Hulk (prod) with volume mounts for markdown storage |
| ESLint + Prettier | Code quality | Standard Next.js config with Tailwind plugin |

## Architecture Decisions Embedded in Stack

### Why TipTap Over BlockNote

BlockNote was explicitly requested in PROJECT.md, but TipTap is the better choice because:

1. **Markdown fidelity**: BlockNote's `blocksToMarkdownLossy()` is literally named "lossy" -- it drops information. TipTap's @tiptap/markdown extension provides lossless bidirectional conversion. For a knowledge system backed by markdown files, lossless round-tripping is non-negotiable.

2. **Extensibility depth**: BlockNote is an abstraction on top of TipTap, which is an abstraction on top of ProseMirror. Two layers of abstraction limit deep customization. TipTap gives direct ProseMirror access when needed while still providing clean APIs.

3. **Streaming AI content**: TipTap handles streaming markdown from LLMs into the editor. BlockNote has no documented streaming support.

4. **Framework maturity**: TipTap 3.x has 33k+ GitHub stars, active releases (3.20.4 published March 2026), commercial backing via Tiptap GmbH, and the markdown extension is now MIT-licensed.

5. **Slash menu**: TipTap supports slash commands via extensions, matching the BlockNote UX the user wants while keeping the markdown backend clean.

**BlockNote is still excellent for Notion-clone apps.** For a markdown-first knowledge system, TipTap wins.

### Why PostgreSQL + Extensions Over Separate Graph DB

Running Neo4j alongside PostgreSQL means two databases to maintain, back up, and connect. Apache AGE brings openCypher queries directly into PostgreSQL:

```sql
-- Entity extraction stored as graph
SELECT * FROM cypher('keep_graph', $$
  MATCH (p:Person)-[:WORKS_ON]->(proj:Project)
  WHERE proj.name = 'The Keep'
  RETURN p.name, proj.name
$$) AS (person_name agtype, project_name agtype);
```

Combined with pgvector for semantic search:

```sql
-- Find semantically similar documents
SELECT file_path, 1 - (embedding <=> $1) AS similarity
FROM document_embeddings
ORDER BY embedding <=> $1
LIMIT 10;
```

All in one PostgreSQL instance. One backup strategy. One connection pool. One transaction boundary.

### Why LiteLLM + AI SDK (Not Direct Provider APIs)

The architecture is layered:

```
TipTap Editor / Chat UI
    |
AI SDK (streaming, tool calling, structured output)
    |
LiteLLM Proxy (provider routing, cost tracking, load balancing)
    |
OpenAI / Anthropic / Ollama / Local Models
```

- **AI SDK** handles the TypeScript/React integration: streaming tokens to the UI, managing conversation state, executing tool calls (search docs, create entities, update files).
- **LiteLLM** handles the infrastructure: routing to the right model, API key management, cost tracking, fallback providers.

This separation means changing from GPT-4o to Claude to a local Llama model requires zero code changes -- just LiteLLM config.

### Why Next.js Server Components for File Access

The markdown backend requires server-side file system access. Next.js provides three mechanisms:

1. **Server Components**: Read files directly with `fs.readFile()` for rendering file tree, document content.
2. **Server Actions**: Write files with `fs.writeFile()` for save operations, triggered from the editor.
3. **Route Handlers (API routes)**: RESTful endpoints for agent API access (other AI agents querying/updating The Keep).

Docker volume mounts persist the markdown directory:
```yaml
volumes:
  - /data/the-keep/vault:/app/vault  # Markdown files
  - /data/the-keep/vault/.git:/app/vault/.git  # Git history
```

## Installation

```bash
# Core framework
npm install next@latest react@latest react-dom@latest

# Editor
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/markdown

# Database
npm install drizzle-orm postgres
npm install -D drizzle-kit

# AI
npm install ai @ai-sdk/openai

# UI
npx shadcn@latest init
npx shadcn@latest add command dialog tabs sidebar sheet input textarea badge

# State management
npm install zustand @tanstack/react-query

# File tree
npm install react-arborist

# Utilities
npm install zod gray-matter nanoid date-fns chokidar
npm install unified remark-parse remark-stringify rehype-parse rehype-stringify

# Auth
npm install next-auth

# Dev dependencies
npm install -D typescript @types/node @types/react vitest playwright eslint prettier
npm install -D tailwindcss @tailwindcss/typography
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| TipTap 3.x | BlockNote 0.47.x | If you want a Notion-clone UI out of the box and markdown fidelity doesn't matter. BlockNote is faster to prototype with but has lossy markdown conversion. |
| TipTap 3.x | Milkdown | If you want a purely markdown-native editor with no rich-text abstraction layer. Milkdown is closer to "markdown-first" but has bare-bones React integration and smaller community. |
| PostgreSQL + AGE | Neo4j + PostgreSQL | If graph queries become extremely complex (multi-hop traversals across millions of nodes) and you need Neo4j's advanced algorithms (PageRank, community detection). For a personal knowledge base, AGE is sufficient. |
| PostgreSQL + pgvector | Dedicated vector DB (Milvus, Qdrant) | If you exceed 10M+ vectors and need specialized indexing. For a personal knowledge base with thousands of documents, pgvector handles it easily. |
| Next.js 16 | SvelteKit | If you want 50-70% smaller JS bundles and better runtime performance. But the React ecosystem (TipTap, shadcn/ui, react-arborist, AI SDK) is vastly larger. Switching to Svelte means rebuilding all UI components. |
| Zustand | Jotai | If state is highly atomic and independent (like a spreadsheet). For centralized editor/file/panel state, Zustand's single-store model is cleaner. |
| Drizzle ORM | Prisma | If you want auto-generated migrations and a visual studio. But Prisma doesn't support raw SQL passthrough well (needed for Apache AGE Cypher queries). Drizzle's `sql` template tag handles this naturally. |
| AI SDK 6.x | LangChain.js | If you need complex multi-agent orchestration with memory and retrieval chains. But AI SDK is lighter, more TypeScript-native, and has better streaming UI integration with Next.js. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Obsidian plugins / Obsidian API | Explicitly out of scope. Over-engineering trap. Not web-deployable. | TipTap in a web app |
| Monaco Editor (for content editing) | Monaco is a code editor, not a rich text editor. No markdown WYSIWYG, no block-based editing. Users would see raw markdown, not rendered content. | TipTap for content editing. Monaco only if you add a "raw markdown" view toggle. |
| Separate Neo4j instance | Adds operational complexity (second database, second backup, second Docker service) for a personal knowledge base that won't have millions of nodes. | PostgreSQL + Apache AGE extension |
| Prisma ORM | Cannot execute raw SQL strings for Apache AGE Cypher queries. Prisma's abstraction layer gets in the way. Also heavier than Drizzle. | Drizzle ORM |
| Redux / Redux Toolkit | Massive boilerplate for a single-user app. Actions, reducers, middleware are overkill. | Zustand |
| Firebase / Supabase | Cloud-hosted. The Keep must be self-hosted on personal infrastructure. These services add external dependencies and recurring costs. | PostgreSQL self-hosted |
| Electron / Tauri | Desktop app frameworks. The Keep is web-first, accessed via browser. No desktop wrapper needed. | Next.js web app |
| tiptap-markdown (community) | The community package by aguingand is superseded by the official @tiptap/markdown extension in TipTap 3.x. Use the official one. | @tiptap/markdown (official) |
| moment.js | Deprecated, huge bundle size (300kb+). | date-fns (tree-shakeable) |

## Stack Patterns by Variant

**If AI features are the priority (ship Keeper chat first):**
- Start with AI SDK + LiteLLM integration
- Use simple markdown file display (read-only)
- Build TipTap editor in phase 2
- Because: Conversational AI is the core differentiator; editor can be added incrementally

**If editor experience is the priority (ship the IDE UI first):**
- Start with TipTap + react-arborist + cmdk
- Add Server Actions for file CRUD
- Build AI features in phase 2
- Because: The Cursor-like UX is what makes this different from Obsidian; AI can layer on top

**If entity graph is the priority (build the brain first):**
- Start with Apache AGE schema + entity extraction pipeline
- Build a simple viewer UI
- Add editor and chat in phases 2-3
- Because: The graph is the hardest to retrofit; better to design it first

**Recommended order: Editor > Entity Graph > AI Chat > Inbox > Workflows**
- The editor proves the UX thesis quickly
- Entity graph needs documents to extract from (depends on editor)
- AI chat needs entities to search (depends on graph)
- Inbox is an input channel (depends on AI for triaging)
- Workflows automate established patterns (depends on all above)

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.1.x | React 19.x | Next.js 16 requires React 19 |
| TipTap 3.20.x | React 18+ / React 19 | Framework-agnostic, works with React 19 |
| shadcn/ui (CLI v4) | Next.js 16, Tailwind 4 | Latest CLI generates Next.js 16 compatible code |
| AI SDK 6.0.x | Next.js 14+ | First-class Next.js integration, works with App Router |
| Drizzle ORM 0.45.x | PostgreSQL 12-17 | Uses postgres.js or node-postgres driver |
| pgvector 0.8.x | PostgreSQL 15-17 | Requires PG 15+ for HNSW index support |
| Apache AGE 1.5.x | PostgreSQL 11-18 | Extension, loaded via CREATE EXTENSION |
| react-arborist 3.4.x | React 18+ | Last published ~1 year ago but stable API. Monitor for React 19 issues. |
| Zustand 5.0.x | React 18+ / React 19 | Actively maintained (published hours ago) |
| TanStack Query 5.90.x | React 18+ / React 19 | Actively maintained |
| cmdk 1.1.x | React 18+ | Requires React 18+ hooks (useId, useSyncExternalStore) |

### Potential Compatibility Risk

**react-arborist** (3.4.x) was last published ~1 year ago. It may have React 19 compatibility issues. Mitigation: test early in Phase 1. Fallback: build a custom tree component using react-virtuoso + recursive rendering.

## Docker Compose Blueprint

```yaml
services:
  the-keep:
    build: .
    ports:
      - "3352:3000"
    environment:
      - DATABASE_URL=postgresql://keep:${DB_PASSWORD}@db:5432/the_keep
      - LITELLM_BASE_URL=http://10.0.0.27:2764
    volumes:
      - /data/the-keep/vault:/app/vault
    depends_on:
      - db

  db:
    image: pgvector/pgvector:pg16
    environment:
      - POSTGRES_DB=the_keep
      - POSTGRES_USER=keep
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    # Apache AGE installed via init script

volumes:
  pg_data:
```

## Sources

- [Liveblocks: Rich text editor comparison 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025) -- TipTap vs BlockNote vs Milkdown analysis (MEDIUM confidence)
- [TipTap Official: Markdown Extension](https://tiptap.dev/docs/editor/markdown) -- Bidirectional markdown support, API documentation (HIGH confidence)
- [TipTap vs BlockNote](https://tiptap.dev/alternatives/blocknote-vs-tiptap) -- Official comparison, bias toward TipTap but factually accurate (MEDIUM confidence)
- [BlockNote Official: Markdown Export](https://www.blocknotejs.org/docs/features/export/markdown) -- Confirms "lossy" markdown export (HIGH confidence)
- [Neo4j Alternatives 2026](https://arcadedb.com/blog/neo4j-alternatives-in-2026-a-fair-look-at-the-open-source-options/) -- Graph database landscape (MEDIUM confidence)
- [Apache AGE vs Neo4j](https://dev.to/pawnsapprentice/apache-age-vs-neo4j-battle-of-the-graph-databases-2m4) -- Feature comparison (MEDIUM confidence)
- [Apache AGE Official](https://age.apache.org/) -- PostgreSQL graph extension, Cypher support (HIGH confidence)
- [pgvector GitHub](https://github.com/pgvector/pgvector) -- Vector similarity search for PostgreSQL (HIGH confidence)
- [pgvector 0.8.2 Release](https://www.postgresql.org/about/news/pgvector-082-released-3245/) -- Latest version confirmation (HIGH confidence)
- [Vercel AI SDK 6](https://vercel.com/blog/ai-sdk-6) -- ToolLoopAgent, streaming, multi-provider support (HIGH confidence)
- [AI SDK Docs](https://ai-sdk.dev/docs/introduction) -- Official documentation (HIGH confidence)
- [Next.js 16 Blog](https://nextjs.org/blog/next-16) -- Framework features, Turbopack stable (HIGH confidence)
- [Next.js Server Actions Guide](https://makerkit.dev/blog/tutorials/nextjs-server-actions) -- File system access patterns (MEDIUM confidence)
- [shadcn/ui March 2026 Update](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- CLI v4, AI agent skills (HIGH confidence)
- [cmdk npm](https://www.npmjs.com/package/cmdk) -- Command palette component, v1.1.1 (HIGH confidence)
- [react-arborist npm](https://www.npmjs.com/package/react-arborist) -- File tree component, v3.4.3 (MEDIUM confidence -- staleness risk)
- [Drizzle ORM Docs](https://orm.drizzle.team/) -- Type-safe ORM, PostgreSQL support (HIGH confidence)
- [Zustand npm](https://www.npmjs.com/package/zustand) -- v5.0.12, actively maintained (HIGH confidence)
- [TanStack Query npm](https://www.npmjs.com/package/@tanstack/react-query) -- v5.90.21 (HIGH confidence)
- [LiteLLM Docs](https://docs.litellm.ai/docs/) -- OpenAI-compatible proxy, 100+ providers (HIGH confidence)
- [LLMs to Knowledge Graphs 2025](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a) -- Entity extraction architecture patterns (MEDIUM confidence)
- [NxCode: Next.js vs Remix vs SvelteKit 2026](https://www.nxcode.io/resources/news/nextjs-vs-remix-vs-sveltekit-2025-comparison) -- Framework comparison (MEDIUM confidence)
- [State Management 2026](https://viprasol.com/blog/state-management-react-2026/) -- Zustand vs Jotai vs Redux (MEDIUM confidence)

---
*Stack research for: The Keep -- Personal Knowledge Operating System*
*Researched: 2026-03-18*
