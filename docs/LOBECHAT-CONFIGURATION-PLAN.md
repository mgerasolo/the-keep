# LobeChat Configuration Plan for The Keep

**Goal:** Transform existing LobeChat deployment into "The Keep" - a personal knowledge management system with inbox workflow.

---

## Current State

| Component | Status | Location |
|-----------|--------|----------|
| LobeChat | Running | chat.nextlevelfoundry.com |
| PostgreSQL | Running | lobechat-postgres container |
| MinIO | Running | lobechat-minio container |
| LiteLLM | Running | 10.0.0.27:2764 |
| n8n | Running | n8n.nextlevelguild.com |

---

## Configuration Changes

### 1. Environment Variables (docker-compose)

Check/update these in your LobeChat stack:

```yaml
# Required for Knowledge Base
ENABLED_KNOWLEDGE_BASE=1
ENABLED_UPLOAD=1

# S3/MinIO Configuration (verify these are set)
S3_ACCESS_KEY_ID=your-minio-key
S3_SECRET_ACCESS_KEY=your-minio-secret
S3_ENDPOINT=http://lobechat-minio:9000
S3_BUCKET=lobechat-files
S3_ENABLE_PATH_STYLE=1

# MCP Support
ENABLED_MCP=1

# Optional: Feature flags
FEATURE_FLAGS=knowledge_base,plugins,market,dalle,edit_agent
```

**Action:** SSH to Banner, check `/home/mgerasolo/stacks/lobechat/docker-compose.yml`

---

### 2. MCP Servers to Add

Add these in LobeChat Settings → MCP Servers:

#### A. Obsidian/Vault Integration

**Option 1: Claudesidian MCP** (Recommended)
```json
{
  "claudesidian": {
    "type": "mcp:sse",
    "url": "https://claudesidian.example.com/sse",
    "metadata": {
      "title": "Vault",
      "description": "Read/write notes in markdown vault"
    }
  }
}
```

**Option 2: Obsidian REST API MCP**
- Requires Obsidian running with REST API plugin
- May not be suitable for server-side vault

**Option 3: Custom File System MCP** (we may need to build)
- Direct file system access to vault folder
- No Obsidian dependency

#### B. Inbox MCP Server (Custom - we build this)
```json
{
  "inbox": {
    "type": "mcp:sse",
    "url": "http://10.0.0.33:5015/sse",
    "metadata": {
      "title": "Inbox",
      "description": "Capture URLs, queue items, process with AI"
    }
  }
}
```

#### C. Web Scraper MCP (Optional - marketplace)
```json
{
  "firecrawl": {
    "type": "mcp:sse",
    "url": "https://firecrawl-mcp.example.com/sse",
    "metadata": {
      "title": "Web Scraper",
      "description": "Extract content from URLs"
    }
  }
}
```

---

### 3. Knowledge Base Setup

#### Create Knowledge Bases in LobeChat UI:

| Knowledge Base | Purpose | Source |
|----------------|---------|--------|
| **Vault** | Main knowledge repository | Sync from vault folder |
| **Inbox** | Pending items for review | Managed by Inbox MCP |
| **Reference** | Documentation, guides | Manual uploads |

#### File Upload Configuration:
- Max file size: Set in environment (default 50MB)
- Supported formats: PDF, DOCX, TXT, MD, EPUB
- Embedding model: `text-embedding-3-small` or via LiteLLM

---

### 4. Agents to Create

#### A. The Keeper (Primary Assistant)

**Settings:**
| Field | Value |
|-------|-------|
| Name | The Keeper |
| Avatar | Library/book emoji or custom |
| Model | claude-sonnet-4-20250514 (via LiteLLM) |
| Temperature | 0.7 |

**System Prompt:**
```
You are The Keeper, a personal knowledge vault librarian. Your role is to help the user:

1. **Capture** - Save URLs, notes, and ideas to the inbox
2. **Process** - Summarize, extract key points, suggest tags and folders
3. **Organize** - File items in the appropriate vault location
4. **Retrieve** - Search and surface relevant knowledge when asked

You have access to:
- The user's markdown vault (via Vault tools)
- An inbox queue (via Inbox tools)
- Web scraping capabilities (via Firecrawl)

When the user shares a URL or content:
1. Capture it to the inbox
2. Extract title, summary, key points
3. Suggest tags and folder location
4. Ask if they want to save it

When the user asks a question:
1. Search the vault for relevant notes
2. Synthesize information from multiple sources
3. Cite which notes you're drawing from

Be concise, helpful, and proactive about organizing knowledge.
```

**Tools Enabled:**
- [x] Inbox MCP (all tools)
- [x] Vault/Obsidian MCP (all tools)
- [x] Web browsing (for URL preview)
- [x] Knowledge Base search

**Memory:** Enabled (learns user preferences)

**Opening Message:**
```
Greetings! I'm The Keeper, your vault librarian.

I can help you:
- 📥 Capture URLs and notes to your inbox
- 🏷️ Organize and tag your knowledge
- 🔍 Search across your vault
- 📝 Summarize and extract key points

Share a URL or ask me anything about your vault.
```

#### B. Inbox Processor (Scheduled Agent)

**Settings:**
| Field | Value |
|-------|-------|
| Name | Inbox Processor |
| Model | claude-haiku (fast, cheap) |
| Visibility | Hidden from main chat |

**System Prompt:**
```
You are an automated processor for inbox items. For each item:

1. Read the content
2. Generate a concise summary (2-3 sentences)
3. Extract 3-5 key points
4. Suggest 2-4 tags from existing vault taxonomy
5. Recommend a folder location based on content type
6. Format as markdown with proper frontmatter

Output format:
---
title: [extracted or generated title]
source: [original URL if applicable]
captured: [timestamp]
tags: [tag1, tag2, tag3]
status: processed
---

## Summary
[summary]

## Key Points
- [point 1]
- [point 2]
- [point 3]

## Original Content
[preserved content or link]
```

**Scheduled Task:**
- Frequency: Every 6 hours
- Task: "Check inbox for pending items, process each one, save to vault/inbox/processed/"

---

### 5. Vault Folder Structure

Create this structure in the vault:

```
vault/
├── inbox/
│   ├── pending/        # Raw captured items
│   ├── processed/      # AI-processed, ready for filing
│   └── archived/       # Filed items (moved from processed)
├── areas/
│   ├── work/
│   ├── personal/
│   └── projects/
├── resources/
│   ├── articles/
│   ├── tutorials/
│   └── reference/
├── daily/              # Daily notes
└── templates/          # Note templates
```

---

### 6. n8n Workflows to Create

#### Workflow 1: `inbox-process-item`
**Trigger:** Webhook POST from Inbox MCP
**Steps:**
1. Receive item (URL, content, metadata)
2. If URL: Fetch and extract content (Firecrawl or Jina)
3. Call LiteLLM for summarization
4. Generate markdown with frontmatter
5. Save to vault/inbox/processed/
6. Update Inbox MCP queue status
7. Optional: Send notification

#### Workflow 2: `inbox-rss-check`
**Trigger:** Schedule (every hour)
**Steps:**
1. Fetch configured RSS feeds
2. Check for new items since last run
3. For each new item:
   - Extract content
   - POST to Inbox MCP `inbox_upload_content`
4. Store last-checked timestamp

#### Workflow 3: `inbox-email-forward`
**Trigger:** IMAP (check email inbox)
**Steps:**
1. Check for emails to inbox@yourdomain.com
2. Parse email body and attachments
3. POST to Inbox MCP `inbox_upload_content`
4. Archive/delete email

#### Workflow 4: `inbox-notify`
**Trigger:** Webhook from MCP or scheduled
**Steps:**
1. Check for items needing attention
2. Send digest via ntfy/Slack/email

---

### 7. Browser Extension (Optional - Phase 2)

For quick capture from any webpage:

**Options:**
1. **LobeChat PWA** - Use share sheet on mobile
2. **Bookmarklet** - JavaScript to POST to Inbox MCP
3. **Custom Extension** - Chrome/Firefox extension

**Bookmarklet example:**
```javascript
javascript:(function(){
  fetch('https://inbox-mcp.nextlevelguild.com/api/capture', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      url: window.location.href,
      title: document.title,
      selection: window.getSelection().toString()
    })
  }).then(() => alert('Captured!'));
})();
```

---

## Implementation Checklist

### Phase 1: LobeChat Core (Day 1-2)

- [ ] Verify environment variables on Banner
- [ ] Confirm MinIO is accessible
- [ ] Test file upload in LobeChat
- [ ] Enable Knowledge Base feature
- [ ] Create test knowledge base
- [ ] Upload test documents
- [ ] Verify RAG search works

### Phase 2: Vault Connection (Day 2-3)

- [ ] Decide: Claudesidian vs custom MCP for vault
- [ ] Mount vault folder to LobeChat container (or accessible path)
- [ ] Install/configure Vault MCP server
- [ ] Test read/write operations
- [ ] Create vault folder structure

### Phase 3: Inbox MCP Server (Week 1)

- [ ] Scaffold TypeScript project
- [ ] Implement SQLite queue
- [ ] Implement `inbox_capture_url`
- [ ] Implement `inbox_list_queue`
- [ ] Implement `inbox_save_to_vault`
- [ ] Deploy to Banner (port 5015)
- [ ] Register in LobeChat MCP settings
- [ ] Test from LobeChat

### Phase 4: Keeper Agent (Day 1)

- [ ] Create agent with system prompt
- [ ] Enable MCP tools
- [ ] Connect to knowledge bases
- [ ] Enable memory
- [ ] Configure scheduled task
- [ ] Test end-to-end

### Phase 5: n8n Workflows (Week 2)

- [ ] Create `inbox-process-item` workflow
- [ ] Test webhook → LiteLLM → vault
- [ ] Create `inbox-rss-check` (optional)
- [ ] Create `inbox-notify` (optional)

---

## Questions to Resolve

1. **Vault Location:** Where should the markdown vault live?
   - Option A: Inside LobeChat MinIO (S3)
   - Option B: Mounted volume on Banner (e.g., `/home/mgerasolo/vault`)
   - Option C: Synced from Obsidian on another machine

2. **Vault MCP:** Which MCP server for vault access?
   - Claudesidian (requires REST API)
   - Custom file system MCP (we build)
   - Obsidian Omnisearch MCP

3. **Processing Location:** Where does AI processing happen?
   - Option A: LobeChat agent processes directly
   - Option B: n8n workflow with LiteLLM
   - Option C: Hybrid (simple in LobeChat, complex in n8n)

---

## Next Steps

1. **SSH to Banner** - Verify LobeChat config, MinIO access
2. **Test Knowledge Base** - Upload a file, verify search
3. **Decide vault location** - Where will markdown files live?
4. **Start Inbox MCP** - Scaffold project, implement core

Ready to proceed?
