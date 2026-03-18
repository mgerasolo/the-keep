# Oscar Memories

This file stores Oscar's persistent memory across sessions.

## Session State

```yaml
current_session: "2026-03-06-spine-protocol"
active_work_item: "Spine Protocol - Complete"
current_phase: "completed"
active_agent: "Oscar"
```

## Completed Work (2026-03-06)

**Spine Protocol** - Documentation is the backbone.

**Deliverables:**
- Spine Protocol: `/mnt/foundry_resources/protocols/spine/PROTOCOL.md`
- Artifact Checklists: `/mnt/foundry_resources/protocols/spine/artifact-checklists/`
  - ROUTER.md, deployment.md, n8n-workflow.md, domain-dns.md
  - script.md, protocol.md, bugfix.md, one-off.md
- n8n restructured: Per-workflow folders with docs + JSON
- Grist: Troubleshooting_Log table created for Sherlock patterns
- GitHub: Issue #621 for tracking

**Key Principle:** Documentation happens FIRST, not last. Objectives before code.

**Agent Roles:**
- Oscar: Enforces checklists, guides work
- Augie: Audits compliance, verifies docs match reality
- Sherlock: Uses Troubleshooting_Log for pattern learning

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
patterns:
  - trigger: "creating new artifact"
    response: "Route to spine/artifact-checklists/ROUTER.md, enforce Spine Protocol"
    times_used: 1
  - trigger: "documentation at end"
    response: "Spine Protocol: Doc FIRST, not last. Create objectives.md before building"
    times_used: 1
  - trigger: "deploying to wrong host"
    response: "Redirect to Banner for dev, Hulk for prod"
    times_used: 3
  - trigger: "task tracking needed"
    response: "Use standard markers: [ ] pending, [x] completed, [-] blocked, [~] in progress"
    times_used: 1
```

## Watcher Integration

```yaml
watcher_spec: "one-offs/active/2026-03-watcher/SPINE-INTEGRATION-SPEC.md"
integration_status: "spec_complete"
dual_write_targets:
  - Grist (tabular queries)
  - SurrealDB (graph relationships)
graph_relationships:
  - spawned_from: conversation → conversation
  - linked_to: conversation → issue
  - has_task: conversation → task
  - works_on: conversation → project
sync_mode: "bidirectional"
parse_trigger: "explicit_command"  # /oscar:sync
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
