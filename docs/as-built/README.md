# As-Built Documentation

**Purpose:** Track what was ACTUALLY built vs. what was PLANNED in the PRD.

The PRD (`docs/planning-artifacts/prd.md`) is the "as-designed" specification. Once a sprint starts, we don't modify the PRD for that sprint's scope. Instead, we document reality here.

---

## Directory Structure

```
docs/as-built/
├── README.md              # This file - how to use as-built docs
├── deviations.md          # All deviations from PRD with rationale
├── current-state.md       # Living doc: what exists TODAY
└── sprints/
    ├── sprint-1.md        # What Sprint 1 delivered
    ├── sprint-2.md        # What Sprint 2 delivered
    └── ...
```

---

## When to Update

| Event | Action |
|-------|--------|
| Implementation differs from PRD | Add to `deviations.md` BEFORE merging PR |
| Sprint completes | Create `sprints/sprint-N.md` with delivered features |
| Any time | Update `current-state.md` to reflect reality |
| Feature descoped | Document in deviation AND sprint file |

---

## Rules

1. **Never silently deviate.** If implementation differs from PRD, document it.
2. **Deviations need approval.** PM or tech lead must sign off.
3. **Keep current-state.md accurate.** It should reflect what works TODAY.
4. **Sprint files are immutable.** Once written, don't modify (it's history).

---

## Relationship to RTM

The Requirements Traceability Matrix (`docs/testing/requirements-traceability.md`) tracks test coverage. The as-built docs track implementation reality. They work together:

| Document | Answers |
|----------|---------|
| PRD | What should we build? |
| RTM | Is it tested? |
| As-Built | What did we actually build? |

---

## Workflow

```
1. Read PRD requirement
2. Implement feature
3. If matches PRD → update RTM status to [x]
4. If differs → add deviation → update RTM with [!]
5. Write tests → update RTM with test case links
6. End of sprint → write sprint summary
7. Always keep current-state.md accurate
```
