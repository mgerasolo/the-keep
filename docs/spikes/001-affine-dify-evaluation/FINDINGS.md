# Spike 001: Findings & Decision

**Date:** 2026-03-22
**Status:** Complete
**Decision:** NO-GO on existing tools - Custom build required

---

## Executive Summary

After evaluating AFFiNE, Dify, and researching alternatives (Outline, BookStack, AnythingLLM), no existing tool meets The Keep's requirements. A custom solution is required.

**The Keep is not a wiki or document editor.** It's a **file management system with AI** - closer to Cursor/VS Code than Notion/Confluence.

---

## What We Evaluated

### AFFiNE (keep-docs.nextlevelguild.com)

| Aspect | Finding | Impact |
|--------|---------|--------|
| **Architecture** | Document editor (like Notion), not file manager | Fatal mismatch |
| **File Upload** | Cannot upload existing files to folders | Fatal mismatch |
| **AI Chat** | Requires cloud login, tries to use Gemini not LiteLLM | Blocker |
| **Storage** | "Cloud sync" misleadingly named but works with self-hosted PostgreSQL | Confusing UX |
| **Organization** | Folders/workspaces exist but for documents only | Partial fit |

**Verdict:** Wrong tool type. AFFiNE is for creating documents, not managing existing files.

### Dify (keep-dify.nextlevelguild.com)

| Aspect | Finding | Impact |
|--------|---------|--------|
| **Knowledge Bases** | Supports file upload + RAG - this IS what we need | Potential backend |
| **LiteLLM Integration** | OpenAI-compatible plugin won't install (UV dependency issues) | Blocker |
| **Workflows** | Powerful workflow builder for processing | Useful |
| **UI** | Designed for chatbots, not file management | Need custom frontend |

**Verdict:** Viable as backend/API for RAG, but needs custom frontend. LiteLLM integration blocked.

### Other Tools Researched

| Tool | Structure | File Upload | AI/RAG | Verdict |
|------|-----------|-------------|--------|---------|
| **Outline** | Collections → Nested Docs | No - doc editor | No | Not a fit |
| **BookStack** | Shelves → Books → Chapters → Pages | No - doc editor | No | Not a fit |
| **AnythingLLM** | Workspaces + file upload | Yes | Yes | Possible, needs eval |
| **LibreChat** | Chat interface | No file mgmt | Yes | Chat only |
| **LobeChat** | Chat interface | Limited | Yes | Chat only |

---

## Requirements Clarification

Through this spike, the actual requirements became clear:

### The Keep is NOT:
- A wiki (Confluence, Notion, Outline)
- A document editor (AFFiNE, Google Docs)
- A chatbot builder (Dify, Flowise)
- A simple chat interface (LobeChat, LibreChat)

### The Keep IS:
- A **file management system** (like Cursor, VS Code, Finder)
- With **AI chat** that can discuss file contents
- With **RAG** for intelligent retrieval across files
- For **personal knowledge management**

### Core Requirements (Priority Order)

#### 1. File Management (70% of the product)
| Requirement | Description |
|-------------|-------------|
| **File Browser** | Tree view sidebar, folders, file icons by type |
| **Multi-file View** | Tabs, split panes, side-by-side viewing |
| **Drop Zones** | Drag-and-drop file upload |
| **File Types** | PDF, Markdown, images, text, code, documents |
| **File Preview** | In-app viewing without downloading |
| **Search** | Full-text search across all files |
| **Organization** | Projects/workspaces with nested folders |

#### 2. AI Chat Panel (30% of the product)
| Requirement | Description |
|-------------|-------------|
| **Movable Panel** | Resizable, dockable chat panel |
| **Context Awareness** | Chat about currently open file(s) |
| **RAG Integration** | Query across entire knowledge base |
| **LiteLLM Backend** | Use local models via existing LiteLLM proxy |
| **Model Selection** | Choose between jarvis-chat, jarvis-qwen72b, etc. |

#### 3. Workspace Organization
| Requirement | Description |
|-------------|-------------|
| **Projects** | Health, HOA, Infrastructure, etc. |
| **Privacy** | Data stays on infrastructure, not third-party clouds |
| **Persistence** | Server-side storage (PostgreSQL + S3/MinIO) |

---

## UI Reference: Cursor/VS Code Style

```
+------------------+--------------------------------+------------------+
|                  |              TABS              |                  |
|   FILE BROWSER   +--------------------------------+   AI CHAT PANEL  |
|                  |                                |   (movable/      |
|   - Project A    |      FILE CONTENT VIEWER       |    resizable)    |
|     - folder1    |                                |                  |
|       - file.md  |      (supports split view,    |   [Chat about    |
|     - folder2    |       markdown preview,        |    current file] |
|   - Project B    |       PDF viewing, etc.)       |                  |
|                  |                                |   [RAG search    |
|   [Drop Zone]    |                                |    all files]    |
|                  |                                |                  |
+------------------+--------------------------------+------------------+
```

---

## Technical Architecture (Proposed)

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOM FRONTEND (Next.js)                    │
│  • File browser (tree view)                                      │
│  • Tab management                                                │
│  • Split pane viewer                                             │
│  • Monaco editor for code/markdown                               │
│  • PDF.js for PDF viewing                                        │
│  • Movable AI chat panel                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND OPTIONS                          │
├─────────────────────────────────────────────────────────────────┤
│  Option A: Dify API                  Option B: Custom Backend    │
│  • Knowledge bases for RAG           • Next.js API routes        │
│  • Workflow processing               • Direct LiteLLM calls      │
│  • Already deployed                  • Custom RAG (pgvector)     │
│  • Needs LiteLLM plugin fix          • More control              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────┤
│  LiteLLM (10.0.0.27:2764)     PostgreSQL      MinIO/S3           │
│  • jarvis-chat                • Metadata      • File storage     │
│  • jarvis-qwen72b             • RAG vectors   • Blob storage     │
│  • External APIs              • User data                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Decision

### Spike Result: NO-GO on Existing Tools

| Option | Decision | Reason |
|--------|----------|--------|
| AFFiNE + Dify | NO-GO | AFFiNE is document editor, not file manager |
| Dify alone | Partial | Good RAG backend, needs custom frontend |
| Outline/BookStack | NO-GO | Wikis, not file managers |
| Custom Build | **GO** | Only path to actual requirements |

### Next Steps

1. **Create lean PRD** - 1 page, what The Keep does
2. **Architecture document** - Components, data flow, tech choices
3. **Build Phase 1** - File management core (browser, upload, view)
4. **Build Phase 2** - AI chat panel with LiteLLM
5. **Build Phase 3** - RAG integration (Dify API or custom)

### Technology Recommendations

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| Frontend Framework | Next.js 14+ (App Router) | SSR, API routes, existing expertise |
| UI Components | shadcn/ui + Tailwind | Flexible, accessible, no vendor lock |
| File Browser | Custom + react-arborist | Tree view with drag-drop |
| Code/MD Editor | Monaco Editor | VS Code engine, battle-tested |
| PDF Viewer | PDF.js / react-pdf | Standard solution |
| Split Panes | react-resizable-panels | Flexible layouts |
| State Management | Zustand or Jotai | Simple, performant |
| File Storage | MinIO (S3-compatible) | Already have infrastructure |
| Database | PostgreSQL + pgvector | Already deployed, RAG-ready |
| AI Backend | LiteLLM (existing) | Local models, API proxy |
| RAG | Dify API or custom | Evaluate after Phase 1 |

---

## Appendix: Spike Testing Details

### Infrastructure Deployed
- AFFiNE: https://keep-docs.nextlevelguild.com (Banner:5013)
- Dify: https://keep-dify.nextlevelguild.com (Banner:5012)
- LobeChat: https://keep-chat.nextlevelguild.com (Banner:5011)

### Issues Encountered
1. AFFiNE `SERVER_FLAVOR=selfhosted` invalid - fixed with `allinone`
2. AFFiNE SMTP required for auth - configured with Namecheap Private Email
3. AFFiNE `AFFINE_SERVER_EXTERNAL_URL` needed for magic links
4. AFFiNE AI requires cloud login, tries to use Gemini not LiteLLM
5. AFFiNE "Cloud" terminology misleading (actually uses self-hosted backend)
6. Dify OpenAI-compatible plugin won't install (UV dependency issues)
7. Dify Ollama plugin installed but wrong API format for LiteLLM

### What Worked
- All services deployed and running
- Traefik routing via Helicarrier (domains resolve)
- AFFiNE SMTP and email verification
- AFFiNE workspace sync to PostgreSQL (after "enable cloud")
- Dify UI accessible

### What Didn't Work
- AFFiNE as file manager (wrong tool type)
- AFFiNE AI with LiteLLM (hardcoded to cloud Gemini)
- Dify LiteLLM connection (plugin blocker)
- Any existing tool meeting full requirements
