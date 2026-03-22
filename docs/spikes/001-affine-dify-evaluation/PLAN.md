# Spike 001: Execution Plan

## Phase 1: Infrastructure Setup (Completed)

### 1.1 Service Deployment
- [x] Deploy AFFiNE on Banner:5013
- [x] Deploy Dify on Banner:5012
- [x] Deploy LobeChat on Banner:5011 (backup)
- [x] Configure Dify plugin daemon
- [x] Fix storage permissions

### 1.2 Domain Setup (Blocked - Needs Infrastructure)
- [ ] Add Traefik routes for all services
- [ ] Configure SSL certificates
- [ ] Add DNS records

**Workaround:** Use IP:Port directly (http://10.0.0.33:5013)

---

## Phase 2: AFFiNE Evaluation (Current)

### 2.1 Initial Setup
- [ ] Complete admin setup at http://10.0.0.33:5013
- [ ] Create admin account
- [ ] Explore admin settings

### 2.2 AI Configuration
- [ ] Navigate to AI/Copilot settings
- [ ] Configure LiteLLM as OpenAI-compatible provider:
  - API Base: http://10.0.0.27:2764/v1
  - API Key: sk-4r10-PRI0MrnIccaOFyFfQ
  - Models: jarvis-chat, jarvis-qwen72b
- [ ] Test AI features work

### 2.3 Feature Testing
- [ ] Create a workspace (e.g., "Health")
- [ ] Create a document (e.g., "Lab Results Summary")
- [ ] Edit the document
- [ ] Test AI chat/copilot features
- [ ] Evaluate: Can you chat ABOUT the document content?
- [ ] Check for split-pane view (files + chat)

### 2.4 Multi-Workspace Test
- [ ] Create second workspace (e.g., "HOA")
- [ ] Verify workspace isolation
- [ ] Test switching between workspaces

---

## Phase 3: Dify Backend Evaluation

### 3.1 LiteLLM Integration
- [ ] Login to Dify (http://10.0.0.33:5012)
- [ ] Go to Settings → Model Provider
- [ ] Add OpenAI-API-compatible provider
- [ ] Configure LiteLLM endpoint
- [ ] Test model connectivity

### 3.2 Knowledge Base Test
- [ ] Create knowledge base "Test KB"
- [ ] Upload 3-5 test documents
- [ ] Wait for indexing
- [ ] Test retrieval

### 3.3 Workflow Building
- [ ] Create summarization workflow
- [ ] Input: Document text
- [ ] Process: LLM summarization
- [ ] Output: Summary text
- [ ] Test via API

---

## Phase 4: Integration Testing

### 4.1 Manual Integration
- [ ] Export document from AFFiNE
- [ ] Upload to Dify knowledge base
- [ ] Query via Dify chat
- [ ] Assess workflow friction

### 4.2 Automated Integration (Optional)
- [ ] Create n8n workflow: AFFiNE → Dify
- [ ] Trigger on document changes
- [ ] Auto-sync to knowledge base

---

## Phase 5: Decision

### Evaluation Criteria

| Criterion | Weight | AFFiNE Score | Notes |
|-----------|--------|--------------|-------|
| File + Chat side-by-side | 30% | ? | |
| Edit files in UI | 20% | ? | |
| LiteLLM integration | 15% | ? | |
| Multi-workspace | 15% | ? | |
| RAG on documents | 10% | ? | |
| UX quality | 10% | ? | |

### Decision Matrix

| Score | Decision |
|-------|----------|
| 70%+ | GO - Use AFFiNE + Dify |
| 40-69% | PIVOT - Custom frontend, Dify backend |
| <40% | NO-GO - Full custom build required |

---

## Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| No Traefik/SSL | Security warnings | Use IP:Port for spike |
| Dify API auth | Can't automate | Use UI for spike |
| AFFiNE AI config unknown | May not support LiteLLM | Test in admin panel |

---

## Time Estimate

| Phase | Estimate |
|-------|----------|
| Phase 2: AFFiNE | 30-60 min |
| Phase 3: Dify | 30 min |
| Phase 4: Integration | 30 min |
| Phase 5: Decision | 15 min |
| **Total** | **2-3 hours** |
