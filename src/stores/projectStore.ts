/**
 * Project Store
 * Global state for active project context
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  icon: string;
  description: string | null;
}

interface ProjectState {
  // Current active project
  activeProjectId: string | null;
  activeProject: Project | null;

  // Actions
  setActiveProject: (project: Project | null) => void;
  setActiveProjectId: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      activeProject: null,

      setActiveProject: (project) =>
        set({
          activeProject: project,
          activeProjectId: project?.id ?? null,
        }),

      setActiveProjectId: (id) =>
        set({
          activeProjectId: id,
          // activeProject will be set when data is fetched
        }),
    }),
    {
      name: 'the-keep-project',
      partialize: (state) => ({ activeProjectId: state.activeProjectId }),
    }
  )
);
