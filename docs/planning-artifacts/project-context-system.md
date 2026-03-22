# The Keep - Project Context System Specification

**Version:** 1.0
**Date:** 2026-03-22
**Status:** Draft
**Type:** Requirements Specification (informs Architecture)

---

## Overview

Each project in The Keep has a `.keep/` directory containing AI context files. These files define the AI's identity, boundaries, capabilities, and procedures for that project. Inspired by [OpenClaw's workspace files](https://docs.openclaw.ai/concepts/agent-workspace) but adapted for The Keep's knowledge management focus.

**Design Principles:**
- **Index + Folder Pattern:** Index files stay small, point to detailed files in folders
- **Separation of Concerns:** Soul (why), Guardrails (never), Capabilities (what), Procedures (how)
- **Dify Compatibility:** Procedure files should map to Dify workflow DSL for automation
- **Transparency:** User can see and edit everything the AI knows/does
- **Safety First:** Soft deletes, provenance tracking, explicit never-dos

---

## Directory Structure

```
project-{name}/
├── .keep/                          # Project AI context
│   │
│   │── SOUL.md                     # Identity & purpose (small, pointers)
│   │── INSTRUCTIONS.md             # How AI should behave (ChatGPT-style instructions)
│   │── GUARDRAILS.md               # Boundaries & never-dos (critical)
│   │── AUTHORITIES.md              # Trusted sources with domain ratings
│   │── CAPABILITIES.md             # Index → capabilities/
│   │── PROCEDURES.md               # Index → procedures/
│   │── SOURCES.md                  # Data source registry (auto-maintained)
│   │── PLUGINS.md                  # Index → plugins/ (MCP integrations)
│   │── USER.md                     # User profile for this project
│   │
│   │── settings.yaml               # Project settings (model, theme, layout)
│   │── icons.yaml                  # Custom icon registry
│   │── tags.yaml                   # Custom tag definitions
│   │── commands.yaml               # Custom chat commands (/project-specific)
│   │
│   ├── procedures/                 # Individual procedure files
│   │   ├── {procedure-name}.md     # Human-readable + Dify-compatible
│   │   └── ...
│   │
│   ├── capabilities/               # Detailed capability definitions
│   │   ├── file-access.md
│   │   ├── integrations.md
│   │   └── action-permissions.md
│   │
│   ├── plugins/                    # MCP plugin configurations
│   │   ├── {plugin-name}.md        # Active plugins
│   │   └── _available/             # Available but not configured
│   │
│   ├── templates/                  # Project-specific templates
│   │   ├── {template-name}.md
│   │   └── ...
│   │
│   ├── workflows/                  # Workflow definitions (Dify-compatible)
│   │   ├── {workflow-name}.md
│   │   └── ...
│   │
│   └── trash/                      # Soft delete destination
│       └── {date}/                 # 30-day retention
│
├── memories/                       # Atomic fact storage
│   ├── health/
│   ├── preferences/
│   └── inventory/
│
├── files/                          # Project content (user files)
│
└── conversations/                  # Chat history (optional persistence)
```

---

## File Specifications

### SOUL.md

**Purpose:** Define why this project exists and how the AI adds value.
**Size Target:** 50 lines max - focused, inspirational, with pointers.

```markdown
# {Project Name} - Soul

## Why I Exist
{1-3 sentences: the mission of this project}

## How I Add Value
- {Value proposition 1}
- {Value proposition 2}
- {Value proposition 3}

## Success Looks Like
- [ ] {Success criterion 1}
- [ ] {Success criterion 2}

## My Personality Here
- **Tone:** {e.g., Direct but supportive}
- **Proactivity:** {e.g., Flag concerns, don't alarm}
- **Detail Level:** {e.g., Summarize first, details on request}

## See Also
- [Guardrails](GUARDRAILS.md) - What I must never do
- [Capabilities](CAPABILITIES.md) - What I can access
- [Procedures](PROCEDURES.md) - How I handle tasks
- [Sources](SOURCES.md) - What data I have
```

**Created:** During Soul Discovery onboarding flow
**Updated:** User edits or periodic review prompts

---

### GUARDRAILS.md

**Purpose:** Explicit boundaries and safety rules. Standalone critical file.
**Enforcement:** Checked before any action. Hard stops, not suggestions.

```markdown
# {Project Name} - Guardrails

## NEVER Do (Hard Stops)
- ❌ {Never-do 1 with rationale}
- ❌ {Never-do 2 with rationale}
- ❌ Delete files without using trash (30-day recovery required)
- ❌ Share data outside this project without explicit approval

## ALWAYS Do (Required Behaviors)
- ✅ {Always-do 1}
- ✅ {Always-do 2}
- ✅ Cite source file/memory for factual claims
- ✅ Confirm before destructive actions
- ✅ Log all file modifications

## Data Safety Rules
| Action | Behavior |
|--------|----------|
| Delete file | → .keep/trash/{date}/, 30-day retention |
| Edit file | Track previous version in provenance |
| Bulk operation (>5 items) | Require explicit confirmation |
| Export data | Per-instance approval required |

## Escalation Triggers
{Situations that require special handling}
- {Trigger 1} → {Response}
- {Trigger 2} → {Response}

## Domain-Specific Rules
{Project-type specific guardrails}
```

**Created:** During Soul Discovery or from template
**Updated:** When user adds boundaries or after incidents

---

### PROCEDURES.md (Index)

**Purpose:** Registry of all procedures with triggers and links.
**Pattern:** Index file pointing to detailed procedure files.

```markdown
# {Project Name} - Procedures

## Active Procedures

| Procedure | Trigger | File | Dify Workflow |
|-----------|---------|------|---------------|
| {Name} | {When triggered} | [link](procedures/{name}.md) | {workflow-id or "manual"} |

## Procedure Standards
- Each procedure: trigger, steps, guardrail checks, outputs
- Must reference GUARDRAILS.md where applicable
- Include rollback/undo steps where relevant
- Dify-compatible format for automation

## Adding Procedures
1. Create new file in `procedures/`
2. Follow procedure template
3. Add row to this index
4. Optionally: Create Dify workflow and link
```

---

### procedures/{name}.md (Individual Procedure)

**Purpose:** Detailed workflow definition, human-readable AND Dify-compatible.
**Format:** Markdown with structured sections that map to Dify workflow nodes.

```markdown
# Procedure: {Name}

## Metadata
- **Trigger:** {What initiates this procedure}
- **Guardrails:** See [GUARDRAILS.md](../GUARDRAILS.md) - {specific rules}
- **Dify Workflow:** {workflow-id} or "manual-only"
- **Automation Level:** full | semi | manual

## Inputs
| Input | Type | Source | Required |
|-------|------|--------|----------|
| {input1} | {type} | {where it comes from} | yes/no |

## Steps

### Step 1: {Name}
- **Action:** {What to do}
- **Dify Node:** {node type: llm, code, knowledge, etc.}
- **Details:** {Specifics}

### Step 2: {Name}
- **Action:** {What to do}
- **Dify Node:** {node type}
- **Condition:** {If applicable - maps to Dify IF/ELSE}

{Continue steps...}

## Outputs
| Output | Type | Destination |
|--------|------|-------------|
| {output1} | {type} | {where it goes} |

## Guardrail Checks
- [ ] {Check 1 before/during/after}
- [ ] {Check 2}

## Rollback / Undo
{How to reverse this procedure if needed}

## Dify Export
{If automated, include Dify workflow JSON reference or embed}
```

---

### CAPABILITIES.md (Index)

**Purpose:** Registry of what the AI can access and do.

```markdown
# {Project Name} - Capabilities

## Quick Reference

| Category | Summary | Details |
|----------|---------|---------|
| File Access | {X files, Y folders} | [file-access.md](capabilities/file-access.md) |
| Integrations | {N active} | [integrations.md](capabilities/integrations.md) |
| Permissions | {summary} | [action-permissions.md](capabilities/action-permissions.md) |

## Data Sources
| Source | Type | Items | Last Indexed |
|--------|------|-------|--------------|
| /files/{folder}/ | {types} | {count} | {date} |
| /memories/{category}/ | Atomic facts | {count} | Live |

## Linked Projects
| Project | Relationship | Access Level |
|---------|--------------|--------------|
| {project} | {how related} | {read/query/full} |

## See Also
- [SOURCES.md](SOURCES.md) - Detailed source inventory
- [PLUGINS.md](PLUGINS.md) - MCP integrations
```

---

### SOURCES.md

**Purpose:** Auto-maintained registry of all data sources.
**Maintenance:** Updated automatically when files/memories change.

```markdown
# {Project Name} - Data Sources

*Auto-generated: {timestamp}*

## Files

### /files/labs/
| File | Type | Size | Added | Indexed |
|------|------|------|-------|---------|
| {filename} | PDF | {size} | {date} | ✅ |

### /files/notes/
{Same table format}

## Memories

| Category | Count | Last Updated |
|----------|-------|--------------|
| health | {n} | {date} |
| preferences | {n} | {date} |

## Conversations
| Session | Date | Messages | Indexed |
|---------|------|----------|---------|
| {id} | {date} | {count} | ✅/❌ |

## Index Health
- **Total indexed:** {n} items
- **Pending indexing:** {n} items
- **Failed indexing:** {n} items (see logs)
- **Last full reindex:** {date}
```

---

### PLUGINS.md (Index)

**Purpose:** Registry of MCP integrations and extensions.

```markdown
# {Project Name} - Plugins (MCP)

## Active Plugins

| Plugin | Purpose | Permissions | Config |
|--------|---------|-------------|--------|
| {name} | {what it does} | {read/write/etc} | [link](plugins/{name}.md) |

## Available (Not Configured)

| Plugin | Purpose | Setup Required |
|--------|---------|----------------|
| {name} | {what it does} | {what's needed} |

## Plugin Guardrails
- All plugins respect project [GUARDRAILS.md](GUARDRAILS.md)
- Write operations require user confirmation
- Data stays within project unless explicitly exported
- Plugin errors don't crash main AI session

## Adding Plugins
1. Check `plugins/_available/` for templates
2. Copy to `plugins/` and configure
3. Add to this index
4. Test in sandbox mode first
```

---

### plugins/{name}.md (Individual Plugin)

```markdown
# Plugin: {Name}

## Overview
- **MCP Server:** {server identifier}
- **Purpose:** {what this enables}
- **Status:** Active / Inactive / Error

## Permissions
| Permission | Granted | Rationale |
|------------|---------|-----------|
| {permission} | ✅/❌ | {why} |

## Configuration
```json
{
  "server": "{mcp-server-id}",
  "auth": "{auth-method}",
  "settings": {
    // Plugin-specific settings
  }
}
```

## Use Cases
- "{Example user request}" → {How plugin helps}

## Guardrail Integration
- Respects: {specific guardrails this plugin must follow}
- Additional: {plugin-specific safety rules}
```

---

### USER.md

**Purpose:** User context specific to this project.

```markdown
# User Profile: {Project Name}

## Identity
- **Name:** {preferred name}
- **Role:** {relationship to this project}

## Preferences (This Project)
- **Communication:** {how to talk to user here}
- **Detail Level:** {summary vs detailed}
- **Proactivity:** {suggest vs wait to be asked}

## Context
{Relevant background for this project}

## Goals
{What user is trying to achieve}

## See Also
- Global user profile: {link if exists}
- [SOUL.md](SOUL.md) - Project purpose
```

---

### INSTRUCTIONS.md

**Purpose:** ChatGPT-style instructions for how AI should behave in this project.

```markdown
# {Project Name} - Instructions

## Communication Style
- {How to speak: formal, casual, technical, supportive}
- {Level of detail: brief summaries vs comprehensive}
- {Proactivity: suggest things or wait to be asked}

## When Responding
- {Always do: cite sources, ask clarifying questions, etc.}
- {Prefer: tables over lists, code examples, etc.}
- {Avoid: jargon, assumptions, etc.}

## Domain Context
- {Key context AI needs to know for this project}
- {Terminology specific to this domain}

## Output Formats
- {Preferred formats for different types of responses}
```

---

### AUTHORITIES.md

**Purpose:** Trusted sources with domain-specific expertise ratings.

```markdown
# {Project Name} - Authorities

## Trusted Experts

| Name | Type | Domains | Notes |
|------|------|---------|-------|
| Andrew Huberman | Person | sleep: 9, supplements: 8, neuroscience: 9 | Huberman Lab podcast |
| Peter Attia | Person | longevity: 9, exercise: 8, metabolic health: 9 | The Drive podcast |

## Trusted Publications

| Name | Type | Domains | Notes |
|------|------|---------|-------|
| Examine.com | Publication | supplements: 9, nutrition: 8 | Evidence-based |

## How to Use
- When citing health advice, prefer higher-rated sources
- "What would {expert} say?" uses their domain expertise
- Weights inform RAG ranking and synthesis
```

---

### settings.yaml

**Purpose:** Project-level settings and preferences.

```yaml
# Project Settings
project:
  name: "{project name}"
  icon: "🏥"  # or custom icon reference
  description: "{brief description}"

ai:
  default_model: "jarvis-chat"
  fallback_models: ["jarvis-qwen72b", "claude-api"]
  temperature: 0.7

display:
  theme: "system"  # light, dark, system
  default_layout: "standard"  # or saved layout name

features:
  auto_save: true
  auto_save_delay_ms: 2000
  show_citations: true
  incognito_default: false
```

---

### icons.yaml

**Purpose:** Custom icon registry for this project.

```yaml
# Custom Icons
icons:
  traefik:
    source: simple-icons
    name: traefik
  postgres:
    source: simple-icons
    name: postgresql
  banner:
    source: upload
    file: icons/banner-server.png
  hulk:
    source: upload
    file: icons/hulk-server.png

# Usage in content: ::traefik:: renders as icon
```

---

### tags.yaml

**Purpose:** Custom tag definitions for this project.

```yaml
# Tag Definitions
tags:
  # Functional tags
  due:
    type: date
    format: "YYYY-MM-DD"
    example: "#due:2026-04-15"
  reminder:
    type: date
    format: "YYYY-MM-DD"
  priority:
    type: enum
    values: [high, medium, low]
    colors:
      high: red
      medium: yellow
      low: green
  status:
    type: enum
    values: [todo, in-progress, done, blocked]
  context:
    type: string
    example: "#context:doctor-visit"

  # Custom hierarchical tags
  health:
    children: [labs, medications, supplements, symptoms]
  infrastructure:
    children: [docker, networking, storage, monitoring]
```

---

### commands.yaml

**Purpose:** Custom chat commands specific to this project.

```yaml
# Custom Commands
commands:
  /health-summary:
    description: "Generate comprehensive health summary"
    template: |
      Synthesize my current health status from:
      - Recent lab results
      - Current medications and supplements
      - Health profile and goals
      Include trends and areas of concern.

  /recipe:
    description: "Suggest a recipe based on inventory and preferences"
    template: |
      Based on my pantry inventory, dietary preferences, and health goals,
      suggest a recipe I can make tonight.

  /pill-box:
    description: "Show pill box layout for the week"
    sources: ["supplements/daily-stack.md"]

  /deploy-checklist:
    description: "Generate deployment checklist"
    project_type: "infrastructure"
```

---

### templates/ Directory

**Purpose:** Project-specific templates for common document types.

```
templates/
├── lab-results.md      # Template for new lab result entries
├── supplement-entry.md # Template for supplement additions
├── meeting-notes.md    # Template for meeting documentation
└── weekly-review.md    # Template for weekly health review
```

**Example template (lab-results.md):**
```markdown
---
template: lab-results
variables: [date, lab_type, provider]
---

# Lab Results - {{date}}

**Type:** {{lab_type}}
**Provider:** {{provider}}

## Results

| Test | Value | Reference Range | Status |
|------|-------|-----------------|--------|
| | | | |

## Notes

## Action Items
- [ ]
```

---

### workflows/ Directory

**Purpose:** Workflow definitions for automation (Dify-compatible).

```
workflows/
├── process-lab-results.md   # Extract and file lab results
├── weekly-health-review.md  # Generate weekly summary
└── import-screenshot.md     # Process screenshot with AI vision
```

---

## Dify Integration

### Procedure → Dify Workflow Mapping

| Procedure Element | Dify Node Type |
|-------------------|----------------|
| Step (LLM action) | LLM Node |
| Step (code/logic) | Code Node |
| Step (RAG query) | Knowledge Retrieval Node |
| Condition/Branch | IF/ELSE Node |
| Loop | Iteration Node |
| Input | Start Node variables |
| Output | End Node / Answer Node |

### Sync Strategy

**Option A: Dify as Source of Truth**
- Procedures defined in Dify workflow builder
- Export to .keep/procedures/ as documentation
- The Keep reads but doesn't modify

**Option B: Procedures as Source of Truth**
- Procedures defined in markdown
- Sync tool generates Dify workflows
- Changes in procedures → regenerate Dify workflow

**Option C: Bidirectional (Complex)**
- Either can be edited
- Sync detects changes and reconciles
- Conflict resolution required

**Recommended for MVP:** Option A (Dify as source) with markdown export for visibility.

---

## Soul Discovery Flow (Onboarding)

### Questions → Files

| Question | Maps To |
|----------|---------|
| "What's this project for?" | SOUL.md → Why I Exist |
| "What would make this valuable?" | SOUL.md → How I Add Value |
| "What does success look like?" | SOUL.md → Success Looks Like |
| "How should I communicate here?" | INSTRUCTIONS.md |
| "Any boundaries I should respect?" | GUARDRAILS.md |
| "Who are your trusted experts?" | AUTHORITIES.md |
| "What files are you bringing?" | SOURCES.md (auto-populated) |
| "Any tools/integrations to connect?" | PLUGINS.md |
| "Any custom tags or commands?" | tags.yaml, commands.yaml |

### Flow Options

| Approach | Experience |
|----------|------------|
| **Guided** | AI asks questions, generates files |
| **Template** | Pick project type, get starter files |
| **Skip** | Minimal defaults, configure later |
| **Import** | Copy from another project |

---

## MVP Scope

| Component | MVP | MVP+1 | v2+ |
|-----------|-----|-------|-----|
| SOUL.md | ✅ Full | - | - |
| INSTRUCTIONS.md | ✅ Full | - | - |
| GUARDRAILS.md | ✅ Full | - | - |
| AUTHORITIES.md | ✅ Basic | Full domain ratings | AI-weighted retrieval |
| PROCEDURES.md + folder | ✅ Index + 3-5 core | More procedures | Custom procedure builder |
| CAPABILITIES.md | ✅ Basic | Full registry | - |
| SOURCES.md | ✅ Auto-generated | - | - |
| PLUGINS.md | 🔶 Structure only | Basic MCP | Full MCP ecosystem |
| USER.md | ✅ Basic | - | - |
| settings.yaml | ✅ Core settings | Extended settings | - |
| icons.yaml | ✅ Emoji + upload | Simple Icons lib | Full icon management |
| tags.yaml | ✅ Basic tags | Custom tag types | Tag inheritance |
| commands.yaml | 🔶 Structure only | Custom commands | Command builder |
| templates/ | ✅ Manual templates | AI template fill | Template suggestions |
| workflows/ | 🔶 Manual | Dify sync | Bidirectional |
| Trash/soft delete | ✅ 30-day | - | Configurable retention |
| Soul Discovery UI | ✅ Guided flow | Templates | Import/export |

---

## Open Questions

1. **Dify sync direction:** Which is source of truth for procedures?
2. **Cross-project context:** How much of .keep/ is shared vs isolated?
3. **Versioning:** Track changes to context files? Git-like history?
4. **Templates:** Ship with project-type templates (Health, Finance, Learning)?
5. **Migration:** How to import from other systems (Obsidian, Notion)?

---

## Related Artifacts

- [Product Brief](product-brief.md) - Overall product vision
- [PRD](prd.md) - Detailed requirements (in progress)
- [Roadmap](roadmap.md) - Release timeline
- [Architecture](architecture.md) - Technical implementation (pending update)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-22 | Initial specification created during PRD Journey Mapping |
