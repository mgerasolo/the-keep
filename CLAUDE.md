# CLAUDE.md

This file provides guidance to Claude Code when working with the the-keep codebase.

## Overview

Application description here.

**Target Environment:** Banner (10.0.0.33)
**Port Block:** 5010-5019 (web=5010)
**Domain:** the-keep.nextlevelguild.com

## Critical Rules

**Container Deployment:**
- **NEVER deploy containers to Stark or localhost** - Stark is a coding workstation only
- **Development containers → Banner (10.0.0.33)**
- **Production containers → Hulk (10.0.0.32)**
- This project targets: **Banner**

**URLs - Never localhost:**
- **NEVER use localhost or 127.0.0.1** - containers run on remote VMs
- **Preferred:** Fully qualified domain (requires Traefik setup)
- **Acceptable:** VM IP with port (e.g., `http://10.0.0.33:5010`)

```bash
# BEST - domain via Traefik
https://the-keep.nextlevelguild.com

# OK - direct IP to container host
http://10.0.0.33:5010

# WRONG - will not work (container not on your machine)
http://localhost:3352
http://127.0.0.1:3352
```

**Domain/Traefik Setup:**
- Traefik config: `~/Infrastructure/stacks/traefik/`
- Domain registry: `~/Infrastructure/DEPLOYMENTS.md`
- Standards: `/mnt/foundry_resources/standards-shared/`

**SSH Access:**
- **ALWAYS use hostname, NEVER use IP address**
- SSH config handles port/user/key automatically

```bash
# CORRECT
ssh banner

# WRONG - will fail
ssh 10.0.0.33
```

## Technology Stack

> **Decide per-project.** Update this table once you choose your stack.

| Purpose | Tool |
|---------|------|
| Frontend | TBD |
| Backend | TBD |
| Database | TBD |

## Available Infrastructure Services

| Service | Endpoint / Location | Purpose |
|---------|---------------------|---------|
| Traefik | `~/Infrastructure/stacks/traefik/` | Reverse proxy, SSL, domain routing |
| Authentik | `auth.nextlevelfoundry.com` | SSO, OAuth, user management |
| LiteLLM | `http://10.0.0.27:2764` | AI model proxy (OpenAI, Anthropic, Ollama, etc.) |
| Loki + Grafana | Coulson (10.0.0.28) | Structured logging |
| Prometheus + Grafana | Coulson (10.0.0.28) | Metrics and alerting |
| PostgreSQL | Per-service (bundled in stack) | Relational database |
| Redis | Per-service (bundled in stack) | Caching, queues |
| MinIO | Helicarrier | S3-compatible object storage |
| n8n | `http://10.0.0.27:2750` | Workflow automation, webhooks |
| Image Generation | `http://10.0.0.27:2750/webhook/generate-image` | AI image generation (Gemini, DALL-E, Flux) |
| Secrets (.env) | `/mnt/foundry_devlab/secrets/env/` | Secrets management |
| SMTP | Via AppServices config | Transactional email |

## Key Directories

```
the-keep/
├── .claude/                    # Baton context management
│   ├── CONVERSATION_HISTORY.md # All conversations TLDR
│   ├── BUGS.md                 # Discovered bugs (tagged by conv-id)
│   ├── DECISIONS.md            # Architecture decisions (tagged by conv-id)
│   └── conversations/          # Per-conversation summaries
├── .github/
│   └── ISSUE_TEMPLATE/         # GitHub issue templates
├── src/                        # Application source code
├── docs/                       # Documentation
└── scripts/                    # Utility scripts
```

## Common Commands

```bash
# Secrets (from Infrastructure)
source ~/Infrastructure/scripts/secrets.sh
appservices_get SECRET_KEY       # Shared platform secrets
ai_apps_get OPENAI_API_KEY      # AI service API keys

# Deployment (when ready)
# Use /deployment banner the-keep
```

## Claude Code Telemetry

Usage metrics are tracked via OpenTelemetry to Coulson's monitoring stack.

```bash
# Set project name for this session (auto-detects from git)
claude-telemetry-project

# Or set explicitly
claude-telemetry-project the-keep
```

Dashboard: https://grafana.ucontrolnetwork.com/d/claude-code-working

## Context Management (Baton Protocol)

This project uses structured context management for multi-conversation workflows.

### On Session Start
1. Check `.claude/CURRENT_CONVERSATION_ID`
2. Read `.claude/CONVERSATION_HISTORY.md` for overview
3. Read `.claude/conversations/{conv-id}/SUMMARY.md` for current work

### During Work
- Update SUMMARY.md after significant actions
- Append to BUGS.md when discovering bugs (tag with conv-id)
- Append to DECISIONS.md for architecture decisions (tag with conv-id)

### After Compaction
- IMMEDIATELY read CONVERSATION_HISTORY.md
- Read your conversation's SUMMARY.md
- Resume work with context restored

## Standardized Response Format

**MANDATORY:** All responses must use this format:

```markdown
**Title:**
- [Conversation title, max 60 chars]

**Request:**
- [Up to 120 char summary of request]

**Tasks:**
- ✅ [Owner] [Details...] Completed task
- ⬜ [Owner] [Status] [Details...] Pending task

**Summary:**
- Portfolio manager perspective: features, branding, cost, big picture
- Avoid deep technical specifics

**Next:**
- [Next immediate action or "None"]

**USER ACTION NEEDED:**
- [Actions requiring human decision]

**Context:**
- XX% used, YY% remaining
```

**Emoji Legend:**
- **Owner:** 🤖 Claude | 👨‍🔧 Human | 👤 Other
- **Status:** ⏳ Waiting | 🛑 Blocked | 🏳️ Ready | 💬 Discuss
- **Details:** 🔸 Required | 🔹 Optional | ⚠️ Concern | ∥ Parallel

## GitHub Integration

**Repository:** https://github.com/mgerasolo/the-keep
**Project Board:** https://github.com/users/mgerasolo/projects/X

**Label Taxonomy:**
| Category | Labels |
|----------|--------|
| Type | `type:bug`, `type:feature`, `type:enhancement`, `type:docs` |
| Priority | `priority:critical`, `priority:high`, `priority:medium`, `priority:low` |
| Area | `area:ui`, `area:api`, `area:database`, `area:auth` |
| Status | `status:active`, `status:soon`, `status:blocked`, `status:pending-approval`, `status:ai-ready` |

**At session start:** Check for `status:ai-ready` issues (pre-approved for autonomous work)

## Project Identity

**Project ID:** the-keep

This ID is used for AI Handoffs and Grist tracking. See Grist Projects table.

## AI Handoffs

At session start, check for incoming handoffs:
```bash
/mnt/foundry_devlab/scripts/handoffs.sh inbox
```

To request work from another project:
```bash
/mnt/foundry_devlab/scripts/handoffs.sh send infrastructure "Request title" --priority medium
```

## Shared Resources (foundry_devlab)

Mount: `/mnt/foundry_devlab/` (available on Stark)

| Path | Purpose |
|------|---------|
| `services/catalog.md` | Available infrastructure services |
| `services/*.md` | Service integration docs |
| `secrets/env/` | Shared .env files |
| `scripts/` | Shared automation scripts |
| `standards-dev/` | Development standards |
| `assets/` | Icons, UI kits, design assets |

## Cross-Project Coordination

**Dependencies:**
- Infrastructure (nlf-infrastructure) - Deployment, secrets, monitoring

**Before breaking changes:**
1. Check dependent projects
2. Create issue with `breaking:next-release` label
3. Notify Infrastructure project via handoff

## Security Notes

- Never commit secrets or API keys
- Use .env files from `/mnt/foundry_devlab/secrets/env/`
- All external API calls must go through authenticated endpoints

## Related Documentation

- Infrastructure: `~/Infrastructure/CLAUDE.md`
- Shared Standards: `/mnt/foundry_resources/standards-shared/`
- Service Catalog: `/mnt/foundry_devlab/services/catalog.md`
- Protocols: `/mnt/foundry_resources/protocols/`
