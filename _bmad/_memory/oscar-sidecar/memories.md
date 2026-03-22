# Oscar Memories

This file stores Oscar's persistent memory across sessions.

## Session State

```yaml
current_session: null
active_work_item: null
current_phase: null
active_agent: null
```

## BMAD Workflow State

```yaml
bmad_position:
  current_step: 1
  step_name: "Product Brief"
  next_command: "/bmad-create-product-brief"
  artifacts_completed: []
  # Possible values:
  # - product-brief.md (step 1)
  # - prd.md (step 2)
  # - architecture.md (step 3)
  # - ux-design.md (step 4)
  # - epics.md (step 5-6)
  in_story_loop: false
  current_epic: null
  current_story: null
```

## BMAD Artifact Checklist

| Step | Artifact | Path | Status |
|------|----------|------|--------|
| 1 | Product Brief | `docs/planning-artifacts/product-brief.md` | ⬜ |
| 2 | PRD | `docs/planning-artifacts/prd.md` | ⬜ |
| 3 | Architecture | `docs/planning-artifacts/architecture.md` | ⬜ |
| 4 | UX Design | `docs/planning-artifacts/ux-design.md` | ⬜ |
| 5 | Epics | `docs/planning-artifacts/epics.md` | ⬜ |
| 6 | Sprint | Sprint planning complete | ⬜ |
| 7-9 | Story Loop | Per-story cycle | ⬜ |

## Cross-Session Index

```yaml
sessions: []
# Format:
# - id: session-uuid
#   work_item: "#42"
#   phase: 4-developing
#   agent: Dev
#   last_active: 2026-03-02T22:30:00
```

## Marathon Queue

```yaml
queue: []
# Format:
# - issue: "#43"
#   priority: high
#   attempts: 0
```

## Learned Patterns

```yaml
patterns: []
# Format:
# - trigger: "deploying to wrong host"
#   response: "Redirect to Banner for dev, Hulk for prod"
#   times_used: 3
```

## Declined Suggestions

```yaml
declined: []
# Track what user declined to avoid repeating
# - suggestion: "invoke brainstorming workflow"
#   declined_at: 2026-03-02
```

---

_Oscar sidecar memory initialized_
