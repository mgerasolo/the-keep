# Project Research Summary

**Project:** The Keep — Personal Knowledge Operating System
**Domain:** AI-first personal knowledge management hub with graph database, conversational AI, and Cursor-like web IDE
**Researched:** 2026-03-18
**Confidence:** HIGH

## Executive Summary

The Keep is a self-hosted, markdown-backed personal knowledge operating system that combines a Cursor-style IDE interface with conversational AI and an automated entity graph. Research confirms this is a well-understood problem space with established patterns: a Next.js monolith using TipTap for rich editing (not BlockNote — see below), PostgreSQL with pgvector and Apache AGE for all data needs, and Vercel AI SDK routing through the existing LiteLLM proxy. The most important architectural insight is that markdown files on disk are the canonical source of truth, with PostgreSQL serving as a derived, eventually-consistent index. This single design decision shapes everything downstream.

The recommended approach is to build in strict dependency order: UI shell + file system first, then editor + search, then AI infrastructure, then Keeper chat + inbox, then the external agent API. Research is emphatic that skipping phases — especially building AI features before the knowledge base has real content — triggers the single most common failure mode for personal knowledge tools: spending months building the system and never using it. STACK.md flags a key deviation from the original spec: TipTap replaces BlockNote because BlockNote's markdown export is documented as lossy, which is incompatible with git-backed, AI-writable markdown files as the source of truth.

The primary risks are content integrity (AI hallucinating into canonical data), editor-markdown roundtrip fidelity (BlockNote would corrupt content on every save/load cycle), and the meta-tool trap (building instead of using). All three have clear mitigations: TipTap's lossless markdown extension solves the editor problem; a change-proposal queue with audit log solves AI corruption; and a "20 documents before Phase 2" gate enforces actual usage. Security risks are real — RAGPoison (August 2025) demonstrated vector database poisoning is an active attack vector, and per-agent API keys with domain-scoped permissions must be implemented before any external agent gets write access.

## Key Findings

### Recommended Stack

The stack centers on Next.js 16 App Router as the full-stack framework — Server Components for file system reads, Server Actions for file writes, and API routes for the agent gateway. TipTap 3.20 with its official `@tiptap/markdown` extension replaces BlockNote as the editor, providing lossless bidirectional markdown conversion that is non-negotiable for a git-backed, AI-writable knowledge system. All data lives in a single PostgreSQL 16 instance with two extensions: pgvector 0.8 for semantic search and embeddings, and Apache AGE 1.5 for graph queries when needed (adjacency tables with recursive CTEs handle the load at personal scale). The existing LiteLLM proxy at `10.0.0.27:2764` handles all LLM routing; Vercel AI SDK 6 provides TypeScript streaming and tool-calling primitives. Drizzle ORM replaces Prisma because its `sql` template tag handles Apache AGE Cypher queries that Prisma cannot.

**Core technologies:**
- **Next.js 16 (App Router):** Full-stack framework — Server Components for file reads, Server Actions for file writes, API routes for agent gateway
- **TipTap 3.20 + @tiptap/markdown:** Lossless rich markdown editor — replaces BlockNote (BlockNote's export is documented as lossy, incompatible with git-backed markdown)
- **PostgreSQL 16 + pgvector 0.8 + Apache AGE 1.5:** Single database handles relational, vector, and graph data — avoids running Neo4j as a separate service
- **Vercel AI SDK 6:** TypeScript streaming, tool calling, agentic workflows — first-class Next.js integration
- **LiteLLM (existing, 10.0.0.27:2764):** LLM gateway already deployed — zero-code provider switching, cost tracking, model routing
- **Drizzle ORM 0.45:** Type-safe SQL with raw query escape hatch — required for Apache AGE Cypher passthrough
- **Zustand 5 + TanStack Query 5.90:** Client state (editor, panels) + server state (file tree, entities, inbox) — lightweight, no Redux boilerplate
- **react-arborist 3.4:** File tree with virtualization, drag-drop, keyboard nav — matches VS Code sidebar UX (monitor for React 19 compatibility)
- **shadcn/ui (CLI v4) + Tailwind 4:** Component library + styling — cmdk for command palette, headless radix-ui primitives

**Critical version note:** react-arborist 3.4 was last published ~1 year ago and may have React 19 compatibility issues. Test in Phase 1 and have a fallback plan (react-virtuoso + custom recursive tree).

### Expected Features

**Must have (v1 table stakes — validates the core concept):**
- File tree sidebar with folder navigation (react-arborist)
- Tabbed document editing with dirty indicators and session persistence
- Command palette (Cmd+K) with fuzzy search across files and commands — must be under 100ms
- Rich markdown editing via TipTap with slash menu and floating toolbar
- Full-text search across all files (PostgreSQL tsvector)
- File CRUD (create, rename, move, delete) with internal link updates on rename
- Dark/light theme with system preference detection
- Keyboard shortcuts (save, search, new file, tab switching)
- Keeper (basic RAG) — chat interface grounded in documents, no entity graph required for v1
- Authentication via Authentik SSO (OIDC/OAuth2)

**Should have (v1.x — add after daily usage is established):**
- Inbox system + REST API (prerequisite for external data sources)
- Entity graph extraction (People and Projects first, limited scope)
- Daily notes with template support (high-value, low-complexity feature)
- Backlinks (bidirectional document links computed on save)
- Version history UI (git backend already provides this, needs UI only)
- Keeper enhanced with entity context once the graph has content
- AI-assisted inline writing (TipTap AI hooks + LiteLLM)

**Defer (v2+ — wait for concrete usage friction):**
- Inbox AI triage automation (defer until inbox volume makes manual triage painful)
- n8n workflow integration (defer until inbox exists and patterns emerge)
- External agent API / MCP server (defer until other agents are ready to consume)
- Persistent AI memory layer (defer until Keeper conversations are frequent)
- Multi-domain project isolation (defer until content genuinely spans domains)
- Smart relationship visualization (defer until entity graph has meaningful data)

**Anti-features (explicitly not building):**
- Plugin ecosystem (the reason Obsidian was rejected)
- Force-directed graph visualization (impressive, rarely actionable)
- Real-time collaboration (CRDT complexity for a single-user tool)
- Native mobile app (responsive web + PWA is sufficient)
- Database/spreadsheet views (Notion spent years on this; link to Grist instead)
- End-to-end encryption (incompatible with server-side AI processing)

### Architecture Approach

The Keep uses a layered monolith in a Turborepo workspace: a single Next.js app handles the web UI and API, with business logic extracted into a framework-agnostic `packages/core` package shared by both the web app and a standalone MCP server sidecar. The defining pattern is "files are truth, database is index": all writes go to markdown on disk first; a chokidar file watcher triggers asynchronous PostgreSQL index updates and entity extraction jobs via pg-boss (runs inside PostgreSQL, no Redis needed). This one-directional data flow prevents sync conflicts and ensures content survives editor crashes, agent failures, or database rebuilds. The content directory is mounted as a Docker volume, git-tracked, and organized by project (`content/ai-research/`, `content/health/`, etc.) with a `_meta.yaml` per project controlling agent access permissions.

**Major components:**
1. **Web UI Layer (Next.js):** File tree explorer (react-arborist), TipTap editor, command palette (cmdk), Keeper chat (streaming via AI SDK)
2. **API Layer (Next.js API routes):** File CRUD, search, inbox webhook receiver, agent gateway (REST + MCP)
3. **Service Layer (packages/core):** FileService, EntityGraphService, AIService (LiteLLM client), InboxManager — framework-agnostic, shared with MCP server
4. **Data Layer:** Markdown files on disk (canonical), PostgreSQL + pgvector + Apache AGE (derived index), LiteLLM proxy (external)
5. **MCP Server (packages/mcp-server):** Sidecar process exposing tools to external agents (OpenClaw, Claude Code) via Streamable HTTP transport
6. **Background Workers:** File watcher, entity extractor, inbox triager — all event-driven, debounced, asynchronous via pg-boss job queue

**Key patterns to follow:**
- Files are the authority, database is eventually-consistent index (one-directional data flow)
- AI model routing by intent: cheap models (gpt-4o-mini) for extraction/triage, capable models (Claude) for Keeper chat
- Change-proposal queue for all AI writes — no direct mutation of canonical data
- Domain-scoped agent permissions via `_meta.yaml` enforced in FileService

### Critical Pitfalls

1. **Markdown-editor roundtrip corruption** — Use TipTap + `@tiptap/markdown` (not BlockNote). Build automated roundtrip test suite in Phase 1 before building anything on top of the editor. Test with tables, nested lists, code blocks, frontmatter, and Unicode. This is foundational — getting it wrong corrupts every subsequent phase.

2. **AI hallucination corrupting canonical data** — Never allow AI to write directly to files. All AI writes must go through a change-proposal queue with diff visibility. Sensitive domains (health, finance) require human approval regardless of confidence score. Git history is the safety net but only if someone notices the corruption first — proactive validation is required.

3. **The meta-tool trap (building instead of using)** — Ship a usable MVP in Phase 1 with zero AI features. Enforce a hard gate: 20+ actively-used documents before Phase 2 begins. Time-box each phase. Feature additions must trace to concrete usage friction, not speculation.

4. **Entity graph becoming unreliable** — Defer entity extraction to Phase 3, after the knowledge base has real content. Start with explicit user tagging + AI suggestions (not silent auto-extraction). Scope to People and Projects only initially. Validate extraction F1 score on real data before committing to the graph schema. NER on personal notes has ~0.87 F1 even for the best extraction models.

5. **AI agent write access without guardrails** — Per-agent API keys with domain scoping must be built before any external agent gets write access. No global API key. Rate limiting on writes. Audit log with rollback capability. RAGPoison (August 2025) demonstrated that vector databases are a live attack surface.

## Implications for Roadmap

Based on combined research, the dependency graph is unambiguous and maps directly to a 5-phase structure. Research from ARCHITECTURE.md independently arrived at the same phase order as FEATURES.md's MVP/v1.x/v2 structure, which is a strong signal the ordering is correct.

### Phase 1: Foundation Shell (Infrastructure + Editor)

**Rationale:** Nothing else can be built without a working file system, database schema, and editor that correctly round-trips markdown. The editor choice (TipTap, not BlockNote) must be validated with automated tests before building any feature on top of it. This phase also avoids the meta-tool trap by shipping something immediately usable as a basic markdown knowledge base.

**Delivers:** A fully functional Cursor-like knowledge editor — file tree, tabbed editing, command palette, full-text search, file CRUD, auth. No AI. Just a very good markdown editor with a fast search. This alone has daily utility and provides the content base needed for Phase 2.

**Addresses features from FEATURES.md:** File tree, tabbed editor, command palette, full-text search, file CRUD, dark/light theme, keyboard shortcuts, authentication, markdown rendering.

**Avoids pitfalls:**
- Markdown roundtrip corruption (validate TipTap roundtrip before proceeding)
- Meta-tool trap (Phase 1 is usable without AI; gate to Phase 2 requires 20+ documents)
- Git repo bloat (debounced saves, commit squashing strategy defined here)
- Search performance (PostgreSQL tsvector index built from day one)

**Research flag:** Standard patterns — Next.js + shadcn/ui + react-arborist + TipTap are all well-documented. The only risk is react-arborist React 19 compatibility; test early and have a fallback plan.

### Phase 2: AI Infrastructure (Embeddings + Entity Foundation)

**Rationale:** AI features (Keeper chat, entity extraction, inbox triage) all require a shared foundation: an embedding pipeline, vector search, a job queue, and the LiteLLM integration. Building this once before building any of the three consuming features avoids parallel and potentially inconsistent implementations. The change-proposal queue for AI writes must also be designed here before any agent gets write access.

**Delivers:** The AI plumbing layer — LiteLLM client, embedding generation pipeline, pgvector semantic search, pg-boss job queue, AI change-proposal queue with audit log. No user-facing AI features yet, but Keeper can be wired up at the end of this phase using basic RAG.

**Uses from STACK.md:** Vercel AI SDK 6, LiteLLM proxy (existing), pgvector 0.8, Drizzle ORM for schema, pg-boss (PostgreSQL-native job queue).

**Implements from ARCHITECTURE.md:** AI Pipeline Service, Background Workers (file watcher triggers embedding jobs), document chunking strategy, hybrid search (FTS + vector similarity with weighted scoring).

**Avoids pitfalls:**
- AI hallucination corruption (change-proposal queue built before Keeper gets write access)
- Agent write access without guardrails (per-agent API keys, domain scoping designed here)
- Synchronous LLM calls in request path (all LLM operations async via job queue)
- Embedding regeneration on every edit (incremental embedding with content-hash change detection)

**Research flag:** Needs research-phase during planning — chunking strategy for the knowledge base documents, retrieval accuracy testing against real data, and LiteLLM configuration for intent-based model routing need validation against the actual document corpus.

### Phase 3: Keeper + Entity Graph

**Rationale:** With AI infrastructure in place, Keeper (conversational AI grounded in documents) and the entity graph (automatic people/project extraction) can be built on a validated foundation. These two features are bundled because they enhance each other: Keeper answers are better with entity context, and entity extraction is more useful when Keeper can answer entity-specific questions.

**Delivers:** The "AI assistant" vision — Keeper chat with RAG, streaming responses, tool calling (search, read, write via proposal queue). Entity extraction pipeline for People and Projects (narrow scope). Entity pages auto-generated. Keeper enhanced with entity context once the graph has data.

**Uses from STACK.md:** Vercel AI SDK 6 (ToolLoopAgent for agentic tool calling), Apache AGE if graph queries grow complex (otherwise adjacency tables with CTEs), structured output schema for entity extraction.

**Implements from ARCHITECTURE.md:** Keeper Chat UI (streaming), Entity Graph Service, AI Pipeline Service (entity extraction intent mapped to gpt-4o-mini, Keeper mapped to claude-sonnet).

**Avoids pitfalls:**
- Entity graph maintenance nightmare (start with People + Projects only, validate F1 on real data before expanding)
- AI hallucination (Keeper write operations go through change-proposal queue built in Phase 2)

**Research flag:** Needs research-phase during planning — entity extraction prompt engineering for personal notes (informal language, abbreviations), disambiguation strategy, and graph schema design need validation against actual content.

### Phase 4: Inbox + Daily Workflow

**Rationale:** Inbox requires the API (which requires auth, built in Phase 1) and AI triage (which requires the entity graph, built in Phase 3) to deliver its full value. Daily notes are low-complexity but high-usage and belong here with other workflow features. This phase also enables n8n integration since the API endpoint exists.

**Delivers:** Central inbox with webhook receiver, AI-assisted triage (classify, prioritize, suggest destination), inbox management UI, daily notes with template support, backlinks computed on save, version history UI (git backend exists, just needs UI). n8n integration is configuration in n8n, not code in The Keep.

**Uses from STACK.md:** chokidar (already in Phase 1 for file watching, now also triggers backlink computation), gray-matter (frontmatter for inbox item state tracking).

**Implements from ARCHITECTURE.md:** Inbox as Event Bus pattern — items arrive via webhook, stored as markdown in `content/_inbox/`, AI triage runs async, human reviews in Inbox UI.

**Avoids pitfalls:**
- Inbox overwhelm (rate limiting per source, auto-archive policy, cap at 1-2 initial sources)
- Triage death spiral (triage must produce exactly one outcome: file it, task it, or dismiss it)

**Research flag:** Standard patterns for webhook receivers and job queues. The AI triage accuracy will need calibration against real inbox content — this is an iterative tuning problem, not a research problem.

### Phase 5: External Agent API (MCP + REST)

**Rationale:** Must be last because it exposes all core services to external agents. Every service must be stable and secured before external access is opened. This is also the phase that fulfills The Keep's role as a platform, not just an app. Building it last ensures the API design reflects actual usage patterns rather than speculation.

**Delivers:** MCP server sidecar (TypeScript MCP SDK, Streamable HTTP transport) with tools for search, read, write-proposal, and query-entities. REST API fallback for agents that do not speak MCP. Per-agent API keys with domain-scoped permissions. Rate limiting. API documentation. OpenClaw and Claude Code can now use The Keep as their canonical knowledge source.

**Implements from ARCHITECTURE.md:** MCP Server (packages/mcp-server), Agent Gateway API, REST fallback endpoints.

**Avoids pitfalls:**
- Agent write access without guardrails (per-agent keys enforced, write goes through proposal queue from Phase 2)
- RAGPoison-style attacks (content sanitization on all API writes, no direct file overwrite by agents)

**Research flag:** Standard patterns — TypeScript MCP SDK is well-documented. The only novel aspect is mapping The Keep's domain-scoped permissions to MCP's tool/resource model, which may need design iteration.

### Phase Ordering Rationale

- **Dependency chain is strict:** Editor (Phase 1) produces documents; documents enable embeddings (Phase 2); embeddings enable Keeper and entity extraction (Phase 3); entity graph enables AI inbox triage (Phase 4); stable services enable external agent access (Phase 5). No phase can be meaningfully skipped.
- **Usage gates enforce content growth:** The meta-tool trap is avoided by requiring real document content before proceeding. Phase 2 gate = 20+ active documents. Phase 3 gate = Keeper used daily for at least 1 week. Phase 4 gate = entity graph has meaningful data.
- **AI writes are gated at Phase 2:** No AI agent has write access until the change-proposal queue and audit log are in place. This is a hard architectural constraint that the phase order enforces.
- **n8n integration is free:** Once the inbox webhook endpoint exists in Phase 4, n8n workflows are configured in n8n — no additional code in The Keep. High value, near-zero implementation cost.

### Research Flags

Phases needing deeper research during planning:
- **Phase 2 (AI Infrastructure):** Chunking strategy for personal knowledge base documents, retrieval accuracy benchmarking, LiteLLM model routing configuration. These require real data from Phase 1 to validate — cannot be fully designed upfront.
- **Phase 3 (Entity Graph):** Entity extraction prompt engineering for informal personal notes, disambiguation strategy for ambiguous entity references, graph schema design to support anticipated query patterns. Design on Phase 1 content.

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1 (Foundation Shell):** Next.js, TipTap, shadcn/ui, react-arborist are all well-documented. The only risk is react-arborist React 19 compatibility — test in week 1.
- **Phase 4 (Inbox + Daily Workflow):** Webhook receiver, pg-boss queue, and file-based inbox patterns are standard. Triage calibration is iterative, not a research problem.
- **Phase 5 (Agent API):** TypeScript MCP SDK is well-documented. REST API design follows established patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All major choices backed by official documentation. The TipTap-over-BlockNote decision is well-supported by BlockNote's own docs confirming lossy conversion. react-arborist React 19 compatibility is the only uncertainty. |
| Features | HIGH | Competitor analysis is thorough (Obsidian, Notion, Cursor, Mem, Logseq). Feature dependencies are clearly mapped. MVP definition is conservative and achievable. |
| Architecture | HIGH | 5-phase build order independently validated by both ARCHITECTURE.md and FEATURES.md research, which arrived at the same phase structure. Patterns (dual-source-of-truth, entity extraction pipeline, AI gateway, inbox as event bus) are established and well-documented. |
| Pitfalls | HIGH | Pitfalls are grounded in documented incidents (BlockNote lossy conversion confirmed by official docs, hallucination rates from 2025 studies, RAGPoison demonstrated August 2025, meta-tool trap documented in community research). Recovery strategies provided for each. |

**Overall confidence:** HIGH

### Gaps to Address

- **react-arborist React 19 compatibility:** Unknown until tested. Plan: test in Phase 1 week 1. Fallback: react-virtuoso + custom recursive tree component. Do not block Phase 1 planning on this.
- **Entity extraction quality on personal notes:** Benchmarks show 0.87 F1 on person extraction with 2B models, but this is on cleaner data than personal notes. Real accuracy will only be known once Phase 1 documents are available for testing. Plan: defer entity extraction schema finalization to Phase 3 planning after Phase 1 content is available.
- **Chunking strategy validation:** Optimal chunk size/overlap for The Keep's document types (research notes, health logs, finance summaries) cannot be determined upfront. Plan: test multiple strategies against Phase 1 content during Phase 2 planning.
- **TipTap 3.x commercial vs. MIT licensing boundary:** `@tiptap/markdown` is MIT-licensed, but some TipTap 3.x extensions may require a Pro subscription. Validate during Phase 1 setup which extensions are needed and whether they are MIT or Pro.

## Sources

### Primary (HIGH confidence)
- [TipTap Official: Markdown Extension](https://tiptap.dev/docs/editor/markdown) — bidirectional markdown support, lossless roundtrip API
- [BlockNote Official: Markdown Export](https://www.blocknotejs.org/docs/features/export/markdown) — confirms "lossy" markdown export
- [pgvector GitHub](https://github.com/pgvector/pgvector) — vector similarity search, HNSW index, version 0.8.2
- [Apache AGE Official](https://age.apache.org/) — PostgreSQL graph extension, openCypher support
- [Vercel AI SDK 6](https://vercel.com/blog/ai-sdk-6) — ToolLoopAgent, streaming, multi-provider support
- [Next.js 16 Blog](https://nextjs.org/blog/next-16) — App Router, Turbopack stable, React 19 support
- [shadcn/ui March 2026 Update](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) — CLI v4, AI agent skills
- [Benchmarking Local Entity Extraction](https://earezki.com/ai-news/2026-03-14-3-entity-extraction-with-a-2b-model-benchmarks-from-a-personal-knowledge-graph/) — 0.87 F1 on person extraction from personal knowledge graph
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — MCP server implementation
- [MCP Specification (Nov 2025)](https://modelcontextprotocol.io/specification/2025-11-25) — Streamable HTTP transport

### Secondary (MEDIUM confidence)
- [Liveblocks: Rich text editor comparison 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025) — TipTap vs BlockNote vs Milkdown
- [Apache AGE vs Neo4j](https://dev.to/pawnsapprentice/apache-age-vs-neo4j-battle-of-the-graph-databases-2m4) — feature comparison at personal scale
- [LLMs to Knowledge Graphs 2025](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a) — entity extraction architecture
- [Hallucination Rates in 2025](https://medium.com/@markus_brinsa/hallucination-rates-in-2025-accuracy-refusal-and-liability-aa0032019ca1) — 0.7% to 30% range
- [XDA: Building a Second Brain Became the Excuse](https://www.xda-developers.com/building-second-brain-became-excuse-for-not-using-my-first-one/) — meta-tool trap documented
- [Obsidian Security: AI Agent Security Risks](https://www.obsidiansecurity.com/blog/ai-agent-security-risks) — memory poisoning, agent chaining

### Tertiary (LOW confidence — needs validation during implementation)
- [pgvector vs dedicated vector databases (Encore)](https://encore.dev/blog/you-probably-dont-need-a-vector-database) — pgvector sufficient at personal scale
- [State Management 2026](https://viprasol.com/blog/state-management-react-2026/) — Zustand vs Jotai vs Redux

---
*Research completed: 2026-03-18*
*Ready for roadmap: yes*
