# The Keep - Product Roadmap

**Last Updated:** 2026-03-22
**Status:** Living Document

---

## v1 MVP (Ship This)

**Focus:** Cursor-like IDE + AI chat + basic RAG + memories

| Feature | Description |
|---------|-------------|
| Cursor-like IDE | dockview panels, VS Code-style tabs, command palette |
| Claude Code-style AI | Chat as dockable tab, not fixed sidebar |
| File management | Upload, browse, view, edit markdown |
| PDF text extraction | Extract text from text-based PDFs |
| Basic RAG | Query across project files |
| Source citation | AI shows what files it referenced |
| Memory provenance | Track source of every learned fact |
| Atomic memories | Editable single-fact memories (profiles, preferences) |
| Inventories | Kitchen items, supplements, equipment (editable) |
| Project Context System | .keep/ files: Soul, Guardrails, Capabilities, Procedures |
| Soul Discovery | Onboarding flow to define project purpose & boundaries |
| Soft delete / Trash | 30-day recovery for deleted items |
| LiteLLM integration | Model selection, local-first priority |
| Single-user | Self-hosted, personal use |

**Architecture must support:** Workflow, inbox, tasks, multi-user (even if not built)

---

## MVP+1 (Near-term)

**Focus:** Quick capture, basic ingestion, procedure automation

| Feature | Description |
|---------|-------------|
| Quick capture / inbox | Dump ideas fast, notes go to inbox |
| Task extraction (basic) | Manual or AI: "remind me..." → task |
| Raw content storage | Archive source material for deep queries |
| Manual synthesis trigger | "Summarize and extract best practices" button |
| Basic ingestion helpers | Simple ways to get content in (paste, webhook?) |
| Dify procedure sync | Auto-export procedures to Dify workflows |
| Basic MCP plugins | Calendar, reminders integration |
| Memory insight reports | "What have you learned about me?" summaries |
| Knowledge dump onboarding | Talk → AI generates project files |

---

## MVP+2

**Focus:** Workflow automation, synthesis

| Feature | Description |
|---------|-------------|
| Inbox workflow | Ingest → process → structured knowledge |
| Best practices synthesis | Incoming content → evolving best practices docs |
| Automated ingestion (basic) | Scheduled pulls from sources |
| Action plan generation | Synthesize into actionable guidance |

---

## MVP+3 / v2

**Focus:** Intelligent RAG, cross-project

| Feature | Description |
|---------|-------------|
| Cross-project linking | Health ↔ Food ↔ Transcripts |
| Super projects | Combine projects into unified AI context |
| Tiered RAG | Raw → Summary → Key Points hierarchy |
| Intelligent depth selection | AI decides what depth to query |
| Freshness decay | Domain-specific relevancy degradation |
| Multi-user foundation | Roles, permissions (architecture ready) |

---

## v3+

**Focus:** Advanced AI, external integrations

| Feature | Description |
|---------|-------------|
| Automated ingestion (full) | YouTube, emails, Grok API, reports |
| Source trust scoring | Per-source, per-topic trust (1-10 scale) |
| OCR | Scanned docs, images (JPEG, PNG) |
| AI artifacts | Interactive outputs (charts, diagrams) |
| KnowledgeStack integration | Connect to external knowledge engine (TBD) |
| Multi-user (full) | Teams, sharing, collaboration |

---

## Future / Vision

| Feature | Description |
|---------|-------------|
| Mobile app | iOS/Android companion |
| Real-time collaboration | Multi-user editing |
| Public sharing | Share projects/files externally |
| File versioning | History, rollback |
| Audio/video transcription | Built-in transcription |
| Extension marketplace | Community plugins |

---

## Notes

- **Single-user → Multi-user:** v1 single-user, v3/v4 may add multi-user
- **KnowledgeStack:** Separate project for bulk ingestion; integration TBD based on how both evolve
- **Architecture-first:** v1 structure must support future features even if UI not built
- **Project Context System:** See [project-context-system.md](project-context-system.md) for .keep/ file specs
- **Dify Integration:** Procedures designed for Dify workflow compatibility from day one
- **MCP Plugins:** Plugin architecture ready in v1, basic integrations in MVP+1

---

## Related Artifacts

| Artifact | Purpose |
|----------|---------|
| [product-brief.md](product-brief.md) | Product vision |
| [prd.md](prd.md) | Detailed requirements |
| [project-context-system.md](project-context-system.md) | .keep/ file specifications |
| [architecture.md](architecture.md) | Technical design |
| [ux-design.md](ux-design.md) | User experience design |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-22 | Added Project Context System, Soul Discovery, Dify integration to roadmap |
| 2026-03-22 | Initial roadmap created during PRD workflow |
