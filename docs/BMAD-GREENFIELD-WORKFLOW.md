# BMAD Greenfield Project Workflow

Official sequence for starting a new project from scratch using the BMAD methodology.

## Quick Reference

| Phase | Artifact | Skill Command | Prerequisites |
|-------|----------|---------------|---------------|
| **1. Analysis** | Product Brief | `/bmad-create-product-brief` | None (starting point) |
| **2. Planning** | PRD | `/bmad-create-prd` | Product Brief |
| **2. Planning** | UX Design | `/bmad-create-ux-design` | PRD |
| **3. Solutioning** | Architecture | `/bmad-create-architecture` | PRD |
| **3. Solutioning** | Epics & Stories | `/bmad-create-epics-and-stories` | PRD + Architecture + UX |
| **3. Solutioning** | Readiness Check | `/bmad-check-implementation-readiness` | All above |
| **4. Implementation** | Sprint Planning | `/bmad-sprint-planning` | Epics & Stories |
| **4. Implementation** | Story Execution | `/bmad-dev-story` | Story file |

---

## Phase 1: Analysis

### Step 1.0: Research (Optional but Recommended)

Before diving into the Product Brief, consider gathering intel:

| Research Type | Command | Purpose |
|---------------|---------|---------|
| Market Research | `/bmad-market-research` | Competitors, customer needs, trends |
| Domain Research | `/bmad-domain-research` | Industry terminology, regulations |
| Technical Research | `/bmad-technical-research` | Feasibility, architecture options |

**Output:** Research reports in `docs/planning-artifacts/`

### Step 1.1: Product Brief (REQUIRED START)

**Command:** `/bmad-create-product-brief`

The Product Brief is your starting point. It captures:
- Vision and problem statement
- Target users and personas
- Success metrics
- High-level scope boundaries

**Output:** `docs/planning-artifacts/product-brief.md`

**Gate:** Product Brief must exist before proceeding to PRD.

---

## Phase 2: Planning

### Step 2.1: Product Requirements Document (PRD)

**Command:** `/bmad-create-prd`

**Prerequisite:** Product Brief

The PRD expands the brief into:
- Detailed functional requirements (FRs)
- Non-functional requirements (NFRs)
- User journeys and flows
- Success criteria with measurable targets

**Output:** `docs/planning-artifacts/prd.md`

**Validation:** Use `/bmad-validate-prd` to check quality

### Step 2.2: UX Design Specification

**Command:** `/bmad-create-ux-design`

**Prerequisite:** PRD

**Note:** Required if your project has a UI. Skip if purely backend/API.

Creates:
- Design system decisions (colors, typography, spacing)
- Component strategy
- User journey wireframes
- Accessibility requirements
- Responsive patterns

**Output:** `docs/planning-artifacts/ux-design.md`

---

## Phase 3: Solutioning

### Step 3.1: Architecture

**Command:** `/bmad-create-architecture`

**Prerequisite:** PRD (UX optional but loaded if exists)

Defines:
- Technology stack decisions
- System structure and patterns
- API contracts and data models
- Infrastructure requirements
- Security architecture

**Output:** `docs/planning-artifacts/architecture.md`

### Step 3.2: Epics & Stories

**Command:** `/bmad-create-epics-and-stories`

**Prerequisites:** PRD + Architecture + UX (if exists)

This workflow:
1. Extracts ALL requirements from PRD, Architecture, and UX
2. Groups requirements into logical Epics
3. Breaks Epics into implementable Stories
4. Creates dependency mapping

**Output:** `docs/planning-artifacts/epics.md`

### Step 3.3: Implementation Readiness Check (GATE)

**Command:** `/bmad-check-implementation-readiness`

**Prerequisites:** PRD, Architecture, Epics (UX if exists)

This is the **quality gate** before implementation:
- Validates all artifacts are complete
- Checks alignment between PRD ↔ Architecture ↔ Epics
- Ensures every requirement maps to a story
- Identifies gaps before you start coding

**Output:** Readiness report with GO/NO-GO decision

**IMPORTANT:** Do NOT proceed to Phase 4 until this passes.

---

## Phase 4: Implementation

### Step 4.1: Sprint Planning

**Command:** `/bmad-sprint-planning`

**Prerequisite:** Epics & Stories

Organizes work into sprints:
- Prioritizes stories
- Creates sprint backlog
- Sets sprint goals

**Output:** Sprint tracking document

### Step 4.2: Story Development (Repeating)

**Command:** `/bmad-dev-story`

**Prerequisite:** Individual story file

For each story:
1. Load story requirements
2. Implement with TDD
3. Code review
4. Mark complete

**Output:** Working code, tests, documentation

### Step 4.3: Supporting Workflows

| Command | Purpose |
|---------|---------|
| `/bmad-create-story` | Create individual story file |
| `/bmad-code-review` | Adversarial code review |
| `/bmad-sprint-status` | Check sprint progress |
| `/bmad-retrospective` | Post-epic lessons learned |
| `/bmad-correct-course` | Handle significant changes |

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: ANALYSIS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │   Market     │    │   Domain     │    │  Technical   │         │
│   │  Research    │    │  Research    │    │  Research    │         │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
│          │ (optional)        │ (optional)        │ (optional)       │
│          └───────────────────┼───────────────────┘                  │
│                              ▼                                      │
│                    ┌─────────────────┐                              │
│                    │  PRODUCT BRIEF  │ ◀── START HERE               │
│                    └────────┬────────┘                              │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 2: PLANNING                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────┐                              │
│                    │       PRD       │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│                    │   UX DESIGN     │ (if UI exists)               │
│                    └────────┬────────┘                              │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: SOLUTIONING                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────┐                              │
│                    │  ARCHITECTURE   │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│                    │ EPICS & STORIES │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                             ▼                                       │
│              ┌──────────────────────────────┐                       │
│              │   IMPLEMENTATION READINESS   │ ◀── GATE              │
│              │        CHECK (GO/NO-GO)      │                       │
│              └──────────────┬───────────────┘                       │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 4: IMPLEMENTATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────┐                              │
│                    │ SPRINT PLANNING │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│                             ▼                                       │
│          ┌──────────────────────────────────────┐                   │
│          │              SPRINT LOOP              │                  │
│          │  ┌────────────┐    ┌──────────────┐  │                  │
│          │  │ DEV STORY  │───▶│ CODE REVIEW  │  │                  │
│          │  └────────────┘    └──────────────┘  │                  │
│          │          ▲                │          │                   │
│          │          └────────────────┘          │                   │
│          └──────────────────┬───────────────────┘                   │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│                    │  RETROSPECTIVE  │                              │
│                    └─────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Current Project Status Tracker

Use this section to track where you are in the workflow.

| # | Phase | Artifact | Status | Date | Notes |
|---|-------|----------|--------|------|-------|
| 1 | Analysis | Product Brief | ⬜ Pending | | |
| 2 | Planning | PRD | ⬜ Pending | | |
| 3 | Planning | UX Design | ⬜ Pending | | |
| 4 | Solutioning | Architecture | ⬜ Pending | | |
| 5 | Solutioning | Epics & Stories | ⬜ Pending | | |
| 6 | Solutioning | Readiness Check | ⬜ Pending | | |
| 7 | Implementation | Sprint Planning | ⬜ Pending | | |
| 8 | Implementation | Sprint 1 | ⬜ Pending | | |

**Status Legend:**
- ⬜ Pending
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked

---

## Alternative Paths

### Quick Flow (Solo Dev Mode)

For simpler projects or rapid prototyping:

**Command:** `/bmad-quick-spec` → `/bmad-quick-dev`

Bypasses full ceremony for:
- Personal projects
- Simple features
- Proof of concepts

### Brownfield Projects (Existing Codebase)

For documenting/understanding existing projects:

**Command:** `/bmad-document-project`

Analyzes existing code to generate:
- Project context documentation
- Architecture understanding
- Gap analysis

---

## Agent Quick Reference

| Agent | Icon | Primary Commands |
|-------|------|------------------|
| Analyst (Mary) | 📊 | Research, Brainstorming, Product Brief |
| PM (Product Manager) | 📋 | PRD, Validation |
| UX Designer | 🎨 | UX Design |
| Architect | 🏗️ | Architecture |
| SM (Scrum Master) | 🏃 | Sprint Planning, Stories |
| Dev | 💻 | Implementation |
| QA | 🧪 | Testing, Reviews |

---

## File Locations

| Artifact | Default Path |
|----------|--------------|
| Product Brief | `docs/planning-artifacts/product-brief.md` |
| PRD | `docs/planning-artifacts/prd.md` |
| UX Design | `docs/planning-artifacts/ux-design.md` |
| Architecture | `docs/planning-artifacts/architecture.md` |
| Epics | `docs/planning-artifacts/epics.md` |
| Stories | `docs/implementation-artifacts/stories/` |
| Sprint Tracking | `docs/implementation-artifacts/sprints/` |

---

*Generated from BMAD v6.2.0 workflow analysis*
