# UI Component Research - The Keep

**Research Date:** 2026-03-22
**Purpose:** Evaluate React libraries and components for building The Keep's personal knowledge management IDE
**Status:** Complete

---

## Executive Summary

This research identifies battle-tested, well-supported React libraries for each major UI component of The Keep. The recommended stack prioritizes:
- **Active maintenance** - Libraries with recent updates and community support
- **TypeScript support** - Full type definitions for developer experience
- **Accessibility** - WCAG/WAI-ARIA compliance
- **Performance** - Virtual scrolling, lazy loading where needed
- **Integration** - Compatible with Next.js 14+, Tailwind CSS, shadcn/ui

---

## 1. Panel System (dockview)

### Recommendation: **dockview** (v1.16+)

| Aspect | Details |
|--------|---------|
| Package | `dockview`, `dockview-react` |
| Stars | High (actively maintained) |
| TypeScript | Full support |
| License | MIT |

**Key Features:**
- VS Code-style docking, tabs, groups, grids, and split views
- Serialization for layout persistence
- Zero dependencies
- React, Vue, and Vanilla TypeScript support
- Floating windows and popout groups
- Drag-and-drop between panels

**Integration Pattern:**

```typescript
import { DockviewReact, DockviewApi, IDockviewPanelProps } from 'dockview';
import 'dockview/dist/styles/dockview.css';

// Custom panel component
const EditorPanel: React.FC<IDockviewPanelProps> = (props) => {
  return <div>{props.params.content}</div>;
};

// Main app with dockview
const App = () => {
  const onReady = (event: { api: DockviewApi }) => {
    event.api.addPanel({
      id: 'editor1',
      component: 'editor',
      title: 'main.tsx',
      params: { content: '// code here' }
    });
  };

  return (
    <DockviewReact
      className="dockview-theme-dark"
      components={{ editor: EditorPanel }}
      onReady={onReady}
    />
  );
};
```

**Layout Persistence:**

```typescript
// Save layout
const layout = api.toJSON();
localStorage.setItem('dockview-layout', JSON.stringify(layout));

// Restore layout
const saved = localStorage.getItem('dockview-layout');
if (saved) api.fromJSON(JSON.parse(saved));
```

**Documentation:** https://dockview.dev/

---

## 2. Chat Interface

### Primary Recommendation: **Build Custom with shadcn/ui**

After evaluating available options, building a custom chat interface using shadcn/ui components is recommended for maximum control and consistency with The Keep's design system.

### Alternative Libraries Evaluated:

| Library | Pros | Cons |
|---------|------|------|
| [@lobehub/ui](https://github.com/lobehub/lobe-ui) | AIGC-focused, Ant Design compatible, beautiful defaults | ESM only, requires Ant Design ecosystem |
| [@chatscope/chat-ui-kit-react](https://chatscope.io/) | Full-featured, TypeScript, state hooks | Styling may conflict with Tailwind |
| [stream-chat-react](https://getstream.io/chat/sdk/react/) | Production-ready, real-time | Requires Stream service subscription |

**Lobe UI Details:**
- Designed for AI-Generated Content applications
- Components: Chat bubbles, markdown rendering, code blocks
- Installation: `bun add @lobehub/ui`
- Requires: `antd-style`, Next.js transpilePackages config
- Best for: Projects already using Ant Design

**Custom Implementation Strategy:**
1. Use shadcn/ui `ScrollArea`, `Avatar`, `Button` for base components
2. Build `ChatMessage`, `ChatInput`, `ChatPanel` components
3. Add streaming support via SSE
4. Integrate with markdown rendering

**Recommended shadcn/ui Components for Chat:**
- `scroll-area` - Scrollable message container
- `avatar` - User/AI avatars
- `button` - Send button, model selector
- `textarea` - Message input (auto-resize)
- `dropdown-menu` - Model selection, options
- `skeleton` - Loading states

---

## 3. File Browser/Tree

### Primary Recommendation: **react-arborist** (v3.4+)

| Aspect | Details |
|--------|---------|
| Package | `react-arborist` |
| Stars | High (Benchmark Score: 90.9) |
| TypeScript | Full support |
| License | MIT |

**Key Features:**
- VS Code-style file explorer
- Drag-and-drop with multi-select
- Virtual rendering (handles 1000s of files)
- Inline renaming (F2 key)
- Keyboard navigation
- Custom node rendering

**Integration Pattern:**

```tsx
import { Tree, NodeRendererProps } from 'react-arborist';

function FileNode({ node, style, dragHandle }: NodeRendererProps<FileData>) {
  return (
    <div ref={dragHandle} style={style} onClick={() => node.toggle()}>
      {node.isLeaf ? '📄' : (node.isOpen ? '📂' : '📁')}
      <span>{node.data.name}</span>
    </div>
  );
}

function FileBrowser({ data }: { data: FileData[] }) {
  return (
    <Tree
      initialData={data}
      width={300}
      height={600}
      rowHeight={28}
      indent={20}
      openByDefault={false}
    >
      {FileNode}
    </Tree>
  );
}
```

**Documentation:** https://github.com/brimdata/react-arborist

### Alternative: **react-complex-tree**

| Aspect | Details |
|--------|---------|
| Package | `react-complex-tree` |
| Successor | `headless-tree` (beta) |

- W3C accessibility compliant
- Multi-tree state sharing
- Zero dependencies
- More complex API but more flexible

**Use react-arborist** unless you need multi-tree synchronization or the successor headless-tree for more customization.

---

## 4. Markdown Editor

### Primary Recommendation: **Monaco Editor** (via @monaco-editor/react)

For The Keep's IDE-style experience, Monaco is the best fit.

| Aspect | Details |
|--------|---------|
| Package | `@monaco-editor/react` |
| Stars | Very High (Microsoft maintained core) |
| TypeScript | Full support |

**Key Features:**
- VS Code's editor engine
- Syntax highlighting for 50+ languages
- IntelliSense, code completion
- Custom themes
- Markdown language support
- Search and replace

**Integration Pattern:**

```tsx
import Editor from '@monaco-editor/react';

function MarkdownEditor({ value, onChange }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        fontSize: 14,
      }}
    />
  );
}
```

**Documentation:** https://github.com/suren-atoyan/monaco-react

### Alternative: **TipTap** (for rich WYSIWYG)

| Aspect | Details |
|--------|---------|
| Package | `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` |
| Built on | ProseMirror |

**Use TipTap if:**
- You need WYSIWYG editing (not plain markdown)
- Rich formatting toolbar is required
- Real-time collaboration is planned

**Markdown Extension:**
```javascript
import { Editor } from '@tiptap/react';
import { Markdown } from '@tiptap/extension-markdown';

const editor = new Editor({
  extensions: [StarterKit, Markdown],
  content: '# Hello World',
  contentType: 'markdown',
});
```

**Note:** TipTap's markdown extension is in beta. Uses MarkedJS for parsing.

### Alternative: **Milkdown**

- Plugin-based, built on ProseMirror
- Better for scientific docs (math, diagrams)
- More setup required, bare-bones React integration
- Best for highly customized editing experiences

**Recommendation Order:**
1. **Monaco** - IDE-style, markdown as code
2. **TipTap** - WYSIWYG with markdown export
3. **Milkdown** - Complex customization needs

---

## 5. PDF Viewer

### Recommendation: **react-pdf** (v7.7+)

| Aspect | Details |
|--------|---------|
| Package | `react-pdf` |
| Based on | PDF.js |
| Stars | High (Benchmark Score: 77.05) |

**Key Features:**
- Display PDFs like images
- Page navigation
- Zoom and rotation
- Text layer (for selection/search)
- Annotation layer
- Thumbnail sidebar
- Table of contents/outline

**Integration Pattern:**

```tsx
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker (required)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  return (
    <div>
      <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
      <div>
        Page {pageNumber} of {numPages}
        <button onClick={() => setPageNumber(p => Math.max(1, p - 1))}>Prev</button>
        <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}
```

**Alternative: react-pdf-viewer**

More feature-rich out of the box (search, print, annotations) but larger bundle.

**Documentation:** https://github.com/wojtekmaj/react-pdf

---

## 6. Task/Todo Components

### Drag-and-Drop: **dnd-kit** (v6+)

| Aspect | Details |
|--------|---------|
| Package | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Status | Actively maintained |
| Alternative | `@hello-pangea/dnd` (fork of react-beautiful-dnd) |

**Why dnd-kit:**
- react-beautiful-dnd is **no longer maintained**
- dnd-kit is lightweight, performant, and extensible
- Better for grid layouts and custom interactions
- Works well with shadcn/ui

**Kanban Example Resources:**
- [react-dnd-kit-tailwind-shadcn-ui](https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui) - Complete kanban implementation
- LogRocket tutorial: [Build a Kanban board with dnd-kit](https://blog.logrocket.com/build-kanban-board-dnd-kit-react/)

**Alternative: @hello-pangea/dnd**

Use if you prefer react-beautiful-dnd's simpler API. Community fork is actively maintained.

### Filter/Query UI

Use shadcn/ui components:
- `command` - Command palette for filtering
- `popover` + `calendar` - Date filters
- `select` - Status/priority dropdowns
- `badge` - Tags and labels

---

## 7. UI Component Library

### Primary: **shadcn/ui** (latest)

| Aspect | Details |
|--------|---------|
| Primitives | Radix UI (also supports Base UI in 2026) |
| Styling | Tailwind CSS |
| Install | Copy-paste or CLI |

**Available Components for The Keep:**

| Component | Use Case |
|-----------|----------|
| `command` | Command palette (Cmd+K) |
| `dialog` | Modals, confirmations |
| `dropdown-menu` | Context menus, options |
| `tabs` | Panel tab headers |
| `scroll-area` | Scrollable containers |
| `tooltip` | Hints and descriptions |
| `resizable` | Panel resizing |
| `button` | Actions |
| `input` | Text inputs |
| `textarea` | Message input |
| `avatar` | User/AI avatars |
| `skeleton` | Loading states |
| `toast` | Notifications |
| `alert` | Warnings, errors |
| `form` | Form validation |
| `select` | Dropdowns |
| `popover` | Floating content |
| `context-menu` | Right-click menus |
| `separator` | Visual dividers |

**Command Palette Example:**

```tsx
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem>New File</CommandItem>
      <CommandItem>New Project</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Documentation:** https://ui.shadcn.com/

### Radix UI Primitives

shadcn/ui is built on Radix primitives. Key accessibility features:
- WAI-ARIA compliant
- Keyboard navigation
- Focus management
- Screen reader support

**Note:** In 2026, shadcn/ui supports both Radix and Base UI as primitive layers.

---

## 8. State Management

### Client State: **Zustand** (v5+)

| Aspect | Details |
|--------|---------|
| Package | `zustand` |
| Stars | Very High (Benchmark Score: 80.77) |
| Size | ~1KB |

**Key Features:**
- Simple hook-based API
- Persistence middleware (localStorage, sessionStorage)
- Slices pattern for modularity
- DevTools support
- No boilerplate

**Store with Persistence:**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  layout: SerializedDockview | null;
  setLayout: (layout: SerializedDockview) => void;
}

const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: null,
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: 'the-keep-layout',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**Slices Pattern:**

```typescript
// Combine multiple slices
const useBoundStore = create()(
  devtools(
    persist(
      (...a) => ({
        ...createLayoutSlice(...a),
        ...createProjectSlice(...a),
        ...createFileSlice(...a),
      }),
      { name: 'the-keep-store' }
    )
  )
);
```

**Documentation:** https://docs.pmnd.rs/zustand/getting-started/introduction

### Server State: **TanStack Query** (v5+)

| Aspect | Details |
|--------|---------|
| Package | `@tanstack/react-query` |
| Stars | Very High |

**Key Features:**
- Automatic caching and refetching
- Optimistic updates
- Background updates
- Pagination, infinite scroll
- Offline support

**Optimistic Update Pattern:**

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo, context) => {
    await context.client.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = context.client.getQueryData(['todos']);
    context.client.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (err, newTodo, result, context) => {
    context.client.setQueryData(['todos'], result.previousTodos);
  },
  onSettled: (data, error, variables, result, context) => {
    context.client.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### Local Persistence: **Dexie.js**

| Aspect | Details |
|--------|---------|
| Package | `dexie` |
| Purpose | IndexedDB wrapper |

**Use Cases:**
- Offline file content caching
- Conversation history
- Large data that exceeds localStorage limits

**React Integration:**

```typescript
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const db = new Dexie('TheKeep');
db.version(1).stores({
  files: '++id, projectId, path, content',
  conversations: '++id, projectId, title, createdAt',
});

// React hook for live queries
const files = useLiveQuery(() => db.files.where('projectId').equals(projectId).toArray());
```

**Documentation:** https://dexie.org/

---

## 9. Compatibility Matrix

| Library | Next.js 14+ | TypeScript | Tailwind | shadcn/ui |
|---------|-------------|------------|----------|-----------|
| dockview | Yes | Yes | Yes | Compatible |
| react-arborist | Yes | Yes | Yes | Compatible |
| @monaco-editor/react | Yes | Yes | Yes | Compatible |
| react-pdf | Yes | Yes | Yes | Compatible |
| @dnd-kit | Yes | Yes | Yes | Compatible |
| zustand | Yes | Yes | N/A | N/A |
| @tanstack/react-query | Yes | Yes | N/A | N/A |
| dexie | Yes | Yes | N/A | N/A |

---

## 10. Potential Conflicts & Considerations

### CSS Conflicts

| Issue | Solution |
|-------|----------|
| dockview CSS vs Tailwind | Import dockview CSS first, use Tailwind for customization |
| Monaco themes | Use `vs-dark` or define custom theme matching Tailwind colors |
| react-pdf layers | Import annotation/text layer CSS after Tailwind |

### Bundle Size

| Library | Size | Mitigation |
|---------|------|------------|
| Monaco Editor | ~2MB | Lazy load, code split panel |
| PDF.js | ~500KB | Lazy load PDF viewer panel |
| dockview | ~100KB | Acceptable |
| react-arborist | ~30KB | Acceptable |

### SSR Considerations

| Library | SSR Safe | Notes |
|---------|----------|-------|
| dockview | No | Use `dynamic(() => import(), { ssr: false })` |
| Monaco | No | Dynamic import required |
| react-pdf | No | Dynamic import for Document component |
| Zustand | Yes | persist middleware handles hydration |
| TanStack Query | Yes | Built-in SSR support |

---

## 11. Recommended Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    THE KEEP UI STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PANEL SYSTEM          dockview + dockview-react             │
│                                                              │
│  FILE BROWSER          react-arborist                        │
│                                                              │
│  MARKDOWN EDITOR       @monaco-editor/react                  │
│                                                              │
│  PDF VIEWER            react-pdf                             │
│                                                              │
│  CHAT UI               Custom (shadcn/ui components)         │
│                                                              │
│  DRAG & DROP           @dnd-kit/core + @dnd-kit/sortable     │
│                                                              │
│  UI COMPONENTS         shadcn/ui (Radix primitives)          │
│                                                              │
│  CLIENT STATE          Zustand (with persist middleware)     │
│                                                              │
│  SERVER STATE          TanStack Query v5                     │
│                                                              │
│  LOCAL PERSISTENCE     Dexie.js (IndexedDB)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Installation Commands

```bash
# Panel system
npm install dockview dockview-react

# File browser
npm install react-arborist

# Editor
npm install @monaco-editor/react

# PDF viewer
npm install react-pdf pdfjs-dist

# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# State management
npm install zustand @tanstack/react-query

# Local persistence
npm install dexie dexie-react-hooks

# UI components (via shadcn CLI)
npx shadcn@latest add command dialog dropdown-menu tabs scroll-area \
  tooltip button input textarea avatar skeleton toast alert form \
  select popover context-menu separator resizable
```

---

## 12. Sources & Documentation

### Panel System
- [dockview GitHub](https://github.com/mathuo/dockview)
- [dockview Documentation](https://dockview.dev/)

### File Browser
- [react-arborist GitHub](https://github.com/brimdata/react-arborist)
- [react-complex-tree](https://rct.lukasbach.com/)

### Editor
- [Monaco React GitHub](https://github.com/suren-atoyan/monaco-react)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [TipTap Markdown](https://tiptap.dev/docs/editor/markdown)

### PDF Viewer
- [react-pdf GitHub](https://github.com/wojtekmaj/react-pdf)

### Chat UI
- [Lobe UI](https://github.com/lobehub/lobe-ui)
- [chatscope](https://chatscope.io/)

### Drag & Drop
- [dnd-kit](https://dndkit.com/)
- [Kanban with dnd-kit + shadcn](https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui)
- [dnd-kit vs react-beautiful-dnd comparison](https://blog.logrocket.com/build-kanban-board-dnd-kit-react/)

### UI Components
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix Primitives](https://www.radix-ui.com/primitives)

### State Management
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query](https://tanstack.com/query/latest)
- [Dexie.js](https://dexie.org/)

---

**Document Status:** Complete
**Next Steps:** Use this research to inform UX design mockups and component architecture decisions.
