# Spike 001: AFFiNE + Dify Architecture Evaluation

**Created:** 2026-03-21
**Status:** In Progress
**Decision:** Pending

---

## Spike Objective

Evaluate whether AFFiNE (frontend) + Dify (backend) can meet The Keep's requirements, or if a custom solution is needed.

## The Keep Vision

Matt's vision for The Keep is a **"web-based Cursor with Claude Code"** for knowledge management:

### Primary Use Case (70%)
- File browser with visualizations
- AI conversation WITH the files (side-by-side view)
- Edit files directly in the interface
- Two-tier document system: Summaries + Source originals
- Multi-project isolation (HOA, Health, Work)
- Multi-user access

### Secondary Use Case (30%)
- Automated workflows (inbox processing, lab result ingestion)
- Structured data extraction and processing
- Summarization pipelines
- Data cleanup and categorization

## Key Requirements

| Requirement | Priority | Description |
|-------------|----------|-------------|
| File + Chat Together | Critical | Files visible alongside conversation, not separate |
| Edit Files in UI | Critical | Direct editing, not just upload |
| RAG Conversations | Critical | Chat about file contents with context |
| Multi-workspace | High | Separate projects with isolation |
| Custom LLM (LiteLLM) | High | Use local Jarvis models via LiteLLM |
| Workflow Automation | Medium | Process incoming documents automatically |
| Structured Data | Medium | Track things like lab results over time |

## Architecture Under Test

```
┌─────────────────────────────────────────────────────────────┐
│                    THE KEEP ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              AFFiNE (PRIMARY UI)                     │   │
│   │  • File browser + editor                            │   │
│   │  • AI copilot (uses LiteLLM)                        │   │
│   │  • Summaries + source docs                          │   │
│   │  • Multi-workspace = multi-project                  │   │
│   │  Port: 5013                                         │   │
│   │  Domain: keep-docs.nextlevelguild.com               │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                     webhook/API                              │
│                            ▼                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Dify (BACKEND WORKFLOWS)                │   │
│   │  • Lab result ingestion pipeline                    │   │
│   │  • Document summarization                           │   │
│   │  • Structured data extraction                       │   │
│   │  • RAG indexing for deep search                     │   │
│   │  Port: 5012                                         │   │
│   │  Domain: keep-dify.nextlevelguild.com               │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│   │   LiteLLM     │  │     Grist     │  │      n8n      │   │
│   │  Port 2764    │  │ (structured)  │  │  Port 2750    │   │
│   └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Deployed Services

| Service | Host | Port | Domain (Pending) | Status |
|---------|------|------|------------------|--------|
| AFFiNE | Banner | 5013 | keep-docs.nextlevelguild.com | Running, needs setup |
| Dify | Banner | 5012 | keep-dify.nextlevelguild.com | Running, configured |
| LobeChat | Banner | 5011 | keep-chat.nextlevelguild.com | Running (backup option) |
| LiteLLM | Jarvis | 2764 | llm.nextlevelguild.com | Running |
| n8n | Jarvis | 2750 | n8n.nextlevelguild.com | Running |

## Test Plan

### Test 1: AFFiNE as Primary UI
- [ ] Complete admin setup
- [ ] Configure AI copilot with LiteLLM
- [ ] Create and edit documents
- [ ] Test AI chat about document content
- [ ] Evaluate if chat + files are side-by-side
- [ ] Test multi-workspace support
- [ ] UX assessment: Is this good enough?

### Test 2: Dify as Backend
- [ ] Connect LiteLLM as model provider
- [ ] Create knowledge base
- [ ] Build summarization workflow
- [ ] Test API access
- [ ] Verify document processing works

### Test 3: Integration
- [ ] Can AFFiNE trigger Dify workflows?
- [ ] Can we bridge via n8n?
- [ ] Is the integration clean or hacky?

## Decision Criteria

| Outcome | Criteria |
|---------|----------|
| **GO** | AFFiNE + Dify meets 70%+ of vision |
| **PIVOT** | Need custom frontend, keep Dify backend |
| **NO-GO** | Need full custom build |

## LiteLLM Configuration

```
Endpoint: http://10.0.0.27:2764/v1
API Key: sk-4r10-PRI0MrnIccaOFyFfQ
Models:
  - jarvis-chat (fast, 14B)
  - jarvis-qwen72b (quality, 72B)
```

## Files in This Spike

```
docs/spikes/001-affine-dify-evaluation/
├── README.md           # This file
├── PLAN.md             # Detailed execution plan
├── ARCHITECTURE.md     # Technical architecture
├── TEST-RESULTS.md     # Test outcomes
└── DECISION.md         # Final GO/NO-GO decision
```

## Related Documents

- [SPIKE-TASKS.md](/SPIKE-TASKS.md) - Overall project task tracking
- [deployment/SERVICES.md](/deployment/SERVICES.md) - Service inventory
- [deployment/HANDOFF-INFRASTRUCTURE.md](/deployment/HANDOFF-INFRASTRUCTURE.md) - Traefik request
