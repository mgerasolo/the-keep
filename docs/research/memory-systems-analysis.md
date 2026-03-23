# AI Memory Management Systems Analysis

**Date:** March 22, 2026
**Purpose:** Research AI memory management systems and techniques for The Keep project
**Scope:** Memory architectures, retrieval patterns, quality systems, and recommendations

---

## Executive Summary

AI memory systems have matured significantly in 2025-2026, evolving from simple conversation buffers to sophisticated multi-tiered architectures. This research identifies key patterns across leading systems (SuperMemory, Mem0, Zep, Letta, LangChain) and provides actionable recommendations for The Keep's memory architecture.

### Key Findings

1. **Tiered memory is now standard** - OS-inspired hot/cold memory tiers (MemGPT pattern) dominate production systems
2. **Graph memory is rising** - Knowledge graphs with temporal awareness outperform pure vector retrieval for complex queries
3. **Hybrid search is essential** - Combining vector similarity + keyword + graph traversal doubles RAG accuracy
4. **Memory operations are atomic** - ADD, UPDATE, DELETE, NOOP paradigm prevents bloat (Mem0 pattern)
5. **Context engineering is a discipline** - Successful systems deliberately filter, rank, prune, summarize, and isolate information

---

## Part 1: Existing Memory Systems

### 1.1 SuperMemory (Claude Code Ecosystem)

**Overview:** A memory layer plugin for Claude Code that provides persistent memory across sessions.

| Aspect | Details |
|--------|---------|
| Architecture | Context injection on session start + auto-capture during session |
| Benchmark | 81.6% → ~99% on LongMemEval (vs. 40-60% for typical RAG) |
| Key Features | User preferences, project knowledge, past interactions |
| Integration | Claude Code plugin, requires Pro plan |

**Core Mechanisms:**
- **Context Injection:** Relevant memories fetched and injected at session start
- **Auto-Capture:** Tool usage captured and stored during sessions
- **Project Research:** Explores package files, directory structure, commit history, implicit style rules

**Memory Types Captured:**
- User preferences and coding patterns
- Codebase conventions and architecture
- Past interaction history
- Implicit rules and style guides

**Strengths:**
- Deep integration with Claude Code workflow
- High benchmark scores on memory-specific tasks
- Learns implicit patterns, not just explicit instructions

**Sources:**
- [SuperMemory Documentation](https://supermemory.ai/docs/integrations/claude-code)
- [Claude Supermemory Blog](https://supermemory.ai/blog/we-added-supermemory-to-claude-code-its-insanely-powerful-now/)
- [GitHub: claude-supermemory](https://github.com/supermemoryai/claude-supermemory)

---

### 1.2 Mem0 / Mem0.ai

**Overview:** Universal memory layer for AI agents with automatic fact extraction and consolidation.

| Aspect | Details |
|--------|---------|
| Architecture | Fact-based memory with atomic operations |
| Benchmark | 26% improvement on LLM-as-Judge, 91% lower p95 latency |
| Key Features | Graph memory variant, multi-provider support |
| Funding | $24M (October 2025) |

**Memory Operations (CRUD-like):**
```
ADD    - Store new fact
UPDATE - Modify existing fact with new information
DELETE - Remove outdated fact
NOOP   - No change needed (fact already known)
```

**Example Flow:**
```
User: "I moved from Mumbai to Bangalore"
System:
  1. Searches existing memories for location facts
  2. Finds: "User lives in Mumbai"
  3. Executes: DELETE "Mumbai" → ADD "Bangalore"
  4. Result: Clean, non-duplicated memory
```

**Graph Memory Variant:**
- Captures complex relational structures
- ~2% higher accuracy than base configuration
- Better for multi-hop entity relationships

**Strengths:**
- Distills raw conversations into compact natural language memories
- Prevents memory bloat through intelligent deduplication
- Works with any LLM provider (OpenAI, Anthropic, Ollama, local)

**Sources:**
- [Mem0 Official](https://mem0.ai/)
- [Mem0 Research Paper](https://arxiv.org/abs/2504.19413)
- [Mem0 GitHub](https://github.com/mem0ai/mem0)

---

### 1.3 Zep (Temporal Knowledge Graph)

**Overview:** Memory layer using Graphiti, a temporally-aware knowledge graph engine.

| Aspect | Details |
|--------|---------|
| Architecture | Temporal knowledge graph with validity tracking |
| Benchmark | 18.5% accuracy improvement, 90% latency reduction |
| Key Features | Multi-hop reasoning, temporal audit trails |
| Retrieval | 200ms target |

**Temporal Memory Model:**
- Tracks how facts change over time
- Maintains periods of validity for each fact
- Non-lossy updates preserve historical context

**Graph Retrieval Features:**
- **Episode-mentions reranker:** Prioritizes by entity/fact mention frequency
- **Node distance reranker:** Orders by graph distance from centroid node
- Multi-hop entity relationship traversal

**Best Use Cases:**
- "What did this user's goals look like in Q1 versus now?"
- Multi-hop entity relationship queries
- Enterprise workflows requiring temporal audit trails
- Multi-system data merging

**Strengths:**
- Temporal reasoning capability unique among memory systems
- Integrates structured business data with conversation history
- Graph structure enables complex relational queries

**Sources:**
- [Zep Official](https://www.getzep.com/)
- [Zep Architecture Paper](https://arxiv.org/abs/2501.13956)

---

### 1.4 Letta (formerly MemGPT)

**Overview:** Platform for building stateful agents with OS-inspired memory management.

| Aspect | Details |
|--------|---------|
| Architecture | Tiered memory (core/archival/recall) |
| Philosophy | "White-box memory" - transparent to developers |
| Key Features | Self-improving agents, shared memory across sessions |
| Funding | $10M seed |

**Tiered Memory Architecture:**

```
┌─────────────────────────────────────┐
│  CORE MEMORY (always in context)   │
│  - Persona, goals, preferences     │
│  - Embedded in system instructions │
│  - Hot, immediately accessible     │
└─────────────────────────────────────┘
              ↓ Store / ↑ Retrieve
┌─────────────────────────────────────┐
│  ARCHIVAL MEMORY (database)        │
│  - Past conversations              │
│  - Learned facts                   │
│  - Searchable via embeddings       │
└─────────────────────────────────────┘
              ↓ Summarize
┌─────────────────────────────────────┐
│  RECALL MEMORY (summarized)        │
│  - Condensed historical context    │
│  - Compressed representations      │
└─────────────────────────────────────┘
```

**Memory Management Primitives:**
- **Store:** Transfer from main to external context
- **Retrieve/Search:** Pull from archival to main context
- **Summarize:** Recursively condense evicted messages
- **Update:** Modify working context or persona data

**Recent Developments (2025-2026):**
- October 2025: Rearchitected agent loop for reasoning models
- January 2026: Conversations API for shared memory across parallel sessions
- Letta Evals: Open-source evaluation framework for stateful agents

**Strengths:**
- Transparent "white-box" approach shows exact prompts/memories
- OS-inspired design maps naturally to memory hierarchies
- Self-improving agents that learn over time

**Sources:**
- [Letta Official](https://www.letta.com/)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [MemGPT Paper](https://arxiv.org/abs/2310.08560)

---

### 1.5 LangChain Memory Modules

**Overview:** Modular memory components for LLM applications with multiple storage backends.

| Memory Type | Behavior | Use Case |
|-------------|----------|----------|
| ConversationBufferMemory | Store all messages | Short conversations |
| ConversationBufferWindowMemory | Store last k messages | Medium conversations |
| ConversationSummaryMemory | Summarize as you go | Long conversations |
| ConversationSummaryBufferMemory | Hybrid: k recent + summary | Production chatbots |
| VectorStoreRetrieverMemory | Semantic search | RAG applications |
| EntityMemory | Track named entities | Character/project tracking |

**Hybrid Architecture Pattern (2025 Best Practice):**
```
Short-term: ConversationBufferWindowMemory (last k messages)
    ↓
Long-term: VectorStoreRetrieverMemory (Pinecone/Chroma/Weaviate)
    ↓
Summarized: ConversationSummaryMemory (compressed history)
```

**LangGraph Evolution:**
- Manages short-term memory as agent state
- Checkpointer persists state to database
- Thread resumption at any point

**Sources:**
- [LangChain Memory Docs](https://docs.langchain.com/oss/python/concepts/memory)
- [Pinecone LangChain Tutorial](https://www.pinecone.io/learn/series/langchain/langchain-conversational-memory/)

---

### 1.6 Other Notable Systems

| System | Key Innovation | Best For |
|--------|---------------|----------|
| **Hindsight** | Episodic memory with reflection | Self-improving agents |
| **Memvid** | Video-based memory storage | Multimodal agents |
| **Cognee** | Graph-based knowledge management | Enterprise knowledge |
| **A-Mem** | Agentic memory for LLM agents | Autonomous agents |
| **SuperLocalMemory** | Local-first, privacy-focused | On-device AI |

---

## Part 2: Memory Management Techniques

### 2.1 Handling Memory Bloat/Accumulation

**Problem:** Unbounded memory growth degrades performance and relevance.

**Solution Patterns:**

| Technique | How It Works | When to Use |
|-----------|--------------|-------------|
| **Intelligent Decay** | Score by recency × relevance × importance | Continuous pruning |
| **Consolidation** | Merge related memories into summaries | Periodic maintenance |
| **Atomic Operations** | ADD/UPDATE/DELETE/NOOP prevents duplicates | Every write |
| **TTL (Time-to-Live)** | Auto-expire old memories | Session-scoped facts |
| **Capacity Limits** | Evict lowest-scored when full | Resource-constrained |

**Mem0's Approach:**
```python
# Pseudocode for memory consolidation
def add_memory(new_fact):
    existing = search_similar(new_fact)
    if existing:
        if supersedes(new_fact, existing):
            return UPDATE(existing, new_fact)
        elif contradicts(new_fact, existing):
            return DELETE(existing) + ADD(new_fact)
        else:
            return NOOP
    return ADD(new_fact)
```

### 2.2 Tiered Memory (Hot/Cold)

**Architecture Pattern:**

```
┌────────────────────────────────────────────────┐
│  HOT TIER (in-context, <32k tokens)            │
│  - Current conversation                        │
│  - Active user preferences                     │
│  - Recently accessed facts                     │
│  - Response time: <10ms                        │
├────────────────────────────────────────────────┤
│  WARM TIER (fast retrieval)                    │
│  - Recent session history                      │
│  - Frequently accessed knowledge               │
│  - Response time: <100ms                       │
├────────────────────────────────────────────────┤
│  COLD TIER (archival)                          │
│  - Historical conversations                    │
│  - Rarely accessed facts                       │
│  - Response time: <500ms                       │
│  - Compressed/summarized                       │
└────────────────────────────────────────────────┘
```

**Migration Policies:**
- **Promotion:** Access count exceeds threshold → move to warmer tier
- **Demotion:** No access for N days → move to colder tier
- **Eviction:** Cold tier exceeds capacity → summarize and archive

### 2.3 Memory Compression/Summarization

**Techniques:**

| Method | Compression Ratio | Fidelity | Use Case |
|--------|-------------------|----------|----------|
| **Recursive summarization** | 3-10x | Medium | Conversation history |
| **KVzip (2025)** | 3-4x | High | Chat memory |
| **Fact extraction** | 10-50x | Variable | Long documents |
| **Hierarchical compression** | 5-20x | Medium | Multi-session |

**KVzip Innovation (2025):**
- Compresses conversation memory by eliminating redundant information
- Supports up to 170,000 tokens
- Memory reuse across queries without recompression
- Maintains accuracy while reducing memory footprint

**Google Titans (2026):**
- Neural long-term memory module
- Higher expressive power than traditional approaches
- Summarizes large volumes without losing important context

### 2.4 Memory Pruning/Archival Strategies

**Scoring Formula:**
```
score = (semantic_relevance × w1) +
        (recency_factor × w2) +
        (access_frequency × w3) +
        (importance_flag × w4)

where:
  recency_factor = 1 / (1 + days_since_access)
  access_frequency = log(access_count + 1)
```

**Archival Triggers:**
- Score falls below threshold
- Age exceeds retention period
- Superseded by newer information
- Storage quota exceeded

### 2.5 Multi-Agent Memory Review

**Pattern: Orchestrated Review Agents**

While specific "optimist/pessimist/neutral" reviewer patterns weren't found in literature, the multi-agent review paradigm is emerging:

```
┌─────────────────────────────────────────────────┐
│  ORCHESTRATOR                                   │
│  Coordinates specialist agents                  │
├─────────────────────────────────────────────────┤
│  RESEARCHER AGENT                               │
│  - Gathers information                          │
│  - Validates facts                              │
├─────────────────────────────────────────────────┤
│  CRITIC AGENT                                   │
│  - Finds flaws in reasoning                     │
│  - Challenges assumptions                       │
├─────────────────────────────────────────────────┤
│  ANALYST AGENT                                  │
│  - Validates results                            │
│  - Synthesizes perspectives                     │
└─────────────────────────────────────────────────┘
```

**Memory-Specific Multi-Agent Patterns:**
- **Deduplication agents:** Identify and merge overlapping memories
- **Contradiction detection:** Flag conflicting facts for resolution
- **Relevance scoring:** Multiple perspectives on memory importance
- **Consolidation agents:** Summarize related memories

**Gartner Insight (2025):** 1,445% surge in multi-agent system inquiries from Q1 2024 to Q2 2025, with 40% of enterprise applications expected to embed AI agents by end of 2026.

---

## Part 3: Memory Retrieval

### 3.1 Vector-Based Memory Retrieval

**Standard Approach:**
```
Query → Embed → Search Vector DB → Top-K Results → Rerank → Context
```

**Vector Database Options (2026):**

| Database | Strengths | Best For |
|----------|-----------|----------|
| Pinecone | Managed, scalable | Production SaaS |
| Weaviate | Hybrid search, GraphQL | Enterprise |
| Chroma | Simple, Python-native | Prototyping |
| Qdrant | Performance, filtering | High-throughput |
| Milvus | Scale, GPU support | Large datasets |
| pgvector | PostgreSQL integration | Existing Postgres |

### 3.2 Hybrid Search (2026 Best Practice)

**Industry consensus shifted in 2026:** Pure vector search is insufficient.

**Hybrid Search Components:**
```
┌─────────────────────────────────────────────────┐
│  SEMANTIC (Vector)                              │
│  - Cosine similarity on embeddings              │
│  - Captures meaning and context                 │
├─────────────────────────────────────────────────┤
│  KEYWORD (BM25/TF-IDF)                          │
│  - Exact term matching                          │
│  - Handles proper nouns, codes, identifiers     │
├─────────────────────────────────────────────────┤
│  GRAPH (Knowledge Graph)                        │
│  - Entity relationships                         │
│  - Multi-hop traversal                          │
├─────────────────────────────────────────────────┤
│  FUSION                                         │
│  - Reciprocal rank fusion (RRF)                 │
│  - Weighted score combination                   │
└─────────────────────────────────────────────────┘
```

**Performance Improvement:** Hybrid search often doubles RAG accuracy benchmarks compared to vector-only.

### 3.3 Relevance Scoring

**Multi-Factor Scoring:**
```python
def compute_relevance(memory, query, user_context):
    # Semantic similarity
    semantic_score = cosine_similarity(
        embed(memory.content),
        embed(query)
    )

    # Temporal relevance (recency decay)
    days_old = (now - memory.created_at).days
    recency_score = math.exp(-decay_rate * days_old)

    # Access frequency
    frequency_score = math.log(memory.access_count + 1) / max_frequency

    # User-specific boost
    user_boost = 1.2 if memory.user_id == user_context.id else 1.0

    # Importance flag
    importance = 2.0 if memory.is_important else 1.0

    return (semantic_score * 0.5 +
            recency_score * 0.2 +
            frequency_score * 0.15 +
            importance * 0.15) * user_boost
```

### 3.4 Context Window Optimization

**Strategies:**

| Strategy | Description | Implementation |
|----------|-------------|----------------|
| **Selective injection** | Only include relevant memories | Threshold-based filtering |
| **Chunking** | Break large memories into pieces | Sliding window, semantic |
| **Summarization** | Compress low-relevance memories | LLM-based summary |
| **Hierarchical context** | Core → Details → Archive | Tiered inclusion |
| **Dynamic allocation** | Adjust based on task complexity | Task-aware budgeting |

**Token Budget Allocation Example:**
```
Total context: 128k tokens
├── System prompt: 2k (fixed)
├── Core memories: 4k (always included)
├── Relevant memories: 8k (top-scored)
├── User message: 2k
├── Retrieved documents: 16k (RAG)
└── Working space: 96k (generation)
```

---

## Part 4: Memory Quality

### 4.1 User Feedback/Rating Systems

**Feedback Collection Patterns:**

| Pattern | Implementation | Use Case |
|---------|---------------|----------|
| **Explicit ratings** | Thumbs up/down on responses | Direct quality signal |
| **Implicit signals** | Follow-up corrections, re-asks | Inferred quality |
| **Memory correction** | "Actually, I prefer X" | Fact updates |
| **Verification flow** | "Did I get this right?" | Confidence building |

**Feedback Integration:**
```
User correction → Extract new fact → Compare to existing
    → UPDATE if supersedes
    → ADD if new information
    → Boost/penalize relevance scores
```

### 4.2 Confidence Scoring

**Confidence Dimensions:**

| Dimension | Measurement | Impact |
|-----------|-------------|--------|
| **Source reliability** | Was this user-stated or inferred? | Weight adjustment |
| **Recency** | How old is this information? | Decay factor |
| **Corroboration** | Multiple sources confirm? | Boost factor |
| **Validation rate** | How often has this been correct? | Calibration |

**Confidence Calibration (2026):**
- Systems track validation outcomes at different confidence levels
- User corrections recalibrate confidence thresholds
- TrueGradeAI achieves ~95% agreement with human raters in high-confidence cases

### 4.3 Source Attribution

**Metadata Schema:**
```json
{
  "memory_id": "mem_abc123",
  "content": "User prefers dark mode",
  "source": {
    "type": "explicit_statement",
    "conversation_id": "conv_xyz",
    "timestamp": "2026-03-15T10:30:00Z",
    "user_id": "user_456"
  },
  "confidence": 0.95,
  "last_validated": "2026-03-20T14:00:00Z",
  "validation_count": 3
}
```

**Source Types:**
- `explicit_statement` - User directly stated
- `inference` - Derived from behavior
- `system_observation` - Detected pattern
- `imported` - From external source
- `summarized` - Compressed from multiple sources

### 4.4 Temporal Relevance (Short-term vs Long-term)

**Memory Categories:**

| Category | Retention | Examples |
|----------|-----------|----------|
| **Ephemeral** | Session only | Current task context |
| **Short-term** | Days to weeks | Recent conversations |
| **Long-term** | Months to years | User preferences, facts |
| **Permanent** | Never expires | Core identity, critical settings |

**Temporal Decay Models:**
```
# Exponential decay
relevance = initial_relevance * exp(-λ * time)

# Step function
relevance = {
    initial:   if age < 7 days
    0.8x:      if 7 days ≤ age < 30 days
    0.5x:      if 30 days ≤ age < 90 days
    0.2x:      if age ≥ 90 days
}

# Hybrid (access resets decay)
relevance = initial * exp(-λ * time_since_last_access)
```

---

## Part 5: Architecture Patterns

### 5.1 Memory File Formats

**Common Formats:**

| Format | Pros | Cons | Best For |
|--------|------|------|----------|
| **JSON** | 3-9x faster parsing | Verbose | API interchange |
| **YAML** | Human-readable | Slower parsing | Configuration |
| **SQLite** | ACID, portable | File locking | Local-first |
| **PostgreSQL + pgvector** | Production-grade | Complexity | Self-hosted |
| **Parquet/Arrow** | Columnar, efficient | Not human-readable | Analytics |

**Recommended Schema (JSON):**
```json
{
  "version": "1.0",
  "memories": [
    {
      "id": "mem_001",
      "type": "preference",
      "content": "Prefers TypeScript over JavaScript",
      "embedding": [0.123, -0.456, ...],
      "metadata": {
        "source": "explicit",
        "confidence": 0.92,
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-15T14:30:00Z",
        "access_count": 12,
        "last_accessed": "2026-03-22T09:00:00Z"
      },
      "tags": ["coding", "language-preference"],
      "scope": "global"
    }
  ]
}
```

### 5.2 Tiered Storage Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    ACCESS LAYER                            │
│  - Unified API for all memory operations                   │
│  - Handles routing to appropriate tier                     │
└────────────────────────────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    ▼                       ▼                       ▼
┌──────────┐         ┌──────────┐           ┌──────────┐
│   HOT    │         │   WARM   │           │   COLD   │
│  Redis   │         │ Postgres │           │   S3     │
│ <100ms   │◄───────►│  <200ms  │◄─────────►│  <1s     │
│ In-memory│         │ pgvector │           │ Archived │
└──────────┘         └──────────┘           └──────────┘
    │                       │                       │
    └───────────────────────┴───────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   MIGRATION   │
                    │    SERVICE    │
                    │ (background)  │
                    └───────────────┘
```

### 5.3 Memory Metadata Schema

**Recommended Fields:**

```typescript
interface Memory {
  // Identity
  id: string;
  version: number;

  // Content
  content: string;
  embedding: number[];
  type: 'preference' | 'fact' | 'event' | 'skill' | 'relationship';

  // Provenance
  source: {
    type: 'user_statement' | 'inference' | 'import' | 'system';
    conversationId?: string;
    userId?: string;
    timestamp: Date;
  };

  // Quality
  confidence: number;        // 0.0 - 1.0
  validationCount: number;
  lastValidated?: Date;

  // Lifecycle
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
  lastAccessed: Date;
  expiresAt?: Date;

  // Organization
  tags: string[];
  scope: 'global' | 'workspace' | 'conversation';
  workspaceId?: string;

  // Relationships (for graph memory)
  relationships?: {
    type: string;
    targetId: string;
    validFrom?: Date;
    validTo?: Date;
  }[];
}
```

### 5.4 Always-Loaded vs On-Demand

**Classification Matrix:**

| Always Loaded | On-Demand | Archive |
|--------------|-----------|---------|
| User preferences | Past conversations | Old session data |
| Core settings | Specific facts | Historical changes |
| Active context | Related memories | Superseded facts |
| Recent memories | Similar examples | Compressed summaries |

**Decision Criteria:**
```python
def classify_memory(memory):
    if memory.type == 'preference' and memory.confidence > 0.8:
        return 'always_loaded'
    if memory.access_count > 10 and days_since_access(memory) < 7:
        return 'always_loaded'
    if memory.access_count > 3 or days_since_access(memory) < 30:
        return 'on_demand'
    return 'archive'
```

---

## Part 6: Recommendations for The Keep

Based on this research, here are specific recommendations for The Keep's memory architecture.

### 6.1 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     THE KEEP MEMORY LAYER                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CORE MEMORY (Always in Context)                    │   │
│  │  - User preferences and settings                    │   │
│  │  - Active workspace context                         │   │
│  │  - High-confidence learned facts                    │   │
│  │  Storage: Redis/In-memory                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SEMANTIC MEMORY (On-Demand Retrieval)              │   │
│  │  - Knowledge base entries                           │   │
│  │  - Learned patterns and skills                      │   │
│  │  - Relationship graphs                              │   │
│  │  Storage: PostgreSQL + pgvector                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  EPISODIC MEMORY (Searchable Archive)               │   │
│  │  - Conversation history                             │   │
│  │  - Event logs                                       │   │
│  │  - Temporal facts with validity periods             │   │
│  │  Storage: PostgreSQL with temporal extensions       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  MEMORY SERVICES                                            │
│  - Consolidation (merge related memories)                   │
│  - Pruning (remove low-value memories)                      │
│  - Migration (hot ↔ cold tier movement)                     │
│  - Quality scoring (confidence updates)                     │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Memory Operations API

**Recommended Operations:**

```typescript
interface MemoryService {
  // Core operations (Mem0-style atomic)
  add(memory: MemoryInput): Promise<Memory>;
  update(id: string, changes: Partial<Memory>): Promise<Memory>;
  delete(id: string): Promise<void>;

  // Smart upsert (handles deduplication)
  remember(content: string, context: Context): Promise<MemoryOperation>;
  // Returns: { operation: 'ADD' | 'UPDATE' | 'DELETE' | 'NOOP', memory?: Memory }

  // Retrieval
  search(query: string, options: SearchOptions): Promise<Memory[]>;
  getByTags(tags: string[]): Promise<Memory[]>;
  getRelated(memoryId: string, depth: number): Promise<Memory[]>;

  // Lifecycle
  consolidate(workspaceId: string): Promise<ConsolidationReport>;
  prune(options: PruneOptions): Promise<PruneReport>;

  // Quality
  validate(memoryId: string, isCorrect: boolean): Promise<void>;
  boost(memoryId: string): Promise<void>;
}
```

### 6.3 Retrieval Strategy

**Hybrid Search Implementation:**

```typescript
async function retrieveMemories(
  query: string,
  context: Context,
  budget: number = 4000  // tokens
): Promise<Memory[]> {
  // 1. Vector similarity search
  const vectorResults = await vectorSearch(query, 20);

  // 2. Keyword search (for exact matches)
  const keywordResults = await keywordSearch(query, 10);

  // 3. Graph traversal (if entities detected)
  const entities = extractEntities(query);
  const graphResults = entities.length > 0
    ? await graphSearch(entities, 2)  // 2-hop
    : [];

  // 4. Fusion and reranking
  const merged = reciprocalRankFusion([
    { results: vectorResults, weight: 0.5 },
    { results: keywordResults, weight: 0.3 },
    { results: graphResults, weight: 0.2 }
  ]);

  // 5. Apply temporal decay and user context
  const scored = merged.map(m => ({
    ...m,
    finalScore: computeRelevance(m, query, context)
  }));

  // 6. Select within token budget
  return selectWithinBudget(scored, budget);
}
```

### 6.4 Quality Management

**Confidence System:**

```typescript
interface ConfidenceSystem {
  // Initial confidence based on source
  sourceWeights: {
    explicit_statement: 0.95,
    user_correction: 0.98,
    inference: 0.7,
    system_observation: 0.6,
    imported: 0.5
  };

  // Confidence updates
  onValidation(memory: Memory, isCorrect: boolean): number;
  onAccess(memory: Memory): number;  // slight boost
  onContradiction(memory: Memory, newInfo: string): number;

  // Decay
  applyTemporalDecay(memory: Memory): number;
}
```

### 6.5 Implementation Phases

**Phase 1: Foundation (MVP)**
- [ ] PostgreSQL + pgvector setup
- [ ] Basic CRUD operations with metadata
- [ ] Simple vector search
- [ ] Core memory injection on session start

**Phase 2: Intelligence**
- [ ] Mem0-style atomic operations (ADD/UPDATE/DELETE/NOOP)
- [ ] Hybrid search (vector + keyword)
- [ ] Confidence scoring
- [ ] User feedback integration

**Phase 3: Scale**
- [ ] Tiered storage (hot/warm/cold)
- [ ] Background consolidation service
- [ ] Temporal validity tracking
- [ ] Graph relationships

**Phase 4: Multi-Agent**
- [ ] Workspace isolation
- [ ] Shared memory across agents
- [ ] Multi-agent review/validation
- [ ] Cross-workspace memory sharing (opt-in)

### 6.6 Technology Recommendations

| Component | Recommendation | Rationale |
|-----------|---------------|-----------|
| **Primary Storage** | PostgreSQL + pgvector | Already in stack, proven, extensible |
| **Hot Cache** | Redis | Fast, existing infrastructure |
| **Embeddings** | text-embedding-3-small (OpenAI) | Balance of quality and cost |
| **Vector Search** | pgvector HNSW index | Good enough, no new infrastructure |
| **Graph (future)** | PostgreSQL with Apache AGE | Avoid new DB, good performance |

### 6.7 Integration with Existing Research

Based on the PKM tools research already completed for The Keep, the memory system should integrate with:

**If using AFFiNE:**
- Memory API as separate service
- MCP server for AI assistant integration
- Sync memories from document annotations

**If using Outline + AnythingLLM hybrid:**
- AnythingLLM can serve as the memory layer
- Connect to Outline via MCP
- Memory stored in AnythingLLM's workspace model

**If using Plane:**
- Memory service as microservice
- Connect via Plane's REST API
- Store memories as linked resources

---

## Appendix: Sources

### Primary Systems
- [SuperMemory Documentation](https://supermemory.ai/docs/integrations/claude-code)
- [SuperMemory Blog](https://supermemory.ai/blog/we-added-supermemory-to-claude-code-its-insanely-powerful-now/)
- [Mem0 Official](https://mem0.ai/)
- [Mem0 Research Paper](https://arxiv.org/abs/2504.19413)
- [Zep Official](https://www.getzep.com/)
- [Zep Architecture Paper](https://arxiv.org/abs/2501.13956)
- [Letta Official](https://www.letta.com/)
- [MemGPT Paper](https://arxiv.org/abs/2310.08560)
- [LangChain Memory Docs](https://docs.langchain.com/oss/python/concepts/memory)

### Techniques and Patterns
- [Context Engineering Guide (Mem0)](https://mem0.ai/blog/context-engineering-ai-agents-guide)
- [Memory in AI Agents Survey](https://arxiv.org/abs/2512.13564)
- [KVzip Compression](https://techxplore.com/news/2025-11-ai-tech-compress-llm-chatbot.html)
- [Google Titans](https://research.google/blog/titans-miras-helping-ai-have-long-term-memory/)
- [Hybrid Search Guide (Meilisearch)](https://www.meilisearch.com/blog/hybrid-search-rag)

### Benchmarks and Comparisons
- [5 AI Memory Systems Compared (2026)](https://dev.to/varun_pratapbhardwaj_b13/5-ai-agent-memory-systems-compared-mem0-zep-letta-supermemory-superlocalmemory-2026-benchmark-59p3)
- [6 Best AI Agent Memory Frameworks](https://machinelearningmastery.com/the-6-best-ai-agent-memory-frameworks-you-should-try-in-2026/)
- [AI Memory Products 2026](https://medium.com/@bumurzaqov2/top-10-ai-memory-products-2026-09d7900b5ab1)

---

*Report generated for The Keep project. Last updated: March 22, 2026.*
