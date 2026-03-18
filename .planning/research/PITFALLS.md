# Pitfalls Research

**Domain:** Personal knowledge management hub with AI assistant (The Keep)
**Researched:** 2026-03-18
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: The Markdown-Editor Roundtrip Trap

**What goes wrong:**
The Keep's core constraint -- "markdown file backend, human-readable, git-friendly" -- directly conflicts with using a BlockNote-style rich editor. BlockNote officially documents that markdown conversion is **lossy**: nested blocks, certain styles, and block children that are not list items get flattened or removed. Every save-load cycle silently degrades content. Users edit in rich text, save to markdown, reopen -- and formatting is gone. Worse: AI agents writing markdown that the editor cannot fully represent creates a second corruption vector.

**Why it happens:**
Block editors like BlockNote use an internal JSON document model. Markdown is a serialization target, not the native format. The mapping is inherently lossy because Markdown's spec is simpler than block-based editors. The official BlockNote docs recommend storing as BlockNote JSON, not Markdown, for lossless fidelity. But The Keep's constraint demands Markdown as the storage format.

**How to avoid:**
- Accept Markdown as the canonical format and **constrain the editor to only produce Markdown-representable content**. Do not expose block features that cannot survive a markdown roundtrip.
- Build a test suite that verifies roundtrip fidelity: create content in the editor, save to markdown, reload, compare. Run this on every editor change.
- Consider using TipTap directly with its `@tiptap/markdown` extension, which advertises bidirectional markdown support with full roundtrip fidelity, instead of BlockNote's higher-level abstraction.
- If using BlockNote, store BlockNote JSON as a sidecar (`.blocknote.json`) alongside `.md` files, with markdown as the human-readable/git-friendly view. AI agents read/write markdown; the editor uses JSON. This adds complexity but prevents data loss.

**Warning signs:**
- Formatting disappearing after save-reload cycles
- AI-generated markdown rendering differently in the editor than expected
- Users avoiding the editor in favor of raw markdown editing
- Git diffs showing unexpected formatting changes on files the user did not edit

**Phase to address:**
Phase 1 (Core Editor). This is foundational -- getting this wrong means every subsequent phase builds on a broken content layer. Must be validated with automated roundtrip tests before building anything else on top.

---

### Pitfall 2: AI Hallucination Corrupting Canonical Data

**What goes wrong:**
The Keep is explicitly designed as a "source of truth" that AI agents query and **update**. The project envisions "90% AI-managed, 10% human edit." This means LLMs are writing to your canonical knowledge base. Hallucination rates range from 0.7% to 30% depending on the model and task complexity. Even at 1%, over hundreds of daily updates, hallucinations accumulate -- incorrect medication dosages in health data, wrong stock tickers in finance data, fabricated references in research notes. Once hallucinated data enters the canonical store, other agents treat it as truth, creating a **cascading corruption** problem.

**Why it happens:**
LLMs generate plausible-sounding text, not verified facts. In a knowledge management context, the AI may: merge two similar entities incorrectly, infer relationships that do not exist, update a field with a confident but wrong value, or "helpfully" add context that is fabricated. The Deloitte incident (October 2025) -- where AI-generated non-existent academic sources appeared in a government report -- demonstrates this is not hypothetical.

**How to avoid:**
- **Never allow AI to overwrite without audit trail.** Every AI write must be a proposed change (diff), not a direct mutation. Store the original and the proposed change separately.
- **Implement confidence-gated writes.** AI changes below a confidence threshold go to the inbox for human review rather than being applied directly.
- **Domain-specific validation rules.** Health data (medications, dosages) gets stricter validation than general notes. Finance data (tickers, prices) gets verified against external APIs before committing.
- **Versioning with git.** Every change is a commit. Revert is always possible. But this only helps if someone notices the corruption -- hence the need for proactive validation.
- **Human review queue for sensitive domains.** Health and finance updates always require human approval, regardless of AI confidence.

**Warning signs:**
- Entity counts growing faster than expected (AI creating duplicates or phantoms)
- Cross-references pointing to entities that do not exist
- Subtle factual errors noticed weeks after AI updates
- AI agents citing data from The Keep that the user does not recognize

**Phase to address:**
Phase 2 (AI Integration). Must be designed before the AI assistant (Keeper) gains write access. The audit trail and approval workflow are prerequisites, not afterthoughts.

---

### Pitfall 3: The "Building the System Instead of Using It" Trap

**What goes wrong:**
The user explicitly called out this pattern: "over-engineering trap -- too many plugins, too much configuration" was the reason for rejecting Obsidian. But building a custom knowledge management tool from scratch is the ultimate expression of this trap. You spend months building the perfect system and never actually populate it with knowledge. The tool becomes the project, not the knowledge.

**Why it happens:**
Knowledge management tools are **meta-tools** -- tools for building your workflow. They are intrinsically satisfying to tinker with. Every feature request feels critical ("I need entity extraction before I can really use this"). The "just one more feature" loop prevents the tool from ever reaching a state where you stop building and start using. Community research consistently identifies this as the #1 reason personal knowledge tools get abandoned.

**How to avoid:**
- **Ship a usable MVP in Phase 1 that is literally just a file browser + markdown editor.** No AI, no entity extraction, no inbox. If you cannot use the tool as a basic markdown editor, nothing else matters.
- **"Populate before you build" rule.** Before starting any new feature, the knowledge base must contain at least 20 actively-used documents. If it does not, the next sprint is about adding content, not code.
- **Time-box the build.** Set a hard deadline (e.g., 4 weeks) for MVP. After that, you use it for 2 weeks before adding features. This forces confrontation with actual pain points vs. imagined ones.
- **Feature requests must come from usage friction.** No speculative features. Every feature added must trace to a concrete problem encountered while using the tool.

**Warning signs:**
- Zero or near-zero documents in the knowledge base after weeks of development
- Feature backlog growing while content stays static
- Spending more time on the tool than on the knowledge it is supposed to manage
- Comparing your tool to Obsidian/Notion features rather than to your actual knowledge needs

**Phase to address:**
Every phase, but especially Phase 1. The MVP must be ruthlessly minimal and immediately usable. The roadmap should enforce "use it for X days" gates between feature phases.

---

### Pitfall 4: Entity Graph Becoming a Maintenance Nightmare

**What goes wrong:**
Entity extraction (people, projects, tech, concepts) into a graph database sounds powerful. In practice: entities drift, duplicates accumulate, relationships go stale, and the graph becomes an unreliable shadow of reality that costs more to maintain than it provides in value. NER accuracy on personal notes (informal, abbreviated, context-dependent) is significantly lower than on clean text. Research shows that even state-of-the-art 2B parameter models achieve only 0.87 F1 on person extraction from personal data, meaning ~13% of person entities are missed or wrong. For concepts and tech terms -- much worse.

**Why it happens:**
- Personal notes use shorthand, nicknames, and context-dependent references ("talked to J about the thing") that NER cannot parse.
- Entity disambiguation is unsolved: "Python" could be the language, the Monty Python reference in your comedy notes, or your pet snake.
- Entities evolve: people change roles, projects get renamed, tech gets deprecated. The graph must be continuously updated or it lies.
- Errors in entity linking propagate to downstream relationship extraction, degrading the entire graph over time (concept drift).

**How to avoid:**
- **Defer the entity graph to Phase 3 or later.** Build the file system, editor, and search first. Add entity extraction only after the knowledge base has enough content to validate extraction quality.
- **Start with explicit tagging, not automatic extraction.** Let users tag entities manually (or confirm AI suggestions) before trusting automated extraction. This builds a ground truth dataset for evaluating automated approaches later.
- **Entity extraction as suggestions, not facts.** Present extracted entities as "did you mean?" rather than silently adding them to the graph.
- **Regular graph health audits.** Scheduled checks for orphaned entities, duplicate detection, stale relationships. Automate what you can, but accept that some human curation is unavoidable.
- **Scope entity types narrowly.** Start with just People and Projects. Add Concepts, Tech, and others only after proving the first two work reliably.

**Warning signs:**
- Entity count diverging from reality (more entities in the graph than actually exist)
- Users ignoring the graph because they do not trust it
- Increasing time spent correcting entity errors vs. using entity features
- Search results returning wrong entities, eroding confidence in the entire system

**Phase to address:**
Phase 3 (Entity Graph). Must not be built in Phase 1 -- the knowledge base needs content first. Entity extraction quality should be validated on real data before committing to a graph database.

---

### Pitfall 5: Inbox Overwhelm and the Triage Death Spiral

**What goes wrong:**
The Keep envisions an inbox receiving updates from multiple sources with AI-powered triaging. This sounds like email inbox zero -- and fails the same way. When inbox items accumulate faster than they are processed, the backlog grows, the user stops checking, and the inbox becomes a graveyard of unprocessed information. The AI triage layer adds a second failure mode: if the AI triages incorrectly (wrong priority, wrong category), users lose trust and stop relying on it, adding manual overhead on top of the automation.

**Why it happens:**
- Source proliferation: each new data source (YouTube feeds, Reddit, finance APIs) adds volume without adding processing capacity.
- Triage fatigue: even with AI suggestions, the human still must review and approve, creating a "review everything" bottleneck.
- No backpressure mechanism: sources keep sending regardless of processing capacity.
- AI triage accuracy degrades with domain diversity (health items triaged differently than finance items than AI research items).

**How to avoid:**
- **Rate limiting per source.** Cap how many items each source can push per day. Better to miss a low-value item than overwhelm with volume.
- **Auto-archive after N days.** Items not processed within a configurable window get auto-archived (not deleted). This keeps the inbox manageable.
- **Start with 1-2 sources, not all sources.** Validate the triage workflow with a single high-value source before connecting everything.
- **Triage must produce exactly one outcome:** file it (move to a document), task it (create a task), or dismiss it (archive). No "save for later" -- that is just a second inbox.
- **Measure processing rate vs. arrival rate.** If arrival consistently exceeds processing, reduce sources or increase auto-archiving.

**Warning signs:**
- Inbox item count growing week over week
- User opening the inbox less frequently
- AI triage suggestions being consistently overridden (triage model is miscalibrated)
- "Save for later" or "snooze" becoming the primary action (deferral, not processing)

**Phase to address:**
Phase 2 or 3 (Inbox System). Should not be built until the core knowledge base is populated and actively used. Inbox is a feed into the knowledge base, not a replacement for it.

---

### Pitfall 6: AI Agent Write Access Without Guardrails

**What goes wrong:**
The Keep's API allows "other AI agents to query canonical data" -- and implicitly, to update it (the project states "90% AI-managed"). Without proper access controls, any agent with API access can overwrite any document. A misconfigured agent, a prompt injection attack, or a simple bug in an agent's logic can corrupt or delete canonical data. Research shows memory poisoning -- corrupting an agent's persistent memory with malicious data -- is a documented attack vector in 2025. RAGPoison (demonstrated August 2025) specifically targets vector databases by injecting poisoned embeddings.

**Why it happens:**
- Convenience: it is easier to give agents full write access than to implement granular permissions.
- Trust in AI: assuming the AI will "do the right thing" and not need constraints.
- Agent chaining: one agent's output feeds another's input. If agent A hallucinates, agent B propagates the hallucination as fact.
- No distinction between "suggest a change" and "apply a change."

**How to avoid:**
- **Implement least-privilege API scopes.** Each agent gets access only to its relevant domain (OpenClaw gets AI research, not health data). Read access is default; write access requires explicit grant per domain.
- **All writes go through a change proposal API.** Agents do not write directly to files. They submit proposed changes that get queued. Human-approved or auto-approved based on confidence and domain sensitivity.
- **Rate limiting on writes.** No agent can make more than N changes per hour. Prevents runaway loops.
- **Input validation on all API writes.** Schema validation, content length limits, disallowed patterns (no script injection, no overwriting protected fields).
- **Audit log with rollback.** Every API write is logged with the agent identity, timestamp, diff, and can be rolled back individually.

**Warning signs:**
- Documents changing without user awareness (no notification of AI edits)
- An agent making an unusual number of changes in a short period
- Content appearing that no human or known agent created
- Cross-domain data leaking (health data appearing in AI research notes)

**Phase to address:**
Phase 2 (API Design). Access control and audit logging must be built into the API from day one, not bolted on after agents are already connected.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store BlockNote JSON only, generate markdown on export | Perfect editor fidelity | Git diffs become unreadable JSON; AI agents cannot read/write natively; violates core constraint | Never -- markdown is a hard requirement |
| Skip git commits for AI changes | Faster writes, simpler architecture | No rollback capability for AI-introduced errors; no audit trail | Never -- git history is your safety net |
| Global LLM API key for all agents | Quick setup | Cannot revoke one agent's access without revoking all; no per-agent audit trail | MVP only, must be replaced before adding third-party agents |
| Flat file structure (no directories) | Simpler file system operations | Unusable once knowledge base exceeds ~100 documents; no domain separation | MVP only, up to ~50 documents |
| Embedding all content in a single vector store | Simpler RAG setup | Cross-domain pollution (health embeddings influence AI research queries); no permission boundaries | Never -- domain separation is a feature requirement |
| In-memory search (no index) | Zero setup cost | Unusable beyond ~500 markdown files; full-text scan on every query | MVP only, with a plan to add indexing |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| LiteLLM proxy | Hardcoding model names, breaking when models are rotated | Use model aliases in LiteLLM config; application references aliases, not model IDs |
| Neo4j / graph DB | Storing entities without provenance (which document, which extraction run) | Every entity links back to source document + extraction timestamp + confidence score |
| n8n workflows | Building complex triage logic in n8n that becomes unmaintainable | Keep n8n workflows simple (receive, transform, forward). Complex logic lives in The Keep's API, not in n8n |
| MinIO storage | Storing markdown files in MinIO alongside the git repo | MinIO is for attachments (images, PDFs). Markdown stays in git. Do not duplicate storage |
| Authentik SSO | Over-scoping the OAuth grant (full profile access when you only need identity) | Request minimal scopes. The Keep is single-user -- Authentik provides authentication, not authorization |
| Git backend | Using git library that shells out to git CLI (performance death at scale) | Use isomorphic-git or libgit2 bindings for in-process git operations; avoid spawning git processes per request |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-text search via file system scan | Search latency > 2 seconds, growing linearly | Build a search index (SQLite FTS5, MeiliSearch, or Tantivy) on file change events | ~200-500 markdown files |
| Entity extraction on every save | Save latency > 5 seconds, CPU spikes on each edit | Extract entities asynchronously (background job queue). Only re-extract changed sections | Immediately if using LLM-based extraction |
| Embedding regeneration on every edit | LLM API costs spike, queue backlog builds | Incremental embedding: only re-embed changed chunks, track with content hashes | ~100 documents with frequent edits |
| Loading entire file tree into memory | Memory usage grows unbounded, browser tab crashes | Virtual scrolling for the file tree; lazy-load file contents on demand | ~1000 files in the tree |
| Git history for every keystroke | Repo size explodes, git operations slow down | Debounce saves (auto-save every 30 seconds or on blur, not on every keystroke). Squash auto-save commits periodically | ~1 week of active use |
| Synchronous LLM calls in request path | UI freezes while waiting for LLM response (3-30 seconds) | All LLM operations must be async with streaming responses or background processing + notification | Immediately |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Single API key for all agents | One compromised agent exposes entire knowledge base | Per-agent API keys with domain-scoped permissions; key rotation schedule |
| No content sanitization on AI writes | Prompt injection via knowledge base content -- AI reads poisoned content and follows injected instructions | Sanitize and validate all incoming content; strip potential injection patterns from AI-written markdown |
| Health/finance data accessible via general search | Sensitive data exposed through search results or entity graph queries | Domain-level access control; sensitive domains require explicit scope in API requests |
| Git repo with secrets in commit history | API keys, personal health data visible in git log | Use `.gitignore` aggressively; never store secrets in markdown files; use environment variables and secrets management |
| No authentication on local API | Any process on the same machine can read/write the knowledge base | Require authentication even for local API calls; use Authentik for SSO even in single-user mode |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| AI assistant (Keeper) that is too chatty | User skips AI suggestions because they are too verbose or frequent | Default to brief, actionable suggestions. Verbose mode is opt-in. Respect attention budget |
| Showing entity graph as primary navigation | Overwhelming visual complexity; users cannot find documents | File tree is primary navigation (Cursor-like). Entity graph is a secondary exploration tool, not the homepage |
| Requiring categorization on capture | Friction kills capture velocity; users stop adding content | Allow uncategorized capture into inbox. Categorization happens during triage, not at capture time |
| Command palette with too many commands | Analysis paralysis; users cannot find the command they need | Start with < 15 commands. Add gradually based on usage. Group by category (file, search, AI, navigation) |
| Auto-saving without visual confirmation | User unsure if changes were saved; anxiety about data loss | Show save status indicator (saved/saving/error) like VS Code. Brief, non-intrusive |
| Inbox notifications that interrupt deep work | Context-switching cost exceeds the value of the notification | Batch notifications. No real-time interruptions by default. User checks inbox when ready, not when inbox demands |

## "Looks Done But Isn't" Checklist

- [ ] **Markdown Editor:** Roundtrip test passing does not mean it handles all edge cases. Test with: tables, nested lists, code blocks with language tags, frontmatter, footnotes, HTML in markdown, emoji, Unicode, very long lines (> 500 chars).
- [ ] **Search:** Full-text search working does not mean it is useful. Test with: typos, synonyms, partial matches, CJK characters, search within code blocks, searching for entity names that appear in multiple contexts.
- [ ] **Entity Extraction:** Extracting entities from clean text does not validate the feature. Test with: personal shorthand, ambiguous names, entities that span multiple lines, entities referenced by pronoun only, updated entities (name changes).
- [ ] **AI Chat (Keeper):** Answering questions correctly does not mean it handles edge cases. Test with: questions about information that does not exist (should say "I don't know"), questions that span multiple documents, questions about recently-changed data, requests to update data (should go through approval flow).
- [ ] **Git Backend:** Committing files works does not mean the backend is production-ready. Test with: concurrent saves from editor + API, large binary attachments, files with special characters in names, repo size after months of use, `git log` performance with thousands of commits.
- [ ] **Inbox Triage:** AI categorizing test items correctly does not validate the system. Test with: high volume (50+ items/day for a week), items from unfamiliar sources, items that span multiple domains, items that are duplicates of existing knowledge.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Markdown roundtrip corruption | MEDIUM | 1. Identify affected files via git diff. 2. Revert to last-known-good commit. 3. Implement roundtrip test suite. 4. Re-process affected files with validated converter |
| AI hallucination in canonical data | HIGH | 1. Audit git log for AI-authored commits. 2. Identify commits with suspicious changes (entity creation, factual claims). 3. Manually verify and revert. 4. Implement confidence-gated writes before resuming AI writes |
| Entity graph drift | MEDIUM | 1. Rebuild graph from scratch using current documents. 2. Compare old vs. new graph to identify drift. 3. Implement regular rebuild schedule (weekly). 4. Add provenance tracking to prevent recurrence |
| Inbox overwhelm | LOW | 1. Bulk archive items older than N days. 2. Reduce connected sources to 1-2. 3. Implement rate limiting. 4. Re-evaluate which sources provide actual value |
| System-instead-of-knowledge trap | LOW | 1. Stop all feature development. 2. Spend 2 weeks adding content to existing system. 3. Document actual friction points encountered. 4. Resume development only to address documented friction |
| Agent write access breach | HIGH | 1. Revoke all agent API keys immediately. 2. Audit git log for unauthorized changes. 3. Revert suspicious commits. 4. Implement per-agent keys with domain scoping before re-granting access |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Markdown roundtrip corruption | Phase 1 (Core Editor) | Automated roundtrip test suite passes; manual QA with complex documents |
| AI hallucination in canonical data | Phase 2 (AI Integration) | All AI writes go through proposal queue; sensitive domains require human approval |
| Building system instead of using it | Phase 1 (MVP) and every subsequent phase | Knowledge base contains 20+ actively-used documents before Phase 2 starts |
| Entity graph maintenance nightmare | Phase 3 (Entity Graph) | Entity extraction validated on real data with measured F1 score > 0.85 before committing to graph DB |
| Inbox overwhelm | Phase 2-3 (Inbox System) | Processing rate tracked; auto-archive policy in place; source count capped |
| AI agent write access abuse | Phase 2 (API Design) | Per-agent API keys; domain-scoped permissions; audit log active; rate limiting enforced |
| BlockNote JSON vs. Markdown conflict | Phase 1 (Editor Selection) | Editor choice validated with roundtrip tests before building features on top |
| Search performance degradation | Phase 1-2 (Search) | Search index built from day one; latency < 500ms tested with 500+ documents |
| Git repo bloat from auto-saves | Phase 1 (Save Mechanism) | Debounced saves implemented; commit squashing strategy defined; repo size monitored |
| LLM context/retrieval quality issues | Phase 2 (AI Integration) | RAG pipeline tested with retrieval accuracy metrics; chunk strategy validated on real knowledge base |

## Sources

- [BlockNote - Markdown Export (official docs)](https://www.blocknotejs.org/docs/features/export/markdown) -- confirms lossy conversion
- [BlockNote - Format Interoperability](https://www.blocknotejs.org/docs/foundations/supported-formats) -- recommends JSON storage
- [Tiptap Markdown Support](https://tiptap.dev/blog/release-notes/introducing-bidirectional-markdown-support-in-tiptap) -- bidirectional markdown fidelity
- [Hallucination Rates in 2025](https://medium.com/@markus_brinsa/hallucination-rates-in-2025-accuracy-refusal-and-liability-aa0032019ca1) -- 0.7% to 30% range
- [Drainpipe - Reality of AI Hallucinations 2025](https://drainpipe.io/the-reality-of-ai-hallucinations-in-2025/) -- Deloitte incident
- [Benchmarking Local Entity Extraction for Personal Knowledge Graphs](https://earezki.com/ai-news/2026-03-14-3-entity-extraction-with-a-2b-model-benchmarks-from-a-personal-knowledge-graph/) -- 0.87 F1 on person extraction
- [Neo4j - Knowledge Graph Extraction Challenges](https://neo4j.com/blog/developer/knowledge-graph-extraction-challenges/) -- NLP pipeline noise
- [Bush Digital Guides - AI Second Brain Fragmentation](https://www.bushdigitalguides.com.au/blog/ai-second-brain-fragmentation-fix-2026/) -- architecture failure pattern
- [XDA - Building a Second Brain Became the Excuse](https://www.xda-developers.com/building-second-brain-became-excuse-for-not-using-my-first-one/) -- meta-tool trap
- [Obsidian Security - AI Agent Security Risks](https://www.obsidiansecurity.com/blog/ai-agent-security-risks) -- memory poisoning, agent chaining
- [Microsoft Security - Securing AI Agents](https://www.microsoft.com/en-us/security/blog/2026/01/23/runtime-risk-realtime-defense-securing-ai-agents/) -- runtime defense
- [Kiteworks - AI Agents Ungoverned Data Security Threat](https://www.kiteworks.com/cybersecurity-risk-management/ai-agents-ungoverned-data-security-threat/) -- write access risks
- [Context Window Limits: Why Your LLM Still Hallucinates](https://pr-peri.github.io/llm/2026/02/13/why-hallucination-happens.html) -- RAG retrieval failures
- [LogRocket - LLM Context Problem 2026](https://blog.logrocket.com/llm-context-problem/) -- context engineering
- [GitLab Issue #49917](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/49917) -- concurrent wiki edits causing content disappearance

---
*Pitfalls research for: The Keep -- Personal Knowledge Management Hub with AI Assistant*
*Researched: 2026-03-18*
