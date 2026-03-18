# Feature Research

**Domain:** Personal Knowledge Management Hub with AI Assistant
**Researched:** 2026-03-18
**Confidence:** HIGH (features well-understood from competitor analysis, architecture implications MEDIUM)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or unusable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **File tree / sidebar navigation** | Every code editor and note app has this. Cursor, VS Code, Obsidian all use tree views. Users orient by browsing. | LOW | Core UI shell component. Must support folders, drag-drop reorder, rename, create/delete. Cursor-style: show all files, no hiding. |
| **Tabbed document editing** | Cursor/VS Code muscle memory. Users expect to open multiple docs and switch between them. | LOW | Tab bar with close, reorder, dirty indicators. Persist tabs across sessions. |
| **Command palette (Cmd+K / Cmd+Shift+P)** | Defining UX pattern of modern tools. Superhuman, Cursor, VS Code, Notion all have it. Keyboard-first users expect it. | MEDIUM | Fuzzy search across files, commands, and actions. Must be fast (<100ms). This IS the navigation for power users. |
| **Rich markdown editing** | Markdown is the stated backend format. Users expect WYSIWYG-ish editing that stores as markdown. | MEDIUM | BlockNote provides Notion-style block editing with markdown import/export. Slash menu, floating toolbar, block drag-drop. |
| **Full-text search** | Cannot find things = cannot use the tool. Obsidian, Notion, and every competitor have search. | MEDIUM | Search across all files. Must support exact match, phrase search, and tag/property filtering. Index on save. |
| **File CRUD operations** | Create, rename, move, delete files and folders. Basic file management. | LOW | Standard operations. Must update all internal links when renaming/moving. |
| **Markdown rendering** | Headings, bold, italic, code blocks, links, images, tables, checklists. Standard markdown. | LOW | BlockNote handles most of this. Ensure GFM (GitHub Flavored Markdown) support including tables and task lists. |
| **Keyboard shortcuts** | Power users expect keyboard-driven workflows. Cursor/VS Code set the bar. | LOW | Standard shortcuts for save, search, new file, command palette, tab switching. Customizable is nice but not v1. |
| **Version history / undo** | Users expect to recover from mistakes. "What did this look like yesterday?" | MEDIUM | Git backend provides this naturally. Need UI to browse commit history per file, view diffs, restore versions. |
| **Responsive web layout** | Must work on desktop browser. Tablet acceptable. Phone is stretch but layout must not break. | MEDIUM | Sidebar collapsible on narrow screens. Editor takes full width on mobile. Not a mobile app, but not broken on mobile. |
| **Authentication** | Single-user but still needs login. Self-hosted on open network. | LOW | Authentik SSO integration. OAuth2/OIDC. Single user, so minimal auth complexity. |
| **Dark/light theme** | Every modern editor and note app supports this. Users notice its absence. | LOW | CSS variables or Tailwind dark mode. Follow system preference with manual toggle. |

### Differentiators (Competitive Advantage)

Features that set The Keep apart. These are where the project's unique value lives.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Conversational Interface ("Keeper")** | Chat with your knowledge base. Ask questions, get answers grounded in your actual documents. No other self-hosted PKM does this well. | HIGH | RAG pipeline: embed documents, vector search, LLM generates answers with citations. Uses LiteLLM for model flexibility. This is the killer feature. |
| **Inbox with AI triage** | Central receiving point for all incoming information. AI categorizes, prioritizes, suggests where to file. Superhuman-style triage for knowledge, not email. | HIGH | Inbox receives items from API, n8n webhooks, manual entry. AI classifies urgency, domain, suggests actions. "For today / for later / archive" pattern from Superhuman. |
| **Entity graph (knowledge graph)** | Automatic extraction of people, projects, technologies, concepts from notes. Semantic relationships, not just document links. Obsidian has backlinks between docs; The Keep knows "Matt uses TypeScript on the-keep project." | HIGH | LLM-based entity extraction on save/ingest. Store in graph DB (or PostgreSQL with JSONB + junction tables). Entity pages auto-generated. 2B parameter models can do this locally per recent benchmarks. |
| **API for AI agents** | Other AI agents (OpenClaw, Claude, custom) can query and update The Keep as their canonical data source. No competitor offers this. | MEDIUM | REST/GraphQL API with auth tokens. CRUD on files, entity queries, search. Structured responses for agent consumption. This makes The Keep a platform, not just an app. |
| **Multi-domain projects** | Single Keep instance with isolated "projects" (health, finance, AI research, religious studies). Cross-referencing when needed, separate permissions possible. | MEDIUM | Project = folder with its own config, workflows, entity namespace. Shared entity graph allows cross-domain connections ("Dr. Smith" appears in both health and finance). |
| **Workflow automation (n8n integration)** | Automated processing of inbox items. RSS feeds become curated notes. YouTube transcripts become study materials. n8n handles the plumbing. | MEDIUM | n8n webhooks push to inbox API. Workflow templates for common patterns (RSS digest, YouTube summary, email forward). The Keep is the destination, n8n is the transport. |
| **AI-assisted writing and editing** | Inline AI suggestions, summarization, expansion, tone adjustment. BlockNote has AI hooks. LiteLLM provides model flexibility. | MEDIUM | BlockNote AI integration for inline editing. Summarize note, expand outline, rephrase. Uses whatever LLM is configured via LiteLLM. |
| **Persistent AI memory layer** | Keeper remembers past conversations and user preferences across sessions. Not just RAG -- actual memory of what was discussed, decided, and deferred. | HIGH | Conversation history stored, facts extracted, preferences learned. Mem0-style memory layer. Cuts token costs by ~90% vs sending full history. Differentiates from stateless chatbots. |
| **Smart backlinks and relationship view** | Bidirectional links between documents (like Obsidian) PLUS entity-level relationships. "This note mentions Project X" and "Project X is related to Technology Y." | MEDIUM | Backlinks computed on save. Entity relationships computed via extraction. UI shows both document links and semantic connections. |
| **Daily notes / journal** | Templated daily note creation. Obsidian's most-used feature. Natural capture point that feeds into the entity graph. | LOW | Auto-create daily note from template. Link to previous/next day. Tag extraction feeds entity graph. Good entry point for habits, health tracking, research logs. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Deliberately NOT building these.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Plugin ecosystem** | Obsidian's biggest draw. "Extend with anything." | The Keep exists BECAUSE Obsidian's plugin ecosystem creates over-engineering. Plugins conflict, break updates, create maintenance burden. Plugin architecture is a product in itself. | Bake in the features that matter. Opinionated > configurable. If something is needed, build it into the core. |
| **Graph visualization (force-directed)** | Obsidian's graph view looks impressive. Users ask for it. | Visually impressive but rarely actionable. Users play with it once, then never use it. Computationally expensive. Does not scale. Community consensus: "pretty but useless for actual work." | Entity list/table view with filters. Relationship panels on entity pages. Actionable over aesthetic. |
| **Real-time collaboration** | "What if I want to share a note?" | Single-user system. Collaboration adds CRDT complexity (Yjs), conflict resolution, presence indicators, permissions. Massive engineering cost for a personal tool. | Share via export (markdown, PDF). If collaboration needed later, add read-only sharing links as a simple feature. |
| **Mobile native app** | "I want to capture on my phone." | Native app = separate codebase, app store management, offline sync. Enormous maintenance burden. | Responsive web app. PWA for home screen. Voice capture via API (n8n webhook from phone). Dedicated capture apps (Drafts, quick note) forward to inbox via API. |
| **Infinite canvas / whiteboard** | Obsidian Canvas, Notion-style boards. | Spatial tools are fun to set up, rarely maintained. Different interaction model from document editing. | If visual thinking is needed, embed Excalidraw or link to external tools. Keep the core focused on structured text. |
| **Kanban / project management** | Notion has boards, Obsidian has Kanban plugin. | The Keep is a knowledge hub, not a project manager. Task management dilutes focus. Existing tools (GitHub Issues, Linear) do this better. | Link to external task trackers. Inbox items can become tasks in other systems via n8n. |
| **Spaced repetition / flashcards** | Logseq and RemNote have this. "Learn from your notes." | Niche feature that 5% of users want. Requires scheduling engine, review UI, progress tracking. Anki exists. | Export notes to Anki format if needed. Not a core concern. |
| **Custom themes / CSS** | "I want it to look exactly how I want." | Theming is a time sink for users and a support burden for developers. Cursor and Superhuman prove opinionated design works. | Dark/light mode. Well-designed defaults. Focus on function over appearance customization. |
| **Database / spreadsheet views** | Notion's databases are powerful. "I want filterable tables." | Full database engine is a separate product (Notion spent years on this). Structured data belongs in Grist or actual databases. | Entity graph handles structured data extraction. For tabular data, link to Grist. API lets external tools query structured data. |
| **End-to-end encryption** | Reflect does this. Privacy-focused users want it. | E2E encryption prevents server-side AI processing (entity extraction, search indexing, RAG). Fundamentally incompatible with AI-first architecture. Self-hosted already provides privacy. | Self-hosted = you own the data. Network-level security (Authentik, VPN). No third-party cloud = no privacy concern that E2E solves. |

## Feature Dependencies

```
[Authentication]
    └──requires──> nothing (first thing built)

[File tree + tabs + editor]
    └──requires──> [Authentication]
    └──requires──> [Markdown file backend]

[Command palette]
    └──requires──> [File tree] (needs file index to search)
    └──requires──> [Full-text search] (shares search infrastructure)

[Full-text search]
    └──requires──> [Markdown file backend] (needs files to index)

[Rich markdown editing (BlockNote)]
    └──requires──> [Markdown file backend] (read/write files)

[Version history]
    └──requires──> [Markdown file backend + Git]

[Daily notes]
    └──requires──> [File CRUD] (creates files from templates)

[Inbox system]
    └──requires──> [Authentication] (API auth)
    └──requires──> [File CRUD] (inbox items become files)

[AI Conversational Interface (Keeper)]
    └──requires──> [Full-text search] (search grounding)
    └──requires──> [Markdown file backend] (document access)
    └──enhances──> [Inbox] (can triage via conversation)

[Entity graph extraction]
    └──requires──> [Markdown file backend] (source documents)
    └──requires──> [LLM integration] (extraction engine)
    └──enhances──> [Full-text search] (entity-aware search)
    └──enhances──> [Keeper] (entity context in answers)

[Inbox AI triage]
    └──requires──> [Inbox system] (items to triage)
    └──requires──> [LLM integration] (classification engine)
    └──requires──> [Entity graph] (context for classification)

[API for AI agents]
    └──requires──> [Authentication] (API tokens)
    └──requires──> [Full-text search] (query capability)
    └──requires──> [Entity graph] (structured queries)

[Workflow automation (n8n)]
    └──requires──> [Inbox system] (destination for workflows)
    └──requires──> [API for AI agents] (n8n calls the API)

[Persistent AI memory]
    └──requires──> [Keeper] (conversation history to remember)
    └──requires──> [Entity graph] (facts to persist)

[AI-assisted writing]
    └──requires──> [Rich markdown editing] (inline integration)
    └──requires──> [LLM integration] (generation engine)

[Smart backlinks]
    └──requires──> [Markdown file backend] (link parsing)
    └──enhances──> [Entity graph] (semantic connections)
```

### Dependency Notes

- **Authentication is foundational:** Everything else sits behind auth. Build it first with Authentik SSO.
- **File backend + editor is the core loop:** Read files, edit files, save files. This is the minimum viable interaction. Must work before anything AI-related.
- **Full-text search unlocks Keeper:** The AI conversational interface needs search to ground its answers. Search infrastructure serves double duty for command palette and Keeper.
- **Entity graph is the AI backbone:** Once extraction works, it enhances search, Keeper answers, inbox triage, and the agent API. Build it early, iterate on extraction quality over time.
- **Inbox requires API:** The inbox is where external data enters. The API is how it gets there. Build them together.
- **n8n integration is configuration, not code:** Once the API exists, n8n workflows are configured in n8n, not built in The Keep. Low implementation cost, high value.

## MVP Definition

### Launch With (v1)

Minimum viable product -- validate that a Cursor-like knowledge UI with AI is worth using daily.

- [ ] **Auth (Authentik SSO)** -- Gate access to the app. Single sign-on with existing infrastructure.
- [ ] **File tree sidebar** -- Browse all markdown files in a tree view. Expand/collapse folders.
- [ ] **Tabbed editor (BlockNote)** -- Open files in tabs. Rich editing that saves as markdown.
- [ ] **Command palette** -- Cmd+K to fuzzy search files and commands. Primary navigation for power users.
- [ ] **Full-text search** -- Search across all files. Results ranked by relevance.
- [ ] **File CRUD** -- Create, rename, move, delete files and folders.
- [ ] **Dark/light theme** -- Follow system preference with manual toggle.
- [ ] **Keyboard shortcuts** -- Save, search, new file, tab switching, command palette.
- [ ] **Keeper (basic)** -- Chat interface that can search documents and answer questions. RAG without entity graph.

### Add After Validation (v1.x)

Features to add once the core editor is being used daily.

- [ ] **Inbox system + API** -- Trigger: "I want to send things to The Keep from other tools."
- [ ] **Entity graph extraction** -- Trigger: "I have enough content that relationships matter."
- [ ] **Daily notes** -- Trigger: "I want a structured daily capture routine."
- [ ] **Backlinks** -- Trigger: "I'm linking between documents and want to see what links back."
- [ ] **Version history UI** -- Trigger: "I want to see what changed and when." (Git provides this, just needs UI.)
- [ ] **Keeper with entity context** -- Trigger: Entity graph is populated enough to enhance answers.
- [ ] **AI-assisted writing** -- Trigger: "I want inline AI help while editing."

### Future Consideration (v2+)

Features to defer until daily usage is established and patterns emerge.

- [ ] **Inbox AI triage** -- Defer until: Inbox has enough volume that manual processing is painful.
- [ ] **Workflow automation (n8n)** -- Defer until: Inbox exists and common patterns emerge for automation.
- [ ] **API for AI agents** -- Defer until: OpenClaw or other agents are ready to consume data.
- [ ] **Persistent AI memory** -- Defer until: Keeper conversations are frequent enough to benefit from memory.
- [ ] **Multi-domain projects** -- Defer until: Content spans multiple domains and isolation is needed.
- [ ] **Smart relationship views** -- Defer until: Entity graph has enough data to show meaningful connections.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| File tree + tabs | HIGH | LOW | P1 |
| Rich markdown editor (BlockNote) | HIGH | MEDIUM | P1 |
| Command palette | HIGH | MEDIUM | P1 |
| Full-text search | HIGH | MEDIUM | P1 |
| Authentication (Authentik) | HIGH | LOW | P1 |
| File CRUD | HIGH | LOW | P1 |
| Dark/light theme | MEDIUM | LOW | P1 |
| Keyboard shortcuts | MEDIUM | LOW | P1 |
| Keeper (basic RAG) | HIGH | HIGH | P1 |
| Inbox system + API | HIGH | MEDIUM | P2 |
| Entity graph extraction | HIGH | HIGH | P2 |
| Daily notes | MEDIUM | LOW | P2 |
| Backlinks | MEDIUM | MEDIUM | P2 |
| Version history UI | MEDIUM | MEDIUM | P2 |
| AI-assisted writing | MEDIUM | MEDIUM | P2 |
| Keeper + entities | HIGH | MEDIUM | P2 |
| Inbox AI triage | MEDIUM | HIGH | P3 |
| n8n workflow integration | MEDIUM | LOW | P3 |
| API for AI agents | HIGH | MEDIUM | P3 |
| Persistent AI memory | MEDIUM | HIGH | P3 |
| Multi-domain projects | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch -- validates the core concept
- P2: Should have, add when daily usage is established
- P3: Nice to have, add when specific need emerges

## Competitor Feature Analysis

| Feature | Obsidian | Notion | Cursor | Logseq | Mem.ai | The Keep Approach |
|---------|----------|--------|--------|--------|--------|-------------------|
| File tree | Local vault explorer | Page tree (database-backed) | Full file system tree | Page tree | No tree (AI organizes) | Cursor-style file tree over markdown files |
| Editor | Markdown with preview | Block-based WYSIWYG | Code editor (Monaco) | Outliner (block-based) | Minimal text editor | BlockNote: block-based WYSIWYG that saves as markdown |
| Search | Core search + Omnisearch plugin | Full-text + property search | File search + AI semantic | Full-text + block search | AI-powered semantic | Full-text + entity-aware + AI semantic (via Keeper) |
| Command palette | Cmd+P for files, Cmd+Shift+P for commands | Cmd+K quick actions | Cmd+Shift+P commands, Cmd+P files | Cmd+K | No | Cmd+K unified palette for files, commands, entities |
| AI assistant | Plugins (Copilot, various) | Notion AI (built-in, powerful) | AI chat + inline (core feature) | Plugins | Core feature (Mem 2.0) | Keeper: conversational AI grounded in your documents |
| Graph / relationships | Graph view (force-directed) | Backlinks only | None | Graph view | AI-inferred connections | Entity graph (extracted semantic relationships, not just links) |
| Inbox | None (use Daily Notes) | None (use Inbox database template) | None | None | AI-organized capture | First-class inbox with API + AI triage |
| API | None (local files) | Official API | None (local files) | None | Limited API | Full REST API for AI agents |
| Automation | Templater + Dataview plugins | Notion automations | None | None | None | n8n integration via API |
| Data storage | Local markdown files | Cloud database | Local files | Local markdown/JSON | Cloud | Local markdown files with git versioning |
| Self-hosted | Desktop app (local) | No (SaaS only) | Desktop app (local) | Desktop app (local) | No (SaaS only) | Yes (web app on personal infrastructure) |
| Offline | Full offline | Limited | Full offline | Full offline | Partial offline | Online-first (self-hosted, always on LAN) |
| Collaboration | None (single-user) | Full real-time collab | None | None | None | None (single-user, by design) |
| Version control | Git plugin (community) | Page history (limited) | Git (native to dev workflow) | Git (built-in) | None visible | Git-native version history with UI |
| Voice input | None | Notion AI transcription | None | None | Voice Mode (core feature) | Possible via n8n webhook + Whisper, not v1 |
| Mobile | Mobile app | Mobile app (full) | None | Mobile app | Mobile app | Responsive web (PWA stretch goal) |

### Key Competitive Insights

**vs Obsidian:** The Keep avoids the plugin trap while keeping what works (markdown files, command palette, tree view). Adds what Obsidian lacks: web UI, AI-first design, inbox, API for agents.

**vs Notion:** The Keep is self-hosted (data ownership), markdown-backed (portable), and single-user (no collaboration tax). Notion's AI is powerful but cloud-locked and subscription-heavy.

**vs Cursor:** The Keep borrows Cursor's UI paradigm (tree, tabs, palette) but applies it to knowledge management instead of code. Adds AI knowledge features Cursor does not have.

**vs Mem.ai:** Similar AI-first philosophy, but The Keep is self-hosted, uses local/flexible LLMs, and has an entity graph rather than relying on AI alone for organization. The Keep also has an explicit inbox pattern Mem lacks.

**vs Logseq/Roam:** The Keep uses document-based editing (not outliner-only). Avoids the outliner paradigm that works for some but frustrates others. Keeps markdown files as the source of truth rather than block-based JSON.

## Sources

- [Obsidian Core Plugins Tier List](https://practicalpkm.com/obsidian-core-plugins-tier-list/)
- [Best Obsidian Plugins 2026](https://www.dsebastien.net/the-must-have-obsidian-plugins-for-2026/)
- [Top Obsidian Plugins 2026 - Obsibrain](https://www.obsibrain.com/blog/top-obsidian-plugins-in-2026-the-essential-list-for-power-users)
- [Notion AI Product Page](https://www.notion.com/product/ai)
- [Notion 3.2 Release Notes](https://www.notion.com/releases/2026-01-20)
- [Notion AI Review 2026](https://max-productive.ai/ai-tools/notion-ai/)
- [Cursor Features](https://cursor.com/features)
- [Cursor Alternatives 2026](https://www.builder.io/blog/cursor-alternatives-2026)
- [Obsidian vs Logseq Comparison](https://www.glukhov.org/post/2025/11/obsidian-vs-logseq-comparison/)
- [Roam vs Logseq - Slant](https://www.slant.co/versus/36875/39125/~roam-research_vs_logseq)
- [BlockNote Editor](https://www.blocknotejs.org/)
- [BlockNote AI Features](https://www.blocknotejs.org/docs/features/ai)
- [Rich Text Editor Comparison 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025)
- [Command Palette UX Patterns](https://medium.com/design-bootcamp/command-palette-ux-patterns-1-d6b6e68f30c1)
- [How to Build a Remarkable Command Palette - Superhuman](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/)
- [Personal Knowledge Graphs: Notes to Insights](https://dasroot.net/posts/2025/12/personal-knowledge-graphs-notes-insights/)
- [Entity Extraction with 2B Model Benchmarks](https://earezki.com/ai-news/2026-03-14-3-entity-extraction-with-a-2b-model-benchmarks-from-a-personal-knowledge-graph/)
- [LLMs to Knowledge Graphs - Production Systems 2025](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a)
- [Superhuman Inbox Zero Method](https://blog.superhuman.com/inbox-zero-method/)
- [Superhuman Email Triage](https://blog.superhuman.com/email-triage/)
- [Mem.ai - AI Thought Partner](https://get.mem.ai/)
- [Mem vs Reflect Comparison](https://aloa.co/ai/comparisons/ai-note-taker-comparison/mem-vs-reflect)
- [AI Memory Frameworks 2026](https://machinelearningmastery.com/the-6-best-ai-agent-memory-frameworks-you-should-try-in-2026/)
- [Memory for AI Agents - Context Engineering](https://thenewstack.io/memory-for-ai-agents-a-new-paradigm-of-context-engineering/)
- [AI Memory Layer Guide - Mem0](https://mem0.ai/blog/ai-memory-layer-guide)
- [Agentic Knowledge Base Patterns](https://thenewstack.io/agentic-knowledge-base-patterns/)
- [AI Knowledge Management Trends 2026](https://knowmax.ai/blog/knowledge-management-trends/)
- [Best AI Knowledge Management Tools 2025](https://aloa.co/ai/comparisons/ai-note-taker-comparison/best-ai-knowledge-management-tools)

---
*Feature research for: Personal Knowledge Management Hub with AI Assistant (The Keep)*
*Researched: 2026-03-18*
