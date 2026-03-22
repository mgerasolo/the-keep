# Infrastructure Handoff: The Keep Services

**From:** The Keep (the-keep)
**To:** Infrastructure (nlf-infrastructure)
**Priority:** Medium
**Created:** 2026-03-19
**Status:** Pending

---

## Summary

The Keep services have been deployed on Banner and need Traefik routing configured.

## Deployed Services on Banner (10.0.0.33)

| Service | Port | Container | Description |
|---------|------|-----------|-------------|
| **LobeChat** | 5011 | the-keep-lobechat | AI chat (full server mode with PostgreSQL) |
| **Dify** | 5012 | the-keep-dify-nginx | Workflow engine + RAG + multi-tenant |
| **AFFiNE** | 5013 | the-keep-affine | Docs + whiteboard + AI |
| **RustFS S3** | 5014 | the-keep-lobechat-s3 | Object storage for LobeChat |
| **RustFS Console** | 5015 | the-keep-lobechat-s3 | S3 admin console |

## Requested Traefik Routes

| Domain | Target | Notes |
|--------|--------|-------|
| `keep-chat.nextlevelguild.com` | 10.0.0.33:5011 | LobeChat AI interface |
| `keep-dify.nextlevelguild.com` | 10.0.0.33:5012 | Dify workflows |
| `keep-docs.nextlevelguild.com` | 10.0.0.33:5013 | AFFiNE docs |

Alternative domain pattern:
- `the-keep.nextlevelguild.com` → LobeChat (main interface)
- `dify.the-keep.nextlevelguild.com` → Dify
- `docs.the-keep.nextlevelguild.com` → AFFiNE

## LLM Integration

All services route through LiteLLM:
- **Endpoint:** http://10.0.0.27:2764/v1
- **Team Key:** (configured in LobeChat settings)

## Container Status

```
the-keep-lobechat           Up (5011)
the-keep-lobechat-db        Up (healthy)
the-keep-lobechat-redis     Up (healthy)
the-keep-lobechat-s3        Up (5014, 5015)
the-keep-dify-nginx         Up (5012)
the-keep-dify-web           Up
the-keep-dify-api           Up
the-keep-dify-worker        Up
the-keep-dify-db            Up (healthy)
the-keep-dify-redis         Up (healthy)
the-keep-dify-weaviate      Up
the-keep-affine             Up (5013)
the-keep-affine-db          Up (healthy)
the-keep-affine-redis       Up (healthy)
```

## Actions Needed

1. [ ] Add Traefik dynamic config for the three domains
2. [ ] Configure SSL certificates (Let's Encrypt)
3. [ ] Add to DNS (Cloudflare or internal)
4. [ ] Update DEPLOYMENTS registry
5. [ ] Add to Grist Projects table

## Grist Registration Data

```
Project ID: the-keep
Name: The Keep
Host: Banner (10.0.0.33)
Port Block: 5010-5019
Services: LobeChat, Dify, AFFiNE
Status: Development
Primary Domain: the-keep.nextlevelguild.com
```
