# The Keep v2 - Modified Plan

**Date:** 2026-03-18
**Status:** Proposed
**Approach:** LobeChat-based with custom Inbox MCP Server

---

## Executive Summary

**Original approach:** Build a Next.js knowledge management app from scratch (16-24 weeks)

**New approach:** Leverage existing LobeChat deployment + build custom Inbox MCP server (4-6 weeks)

### What We Already Have (80%)

| Component | Tool | Status |
|-----------|------|--------|
| AI Chat Interface | LobeChat | Deployed at chat.nextlevelfoundry.com |
| Knowledge Base (RAG) | LobeChat built-in | Ready to configure |
| File Management | LobeChat built-in | Ready to configure |
| Multi-model Support | LiteLLM | Deployed at 10.0.0.27:2764 |
| Workflow Automation | n8n | Deployed at n8n.nextlevelguild.com |
| Vault Storage | Obsidian MCP | Available in marketplace |

### What We're Building (20%)

| Component | Tool | Effort |
|-----------|------|--------|
| Inbox MCP Server | Custom TypeScript | 2-3 weeks |
| n8n Processing Workflows | n8n | 1 week |
| LobeChat Configuration | Config only | 2-3 days |

---

## Architecture

```
+------------------+     +------------------+     +------------------+
|   CAPTURE        |     |   PROCESS        |     |   STORE          |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| - Paste URL      |     | - AI Summarize   |     | - Markdown Vault |
| - Drop file      |     | - Extract key    |     | - LobeChat KB    |
| - Email forward  |     |   points         |     | - Tagged/linked  |
| - RSS feed       |     | - Auto-tag       |     |                  |
|                  |     | - Suggest folder |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        ^
         v                        v                        |
+------------------+     +------------------+     +------------------+
|  Inbox MCP       |---->|  n8n Workflow    |---->|  Obsidian MCP    |
|  Server          |     |  (LiteLLM)       |     |  Server          |
+------------------+     +------------------+     +------------------+
         ^                                                 |
         |                                                 |
         +-------------------------------------------------+
                              LobeChat
                        (chat.nextlevelfoundry.com)
```

---

## Component Details

### 1. LobeChat (Existing)

**URL:** https://chat.nextlevelfoundry.com
**Containers:** lobechat-app, lobechat-postgres, lobechat-minio

**Configuration needed:**
- Enable Knowledge Base feature
- Configure S3/MinIO for file storage
- Add MCP servers (Inbox + Obsidian)
- Create "Keeper" agent with vault context

### 2. Inbox MCP Server (Build)

Custom MCP server providing 6 tools:

| Tool | Purpose |
|------|---------|
| `inbox_capture_url` | Scrape URL, extract content, queue |
| `inbox_upload_content` | Accept text/markdown directly |
| `inbox_list_queue` | View pending items |
| `inbox_process_item` | Trigger AI processing |
| `inbox_search_vault` | Search existing notes |
| `inbox_save_to_vault` | Write to markdown vault |

**Tech Stack:**
- TypeScript + MCP SDK
- SQLite for queue state
- Express for SSE transport
- Docker deployment to Banner

**Port:** 5015
**Domain:** inbox-mcp.nextlevelguild.com (via Traefik)

### 3. n8n Workflows (Build)

| Workflow | Trigger | Action |
|----------|---------|--------|
| `inbox-process` | Webhook from MCP | AI summarize via LiteLLM, save to vault |
| `inbox-rss` | Scheduled (hourly) | Check RSS feeds, add to inbox |
| `inbox-email` | IMAP trigger | Parse forwarded emails, add to inbox |
| `inbox-notify` | Webhook | Send ntfy/Slack notification |

### 4. Obsidian MCP Server (Marketplace)

Use existing [Claudesidian MCP](https://lobehub.com/mcp/profsynapse-claudesidian-mcp) or similar:
- Read/write notes
- Search vault
- Manage folders
- Discover links

### 5. Keeper Agent (Configure)

LobeChat agent with:
- System prompt: "You are the Keeper, a vault librarian..."
- Knowledge base: Connected to vault folder
- Tools: Inbox MCP + Obsidian MCP
- Memory: Enabled for personalization
- Scheduled task: "Daily digest of new items"

---

## Implementation Phases

### Phase 1: LobeChat Configuration (2-3 days)
- [ ] Configure MinIO S3 for file storage
- [ ] Enable Knowledge Base feature
- [ ] Test file upload and RAG search
- [ ] Install Obsidian MCP from marketplace
- [ ] Connect to test vault folder

### Phase 2: Inbox MCP Server Core (1 week)
- [ ] Project scaffold with TypeScript + MCP SDK
- [ ] SQLite database setup
- [ ] HTTP/SSE transport for LobeChat
- [ ] `inbox_capture_url` with cheerio scraping
- [ ] `inbox_list_queue` and `inbox_save_to_vault`
- [ ] Docker deployment to Banner
- [ ] Register in LobeChat

### Phase 3: n8n Integration (1 week)
- [ ] `inbox-process` workflow (webhook → LiteLLM → vault)
- [ ] `inbox_process_item` tool calls n8n webhook
- [ ] Error handling and retry logic
- [ ] Processing status updates

### Phase 4: Keeper Agent (2-3 days)
- [ ] Create agent with system prompt
- [ ] Connect to knowledge base
- [ ] Enable Inbox + Obsidian tools
- [ ] Configure memory system
- [ ] Test end-to-end workflow

### Phase 5: Extended Capture (1 week)
- [ ] RSS feed ingestion (n8n scheduled)
- [ ] Email forwarding (n8n IMAP)
- [ ] Browser extension (optional)
- [ ] Notifications via ntfy

---

## Timeline Comparison

| Approach | Effort | Time to MVP |
|----------|--------|-------------|
| **Scratch build (v1)** | High | 16-24 weeks |
| **Fork Khoj** | Medium | 7-11 weeks |
| **LobeChat + Inbox MCP (v2)** | Low | 4-6 weeks |

**v2 wins** because:
- Chat + KB + file management already built
- n8n handles complex automation
- Only building the unique "inbox" layer
- Leverages existing deployments

---

## File Structure

```
the-keep/
├── _archived/              # v1 Next.js build (ignored)
├── docs/
│   ├── research/           # Platform analysis
│   └── THE-KEEP-V2-PLAN.md # This file
├── inbox-mcp-server/       # Custom MCP server
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml
├── n8n-workflows/          # Exported workflow JSON
├── lobechat-config/        # Agent configs, MCP settings
└── vault/                  # Test markdown vault
```

---

## Dependencies

| Service | Location | Purpose |
|---------|----------|---------|
| LobeChat | Banner (existing) | Core chat + KB |
| LiteLLM | 10.0.0.27:2764 | AI model proxy |
| n8n | 10.0.0.27:2750 | Workflow automation |
| PostgreSQL | Banner (lobechat-postgres) | LobeChat database |
| MinIO | Banner (lobechat-minio) | File storage |
| Traefik | Hulk | Reverse proxy |

---

## Success Criteria

1. **Capture:** Paste URL in LobeChat → content extracted and queued
2. **Process:** Agent summarizes and suggests tags/folder
3. **Store:** One-click save to vault with proper metadata
4. **Search:** Ask Keeper "what did I save about X?" → finds it
5. **Automation:** RSS/email automatically appears in inbox

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| MCP SSE transport issues | Test early, fall back to stdio with bridge |
| LobeChat update breaks config | Pin version, test before updating |
| n8n webhook reliability | Add retry logic, error notifications |
| Vault sync conflicts | Use atomic writes, timestamp-based naming |

---

## Next Steps

1. **Approve this plan** - Confirm pivot to v2 approach
2. **Configure LobeChat** - Enable KB, add MCP servers
3. **Scaffold Inbox MCP** - Create project, implement core tools
4. **Build n8n workflows** - Processing pipeline
5. **Create Keeper agent** - System prompt, tool connections

---

## References

- [LobeChat Deep Dive](./research/lobechat-deep-dive.md)
- [MCP Inbox Server Architecture](./research/mcp-inbox-server-architecture.md)
- [Platform Analysis](./research/platform-analysis-2026-03-18.md)
- [Lobe UI Research](./research/lobe-ui-research.md)
