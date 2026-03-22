import { describe, it, expect, beforeEach } from 'vitest'
import { useVaultStore, type VaultFile, type OpenTab } from '@/stores/vault'

describe('useVaultStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useVaultStore.setState({
      files: [],
      selectedFile: null,
      openTabs: [],
      activeTabId: null,
      expandedSections: ['files'],
      sidebarWidth: 280,
      sidebarCollapsed: false,
      showKeeperPanel: false,
      keeperPanelPosition: 'right',
      commandPaletteOpen: false,
      searchQuery: '',
      searchResults: [],
    })
  })

  describe('file tree', () => {
    it('should set files', () => {
      const files: VaultFile[] = [
        { id: '1', name: 'test.md', path: 'test.md', type: 'file' },
        { id: '2', name: 'folder', path: 'folder', type: 'folder', children: [] },
      ]

      useVaultStore.getState().setFiles(files)

      expect(useVaultStore.getState().files).toEqual(files)
    })
  })

  describe('file selection', () => {
    it('should select a file', () => {
      const file: VaultFile = { id: '1', name: 'test.md', path: 'test.md', type: 'file' }

      useVaultStore.getState().selectFile(file)

      expect(useVaultStore.getState().selectedFile).toEqual(file)
    })

    it('should clear selection with null', () => {
      const file: VaultFile = { id: '1', name: 'test.md', path: 'test.md', type: 'file' }
      useVaultStore.getState().selectFile(file)
      useVaultStore.getState().selectFile(null)

      expect(useVaultStore.getState().selectedFile).toBeNull()
    })
  })

  describe('tabs', () => {
    const testFile: VaultFile = { id: 'file1', name: 'test.md', path: 'test.md', type: 'file' }
    const testFile2: VaultFile = { id: 'file2', name: 'test2.md', path: 'test2.md', type: 'file' }

    it('should open a new tab', () => {
      useVaultStore.getState().openTab(testFile)

      const { openTabs, activeTabId } = useVaultStore.getState()
      expect(openTabs).toHaveLength(1)
      expect(openTabs[0].id).toBe('file1')
      expect(openTabs[0].name).toBe('test.md')
      expect(openTabs[0].path).toBe('test.md')
      expect(activeTabId).toBe('file1')
    })

    it('should not open duplicate tabs', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile)

      expect(useVaultStore.getState().openTabs).toHaveLength(1)
    })

    it('should not open tabs for folders', () => {
      const folder: VaultFile = { id: 'folder1', name: 'folder', path: 'folder', type: 'folder' }
      useVaultStore.getState().openTab(folder)

      expect(useVaultStore.getState().openTabs).toHaveLength(0)
    })

    it('should switch to existing tab when opening same file', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile2)
      useVaultStore.getState().openTab(testFile)

      expect(useVaultStore.getState().activeTabId).toBe('file1')
      expect(useVaultStore.getState().openTabs).toHaveLength(2)
    })

    it('should close a tab', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile2)
      useVaultStore.getState().closeTab('file1')

      const { openTabs, activeTabId } = useVaultStore.getState()
      expect(openTabs).toHaveLength(1)
      expect(openTabs[0].id).toBe('file2')
      expect(activeTabId).toBe('file2')
    })

    it('should activate next tab when closing active tab', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile2)
      useVaultStore.getState().setActiveTab('file1')
      useVaultStore.getState().closeTab('file1')

      expect(useVaultStore.getState().activeTabId).toBe('file2')
    })

    it('should close all tabs', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile2)
      useVaultStore.getState().closeAllTabs()

      expect(useVaultStore.getState().openTabs).toHaveLength(0)
      expect(useVaultStore.getState().activeTabId).toBeNull()
    })

    it('should close other tabs', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().openTab(testFile2)
      useVaultStore.getState().closeOtherTabs('file1')

      const { openTabs, activeTabId } = useVaultStore.getState()
      expect(openTabs).toHaveLength(1)
      expect(openTabs[0].id).toBe('file1')
      expect(activeTabId).toBe('file1')
    })

    it('should update tab content and mark as dirty', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().updateTabContent('file1', '# Hello World')

      const tab = useVaultStore.getState().openTabs[0]
      expect(tab.content).toBe('# Hello World')
      expect(tab.isDirty).toBe(true)
    })

    it('should set tab content with frontmatter', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().setTabContent('file1', '# Content', { title: 'Test' })

      const tab = useVaultStore.getState().openTabs[0]
      expect(tab.content).toBe('# Content')
      expect(tab.frontmatter).toEqual({ title: 'Test' })
      expect(tab.isDirty).toBe(false)
    })

    it('should mark tab as clean', () => {
      useVaultStore.getState().openTab(testFile)
      useVaultStore.getState().updateTabContent('file1', 'changed')
      useVaultStore.getState().markTabClean('file1')

      expect(useVaultStore.getState().openTabs[0].isDirty).toBe(false)
    })
  })

  describe('sidebar sections', () => {
    it('should have files section expanded by default', () => {
      expect(useVaultStore.getState().expandedSections).toContain('files')
    })

    it('should toggle section expansion', () => {
      useVaultStore.getState().toggleSection('files')
      expect(useVaultStore.getState().expandedSections).not.toContain('files')

      useVaultStore.getState().toggleSection('files')
      expect(useVaultStore.getState().expandedSections).toContain('files')
    })

    it('should expand new sections', () => {
      useVaultStore.getState().toggleSection('search')
      expect(useVaultStore.getState().expandedSections).toContain('search')
      expect(useVaultStore.getState().expandedSections).toContain('files')
    })
  })

  describe('panel state', () => {
    it('should set sidebar width', () => {
      useVaultStore.getState().setSidebarWidth(350)
      expect(useVaultStore.getState().sidebarWidth).toBe(350)
    })

    it('should toggle sidebar collapsed', () => {
      expect(useVaultStore.getState().sidebarCollapsed).toBe(false)
      useVaultStore.getState().toggleSidebar()
      expect(useVaultStore.getState().sidebarCollapsed).toBe(true)
    })

    it('should toggle keeper panel', () => {
      expect(useVaultStore.getState().showKeeperPanel).toBe(false)
      useVaultStore.getState().toggleKeeperPanel()
      expect(useVaultStore.getState().showKeeperPanel).toBe(true)
    })

    it('should set keeper panel position', () => {
      useVaultStore.getState().setKeeperPanelPosition('bottom')
      expect(useVaultStore.getState().keeperPanelPosition).toBe('bottom')
    })
  })

  describe('command palette', () => {
    it('should open and close command palette', () => {
      useVaultStore.getState().setCommandPaletteOpen(true)
      expect(useVaultStore.getState().commandPaletteOpen).toBe(true)

      useVaultStore.getState().setCommandPaletteOpen(false)
      expect(useVaultStore.getState().commandPaletteOpen).toBe(false)
    })
  })

  describe('search', () => {
    it('should set search query', () => {
      useVaultStore.getState().setSearchQuery('test query')
      expect(useVaultStore.getState().searchQuery).toBe('test query')
    })

    it('should set search results', () => {
      const results: VaultFile[] = [
        { id: '1', name: 'result.md', path: 'result.md', type: 'file' },
      ]
      useVaultStore.getState().setSearchResults(results)
      expect(useVaultStore.getState().searchResults).toEqual(results)
    })
  })
})
