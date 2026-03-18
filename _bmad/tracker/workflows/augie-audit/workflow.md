# Augie Audit Workflow

**Command:** `/augie:audit [artifact]`
**Agent:** Augie (read-only compliance enforcer)

## Purpose

Audit artifacts against Spine Protocol compliance rules. Verify documentation exists, matches reality, and registries are updated.

## Workflow Steps

### Step 1: Identify Artifact Type

```
Input: artifact path or name
Output: artifact_type, checklist_path
```

Check artifact against type indicators from spine.yaml:
- deployment: docker-compose.yml, stack.yml, apps/ location
- n8n-workflow: workflow-v*.json, n8n/ location
- script: *.sh, scripts/ location
- one-off: one-offs/active/YYYY-MM-* pattern
- protocol: PROTOCOL.md, protocols/ location

### Step 2: Load Applicable Rules

```yaml
rulesets:
  - spine.yaml          # Spine Protocol rules
  - project/docs.yaml   # Project documentation rules
  - security.yaml       # Security checks (if applicable)
```

### Step 3: Execute Spine Checks

#### Documentation Checks (SPINE-001 to SPINE-003)

| Check | Pass Condition |
|-------|----------------|
| SPINE-001 | objectives.md or equivalent exists |
| SPINE-002 | Status indicator present |
| SPINE-003 | Task list with standard markers |

#### Registry Checks (SPINE-010 to SPINE-013)

| Check | Pass Condition | Query |
|-------|----------------|-------|
| SPINE-010 | Grist Deployments entry | `tables/Deployments/records` |
| SPINE-011 | DEPLOYMENTS.md entry | grep for artifact name |
| SPINE-012 | Grist N8n_Workflows entry | `tables/N8n_Workflows/records` |
| SPINE-013 | n8n README entry | grep for workflow name |

#### Changelog Check (SPINE-020)

| Check | Pass Condition |
|-------|----------------|
| SPINE-020 | Grist Change_Log has recent entry |

#### Documentation Quality (SPINE-030 to SPINE-032)

| Check | Pass Condition |
|-------|----------------|
| SPINE-030 | Documented values match actual |
| SPINE-031 | systems.md exists for APIs |
| SPINE-032 | admin.md exists for services |

### Step 4: Check Exemptions

Before reporting violations:
1. Load exemptions from `augie-sidecar/exemptions/`
2. Check if artifact+rule combination has valid exemption
3. If exempted, note but don't fail

### Step 5: Generate Audit Report

```markdown
## Compliance Audit: {artifact}

**Artifact Type:** {type}
**Checklist:** {checklist}
**Audit Time:** {timestamp}

### Verdict: PASS / FAIL

### Findings

| Severity | Rule | Issue | Remediation |
|----------|------|-------|-------------|
| CRITICAL | SPINE-001 | No objectives.md found | Create objectives.md |
| WARNING | SPINE-020 | No Change_Log entry | Add to Grist Change_Log |

### Summary

- CRITICAL: {n}
- WARNING: {n}
- INFO: {n}
```

### Step 6: Log Audit

Append to `augie-sidecar/audit-log.md`:

```markdown
## {timestamp} - {artifact}

**Verdict:** PASS/FAIL
**Rules checked:** {n}
**Violations:** {critical}/{warning}/{info}
```

### Step 7: Return to Oscar (if called from gate)

```yaml
gate_result:
  pass: true/false
  critical_count: 0
  blocking_rules: []
```

## Usage Examples

```
/augie:audit /mnt/foundry_infrastructure/apps/surrealdb/
/augie:audit /mnt/foundry_resources/n8n/youtube-ingest/
/augie:audit one-offs/active/2026-03-watcher/
```

## Integration with Oscar

Oscar calls Augie at phase gates:
- Before advancing from Phase 3 to Phase 4
- On `/oscar:complete` before closing issue
- On-demand via `/augie:audit`

Interpretation:
- CRITICAL violations -> Block advancement
- WARNING violations -> Log but allow
- INFO -> Advisory only
