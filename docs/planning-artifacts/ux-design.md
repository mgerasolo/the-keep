---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - docs/planning-artifacts/product-brief.md
  - docs/planning-artifacts/prd.md
  - docs/DISCOVERY.md
  - docs/spikes/001-affine-dify-evaluation/FINDINGS.md
status: complete
---

# UX Design Specification: The Keep

**Author:** Matt
**Date:** 2026-03-22
**Version:** 1.0
**Status:** Complete

---

## 1. Executive Summary

The Keep is a **web-based Cursor-like IDE for personal knowledge management**. This UX specification defines the visual design, interaction patterns, and user flows for a solo-user workspace that combines file management, AI chat, and knowledge organization.

**Design Philosophy:**
- **Cursor/VS Code mental model** - familiar IDE patterns for power users
- **Flexibility over rigidity** - dockview panels let users arrange their workspace
- **AI as collaborator** - chat is a first-class citizen, not an afterthought
- **Personal context** - the system knows you (preferences, inventories, history)
- **Transparency** - user sees and controls what AI knows (atomic memories)

### 1.1 Key UX Differentiators

| Feature | ChatGPT/Other Tools | The Keep |
|---------|---------------------|----------|
| Memory System | Opaque paragraphs | Atomic key-value pairs, fully editable |
| File Management | Upload to chat | True file browser with folders |
| Layout | Fixed panels | Dockable anywhere (VS Code-style) |
| AI Integration | Separate interface | AI tab alongside files |
| Model Selection | One model | Multiple local/API models with cost awareness |

---

## 2. Discovery Summary

### 2.1 Product Context

**What The Keep IS:**
- A **file management system** with AI (like Cursor/VS Code)
- Personal knowledge workspace with isolated projects
- Self-hosted, privacy-first
- Repository for structured personal data (inventories, profiles, memories)

**What The Keep is NOT:**
- A wiki (Notion, Confluence)
- A document editor (Google Docs)
- A chatbot builder (Dify)
- A simple chat interface (ChatGPT)

### 2.2 Target User

| Attribute | Value |
|-----------|-------|
| User | Matt (solo user) |
| Skill Level | Intermediate technical |
| Primary Use | Personal knowledge management |
| Access Pattern | Daily use, desktop browser |
| Device | Desktop/laptop (1024px+ screens) |

### 2.3 Key Use Cases

| Domain | Examples | UX Priority |
|--------|----------|-------------|
| Health Records | Lab results, doctor notes, prescriptions | P0 - Primary |
| HOA Documents | Meeting minutes, CC&Rs, financials | P0 - Primary |
| Infrastructure Docs | Configs, runbooks, diagrams | P1 - Secondary |
| Learning Materials | Research papers, course notes | P1 - Secondary |
| Personal Inventories | Kitchen appliances, spices, pantry | P1 - Secondary |
| Recipe Assistance | AI uses health + inventory + preferences | P2 - Showcase |

### 2.4 Design Challenges

| Challenge | Approach |
|-----------|----------|
| Complex panel system | Use dockview with sensible defaults, progressive complexity |
| Multiple data types | Unified viewer framework with type-specific renderers |
| AI context management | Visual chips showing context files, easy add/remove |
| Memory transparency | Atomic display, inline editing, clear provenance |
| Model cost awareness | Visual indicators for local vs API models |

---

## 3. Design Principles

### 3.1 Core Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Familiar Patterns** | Use VS Code/Cursor conventions | Activity bar, command palette, tabs, split views |
| **Flexible Layout** | Users control their workspace | dockview panels, per-project layouts |
| **Context Awareness** | AI knows what you're working on | Open files auto-included, visual chips |
| **Progressive Disclosure** | Simple defaults, power features discoverable | Basic UI first, advanced in settings/menus |
| **Keyboard First** | Power users navigate without mouse | Cmd+K palette, standard shortcuts |
| **Transparency** | User sees what AI knows | Visible memories, editable context |

### 3.2 Design Constraints

| Constraint | Rationale |
|------------|-----------|
| Desktop-first (1024px+) | Personal workspace, not mobile |
| Single user (v1) | No multi-user complexity initially |
| Dark mode default | IDE aesthetic, matches Cursor |
| Self-hosted | Privacy-first, no cloud dependencies |
| Minimal onboarding | Solo user knows the domain |

### 3.3 Emotional Design Goals

| Emotion | How We Achieve It |
|---------|-------------------|
| **Control** | User arranges layout, edits memories, chooses models |
| **Confidence** | Clear feedback, visible AI context, no hidden magic |
| **Efficiency** | Keyboard shortcuts, quick actions, saved layouts |
| **Trust** | Transparent AI, editable data, local-first options |

---

## 4. Information Architecture

### 4.1 Navigation Model

```
THE KEEP
├── Activity Bar (far left, always visible, 48px)
│   ├── Project Icons (top section, scrollable)
│   │   ├── 🏥 Health
│   │   ├── 🏠 HOA
│   │   ├── ⚙️ Infrastructure
│   │   └── [+ New Project]
│   ├── ──────── (divider)
│   └── Global Actions (bottom section)
│       ├── 🔍 Global Search
│       ├── 🧠 Knowledge (profiles/inventories/memories)
│       └── ⚙️ Settings
│
├── Header Bar (top, 48px)
│   ├── App Logo + Title ("The Keep")
│   ├── Project Dropdown [Health ▼]
│   ├── [⌘K] Command Palette button
│   └── [⚙️] Settings
│
├── Primary Sidebar (left, resizable 180-400px)
│   └── File Browser
│       ├── Search/Filter input
│       ├── Tree View
│       │   ├── 📁 Folders (collapsible)
│       │   └── 📄 Files (type icons)
│       └── Actions
│           ├── [+ New File]
│           └── [↑ Upload]
│
├── Content Area (center, dockview managed)
│   ├── Tab Bar (36px)
│   │   └── [file.md ×] [file.pdf ×] [AI Chat ×] [+]
│   └── Panel Groups
│       ├── Editors/Viewers
│       ├── AI Chat (dockable tab)
│       └── Split Views (horizontal/vertical)
│
└── Auxiliary Panels (dockable anywhere)
    ├── AI Chat
    ├── Knowledge Editor
    ├── Embedded Browser
    └── Workflow Tasks
```

### 4.2 Project Structure

Each project is an isolated context:

```
PROJECT (e.g., "Health")
├── metadata
│   ├── name: "Health"
│   ├── icon: "🏥"
│   ├── description: "Medical records and health tracking"
│   └── created: 2024-01-15
├── settings
│   ├── defaultModel: "jarvis-chat"
│   ├── ragEnabled: true
│   └── savedLayout: {...}
├── files/
│   └── (user's file hierarchy)
├── conversations/
│   └── (chat history)
└── knowledge/
    ├── profile/
    │   └── (health criteria, preferences)
    ├── inventories/
    │   └── (structured lists)
    └── memories/
        └── (atomic facts)
```

### 4.3 Content Type Hierarchy

```
CONTENT TYPES
├── Documents (viewable/editable)
│   ├── Markdown (.md) → Editor + Preview
│   ├── PDF (.pdf) → PDF Viewer
│   ├── Images (.png, .jpg, .gif, .svg) → Image Viewer
│   ├── Code (.js, .ts, .py, etc.) → Code Viewer
│   └── Plain Text (.txt) → Text Editor
│
├── Knowledge (structured data)
│   ├── Profiles → Form Editor
│   ├── Inventories → List/Table Editor
│   └── Memories → Key-Value Editor
│
└── Auxiliary
    ├── AI Chat → Chat Panel
    ├── Embedded URLs → iframe
    └── Search Results → Results List
```

---

## 5. Core Screen Layouts

### 5.1 Primary Workspace (Default Layout)

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [notes.md ×] [labs.pdf ×] [AI Chat ×] [+]            │
│🏥├─────────────────┼───────────────────────────┬───────────────────────────┤
│  │ ▼ 📁 Labs       │                           │  AI CHAT                  │
│🏠│   📝 2024-03.md │   MARKDOWN EDITOR         │  ───────────────────────  │
│  │   📝 2024-01.md │   ═════════════════════   │  Model: [jarvis-chat ▼]   │
│⚙️│ ▼ 📁 Doctors    │   ## Lab Results          │   🏠 Local  ⚡ Fast        │
│  │   📝 dr-smith   │   | Test | Value |        │                           │
│──│ ▷ 📁 Rxs        │   |------|-------|        │  Context:                 │
│🔍│                 │   | A1C  | 5.4   |        │  [📝 notes.md ×]          │
│  │                 │   | Chol | 180   |        │  [📕 labs.pdf ×] [+]      │
│🧠│                 │                           │  ───────────────────────  │
│  │ ─────────────── │   ┌─────────────────────┐ │  👤 Summarize my latest   │
│⚙️│ [+ New] [↑ Up]  │   │[B][I][H1]["][Table] │ │     lab results           │
│  │                 │   └─────────────────────┘ │                           │
│  │                 │                           │  🤖 Based on your March   │
│  │                 │                           │     labs, your A1C is...  │
│  │                 │                           │                           │
│  │                 │                           │  [Type message...   ][▶]  │
└──┴─────────────────┴───────────────────────────┴───────────────────────────┘
     48px                240px                    flex                flex
```

**Zone Breakdown:**
| Zone | Width | Purpose |
|------|-------|---------|
| Activity Bar | 48px fixed | Project switching, global actions |
| File Browser | 240px default (180-400px) | File navigation |
| Primary Editor | flex | Active document |
| AI Chat | flex (min 320px) | AI assistant |

### 5.2 Split View Layout (Multi-Document)

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [notes.md ×] [labs.pdf ×] [meds.md ×] [+]            │
│🏥├─────────────────┼─────────────────────────┬─────────────────────────────┤
│  │ ▼ 📁 Labs       │  📝 notes.md            │  📕 labs.pdf                │
│🏠│   📝 2024-03.md │  ═══════════════════    │  ═════════════════════════  │
│  │   📝 2024-01.md │                         │                             │
│⚙️│ ▼ 📁 Doctors    │  ## Doctor Visit Notes  │  ┌─────────────────────────┐│
│  │   📝 dr-smith   │                         │  │                         ││
│──│ ▷ 📁 Rxs        │  - Follow up on A1C     │  │   QUEST DIAGNOSTICS     ││
│🔍│                 │  - Schedule MRI review  │  │   Patient: Matt G       ││
│  │                 │  - Refill metformin     │  │   ─────────────────     ││
│🧠│                 │                         │  │   A1C: 5.4 %            ││
│  │                 │  ### Action Items       │  │   Glucose: 95 mg/dL     ││
│⚙️│ ─────────────── │  - [ ] Call for MRI     │  │   Cholesterol: 180      ││
│  │ [+ New] [↑ Up]  │  - [x] Pick up Rx       │  │                         ││
│  │                 │                         │  └─────────────────────────┘│
│  │                 │  [B][I][H1]["][Table]   │  [◀] Page 1 of 3 [▶] [🔍+]  │
└──┴─────────────────┴─────────────────────────┴─────────────────────────────┘
```

### 5.3 AI Chat Focused Layout

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [AI Chat ×] [+]                                       │
│🏥├─────────────────┼───────────────────────────────────────────────────────┤
│  │ ▼ 📁 Labs       │  AI CHAT                                              │
│🏠│   📝 2024-03.md │  ═══════════════════════════════════════════════════  │
│  │   📝 2024-01.md │                                                       │
│⚙️│                 │  Model: [jarvis-qwen72b ▼]    Context: [All Files ▼]  │
│  │                 │   🏠 Local   ⚡ Powerful   💰 Free                     │
│──│                 │  ─────────────────────────────────────────────────────│
│🔍│                 │                                                       │
│  │                 │  👤 What were my cholesterol levels across all        │
│🧠│                 │     lab results this year? Show me a trend.           │
│  │                 │                                                       │
│⚙️│                 │  🤖 I've analyzed your lab results from January,      │
│  │                 │     February, and March 2024:                         │
│  │                 │                                                       │
│  │                 │     | Date    | Total | LDL | HDL |                   │
│  │                 │     |---------|-------|-----|-----|                   │
│  │                 │     | Jan '24 | 195   | 120 | 55  |                   │
│  │                 │     | Feb '24 | 188   | 115 | 58  |                   │
│  │                 │     | Mar '24 | 180   | 108 | 60  |                   │
│  │                 │                                                       │
│  │                 │     Your cholesterol is trending downward - great     │
│  │                 │     progress on the diet changes!                     │
│  │                 │                                                       │
│  │                 │  ─────────────────────────────────────────────────────│
│  │                 │  [Type your message...                       ] [▶]   │
│  │                 │  [📎 Add files] [🧠 Use memories]                     │
└──┴─────────────────┴───────────────────────────────────────────────────────┘
```

### 5.4 Personal Knowledge: Profile Editor

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [Health Profile ×] [+]                                │
│🏥├─────────────────┼───────────────────────────────────────────────────────┤
│  │ ▼ 🧠 Knowledge  │  MY HEALTH PROFILE                                    │
│🏠│   ▼ Profile     │  ═══════════════════════════════════════════════════  │
│  │     health      │                                                       │
│⚙️│     dietary     │  HEALTH CRITERIA                     [+ Add Field]    │
│  │   ▼ Inventories │  ─────────────────────────────────────────────────────│
│──│     pantry      │  ┌────────────────┬─────────────────┬───────────────┐ │
│🔍│     appliances  │  │ Field          │ Value           │ Actions       │ │
│  │   ▼ Memories    │  ├────────────────┼─────────────────┼───────────────┤ │
│🧠│     (12 items)  │  │ Low Sodium     │ ☑ Yes           │ [✏️] [🗑️]    │ │
│  │                 │  │ Diabetic Diet  │ ☑ Yes           │ [✏️] [🗑️]    │ │
│⚙️│ ▼ 📁 Labs       │  │ Gluten-Free    │ ☐ No            │ [✏️] [🗑️]    │ │
│  │                 │  │ Heart-Healthy  │ ☑ Yes           │ [✏️] [🗑️]    │ │
│  │                 │  └────────────────┴─────────────────┴───────────────┘ │
│  │                 │                                                       │
│  │                 │  DIETARY RESTRICTIONS                [+ Add]          │
│  │                 │  ─────────────────────────────────────────────────────│
│  │                 │  • No shellfish (allergy)                    [🗑️]    │
│  │                 │  • Limit red meat                            [🗑️]    │
│  │                 │                                                       │
│  │                 │  PREFERENCES                          [+ Add]          │
│  │                 │  ─────────────────────────────────────────────────────│
│  │                 │  ♥ Mediterranean cuisine                     [🗑️]    │
│  │                 │  ♥ Indian food                               [🗑️]    │
│  │                 │  ✗ Overly spicy dishes                       [🗑️]    │
└──┴─────────────────┴───────────────────────────────────────────────────────┘
```

### 5.5 Personal Knowledge: Inventory Manager

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [Pantry ×] [Appliances ×] [+]                         │
│🏥├─────────────────┼───────────────────────────────────────────────────────┤
│  │ ▼ 🧠 Knowledge  │  PANTRY INVENTORY                    [+ Add Item]     │
│🏠│   ▷ Profile     │  ═══════════════════════════════════════════════════  │
│  │   ▼ Inventories │                                                       │
│⚙️│     pantry ◀    │  🔍 Search items...           [View: List ▼]          │
│  │     appliances  │                                                       │
│──│     spices      │  SPICES (8 items)                                     │
│🔍│   ▷ Memories    │  ─────────────────────────────────────────────────────│
│  │                 │  ┌─────────────┬──────────┬─────────┬────────────────┐│
│🧠│ ▼ 📁 Labs       │  │ Item        │ Status   │ Notes   │ Actions        ││
│  │                 │  ├─────────────┼──────────┼─────────┼────────────────┤│
│⚙️│                 │  │ Cumin       │ ●●●● Full│         │ [✏️] [🗑️]     ││
│  │                 │  │ Paprika     │ ●●○○ Low │ Reorder │ [✏️] [🗑️]     ││
│  │                 │  │ Turmeric    │ ●●●● Full│         │ [✏️] [🗑️]     ││
│  │                 │  │ Oregano     │ ○○○○ ⚠️  │ Out!    │ [✏️] [🗑️]     ││
│  │                 │  │ Cinnamon    │ ●●●○ Med │         │ [✏️] [🗑️]     ││
│  │                 │  └─────────────┴──────────┴─────────┴────────────────┘│
│  │                 │                                                       │
│  │                 │  PANTRY STAPLES (5 items)                             │
│  │                 │  ─────────────────────────────────────────────────────│
│  │                 │  │ Rice        │ ●●●● 5lb │         │ [✏️] [🗑️]     ││
│  │                 │  │ Pasta       │ ●●○○ 2box│         │ [✏️] [🗑️]     ││
│  │                 │  │ Olive Oil   │ ●●○○ Half│ Get 2L  │ [✏️] [🗑️]     ││
└──┴─────────────────┴───────────────────────────────────────────────────────┘
```

### 5.6 Personal Knowledge: AI Memories (Atomic View)

This is the **key differentiator** from ChatGPT's opaque memory system.

```
┌──┬─────────────────────────────────────────────────────────────────────────┐
│  │  The Keep                           [Health ▼] [⌘K] [⚙️]                │
│  ├─────────────────┬───────────────────────────────────────────────────────┤
│  │ 🔍 Filter...    │ [AI Memories ×] [+]                                   │
│🏥├─────────────────┼───────────────────────────────────────────────────────┤
│  │ ▼ 🧠 Knowledge  │  AI MEMORIES                         [+ Add Memory]   │
│🏠│   ▷ Profile     │  ═══════════════════════════════════════════════════  │
│  │   ▷ Inventories │  What I've learned about you. Each memory is one     │
│⚙️│   ▼ Memories ◀  │  fact - edit or delete any time.                      │
│  │     (18 items)  │                                                       │
│──│                 │  🔍 Search memories...    [Category: All ▼]           │
│🔍│ ▼ 📁 Labs       │                                                       │
│  │                 │  HEALTH (6 memories)                   [Expand All]   │
│🧠│                 │  ─────────────────────────────────────────────────────│
│  │                 │  ┌────────────────────────────────────────────────────┐
│⚙️│                 │  │ 💊 medication    metformin 500mg twice daily       │
│  │                 │  │    Source: Chat 3/15  │ [✏️ Edit] [🗑️]            │
│  │                 │  ├────────────────────────────────────────────────────┤
│  │                 │  │ 🎯 a1c_goal      under 5.5                         │
│  │                 │  │    Source: Chat 3/10  │ [✏️ Edit] [🗑️]            │
│  │                 │  ├────────────────────────────────────────────────────┤
│  │                 │  │ ⏰ appointment   prefers morning appointments      │
│  │                 │  │    Source: Chat 2/28  │ [✏️ Edit] [🗑️]            │
│  │                 │  └────────────────────────────────────────────────────┘
│  │                 │                                                       │
│  │                 │  COOKING (5 memories)                                 │
│  │                 │  ─────────────────────────────────────────────────────│
│  │                 │  │ 🍳 weeknight    prefers one-pot meals              │
│  │                 │  │ 📅 meal_prep    does meal prep on Sundays          │
│  │                 │  │ 📋 complexity   avoids 10+ ingredient recipes     │
│  │                 │                                                       │
│  │                 │  ┌──────────────────────────────────────────────────┐ │
│  │                 │  │ ⚡ PENDING REVIEW (1)                             │ │
│  │                 │  │ ──────────────────────────────────────────────── │ │
│  │                 │  │ "You mentioned preferring air fryer recipes"     │ │
│  │                 │  │ Suggested: cooking.appliance_pref = air fryer    │ │
│  │                 │  │ Source: Chat today at 2:34 PM                    │ │
│  │                 │  │                                                  │ │
│  │                 │  │ [✓ Save] [✏️ Edit] [✗ Discard]                   │ │
│  │                 │  └──────────────────────────────────────────────────┘ │
└──┴─────────────────┴───────────────────────────────────────────────────────┘
```

**Key Design Elements:**
- Each memory is ONE atomic fact (key-value)
- Clear provenance (source conversation, date)
- Inline editing capability
- Pending review section for AI-extracted suggestions
- User must approve before memory is saved

---

## 6. Component Specifications

### 6.1 Activity Bar

| Property | Value |
|----------|-------|
| Width | 48px fixed |
| Position | Far left, full viewport height |
| Background | #1a1a1a (darkest) |
| Icon Size | 24px, centered horizontally |
| Icon Spacing | 8px vertical padding |
| Hover | Background #2d2d2d + tooltip |
| Active | 2px left border accent + #252525 background |
| Divider | 1px #333 horizontal line |

**Sections:**
```
┌──────┐
│ 🏥   │ ← Project icons (top, scrollable)
│ 🏠   │
│ ⚙️   │
│ ──── │ ← Divider
│ 🔍   │ ← Global actions (bottom, fixed)
│ 🧠   │
│ ⚙️   │
└──────┘
```

### 6.2 File Browser Sidebar

| Property | Value |
|----------|-------|
| Width | 240px default, resizable 180-400px |
| Background | #252525 |
| Resize Handle | 4px, cursor: col-resize |
| Search Input | Full width, 32px height |

**Tree View Specifications:**
| Element | Style |
|---------|-------|
| Folder Indent | 16px per level |
| Expand Arrow | 12px, rotates 90deg on expand |
| File Icon | 16px, type-specific color |
| Selected Item | Background #3d3d3d |
| Hover | Background #2d2d2d |
| Context Menu | Standard right-click menu |

**File Type Icons:**
| Type | Icon | Color |
|------|------|-------|
| Folder (closed) | 📁 | #e8a838 |
| Folder (open) | 📂 | #e8a838 |
| Markdown | 📝 | #569cd6 |
| PDF | 📕 | #e74c3c |
| Image | 🖼️ | #27ae60 |
| Code | 💻 | #9b59b6 |
| Text/Unknown | 📄 | #888888 |

### 6.3 Tab Bar

| Property | Value |
|----------|-------|
| Height | 36px |
| Background | #1e1e1e |
| Tab Min Width | 100px |
| Tab Max Width | 200px |
| Tab Padding | 8px horizontal |

**Tab States:**
| State | Style |
|-------|-------|
| Active | Background #2d2d2d, text #ffffff, bottom border accent |
| Inactive | Background #1e1e1e, text #888888 |
| Hover | Background #252525 |
| Modified | White dot (●) before close button |
| Pinned | Pin icon, fixed 60px width |

**Tab Anatomy:**
```
┌─────────────────────────────┐
│ 📝 filename.md         [×] │
└─────────────────────────────┘
  ^   ^                   ^
  |   |                   Close button (hover)
  |   File name (truncate with ellipsis)
  Type icon
```

### 6.4 AI Chat Panel

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ AI Chat                            [×]  │ ← Header (36px)
├─────────────────────────────────────────┤
│ Model: [jarvis-chat ▼]                  │ ← Model selector (40px)
│  🏠 Local  ⚡ Fast  💰 Free              │ ← Model badges
├─────────────────────────────────────────┤
│ Context:                                │ ← Context section (auto)
│ [📝 notes.md ×] [📕 labs.pdf ×] [+]     │ ← File chips
├─────────────────────────────────────────┤
│                                         │
│ 👤 User message                         │ ← Message area (flex)
│                                         │
│ 🤖 AI response with **markdown**        │
│    - Bullet points                      │
│    - Tables render                      │
│    ```code blocks```                    │
│                                         │
│ 👤 Another user message                 │
│                                         │
│ ⋯ AI is typing...                       │
│                                         │
├─────────────────────────────────────────┤
│ [Type your message...              ] [▶]│ ← Input area (56px)
│ [📎 Attach] [🧠 Memories]               │ ← Action buttons
└─────────────────────────────────────────┘
```

**Model Selector (Expanded):**
```
┌─────────────────────────────────────────┐
│ Model: [jarvis-chat ▼]                  │
├─────────────────────────────────────────┤
│ LOCAL MODELS (Free)                     │
│ ─────────────────────────────────────── │
│ ○ jarvis-chat        🏠 ⚡ Fast         │
│ ○ jarvis-qwen72b     🏠 🧠 Powerful     │
│ ○ jarvis-codellama   🏠 💻 Code         │
│                                         │
│ API MODELS (Paid)                       │
│ ─────────────────────────────────────── │
│ ○ gpt-4-turbo        ☁️ 💰 $$$          │
│ ○ claude-3-opus      ☁️ 💰 $$           │
│ ○ claude-3-sonnet    ☁️ 💰 $            │
└─────────────────────────────────────────┘
```

**Model Recommendation Toast:**
```
┌─────────────────────────────────────────┐
│ 💡 This task might work better with     │
│    jarvis-qwen72b (complex reasoning)   │
│                                         │
│    [Switch Model] [Keep Current]        │
└─────────────────────────────────────────┘
```

### 6.5 LLM Selection UI (Detailed)

**Design Goals:**
1. Clear distinction between local (free) and API (paid) models
2. Smart recommendations without being intrusive
3. Quick switching without leaving chat context

**Model Card Component:**
```
┌─────────────────────────────────────────┐
│ jarvis-qwen72b                          │
│ ──────────────────────────────────────  │
│ 🏠 Local    🧠 Complex Reasoning        │
│ 💰 Free     ⏱️ ~5s response             │
│                                         │
│ Best for: Analysis, summaries, complex  │
│ questions requiring deep reasoning      │
└─────────────────────────────────────────┘
```

**Badge Reference:**
| Badge | Meaning |
|-------|---------|
| 🏠 Local | Runs on local infrastructure |
| ☁️ Cloud | API call to external service |
| ⚡ Fast | Quick response time |
| 🧠 Powerful | Best for complex reasoning |
| 💻 Code | Optimized for code tasks |
| 💰 Free | No per-token cost |
| 💰 $ | Low cost per token |
| 💰 $$ | Medium cost |
| 💰 $$$ | High cost |

**Recommendation Trigger Patterns:**
| User Query Pattern | Suggested Model | Reason |
|-------------------|-----------------|--------|
| "analyze", "compare", "explain why" | jarvis-qwen72b | Complex reasoning |
| Code blocks, "debug", "refactor" | jarvis-codellama | Code optimization |
| Quick questions, simple facts | jarvis-chat | Fast response |
| Very complex analysis + large context | gpt-4-turbo | Maximum capability |

### 6.6 Command Palette

| Property | Value |
|----------|-------|
| Trigger | Cmd+K (Mac) / Ctrl+K (Windows) |
| Position | Top center, 32px from top |
| Width | 560px |
| Max Height | 400px (scrollable) |
| Background | #2d2d2d |
| Border | 1px #444 |
| Shadow | 0 8px 32px rgba(0,0,0,0.5) |

**Anatomy:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Type a command or search...                          │
├─────────────────────────────────────────────────────────┤
│ RECENT                                                  │
│ ○ 📝 notes.md                              ↵ to open   │
│ ○ 📕 labs-march-2024.pdf                   ↵ to open   │
├─────────────────────────────────────────────────────────┤
│ COMMANDS                                                │
│ ○ New File                                 ⌘N          │
│ ○ New Folder                               ⌘⇧N         │
│ ○ AI: New Chat                             ⌘⇧A         │
│ ○ Switch Project                           ⌘⇧P         │
│ ○ Toggle Sidebar                           ⌘B          │
│ ○ Settings                                 ⌘,          │
└─────────────────────────────────────────────────────────┘
```

### 6.7 Memory Editor Component

**Inline Edit Mode:**
```
┌────────────────────────────────────────────────────────┐
│ 💊 medication    [metformin 500mg twice daily    ]    │
│    ─────────────────────────────────────────────────   │
│    Source: Chat 3/15  [Cancel] [Save]                  │
└────────────────────────────────────────────────────────┘
```

**Memory Review Modal:**
```
┌────────────────────────────────────────────────────────┐
│ Save Memory?                                      [×]  │
├────────────────────────────────────────────────────────┤
│ The AI noticed something that might be worth saving:   │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ "You mentioned you prefer air fryer recipes"       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ Save as:                                               │
│ Category: [cooking        ▼]                          │
│ Key:      [appliance_pref    ]                        │
│ Value:    [air fryer         ]                        │
│                                                        │
│                    [Cancel] [Save Memory]              │
└────────────────────────────────────────────────────────┘
```

---

## 7. User Flows

### 7.1 First-Time Setup Flow

```
1. User opens The Keep for first time
2. Welcome screen: "Create your first project"
3. Project creation form:
   - Name (required)
   - Icon (emoji picker)
   - Description (optional)
4. Project created, redirected to empty workspace
5. Prompt: "Upload your first files" with drop zone
6. Files uploaded, appear in tree
7. Double-click opens file in editor
8. Sidebar prompt: "Try asking AI about your files"
```

### 7.2 File Upload Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. INITIATE                                             │
│    User drags files to browser OR clicks [↑ Upload]     │
├─────────────────────────────────────────────────────────┤
│ 2. FEEDBACK                                             │
│    Drop zone highlights (dashed border, bg color)       │
│    "Drop files here to upload"                          │
├─────────────────────────────────────────────────────────┤
│ 3. UPLOAD                                               │
│    Progress bar appears in file browser                 │
│    "Uploading 3 files... 45%"                          │
├─────────────────────────────────────────────────────────┤
│ 4. COMPLETE                                             │
│    Files appear in tree at target folder                │
│    Toast: "3 files uploaded successfully"               │
│    Single file auto-opens in editor                     │
├─────────────────────────────────────────────────────────┤
│ 5. INDEX (background)                                   │
│    Files added to RAG index                             │
│    Small indicator: "Indexing..."                       │
└─────────────────────────────────────────────────────────┘
```

### 7.3 AI Chat Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. OPEN CHAT                                            │
│    Click AI Chat in activity bar OR Cmd+Shift+A         │
│    OR drag file to "Ask AI" zone                        │
├─────────────────────────────────────────────────────────┤
│ 2. SET CONTEXT                                          │
│    Currently open files auto-added as context chips     │
│    User can click [+] to add more files                 │
│    User can click [×] on chips to remove                │
├─────────────────────────────────────────────────────────┤
│ 3. SELECT MODEL (optional)                              │
│    Default: project's default model                     │
│    Click dropdown to change                             │
│    See badges for cost/capability                       │
├─────────────────────────────────────────────────────────┤
│ 4. COMPOSE MESSAGE                                      │
│    Type in input area                                   │
│    [📎] to attach additional files                      │
│    [🧠] to include memories in context                  │
├─────────────────────────────────────────────────────────┤
│ 5. SEND                                                 │
│    Click [▶] or press Enter                             │
│    User message appears in chat                         │
│    "AI is typing..." indicator                          │
├─────────────────────────────────────────────────────────┤
│ 6. RESPONSE                                             │
│    AI response streams in with markdown rendering       │
│    Code blocks have syntax highlighting                 │
│    Tables render properly                               │
├─────────────────────────────────────────────────────────┤
│ 7. MEMORY EXTRACTION (if applicable)                    │
│    AI detects fact worth saving                         │
│    Toast: "Save this as a memory?"                      │
│    User: [Save] [Edit] [Dismiss]                        │
├─────────────────────────────────────────────────────────┤
│ 8. CONTINUE                                             │
│    User can continue conversation                       │
│    History persists per project                         │
│    [New Chat] to start fresh                            │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Model Selection Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. DEFAULT MODEL                                        │
│    Chat opens with project's default model              │
│    Badge shows: 🏠 Local ⚡ Fast 💰 Free               │
├─────────────────────────────────────────────────────────┤
│ 2. MANUAL CHANGE                                        │
│    Click model dropdown                                 │
│    See all available models grouped by type             │
│    LOCAL MODELS (Free)                                  │
│    API MODELS (Paid)                                    │
│    Select desired model                                 │
├─────────────────────────────────────────────────────────┤
│ 3. SMART RECOMMENDATION (contextual)                    │
│    User asks complex analysis question                  │
│    System detects pattern                               │
│    Toast appears (non-blocking):                        │
│    "💡 This might work better with jarvis-qwen72b"     │
│    [Switch] [Keep Current]                              │
├─────────────────────────────────────────────────────────┤
│ 4. SWITCH CONFIRMATION                                  │
│    If switching to paid model:                          │
│    "⚠️ gpt-4-turbo costs ~$0.01/1K tokens"             │
│    [Proceed] [Cancel]                                   │
├─────────────────────────────────────────────────────────┤
│ 5. PERSIST PREFERENCE                                   │
│    Model choice persists for this chat                  │
│    Optional: "Set as project default?" checkbox         │
└─────────────────────────────────────────────────────────┘
```

### 7.5 Memory Management Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. VIEW MEMORIES                                        │
│    Click 🧠 in activity bar                             │
│    OR navigate to Knowledge > Memories                  │
├─────────────────────────────────────────────────────────┤
│ 2. BROWSE                                               │
│    Memories grouped by category                         │
│    Search/filter available                              │
│    Each memory shows: key, value, source, date          │
├─────────────────────────────────────────────────────────┤
│ 3. EDIT MEMORY                                          │
│    Click [✏️] on any memory                             │
│    Field becomes editable inline                        │
│    [Save] or [Cancel]                                   │
│    Change is immediate, no "are you sure"               │
├─────────────────────────────────────────────────────────┤
│ 4. DELETE MEMORY                                        │
│    Click [🗑️] on any memory                            │
│    Confirmation: "Delete this memory?"                  │
│    [Delete] [Cancel]                                    │
├─────────────────────────────────────────────────────────┤
│ 5. ADD MANUAL MEMORY                                    │
│    Click [+ Add Memory]                                 │
│    Form: Category, Key, Value                           │
│    Source auto-set to "manual"                          │
├─────────────────────────────────────────────────────────┤
│ 6. REVIEW PENDING                                       │
│    AI-extracted suggestions appear in "Pending" section │
│    For each: [Save] [Edit] [Discard]                    │
│    Can edit before saving                               │
│    Discarded memories won't be suggested again          │
└─────────────────────────────────────────────────────────┘
```

### 7.6 Profile/Inventory Management Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. ACCESS                                               │
│    Click 🧠 > Profile or 🧠 > Inventories               │
│    OR open via command palette                          │
├─────────────────────────────────────────────────────────┤
│ 2. VIEW                                                 │
│    Profile: Form view with sections                     │
│    Inventory: Table/list view with items                │
├─────────────────────────────────────────────────────────┤
│ 3. EDIT PROFILE                                         │
│    Click [Edit Profile] or inline edit                  │
│    Toggle checkboxes                                    │
│    Add/remove list items                                │
│    Auto-saves on change                                 │
├─────────────────────────────────────────────────────────┤
│ 4. MANAGE INVENTORY                                     │
│    [+ Add Item] - Opens add form                        │
│    Inline edit existing items                           │
│    Status indicators (full/low/empty)                   │
│    Sort/filter by category                              │
├─────────────────────────────────────────────────────────┤
│ 5. AI AWARENESS                                         │
│    All profile/inventory data available to AI           │
│    AI can suggest: "Based on your pantry..."           │
│    AI can ask: "Should I add this to your inventory?"  │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Responsive Behavior

### 8.1 Viewport Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Unsupported | < 768px | Show "Desktop only" message |
| Compact | 768-1024px | Sidebar collapsed by default, single pane |
| Standard | 1024-1440px | Full layout, sidebar visible |
| Wide | > 1440px | Comfortable multi-pane layouts |

### 8.2 Component Responsive Rules

| Component | Compact (768-1024) | Standard (1024-1440) | Wide (1440+) |
|-----------|-------------------|---------------------|--------------|
| Activity Bar | 48px, always visible | Same | Same |
| File Browser | Collapsed, overlay | 240px, inline | 280px |
| Content Area | Single pane | 1-2 panes | 2-3 panes |
| AI Chat | Full width or collapsed | 320px min | 400px comfortable |

### 8.3 Panel Behavior

**Resize Constraints:**
| Panel | Min Width | Default | Max Width |
|-------|-----------|---------|-----------|
| File Browser | 180px | 240px | 400px |
| Content Pane | 300px | flex | unlimited |
| AI Chat | 300px | 360px | 600px |

**Collapse Behavior:**
- File browser: Double-click edge to collapse/expand
- AI Chat: Can be closed, re-opened via activity bar
- Split panes: Drag divider to edge to collapse

---

## 9. Accessibility

### 9.1 Keyboard Navigation

**Global Shortcuts:**
| Action | Mac | Windows |
|--------|-----|---------|
| Command Palette | Cmd+K | Ctrl+K |
| New File | Cmd+N | Ctrl+N |
| New Folder | Cmd+Shift+N | Ctrl+Shift+N |
| Save | Cmd+S | Ctrl+S |
| Close Tab | Cmd+W | Ctrl+W |
| Switch Tab | Cmd+1-9 | Ctrl+1-9 |
| Next Tab | Cmd+Tab | Ctrl+Tab |
| Previous Tab | Cmd+Shift+Tab | Ctrl+Shift+Tab |
| Toggle Sidebar | Cmd+B | Ctrl+B |
| Focus File Browser | Cmd+Shift+E | Ctrl+Shift+E |
| Focus AI Chat | Cmd+Shift+A | Ctrl+Shift+A |
| Switch Project | Cmd+Shift+P | Ctrl+Shift+P |
| Settings | Cmd+, | Ctrl+, |
| Search in Files | Cmd+Shift+F | Ctrl+Shift+F |

**Focus Management:**
| Context | Tab Behavior |
|---------|--------------|
| File Browser | Arrow keys navigate tree, Enter opens |
| Tab Bar | Arrow keys switch tabs, Enter activates |
| Chat | Tab moves between input and messages |
| Command Palette | Arrow keys navigate, Enter selects |
| Modals | Tab cycles through form fields |

### 9.2 ARIA Implementation

| Component | ARIA Attributes |
|-----------|-----------------|
| Activity Bar | role="navigation", aria-label="Projects" |
| File Tree | role="tree", aria-expanded on folders |
| Tabs | role="tablist", role="tab", aria-selected |
| Chat Messages | role="log", aria-live="polite" |
| Modals | role="dialog", aria-modal="true" |
| Dropdowns | role="listbox", aria-activedescendant |

### 9.3 Color Contrast

All text meets WCAG AA standards:
| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Primary Text | #e0e0e0 | #1e1e1e | 12.6:1 |
| Secondary Text | #888888 | #1e1e1e | 5.3:1 |
| Link/Accent | #569cd6 | #1e1e1e | 5.7:1 |
| Error | #f14c4c | #1e1e1e | 5.1:1 |

---

## 10. Visual Design System

### 10.1 Color Palette

**Dark Theme (Default):**
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deepest` | #1a1a1a | Activity bar |
| `--bg-deep` | #1e1e1e | Content area |
| `--bg-dark` | #252525 | Sidebar, cards |
| `--bg-medium` | #2d2d2d | Hover states, elevated |
| `--bg-light` | #3d3d3d | Active/selected |
| `--border` | #333333 | Dividers, borders |
| `--text-primary` | #e0e0e0 | Main content |
| `--text-secondary` | #888888 | Labels, hints |
| `--text-muted` | #666666 | Disabled |
| `--accent-primary` | #569cd6 | Links, actions |
| `--accent-success` | #4ec9b0 | Success states |
| `--accent-warning` | #ce9178 | Warnings |
| `--accent-error` | #f14c4c | Errors |
| `--accent-info` | #9cdcfe | Info highlights |

**Light Theme (Optional):**
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deepest` | #f3f3f3 | Activity bar |
| `--bg-deep` | #ffffff | Content area |
| `--bg-dark` | #f8f8f8 | Sidebar |
| `--text-primary` | #333333 | Main content |
| `--accent-primary` | #0066cc | Links, actions |

### 10.2 Typography

| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| `--font-h1` | Inter | 24px | 600 | 1.3 |
| `--font-h2` | Inter | 20px | 600 | 1.3 |
| `--font-h3` | Inter | 16px | 600 | 1.4 |
| `--font-body` | Inter | 14px | 400 | 1.5 |
| `--font-small` | Inter | 12px | 400 | 1.4 |
| `--font-label` | Inter | 12px | 500 | 1.4 |
| `--font-code` | JetBrains Mono | 13px | 400 | 1.5 |
| `--font-tabs` | Inter | 13px | 500 | 1.2 |

### 10.3 Spacing Scale

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Component internal padding |
| `--space-3` | 12px | Related elements |
| `--space-4` | 16px | Section spacing |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Major sections |
| `--space-8` | 32px | Page margins |

### 10.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs |
| `--radius-md` | 6px | Cards, panels |
| `--radius-lg` | 8px | Modals, overlays |
| `--radius-full` | 9999px | Pills, avatars |

### 10.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.2) | Subtle elevation |
| `--shadow-md` | 0 4px 12px rgba(0,0,0,0.3) | Dropdowns, tooltips |
| `--shadow-lg` | 0 8px 32px rgba(0,0,0,0.5) | Modals, command palette |

### 10.6 Animation

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 150ms ease-out | Hover states |
| `--transition-normal` | 250ms ease-out | Panel expansion |
| `--transition-slow` | 400ms ease-out | Page transitions |

---

## 11. Error States & Edge Cases

### 11.1 Error Handling Patterns

**File Operations:**
| Error | Display | Action |
|-------|---------|--------|
| Upload failed | Toast: "Upload failed: [reason]" | [Retry] button |
| File not found | Editor: "File not found" placeholder | [Locate] [Remove Tab] |
| Save failed | Toast: "Could not save. Retrying..." | Auto-retry with backoff |
| Large file | Modal: "File too large (>50MB)" | Offer compression or cancel |

**AI Chat:**
| Error | Display | Action |
|-------|---------|--------|
| Model unavailable | Banner in chat: "jarvis-chat is offline" | Suggest alternative model |
| Response timeout | Message: "Response timed out" | [Retry] [Try different model] |
| Context too large | Warning: "Context truncated to fit model limits" | Show what was included |
| Rate limited | Toast: "Too many requests. Wait 30s" | Countdown timer |

**Authentication:**
| Error | Display | Action |
|-------|---------|--------|
| Session expired | Modal: "Session expired" | [Log in again] |
| Unauthorized | Redirect to login | Show error message |

### 11.2 Empty States

**Empty Project:**
```
┌─────────────────────────────────────────┐
│                                         │
│         📁                              │
│                                         │
│    Your project is empty                │
│                                         │
│    Drag files here or click to upload   │
│                                         │
│    [↑ Upload Files]  [Create File]      │
│                                         │
└─────────────────────────────────────────┘
```

**No Memories:**
```
┌─────────────────────────────────────────┐
│                                         │
│         🧠                              │
│                                         │
│    No memories yet                      │
│                                         │
│    The AI will learn from your          │
│    conversations and save facts here.   │
│                                         │
│    [+ Add Memory Manually]              │
│                                         │
└─────────────────────────────────────────┘
```

**No Search Results:**
```
┌─────────────────────────────────────────┐
│                                         │
│         🔍                              │
│                                         │
│    No results for "xyz"                 │
│                                         │
│    Try different keywords or            │
│    check your spelling                  │
│                                         │
└─────────────────────────────────────────┘
```

### 11.3 Loading States

| Context | Loading Indicator |
|---------|-------------------|
| File tree | Skeleton with shimmer |
| File content | Centered spinner |
| AI response | Typing dots animation |
| Search | "Searching..." with spinner |
| Upload | Progress bar with percentage |
| Page load | Full-screen subtle spinner |

---

## 12. v1 Scope Summary

### 12.1 Included in v1

| Category | Features |
|----------|----------|
| **Workspace** | dockview panels, activity bar, file browser, tabs |
| **Files** | Upload, view, organize, delete |
| **Viewing** | Markdown (rendered), PDF, images |
| **Editing** | Markdown editor with toolbar |
| **AI Chat** | Dockable tab, context awareness, model selection |
| **Models** | Multiple local models, cost indicators |
| **Knowledge** | Profiles, inventories, atomic memories |
| **Projects** | Create, switch, per-project settings |
| **Search** | File name filtering, command palette |

### 12.2 Explicitly Deferred

| Feature | Target Version |
|---------|----------------|
| OCR / text extraction from scans | v2 |
| AI artifacts (charts, diagrams) | v2 |
| Knowledge graph visualization | v2 |
| Real-time collaboration | v3+ |
| Mobile responsive | v3+ |
| Extension system | v3+ |
| Multiple AI agents/personas | v2 |
| File versioning/history | v2 |

---

## 13. Implementation Recommendations

### 13.1 Component Library Strategy

Use **shadcn/ui** as the foundation:
- Accessible by default
- Customizable with Tailwind
- Copy-paste ownership (no package dependency)
- VS Code-like aesthetic out of box

**Key shadcn components to use:**
| Component | Usage |
|-----------|-------|
| Button | All actions |
| Input | Forms, search |
| Select | Dropdowns, model picker |
| Dialog | Modals, confirmations |
| Popover | Tooltips, context menus |
| ScrollArea | Scrollable regions |
| Separator | Dividers |
| Toast | Notifications |
| Command | Command palette |

### 13.2 Panel System

Use **dockview** for panel management:
- VS Code-style docking behavior
- Drag tabs to create splits
- Pop-out to separate windows
- Layout serialization for persistence

### 13.3 Editor Integration

Use **Monaco Editor** for markdown:
- VS Code's editor engine
- Excellent performance
- Built-in markdown support
- Can add custom toolbar

Use **react-pdf** for PDF viewing:
- PDF.js under the hood
- React-friendly API
- Page navigation built-in

---

## 14. Appendix

### A. Reference Screenshots

See these tools for design inspiration:
- **Cursor IDE** - AI chat integration, panel layout
- **VS Code** - Activity bar, file browser, tabs
- **Obsidian** - Markdown toolbar, backlinks
- **ChatGPT** - Chat interface (but with transparent memories)

### B. Glossary

| Term | Definition |
|------|------------|
| **Activity Bar** | Far-left icon bar for navigation (VS Code term) |
| **dockview** | React library for VS Code-style panel management |
| **Atomic Memory** | Single fact stored as key-value pair |
| **Context Chips** | Visual indicators of files included in AI context |
| **LiteLLM** | AI proxy supporting multiple models |
| **RAG** | Retrieval-Augmented Generation for semantic search |

### C. Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-03-22 | Initial draft |
| 1.0 | 2026-03-22 | Complete specification with PRD integration, LLM selection UI, atomic memories |

---

**Document Status:** Complete - Ready for Architecture Review

**Linked Documents:**
- Product Brief: `docs/planning-artifacts/product-brief.md`
- PRD: `docs/planning-artifacts/prd.md`
- Spike Findings: `docs/spikes/001-affine-dify-evaluation/FINDINGS.md`
