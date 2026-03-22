import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VaultFile {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: VaultFile[]
}

export interface OpenTab {
  id: string
  name: string
  path: string
  content?: string
  frontmatter?: Record<string, unknown>
  isDirty?: boolean
}

interface VaultState {
  // File tree
  files: VaultFile[]
  setFiles: (files: VaultFile[]) => void

  // Current selection
  selectedFile: VaultFile | null
  selectFile: (file: VaultFile | null) => void

  // Open tabs
  openTabs: OpenTab[]
  activeTabId: string | null
  openTab: (file: VaultFile) => void
  closeTab: (tabId: string) => void
  closeOtherTabs: (tabId: string) => void
  closeAllTabs: () => void
  setActiveTab: (tabId: string) => void
  updateTabContent: (tabId: string, content: string) => void
  setTabContent: (tabId: string, content: string, frontmatter?: Record<string, unknown>) => void
  markTabClean: (tabId: string) => void

  // Sidebar sections (accordion state)
  expandedSections: string[]
  toggleSection: (section: string) => void

  // Panel state
  sidebarWidth: number
  setSidebarWidth: (width: number) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  showKeeperPanel: boolean
  keeperPanelPosition: 'right' | 'bottom'
  toggleKeeperPanel: () => void
  setKeeperPanelPosition: (position: 'right' | 'bottom') => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: VaultFile[]
  setSearchResults: (results: VaultFile[]) => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Tree refresh trigger
  treeRefreshKey: number
  triggerTreeRefresh: () => void
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      // File tree
      files: [],
      setFiles: (files) => set({ files }),

      // Current selection
      selectedFile: null,
      selectFile: (file) => set({ selectedFile: file }),

      // Open tabs
      openTabs: [],
      activeTabId: null,
      openTab: (file) =>
        set((state) => {
          if (file.type === 'folder') return state

          const exists = state.openTabs.find((t) => t.id === file.id)
          if (exists) {
            return { activeTabId: file.id }
          }
          const newTab: OpenTab = {
            id: file.id,
            name: file.name,
            path: file.path,
          }
          return {
            openTabs: [...state.openTabs, newTab],
            activeTabId: file.id,
          }
        }),
      closeTab: (tabId) =>
        set((state) => {
          const newTabs = state.openTabs.filter((t) => t.id !== tabId)
          let newActiveTabId = state.activeTabId

          if (state.activeTabId === tabId) {
            const idx = state.openTabs.findIndex((t) => t.id === tabId)
            newActiveTabId = newTabs[Math.min(idx, newTabs.length - 1)]?.id ?? null
          }

          return { openTabs: newTabs, activeTabId: newActiveTabId }
        }),
      closeOtherTabs: (tabId) =>
        set((state) => ({
          openTabs: state.openTabs.filter((t) => t.id === tabId),
          activeTabId: tabId,
        })),
      closeAllTabs: () => set({ openTabs: [], activeTabId: null }),
      setActiveTab: (tabId) => set({ activeTabId: tabId }),
      updateTabContent: (tabId, content) =>
        set((state) => ({
          openTabs: state.openTabs.map((t) =>
            t.id === tabId ? { ...t, content, isDirty: true } : t
          ),
        })),
      setTabContent: (tabId, content, frontmatter) =>
        set((state) => ({
          openTabs: state.openTabs.map((t) =>
            t.id === tabId ? { ...t, content, frontmatter, isDirty: false } : t
          ),
        })),
      markTabClean: (tabId) =>
        set((state) => ({
          openTabs: state.openTabs.map((t) =>
            t.id === tabId ? { ...t, isDirty: false } : t
          ),
        })),

      // Sidebar sections
      expandedSections: ['files'],
      toggleSection: (section) =>
        set((state) => {
          const isExpanded = state.expandedSections.includes(section)
          return {
            expandedSections: isExpanded
              ? state.expandedSections.filter((s) => s !== section)
              : [...state.expandedSections, section],
          }
        }),

      // Panel state
      sidebarWidth: 280,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      showKeeperPanel: true,
      keeperPanelPosition: 'right',
      toggleKeeperPanel: () => set((state) => ({ showKeeperPanel: !state.showKeeperPanel })),
      setKeeperPanelPosition: (position) => set({ keeperPanelPosition: position }),

      // Command palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),

      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark'
          if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
          return { theme: newTheme }
        }),

      // Tree refresh trigger
      treeRefreshKey: 0,
      triggerTreeRefresh: () => set((state) => ({ treeRefreshKey: state.treeRefreshKey + 1 })),
    }),
    {
      name: 'the-keep-vault',
      partialize: (state) => ({
        expandedSections: state.expandedSections,
        sidebarWidth: state.sidebarWidth,
        sidebarCollapsed: state.sidebarCollapsed,
        showKeeperPanel: state.showKeeperPanel,
        keeperPanelPosition: state.keeperPanelPosition,
        theme: state.theme,
        // Don't persist tabs - load fresh each session
      }),
    }
  )
)
