# PRD Deviations Log

**Purpose:** Document every case where implementation differs from PRD specification.

**Rule:** Add deviation BEFORE merging the PR. Do NOT silently deviate.

---

## How to Document a Deviation

```markdown
### DEV-XXX: Short title
- **FR:** FR-XX-YY (the requirement that differs)
- **PRD Says:** [exact text from PRD]
- **Actual:** [what we implemented]
- **Reason:** [why we deviated]
- **Impact:** Low / Medium / High
- **Approved By:** [name], [date]
- **PR/Ticket:** #XXX
```

---

## Deviation Categories

| Type | When to Use |
|------|-------------|
| **Scope Reduction** | Feature implemented with less capability than PRD |
| **Scope Addition** | Feature has more capability than PRD (rare - avoid) |
| **Technical Constraint** | PRD not feasible, alternative implemented |
| **Descoped** | Feature removed entirely from current release |
| **Deferred** | Feature moved to later sprint/phase |

---

## Active Deviations

_No deviations documented yet. Project has not started implementation._

---

## Template for New Deviation

Copy this when adding a deviation:

```markdown
### DEV-XXX: [Title]
- **FR:** FR-XX-YY
- **PRD Says:**
- **Actual:**
- **Reason:**
- **Impact:** Low / Medium / High
- **Approved By:** [name], [date]
- **PR/Ticket:** #XXX
```

---

## Deviation Index

| ID | FR | Title | Impact | Sprint |
|----|-----|-------|--------|--------|
| _none yet_ | | | | |

---

## Review Checklist (For PR Reviewers)

Before approving a PR that introduces a deviation:

- [ ] Deviation documented in this file
- [ ] FR identified correctly
- [ ] Reason is valid and documented
- [ ] Impact assessed
- [ ] PM/Tech Lead approved
- [ ] RTM updated with `[!]` status
- [ ] current-state.md updated if needed
