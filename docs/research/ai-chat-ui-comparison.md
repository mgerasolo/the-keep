# AI Conversation Web UI Comparison

**Research Date:** 2026-03-18
**Purpose:** Evaluate file management, plugins, and extensibility for The Keep project

---

## Executive Summary

| Project | GitHub Stars | File/KB System | Plugin Architecture | LiteLLM/OpenAI API | Self-Hosting | Inbox/Workflow |
|---------|-------------|----------------|--------------------|--------------------|--------------|----------------|
| **Open WebUI** | 127,720 | Excellent | Excellent (Pipelines + MCP) | Native support | Simple (Docker) | Webhooks only |
| **LobeChat** | 73,922 | Excellent | Excellent (MCP + Plugin Market) | Yes | Moderate | No |
| **AnythingLLM** | 56,414 | Good | Moderate (Agent Skills) | Yes | Simple (Docker) | No |
| **LibreChat** | 34,747 | Good | Excellent (MCP + OpenAPI) | Native support | Moderate | No |
| **Khoj** | 33,476 | Good | Limited | Yes | Simple (Docker) | Automations |

---

## Detailed Comparison

### 1. Open WebUI

**Repository:** https://github.com/open-webui/open-webui
**Stars:** 127,720 | **Forks:** 18,045 | **Last Updated:** 2026-03-18

#### File Management / Knowledge Base
- **Centralized file management** with unified dashboard
- **RAG support** with changeable embedding models (Ollama, OpenAI)
- **Advanced document extraction** via Apache Tika, Docling, Azure Document Intelligence, Mistral OCR
- **File types:** PDF, DOCX, XLSX, PPTX, HTML, and more
- **Knowledge bases** accessible via `#` symbol in chat
- Auto-cleanup of KB associations when files deleted

#### Plugin/Extension Architecture
- **Pipelines Framework** - Modular plugin system with Python support
- **Native MCP support** - Connect to any MCP server via HTTP/SSE
- **MCPO Proxy** for stdio-based MCP servers
- **Functions** - Easier to write/deploy for simpler tasks
- **Community store** at openwebui.com/functions with 100+ pre-built tools
- Built-in code editor for custom Python functions

#### API Compatibility
- **Universal OpenAI API compatibility** - works with any OpenAI Chat Completions-compatible backend
- **LiteLLM integration** - Well-documented, multiple community Docker Compose setups exist
- Customizable API URL

#### Self-Hosting
- **Complexity:** Simple
- Single Docker container or Docker Compose
- `docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main`
- Built-in admin panel for configuration

#### Inbox/Workflow Concepts
- **Auto-tagging** for conversations
- **Message queuing** while AI generates
- **Webhook integration** (Discord, Slack, Teams, Google Chat)
- No native inbox or processing queue

---

### 2. LobeChat (LobeHub)

**Repository:** https://github.com/lobehub/lobe-chat
**Stars:** 73,922 | **Forks:** 14,799 | **Last Updated:** 2026-03-18

#### File Management / Knowledge Base
- **Knowledge Base feature** with chunking and embedding
- **PostgreSQL + PGVector** for vector storage
- **S3/S3-compatible storage** for file storage
- **Embedding:** OpenAI text-embedding-3-small by default
- File types: Documents, images, audio, video
- Semantic search via vector matching

#### Plugin/Extension Architecture
- **MCP Marketplace** - 10,000+ tools, one-click install
- **Plugin Market** - ChatGPT plugin compatible
- **Agent Marketplace** - Community-created agents
- Custom plugin development via manifest files
- Automated i18n workflow for agent translations

#### API Compatibility
- **Multi-provider support:** OpenAI, Claude, Gemini, Ollama, Qwen, DeepSeek
- LiteLLM compatible (OpenAI API format)
- Langfuse integration for observability

#### Self-Hosting
- **Complexity:** Moderate (database version) / Simple (standalone)
- Docker image: `lobehub/lobe-chat`
- Database version requires PostgreSQL + PGVector + S3
- Docker Compose configurations available

#### Inbox/Workflow Concepts
- No native inbox system
- Focus on agent-based workflows

---

### 3. AnythingLLM

**Repository:** https://github.com/Mintplex-Labs/anything-llm
**Stars:** 56,414 | **Forks:** 6,097 | **Last Updated:** 2026-03-18

#### File Management / Knowledge Base
- **Workspace-based organization** - Documents scoped to workspaces
- **Extensive format support:** PDF, DOCX, TXT, MD, CSV, XLSX, PPTX, HTML, 50+ code formats, audio (Whisper)
- **Content sources:** GitHub repos, YouTube transcripts, Confluence, web scraper
- **Live Document Sync** (beta) - Automatic re-indexing
- Two modes: Full-text attachment vs RAG chunking

#### Plugin/Extension Architecture
- **Custom Agent Skills** - NodeJS-based plugins
- Requires JavaScript/NodeJS knowledge
- **Hot loading** - Changes apply without restart
- Structure: `plugin.json` + `handler.js`
- Available in Docker since v1.2.2
- **Not available in cloud offering**

#### API Compatibility
- **Full developer API** (v1.10.0)
- OpenAI-compatible endpoints
- Bearer token authentication
- API Base: `http://localhost:3001/api/v1`
- Works with LiteLLM as proxy

#### Self-Hosting
- **Complexity:** Simple
- Desktop app (Windows, macOS, Linux) or Docker
- Docker: `mintplexlabs/anythingllm`
- No external database required (embedded)
- Privacy-first, on-device option

#### Inbox/Workflow Concepts
- No inbox system
- Workspace threads for organization

---

### 4. LibreChat

**Repository:** https://github.com/danny-avila/LibreChat
**Stars:** 34,747 | **Forks:** 7,032 | **Last Updated:** 2026-03-18

#### File Management / Knowledge Base
- **Flexible storage routing** - Local, Firebase, S3, Azure Blob
- **Type-aware storage** with fallback mechanisms
- Use cases: Conversation attachments, agent context, assistant KB, code interpreter
- 2026 roadmap: File retention policies, storage limits per profile

#### Plugin/Extension Architecture
- **MCP support** - Both stdio and SSE transport
- **OpenAPI Actions** - Recommended for custom tools
- **Agent Builder** with MCP tool selection
- **Deferred tools** - Load tools on-demand to save context
- LangChain Tool class for legacy plugins (deprecated)
- Smithery.ai integration for MCP server discovery

#### API Compatibility
- **Native LiteLLM integration** - Documented extensively
- OpenAI API compatible
- 100+ LLM providers via LiteLLM proxy
- Configuration via `librechat.yaml`

#### Self-Hosting
- **Complexity:** Moderate
- Docker Compose with multiple services
- Requires: MongoDB, Meilisearch (optional), Redis (optional)
- `docker-compose.override.yml` for customization

#### Inbox/Workflow Concepts
- No native inbox
- 2026 roadmap includes "Agent Skills" and "interactive workflows"

---

### 5. Khoj

**Repository:** https://github.com/khoj-ai/khoj
**Stars:** 33,476 | **Forks:** 2,066 | **Last Updated:** 2026-03-17

#### File Management / Knowledge Base
- **Personal knowledge base** focus
- **Format support:** PDF, Markdown, Org-mode, Word, Notion pages
- **Integrations:** Obsidian plugin, Emacs, GitHub repos, web content
- RAG-based retrieval from personal files
- Semantic search via natural language

#### Plugin/Extension Architecture
- **Custom agents** - Tunable personality, tools, and knowledge bases
- **Obsidian plugin** - Deep integration
- **WhatsApp access**
- Limited compared to others - more "integration" than "plugin" focused
- No marketplace for third-party extensions

#### API Compatibility
- **OpenAI API compatible** - Works with any OpenAI-compatible server
- Supports: OpenAI, Anthropic, Gemini, Ollama, LMStudio, vLLM
- `OPENAI_BASE_URL` for custom providers
- LiteLLM compatible

#### Self-Hosting
- **Complexity:** Simple to Moderate
- Docker Compose with PostgreSQL (pgvector)
- 5 services: App, PostgreSQL, sandbox, web search, computer automation
- **Requirements:** 8GB RAM, 5GB disk
- Desktop and web options available

#### Inbox/Workflow Concepts
- **Scheduled automations** - Unique feature
- **Smart notifications** to inbox
- **Personal newsletters** via automation
- Closest to "inbox" concept among all options

---

## Feature Matrix

### File/Knowledge Base Capabilities

| Feature | Open WebUI | LobeChat | AnythingLLM | LibreChat | Khoj |
|---------|------------|----------|-------------|-----------|------|
| RAG Support | Yes | Yes | Yes | Via agents | Yes |
| Vector DB | Built-in | PGVector | Built-in | Via config | PGVector |
| PDF Support | Yes | Yes | Yes | Yes | Yes |
| Office Docs | Yes | Limited | Yes | Yes | Yes |
| Code Files | Yes | Limited | 50+ types | Limited | Limited |
| Web Scraping | Yes | Plugin | Yes | Plugin | Yes |
| GitHub Repos | Plugin | Plugin | Yes | Plugin | Yes |
| Notion Integration | Plugin | Plugin | Yes | Plugin | Yes |
| Live Sync | No | No | Beta | No | No |

### Plugin Architecture

| Feature | Open WebUI | LobeChat | AnythingLLM | LibreChat | Khoj |
|---------|------------|----------|-------------|-----------|------|
| MCP Support | Native | Native | No | Native | No |
| Plugin Marketplace | Yes | Yes | No | Smithery | No |
| Custom Plugins | Python | Manifest | NodeJS | LangChain | Limited |
| OpenAPI Actions | Via MCP | Via MCP | No | Native | No |
| Hot Reload | Yes | Yes | Yes | No | No |
| Community Store | Yes | Yes | No | No | No |

### Deployment & Integration

| Feature | Open WebUI | LobeChat | AnythingLLM | LibreChat | Khoj |
|---------|------------|----------|-------------|-----------|------|
| Docker Single Container | Yes | Yes | Yes | No | No |
| Docker Compose | Yes | Yes | Yes | Yes | Yes |
| Desktop App | No | No | Yes | No | Yes |
| External DB Required | Optional | Yes* | No | Yes | Yes |
| LiteLLM Native | Yes | Yes | Via proxy | Yes | Via proxy |
| Multi-user Auth | Yes | Yes | Yes | Yes | Yes |

*For knowledge base features

---

## Recommendations for The Keep

### Best Overall: **Open WebUI**
- Largest community (127k stars)
- Excellent plugin ecosystem (Pipelines + MCP)
- Simple self-hosting
- Native LiteLLM support
- Active development

### Best for Knowledge Management: **AnythingLLM**
- Purpose-built for document management
- Widest file format support
- Desktop + Docker options
- Live document sync (beta)
- Simplest setup

### Best for Extensibility: **LobeChat**
- MCP Marketplace with 10k+ tools
- Agent Marketplace
- ChatGPT plugin compatibility
- Modern UI/UX

### Closest to "Inbox" Concept: **Khoj**
- Scheduled automations
- Smart notifications
- Personal newsletter features
- Built for personal knowledge management

### Best for Multi-Provider: **LibreChat**
- Native LiteLLM integration
- 100+ providers
- MCP + OpenAPI Actions
- Enterprise features in roadmap

---

## Sources

### LobeChat
- [LobeChat GitHub](https://github.com/lobehub/lobe-chat)
- [LobeChat Knowledge Base Docs](https://lobehub.com/docs/usage/features/knowledge-base)
- [LobeChat Plugin Development](https://lobehub.com/docs/usage/plugins/development)
- [LobeChat Docker Deployment](https://lobehub.com/docs/self-hosting/platform/docker-compose)

### Open WebUI
- [Open WebUI GitHub](https://github.com/open-webui/open-webui)
- [Open WebUI Features](https://docs.openwebui.com/features/)
- [Open WebUI RAG Tutorial](https://docs.openwebui.com/tutorials/tips/rag-tutorial/)
- [Open WebUI Tools Documentation](https://docs.openwebui.com/features/extensibility/plugin/tools/)
- [Open WebUI Complete Guide 2026](https://www.mayhemcode.com/2026/03/open-webui-complete-guide-install-rag.html)
- [Open WebUI + LiteLLM Integration](https://github.com/open-webui/open-webui/discussions/1038)

### LibreChat
- [LibreChat GitHub](https://github.com/danny-avila/LibreChat)
- [LibreChat MCP Docs](https://www.librechat.ai/docs/features/mcp)
- [LibreChat 2026 Roadmap](https://www.librechat.ai/blog/2026-02-18_2026_roadmap)
- [LibreChat Tools and Plugins](https://www.librechat.ai/docs/development/tools_and_plugins)
- [LibreChat LiteLLM Integration](https://www.librechat.ai/docs/configuration/librechat_yaml/ai_endpoints/litellm)

### AnythingLLM
- [AnythingLLM GitHub](https://github.com/Mintplex-Labs/anything-llm)
- [AnythingLLM Documentation](https://docs.anythingllm.com/)
- [AnythingLLM Custom Agent Skills](https://docs.anythingllm.com/agent/custom/developer-guide)
- [AnythingLLM Embedding Models](https://docs.useanything.com/features/embedding-models)
- [AnythingLLM Review 2026](https://andrew.ooo/posts/anythingllm-all-in-one-ai-app/)

### Khoj
- [Khoj GitHub](https://github.com/khoj-ai/khoj)
- [Khoj Self-Host Documentation](https://docs.khoj.dev/get-started/setup/)
- [Khoj OpenAI Proxy](https://docs.khoj.dev/advanced/use-openai-proxy/)
- [Khoj Overview](https://docs.khoj.dev/)
