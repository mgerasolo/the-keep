# Multi-Tenancy Architecture Synthesis for The Keep

**Date:** 2026-03-18
**Purpose:** Address the critical requirement for project isolation with selective sharing

---

## The Core Challenge

You need **separate knowledge projects** with **different sharing permissions**:

| Project | Privacy Level | Sharing |
|---------|---------------|---------|
| HOA Board | Semi-public | Share with 5 board members |
| Personal Health | Private | Only you, never shared |
| Work Project | Team | Share with coworkers |
| General Knowledge | Private | Personal reference |

**This is NOT just multi-user auth. It's multi-tenant isolation with selective sharing.**

---

## Research Findings Summary

### What We Evaluated

| Research Area | Tools Assessed | Key Finding |
|---------------|----------------|-------------|
| AI Chat UIs | LobeChat, Open WebUI, LibreChat, AnythingLLM, Khoj | Most are user-based, not project-based isolation |
| Notion Alternatives | AFFiNE, AppFlowy, Outline, Plane, SiYuan | Workspace features vary significantly |
| PKM Tools | Logseq, Trilium, Dendron, Foam | Mostly single-user, personal tools |
| AI-First Tools | Quivr, Dify, Casibase, Danswer | Enterprise focus, may be overkill |

### Tools That Actually Support Per-Project Isolation

| Tool | Multi-Project | Per-Project Sharing | Verdict |
|------|---------------|---------------------|---------|
| **AFFiNE** | Yes - Workspaces | Yes - Team permissions | STRONG |
| **Plane** | Yes - Projects | Yes - Role-based | STRONG (PM-focused) |
| **Outline** | Yes - Collections | Yes - Granular permissions | STRONG (Wiki-focused) |
| **AnythingLLM** | Yes - Workspaces | Yes - Admin/Manager/User | STRONG (AI-only) |
| **Casibase** | Yes - Multi-tenant | Yes - Fine-grained (Casbin) | MODERATE |
| **AppFlowy** | Yes - Workspaces | Partial - Basic access | DEVELOPING |
| **LobeChat** | No - User sessions | No | WEAK for this use case |
| **Open WebUI** | No - User-based | No | WEAK for this use case |
| **Khoj** | Partial - User isolation | Partial | WEAK |

---

## Architecture Options

### Option 1: Single Platform (AFFiNE)

```
AFFiNE Self-Hosted
├── Workspace: HOA Board
│   ├── Owner: You
│   ├── Members: Board members (view/edit)
│   └── AI: Built-in AFFiNE AI
├── Workspace: Personal Health
│   ├── Owner: You (only)
│   ├── Members: None
│   └── AI: Built-in
├── Workspace: Work Project
│   ├── Owner: You
│   ├── Members: Coworkers
│   └── AI: Built-in
└── Workspace: General Knowledge
    ├── Owner: You (only)
    └── AI: Built-in
```

**Pros:**
- Single system to maintain
- Built-in AI for all workspaces
- Modern UI with docs + whiteboards + databases
- Self-hostable with Docker

**Cons:**
- AI features less mature than dedicated AI tools
- No inbox/capture workflow (we'd still build this)
- Less control over AI model selection

**Verdict:** Best single-platform option if workspace isolation meets needs.

---

### Option 2: Hybrid - Document + AI Layer

```
┌─────────────────────────────────────────────────────────────┐
│                      DOCUMENT LAYER                          │
│                      (Outline)                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  HOA Board   │ │   Health     │ │    Work      │  ...    │
│  │ Collection   │ │ Collection   │ │ Collection   │         │
│  │ (shared)     │ │ (private)    │ │ (team)       │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
└─────────────────────────┬───────────────────────────────────┘
                          │ MCP Connection
┌─────────────────────────▼───────────────────────────────────┐
│                        AI LAYER                              │
│                   (AnythingLLM)                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │ HOA Workspace│ │Health Workspace│ │Work Workspace│       │
│  │ (your HOA docs)│ (your health)│ │(your work docs)│       │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Outline:** Document creation, markdown editing, team wiki
- **AnythingLLM:** AI chat/RAG, one workspace per project
- **MCP Bridge:** Outline's built-in MCP server for AI access
- **Inbox MCP:** Our custom capture workflow

**Pros:**
- Best-in-class document editing (Outline)
- Best-in-class AI/RAG (AnythingLLM)
- True workspace isolation in both layers
- Choice of any LLM (local or cloud)
- MCP integration already exists

**Cons:**
- Two systems to maintain
- Users interact with two interfaces
- Sync complexity between layers

**Verdict:** Most capable, but more complex.

---

### Option 3: Enhanced LobeChat (Our Current Plan + Projects)

```
LobeChat (existing deployment)
│
├── Knowledge Bases (File-based project isolation)
│   ├── KB: hoa-board/        ← Files in MinIO bucket
│   ├── KB: personal-health/  ← Files in MinIO bucket
│   ├── KB: work-project/     ← Files in MinIO bucket
│   └── KB: general/          ← Files in MinIO bucket
│
├── Agents (Project-specific assistants)
│   ├── Agent: HOA Keeper     ← Only searches hoa-board KB
│   ├── Agent: Health Keeper  ← Only searches personal-health KB
│   └── Agent: Work Keeper    ← Only searches work-project KB
│
└── Inbox MCP Server (Custom)
    └── Project-aware capture
```

**How sharing would work:**
- LobeChat currently doesn't share KBs between users
- **Workaround:** Each shared project = separate LobeChat instance
- **Or:** External sharing via exported markdown/links

**Pros:**
- Already deployed
- Existing work reusable
- MCP ecosystem available

**Cons:**
- **No per-KB sharing** - major limitation
- Workarounds feel hacky
- Multiple instances = operational burden

**Verdict:** Works for single-user, but sharing requires separate instances.

---

### Option 4: Multiple Isolated Instances

```
Instance 1: Personal Keep           Instance 2: HOA Keep
(the-keep.nextlevelguild.com)      (hoa.nextlevelguild.com)
┌─────────────────────────┐        ┌─────────────────────────┐
│ Your private content    │        │ HOA documents           │
│ - Health                │        │ - Meeting notes         │
│ - General knowledge     │        │ - Policies              │
│ - Personal notes        │        │ - Shared with board     │
│                         │        │                         │
│ Only you have access    │        │ Auth: board members     │
└─────────────────────────┘        └─────────────────────────┘

Instance 3: Work Keep
(work-keep.internal.com)
┌─────────────────────────┐
│ Work project docs       │
│ - Shared with team      │
│ Auth: work SSO          │
└─────────────────────────┘
```

**Pros:**
- Perfect isolation (different databases)
- Different auth per instance (Authentik can handle)
- No risk of data leakage
- Each instance can use different AI models

**Cons:**
- Operational overhead (3+ deployments)
- No unified view across projects
- Duplicated infrastructure
- Can't cross-reference between projects

**Verdict:** Most secure, but high operational cost.

---

### Option 5: Custom Shell + Embedded Components

```
The Keep (Custom Next.js)
├── Auth Layer (Authentik SSO)
│
├── Project System (Custom)
│   ├── Project: HOA Board
│   │   ├── Members: [you, board1, board2...]
│   │   ├── Files: MinIO bucket hoa-board/
│   │   ├── Vectors: Qdrant collection hoa-board
│   │   └── AI: assistant-ui connected to project context
│   │
│   ├── Project: Personal Health
│   │   ├── Members: [you]
│   │   └── ... (same structure)
│   │
│   └── Project: Work
│       ├── Members: [you, coworker1, coworker2...]
│       └── ...
│
├── Embedded Components
│   ├── Chat: assistant-ui (React component)
│   ├── Editor: Tiptap or BlockNote
│   ├── Files: Chonky file manager
│   └── Vectors: Qdrant (per-project collections)
│
└── Inbox System
    └── Custom workflow with n8n
```

**Pros:**
- Exactly what you need, nothing more
- True project-based isolation
- Per-project sharing with member lists
- Single unified interface
- Full control over UX

**Cons:**
- Most development work (4-8 weeks)
- Must integrate multiple components
- Ongoing maintenance burden

**Verdict:** Most tailored, but highest effort.

---

## Recommendation

### For Your Use Case

Given:
- Multiple projects with different privacy levels
- Need to share specific projects with specific people
- Already have LobeChat deployed
- Have n8n for automation
- Self-hosted preference

**Recommended Path: Option 2 (Hybrid: Outline + AnythingLLM)**

**Why:**
1. **Outline** gives you proper per-collection sharing with granular permissions
2. **AnythingLLM** gives you isolated AI workspaces per project
3. **Both are MIT licensed** - no copyleft concerns
4. **Both are actively maintained** - 11k+ and 54k+ stars
5. **MCP already connects them** - Outline has a built-in MCP server
6. **Inbox MCP** work still applies - capture to project-specific locations

### Implementation Plan

**Phase 1: Deploy Outline (3 days)**
- Docker Compose on Banner
- Configure PostgreSQL
- Set up collections for each project
- Configure authentication (Authentik OIDC)
- Test per-collection sharing

**Phase 2: Deploy AnythingLLM (2 days)**
- Docker on Banner
- Create workspace per project
- Connect to LiteLLM for model access
- Import test documents per workspace

**Phase 3: MCP Integration (1 week)**
- Configure Outline MCP server
- Test AI assistant accessing Outline docs
- Build Inbox MCP with project awareness
- Connect n8n for processing workflow

**Phase 4: Unified Experience (1 week)**
- Custom portal/dashboard (optional)
- Or: Use Outline as primary interface with AI chat sidebar
- Configure notifications and digests

### Alternative Quick Path

If you want to stay with LobeChat and accept the limitations:

1. **Use LobeChat for personal projects** (single-user, all your private stuff)
2. **Deploy separate Outline instance for shared projects** (HOA, work)
3. **Connect both via MCP/n8n**

This gives you the best of both worlds with less integration work.

---

## Decision Points for You

1. **Is per-project sharing truly required?**
   - If no: LobeChat + Inbox MCP works fine
   - If yes: Need Outline or AFFiNE

2. **How many shared projects?**
   - If 1-2: Separate instances might be simpler
   - If 3+: Need a platform with proper multi-tenancy

3. **Who are the shared users?**
   - If technical: Any solution works
   - If non-technical: AFFiNE or Outline have better UX

4. **What's the priority?**
   - Speed to value: AFFiNE (single platform)
   - Maximum capability: Outline + AnythingLLM
   - Existing investment: Enhanced LobeChat + workarounds

---

## Next Steps

1. **Confirm requirements** - Do you need per-project sharing with external users?
2. **Choose architecture** - Single platform vs hybrid
3. **Proof of concept** - Deploy chosen solution on Banner
4. **Migrate inbox work** - Adapt MCP server for new architecture

Ready to discuss?
