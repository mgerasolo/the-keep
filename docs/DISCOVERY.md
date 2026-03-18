---
title: "The Keep - Discovery Handoff"
type: handoff
source_project: Infrastructure
target_project: The Keep
created: 2026-03-18
source_conversation: Brainstorming session in Infrastructure
status: ready_for_handoff
---

# The Keep - Discovery Handoff

> **Purpose:** This document captures the brainstorming and discovery work done in Infrastructure for handoff to The Keep project.

---

## Executive Summary

**The Keep** is a centralized knowledge curation system that maintains canonical context about "Matt's world" — projects, tech stack, decisions, and priorities. It enables AI assistants (Wanda, Vision, LobeChat coaches) to contextualize everything they analyze against a single source of truth.

**The Keeper** is the agent that orchestrates The Keep, similar to how Oscar orchestrates Infrastructure.

---

## Vision & Purpose

### What It Is

A curated registry of:
- **Projects** — One-paragraph summaries of each project (what it does, why it matters)
- **Tech Stack** — Tools in use (Traefik, AdGuard, Claude Code, Metabase, Obsidian...)
- **Decisions** — Key architectural choices and WHY
- **Rejected Tools** — What we tried and abandoned (e.g., Phase for secrets — session persistence issues with Claude Code)
- **Priorities** — Current focus areas (finance data ingestion, habit tracking, health...)

### Why It Exists

When AI assistants analyze content (YouTube videos, Reddit posts, X/Grok data, stock trading info), they need context to determine relevance:

- "Is this video about Kubernetes secrets relevant?" → Check The Keep: "Matt rejected Phase, uses .env files"
- "Is this stock API interesting?" → Check The Keep: "Matt is building DoughFlow and Stock Researcher for finance ingestion"

Without this, every AI assistant operates in isolation without understanding Matt's world.

### Who Uses It

| Consumer | Access Level | How They Use It |
|----------|--------------|-----------------|
| Wanda (Parker) | Read-only | Contextualizes research, daily reports |
| Vision (OpenClaw on Mac Mini) | Read-only | Personal assistant context |
| LobeChat coaches | Read-only + suggest | AI coaches with memory, can suggest additions |
| Infrastructure Claude | Write (via approval) | Maintains canonical content |
| Dev projects (DoughFlow, etc.) | Suggest only | Submit updates about themselves |
| Matt (human) | Approve | Reviews and approves suggestions |

---

## Architecture Decisions

### Submission Model: Inbox-Style

All projects submit suggestions to a central inbox. Matt reviews and approves via a web UI or conversational review. Approved content becomes canonical.

```
All Projects ──► Grist (inbox) ──► Approval UI ──► The Keep (canonical)
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    ▼                   ▼                   ▼
                              Markdown Export     BookStack API      Direct Read
                                    │                   │                   │
                                    ▼                   ▼                   ▼
                              Wanda/Vision      LobeChat Coaches    Cursor/Claude
```

### Storage: Grist + Presentation Layer

| Component | Tool | Purpose |
|-----------|------|---------|
| Inbox | Grist table (`Keep_Suggestions`) | Pending submissions |
| Changelog | Grist table (`Keep_ChangeLog`) | Audit trail |
| Canonical storage | BookStack OR Custom build | Structured presentation |
| AI-friendly export | Markdown files | Plain files for agents |

### Access Control: Isolation for Wanda/Vision

**Critical:** Wanda and Vision must NOT have NAS access. They consume via:
- Web interface (read-only)
- Markdown export synced TO their hosts (push, not pull)
- API queries (if BookStack)

They never mount NAS shares. This is a security boundary.

---

## Build vs Buy Analysis

### Evaluated Options

| Tool | Hierarchy | API | Approval Workflow | Verdict |
|------|-----------|-----|-------------------|---------|
| **BookStack** | Shelves→Books→Chapters→Pages | ✓ REST | ❌ None | Best match, need to add approval |
| **Silverbullet** | Flat (wiki-links) | ✓ HTTP | ❌ None | Good output, no structure |
| **Docmost** | Spaces→Nested Pages | ❌ None | ❌ None | No API = ruled out |
| **Outline** | Collections→Docs | ✓ REST | ❌ None | Complex deploy |
| **Wiki.js** | Folders→Pages | ✓ GraphQL | ❌ None | Heavy |
| **Joplin** | Notebooks→Notes | ✓ REST | ❌ None | Not web-native |
| **Custom build** | Whatever needed | ✓ Build it | ✓ Build it | Full control |

### Recommendation

**Hybrid approach:**
1. **Grist** for inbox and changelog (already exists)
2. **BookStack OR Custom UI** for presentation and browsing
3. **Custom approval UI** (needed regardless of storage choice)
4. **Markdown export** for AI agent consumption

Since the approval UI must be custom-built anyway, a lightweight custom build may be simpler than BookStack + custom approval on top.

---

## Ruled Out

| Option | Why Ruled Out |
|--------|---------------|
| "Gospel" as name | Settled on "The Keep" |
| "Librarian" as project name | Became agent name, then changed to "The Keeper" |
| Direct NAS access for Wanda/Vision | Security concern — they shouldn't touch NAS |
| PR-style GitHub workflow | Matt unfamiliar with PR/merge flow |
| Obsidian for this purpose | Confusing — Wanda/Vision have their own Obsidian vaults |
| Docmost | No API |
| Joplin | Not web-native, requires desktop app |
| Phase (secrets manager) | Session persistence issues with Claude Code |

---

## Requirements

### Must Have

- [ ] All projects can submit suggestions
- [ ] Review/approval workflow (web UI preferred)
- [ ] Changelog/audit trail
- [ ] Read-only access for consumers
- [ ] Web-based consumption
- [ ] Self-hosted
- [ ] Markdown-friendly output for AI agents
- [ ] Structured hierarchy (projects, tech stack, decisions as categories)

### Should Have

- [ ] LobeChat knowledge base integration
- [ ] Oscar hook to surface pending suggestions
- [ ] n8n workflow for sync/notifications

### Nice to Have

- [ ] Local LLM (Jarvis) powering approval UI
- [ ] Search across canonical content

---

## Components

| Component | Type | Purpose | Icon |
|-----------|------|---------|------|
| The Keep | Project | The system, repo, data | — |
| The Keeper | Agent | Orchestrates The Keep | 📚 or 🗝️ (TBD) |
| Keep_Suggestions | Grist table | Inbox for pending submissions | — |
| Keep_ChangeLog | Grist table | Audit trail | — |
| Approval UI | Web app | Process inbox items | — |
| Presentation layer | BookStack or custom | Browse canonical content | — |
| Markdown export | Files | AI agent consumption | — |

---

## Integration Points

### LobeChat (Already Deployed)

- **URL:** https://lobechat.nextlevelguild.com
- **Host:** Helicarrier (10.0.0.27:2765)
- **Features:** Knowledge base, database version, LiteLLM proxy
- **Integration:** LobeChat coaches read from The Keep, submit suggestions to inbox

### Grist (Already Deployed)

- **URL:** https://grist.ucontrolnetwork.com
- **Doc ID:** uNZG8PhepVScStYXVQKfR3
- **New tables needed:** `Keep_Suggestions`, `Keep_ChangeLog`

### Oscar (Infrastructure Agent)

- **Hook:** At session start, check Keep inbox: "You have 3 Keep suggestions pending"
- **Gate:** After Infrastructure deployments, prompt to update The Keep

---

## Open Questions

1. **BookStack vs Custom Build?**
   - If custom: simpler, integrated, exactly what's needed
   - If BookStack: battle-tested, but approval UI still custom

2. **Project location: Friday or Stark?**
   - Friday (10.0.0.35) = automation, where Claude Code runs
   - Stark (10.0.0.31) = dev workstation, where projects live
   - **If custom development:** Stark makes sense (with other dev projects)
   - **If mostly orchestration:** Friday makes sense (with Infrastructure)

3. **The Keeper icon:** 📚 (librarian vibe) or 🗝️ (keeper of keys)?

4. **Grist table schema:** What fields for Keep_Suggestions and Keep_ChangeLog?

---

## Suggested Next Steps

1. **Decide project location** — Stark (dev) or Friday (automation)
2. **Create project structure** — `~/Keep/` or `~/Dev/Keep/`
3. **Create Grist tables** — Keep_Suggestions, Keep_ChangeLog
4. **Prototype approval UI** — Simple web form to process inbox
5. **Decide storage** — BookStack deploy vs custom markdown viewer
6. **Run BMAD workflow** — Formalize into full PRD in The Keep project

---

## Conversation Context

This handoff was generated from a brainstorming session in Infrastructure on 2026-03-18. The session covered:
- Naming exploration (Curator, Librarian, Gospel, Chronicle → The Keep)
- Architecture options (Grist-centric, markdown-native, hybrid)
- Build vs buy analysis (BookStack, Silverbullet, Docmost, Joplin, etc.)
- Security requirements (Wanda/Vision isolation)
- LobeChat integration requirements
- Changelog requirements

**Source:** Infrastructure project, ad-hoc conversation
**Handoff to:** The Keep project (to be created)
