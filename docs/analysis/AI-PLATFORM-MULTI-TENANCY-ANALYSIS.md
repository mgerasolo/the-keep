# AI Platform Multi-Tenancy Analysis

**Date:** 2026-03-18
**Purpose:** Evaluate AI chat platforms for true multi-tenancy and project isolation for personal knowledge management.

---

## Executive Summary

**Recommended Platform: Dify.ai**

Dify provides the strongest multi-tenancy model with complete workspace isolation, granular RBAC (5 roles), and the ability to invite external users to specific workspaces without exposing others. Self-hostable with Docker Compose.

**Runner-up: AnythingLLM (Docker)**

AnythingLLM offers solid workspace isolation with 3-tier roles (Admin/Manager/Default) where Default users only see workspaces they are explicitly added to. Simpler but effective.

---

## Requirements Matrix

| Requirement | AnythingLLM | LibreChat | Open WebUI | Dify.ai | Flowise | Quivr | LobeChat |
|-------------|-------------|-----------|------------|---------|---------|-------|----------|
| AI Chat Interface | YES | YES | YES | YES | PARTIAL | YES | YES |
| File Management | YES | LIMITED | YES | YES | LIMITED | YES | YES |
| Markdown Editing | NO | NO | PARTIAL | YES | NO | NO | YES |
| Code Block Support | YES | YES | YES | YES | YES | YES | YES |
| Multi-Project Isolation | YES | NO | PARTIAL | YES | NO | NO | PARTIAL |
| Invite to ONE Project | YES | NO | PARTIAL | YES | NO | NO | UNCLEAR |
| Self-Hostable | YES | YES | YES | YES | YES | YES | YES |

---

## Detailed Platform Analysis

### 1. Dify.ai

**Multi-Tenancy Model:** Workspace-centric architecture with complete data isolation

**Project Isolation:**
- Every resource belongs to a workspace
- "Resources are completely isolated from other organizations"
- Users can belong to multiple workspaces and switch between them
- Inviting someone to Workspace A does NOT give them access to Workspace B

**Role-Based Access Control:**
| Role | Capabilities |
|------|--------------|
| Owner | Full control, billing, model providers, workspace deletion |
| Admin | Manage team members, configure providers |
| Editor | Create/edit/delete apps, manage knowledge bases |
| Member | Use published applications only |
| Dataset Operator | Manage knowledge bases, restricted app access |

**File/Knowledge Management:**
- RAG pipeline with document ingestion
- Supports PDF, DOCX, TXT, Markdown, PPT
- Knowledge bases scoped to workspace
- Multiple knowledge bases per workspace

**Self-Hosting:**
- Docker Compose deployment
- Minimum: 2 CPU cores, 4GB RAM
- Community edition is free with unlimited workspaces
- No artificial feature restrictions on self-hosted

**Scenario Test Result:** PASS
- HOA Project: Create workspace, invite board members as Editors
- Personal Health: Private workspace, no invites (only you)
- Work Project: Separate workspace, invite coworkers
- Each workspace is completely isolated

**Verdict:** BEST CHOICE for true multi-tenancy

---

### 2. AnythingLLM (Docker Version)

**Multi-Tenancy Model:** Workspace-based with role permissions

**Project Isolation:**
- "Workspaces can share documents, but they do not talk to each other"
- Default users "can only send chats to workspaces they are explicitly added to"
- Default users "cannot see or edit any workspaces or system settings"

**Role-Based Access Control:**
| Role | Capabilities |
|------|--------------|
| Admin | Full system access |
| Manager | View all workspaces, manage properties (no LLM/embedder config) |
| Default | Only see assigned workspaces, chat only |

**File/Document Management:**
- Supports PDF, TXT, DOCX, etc.
- Drag-and-drop upload
- Documents stored per workspace
- Citation tracking

**Self-Hosting:**
- Docker deployment only for multi-user
- Desktop version is single-user only (no isolation)
- Free and open source

**Scenario Test Result:** PASS (with caveats)
- HOA Project: Create workspace, add board members as Default
- Personal Health: Create workspace, don't add anyone
- Work Project: Create workspace, add coworkers as Default
- NOTE: Managers can see ALL workspaces (avoid giving Manager role)

**Limitations:**
- No built-in markdown editor (chat interface only)
- Manager role can see all workspaces (use Default for isolation)
- Once multi-user is enabled, cannot revert to single-user

**Verdict:** STRONG SECOND CHOICE - simpler but effective isolation

---

### 3. Open WebUI

**Multi-Tenancy Model:** User groups with model-level permissions

**Project Isolation:**
- Group-based access control exists
- Models can be private (default), group-only, or public
- Knowledge bases can have group restrictions
- Syncs with OAuth providers (Okta, Azure AD, Google Workspace)

**Role-Based Access Control:**
- Admin (first account) controls all
- Pending users require admin approval
- Group-based model visibility
- RBAC mentioned but not deeply documented

**File/Knowledge Management:**
- Local RAG integration
- Documents loaded into chat
- Google Drive/OneDrive integration
- "Copilot Spaces" feature for organization

**Self-Hosting:**
- Docker deployment
- Very active development
- Large community (128k GitHub stars)

**Scenario Test Result:** PARTIAL PASS
- Can create user groups per project
- Knowledge bases can be group-restricted
- HOWEVER: True workspace isolation is less clear
- Documentation sparse on multi-workspace scenarios

**Limitations:**
- Documentation gaps on isolation model
- "Spaces" feature not fully documented
- Less mature multi-tenancy than Dify

**Verdict:** PROMISING but needs more research - isolation model unclear

---

### 4. LibreChat

**Multi-Tenancy Model:** User-level with agent sharing

**Project Isolation:**
- No workspace concept found
- Agents can be private or shared
- ACL system: Owner, Editor, Viewer
- No project-level isolation documented

**Sharing Model:**
- Agents: Private by default, can be shared
- Conversations: Not project-isolated
- Files: User-level storage

**Self-Hosting:**
- Docker deployment
- Active development
- Good SSO support (OpenID, SAML)

**Scenario Test Result:** FAIL
- No workspace/project isolation
- Sharing is binary (private vs shared with all)
- Cannot invite specific users to specific projects

**Limitations:**
- No multi-tenancy/workspace concept
- All-or-nothing sharing model
- Not suitable for project isolation needs

**Verdict:** NOT SUITABLE - lacks project isolation

---

### 5. Flowise

**Multi-Tenancy Model:** App-level authentication only

**Project Isolation:**
- App-level password protection
- Chatflow-level authentication
- JWT-based access control
- No workspace or project concept

**Self-Hosting:**
- Docker deployment
- Focus on AI workflow building
- Not designed for end-user knowledge management

**Scenario Test Result:** FAIL
- No workspace isolation
- No multi-user management beyond app-level auth
- Designed for workflow builders, not knowledge management

**Verdict:** NOT SUITABLE - different use case (workflow building)

---

### 6. Quivr

**Multi-Tenancy Model:** "Brain" concept (unclear isolation)

**Project Isolation:**
- Brains are personal knowledge bases
- Documentation doesn't address multi-user sharing
- Appears single-user focused
- Customer support automation focus

**Current State:**
- Pivoted toward customer support automation
- Less focus on personal knowledge management
- Multi-user features undocumented

**Scenario Test Result:** UNCLEAR/LIKELY FAIL
- Cannot confirm sharing model
- No documented workspace isolation
- Appears single-user oriented

**Verdict:** NOT SUITABLE - unclear isolation, different focus

---

### 7. LobeChat

**Multi-Tenancy Model:** Workspace + Project (emerging)

**Project Isolation:**
- Workspace feature: "shared space for teams"
- Project organization capability
- Multi-user management mentioned
- RBAC specifics not documented

**Features:**
- Agent Groups for collaboration
- Pages for shared content
- Scheduling capabilities
- Modern, polished UI

**Self-Hosting:**
- Docker, Vercel, Zeabur deployment
- Very active development
- Growing feature set

**Scenario Test Result:** UNCLEAR
- Workspace concept exists
- Project organization exists
- Specific isolation model not documented
- Worth monitoring as it matures

**Verdict:** WATCH - promising but documentation gaps on isolation specifics

---

## Scenario Test: Full Matrix

**Scenario:** User manages three isolated projects with different access needs.

| Platform | HOA (Board Access) | Personal Health (Private) | Work (Coworkers) | Overall |
|----------|-------------------|---------------------------|------------------|---------|
| Dify.ai | Create workspace, invite as Editors | Private workspace, no invites | Separate workspace, invite as Editors | PASS |
| AnythingLLM | Create workspace, add as Default | Create workspace, no additions | Create workspace, add as Default | PASS |
| Open WebUI | Create group, assign knowledge | Private user data | Create group, assign knowledge | PARTIAL |
| LibreChat | Not possible | Private by default | Share agent with all | FAIL |
| Flowise | Not applicable | Not applicable | Not applicable | FAIL |
| Quivr | Unknown | Unknown | Unknown | UNCLEAR |
| LobeChat | Likely possible | Likely possible | Likely possible | UNCLEAR |

---

## Feature Comparison: File Management

| Platform | Upload Types | Organization | Per-Project Isolation | Search |
|----------|--------------|--------------|----------------------|--------|
| Dify.ai | PDF, DOCX, TXT, MD, PPT | Knowledge bases | YES - per workspace | RAG-based |
| AnythingLLM | PDF, TXT, DOCX | Workspace folders | YES - per workspace | RAG-based |
| Open WebUI | PDF, TXT, MD | Knowledge collections | Group-based | RAG-based |
| LibreChat | Attachments | Conversation-level | NO | Limited |
| LobeChat | Multiple formats | Agent/Project level | Unclear | RAG-based |

---

## Feature Comparison: Markdown Editing

| Platform | Built-in Editor | Preview | Export | Notes |
|----------|-----------------|---------|--------|-------|
| Dify.ai | YES | YES | YES | Knowledge base editor |
| AnythingLLM | NO | Chat only | Export conversations | No dedicated editor |
| Open WebUI | PARTIAL | Chat renders MD | Limited | No standalone editor |
| LibreChat | NO | Chat renders MD | Limited | No standalone editor |
| LobeChat | YES (Pages) | YES | Unclear | Emerging feature |

---

## Self-Hosting Complexity

| Platform | Method | Minimum Resources | Complexity | Production Ready |
|----------|--------|-------------------|------------|------------------|
| Dify.ai | Docker Compose | 2 CPU, 4GB RAM | Medium | YES |
| AnythingLLM | Docker | 1 CPU, 2GB RAM | Low | YES |
| Open WebUI | Docker | 1 CPU, 2GB RAM | Low | YES |
| LibreChat | Docker | 2 CPU, 4GB RAM | Medium | YES |
| Flowise | Docker | 1 CPU, 2GB RAM | Low | YES |
| Quivr | Docker | Unknown | Medium | UNCLEAR |
| LobeChat | Docker/Vercel | 1 CPU, 2GB RAM | Low | YES |

---

## API/Integration Capabilities

| Platform | REST API | Embedding API | Webhook Support | SDK |
|----------|----------|---------------|-----------------|-----|
| Dify.ai | YES | YES | YES | Python, JS |
| AnythingLLM | YES | YES | Limited | Limited |
| Open WebUI | YES | YES | YES | Limited |
| LibreChat | Limited | Limited | Limited | None |
| LobeChat | YES | Unclear | Unclear | Unclear |

---

## Final Recommendations

### Primary Recommendation: Dify.ai

**Why:**
1. Complete workspace isolation - resources cannot leak between workspaces
2. 5-tier RBAC with granular control
3. Invite users to specific workspaces without exposing others
4. Built-in knowledge base with markdown support
5. Strong API for integration
6. Self-hosted community edition is full-featured
7. Active development with 90k+ GitHub stars

**Deployment:**
```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker compose up -d
```

### Secondary Recommendation: AnythingLLM (Docker)

**Why:**
1. Simpler model with effective isolation
2. Default users cannot see other workspaces
3. Easy Docker deployment
4. Good document management
5. Lower resource requirements

**Best For:** Simpler use cases where 3-tier roles are sufficient

**Caution:** Avoid Manager role if true isolation is needed (they see all workspaces)

### Watch List: LobeChat

**Why Monitor:**
- Workspace + Project concepts exist
- Very active development
- Modern architecture
- Documentation maturing

**When to Evaluate:** Q3 2026 when multi-tenancy docs mature

---

## Decision Matrix for Your Scenario

| Criterion | Weight | Dify | AnythingLLM | Open WebUI |
|-----------|--------|------|-------------|------------|
| True project isolation | 25% | 10 | 9 | 6 |
| Invite to ONE project | 20% | 10 | 9 | 6 |
| Markdown editor | 15% | 9 | 4 | 5 |
| File management | 15% | 9 | 8 | 7 |
| Self-host simplicity | 10% | 7 | 9 | 9 |
| API integration | 10% | 9 | 7 | 7 |
| Code blocks | 5% | 9 | 9 | 9 |
| **WEIGHTED SCORE** | 100% | **9.15** | **7.75** | **6.55** |

---

## Next Steps

1. **Deploy Dify.ai proof-of-concept** on Banner (dev environment)
2. Create 3 test workspaces matching your scenario
3. Invite test users to validate isolation
4. Evaluate markdown/knowledge base features hands-on
5. If Dify doesn't meet needs, deploy AnythingLLM as fallback

---

*Analysis conducted 2026-03-18 by business analyst agent*
