# Obsidian Plugin Deep Dive: Feature Patterns for The Keep

**Research Date:** 2026-03-22
**Purpose:** Extract feature patterns, syntax conventions, and architectural insights from the Obsidian plugin ecosystem to inform The Keep's design.

---

## Executive Summary

Obsidian's plugin ecosystem (2,700+ plugins, 5.6M+ downloads for top plugins) represents the most mature implementation of extensible personal knowledge management. This research extracts patterns across the top 100 plugins to inform The Keep's feature set.

**Key Takeaways for The Keep:**
1. **Metadata-first architecture** - YAML frontmatter + inline fields enable powerful queries
2. **Date standardization** - ISO 8601 (YYYY-MM-DD) is universal; emoji-based date markers popular
3. **Hierarchical tags** - `#parent/child/grandchild` pattern widely adopted
4. **Block-level addressing** - `^blockid` enables granular transclusion
5. **Query DSL** - SQL-like syntax (Dataview) is the gold standard
6. **Plugin architecture** - Lifecycle hooks + registration pattern enables clean extensibility

---

## Part 1: Top Plugins by Category

### Most Downloaded Plugins (All-Time)

| Rank | Plugin | Downloads | Category | Applicable to The Keep |
|------|--------|-----------|----------|------------------------|
| 1 | Excalidraw | 5,625,378 | Visual/Drawing | Yes - Canvas/whiteboard |
| 2 | Templater | 3,873,488 | Automation | Yes - Template engine |
| 3 | Dataview | 3,827,915 | Query/Database | Yes - Core feature |
| 4 | Tasks | 3,215,268 | Task Management | Yes - Core feature |
| 5 | Advanced Tables | 2,666,745 | Editing | Yes - Table editing |
| 6 | Calendar | 2,444,017 | Navigation | Yes - Date navigation |
| 7 | Git | 2,276,068 | Sync/Backup | Maybe - Server-side |
| 8 | Kanban | 2,159,931 | Task Management | Yes - Board view |
| 9 | Style Settings | 2,155,208 | Customization | Yes - Theming API |
| 10 | Iconize | 1,905,891 | Visual | Yes - Icon system |
| 11 | Remotely Save | 1,745,808 | Sync | Yes - Sync architecture |
| 12 | QuickAdd | 1,660,382 | Capture | Yes - Quick capture |
| 13 | Minimal Theme Settings | 1,445,335 | Theming | Maybe - Theme system |
| 14 | Omnisearch | 1,315,876 | Search | Yes - Full-text search |
| 15 | Editing Toolbar | 1,247,555 | UI | Yes - Toolbar API |
| 16 | Outliner | 1,137,263 | Editing | Yes - Outline mode |
| 17 | Copilot | 1,130,007 | AI | Yes - AI integration |
| 18 | Importer | 1,104,594 | Migration | Yes - Import tools |
| 19 | Homepage | 1,021,018 | Navigation | Yes - Dashboard |
| 20 | Recent Files | 963,421 | Navigation | Yes - History |
| 21 | Tag Wrangler | 908,288 | Organization | Yes - Tag management |
| 22 | Admonition | 871,659 | Content Blocks | Yes - Callouts |
| 23 | Smart Connections | 854,722 | AI/Semantic | Yes - AI features |
| 24 | Linter | 836,708 | Formatting | Yes - Auto-format |
| 25 | Advanced Slides | 813,059 | Presentation | Maybe - Export |

### Additional Essential Plugins (26-75)

| Plugin | Category | Core Capability | Applicable? |
|--------|----------|-----------------|-------------|
| Periodic Notes | Time-based | Daily/weekly/monthly notes | Yes |
| Natural Language Dates | Dates | Parse "next Friday" to date | Yes |
| Citations/ZotLit | Research | Bibliography integration | Yes |
| PDF++ | Documents | PDF annotation in-vault | Yes |
| Mind Map | Visualization | Outline to mind map | Yes |
| Charts | Visualization | Data visualization | Yes |
| Hover Editor | UI | Popup editing windows | Yes |
| Note Refactor | Editing | Extract content to notes | Yes |
| Commander | Automation | Custom commands/macros | Yes |
| Checklist | Tasks | Aggregated task views | Yes |
| Database Folder | Organization | Folder-based databases | Yes |
| Breadcrumbs | Navigation | Hierarchical navigation | Yes |
| Graph Analysis | Visualization | Enhanced graph view | Yes |
| Workspaces Plus | UI | Workspace management | Yes |
| Folder Note | Organization | Folder as note | Yes |
| Auto Link Title | Links | Fetch URL titles | Yes |
| Reading Time | Metrics | Word count, read time | Yes |
| Flashcards | Learning | Spaced repetition | Maybe |
| Export to Anki | Integration | Anki sync | Maybe |
| Obsidian Git | Sync | Git version control | Yes |
| Annotator | Documents | PDF/EPUB annotation | Yes |
| Canvas MindMap | Visual | Mind map on canvas | Yes |
| Advanced Canvas | Visual | Canvas enhancements | Yes |
| Bases | Database | Native database tables | Yes |
| Full Calendar | Calendar | Full calendar view | Yes |
| Projects | Project Mgmt | Project dashboards | Yes |
| Buttons | UI | Custom button actions | Yes |
| Customizable Page Header | UI | Custom headers | Yes |
| Various Complements | Editing | Auto-complete | Yes |
| Text Generator | AI | AI text generation | Yes |
| Obsidian Leaflet | Maps | Geographic maps | Maybe |
| Fantasy Calendar | Calendar | Custom calendars | Maybe |
| Longform | Writing | Long-form writing | Yes |
| Book Search | Integration | Book metadata | Yes |
| Media Extended | Media | Audio/video support | Yes |
| Paste Image Rename | Assets | Image management | Yes |
| Image Toolkit | Assets | Image viewing | Yes |
| Banners | Visual | Note banners | Yes |
| Dictionary | Reference | Word definitions | Maybe |
| Tracker | Metrics | Habit tracking | Yes |
| Heatmap Calendar | Visualization | Activity heatmap | Yes |
| Day Planner | Time Management | Time blocking | Yes |
| Todoist Sync | Integration | Todoist integration | Yes |
| Google Calendar | Integration | Calendar sync | Yes |
| Todoist Text | Integration | Inline Todoist | Yes |
| Sortable | Tables | Table sorting | Yes |
| Table Extended | Tables | Advanced tables | Yes |
| Multi-Column MD | Layout | Multi-column layouts | Yes |
| Sliding Panes | UI | Stacked panes view | Yes |

### Plugin Categories Summary

| Category | Count | Key Plugins | Priority for The Keep |
|----------|-------|-------------|----------------------|
| Task Management | 15+ | Tasks, Kanban, Checklist, Day Planner | Critical |
| Query/Database | 10+ | Dataview, Bases, Database Folder | Critical |
| Templates/Automation | 10+ | Templater, QuickAdd, Commander | Critical |
| Navigation | 12+ | Calendar, Homepage, Recent Files, Breadcrumbs | High |
| Search | 8+ | Omnisearch, Smart Connections | High |
| Visual/Drawing | 10+ | Excalidraw, Mind Map, Canvas | High |
| AI Integration | 8+ | Copilot, Smart Connections, Text Generator | High |
| Document Handling | 10+ | PDF++, Annotator, Citations | Medium |
| Sync/Backup | 8+ | Git, Remotely Save | Medium |
| Formatting | 10+ | Linter, Advanced Tables | Medium |
| External Integrations | 15+ | Todoist, Google Calendar, Zotero | Medium |

---

## Part 2: Pattern Extraction

### 2.1 Tag & Label Patterns

#### Tag Syntax Formats

| Format | Example | Used By | Recommendation |
|--------|---------|---------|----------------|
| Simple hash | `#project` | Core Obsidian | Support |
| Nested/hierarchical | `#project/work/clientA` | Core, Tag Wrangler | Support (critical) |
| Key-value | `#status:active` | Some plugins | Consider |
| Emoji prefix | `#🔥hot` | User convention | Support |
| Camel case | `#ProjectAlpha` | User convention | Support |
| Snake case | `#project_alpha` | User convention | Support |
| Kebab case | `#project-alpha` | User convention | Support |

#### Functional Tag Categories

| Purpose | Example Tags | Plugin Using |
|---------|--------------|--------------|
| Status | `#status/active`, `#status/done`, `#status/blocked` | Tasks, Kanban |
| Priority | `#priority/high`, `#p1`, `#🔴` | Tasks |
| Context | `#context/work`, `#context/home`, `#@phone` | Tasks (GTD) |
| Type | `#type/meeting`, `#type/project`, `#type/reference` | Dataview |
| Date-related | `#daily`, `#weekly`, `#2024` | Periodic Notes |
| Domain | `#area/health`, `#project/home-renovation` | PARA method |

#### Tag Management Features

| Feature | Implementation | Plugin |
|---------|---------------|--------|
| Rename tags | Bulk rename across vault | Tag Wrangler |
| Merge tags | Combine duplicate tags | Tag Wrangler |
| Hierarchy view | Show tag tree | Core, TagFolder |
| Auto-generate | Break nested into parent tags | Tag Breakdown Generator |
| Tag suggestions | Autocomplete existing tags | Various Complements |

**The Keep Recommendation:**
```
Tag Syntax: #category/subcategory/item
Reserved Prefixes:
  - #status/ - workflow states
  - #priority/ - priority levels
  - #type/ - note types
  - #area/ - life areas (PARA)
  - #project/ - projects
  - #context/ - GTD contexts (@ prefix alternative)
```

---

### 2.2 Date Format Patterns

#### Date Syntax Standards

| Format | Example | Used By | Context |
|--------|---------|---------|---------|
| ISO 8601 | `2024-03-22` | Universal standard | Dates |
| ISO DateTime | `2024-03-22T14:30` | Universal | Date + time |
| Natural language | `next Friday`, `tomorrow` | NL Dates plugin | Input |
| Relative | `+3d`, `-1w` | Templater | Calculations |
| Weekly | `2024-W12` | Periodic Notes | Week identifiers |
| Time only | `14:30` | Day Planner | Time blocks |

#### Date Field Types (Tasks Plugin)

| Field | Emoji | Syntax | Purpose |
|-------|-------|--------|---------|
| Due date | `📅` | `📅 2024-03-22` | When task is due |
| Scheduled | `⏳` | `⏳ 2024-03-20` | When to work on it |
| Start date | `🛫` | `🛫 2024-03-15` | When task can start |
| Created | `➕` | `➕ 2024-03-10` | When created |
| Done | `✅` | `✅ 2024-03-22` | When completed |
| Cancelled | `❌` | `❌ 2024-03-22` | When cancelled |
| Reminder | `⏰` | `⏰ 2024-03-21` | Reminder time |

#### Recurrence Patterns

| Pattern | Syntax | Example |
|---------|--------|---------|
| Daily | `every day` | `🔁 every day` |
| Weekly | `every week` | `🔁 every week` |
| Specific day | `every Monday` | `🔁 every Monday` |
| Interval | `every 3 days` | `🔁 every 3 days` |
| Monthly date | `every month on the 15th` | `🔁 every month on the 15th` |
| Complex | `every 2 weeks on Friday` | `🔁 every 2 weeks on Friday` |

#### Date in Filenames

| Period | Format | Example |
|--------|--------|---------|
| Daily | `YYYY-MM-DD` | `2024-03-22.md` |
| Weekly | `YYYY-[W]ww` | `2024-W12.md` |
| Monthly | `YYYY-MM` | `2024-03.md` |
| Quarterly | `YYYY-[Q]Q` | `2024-Q1.md` |
| Yearly | `YYYY` | `2024.md` |

**The Keep Recommendation:**
```yaml
# Date storage format
date_format: "YYYY-MM-DD"
datetime_format: "YYYY-MM-DDTHH:mm"
time_format: "HH:mm"

# Date field markers (configurable)
date_markers:
  due: "📅"      # or "due::"
  scheduled: "⏳"  # or "scheduled::"
  start: "🛫"     # or "start::"
  created: "➕"   # or "created::"
  done: "✅"      # or "done::"
  reminder: "⏰"  # or "reminder::"
  recurrence: "🔁" # or "recur::"

# Natural language parsing
nl_date_enabled: true
nl_date_trigger: "@" # e.g., @tomorrow, @next friday
```

---

### 2.3 Metadata & Frontmatter Conventions

#### YAML Frontmatter Structure

```yaml
---
# Core properties (Obsidian native)
tags: [project, work, active]
aliases: [Project Alpha, proj-alpha]
cssclasses: [wide-page, no-title]

# Date properties
created: 2024-03-01
modified: 2024-03-22
due: 2024-04-15

# Custom properties
status: in-progress
priority: high
type: project
area: work

# Links
related: "[[Other Note]]"
parent: "[[Parent Project]]"
project: "[[Project Alpha]]"

# Numbers/Metrics
progress: 75
word-count: 1500
rating: 4

# Lists
tasks-completed: 12
participants:
  - Alice
  - Bob
---
```

#### Property Types Supported

| Type | Example | Dataview Handling |
|------|---------|-------------------|
| Text | `status: active` | Direct string |
| Number | `rating: 5` | Numeric operations |
| Date | `due: 2024-03-22` | Date comparisons |
| Boolean | `completed: true` | Filter/toggle |
| List | `tags: [a, b, c]` | Array operations |
| Link | `parent: "[[Note]]"` | Link resolution |
| Duration | `duration: 2h30m` | Time calculations |
| Object | `author: {name: "X"}` | Nested access |

#### Inline Field Syntax (Dataview)

| Syntax | Example | Visibility |
|--------|---------|------------|
| Standard | `field:: value` | Key shown |
| Bracketed | `[field:: value]` | Key shown, inline |
| Hidden | `(field:: value)` | Key hidden in preview |
| Emoji key | `[📅:: 2024-03-22]` | Emoji as key |

#### Common Property Names

| Category | Properties | Data Type |
|----------|------------|-----------|
| Status | `status`, `state`, `phase` | text |
| Priority | `priority`, `importance`, `urgency` | text/number |
| Dates | `created`, `modified`, `due`, `start`, `end` | date |
| Progress | `progress`, `completion`, `percent` | number |
| Type | `type`, `kind`, `category` | text |
| Relationships | `parent`, `children`, `related`, `project` | link |
| People | `author`, `assignee`, `owner`, `participants` | text/list |
| Location | `location`, `venue`, `address` | text |
| Source | `source`, `url`, `reference` | text/link |
| Rating | `rating`, `score`, `stars` | number |

**The Keep Recommendation:**
```yaml
# Reserved property names (core schema)
_keep_properties:
  # System (auto-populated)
  - id: uuid
  - created_at: datetime
  - updated_at: datetime
  - created_by: user_id

  # Content metadata
  - title: string
  - aliases: string[]
  - tags: string[]
  - type: enum[note, task, project, meeting, reference]

  # Workflow
  - status: enum[draft, active, review, done, archived]
  - priority: enum[critical, high, medium, low, none]

  # Relationships
  - parent: note_id
  - children: note_id[]
  - related: note_id[]
  - project: project_id

  # Dates
  - due_date: date
  - start_date: date
  - scheduled_date: date

  # User-defined
  - custom_fields: object
```

---

### 2.4 Embedding & Transclusion Patterns

#### Embedding Syntax

| Type | Syntax | Result |
|------|--------|--------|
| Full note | `![[Note Name]]` | Embed entire note |
| Heading section | `![[Note#Heading]]` | Embed from heading |
| Block reference | `![[Note^blockid]]` | Embed specific block |
| Image | `![[image.png]]` | Embed image |
| Image with size | `![[image.png|300]]` | Sized image |
| PDF page | `![[document.pdf#page=5]]` | Specific PDF page |
| Audio/Video | `![[audio.mp3]]` | Media player |

#### Block Reference System

```markdown
# Source note
This is a paragraph I want to reference. ^my-block-id

- List item one
- List item two ^list-block

> Quote text here ^quote-ref

# In another note
Transcluding: ![[Source Note^my-block-id]]
Linking: [[Source Note^my-block-id]]
```

#### Link Types

| Type | Syntax | Purpose |
|------|--------|---------|
| Internal link | `[[Note Name]]` | Link to note |
| Aliased link | `[[Note Name|Display Text]]` | Custom display |
| Header link | `[[Note#Header]]` | Link to section |
| Block link | `[[Note^blockid]]` | Link to block |
| External link | `[text](url)` | External URL |
| Embed | `![[Note]]` | Inline embed |

**The Keep Recommendation:**
```
# Link syntax (compatible with Obsidian)
[[note-id]]                    # Internal link
[[note-id|display text]]       # Aliased link
[[note-id#heading]]            # Section link
[[note-id^block-id]]           # Block link
![[note-id]]                   # Full embed
![[note-id#heading]]           # Section embed
![[note-id^block-id]]          # Block embed

# Block ID format
^[a-zA-Z0-9-_]{4,}

# Asset embeds
![[image.png]]                 # Image
![[image.png|300]]             # Sized image
![[image.png|300x200]]         # Exact dimensions
![[document.pdf#page=5]]       # PDF page
```

---

### 2.5 Query Patterns (Dataview-Style)

#### Query Types

| Type | Syntax | Output |
|------|--------|--------|
| TABLE | `TABLE field1, field2 FROM...` | Tabular data |
| LIST | `LIST FROM...` | Bullet list |
| TASK | `TASK FROM...` | Checkbox list |
| CALENDAR | `CALENDAR date FROM...` | Calendar view |

#### Complete Query Syntax

```dataview
TABLE
  status AS "Status",
  due AS "Due Date",
  priority AS "Priority"
FROM #project
WHERE status != "done"
  AND due <= date(today) + dur(7 days)
SORT priority DESC, due ASC
LIMIT 10
GROUP BY status
```

#### Query Components

| Component | Syntax | Examples |
|-----------|--------|----------|
| FROM | Tags, folders, links | `#tag`, `"folder"`, `[[Note]]` |
| WHERE | Boolean expressions | `status = "active"` |
| SORT | Field + direction | `due ASC`, `priority DESC` |
| LIMIT | Number | `LIMIT 10` |
| GROUP BY | Field | `GROUP BY status` |
| FLATTEN | Expand lists | `FLATTEN tags` |

#### Filter Operators

| Operator | Example | Description |
|----------|---------|-------------|
| `=` | `status = "active"` | Equals |
| `!=` | `status != "done"` | Not equals |
| `<`, `>`, `<=`, `>=` | `rating > 3` | Comparisons |
| `contains` | `tags contains "work"` | Array contains |
| `startswith` | `file.name startswith "2024"` | String prefix |
| `endswith` | `file.name endswith ".md"` | String suffix |
| `AND`, `OR`, `NOT` | `a AND (b OR c)` | Boolean logic |

#### Date Functions

| Function | Example | Result |
|----------|---------|--------|
| `date(today)` | Current date | `2024-03-22` |
| `date(now)` | Current datetime | `2024-03-22T14:30` |
| `dur(7 days)` | Duration | 7 day duration |
| `date(yesterday)` | Yesterday | `2024-03-21` |
| `date(tomorrow)` | Tomorrow | `2024-03-23` |
| `date(sow)` | Start of week | Monday |
| `date(eow)` | End of week | Sunday |

#### Inline Queries

```markdown
Today: `= date(today)`
Task count: `= length(filter(this.file.tasks, (t) => !t.completed))`
```

**The Keep Recommendation:**
```sql
-- Query language: Keep Query Language (KQL)
-- Inspired by Dataview + SQL

-- Table view
SELECT title, status, due_date, priority
FROM notes
WHERE tag CONTAINS 'project'
  AND status != 'done'
  AND due_date <= TODAY() + INTERVAL '7 days'
ORDER BY priority DESC, due_date ASC
LIMIT 10;

-- List view
LIST notes
WHERE parent = @current_note
ORDER BY created_at DESC;

-- Task view
TASKS
WHERE project = 'Project Alpha'
  AND NOT completed
ORDER BY due_date ASC;

-- Calendar view
CALENDAR due_date
FROM notes
WHERE type = 'task';

-- Aggregations
SELECT status, COUNT(*) as count
FROM notes
GROUP BY status;
```

---

### 2.6 UI Patterns

#### View Types

| View | Plugin | Description |
|------|--------|-------------|
| Editor | Core | Markdown editing |
| Reading | Core | Rendered preview |
| Source | Core | Raw markdown |
| Live Preview | Core | WYSIWYG editing |
| Graph | Core | Knowledge graph |
| Canvas | Core | Visual workspace |
| Table | Bases, Dataview | Database view |
| Kanban | Kanban plugin | Board view |
| Calendar | Calendar, Full Calendar | Calendar view |
| Gallery | Bases, custom | Card/image grid |
| Timeline | Timeline plugins | Chronological view |
| Outline | Core, Outliner | Document structure |
| Mind Map | Mind Map plugin | Hierarchical visual |

#### Panel Locations

| Location | Examples | Purpose |
|----------|----------|---------|
| Left sidebar | File explorer, Search, Tags | Navigation |
| Right sidebar | Backlinks, Outline, Calendar | Context |
| Status bar | Word count, Sync status | Info |
| Tab bar | Open notes | Document switching |
| Header | Title, Properties | Note metadata |
| Footer | Links, Tags | Quick access |
| Modal | Settings, Quick switcher | Dialogs |
| Popup | Hover preview, Quick actions | Contextual |
| Command palette | Cmd+P | Action execution |

#### Interactive Elements

| Element | Plugin Examples | Interaction |
|---------|-----------------|-------------|
| Checkboxes | Tasks, Core | Toggle completion |
| Buttons | Buttons plugin | Execute commands |
| Dropdowns | Properties | Select values |
| Date pickers | Tasks | Select dates |
| Color pickers | Style Settings | Select colors |
| Sliders | Progress bars | Adjust values |
| Toggles | Settings | On/off states |
| Drag-drop | Kanban, Canvas | Reorder/move |

#### Callout/Admonition Types

```markdown
> [!note] Title
> Content here

> [!tip] Pro Tip
> Helpful information

> [!warning] Caution
> Warning message

> [!danger] Critical
> Dangerous action

> [!info] Information
> Informational note

> [!question] FAQ
> Question and answer

> [!quote] Citation
> Quoted text

> [!example] Example
> Example content

> [!success] Success
> Positive outcome

> [!failure] Failure
> Negative outcome

> [!bug] Known Issue
> Bug description
```

**The Keep Recommendation:**
```yaml
ui_panels:
  left_sidebar:
    - file_explorer
    - search
    - tags
    - favorites
  right_sidebar:
    - outline
    - backlinks
    - properties
    - calendar_mini
  status_bar:
    - word_count
    - reading_time
    - sync_status
    - ai_status

views:
  - editor (markdown, WYSIWYG, source)
  - reader (rendered)
  - canvas (visual workspace)
  - table (database)
  - board (kanban)
  - calendar
  - gallery
  - graph
  - timeline
  - outline

callout_types:
  - note (blue, info icon)
  - tip (green, lightbulb)
  - warning (yellow, warning triangle)
  - danger (red, exclamation)
  - info (blue, info circle)
  - question (purple, question mark)
  - quote (gray, quote marks)
  - example (purple, code icon)
  - success (green, checkmark)
  - failure (red, x mark)
  - bug (red, bug icon)
  - todo (orange, checkbox)
```

---

### 2.7 Integration Patterns

#### Sync Services

| Service | Plugin | Protocol |
|---------|--------|----------|
| S3/R2/B2 | Remotely Save | S3 API |
| Dropbox | Remotely Save | OAuth |
| OneDrive | Remotely Save | OAuth/API |
| Google Drive | Remotely Save | OAuth/API |
| WebDAV | Remotely Save | WebDAV |
| Git | Obsidian Git | Git |
| iCloud | Native (macOS) | File sync |

#### External Service Integrations

| Service | Plugin | Sync Type |
|---------|--------|-----------|
| Todoist | Todoist Sync | Two-way tasks |
| Google Calendar | Google Calendar | Events sync |
| Zotero | Citations | Bibliography |
| Readwise | Readwise | Highlights |
| Notion | Importer | One-way import |
| Evernote | Importer | One-way import |
| Pocket | Various | Bookmarks |
| Raindrop | Various | Bookmarks |
| Twitter/X | Various | Threads/bookmarks |
| YouTube | Various | Transcripts |

#### API Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| Webhook | n8n integration | Automation |
| REST API | Plugin backends | Data sync |
| WebSocket | Real-time plugins | Live updates |
| OAuth | Cloud services | Authentication |
| Local HTTP | Companion apps | Desktop integration |

**The Keep Recommendation:**
```yaml
integrations:
  sync:
    primary: "server-sync"  # The Keep server
    backup_options:
      - s3_compatible
      - webdav
      - local_folder

  import:
    - obsidian_vault
    - notion_export
    - evernote_enex
    - roam_json
    - markdown_folder
    - bear_notes
    - apple_notes

  export:
    - markdown_zip
    - html_static
    - pdf
    - json_api

  external_services:
    - todoist (tasks)
    - google_calendar (events)
    - raindrop (bookmarks)
    - readwise (highlights)
    - zotero (citations)

  automation:
    - webhooks (inbound/outbound)
    - api_endpoints (REST)
    - n8n_integration
```

---

## Part 3: Plugin Architecture Patterns

### 3.1 Plugin Lifecycle

```typescript
// Obsidian plugin pattern
class MyPlugin extends Plugin {
  // Called when plugin loads
  async onload() {
    // Register commands
    this.addCommand({...});

    // Register views
    this.registerView(...);

    // Register events
    this.registerEvent(
      this.app.workspace.on('file-open', ...)
    );

    // Register settings
    this.addSettingTab(new MySettingTab(this.app, this));
  }

  // Called when plugin unloads
  onunload() {
    // Cleanup handled automatically by register* methods
  }
}
```

### 3.2 Extension Points

| Extension Type | Purpose | Example |
|----------------|---------|---------|
| Commands | User actions | "Create daily note" |
| Views | Custom panels | Calendar view |
| Editor extensions | Modify editor | Syntax highlighting |
| Markdown post-processors | Transform output | Render charts |
| Code block handlers | Custom code blocks | ```dataview |
| Settings tabs | Configuration | Plugin settings |
| Ribbon icons | Quick actions | Sidebar buttons |
| Status bar items | Info display | Word count |
| File menu items | Context actions | "Open in new pane" |

### 3.3 Data Access Patterns

| Access Type | API | Use Case |
|-------------|-----|----------|
| Vault files | `this.app.vault` | Read/write files |
| Metadata cache | `this.app.metadataCache` | Frontmatter, links |
| Workspace | `this.app.workspace` | Open files, panes |
| File explorer | `this.app.fileExplorer` | Navigation |
| Settings | `this.loadData()` | Plugin config |

**The Keep Recommendation:**
```typescript
// Plugin architecture for The Keep
interface KeepPlugin {
  // Metadata
  id: string;
  name: string;
  version: string;

  // Lifecycle
  onLoad(): Promise<void>;
  onUnload(): Promise<void>;

  // Extension points
  registerCommand(cmd: Command): void;
  registerView(view: ViewDefinition): void;
  registerEditorExtension(ext: EditorExtension): void;
  registerMarkdownProcessor(proc: MarkdownProcessor): void;
  registerCodeBlockHandler(lang: string, handler: CodeBlockHandler): void;

  // Data access
  vault: VaultAPI;        // File operations
  metadata: MetadataAPI;  // Note metadata, links
  workspace: WorkspaceAPI; // UI, panes, views
  settings: SettingsAPI;   // Plugin config
}

// Code block handler example
registerCodeBlockHandler('keep-query', async (source, el, ctx) => {
  const results = await this.vault.query(source);
  renderResults(results, el);
});
```

---

## Part 4: Feature Recommendations for The Keep

### 4.1 Core Features (Must Have)

| Feature | Obsidian Equivalent | Priority |
|---------|---------------------|----------|
| YAML frontmatter | Core + Dataview | P0 |
| Inline fields | Dataview | P0 |
| Query language | Dataview | P0 |
| Task management | Tasks plugin | P0 |
| Tags (hierarchical) | Core + Tag Wrangler | P0 |
| Wiki-links | Core | P0 |
| Block references | Core | P0 |
| Full-text search | Omnisearch | P0 |
| Templates | Templater | P0 |
| Daily notes | Periodic Notes | P0 |

### 4.2 High-Value Features

| Feature | Obsidian Equivalent | Priority |
|---------|---------------------|----------|
| Kanban boards | Kanban plugin | P1 |
| Calendar view | Calendar, Full Calendar | P1 |
| Database tables | Bases | P1 |
| Canvas/whiteboard | Canvas, Excalidraw | P1 |
| AI integration | Copilot, Smart Connections | P1 |
| Quick capture | QuickAdd | P1 |
| Auto-formatting | Linter | P1 |
| Graph view | Core graph | P1 |

### 4.3 Nice-to-Have Features

| Feature | Obsidian Equivalent | Priority |
|---------|---------------------|----------|
| Mind maps | Mind Map plugin | P2 |
| Presentations | Advanced Slides | P2 |
| PDF annotation | PDF++ | P2 |
| External sync | Todoist, Calendar | P2 |
| Plugin system | Community plugins | P2 |
| Theme system | CSS + Style Settings | P2 |

### 4.4 Standard Vocabulary

```yaml
# The Keep Standard Property Schema

# Note types
note_types:
  - note          # General note
  - task          # Actionable item
  - project       # Collection of tasks
  - meeting       # Meeting notes
  - daily         # Daily journal
  - weekly        # Weekly review
  - reference     # Reference material
  - person        # Contact/person
  - book          # Book notes
  - article       # Article notes

# Status values
statuses:
  - draft         # Initial state
  - active        # Being worked on
  - review        # Under review
  - blocked       # Waiting on something
  - done          # Completed
  - archived      # No longer active
  - cancelled     # Abandoned

# Priority values
priorities:
  - critical      # Drop everything
  - high          # Do soon
  - medium        # Normal priority
  - low           # When time permits
  - none          # Unprioritized

# Contexts (GTD-style)
contexts:
  - "@home"
  - "@work"
  - "@phone"
  - "@computer"
  - "@errands"
  - "@waiting"
  - "@someday"
```

### 4.5 Query Language Specification

```
# Keep Query Language (KQL) Grammar

query := select_query | list_query | task_query | calendar_query

select_query :=
  "SELECT" field_list
  "FROM" source
  [where_clause]
  [order_clause]
  [limit_clause]
  [group_clause]

list_query :=
  "LIST" [field_list]
  "FROM" source
  [where_clause]
  [order_clause]
  [limit_clause]

task_query :=
  "TASKS"
  [where_clause]
  [order_clause]

calendar_query :=
  "CALENDAR" date_field
  "FROM" source
  [where_clause]

# Examples
SELECT title, status, due_date FROM notes WHERE tag = 'project'
LIST children FROM @current WHERE type = 'task'
TASKS WHERE due_date <= TODAY() AND NOT completed
CALENDAR due_date FROM notes WHERE type = 'task'
```

---

## Part 5: Implementation Roadmap

### Phase 1: Core Foundation
- [ ] YAML frontmatter parser/editor
- [ ] Markdown editor with wiki-links
- [ ] Basic full-text search
- [ ] Tag system (flat + hierarchical)
- [ ] File/folder structure

### Phase 2: Advanced Features
- [ ] Query language (KQL) implementation
- [ ] Task management with dates
- [ ] Daily/periodic notes
- [ ] Templates system
- [ ] Backlinks and graph

### Phase 3: Views & Visualization
- [ ] Table/database view
- [ ] Kanban board
- [ ] Calendar view
- [ ] Canvas/whiteboard
- [ ] Mind map view

### Phase 4: Intelligence
- [ ] AI-powered search
- [ ] Smart suggestions
- [ ] Auto-tagging
- [ ] Content generation
- [ ] Semantic linking

### Phase 5: Ecosystem
- [ ] Plugin architecture
- [ ] External integrations
- [ ] Sync infrastructure
- [ ] Import/export tools
- [ ] Theme system

---

## Appendix A: Plugin Quick Reference

### Top 25 Plugins - What They Teach Us

| Plugin | Key Lesson for The Keep |
|--------|------------------------|
| Excalidraw | Visual thinking is essential; SVG-based canvas with embedding |
| Templater | Template syntax: `<% expression %>`, JavaScript execution |
| Dataview | Query language is killer feature; inline fields critical |
| Tasks | Emoji-based metadata (`📅`, `⏳`); recurrence patterns |
| Advanced Tables | Tab/Enter navigation; formula support |
| Calendar | Mini calendar widget; click-to-create pattern |
| Git | Version history UI; conflict resolution |
| Kanban | Drag-drop columns; status-driven views |
| Style Settings | CSS variable exposure; theme customization API |
| Iconize | Rule-based icon assignment; folder customization |
| Remotely Save | Multi-provider sync; conflict detection |
| QuickAdd | Capture modals; macro chaining |
| Omnisearch | BM25 scoring; OCR/PDF indexing |
| Tag Wrangler | Bulk rename; merge operations |
| Smart Connections | Embedding-based similarity; local-first AI |

---

## Appendix B: Syntax Quick Reference

### Link Syntax
```markdown
[[Note]]              # Basic link
[[Note|Alias]]        # Aliased link
[[Note#Header]]       # Header link
[[Note^block]]        # Block link
![[Note]]             # Embed
![[Image.png|300]]    # Sized image
```

### Frontmatter
```yaml
---
tags: [project, active]
aliases: [alias1, alias2]
created: 2024-03-22
status: active
priority: high
due: 2024-04-15
related: "[[Other Note]]"
---
```

### Inline Fields
```markdown
Field:: Value
[field:: inline value]
(hidden_field:: value)
Status:: #status/active
Due:: 📅 2024-03-22
```

### Tasks
```markdown
- [ ] Basic task
- [x] Completed task
- [ ] Task with due date 📅 2024-03-22
- [ ] High priority task ⏫
- [ ] Recurring task 🔁 every week
- [ ] Task with all metadata 📅 2024-03-22 ⏳ 2024-03-20 🛫 2024-03-15 ⏫
```

### Queries (Dataview)
```dataview
TABLE status, due, priority
FROM #project
WHERE status != "done"
SORT priority DESC
```

### Callouts
```markdown
> [!note] Title
> Content

> [!warning]
> Warning content
```

---

## Sources

Research compiled from:
- [Obsidian Stats - Most Downloaded](https://www.obsidianstats.com/most-downloaded)
- [Obsidian Plugin Directory](https://obsidian.md/plugins)
- [Dataview Documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [Tasks Plugin Documentation](https://publish.obsidian.md/tasks/)
- [Templater Documentation](https://silentvoid13.github.io/Templater/)
- [Obsidian Help - Properties](https://help.obsidian.md/properties)
- [Obsidian Help - Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)
- [Obsidian Help - Bases](https://help.obsidian.md/bases)
- [Obsidian Developer Documentation](https://docs.obsidian.md/Home)
- [Linter Documentation](https://platers.github.io/obsidian-linter/)
- Community forum discussions and plugin repositories
