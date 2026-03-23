# Cursor IDE Dynamic Context Feature Research

**Date:** March 22, 2026
**Purpose:** Research Cursor IDE's dynamic context discovery feature for potential adaptation to The Keep
**BMAD Phase:** Step 4 - UX Design (research input)

---

## Executive Summary

Cursor IDE introduced **Dynamic Context Discovery** in January 2026, representing a paradigm shift from static context inclusion to on-demand context retrieval. This approach reduced token usage by 46.9% while maintaining or improving response quality. The feature demonstrates that AI agents are now capable enough to discover their own context rather than having everything pre-loaded.

**Key Insight for The Keep:** Dynamic context discovery is highly applicable to a PKM system. Instead of loading all relevant documents into context, The Keep's AI could be given tools to search and retrieve only what it needs, reducing costs and improving response quality.

---

## 1. What is Dynamic Context?

### Definition

Dynamic context discovery is an approach that **moves away from including large amounts of static context upfront**, allowing the AI agent to dynamically retrieve only the information it needs, when it needs it.

### The Problem It Solves

| Traditional Approach | Dynamic Context Approach |
|---------------------|-------------------------|
| Pre-load all potentially relevant files/tools | Agent discovers context as needed |
| Large upfront token usage | Minimal initial context |
| Potentially confusing/contradictory information | Focused, relevant information |
| Fixed context regardless of task | Context scales with task complexity |
| "Context stuffing" bloats reasoning | Leaner context = better reasoning |

### How It Differs from Manual Selection

| Aspect | Manual Selection | Automatic (Pre-Dynamic) | Dynamic Context |
|--------|-----------------|------------------------|-----------------|
| User effort | High - user picks files | Low - system guesses | Low - agent decides |
| Token efficiency | Best (if user is perfect) | Worst (over-includes) | High (task-appropriate) |
| Accuracy | Depends on user | Often includes irrelevant | High relevance |
| Scalability | Poor (user fatigue) | Poor (token limits) | Excellent |

---

## 2. Technical Implementation

### 2.1 Core Architecture

Cursor implements dynamic context through several interconnected systems:

```
                    +-------------------+
                    |   User Query      |
                    +--------+----------+
                             |
                    +--------v----------+
                    |  Minimal Static   |
                    |  Context (names   |
                    |  of tools/files)  |
                    +--------+----------+
                             |
                    +--------v----------+
                    |   Agent Decides   |
                    |  What to Lookup   |
                    +--------+----------+
                             |
         +-------------------+-------------------+
         |                   |                   |
+--------v--------+ +--------v--------+ +--------v--------+
| Codebase Index  | |   MCP Tools     | |  Current File   |
| (Vector Search) | |  (Lazy Load)    | |  + Recent Edits |
+-----------------+ +-----------------+ +-----------------+
         |                   |                   |
         +-------------------+-------------------+
                             |
                    +--------v----------+
                    |  Retrieved Context|
                    |  (Just-in-time)   |
                    +-------------------+
```

### 2.2 Codebase Indexing (RAG Foundation)

**How Cursor indexes the codebase:**

1. **Chunking:** Uses tree-sitter to parse source code into syntax trees, breaking at logical boundaries (functions, classes)
2. **Embedding:** Entire context of code fragments is embedded (not individual tokens)
3. **Storage:** Embeddings + metadata stored in Turbopuffer (remote vector database)
4. **Privacy:** Only embeddings and metadata stored in cloud; source code stays local

**Retrieval Process:**
```
Query → Embed Query → Vector Similarity Search → Rank Results → Return Top Chunks
```

**Key Technical Details:**
- Metadata includes file path and line range for each chunk
- Supports metadata-based keyword filtering during retrieval
- Custom embedding model trained for code understanding

### 2.3 Dynamic MCP Tool Loading

One of Cursor's key innovations is **lazy loading of MCP (Model Context Protocol) tools**:

| Before Dynamic Context | After Dynamic Context |
|------------------------|----------------------|
| All MCP tool descriptions loaded upfront | Only tool names provided initially |
| Full schema for every tool in context | Agent looks up schema when needed |
| High base token cost | 46.9% reduction in token usage |

**Implementation:**
- Tool descriptions synced to a folder structure
- One folder per MCP server
- Agent sees folder names, decides when to "open" them
- When listed, agent sees all tools from that server as cohesive unit

### 2.4 Five Key Techniques

Cursor's dynamic context implementation uses five specific techniques:

| Technique | Description |
|-----------|-------------|
| **Long outputs → Files** | Convert lengthy tool outputs to files that agent can read selectively |
| **Chat history → Files** | Use chat history files during summarization |
| **Agent Skills standard** | Standardized format for packaging reusable knowledge |
| **Selective MCP loading** | Only load tool descriptions when needed (46.9% reduction) |
| **Terminal → Files** | Treat terminal sessions as files for selective reading |

### 2.5 Context Window Management

**Automatic Context Assembly:**
Cursor automatically augments requests with:
- Full content of current file
- List of recently viewed files
- Results from semantic search
- Active linter/compiler errors
- Recent edit history

**Reading Limits:**
- Default: First 250 lines of a file
- Extended: Additional 250 lines if needed
- Search results: Maximum 100 lines

**Long Context Mode:**
- Models like Claude 3.5 Sonnet: ~200k tokens
- Gemini 3 Pro (Max Mode): 1M+ tokens
- Claude 4.5 with context-1m: 1M tokens (doubles pricing)

---

## 3. User Experience

### 3.1 @ Mentions System

Users can provide explicit context using @ symbols:

| Symbol | Purpose | Use Case |
|--------|---------|----------|
| `@file` | Reference specific file(s) | "Fix the bug in @auth.ts" |
| `@folder` | Reference entire directory | "Refactor @src/components/" |
| `@code` / `@symbol` | Reference function/class/variable | "Explain @calculateTotal" |
| `@codebase` | Trigger semantic search of entire project | "Where is authentication handled?" |
| `@docs` | Reference documentation | "Based on @docs, how do I..." |
| `@web` | Search the web | "What's the latest on @web React 19" |

**Full Folder Content (v0.50+):**
- Option to include full contents of folder when using `@folder`
- More expensive but useful for comprehensive understanding

### 3.2 Automatic vs Manual Balance

| Approach | When to Use |
|----------|-------------|
| **Trust @codebase** | General questions where AI can find relevant code |
| **Use explicit @file** | Files >600 lines, or when precision is critical |
| **Combine both** | "@codebase, focusing on @auth/ folder" |

**Best Practice:** Use surgical context with @-symbols to guide Cursor precisely, rather than relying solely on automatic context gathering.

### 3.3 Visual Indicators

**Context Pills:**
- Files appear inline as pills within conversations
- Agents show which files/code sections they're working with
- Part of Cursor 2.0's agent-focused design

**Context Usage Indicator:**
- Previously showed percentage of context used
- Currently reduced visibility (community feedback requesting return)
- Users want transparency on which rules/files are in context

### 3.4 User Override Capabilities

Users can override automatic context through:

1. **Explicit @ mentions** - Always included in context
2. **Cursor Rules** (`.cursor/rules/`) - Always-loaded instructions
3. **Agent Skills** (`.cursor/skills/`) - Loadable knowledge packages
4. **Notepads** - Persistent context across conversations
5. **Ignore files** (`.cursorignore`) - Exclude files from indexing

---

## 4. Related Features

### 4.1 Codebase Indexing

- **What:** Creates semantic index of entire project
- **When:** On project open (must complete for full functionality)
- **Powers:** @codebase searches, agent navigation, context assembly
- **Without it:** Context quality degrades significantly

### 4.2 Agent Skills Standard

Originally developed by Anthropic, adopted by Cursor:

**Structure:**
```
.cursor/skills/
└── my-skill/
    └── SKILL.md
```

**SKILL.md Format:**
```markdown
---
description: Short description for when to use
name: Optional friendly name
---

## When to Use
[Conditions for applying this skill]

## Step-by-Step Instructions
[Detailed instructions]

## Conventions and Best Practices
[Standards to follow]

## Examples (optional)
[Usage examples]

## Important Notes
[Caveats and warnings]
```

### 4.3 Cursor Rules

Project-level instructions loaded into every conversation:

```
.cursor/rules/
├── coding-standards.md
├── project-conventions.md
└── testing-requirements.md
```

### 4.4 Subagents (Cursor 2.4+)

- Agent can spawn subagents for parallel tasks
- Each subagent has its own context
- Main agent coordinates and merges results
- Context is shown per-subagent in UI

---

## 5. Performance Metrics

### Token Efficiency

| Metric | Result |
|--------|--------|
| Token reduction with dynamic MCP | **46.9%** |
| Measured in | Runs that called an MCP tool |
| Statistical significance | High |
| Variance | Depends on number of MCPs installed |

### Quality Impact

- Reduced context = less confusion for model
- More focused information = better reasoning
- Agent can request exactly what it needs
- Avoids "context stuffing" that hurts performance

---

## 6. Recommendations for The Keep

### 6.1 Core Concept Translation

| Cursor (Code IDE) | The Keep (PKM) |
|-------------------|----------------|
| Codebase files | Knowledge documents |
| Functions/classes | Document sections, concepts, entities |
| @codebase | @vault or @knowledge |
| Syntax trees | Document structure (headings, paragraphs) |
| MCP tools | Processing/organization tools |
| Agent Skills | Knowledge workflows |

### 6.2 Recommended Architecture

**Tiered Context System for The Keep:**

```
┌─────────────────────────────────────────────────────────────┐
│                     STATIC CONTEXT (Always Present)          │
├─────────────────────────────────────────────────────────────┤
│ • User preferences (from config)                            │
│ • Active document content                                    │
│ • Current conversation history                               │
│ • Tool names (not full descriptions)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DYNAMIC CONTEXT (On-Demand)                 │
├─────────────────────────────────────────────────────────────┤
│ • Vector search results from vault                          │
│ • Related documents (graph traversal)                        │
│ • Tag/category context                                       │
│ • Historical interactions with this topic                    │
│ • Tool schemas (when needed)                                 │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Implementation Components

**1. Knowledge Indexing:**
- Chunk documents at logical boundaries (headings, paragraphs)
- Embed chunks with metadata (path, date, tags, source)
- Store in vector database (local or cloud)
- Index on vault changes, not just on open

**2. @ Mention System:**
| Symbol | The Keep Equivalent |
|--------|---------------------|
| `@doc` | Reference specific document |
| `@folder` | Reference folder/collection |
| `@tag:work` | All documents with tag |
| `@vault` | Semantic search entire vault |
| `@recent` | Recently viewed/edited documents |
| `@inbox` | Unprocessed items |

**3. Dynamic Tool Loading:**
- AI processing tools (summarize, tag, link)
- Organization tools (file, archive, highlight)
- Integration tools (calendar, tasks, web)
- Only load tool schemas when task requires

**4. Context Pills UI:**
- Show which documents are in context
- Allow user to add/remove context sources
- Display context usage percentage
- Indicate when context is auto-retrieved vs explicit

### 6.4 Alignment with Memory Tiering

From our memory systems research, The Keep uses:
- **Hot Memory:** Active conversation + current document
- **Warm Memory:** Recent interactions, user preferences
- **Cold Memory:** Full vault (via retrieval)

Dynamic context aligns perfectly:
- Static context = Hot + Warm memory
- Dynamic retrieval = Cold memory access
- Agent decides what to pull from cold → hot

### 6.5 Key Differences: PKM vs Code IDE

| Aspect | Code IDE | PKM System |
|--------|----------|------------|
| Content type | Structured code | Unstructured text, mixed media |
| Relationships | Imports, calls, inheritance | Links, tags, temporal, semantic |
| Query style | "Find where X is used" | "What do I know about X?" |
| Context needs | Functions, types, errors | Concepts, memories, sources |
| Update frequency | On save | On edit (auto-save) |

**Implication:** The Keep needs stronger semantic understanding and relationship tracking than pure code context.

### 6.6 MVP vs Future Features

**MVP (Phase 1):**
- Basic document chunking and embedding
- @doc and @vault mentions
- Simple context pills showing included documents
- Manual context override (add/remove docs)

**Phase 2:**
- Smart auto-context based on current document
- Related documents via graph/link traversal
- Dynamic tool loading for AI actions
- Context usage indicator

**Phase 3:**
- Agent Skills equivalent for knowledge workflows
- Subagent support for complex research tasks
- Cross-vault context
- User preference learning

---

## 7. Sources

### Cursor Official
- [Dynamic Context Discovery Blog Post](https://cursor.com/blog/dynamic-context-discovery)
- [Codebase Indexing Documentation](https://cursor.com/docs/context/codebase-indexing)
- [@ Mentions Documentation](https://cursor.com/docs/context/mentions)
- [Agent Skills Documentation](https://cursor.com/docs/context/skills)
- [Working with Context Guide](https://docs.cursor.com/guides/working-with-context)
- [@Files & Folders Documentation](https://docs.cursor.com/context/@-symbols/@-folders)

### Analysis & Coverage
- [InfoQ: Cursor Dynamic Context Discovery](https://www.infoq.com/news/2026/01/cursor-dynamic-context-discovery/)
- [How Cursor Actually Indexes Your Codebase](https://towardsdatascience.com/how-cursor-actually-indexes-your-codebase/)
- [How Cursor Works Internally](https://adityarohilla.com/2025/05/08/how-cursor-works-internally/)
- [Cursor Context Management Strategies](https://datalakehousehub.com/blog/2026-03-context-management-cursor/)
- [Mastering Context Management in Cursor](https://stevekinney.com/courses/ai-development/cursor-context)

### Technical Deep Dives
- [Building RAG on Codebases](https://blog.lancedb.com/building-rag-on-codebases-part-2/)
- [Semantic Code Search](https://medium.com/@wangxj03/semantic-code-search-010c22e7d267)
- [Agent Skills vs Cursor Rules](https://dev.to/nedcodes/cursor-rules-vs-agent-skills-i-tested-both-heres-when-each-one-actually-works-1ld)
- [Agent Skills Standard](https://agentskills.io/home)

### Community Discussions
- [Context Window in Max Mode](https://forum.cursor.com/t/context-window-in-max-mode-and-normal-mode/96425)
- [Dynamic Context Discovery Forum](https://forum.cursor.com/t/dynamic-context-discovery/148884)
- [Context Usage Indicator Feedback](https://forum.cursor.com/t/diminishing-transparency-in-context-usage-indicator/149973)

---

*This research informs The Keep's AI context management design (BMAD Step 4 - UX Design).*
