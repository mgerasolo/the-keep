# OpenClaw Architecture Analysis

**Research Date:** 2026-03-22
**Purpose:** Deep dive into OpenClaw patterns for The Keep knowledge management IDE
**OpenClaw Version:** 2026.3.14 (CalVer)

---

## Executive Summary

OpenClaw is a self-hosted AI gateway that connects messaging platforms to AI agents. It has become one of the fastest-growing open-source projects of 2026, surpassing 180,000 GitHub stars by early February. The architecture separates **agent identity** (what an agent is, how it behaves) from **agent infrastructure** (tool orchestration, memory persistence, session management).

The Keep can adopt OpenClaw's file-based configuration philosophy while going further with structured knowledge management, semantic linking, and project-context awareness that OpenClaw lacks.

---

## 1. Workspace Files Deep Dive

### Core Files

OpenClaw agents are configured through **plain Markdown files** in a workspace directory (`~/.openclaw/workspace/`). Every file is version-controllable and human-readable.

| File | Purpose | Injection Timing |
|------|---------|------------------|
| **SOUL.md** | Personality, values, tone, behavioral boundaries | First file, every session |
| **AGENTS.md** | Procedural rules, boot sequence, checklists, operating manual | Every session |
| **IDENTITY.md** | Name, emoji, avatar | Session start |
| **USER.md** | Who the agent is helping, user preferences | Session start |
| **TOOLS.md** | Environment-specific: SSH hosts, TTS voices, camera IDs | Session start |
| **MEMORY.md** | Iron-law rules, long-term persistent facts | Main session only |
| **HEARTBEAT.md** | Periodic task instructions | Heartbeat turns |

### Conceptual Model

```
SOUL.md      → "Who are you?"        (Character sheet)
AGENTS.md    → "What do you do?"     (Operating manual)
USER.md      → "Who are you helping?" (User context)
TOOLS.md     → "What can you use?"   (Environment)
MEMORY.md    → "What do you remember?" (Persistence)
```

### File Structure

```
~/.openclaw/
├── openclaw.json           # Main configuration (JSON5)
├── workspace/
│   ├── AGENTS.md           # Operating manual
│   ├── SOUL.md             # Persona
│   ├── TOOLS.md            # Environment config
│   ├── IDENTITY.md         # Name, avatar
│   ├── USER.md             # User context
│   ├── HEARTBEAT.md        # Periodic tasks
│   ├── MEMORY.md           # Long-term memory
│   ├── memory/
│   │   ├── 2026-03-22.md   # Today's session log
│   │   └── 2026-03-21.md   # Yesterday
│   ├── checklists/         # Operations
│   └── docs/               # On-demand docs
└── agents/
    └── <agent_id>/
        └── SOUL.md         # Per-agent override
```

### Minimal Viable Workspace

Only three files are **required**: `AGENTS.md` + `SOUL.md` + `TOOLS.md`

---

## 2. Tool Policies & Permissions

### Permission Architecture

OpenClaw uses a **layered permission system** with deny-wins semantics:

```
┌─────────────────────────────────────┐
│  1. Profiles (base allowlist)       │
├─────────────────────────────────────┤
│  2. Allow/Deny (global or per-agent)│
├─────────────────────────────────────┤
│  3. Sandbox Policy (sandbox-only)   │
└─────────────────────────────────────┘
```

### Configuration Example

```json
{
  "tools": {
    "allow": ["read", "web_search", "web_fetch"],
    "deny": ["write", "edit", "exec"],
    "sandbox": {
      "mode": "non-main",
      "tools": ["read", "web_search"]
    }
  }
}
```

### Key Rules

1. **Deny always wins** - If a tool is in deny list, it's blocked regardless of allow
2. **Sandbox has its own filter** - Even if allowed globally, sandbox must permit separately
3. **Exec should be deny by default** - Allowlist mode only for agents that need shell access
4. **Pin exact commands** - When allowing exec, specify exact allowed commands

### Sandbox Modes

| Mode | Behavior |
|------|----------|
| `off` | Everything runs directly on host |
| `non-main` | Sandbox for non-main sessions |
| `all` | Sandbox everything |

---

## 3. Memory System

### Memory Architecture

OpenClaw memory is **plain Markdown on disk**. The files ARE the source of truth; the model only "remembers" what's written.

```
Memory Types:
├── MEMORY.md           → Hand-written long-term memory (iron-law rules)
├── memory/YYYY-MM-DD.md → Daily session logs (auto-generated)
└── (Semantic search via memsearch plugin)
```

### Session Startup Sequence

1. Read `SOUL.md` (who you are)
2. Read `USER.md` (who you're helping)
3. If main session: Read `MEMORY.md`
4. Inject relevant dated memory files

### Memory Best Practices

| Type | Where It Goes |
|------|---------------|
| Decisions, preferences, durable facts | `MEMORY.md` |
| Day-to-day notes, running context | `memory/YYYY-MM-DD.md` |
| Direct instructions from user | `USER.md` |

### Context Management

OpenClaw manages context through:

1. **Message count limit** - Max messages in context
2. **Token count limit** - Stay within model window
3. **TTL time decay** - Older messages pruned first
4. **Smart compaction** - Summarize old conversation

**Auto-compaction**: When nearing context limits, older conversation is summarized into a compact entry while keeping recent messages intact.

---

## 4. Agent Configuration

### Agent Definition

Agents are configured in `openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "models": ["claude-3-opus", "gpt-4"],
      "sandbox": {
        "mode": "non-main"
      }
    },
    "list": [
      {
        "id": "researcher",
        "workspace": "~/.openclaw/agents/researcher/",
        "tools": {
          "allow": ["web_search", "web_fetch", "read"],
          "deny": ["exec"]
        }
      }
    ]
  }
}
```

### Per-Agent Customization

Each agent can have its own workspace directory with customized:
- `SOUL.md` - Unique personality
- `TOOLS.md` - Different tool access
- `MEMORY.md` - Separate memory

### Agent Bindings

Map conversations to specific agents:

```json
{
  "bindings": {
    "whatsapp:+1234567890": "personal",
    "telegram:@workgroup": "work_assistant",
    "discord:server123": "gaming_bot"
  }
}
```

---

## 5. Heartbeat & Cron System

### Heartbeat

A **periodic check** that runs inside the main session (default: every 30 minutes).

```
┌──────────────────────────────────────────┐
│ HEARTBEAT.md                              │
├──────────────────────────────────────────┤
│ ## Tasks to Check                         │
│ - Check inbox for new messages            │
│ - Review calendar for upcoming meetings   │
│ - Process notification queue              │
└──────────────────────────────────────────┘
```

### Cron Jobs

**Precise scheduling** using standard cron expressions:

```json
{
  "cron": [
    {
      "expression": "0 9 * * 1",
      "description": "Monday 9 AM weekly review",
      "agent": "work_assistant",
      "task": "Generate weekly summary"
    }
  ]
}
```

### When to Use Each

| Use Case | System |
|----------|--------|
| Routine monitoring (inbox, calendar, notifications) | Heartbeat |
| Exact-time tasks (daily reports, weekly reviews) | Cron |
| Batched checks | Heartbeat |
| Heavy tasks | Cron (isolated session) |

### Session Isolation

- **Heartbeat**: Runs in main session
- **Cron**: Can run in isolated session (doesn't pollute main conversation)

---

## 6. MCP Integration

### Native MCP Support

OpenClaw has native Model Context Protocol server support:

```json
{
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem"],
        "env": {
          "HOME": "/home/user"
        }
      }
    }
  }
}
```

### Skill-MCP Relationship

**Skills wrap MCP servers** into installable packages:

```
┌─────────────────────────────────┐
│ OpenClaw Skill                   │
│ ┌───────────────────────────────┤
│ │ MCP Server                    │
│ │ (Connection, Auth, Tools)     │
│ └───────────────────────────────┤
│ + Configuration                  │
│ + Documentation                  │
│ + Version Management             │
└─────────────────────────────────┘
```

### Channels (v2.1.80+)

Channels allow **bidirectional MCP communication**:
- MCP servers can push messages INTO running sessions
- External platforms can send events Claude reads and responds to

---

## 7. Hooks System

### Event-Driven Architecture

Hooks subscribe to events and execute handler functions:

```
┌─────────────────────────────────────────────────┐
│ Event Lifecycle                                  │
├─────────────────────────────────────────────────┤
│ gateway:startup    → Hook initializers           │
│ agent:bootstrap    → Agent setup                 │
│ command:new        → New command received        │
│ command:reset      → Session reset               │
│ session_start      → Session begins              │
│ message_received   → Incoming message            │
│ before_tool_call   → Pre-tool execution          │
│ after_tool_call    → Post-tool execution         │
│ message_sending    → Outgoing message            │
│ session_end        → Session closes              │
└─────────────────────────────────────────────────┘
```

### Hook Discovery Hierarchy

```
1. Workspace hooks (~/.openclaw/workspace/hooks/)
2. Managed hooks (~/.openclaw/hooks/)
3. Bundled hooks (built-in)
```

### Use Cases

- Save memory on session reset
- Run instructions on startup
- Modify context before agent begins
- Intercept tool execution (proposed feature)
- Post-response processing

### Enabling Hooks

```bash
openclaw hooks enable my-hook
```

---

## 8. Security Model

### Trust Boundaries

**Single-operator model**: OpenClaw assumes one trusted operator, potentially many agents.

```
┌─────────────────────────────────────────────────┐
│ TRUST BOUNDARY                                   │
│ ┌───────────────────────────────────────────────┤
│ │ Host machine     ← Trusted                    │
│ │ Config files     ← Trusted                    │
│ │ Gateway process  ← Trusted                    │
│ └───────────────────────────────────────────────┤
│ Agents            ← Controlled by config        │
│ External input    ← Untrusted                   │
│ Skills (3rd party)← Verify before install       │
└─────────────────────────────────────────────────┘
```

### Security Layers

| Layer | Protection |
|-------|------------|
| Tool Policy | Allow/deny lists, exec restrictions |
| Sandbox | Isolated execution environment |
| Exec Approvals | Allowlist/ask UI for commands |
| Channel Allowlists | Who can interact |
| System Prompt | Soft guidance only |

### Critical Security Warnings

**ClawHavoc Attack (January 2026)**: 1,184 malicious skills in ClawHub registry contained:
- Atomic Stealer payload
- Credential harvesters
- Keyloggers
- Reverse shells

**Security Audit Findings**:
- ~7.1% of analyzed ClawHub skills could leak credentials
- Always run `openclaw security audit`
- Never install skills blindly

### Hardening Checklist

1. ☐ Sandbox mode enabled (`non-main` or `all`)
2. ☐ Tool allowlists explicit (`tools.allow`)
3. ☐ Exec denied by default
4. ☐ Bind to loopback only, use SSH tunnels
5. ☐ Review skill source before installing
6. ☐ Prefer OAuth over long-lived API keys
7. ☐ Run `openclaw security audit` regularly

---

## 9. What The Keep Should Adopt

### Direct Adoptions

| Pattern | Reason | Implementation |
|---------|--------|----------------|
| **Markdown workspace files** | Version-controllable, human-readable | `.keep/` directory |
| **SOUL.md concept** | Clear identity separation | `SOUL.md` for project personality |
| **Layered file hierarchy** | Clean separation of concerns | Identity/Rules/Memory/Context |
| **Plain-text memory** | Transparency, no black-box storage | Daily session logs in Markdown |
| **Hook system** | Extensibility without core changes | Event-driven plugins |
| **Tool policies** | Security by default | Allow/deny lists per context |
| **Session isolation** | Clean context management | Project-scoped sessions |

### File Structure to Adopt

```
.keep/
├── SOUL.md           # Project identity, values, voice
├── AGENTS.md         # Operating rules, procedures
├── CONTEXT.md        # Current project context
├── MEMORY.md         # Long-term decisions, facts
├── USER.md           # User preferences
├── memory/
│   └── YYYY-MM-DD.md # Daily session logs
├── knowledge/
│   ├── concepts/     # Concept notes
│   ├── decisions/    # Architecture decisions
│   └── references/   # External references
└── hooks/
    └── on-*.js       # Event handlers
```

### Patterns to Adopt

1. **Separation of identity from infrastructure** - The Keep manages infrastructure, users define identity
2. **File-as-configuration** - Everything editable in any text editor
3. **Git-native design** - Every configuration change is diff-able
4. **Memory as plain text** - No opaque database, all searchable Markdown
5. **Conservative permissions** - Deny by default, explicit allows
6. **Compaction strategy** - Summarize old context, keep recent

---

## 10. Where The Keep Can Go Further

### Gaps in OpenClaw

| Gap | OpenClaw Limitation | The Keep Opportunity |
|-----|---------------------|---------------------|
| **Knowledge linking** | No semantic connections | Auto-discover relationships |
| **Project context** | Single workspace focus | Multi-project awareness |
| **Structured knowledge** | Flat file storage | Knowledge graph + tags |
| **Search** | Basic file search | Semantic/vector search |
| **UI** | CLI-first, no IDE | Web-based IDE experience |
| **Collaboration** | Single-operator model | Team knowledge sharing |
| **Templates** | Manual creation | Smart templates + generation |
| **Versioning** | Git only | Built-in version history |

### The Keep Differentiators

#### 1. Knowledge Graph

```
OpenClaw: Flat files in directories
The Keep: Connected knowledge nodes with relationships

┌─────────────────┐     ┌─────────────────┐
│ Concept: Auth   │────▶│ Decision: OAuth │
└─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Reference: RFC  │     │ Impl: auth.ts   │
└─────────────────┘     └─────────────────┘
```

#### 2. Multi-Project Context

```
OpenClaw: ~/.openclaw/workspace/ (single)
The Keep: Per-project .keep/ with cross-project references

project-a/.keep/
    └── references project-b for shared types
project-b/.keep/
    └── references infrastructure for deployment
```

#### 3. Semantic Search

```
OpenClaw: File-based search
The Keep: Vector embeddings + semantic queries

Query: "How do we handle authentication?"
Returns: Related decisions, code, docs, conversations
```

#### 4. Visual Knowledge IDE

```
OpenClaw: Terminal-based, Markdown editing
The Keep: Web IDE with:
  - Graph visualization
  - Split-pane editing
  - Real-time preview
  - Drag-and-drop linking
  - Timeline views
```

#### 5. Smart Templates

```
OpenClaw: Manual SOUL.md creation
The Keep:
  - Project type detection
  - Auto-generated scaffolding
  - Context-aware suggestions
  - Template inheritance
```

#### 6. Session Intelligence

```
OpenClaw: Linear session logs
The Keep:
  - Conversation threading
  - Task extraction
  - Decision tracking
  - Automatic tagging
  - Session summaries
```

### Implementation Priorities

| Priority | Feature | Value |
|----------|---------|-------|
| P0 | Markdown workspace files | Foundation |
| P0 | SOUL.md/AGENTS.md pattern | Identity management |
| P1 | Knowledge linking | Differentiation |
| P1 | Semantic search | Discovery |
| P2 | Visual graph | UX improvement |
| P2 | Multi-project context | Scale |
| P3 | Smart templates | Productivity |
| P3 | Team collaboration | Enterprise |

---

## Sources

### Official Documentation
- [Agent Workspace - OpenClaw](https://docs.openclaw.ai/concepts/agent-workspace)
- [Memory - OpenClaw](https://docs.openclaw.ai/concepts/memory)
- [Security - OpenClaw](https://docs.openclaw.ai/gateway/security)
- [Hooks - OpenClaw](https://docs.openclaw.ai/automation/hooks)
- [Skills - OpenClaw](https://docs.openclaw.ai/tools/skills)
- [Cron vs Heartbeat - OpenClaw](https://docs.openclaw.ai/automation/cron-vs-heartbeat)
- [Compaction - OpenClaw](https://docs.openclaw.ai/concepts/compaction)
- [Configuration - OpenClaw](https://docs.openclaw.ai/gateway/configuration)

### GitHub
- [OpenClaw Repository](https://github.com/openclaw/openclaw)
- [AGENTS.md](https://github.com/openclaw/openclaw/blob/main/AGENTS.md)
- [Awesome OpenClaw Agents](https://github.com/mergisi/awesome-openclaw-agents)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)

### Architecture Deep Dives
- [OpenClaw Architecture, Explained](https://ppaolo.substack.com/p/openclaw-system-architecture-overview)
- [OpenClaw Deep Dive: Multi-Agent AI Systems](https://dev.to/leowss/i-built-a-team-of-36-ai-agents-heres-exactly-how-openclaw-works-2eab)
- [OpenClaw vs Claude Code Comparison](https://medium.com/@hugolu87/openclaw-vs-claude-code-in-5-mins-1cf02124bc08)
- [Gateway Architecture - OpenClaw](https://docs.openclaw.ai/concepts/architecture)

### Tutorials & Guides
- [OpenClaw Workspace Files Explained](https://capodieci.medium.com/ai-agents-003-openclaw-workspace-files-explained-soul-md-agents-md-heartbeat-md-and-more-5bdfbee4827a)
- [OpenClaw Memory Masterclass](https://velvetshark.com/openclaw-memory-masterclass)
- [OpenClaw Complete Tutorial 2026](https://pub.towardsai.net/openclaw-complete-guide-setup-tutorial-2026-14dd1ae6d1c2)
- [OpenClaw Mega Cheatsheet 2026](https://moltfounders.com/openclaw-mega-cheatsheet)

### Security
- [OpenClaw Security Guide (Nebius)](https://nebius.com/blog/posts/openclaw-security)
- [Security-First OpenClaw Setup](https://capodieci.medium.com/ai-agents-016-security-first-openclaw-setup-sandboxing-dm-pairing-and-what-not-to-share-fb0003f685b4)
- [Running OpenClaw Safely (Microsoft)](https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/)
- [Securing OpenClaw (Auth0)](https://auth0.com/blog/five-step-guide-securing-moltbot-ai-agent/)

### MCP Integration
- [OpenClaw MCP Server](https://github.com/freema/openclaw-mcp)
- [MCP Server Setup Guide](https://www.clawctl.com/blog/mcp-server-setup-guide)
- [Best OpenClaw MCP Integrations](https://fast.io/resources/best-openclaw-mcp-integrations/)

---

## Appendix: Quick Reference

### OpenClaw CLI Essentials

```bash
# Gateway
openclaw gateway start
openclaw gateway restart
openclaw gateway status

# Configuration
openclaw config get
openclaw config set agents.defaults.sandbox.mode "non-main"

# Skills
openclaw skills install <skill>
openclaw skills list
openclaw security audit

# Monitoring
openclaw logs --follow
openclaw doctor
openclaw dashboard
```

### File Purposes Quick Reference

| File | One-Line Purpose |
|------|------------------|
| SOUL.md | "Be helpful, concise, and friendly" |
| AGENTS.md | "Boot sequence, rules, checklists" |
| IDENTITY.md | "Name: Assistant, Emoji: 🤖" |
| USER.md | "Matt prefers short answers" |
| TOOLS.md | "SSH: banner, TTS: elevenlabs" |
| MEMORY.md | "Never delete from #recycle" |
| HEARTBEAT.md | "Check inbox, calendar, notifications" |
