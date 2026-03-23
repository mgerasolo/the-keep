'use client';

/**
 * Workspace Layout Component
 * VS Code-style panel system using dockview with activity bar
 */

import { DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from 'dockview-react';
import { useCallback, useRef, useState, useEffect } from 'react';
import 'dockview-react/dist/styles/dockview.css';
import { ActivityBar } from './ActivityBar';
import { WelcomePanel } from './panels/WelcomePanel';
import { FileBrowserPanel } from './panels/FileBrowserPanel';
import { EditorPanel } from './panels/EditorPanel';
import { AIChatPanel } from './panels/AIChatPanel';
import { ProjectFormModal } from '@/components/projects';
import { useProjectStore, useWorkspaceStore } from '@/stores';
import { api } from '@/lib/trpc/react';
import { toast } from '@/components/ui/toaster';

// Panel component registry
const PANEL_COMPONENTS: Record<string, React.FC<IDockviewPanelProps>> = {
  welcome: WelcomePanel,
  fileBrowser: FileBrowserPanel,
  editor: EditorPanel,
  aiChat: AIChatPanel,
};

/**
 * Default panel renderer that routes to specific panel components
 */
function PanelComponent(props: IDockviewPanelProps) {
  const componentId = props.params?.componentId as string;
  const Component = PANEL_COMPONENTS[componentId];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-foreground-secondary">
        Unknown panel type: {componentId}
      </div>
    );
  }

  return <Component {...props} />;
}

export function WorkspaceLayout() {
  const apiRef = useRef<DockviewReadyEvent['api'] | null>(null);
  const { activeProjectId, setActiveProject } = useProjectStore();
  const { showProjectModal, setShowProjectModal, showUploadDialog, setShowUploadDialog } = useWorkspaceStore();
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
  } | null>(null);

  // Fetch projects
  const { data: projects = [] } = api.projects.list.useQuery();

  // Map projects to activity bar format
  const activityBarProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    icon: p.icon ?? '📁',
  }));

  const handleProjectSelect = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setActiveProject({
          id: project.id,
          name: project.name,
          icon: project.icon ?? '📁',
          description: project.description,
        });
        toast.success(`Switched to ${project.name}`);
      }
    },
    [projects, setActiveProject]
  );

  const handleNewProject = useCallback(() => {
    setEditingProject(null);
    setShowProjectModal(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    setShowProjectModal(false);
    setEditingProject(null);
  }, []);

  const handleGlobalAction = useCallback((action: 'search' | 'knowledge' | 'settings' | 'ai') => {
    if (!apiRef.current) return;

    switch (action) {
      case 'ai':
        // Check if AI chat is already open
        const existingChat = apiRef.current.panels.find((p) => p.params?.componentId === 'aiChat');
        if (existingChat) {
          existingChat.api.setActive();
        } else {
          // Open AI chat panel
          apiRef.current.addPanel({
            id: 'aiChat',
            component: 'default',
            params: { componentId: 'aiChat' },
            title: 'AI Chat',
            position: { referencePanel: 'fileBrowser', direction: 'right' },
          });
        }
        break;
      case 'search':
        toast.info('Search - coming soon!');
        break;
      case 'knowledge':
        toast.info('Knowledge Graph - coming soon!');
        break;
      case 'settings':
        toast.info('Settings - coming soon!');
        break;
    }
  }, []);

  const { setDockviewApi } = useWorkspaceStore();

  // Handle upload dialog - for now just show a toast
  useEffect(() => {
    if (showUploadDialog) {
      toast.info('Upload dialog - select a project first, then use the file browser context menu');
      setShowUploadDialog(false);
    }
  }, [showUploadDialog, setShowUploadDialog]);

  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;
    setDockviewApi(event.api);

    // Add file browser panel on the left
    event.api.addPanel({
      id: 'fileBrowser',
      component: 'default',
      params: { componentId: 'fileBrowser' },
      title: 'Files',
    });

    // Add welcome panel in the main area
    event.api.addPanel({
      id: 'welcome',
      component: 'default',
      params: { componentId: 'welcome' },
      title: 'Welcome',
      position: { referencePanel: 'fileBrowser', direction: 'right' },
    });

    // Set the file browser to a reasonable width
    const fileBrowserGroup = event.api.getPanel('fileBrowser')?.group;
    if (fileBrowserGroup) {
      fileBrowserGroup.api.setSize({ width: 250 });
    }
  }, [setDockviewApi]);

  return (
    <div className="flex h-screen w-screen bg-background">
      {/* Activity Bar - far left */}
      <ActivityBar
        projects={activityBarProjects}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
        onGlobalAction={handleGlobalAction}
      />

      {/* Main workspace area */}
      <div className="flex-1">
        <DockviewReact
          className="dockview-theme-dark"
          onReady={onReady}
          components={{
            default: PanelComponent,
          }}
        />
      </div>

      {/* Project Modal */}
      <ProjectFormModal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
        editProject={editingProject}
      />
    </div>
  );
}
