# The Keep - Spike Task List

**Project:** The Keep - Personal AI Knowledge Management System
**Started:** 2026-03-18
**Last Updated:** 2026-03-19

---

## Architecture Decision

**Chosen Stack:**
- **Chat UI:** LobeChat (full server mode)
- **Workflows/RAG:** Dify (multi-tenant workspaces)
- **Docs/Whiteboard:** AFFiNE
- **LLM Proxy:** LiteLLM (existing at 10.0.0.27:2764)
- **Automation:** n8n (existing at 10.0.0.27:2750)

**Target Host:** Banner (10.0.0.33)
**Port Block:** 5010-5019

---

## Completed Tasks

### Infrastructure

| Task | Completed | Notes |
|------|-----------|-------|
| Archive v1 Next.js implementation | 2026-03-18 | Moved to `_archived/`, added to `.claudeignore` |
| Deploy LobeChat (full server) | 2026-03-19 | Port 5011, PostgreSQL + Redis + RustFS |
| Deploy Dify | 2026-03-19 | Port 5012, PostgreSQL + Redis + Weaviate |
| Deploy AFFiNE | 2026-03-19 | Port 5013, PostgreSQL + Redis |
| Deploy RustFS (S3 storage) | 2026-03-19 | Port 5014 (API), 5015 (console) |
| Create deployment manifest | 2026-03-19 | `deployment/SERVICES.md` |
| Create infrastructure handoff | 2026-03-19 | `deployment/HANDOFF-INFRASTRUCTURE.md` |

### Configuration

| Task | Completed | Notes |
|------|-----------|-------|
| Configure LiteLLM proxy in LobeChat | 2026-03-19 | Endpoint: http://10.0.0.27:2764/v1 |
| Enable Jarvis models in LobeChat | 2026-03-19 | jarvis-chat, jarvis-qwen72b |
| Set Agent Service defaults | 2026-03-19 | Local models for background tasks |
| Fix LobeChat secrets (KEY_VAULTS) | 2026-03-19 | Regenerated proper base64 secrets |

### Research & Documentation

| Task | Completed | Notes |
|------|-----------|-------|
| Research multi-tenancy options | 2026-03-18 | Dify won for workspace isolation |
| Research PKM + AI platforms | 2026-03-18 | 14 platforms evaluated |
| Research Dify marketplace plugins | 2026-03-19 | ComfyUI, CometAPI, OpenRouter found |
| Find existing n8n workflows | 2026-03-19 | 13+ workflows documented |
| Document image/video setup | 2026-03-19 | `deployment/dify/IMAGE-VIDEO-SETUP.md` |
| Document n8n workflows | 2026-03-19 | `deployment/n8n/EXISTING-WORKFLOWS.md` |
| Create tool definitions (backup) | 2026-03-19 | `deployment/dify/tools/*.yaml` |
| Create workflow definitions (backup) | 2026-03-19 | `deployment/dify/workflows/*.yml` |

---

## Pending Tasks

### High Priority - Core Functionality

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Configure Traefik routing | ⬜ Pending | Infrastructure | Domains: keep-chat, keep-dify, keep-docs |
| Set up DNS records | ⬜ Pending | Infrastructure | Cloudflare or internal DNS |
| Create Dify workspaces | ⬜ Pending | User | HOA (shared), Health (private), Work (shared) |
| Test multi-tenant isolation | ⬜ Pending | Claude | Verify users only see invited workspaces |
| Sign up for LiteLLM team | ⬜ Pending | User | Get API key for The Keep |

### Medium Priority - Image/Video Generation

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Add Nano Banana to LiteLLM | 🔄 In Progress | Other conversation | gemini-2.5-flash-image |
| Add Veo to LiteLLM | 🔄 In Progress | Other conversation | veo-3.1 |
| Import n8n Flux workflow | ⬜ Pending | User | n8n #2417 (free, Hugging Face) |
| Import n8n Gemini workflow | ⬜ Pending | User | n8n #5626 (uses LiteLLM) |
| Import n8n Luma video workflow | ⬜ Pending | User | n8n #3200 (Luma + Airtable) |
| Install Dify ComfyUI plugin | ⬜ Pending | User | For local generation on Jarvis |
| Sign up for image/video APIs | ⬜ Pending | User | LegNext, Replicate, Runway, Luma |
| Test image generation | ⬜ Pending | Claude | End-to-end test |
| Test video generation | ⬜ Pending | Claude | End-to-end test |

### Medium Priority - Integration

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Connect LobeChat to Dify | ⬜ Pending | Claude | MCP or API integration |
| Set up Dify as MCP server | ⬜ Pending | Claude | For LobeChat to call workflows |
| Decide on file management | ⬜ Pending | User | AFFiNE vs Outline vs custom |
| Create inbox capture workflow | ⬜ Pending | Claude | n8n workflow for file ingestion |
| Connect inbox to Dify knowledge base | ⬜ Pending | Claude | Auto-index uploaded files |

### Low Priority - Polish

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Add to Grist Projects table | ⬜ Pending | Infrastructure | Project tracking |
| Create custom LobeChat agents | ⬜ Pending | User | "Keeper" persona for each workspace |
| Set up monitoring | ⬜ Pending | Infrastructure | Prometheus/Grafana dashboards |
| Document final architecture | ⬜ Pending | Claude | Update CLAUDE.md, create README |
| Create user onboarding guide | ⬜ Pending | Claude | How to use The Keep |

---

## Blocked Tasks

| Task | Blocked By | Notes |
|------|------------|-------|
| Test Traefik domains | DNS setup | Need infrastructure to complete routing |
| Production deployment | Testing complete | Move to Hulk after validation |

---

## Decisions Made

| Decision | Date | Rationale |
|----------|------|-----------|
| Use Dify for multi-tenancy | 2026-03-18 | Only platform that passed HOA/Health/Work isolation test |
| Use LobeChat for chat UI | 2026-03-18 | Best UX, LiteLLM compatible |
| Use AFFiNE for docs | 2026-03-18 | All-in-one docs + whiteboard + AI |
| Prefer n8n existing workflows | 2026-03-19 | Battle-tested > custom build |
| Use LegNext for Midjourney | 2026-03-19 | GoAPI/PiAPI discontinued |
| Local models for agent tasks | 2026-03-19 | jarvis-chat for free background ops |
| jarvis-qwen72b for compression | 2026-03-19 | Better summarization than 14B |

---

## Files Created This Spike

```
the-keep/
├── deployment/
│   ├── SERVICES.md                    # Service inventory
│   ├── HANDOFF-INFRASTRUCTURE.md      # Traefik request
│   ├── lobechat-full/
│   │   ├── docker-compose.yml
│   │   └── .env
│   ├── dify/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   ├── IMAGE-VIDEO-SETUP.md       # Setup guide
│   │   ├── tools/
│   │   │   ├── midjourney-legnext.yaml
│   │   │   └── image-video-providers.yaml
│   │   └── workflows/
│   │       ├── image-generator.yml
│   │       └── video-generator.yml
│   ├── affine/
│   │   ├── docker-compose.yml
│   │   └── .env
│   └── n8n/
│       └── EXISTING-WORKFLOWS.md      # 13+ community workflows
├── docs/
│   ├── THE-KEEP-V2-PLAN.md
│   ├── LOBECHAT-CONFIGURATION-PLAN.md
│   ├── research/
│   │   ├── mcp-inbox-server-architecture.md
│   │   └── PKM-AI-TOOLS-RESEARCH.md
│   └── analysis/
│       └── AI-PLATFORM-MULTI-TENANCY-ANALYSIS.md
├── _archived/                          # v1 Next.js implementation
├── .claudeignore                       # Ignores archived code
└── SPIKE-TASKS.md                      # This file
```

---

## Service URLs

| Service | Internal URL | Domain (Pending) |
|---------|--------------|------------------|
| LobeChat | http://10.0.0.33:5011 | keep-chat.nextlevelguild.com |
| Dify | http://10.0.0.33:5012 | keep-dify.nextlevelguild.com |
| AFFiNE | http://10.0.0.33:5013 | keep-docs.nextlevelguild.com |
| RustFS S3 | http://10.0.0.33:5014 | (internal only) |
| RustFS Console | http://10.0.0.33:5015 | (internal only) |
| LiteLLM | http://10.0.0.27:2764 | llm.nextlevelguild.com |
| n8n | http://10.0.0.27:2750 | n8n.nextlevelguild.com |

---

## Next Session Priorities

1. **Verify Traefik routing** (after infrastructure completes handoff)
2. **Create Dify workspaces** and test multi-tenant isolation
3. **Import at least one n8n image workflow** and test end-to-end
4. **Connect LobeChat to Dify** for RAG queries

---

## Notes

- LiteLLM model additions (Nano Banana, Veo) handled in separate conversation
- Grist API key appears invalid - may need refresh
- GoAPI and PiAPI both discontinued Midjourney - LegNext is current option
- Consider ComfyUI on Jarvis for free local image generation
