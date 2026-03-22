# The Keep - Deployed Services

Last updated: 2026-03-19

## Service Inventory

| Service | Host | Port | URL | Status |
|---------|------|------|-----|--------|
| **LobeChat** (Full) | Banner | 5011 | http://10.0.0.33:5011 | Running |
| **Dify** | Banner | 5012 | http://10.0.0.33:5012 | Running |
| **AFFiNE** | Banner | 5013 | http://10.0.0.33:5013 | Running |
| **RustFS** (S3) | Banner | 5014/5015 | http://10.0.0.33:5014 | Running |

## Port Allocation (5010-5019)

| Port | Service | Notes |
|------|---------|-------|
| 5010 | the-keep (v1) | Original Next.js build (archived) |
| 5011 | LobeChat | Full server mode with PostgreSQL |
| 5012 | Dify | Workflow engine, RAG |
| 5013 | AFFiNE | Docs + whiteboard + AI |
| 5014 | RustFS S3 | Object storage for LobeChat |
| 5015 | RustFS Console | S3 admin console |
| 5016-5019 | Reserved | Future expansion |

## Stack Details

### LobeChat (5011)
- **Purpose:** AI chat interface
- **Backend:** PostgreSQL, Redis, RustFS (S3)
- **LLM:** LiteLLM proxy (http://10.0.0.27:2764/v1)
- **Compose:** `deployment/lobechat-full/docker-compose.yml`

### Dify (5012)
- **Purpose:** Workflow engine, RAG, multi-tenant workspaces
- **Backend:** PostgreSQL, Redis, Weaviate
- **Compose:** `deployment/dify/docker-compose.yml`
- **Workspaces:**
  - HOA (shared with board members)
  - Health (private)
  - Work (shared with coworkers)

### AFFiNE (5013)
- **Purpose:** All-in-one docs, whiteboard, AI
- **Backend:** PostgreSQL, Redis
- **Compose:** `deployment/affine/docker-compose.yml`

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
├─────────────────────────────────────────────────────────┤
│  LobeChat (:5011)    │  AFFiNE (:5013)                  │
│  AI Chat             │  Docs + Whiteboard               │
└──────────┬───────────┴────────────┬─────────────────────┘
           │                        │
           │ API/MCP                │ (future MCP)
           ▼                        │
┌──────────────────────────────────────────────────────────┐
│                      DIFY (:5012)                         │
│         Workflows, RAG, Multi-tenant Isolation            │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  LiteLLM (10.0.0.27:2764)  │  n8n (10.0.0.27:2750)       │
│  Model Proxy               │  Inbox Automation           │
└──────────────────────────────────────────────────────────┘
```

## Grist Registration

**Project ID:** the-keep
**Add to Grist Projects table:**
- Name: The Keep
- Host: Banner (10.0.0.33)
- Ports: 5010-5019
- Services: LobeChat, Dify, AFFiNE
- Status: Development
- Domain: the-keep.nextlevelguild.com (pending Traefik)
