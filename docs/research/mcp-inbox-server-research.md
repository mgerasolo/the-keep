# MCP Inbox Server Research

**Date:** 2026-03-18
**Purpose:** Research MCP server development for LobeChat Inbox workflow

## 1. MCP Protocol Basics

### What is MCP?

The **Model Context Protocol (MCP)** is an open specification that standardizes communication between AI applications and external capabilities. Built on JSON-RPC 2.0 for structured, bidirectional communication.

### Server Capabilities

MCP servers expose three main types of capabilities:

| Type | Purpose | Use Case |
|------|---------|----------|
| **Tools** | Functions the LLM can call (with user approval) | Actions like scraping URLs, saving files |
| **Resources** | Read-only data clients can surface | File contents, API responses |
| **Prompts** | Reusable templates for consistent interaction | Pre-defined workflows |

### Transport Options

| Transport | Use Case | Platform Support |
|-----------|----------|-----------------|
| **stdio** | Local process-spawned (Claude Desktop) | Desktop only |
| **Streamable HTTP** | Remote servers (recommended) | Web + Desktop |
| **SSE (legacy)** | Older HTTP streaming | Web + Desktop |

**LobeChat supports all three**, but for web access, HTTP/SSE is required.

### Server Structure (TypeScript)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "inbox-server",
  version: "1.0.0",
});

// Register tools
server.registerTool(
  "capture_url",
  {
    description: "Capture a URL and extract its content",
    inputSchema: {
      url: z.string().url().describe("URL to capture"),
      tags: z.array(z.string()).optional().describe("Optional tags"),
    },
  },
  async ({ url, tags }) => {
    // Implementation
    return {
      content: [{ type: "text", text: "Captured successfully" }],
    };
  }
);
```

### Tool Annotations

Tools can include hints about their behavior:

| Annotation | Meaning |
|------------|---------|
| `readOnlyHint` | Tool doesn't modify state |
| `destructiveHint` | Tool makes destructive changes |
| `idempotentHint` | Safe to retry |

---

## 2. How LobeChat Connects to MCP Servers

### Configuration Methods

1. **Quick Import JSON** - Import pre-configured file
2. **Manual Configuration** - Enter details directly

### Connection Types in LobeChat

| Type | Config Key | Requirements |
|------|------------|--------------|
| Streamable HTTP | `type: "mcp:http"` | URL endpoint |
| SSE | `type: "mcp:sse"` | URL with `/sse` path |
| STDIO | `type: "mcp:stdio"` | Desktop app only |

### Example Configuration (SSE)

```json
{
  "mcpServers": {
    "inbox": {
      "type": "mcp:sse",
      "url": "http://10.0.0.33:5015/sse",
      "metadata": {
        "title": "Inbox Server",
        "description": "Capture URLs and files for AI processing"
      }
    }
  }
}
```

### Key Limitation

**LobeChat Web App only supports remote connections** (HTTP/SSE). STDIO requires the desktop version.

---

## 3. Existing MCP Server Examples

### Obsidian MCP Servers

**Architecture Pattern:** REST API bridge

The cyanheads/obsidian-mcp-server demonstrates:

| Component | Implementation |
|-----------|---------------|
| Tool definitions | 8 specialized tools (read, write, search, manage) |
| Connection | HTTP to Obsidian Local REST API plugin |
| Caching | VaultCacheService with 10-min refresh |
| File operations | Centralized ObsidianRestApiService |

**Tools provided:**
- `obsidian_read_note`
- `obsidian_update_note`
- `obsidian_search_replace`
- `obsidian_global_search`
- `obsidian_list_notes`
- `obsidian_manage_frontmatter`
- `obsidian_manage_tags`
- `obsidian_delete_note`

### Firecrawl MCP Server

**Architecture Pattern:** Web scraping with async processing

The firecrawl-mcp-server demonstrates:

| Feature | Implementation |
|---------|---------------|
| Content extraction | JSON Schema validation, markdown, structured data |
| Async operations | SSE streaming, parallel processing |
| Error handling | Exponential backoff (3 retries, 1-10s delays) |
| Rate limiting | Automatic with credit monitoring |

**Tools provided:**
- `firecrawl_scrape` - Single URL extraction
- `firecrawl_batch_scrape` - Multiple URLs with rate limiting
- `firecrawl_map` - URL discovery
- `firecrawl_crawl` - Multi-page with depth limits
- `firecrawl_search` - Web search
- `firecrawl_agent` - Complex research tasks

### SQLite Memory MCP Servers

**Architecture Pattern:** Persistent state management

Multiple servers demonstrate SQLite for persistence:
- memory-plugin-sqlite - Key-value with WAL mode
- mcp-memory-libsql - Vector search, knowledge graphs

---

## 4. Development Workflow

### Project Setup (TypeScript)

```bash
# Create project
mkdir inbox-mcp-server && cd inbox-mcp-server
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod@3
npm install -D @types/node typescript

# Create structure
mkdir src
```

### package.json Configuration

```json
{
  "name": "inbox-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "inbox-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js",
    "start:http": "node build/index.js --port 5015"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

### Testing Locally

```bash
# Build
npm run build

# Test with MCP Inspector (recommended)
npx @modelcontextprotocol/inspector ./build/index.js

# Or run directly for HTTP
npm run start:http
```

### Deployment for LobeChat

Since LobeChat web needs HTTP/SSE, deploy as a Docker container:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 5015
CMD ["node", "build/index.js", "--port", "5015"]
```

---

## 5. Integration Capabilities

### Can MCP Servers Call External APIs?

**Yes.** MCP servers are regular Node.js/Python applications. They can:

- Make HTTP requests to n8n webhooks
- Call any REST API
- Use third-party SDKs

```typescript
// Example: Trigger n8n webhook
async function triggerN8n(item: InboxItem) {
  await fetch("http://10.0.0.27:2750/webhook/inbox-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}
```

### Can They Write to File System?

**Yes.** Full file system access:

```typescript
import { writeFile, mkdir } from "fs/promises";

async function saveToVault(filename: string, content: string) {
  const vaultPath = "/path/to/vault/inbox";
  await mkdir(vaultPath, { recursive: true });
  await writeFile(`${vaultPath}/${filename}.md`, content);
}
```

### Can They Maintain State/Queue?

**Yes.** Multiple options:

| Approach | Pros | Cons |
|----------|------|------|
| In-memory | Fast, simple | Lost on restart |
| SQLite | Persistent, ACID | Single file |
| External DB | Scalable | More complexity |

```typescript
// SQLite queue example
import Database from "better-sqlite3";

const db = new Database("inbox-queue.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

---

## 6. Security Considerations

### For HTTP Transport

| Concern | Mitigation |
|---------|-----------|
| DNS Rebinding | Use `createMcpExpressApp()` for Host header validation |
| CORS | Configure allowed origins |
| Session hijacking | Non-deterministic session IDs |
| Input validation | Zod schemas on all inputs |

### Example Secure HTTP Setup

```typescript
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";

const app = createMcpExpressApp(); // Includes DNS rebinding protection

app.post("/mcp", async (req, res) => {
  const server = new McpServer({ name: "inbox", version: "1.0.0" });
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(5015, "0.0.0.0");
```

---

## Sources

- [Model Context Protocol - Build Server](https://modelcontextprotocol.io/docs/develop/build-server)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP TypeScript SDK Docs](https://ts.sdk.modelcontextprotocol.io/)
- [LobeChat MCP Guide](https://lobehub.com/blog/mcp-in-lobehub-what-is-it-and-how-to-set-it-up)
- [LobeChat MCP Marketplace](https://lobehub.com/mcp)
- [Obsidian MCP Server](https://github.com/cyanheads/obsidian-mcp-server)
- [Firecrawl MCP Server](https://github.com/firecrawl/firecrawl-mcp-server)
- [SQLite Memory Plugin](https://playbooks.com/mcp/memory-plugin-sqlite)
- [MCP Memory LibSQL](https://github.com/joleyline/mcp-memory-libsql)
