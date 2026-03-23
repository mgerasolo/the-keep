import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  fileType?: "markdown" | "pdf" | "image" | "text";
  starred?: boolean;
  tags?: string[];
  lastModified?: string;
  backlinks?: number;
  path?: string;
}

export interface OpenTab {
  id: string;
  fileId: string;
  title: string;
  type: "editor" | "preview" | "chat" | "tasks" | "workflow" | "browser" | "memories" | "trusted-sources";
  dirty?: boolean;
  lastSaved?: string;
}

export type SidebarTab = "files" | "tags" | "starred" | "recent";
export type NewTabOption = "file" | "chat" | "tasks" | "workflow" | "browser" | "memories" | "trusted-sources" | "memory-grid" | "inbox" | "journal";
export type Persona = "default" | "coach" | "teacher" | "analyst" | "creative";
export type ConversationMode = "normal" | "incognito" | "readonly";

interface WorkspaceState {
  // Projects
  projects: Project[];
  activeProjectId: string;
  setActiveProject: (id: string) => void;

  // Files
  files: FileNode[];
  selectedFileId: string | null;
  setSelectedFile: (id: string | null) => void;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  toggleStar: (id: string) => void;

  // Sidebar
  sidebarTab: SidebarTab;
  setSidebarTab: (tab: SidebarTab) => void;

  // Tabs
  openTabs: OpenTab[];
  activeTabId: string | null;
  openFile: (fileId: string) => void;
  closeTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (tabId: string) => void;
  setTabDirty: (tabId: string, dirty: boolean) => void;
  saveTab: (tabId: string) => void;
  addNewTab: (type: NewTabOption) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Chat
  chatMessages: { role: "user" | "assistant"; content: string }[];
  addChatMessage: (role: "user" | "assistant", content: string) => void;

  // AI Persona
  selectedPersona: Persona;
  setSelectedPersona: (persona: Persona) => void;

  // Conversation Mode
  conversationMode: ConversationMode;
  setConversationMode: (mode: ConversationMode) => void;

  // Cross-Project Inbox
  inboxCount: number;
  setInboxCount: (count: number) => void;

  // Editor settings
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;

  // All tags across files
  getAllTags: () => string[];
  getStarredFiles: () => FileNode[];
  getRecentFiles: () => FileNode[];
  getFileById: (id: string) => FileNode | undefined;
}

// Sample data for the mockup
const sampleProjects: Project[] = [
  { id: "health", name: "Health Records", icon: "heart", description: "Personal health tracking" },
  { id: "hoa", name: "HOA Documents", icon: "home", description: "Homeowner association docs" },
  { id: "infra", name: "Infrastructure", icon: "server", description: "Server configs and runbooks" },
];

const sampleFiles: FileNode[] = [
  {
    id: "labs",
    name: "Labs",
    type: "folder",
    children: [
      {
        id: "labs-2026-03",
        name: "2026-03-bloodwork.md",
        type: "file",
        fileType: "markdown",
        starred: true,
        tags: ["health", "labs", "bloodwork"],
        lastModified: "2026-03-20 10:30 AM",
        backlinks: 3,
        path: "/Health Records/Labs/2026-03-bloodwork.md",
        content: `---
tags: health, labs, bloodwork
date: 2026-03-15
source: Quest Diagnostics
---

# Blood Work Results - March 2026

## Basic Metabolic Panel

| Test | Result | Reference Range |
|------|--------|-----------------|
| Glucose | 92 mg/dL | 70-100 |
| A1C | 5.4% | <5.7 |
| Cholesterol | 185 mg/dL | <200 |
| HDL | 55 mg/dL | >40 |
| LDL | 110 mg/dL | <100 |
| Triglycerides | 95 mg/dL | <150 |

## Notes

- A1C improved from 5.6% last quarter
- Continue current diet and exercise regimen
- Follow up in 3 months

## Related Links

- [[daily-stack]] - Current supplements
- [[dr-smith]] - Primary care physician
`,
      },
      {
        id: "labs-2026-01",
        name: "2026-01-bloodwork.md",
        type: "file",
        fileType: "markdown",
        tags: ["health", "labs"],
        lastModified: "2026-01-18 2:15 PM",
        backlinks: 1,
        path: "/Health Records/Labs/2026-01-bloodwork.md",
        content: `---
tags: health, labs
date: 2026-01-15
source: Quest Diagnostics
---

# Blood Work Results - January 2026

## Summary
All values within normal range.
`,
      },
    ],
  },
  {
    id: "supplements",
    name: "Supplements",
    type: "folder",
    children: [
      {
        id: "daily-stack",
        name: "daily-stack.md",
        type: "file",
        fileType: "markdown",
        starred: true,
        tags: ["health", "supplements", "routine"],
        lastModified: "2026-03-18 9:00 AM",
        backlinks: 2,
        path: "/Health Records/Supplements/daily-stack.md",
        content: `---
tags: health, supplements, routine
date: 2026-03-01
source: Personal Research
---

# Daily Supplement Stack

## Morning (with breakfast)
- **Vitamin D3:** 5000 IU
- **Omega-3 Fish Oil:** 2g
- **Magnesium Glycinate:** 400mg

## Evening (before bed)
- **Magnesium Threonate:** 144mg
- **Zinc:** 15mg
- **Vitamin K2:** 100mcg

## Notes
- Fish oil should be taken with fatty meal for absorption
- Magnesium threonate specifically for sleep and cognitive function

## References
- [[labs-2026-03]] - Lab results showing improvement
`,
      },
    ],
  },
  {
    id: "doctors",
    name: "Doctors",
    type: "folder",
    children: [
      {
        id: "dr-smith",
        name: "dr-smith.md",
        type: "file",
        fileType: "markdown",
        tags: ["health", "contacts", "doctors"],
        lastModified: "2026-03-15 4:30 PM",
        backlinks: 1,
        path: "/Health Records/Doctors/dr-smith.md",
        content: `---
tags: health, contacts, doctors
date: 2026-03-15
---

# Dr. Sarah Smith - Primary Care

## Contact
- **Phone:** (555) 123-4567
- **Office:** 123 Medical Center Dr
- **Portal:** myhealth.example.com

## Visit History
- 2026-03-15: Annual checkup, ordered bloodwork
- 2025-09-20: Follow-up on sleep issues
`,
      },
    ],
  },
  {
    id: "attachments",
    name: "Attachments",
    type: "folder",
    children: [
      {
        id: "lab-report-pdf",
        name: "lab-report-march-2026.pdf",
        type: "file",
        fileType: "pdf",
        lastModified: "2026-03-15 11:00 AM",
        path: "/Health Records/Attachments/lab-report-march-2026.pdf",
      },
      {
        id: "xray-image",
        name: "chest-xray-2026.png",
        type: "file",
        fileType: "image",
        lastModified: "2026-02-10 3:45 PM",
        path: "/Health Records/Attachments/chest-xray-2026.png",
      },
    ],
  },
  {
    id: "profile",
    name: "profile.md",
    type: "file",
    fileType: "markdown",
    starred: false,
    tags: ["health", "profile"],
    lastModified: "2026-03-01 8:00 AM",
    backlinks: 0,
    path: "/Health Records/profile.md",
    content: `---
tags: health, profile
date: 2026-01-01
---

# Health Profile

## Basics
- **Age:** 35
- **Weight:** 178 lbs
- **Height:** 5'10"

## Goals
- Maintain A1C below 5.5
- Improve sleep quality
- Exercise 4x/week

## Dietary Preferences
- Mediterranean diet focus
- Low sodium
- No shellfish (allergy)
`,
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Projects
  projects: sampleProjects,
  activeProjectId: "health",
  setActiveProject: (id) => set({ activeProjectId: id }),

  // Files
  files: sampleFiles,
  selectedFileId: null,
  setSelectedFile: (id) => set({ selectedFileId: id }),
  expandedFolders: new Set(["labs", "supplements", "doctors", "attachments"]),
  toggleFolder: (id) =>
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { expandedFolders: newExpanded };
    }),
  toggleStar: (id) =>
    set((state) => {
      const updateStar = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.id === id) {
            return { ...node, starred: !node.starred };
          }
          if (node.children) {
            return { ...node, children: updateStar(node.children) };
          }
          return node;
        });
      return { files: updateStar(state.files) };
    }),

  // Sidebar
  sidebarTab: "files",
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  // Tabs
  openTabs: [
    { id: "tab-1", fileId: "labs-2026-03", title: "2026-03-bloodwork.md", type: "editor", dirty: false },
    { id: "tab-2", fileId: "daily-stack", title: "daily-stack.md", type: "editor", dirty: true },
    { id: "tab-chat", fileId: "chat", title: "AI Chat", type: "chat", dirty: false },
  ],
  activeTabId: "tab-1",
  openFile: (fileId) => {
    const state = get();
    // Check if tab already exists
    const existingTab = state.openTabs.find((t) => t.fileId === fileId);
    if (existingTab) {
      set({ activeTabId: existingTab.id });
      return;
    }
    // Find the file to get its name
    const findFile = (nodes: FileNode[]): FileNode | undefined => {
      for (const node of nodes) {
        if (node.id === fileId) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const file = findFile(state.files);
    if (file) {
      const newTab: OpenTab = {
        id: `tab-${Date.now()}`,
        fileId,
        title: file.name,
        type: "editor",
        dirty: false,
      };
      set({
        openTabs: [...state.openTabs, newTab],
        activeTabId: newTab.id,
        selectedFileId: fileId,
      });
    }
  },
  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== tabId);
      const newActiveTabId =
        state.activeTabId === tabId
          ? newTabs.length > 0
            ? newTabs[newTabs.length - 1].id
            : null
          : state.activeTabId;
      return { openTabs: newTabs, activeTabId: newActiveTabId };
    }),
  closeOtherTabs: (tabId) =>
    set((state) => ({
      openTabs: state.openTabs.filter((t) => t.id === tabId),
      activeTabId: tabId,
    })),
  closeAllTabs: () => set({ openTabs: [], activeTabId: null }),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  setTabDirty: (tabId, dirty) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === tabId ? { ...t, dirty } : t
      ),
    })),
  saveTab: (tabId) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === tabId
          ? { ...t, dirty: false, lastSaved: new Date().toISOString() }
          : t
      ),
    })),
  addNewTab: (type) => {
    const state = get();
    const tabTypeLabels: Record<NewTabOption, string> = {
      file: "Untitled",
      chat: "AI Chat",
      tasks: "Task List",
      workflow: "Workflow",
      browser: "Browser",
      memories: "Memories",
      "trusted-sources": "Trusted Sources",
      "memory-grid": "Memory Grid",
      inbox: "Cross-Project Inbox",
      journal: "Daily Journal",
    };
    const newTab: OpenTab = {
      id: `tab-${Date.now()}`,
      fileId: `new-${type}-${Date.now()}`,
      title: tabTypeLabels[type],
      type: type === "file" ? "editor" : type as OpenTab["type"],
      dirty: type === "file",
    };
    set({
      openTabs: [...state.openTabs, newTab],
      activeTabId: newTab.id,
    });
  },

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Chat
  chatMessages: [
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for The Keep. I have access to your Health Records project. How can I help you today?",
    },
  ],
  addChatMessage: (role, content) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, { role, content }],
    })),

  // AI Persona
  selectedPersona: "default",
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),

  // Conversation Mode
  conversationMode: "normal",
  setConversationMode: (mode) => set({ conversationMode: mode }),

  // Cross-Project Inbox
  inboxCount: 2,
  setInboxCount: (count) => set({ inboxCount: count }),

  // Editor settings
  showLineNumbers: true,
  toggleLineNumbers: () => set((state) => ({ showLineNumbers: !state.showLineNumbers })),

  // Helper methods
  getAllTags: () => {
    const state = get();
    const tags = new Set<string>();
    const collectTags = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        node.tags?.forEach((tag) => tags.add(tag));
        if (node.children) collectTags(node.children);
      });
    };
    collectTags(state.files);
    return Array.from(tags).sort();
  },
  getStarredFiles: () => {
    const state = get();
    const starred: FileNode[] = [];
    const collectStarred = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.starred) starred.push(node);
        if (node.children) collectStarred(node.children);
      });
    };
    collectStarred(state.files);
    return starred;
  },
  getRecentFiles: () => {
    const state = get();
    const allFiles: FileNode[] = [];
    const collectFiles = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "file") allFiles.push(node);
        if (node.children) collectFiles(node.children);
      });
    };
    collectFiles(state.files);
    return allFiles
      .filter((f) => f.lastModified)
      .sort((a, b) => {
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  },
  getFileById: (id) => {
    const state = get();
    const findFile = (nodes: FileNode[]): FileNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findFile(state.files);
  },
}));
