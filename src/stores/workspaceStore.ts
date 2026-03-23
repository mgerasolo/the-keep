/**
 * Workspace Store
 * Manages dockview API for opening panels/tabs and global UI state
 */

import { create } from 'zustand';
import type { DockviewApi } from 'dockview-react';

interface WorkspaceState {
  // Dockview API
  dockviewApi: DockviewApi | null;
  setDockviewApi: (api: DockviewApi) => void;
  openFile: (fileId: string, fileName: string, mimeType?: string) => void;

  // Modal/dialog state
  showProjectModal: boolean;
  setShowProjectModal: (show: boolean) => void;
  showUploadDialog: boolean;
  setShowUploadDialog: (show: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  dockviewApi: null,
  showProjectModal: false,
  showUploadDialog: false,

  setDockviewApi: (api) => set({ dockviewApi: api }),

  setShowProjectModal: (show) => set({ showProjectModal: show }),

  setShowUploadDialog: (show) => set({ showUploadDialog: show }),

  openFile: (fileId, fileName, mimeType) => {
    const { dockviewApi } = get();
    if (!dockviewApi) return;

    // Check if file is already open
    const existingPanel = dockviewApi.panels.find((p) => p.params?.fileId === fileId);
    if (existingPanel) {
      existingPanel.api.setActive();
      return;
    }

    // Open file in new tab
    dockviewApi.addPanel({
      id: `file-${fileId}`,
      component: 'default',
      params: {
        componentId: 'editor',
        fileId,
        fileName,
        mimeType,
      },
      title: fileName,
    });
  },
}));
