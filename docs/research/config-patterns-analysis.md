# Configuration File Patterns Analysis

Research into configuration patterns from Claude Code, VS Code, and Cursor to inform The Keep's `.keep/` directory structure.

**Date:** 2026-03-22
**Status:** Research Complete

---

## 1. Claude Code `.claude/` Directory

### 1.1 Directory Structure Overview

Claude Code uses a hierarchical configuration system with multiple scopes:

| Scope | Location | Who It Affects | Shared? |
|-------|----------|----------------|---------|
| **Managed** | Server/MDM policies, `managed-settings.json` | All users on machine | Yes (IT deployed) |
| **User** | `~/.claude/` | You, across all projects | No |
| **Project** | `.claude/` in repository | All collaborators | Yes (committed) |
| **Local** | `.claude/settings.local.json` | You, in this repo only | No (gitignored) |

### 1.2 User-Level Structure (`~/.claude/`)

```
~/.claude/
├── CLAUDE.md                    # Global AI instructions (memory file)
├── settings.json                # Global settings
├── settings.local.json          # Local overrides (not shared)
├── history.jsonl                # Prompt history
├── agents/                      # Custom subagent definitions (.md files)
├── commands/                    # Custom slash commands (.md files)
├── hooks/                       # Shell scripts for lifecycle automation
├── rules/                       # Behavioral rules (.md files, auto-loaded)
├── skills/                      # Reusable skill packages
├── plugins/                     # Installed plugins
├── memories/                    # Persistent memory storage
├── todos/                       # Task tracking (JSON)
├── config/                      # Additional configuration
├── file-history/                # File checkpoints
├── sessions/                    # Session state
├── shell-snapshots/             # Shell environment snapshots
├── db/                          # Local databases
├── cache/                       # Cache files
├── debug/                       # Debug logs
├── tasks/                       # Task management
├── teams/                       # Agent teams configuration
└── telemetry/                   # Usage metrics
```

### 1.3 Project-Level Structure (`.claude/`)

```
.claude/
├── CLAUDE.md                    # Project-specific AI instructions (if not in repo root)
├── settings.json                # Project settings (committed)
├── settings.local.json          # Local project settings (gitignored)
├── agents/                      # Project subagents
├── commands/                    # Project slash commands
├── hooks/                       # Project lifecycle hooks
├── rules/                       # Project behavioral rules (auto-loaded)
├── skills/                      # Project skills
├── templates/                   # Response/output templates
├── conversations/               # Conversation summaries (baton protocol)
├── CONVERSATION_HISTORY.md      # Conversation overview
├── BUGS.md                      # Discovered bugs tracking
├── DECISIONS.md                 # Architecture decisions
├── ENHANCEMENTS.md              # Enhancement tracking
└── USER_FEEDBACK.md             # User feedback collection
```

### 1.4 settings.json Structure

```json
{
  "env": {
    "VARIABLE_NAME": "value"
  },
  "permissions": {
    "allow": ["Tool(pattern)", "Bash(git *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)", "WebFetch"],
    "defaultMode": "acceptEdits",
    "additionalDirectories": ["../shared/"]
  },
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker", "git"],
    "filesystem": {
      "allowWrite": ["/tmp/build"],
      "denyWrite": ["/etc"],
      "denyRead": ["~/.aws/credentials"],
      "allowRead": ["."]
    },
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "allowLocalBinding": true,
      "allowUnixSockets": ["/var/run/docker.sock"]
    }
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate.sh",
            "timeout": 60
          }
        ]
      }
    ],
    "SessionStart": [...],
    "PostToolUse": [...],
    "Stop": [...]
  },
  "attribution": {
    "commit": "Co-Authored-By: AI <ai@example.com>",
    "pr": ""
  },
  "statusLine": {
    "type": "command",
    "command": "npx ccusage statusline"
  },
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/mcp-server"],
      "env": { "API_KEY": "..." }
    }
  },
  "enabledPlugins": {
    "plugin@marketplace": true
  },
  "worktree": {
    "symlinkDirectories": ["node_modules"],
    "sparsePaths": ["packages/app"]
  }
}
```

### 1.5 Hooks Lifecycle Events

Claude Code supports 26+ lifecycle events:

| Phase | Events |
|-------|--------|
| **Session** | `SessionStart`, `SessionEnd`, `InstructionsLoaded`, `UserPromptSubmit` |
| **Tool Execution** | `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` |
| **Agent Operations** | `SubagentStart`, `SubagentStop`, `TeammateIdle`, `TaskCompleted` |
| **Session Control** | `Stop`, `StopFailure`, `ConfigChange` |
| **Maintenance** | `PreCompact`, `PostCompact`, `WorktreeCreate`, `WorktreeRemove` |
| **Notifications** | `Notification`, `Elicitation`, `ElicitationResult` |

**Hook Handler Types:**
1. **Command** - Shell scripts receiving JSON via stdin
2. **HTTP** - POST requests to endpoints
3. **Prompt** - Single-turn LLM evaluation
4. **Agent** - Subagent with tool access

**Exit Codes:**
- `0` = Success (process JSON on stdout)
- `2` = Blocking error (prevents action)
- Other = Non-blocking error (logged)

### 1.6 Rules (`.claude/rules/`)

Rules are markdown files auto-loaded at session start. They provide persistent behavioral instructions.

```markdown
# Rule Name

Instructions that apply throughout the session.

| Trigger | Response |
|---------|----------|
| User asks for X | Do Y |
| Before action Z | Check A |

## Enforcement

- Rule 1
- Rule 2
```

### 1.7 Commands (`.claude/commands/`)

Commands are markdown files with YAML frontmatter defining slash commands.

```markdown
---
description: Brief description of command
category: optional-category
allowed-tools: Bash, Read, Glob
---

# Command Name

Instructions for what the command does.

## Usage

/command-name [arguments]

## Steps

1. Step one
2. Step two
```

### 1.8 Skills (`.claude/skills/`)

Skills are reusable prompt packages with frontmatter and workflow definitions.

```
skill-name/
├── SKILL.md                # Main skill definition with frontmatter
├── workflow.md             # Multi-step workflow
├── steps/                  # Individual step files
│   ├── step-01-init.md
│   └── step-02-process.md
├── templates/              # Output templates
├── data/                   # Reference data (CSV, JSON)
└── bmad-skill-manifest.yaml  # Skill metadata
```

**SKILL.md Format:**
```markdown
---
name: skill-name
description: What the skill does
---

Instructions for the skill.

<activation>
1. Load this file
2. Follow workflow
3. Present menu
</activation>
```

### 1.9 Agents (`.claude/agents/`)

Subagents are specialized AI assistants with custom prompts and tool permissions.

```markdown
---
name: agent-name
description: Agent purpose
allowed-tools: Read, Grep, Bash
---

# Agent Persona

You are a specialized assistant for...

## Capabilities

- Capability 1
- Capability 2

## Instructions

When activated, follow these steps...
```

---

## 2. VS Code `.vscode/` Directory

### 2.1 Directory Structure

```
.vscode/
├── settings.json           # Workspace settings
├── extensions.json         # Recommended extensions
├── launch.json             # Debug configurations
├── tasks.json              # Task runner configurations
├── snippets/               # Code snippets
│   └── language.code-snippets
├── *.code-workspace        # Multi-root workspace definition
└── c_cpp_properties.json   # C/C++ specific settings
```

### 2.2 settings.json Structure

```json
{
  // Editor Settings
  "editor.fontSize": 14,
  "editor.formatOnSave": true,
  "editor.tabSize": 2,

  // File Settings
  "files.autoSave": "afterDelay",
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true
  },

  // Language-Specific Settings
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // Extension Settings
  "peacock.color": "#2ecc71",

  // Search/Explorer
  "search.exclude": {
    "**/dist": true
  }
}
```

**Settings Precedence (lowest to highest):**
1. Default settings
2. User settings
3. Remote settings
4. Workspace settings
5. Workspace folder settings
6. Language-specific variants
7. Policy settings

### 2.3 extensions.json Structure

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ],
  "unwantedRecommendations": [
    "deprecated-extension.id"
  ]
}
```

### 2.4 launch.json Structure

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ],
  "compounds": [
    {
      "name": "Full Stack",
      "configurations": ["Debug Node.js", "Debug Chrome"]
    }
  ]
}
```

### 2.5 tasks.json Structure

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "test",
      "type": "shell",
      "command": "npm test",
      "group": "test"
    }
  ]
}
```

---

## 3. Cursor Rules

### 3.1 File Formats

**Legacy Format: `.cursorrules`**
- Plain text file in project root
- Still supported but deprecated
- Simple format, no structure requirements

**Modern Format: `.cursor/rules/*.mdc`**
- Markdown with YAML frontmatter
- Scoped with glob patterns
- Can be auto-attached or manually triggered

### 3.2 .mdc File Structure

```markdown
---
description: Brief description for Agent Requested rules
globs: ["*.py", "src/**/*.js"]
alwaysApply: false
---

# Rule Title

Instructions for the AI when this rule applies.

## Code Style

- Use TypeScript strict mode
- Prefer functional patterns

## Architecture

- Follow clean architecture
- Keep business logic in domain layer
```

### 3.3 Rule Types

| Type | Trigger | Use Case |
|------|---------|----------|
| **Always Apply** | Every request | Global coding standards |
| **Auto Attached** | File glob match | Language-specific rules |
| **Agent Requested** | AI reads description | Contextual rules |
| **Manual** | User invokes | Specialized tasks |

### 3.4 Common Rule Categories

```
.cursor/rules/
├── frontend/
│   ├── react.mdc
│   ├── typescript.mdc
│   └── styling.mdc
├── backend/
│   ├── api-design.mdc
│   └── database.mdc
├── testing/
│   ├── unit-tests.mdc
│   └── e2e-tests.mdc
├── general/
│   ├── code-style.mdc
│   └── documentation.mdc
└── workflows/
    ├── feature-dev.mdc
    └── debugging.mdc
```

### 3.5 Best Practices

1. **Token Efficiency** - Keep rules concise (under 500 lines)
2. **Focused Scope** - One concern per rule file
3. **Clear Globs** - Use specific patterns for auto-attachment
4. **Tech Stack Combinations** - Create rules for stack intersections
5. **Composable** - Reference other rules instead of duplicating

---

## 4. Common Patterns Across Systems

### 4.1 Project-Specific AI Instructions

| System | Location | Format |
|--------|----------|--------|
| Claude Code | `CLAUDE.md`, `.claude/rules/` | Markdown |
| Cursor | `.cursorrules`, `.cursor/rules/` | Markdown + YAML frontmatter |
| VS Code | N/A (settings only) | JSON |

### 4.2 User Preferences

| System | User Config | Project Override |
|--------|-------------|------------------|
| Claude Code | `~/.claude/settings.json` | `.claude/settings.json` |
| Cursor | User settings in app | `.cursor/` directory |
| VS Code | User settings.json | `.vscode/settings.json` |

### 4.3 Behavioral Guardrails

| System | Mechanism |
|--------|-----------|
| Claude Code | `permissions.deny`, hooks with exit code 2, rules |
| Cursor | Rules with restrictions, workspace trust |
| VS Code | Workspace trust, restricted mode |

### 4.4 Templates/Snippets

| System | Location | Format |
|--------|----------|--------|
| Claude Code | `.claude/templates/` | Markdown |
| Cursor | Via rules | Inline in rules |
| VS Code | `.vscode/snippets/` | JSON with placeholders |

### 4.5 Extension/Plugin Config

| System | Location | Format |
|--------|----------|--------|
| Claude Code | `settings.json` `enabledPlugins`, `mcpServers` | JSON |
| Cursor | App settings | GUI-based |
| VS Code | `extensions.json`, settings | JSON |

---

## 5. Recommendations for The Keep

### 5.1 Proposed `.keep/` Directory Structure

Based on analysis, The Keep should adopt a hybrid approach combining Claude Code's comprehensive structure with VS Code's clarity:

```
.keep/
├── KEEP.md                      # Project AI instructions (like CLAUDE.md)
├── settings.json                # Configuration (permissions, integrations)
├── settings.local.json          # Local overrides (gitignored)
│
├── rules/                       # Behavioral rules (auto-loaded)
│   ├── code-style.md           # Coding standards
│   ├── architecture.md         # Architecture guidelines
│   ├── security.md             # Security requirements
│   └── workflow.md             # Development workflow rules
│
├── commands/                    # Slash commands
│   ├── deploy.md
│   ├── review.md
│   └── test.md
│
├── agents/                      # Specialized AI personas
│   ├── reviewer.md             # Code review agent
│   ├── debugger.md             # Debug assistant
│   └── architect.md            # Architecture guidance
│
├── hooks/                       # Lifecycle automation
│   ├── pre-commit.sh           # Before commits
│   ├── post-edit.sh            # After file edits
│   └── session-start.sh        # Session initialization
│
├── templates/                   # Output templates
│   ├── pr-description.md
│   ├── commit-message.md
│   └── code-comment.md
│
├── context/                     # Session context (like baton)
│   ├── HISTORY.md              # Conversation history
│   ├── DECISIONS.md            # Architecture decisions
│   ├── BUGS.md                 # Known bugs
│   └── sessions/               # Per-session state
│
├── integrations/                # External service configs
│   ├── mcp.json                # MCP servers
│   └── services.json           # API endpoints
│
└── .gitignore                   # Ignore local files
```

### 5.2 settings.json Structure for The Keep

```json
{
  "$schema": "https://the-keep.dev/schemas/settings.json",
  "version": "1.0.0",

  "project": {
    "name": "the-keep",
    "description": "Personal knowledge management system"
  },

  "permissions": {
    "allow": ["Read(*)", "Edit(src/**)"],
    "ask": ["Bash(npm publish)", "Write(*.env)"],
    "deny": ["Read(.env)", "Edit(dist/**)"]
  },

  "hooks": {
    "preEdit": [".keep/hooks/lint-check.sh"],
    "postCommit": [".keep/hooks/update-changelog.sh"],
    "sessionStart": [".keep/hooks/load-context.sh"]
  },

  "agents": {
    "default": "assistant",
    "available": ["reviewer", "debugger", "architect"]
  },

  "rules": {
    "autoLoad": ["code-style", "architecture"],
    "onDemand": ["security", "performance"]
  },

  "context": {
    "maxHistory": 50,
    "autoSave": true,
    "compactionThreshold": 80
  },

  "integrations": {
    "mcp": ".keep/integrations/mcp.json",
    "github": {
      "autoLink": true,
      "issueLabels": ["ai-ready", "needs-review"]
    }
  }
}
```

### 5.3 Key Design Decisions

1. **KEEP.md as Primary Instructions**
   - Similar to CLAUDE.md but project-specific
   - Contains architecture overview, critical rules, key paths
   - Auto-loaded at session start

2. **Rules Directory for Behavioral Control**
   - Markdown files with clear structure
   - Auto-loaded based on settings
   - Organized by concern (style, security, architecture)

3. **Commands for Reusable Workflows**
   - Slash commands like `/deploy`, `/review`
   - YAML frontmatter for metadata
   - Markdown body for instructions

4. **Hooks for Automation**
   - Shell scripts for lifecycle events
   - Exit codes control flow (0=success, 2=block)
   - JSON input/output for data passing

5. **Context Directory for Persistence**
   - Track decisions, bugs, conversation history
   - Support session recovery (baton pattern)
   - Enable cross-session continuity

6. **Agents for Specialized Tasks**
   - Markdown persona definitions
   - Tool permission scoping
   - Context-appropriate expertise

### 5.4 What to Adopt from Each System

**From Claude Code:**
- Hierarchical settings scopes (user, project, local)
- Hooks lifecycle events (pre/post tool use)
- Rules auto-loading
- Commands with frontmatter
- Context persistence (baton protocol)
- Permission rule syntax

**From VS Code:**
- Clear file naming conventions
- JSON with Comments (JSONC) support
- Extensions/integrations recommendations
- Task definitions structure
- Launch configurations pattern

**From Cursor:**
- Glob-based rule scoping
- Rule types (always/auto/on-demand)
- Token-efficient rule design
- Tech-stack specific rules
- `.mdc` frontmatter pattern

---

## 6. Implementation Priority

### Phase 1: Core Structure
1. `KEEP.md` - Primary instructions file
2. `settings.json` - Basic configuration
3. `rules/` - Essential behavioral rules

### Phase 2: Automation
4. `hooks/` - Lifecycle automation
5. `commands/` - Custom slash commands
6. `context/` - Session persistence

### Phase 3: Advanced Features
7. `agents/` - Specialized AI personas
8. `templates/` - Output templates
9. `integrations/` - External services

---

## Sources

### Claude Code
- [Claude Code Settings Documentation](https://code.claude.com/docs/en/settings)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Claude Code Settings Guide (eesel.ai)](https://www.eesel.ai/blog/settings-json-claude-code)
- [Claude Code Showcase (GitHub)](https://github.com/ChrisWiles/claude-code-showcase)

### Cursor
- [Awesome Cursorrules (GitHub)](https://github.com/PatrickJS/awesome-cursorrules)
- [Cursor Best Practices (GitHub)](https://github.com/digitalchild/cursor-best-practices)
- [PRDs with Cursor Guide](https://www.chatprd.ai/learn/PRD-for-Cursor)

### VS Code
- [VS Code Settings Documentation](https://code.visualstudio.com/docs/getstarted/settings)
- [VS Code Debug Configuration](https://code.visualstudio.com/docs/debugtest/debugging-configuration)
- [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
