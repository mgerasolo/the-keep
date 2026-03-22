# Inbox MCP Server - Skeleton Architecture

**Date:** 2026-03-18
**Status:** Proposal

## Overview

An MCP server for LobeChat that provides an "Inbox" workflow: capture URLs, accept file uploads, queue items for AI processing, and integrate with a markdown vault.

## Architecture Diagram

```
+-------------------+     +------------------+     +------------------+
|    LobeChat       |     |  Inbox MCP       |     |   Markdown       |
|    (Web/Desktop)  |<--->|  Server          |---->|   Vault          |
+-------------------+     +------------------+     +------------------+
                               |      |
                               |      v
                               |  +------------------+
                               |  |  SQLite Queue    |
                               |  |  (inbox.db)      |
                               |  +------------------+
                               |
                               v
                          +------------------+
                          |  n8n Webhooks    |
                          |  (processing)    |
                          +------------------+
```

## Project Structure

```
inbox-mcp-server/
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── index.ts              # Entry point, transport setup
│   ├── server.ts             # McpServer configuration
│   ├── config.ts             # Environment variables
│   ├── tools/
│   │   ├── index.ts          # Tool registry
│   │   ├── capture-url.ts    # URL capture tool
│   │   ├── upload-file.ts    # File upload tool
│   │   ├── list-queue.ts     # Queue listing tool
│   │   ├── process-item.ts   # Manual processing trigger
│   │   └── search-vault.ts   # Vault search tool
│   ├── services/
│   │   ├── scraper.ts        # Web content extraction
│   │   ├── queue.ts          # SQLite queue management
│   │   ├── vault.ts          # Markdown vault operations
│   │   └── n8n.ts            # n8n webhook integration
│   ├── types/
│   │   └── inbox.ts          # TypeScript interfaces
│   └── utils/
│       ├── logger.ts         # stderr logging (MCP-safe)
│       └── markdown.ts       # Markdown generation
├── data/
│   └── inbox.db              # SQLite database (runtime)
└── tests/
    └── tools.test.ts
```

## Tool Definitions

### 1. `inbox_capture_url`

Capture a URL and extract its content for later processing.

```typescript
{
  name: "inbox_capture_url",
  description: "Capture a URL, extract its content, and add to inbox queue",
  inputSchema: {
    url: z.string().url().describe("URL to capture"),
    title: z.string().optional().describe("Optional custom title"),
    tags: z.array(z.string()).optional().describe("Tags for categorization"),
    priority: z.enum(["low", "normal", "high"]).default("normal"),
    notes: z.string().optional().describe("Additional notes"),
  },
  annotations: {
    title: "Capture URL",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  }
}
```

**Returns:**
- Queue item ID
- Extracted title
- Content preview (first 500 chars)
- Status: "queued"

### 2. `inbox_upload_content`

Accept text/markdown content directly (for file-like uploads).

```typescript
{
  name: "inbox_upload_content",
  description: "Upload text content directly to inbox queue",
  inputSchema: {
    content: z.string().describe("Text or markdown content"),
    filename: z.string().describe("Suggested filename"),
    contentType: z.enum(["text", "markdown", "code"]).default("text"),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  },
  annotations: {
    title: "Upload Content",
    readOnlyHint: false,
  }
}
```

### 3. `inbox_list_queue`

List items currently in the inbox queue.

```typescript
{
  name: "inbox_list_queue",
  description: "List items in the inbox queue with filtering",
  inputSchema: {
    status: z.enum(["pending", "processing", "completed", "failed", "all"]).default("pending"),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    tag: z.string().optional().describe("Filter by tag"),
  },
  annotations: {
    title: "List Queue",
    readOnlyHint: true,
  }
}
```

### 4. `inbox_process_item`

Trigger AI processing of a queued item.

```typescript
{
  name: "inbox_process_item",
  description: "Process a queued item with AI and save to vault",
  inputSchema: {
    itemId: z.number().describe("Queue item ID"),
    action: z.enum(["summarize", "extract", "analyze", "archive"]),
    outputPath: z.string().optional().describe("Vault path for output"),
    prompt: z.string().optional().describe("Custom processing prompt"),
  },
  annotations: {
    title: "Process Item",
    readOnlyHint: false,
  }
}
```

### 5. `inbox_search_vault`

Search the markdown vault for existing content.

```typescript
{
  name: "inbox_search_vault",
  description: "Search the markdown vault for notes",
  inputSchema: {
    query: z.string().describe("Search query"),
    path: z.string().optional().describe("Limit to path prefix"),
    limit: z.number().min(1).max(50).default(10),
  },
  annotations: {
    title: "Search Vault",
    readOnlyHint: true,
  }
}
```

### 6. `inbox_save_to_vault`

Save content directly to the vault.

```typescript
{
  name: "inbox_save_to_vault",
  description: "Save markdown content to vault",
  inputSchema: {
    path: z.string().describe("Vault path (e.g., 'inbox/2026-03-18-article.md')"),
    content: z.string().describe("Markdown content"),
    frontmatter: z.record(z.string()).optional().describe("YAML frontmatter"),
    overwrite: z.boolean().default(false),
  },
  annotations: {
    title: "Save to Vault",
    readOnlyHint: false,
    destructiveHint: false,
  }
}
```

## Database Schema

```sql
-- Queue table
CREATE TABLE IF NOT EXISTS queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL CHECK(source_type IN ('url', 'upload')),
  source_url TEXT,
  title TEXT,
  content TEXT,
  content_type TEXT DEFAULT 'text',
  tags TEXT, -- JSON array
  notes TEXT,
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  output_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_created ON queue(created_at DESC);

-- Processing history
CREATE TABLE IF NOT EXISTS processing_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  prompt TEXT,
  result TEXT,
  duration_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (queue_id) REFERENCES queue(id)
);
```

## Configuration

```typescript
// src/config.ts
export const config = {
  // Server
  port: process.env.INBOX_PORT || 5015,
  host: process.env.INBOX_HOST || "0.0.0.0",

  // Vault
  vaultPath: process.env.VAULT_PATH || "/data/vault",
  inboxFolder: process.env.INBOX_FOLDER || "inbox",

  // Database
  dbPath: process.env.DB_PATH || "/data/inbox.db",

  // n8n Integration
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
  n8nApiKey: process.env.N8N_API_KEY,

  // Scraping
  userAgent: process.env.USER_AGENT || "InboxMCP/1.0",
  scrapeTimeout: parseInt(process.env.SCRAPE_TIMEOUT || "30000"),

  // Security
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "*").split(","),
};
```

## Docker Deployment

```yaml
# docker-compose.yml
version: "3.8"

services:
  inbox-mcp:
    build: .
    container_name: inbox-mcp-server
    restart: unless-stopped
    ports:
      - "5015:5015"
    volumes:
      - ./data:/data
      - /path/to/vault:/data/vault
    environment:
      - INBOX_PORT=5015
      - VAULT_PATH=/data/vault
      - DB_PATH=/data/inbox.db
      - N8N_WEBHOOK_URL=http://10.0.0.27:2750/webhook/inbox-process
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.inbox-mcp.rule=Host(`inbox-mcp.nextlevelguild.com`)"
      - "traefik.http.services.inbox-mcp.loadbalancer.server.port=5015"

networks:
  traefik:
    external: true
```

## Entry Point Implementation

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { registerTools } from "./tools/index.js";
import { initDatabase } from "./services/queue.js";

async function createServer(): Promise<McpServer> {
  const server = new McpServer({
    name: "inbox-mcp-server",
    version: "1.0.0",
  });

  // Initialize database
  await initDatabase();

  // Register all tools
  registerTools(server);

  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const useHttp = args.includes("--http") || args.includes("--port");

  if (useHttp) {
    // HTTP/SSE mode for LobeChat web
    const app = express();
    app.use(cors({ origin: config.allowedOrigins }));
    app.use(express.json());

    // SSE endpoint for LobeChat
    app.get("/sse", async (req, res) => {
      const server = await createServer();
      const transport = new SSEServerTransport("/message", res);
      await server.connect(transport);
    });

    // Message endpoint for SSE
    app.post("/message", async (req, res) => {
      // Handle SSE messages
      // Implementation depends on session management
    });

    app.listen(config.port, config.host, () => {
      console.error(`Inbox MCP Server running on http://${config.host}:${config.port}`);
      console.error(`SSE endpoint: http://${config.host}:${config.port}/sse`);
    });
  } else {
    // STDIO mode for Claude Desktop
    const server = await createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Inbox MCP Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

## LobeChat Configuration

Add to LobeChat MCP settings:

```json
{
  "mcpServers": {
    "inbox": {
      "type": "mcp:sse",
      "url": "http://10.0.0.33:5015/sse",
      "metadata": {
        "title": "Inbox",
        "description": "Capture URLs, upload content, queue for AI processing"
      }
    }
  }
}
```

## n8n Integration Workflow

The MCP server can trigger n8n webhooks for heavy processing:

```
[inbox_process_item]
    --> POST /webhook/inbox-process
        {
          itemId: 123,
          action: "summarize",
          content: "...",
          prompt: "..."
        }
    --> n8n workflow:
        1. Call LiteLLM for AI processing
        2. Generate markdown output
        3. POST back to MCP server OR write directly to vault
```

## Implementation Phases

### Phase 1: Core Infrastructure
- [ ] Project setup with TypeScript
- [ ] SQLite database initialization
- [ ] Basic HTTP/SSE transport
- [ ] `inbox_capture_url` with basic scraping
- [ ] `inbox_list_queue`

### Phase 2: Vault Integration
- [ ] `inbox_save_to_vault`
- [ ] `inbox_search_vault`
- [ ] Markdown generation with frontmatter
- [ ] File system operations

### Phase 3: Processing Pipeline
- [ ] `inbox_process_item`
- [ ] n8n webhook integration
- [ ] Queue status management
- [ ] Error handling and retries

### Phase 4: Enhanced Features
- [ ] `inbox_upload_content`
- [ ] Batch operations
- [ ] Tags and filtering
- [ ] Processing templates

### Phase 5: Production Ready
- [ ] Docker deployment
- [ ] Traefik integration
- [ ] Health checks
- [ ] Logging to Loki
- [ ] Metrics to Prometheus

## Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.10.0",
    "zod": "^3.23.0",
    "better-sqlite3": "^11.0.0",
    "express": "^4.19.0",
    "cors": "^2.8.5",
    "cheerio": "^1.0.0",
    "node-fetch": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/better-sqlite3": "^7.6.0",
    "@types/cors": "^2.8.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
```

## Next Steps

1. Review this architecture
2. Create the project scaffold
3. Implement Phase 1
4. Test with MCP Inspector
5. Deploy to Banner for LobeChat testing
