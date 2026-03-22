# Overnight Sprint Notes - 2026-03-18

## Status: COMPLETED + BONUS

All four waves completed and deployed. App is live at http://10.0.0.33:5010

### Bonus Features Added:
- Theme toggle (light/dark) with persistence
- Global keyboard shortcuts (Cmd+J for Keeper, Cmd+. for theme)
- Updated welcome screen with accurate shortcuts

## Deployment
- **URL:** http://10.0.0.33:5010
- **Domain:** the-keep.nextlevelguild.com (needs Traefik config)
- **Container:** Running on Banner with volume mount for vault

## Completed Waves

### Wave 1: Foundation ✅
- [x] Next.js 16 + React 19 scaffold
- [x] Tailwind v4 + PostCSS config
- [x] Zustand store with persistence
- [x] Server actions for file CRUD

### Wave 2: Shell Components ✅
- [x] Resizable panel layout (react-resizable-panels v4)
- [x] File tree with react-arborist
- [x] Tab system with state
- [x] Markdown viewer (react-markdown + rehype-pretty-code)
- [x] Sidebar with accordion sections (Files, Inbox, Tasks)
- [x] Project selector (UI shell)
- [x] Header with user menu, notifications, search

### Wave 3: File Operations + Search ✅
- [x] File CRUD UI (create, rename, delete) with context menu
- [x] Dialog components for create/rename/delete confirmation
- [x] Command palette (cmdk) with full-text search
- [x] Search across filenames AND content
- [x] Mobile responsive layout with hamburger menu

### Wave 4: Keeper AI + Deploy ✅
- [x] Keeper chat panel with AI integration
- [x] Connected to LiteLLM (http://10.0.0.27:2764)
- [x] Keeper persona: direct, formal, quirky librarian
- [x] File context awareness (current open file)
- [x] Deployed to Banner:5010
- [x] Created sample vault files for testing

## New Components Created

- `src/components/ui/ContextMenu.tsx` - Right-click menu
- `src/components/ui/Dialog.tsx` - Modal dialogs
- `src/actions/keeper.ts` - Keeper AI server action

## Files Modified

- AppLayout.tsx - Added mobile responsive layout
- FileTree.tsx - Added CRUD toolbar and context menu
- CommandPalette.tsx - Added server-side search
- KeeperPanel.tsx - Integrated LiteLLM AI
- vault.ts - Added searchVault() action
- globals.css - Mobile responsive utilities

## Questions for Morning (Still Valid)

1. **Project storage location** — Should projects live in `~/.the-keep/` or somewhere else? Currently using volume mount `/home/mgerasolo/vault` on Banner.

2. **Inbox data source** — Where do inbox items come from? n8n webhooks? What format?

3. **Task list source** — Is there an existing task system to integrate, or build fresh?

4. **Auth placeholder** — Simple env-based password OK for PoC, or want Authentik now?

5. **LiteLLM Model** — Currently using `claude-sonnet-4-20250514`. Want different model for Keeper?

## Features for Phase 2 (Captured from Discussion)

### TipTap Extensions
- Tables (robust - resize, merge cells)
- Link, image, video, code blocks
- Headings, lists (bullet/num/task), hr
- Callouts/admonitions
- Mermaid diagrams
- Wiki-links [[note-name]]
- Highlights, collapsible, timestamps
- Frontmatter editor
- Linting

### Enhanced Keeper
- Diff viewer with approve/reject
- Toggleable context (current file / tabs / vault)
- Streaming responses

### Inbox/Workflows
- Draggable panel view (expanded)
- Multiple view types: inbox list, kanban, task list
- n8n integration

### Other
- Auto-save: toggleable (off/2min/5min)
- Semantic search with embeddings
- Session persistence across browser restarts
- Soul/guardrail files for project

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind v4 |
| State | Zustand 5 with persist |
| File Tree | react-arborist |
| Panels | react-resizable-panels v4 |
| Command Palette | cmdk |
| Markdown | react-markdown + rehype-pretty-code + shiki |
| AI | LiteLLM proxy → Claude |

## How to Access

```bash
# Web UI
open http://10.0.0.33:5010

# Or domain (once Traefik configured)
open https://the-keep.nextlevelguild.com
```

## Container Management

```bash
# SSH to Banner
ssh banner

# View logs
docker logs the-keep

# Restart
docker restart the-keep

# Rebuild and redeploy (from Friday)
cd ~/Dev/the-keep
docker build -t the-keep:latest .
docker save the-keep:latest | ssh banner 'docker load'
ssh banner 'docker stop the-keep; docker container rename the-keep the-keep-old; docker run -d --name the-keep -p 5010:3000 -v /home/mgerasolo/vault:/app/vault -e LITELLM_URL=http://10.0.0.27:2764 --restart unless-stopped the-keep:latest'
```
