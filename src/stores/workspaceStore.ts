/**
 * Workspace Store
 * Manages dockview API for opening panels/tabs
 */

import { create } from 'zustand';
import type { DockviewApi } from 'dockview-react';

interface WorkspaceState {
  dockviewApi: DockviewApi | null;
  setDockviewApi: (api: DockviewApi) => void;
  openFile: (fileId: string, fileName: string, mimeType?: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  dockviewApi: null,

  setDockviewApi: (api) => set({ dockviewApi: api }),

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
