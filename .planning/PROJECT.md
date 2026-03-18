# The Keep

## What This Is

A canonical knowledge hub with a Cursor-like web interface for managing personal documentation, profiles, and structured data. AI agents (including OpenClaw and others) query and update The Keep as their source of truth. Built with structure baked in — inbox, tasks, workflows, entity graph — not an infinitely configurable tool that leads to over-engineering.

## Core Value

A single source of truth that all my AI agents can reference and update, with a human-friendly web UI for oversight and direct editing.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Cursor-like web UI with tree view, tabs, command palette
- [ ] Markdown file backend (human-readable, git-friendly)
- [ ] Entity extraction into graph database (people, projects, tech, concepts)
- [ ] Conversational AI interface (Keeper) for searching and updating docs
- [ ] Inbox system receiving updates from multiple sources
- [ ] AI-powered inbox triaging with suggestions and priority
- [ ] Workflows and automation for processing inbox items
- [ ] BlockNote-style rich editor that stores as markdown
- [ ] Support for remote API LLMs and locally-hosted LLMs
- [ ] API for other AI agents to query canonical data

### Out of Scope

- Obsidian plugin ecosystem — we're building a focused tool, not a platform
- Mobile app — web-first, responsive design for mobile access
- Real-time collaboration — single-user for v1
- Self-service multi-tenant — this is personal infrastructure

## Context

**Use Case Domains (Initial):**
1. **AI Research Profile** — tech stack, projects, interests, preferences, rejected options. Context for research agents analyzing YouTube, Reddit, expert posts.
2. **Health & Lifestyle** — meds, prescriptions, diagnosis history, blood work, food preferences, kitchen inventory, recipes, fasting, exercise, habits, weight tracking.
3. **Religious Studies** — study notes, learning, references.
4. **Finance & Data News** — sources, stock info, investing research, daily feeds.

**Relationship to OpenClaw:**
OpenClaw is a separate proactive AI assistant that will eventually query The Keep for canonical data. The Keep is the knowledge layer; OpenClaw is one of the agents that uses it. OpenClaw deployment is paused pending security research — The Keep could help organize that research.

**Why not Obsidian:**
- Over-engineering trap — too many plugins, too much configuration
- Harder to find things than in Cursor
- Prefer Cursor's UX: tabs, command palette, real file tree
- Want structure baked in, not configured

**Technical Environment:**
- Dev: Banner (10.0.0.33)
- Prod: Hulk (10.0.0.32)
- Available: n8n, LiteLLM, PostgreSQL, MinIO, Traefik, Authentik
- LLM options: LiteLLM proxy (OpenAI, Anthropic, Ollama, local)

## Constraints

- **Web-first**: Must be a web application accessible via browser
- **Self-hosted**: Runs on personal infrastructure (Banner/Hulk)
- **Markdown backend**: Files must be plain markdown, git-friendly
- **LLM flexibility**: Must support multiple LLM providers (remote and local)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cursor-like UI over Obsidian-like | User prefers Cursor's UX, avoids over-engineering trap | — Pending |
| Entity graph separate from file links | Semantic extraction (people, projects, concepts), not just document relationships | — Pending |
| Inbox as first-class feature | Central hub for all incoming data from multiple sources | — Pending |
| 90% AI-managed, 10% human edit | AI handles most changes, human has precision editor for exceptions | — Pending |
| Single instance vs. multiple deployments | Need areas for health/finance/AI with different permissions but cross-referencing | — Pending |

## Open Questions

**Multi-domain architecture:**
- **Leaning toward:** Single Keep with "projects" inside (health, finance, AI tools)
- Each project has its own files, workflows, permissions
- Cross-referencing enabled when needed
- Different permission boundaries per project
- Research will validate this approach

*Decision deferred to architecture phase — research will inform this.*

---
*Last updated: 2026-03-18 after initialization*
