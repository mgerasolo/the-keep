# PKM and AI Knowledge Management Tools Research Report

**Date:** March 18, 2026
**Purpose:** Evaluate Notion alternatives and PKM tools with AI integration and multi-workspace/team support for The Keep project

---

## Executive Summary

### Key Findings

1. **AFFiNE and AppFlowy are the leading open-source Notion alternatives** with the most mature combination of workspace features, AI integration, and self-hosting capability. Both have active development (68k+ and 28k+ stars respectively) and genuine production readiness in 2026.

2. **Plane emerges as the strongest AI-native option** if project management is a priority. Its native AI reads across your entire workspace and includes autonomous agents, comprehensive API, and excellent self-hosting support.

3. **AnythingLLM provides the best "AI-first" architecture** with true multi-tenant workspace isolation, role-based access control, and the most flexible LLM integration (any model: local or cloud). However, it lacks the rich editing/document features of Notion-like tools.

4. **Outline offers the cleanest team wiki experience** with MCP integration for AI assistants, but requires bringing your own AI (OpenAI/Azure integration). Best for teams that want a focused wiki rather than an all-in-one workspace.

5. **The hybrid approach may be optimal:** Combine a strong document/knowledge tool (AFFiNE/AppFlowy/Outline) with an AI layer (AnythingLLM/Khoj) for the best of both worlds.

---

## Detailed Tool Assessments

### Tier 1: Notion-like Workspace Tools

#### 1. AFFiNE

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Full workspace support with Team Workspace 1.0 |
| **User permissions per workspace** | YES - Permission-based access controls |
| **AI chat/assistant** | YES - Built-in AFFiNE AI (multimodal, writing refinement, brainstorming) |
| **Markdown editing quality** | Excellent - WYSIWYG with block-based editing |
| **Code block support** | YES - Syntax highlighting |
| **Self-hostable** | YES - Docker Compose with PostgreSQL + Redis |
| **API available** | YES - REST API for automation |
| **Active development** | Very Active - v0.25.0 (Feb 2026), frequent releases |
| **The Keep candidate?** | STRONG - Best all-around feature match |

**Strengths:**
- True "KnowledgeOS" combining docs, whiteboards, and databases
- Edgeless Mode for infinite canvas collaboration
- Split view for multi-page editing
- Mobile apps (iOS/Android)
- Pro plan at $6.75/month, Team at $10/seat/month includes AI

**Weaknesses:**
- Self-hosted AI requires additional configuration
- Team features require paid plan for cloud, but all features available self-hosted
- Still maturing compared to Notion (but rapidly improving)

**Sources:** [AFFiNE Official](https://affine.pro/what-is-new), [AFFiNE Self-Host Docs](https://docs.affine.pro/self-host-affine), [60-Day Review](https://www.fahimai.com/affine-pro)

---

#### 2. AppFlowy

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Workspaces with "Vault Workspace" for private/offline |
| **User permissions per workspace** | PARTIAL - Basic access control, evolving |
| **AI chat/assistant** | YES - Local AI via Ollama, cloud AI options |
| **Markdown editing quality** | Excellent - Native app performance (Flutter/Rust) |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker with AppFlowy Cloud |
| **API available** | PARTIAL - Evolving, limited documentation |
| **Active development** | Very Active - v0.11.4 (Mar 2026), 68.6k stars, 128 releases |
| **The Keep candidate?** | STRONG - Best for local-first with AI |

**Strengths:**
- Local-first architecture - works offline, syncs when connected
- Local AI via Ollama for complete privacy
- Native app performance (not Electron-based)
- Multi-view databases (Grid, Kanban, Calendar)
- Free forever with full features

**Weaknesses:**
- API documentation less mature than competitors
- Team features still developing
- Less enterprise-focused than Outline

**Sources:** [AppFlowy GitHub](https://github.com/AppFlowy-IO/AppFlowy), [AppFlowy Pricing](https://appflowy.com/pricing), [Self-Hosting Guide](https://appflowy.com/blog/The-Complete-Guide-to-Self-Hosting-for-Teams-and-Individuals)

---

#### 3. Outline

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Collections and team spaces |
| **User permissions per workspace** | YES - Granular permissions per collection |
| **AI chat/assistant** | PLUGIN - OpenAI/Azure integration for AI Answers |
| **Markdown editing quality** | Excellent - Clean, focused editor |
| **Code block support** | YES - Syntax highlighting |
| **Self-hostable** | YES - Docker with PostgreSQL |
| **API available** | YES - REST API + MCP Server built-in |
| **Active development** | Active - Regular releases, established project |
| **The Keep candidate?** | STRONG - Best for focused wiki/docs |

**Strengths:**
- MCP server built-in - AI assistants can search/create/edit directly
- Best-in-class team wiki experience
- Multiple auth options (OIDC, Google, SAML)
- Semantic search with pgvector
- Clean, distraction-free interface

**Weaknesses:**
- Requires external AI integration (no built-in AI)
- Less versatile than AFFiNE (no whiteboard, limited databases)
- Wiki-focused rather than all-in-one workspace

**Sources:** [Outline OpenAI Docs](https://docs.getoutline.com/s/hosting/doc/openai-iiTYCN9Nct), [Outline MCP Server](https://mcpservers.org/servers/Vortiago/mcp-outline), [Outline Changelog](https://www.getoutline.com/changelog)

---

#### 4. Plane

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Full project/workspace hierarchy |
| **User permissions per workspace** | YES - Role-based with workflows/approvals |
| **AI chat/assistant** | YES - Native Plane AI with autonomous agents |
| **Markdown editing quality** | Good - Wiki product for documentation |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker, K8s, air-gapped support |
| **API available** | YES - REST API, OAuth 2.0, SDKs, MCP server |
| **Active development** | Very Active - Frequent releases, strong community |
| **The Keep candidate?** | MODERATE - Best if PM is primary, knowledge secondary |

**Strengths:**
- AI reads across entire workspace (projects, cycles, docs)
- Autonomous agents for triaging, assignment, tracking
- Prime CLI for single-command deployment
- Real-time dashboards auto-populate
- Slack/Teams integration converts conversations to work items

**Weaknesses:**
- Project management focused - knowledge base is secondary
- Less document-centric than pure wiki tools
- May be overkill for pure knowledge management

**Sources:** [Plane Official](https://plane.so), [Plane Blog](https://plane.so/blog/top-6-open-source-project-management-software-in-2026)

---

#### 5. Focalboard (Mattermost Boards)

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Via Mattermost channels |
| **User permissions per workspace** | YES - Inherited from Mattermost |
| **AI chat/assistant** | NO - No native AI features |
| **Markdown editing quality** | Basic - Card-based, limited |
| **Code block support** | Basic |
| **Self-hostable** | YES - Part of Mattermost |
| **API available** | YES - Mattermost API |
| **Active development** | Maintenance - Community fork now |
| **The Keep candidate?** | WEAK - Limited features, no AI |

**Summary:** Best as part of Mattermost ecosystem. Not recommended standalone for knowledge management with AI.

**Sources:** [Focalboard GitHub](https://github.com/mattermost-community/focalboard), [Mattermost Boards](https://mattermost.com/marketplace/focalboard/)

---

### Tier 2: PKM Tools with AI

#### 6. Logseq

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | PARTIAL - Multiple graphs, RTC collaboration testing |
| **User permissions per workspace** | NO - Personal tool primarily |
| **AI chat/assistant** | PLUGIN - Pre-alpha AI plugin available |
| **Markdown editing quality** | Excellent - Outliner-based |
| **Code block support** | YES |
| **Self-hostable** | PARTIAL - Local-first, sync via git |
| **API available** | PARTIAL - Plugin API |
| **Active development** | Active - v1.5.0, DB version in testing |
| **The Keep candidate?** | WEAK - Personal PKM, not team-ready |

**Summary:** Excellent for personal knowledge graphs with bidirectional links. RTC (Real-Time Collaboration) is in testing but not production-ready. AI plugins are pre-alpha.

**Sources:** [Logseq Official](https://logseq.com/), [Logseq GitHub](https://github.com/logseq/logseq), [Logseq AI Plugin](https://github.com/shovon/logseq-ai)

---

#### 7. SiYuan Note

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Multiple notebooks |
| **User permissions per workspace** | PARTIAL - Basic multi-user on server |
| **AI chat/assistant** | YES - OpenAI integration (BYOK) |
| **Markdown editing quality** | Excellent - WYSIWYG block editor |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker deployment |
| **API available** | YES - REST API |
| **Active development** | Very Active - v3.6.1 (Mar 17, 2026) |
| **The Keep candidate?** | MODERATE - Good for small teams |

**Strengths:**
- Fine-grained block-level references
- Built-in AI (writing, translation, grammar)
- Active Chinese + English community
- Regular updates (daily releases)

**Weaknesses:**
- Limited collaboration features (primarily single-user)
- Chinese origin - some docs in Chinese only
- Multi-user is basic compared to team-focused tools

**Sources:** [SiYuan GitHub](https://github.com/siyuan-note/siyuan), [SiYuan Self-Host](https://minixium.com/posts/self-host-siyuan-note-siyuan/)

---

#### 8. Trilium Notes (TriliumNext)

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Hierarchical note trees |
| **User permissions per workspace** | NO - Single-user design |
| **AI chat/assistant** | PLUGIN - MCP server, Trilium Chat plugin |
| **Markdown editing quality** | Good - WYSIWYG with CKEditor |
| **Code block support** | YES - Syntax highlighting |
| **Self-hostable** | YES - Docker, native |
| **API available** | YES - REST API, ETAPI |
| **Active development** | Active - TriliumNext fork (2.7k stars) |
| **The Keep candidate?** | WEAK - Single-user, limited collaboration |

**Summary:** Excellent hierarchical note-taking with scripting capabilities. AI removed from core in v0.102.0, but MCP integration available. TriliumNext fork actively maintained.

**Sources:** [TriliumNext GitHub](https://github.com/TriliumNext/Trilium), [Trilium AI Docs](https://docs.triliumnotes.org/user-guide/llm), [Trilium Chat Plugin](https://github.com/soulsands/trilium-chat)

---

#### 9. Dendron

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Vaults and workspaces |
| **User permissions per workspace** | NO - Git-based sharing |
| **AI chat/assistant** | NO |
| **Self-hostable** | PARTIAL - Static site export |
| **Active development** | MAINTENANCE ONLY - Not recommended |
| **The Keep candidate?** | NO - Abandoned |

**Summary:** In maintenance mode. Not recommended for new projects.

**Sources:** [Dendron Official](https://www.dendron.so/)

---

#### 10. Foam

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Via VS Code workspaces |
| **User permissions per workspace** | NO - Git/GitHub based |
| **AI chat/assistant** | NO - Relies on VS Code extensions |
| **Self-hostable** | PARTIAL - GitHub Pages publishing |
| **Active development** | Preview - Still in development |
| **The Keep candidate?** | NO - Developer tool, not end-user ready |

**Summary:** Great for developers using VS Code. Not suitable for non-technical teams.

**Sources:** [Foam GitHub](https://github.com/foambubble/foam), [Foam Docs](https://foambubble.github.io/foam/)

---

### Tier 3: AI-First Knowledge Tools

#### 11. AnythingLLM

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Full workspace isolation |
| **User permissions per workspace** | YES - Admin/Manager/User roles |
| **AI chat/assistant** | YES - Core feature, any LLM |
| **Markdown editing quality** | Basic - Chat-focused |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker, Desktop app |
| **API available** | YES - REST API with auth |
| **Active development** | Very Active - v1.10.0 (Jan 2026), 54k stars |
| **The Keep candidate?** | STRONG for AI layer - Could complement doc tool |

**Strengths:**
- True multi-tenant with isolated workspaces
- Any LLM: OpenAI, Anthropic, Ollama, local models
- Document ingestion for RAG (PDF, TXT, MD, etc.)
- Role-based access with audit logs
- MIT licensed, completely free

**Weaknesses:**
- Not a document editor - chat/RAG focused
- No rich editing, databases, or project management
- Better as AI layer than standalone knowledge base

**Sources:** [AnythingLLM GitHub](https://github.com/Mintplex-Labs/anything-llm), [AnythingLLM Review](https://andrew.ooo/posts/anythingllm-all-in-one-ai-app/), [DataCamp Guide](https://www.datacamp.com/blog/anythingllm)

---

#### 12. Khoj

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | PARTIAL - User-based isolation |
| **User permissions per workspace** | YES - Multi-user with auth |
| **AI chat/assistant** | YES - Core feature, any LLM |
| **Markdown editing quality** | Basic - Search/chat focused |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker deployment |
| **API available** | YES - REST API |
| **Active development** | Active - Regular releases |
| **The Keep candidate?** | MODERATE - Good AI search layer |

**Strengths:**
- Deep research capabilities
- Custom agents and automations
- Web search integration
- Multi-user with authentication

**Weaknesses:**
- Not a document creation tool
- Less mature multi-tenant than AnythingLLM

**Sources:** [Khoj GitHub](https://github.com/khoj-ai/khoj), [Khoj Self-Host Docs](https://docs.khoj.dev/get-started/setup/)

---

#### 13. Danswer (now Onyx)

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Enterprise workspaces |
| **User permissions per workspace** | YES - RBAC, permission inheritance |
| **AI chat/assistant** | YES - Enterprise search + chat |
| **Markdown editing quality** | N/A - Search tool, not editor |
| **Code block support** | N/A |
| **Self-hostable** | YES - Docker, Kubernetes |
| **API available** | YES - Developer APIs |
| **Active development** | Active - YC W24, well-funded |
| **The Keep candidate?** | MODERATE - Enterprise search, not PKM |

**Summary:** Best for enterprise search across 40+ applications. Not a knowledge creation tool.

**Sources:** [Onyx/Danswer](https://www.ycombinator.com/companies/onyx), [Danswer GitHub](https://github.com/unoplat/danswer)

---

#### 14. Quivr

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | PARTIAL - "Brains" concept |
| **User permissions per workspace** | PARTIAL |
| **AI chat/assistant** | YES - Core feature |
| **Markdown editing quality** | Basic |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker |
| **API available** | YES |
| **Active development** | Active - 28k+ stars |
| **The Keep candidate?** | MODERATE - Good RAG platform |

**Summary:** Strong RAG capabilities for document Q&A. Less focused on collaborative knowledge creation.

**Sources:** [Quivr GitHub](https://github.com/QuivrHQ/quivr), [Quivr Docs](https://docs.quivr.app/intro)

---

#### 15. Dify

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Team workspaces |
| **User permissions per workspace** | PARTIAL - Evolving |
| **AI chat/assistant** | YES - Full AI platform |
| **Markdown editing quality** | Basic |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker, Kubernetes |
| **API available** | YES - Comprehensive |
| **Active development** | Very Active - v1.0 released 2025 |
| **The Keep candidate?** | MODERATE - AI app platform, not PKM |

**Summary:** Full AI application development platform. Overkill for knowledge management alone.

**Sources:** [Dify Official](https://dify.ai/), [Dify Knowledge Docs](https://docs.dify.ai/en/guides/knowledge-base/readme)

---

#### 16. Casibase

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Multi-tenant architecture |
| **User permissions per workspace** | YES - Casbin-based fine-grained control |
| **AI chat/assistant** | YES - Multiple LLM support |
| **Markdown editing quality** | Basic |
| **Code block support** | YES |
| **Self-hostable** | YES - Docker |
| **API available** | YES |
| **Active development** | Active |
| **The Keep candidate?** | MODERATE - Enterprise KB + chat |

**Strengths:**
- True multi-tenant with SSO
- Built-in IM and forum
- Fine-grained permissions via Casbin

**Sources:** [Casibase GitHub](https://github.com/casibase/casibase), [Casibase Docs](https://www.casibase.org/)

---

### Tier 4: Hybrid Document + AI (Commercial)

#### 17. Notion AI

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES - Full workspace model |
| **User permissions per workspace** | YES - Granular |
| **AI chat/assistant** | YES - Full AI with Agents |
| **Markdown editing quality** | Excellent |
| **Code block support** | YES |
| **Self-hostable** | NO |
| **API available** | YES |
| **Pricing** | $20/user/month (Business) for full AI |

**Summary:** Industry standard but not self-hostable. AI Agents (Sep 2025) can work autonomously for 20 minutes across hundreds of pages.

**Sources:** [Notion Pricing](https://www.notion.com/pricing), [Notion AI Review](https://cybernews.com/ai-tools/notion-ai-review/)

---

#### 18. Coda AI

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES |
| **User permissions per workspace** | YES |
| **AI chat/assistant** | YES - Credit-based |
| **Markdown editing quality** | Good |
| **Code block support** | YES |
| **Self-hostable** | NO |
| **API available** | YES |
| **Pricing** | $10-30/Doc Maker/month |

**Summary:** Strong for structured data and formulas. Credit-based AI may not suit heavy usage.

**Sources:** [Coda Pricing](https://coda.io/pricing), [Coda Review](https://thebusinessdive.com/coda-io-review)

---

#### 19. Slite

| Criteria | Assessment |
|----------|------------|
| **Multi-workspace/project** | YES |
| **User permissions per workspace** | YES |
| **AI chat/assistant** | YES - "Ask" feature |
| **Markdown editing quality** | Good |
| **Code block support** | YES |
| **Self-hostable** | NO |
| **API available** | YES |
| **Pricing** | $8-20/user/month |

**Summary:** Clean team wiki with AI search. "Verified" docs feature helps combat stale content.

**Sources:** [Slite Official](https://slite.com/), [Slite Pricing](https://slite.com/pricing)

---

## Ranked Recommendations for The Keep

### Top 5 Candidates

| Rank | Tool | Score | Rationale |
|------|------|-------|-----------|
| **1** | **AFFiNE** | 9/10 | Best all-around match: docs + whiteboards + databases + AI, self-hostable, active development, team features |
| **2** | **AppFlowy** | 8.5/10 | Local-first with Ollama AI, excellent performance, fully free, but team features still maturing |
| **3** | **Plane** | 8/10 | Best AI-native option, but PM-focused rather than pure knowledge management |
| **4** | **Outline + AnythingLLM** | 8/10 | Hybrid: Best wiki (Outline) + Best AI layer (AnythingLLM) |
| **5** | **Casibase** | 7/10 | True multi-tenant with SSO and fine permissions, but less polished UI |

### Decision Matrix

| Requirement | AFFiNE | AppFlowy | Plane | Outline | AnythingLLM |
|-------------|--------|----------|-------|---------|-------------|
| Workspaces/isolation | Yes | Yes | Yes | Yes | Yes |
| Team/sharing | Yes | Partial | Yes | Yes | Yes |
| Rich markdown | Excellent | Excellent | Good | Excellent | Basic |
| AI assistant | Built-in | Local/Cloud | Built-in | Plugin | Built-in |
| File attachments | Yes | Yes | Yes | Yes | Yes (RAG) |
| Self-hostable | Yes | Yes | Yes | Yes | Yes |
| API | Yes | Partial | Excellent | Yes | Yes |

### Architecture Recommendations

**Option A: Single Tool (Simplest)**
- Deploy **AFFiNE** self-hosted
- Use built-in AI features
- Covers 90% of requirements

**Option B: Best of Breed (Most Capable)**
- **Outline** for team wiki/docs (MCP integration)
- **AnythingLLM** for AI chat/RAG layer
- Connect via MCP for seamless AI-assisted documentation

**Option C: AI-Native PM (If PM is Priority)**
- **Plane** as primary platform
- Combines project management + knowledge + AI
- Best autonomous AI agents

---

## Research Methodology

**Sources Consulted:**
- Official product documentation and GitHub repositories
- 2025-2026 product reviews and comparisons
- Community discussions and forums
- Pricing pages (as of March 2026)

**Limitations:**
- Some self-hosted AI features require additional configuration not fully documented
- Enterprise features often require paid plans
- Rapidly evolving space - reassess quarterly

---

## Full Bibliography

1. [AFFiNE Official - What's New](https://affine.pro/what-is-new)
2. [AFFiNE Self-Host Documentation](https://docs.affine.pro/self-host-affine)
3. [AppFlowy GitHub Repository](https://github.com/AppFlowy-IO/AppFlowy)
4. [AppFlowy Self-Hosting Guide](https://appflowy.com/blog/The-Complete-Guide-to-Self-Hosting-for-Teams-and-Individuals)
5. [Outline OpenAI Integration](https://docs.getoutline.com/s/hosting/doc/openai-iiTYCN9Nct)
6. [Outline MCP Server](https://mcpservers.org/servers/Vortiago/mcp-outline)
7. [Plane Official Website](https://plane.so)
8. [Focalboard GitHub](https://github.com/mattermost-community/focalboard)
9. [Logseq GitHub](https://github.com/logseq/logseq)
10. [SiYuan GitHub](https://github.com/siyuan-note/siyuan)
11. [TriliumNext GitHub](https://github.com/TriliumNext/Trilium)
12. [AnythingLLM GitHub](https://github.com/Mintplex-Labs/anything-llm)
13. [Khoj GitHub](https://github.com/khoj-ai/khoj)
14. [Danswer/Onyx - YC Company](https://www.ycombinator.com/companies/onyx)
15. [Quivr GitHub](https://github.com/QuivrHQ/quivr)
16. [Dify Official](https://dify.ai/)
17. [Casibase GitHub](https://github.com/casibase/casibase)
18. [Notion Pricing](https://www.notion.com/pricing)
19. [Coda Pricing](https://coda.io/pricing)
20. [Slite Official](https://slite.com/)
21. [7 Best Self-Hosted Notion Alternatives 2026](https://vps.us/blog/self-hosted-alternatives-to-notion/)
22. [OpenAlternative - Notion Alternatives](https://openalternative.co/alternatives/notion)
23. [Awesome Self-Hosted Knowledge Management](https://awesome-selfhosted.net/tags/knowledge-management-tools.html)

---

*Report generated for The Keep project evaluation. Reassess in Q3 2026 as this space evolves rapidly.*
