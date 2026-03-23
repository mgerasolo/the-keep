'use client';

/**
 * Workspace Layout Component
 * VS Code-style panel system using dockview
 */

import { DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from 'dockview-react';
import { useCallback, useRef } from 'react';
import 'dockview-react/dist/styles/dockview.css';
import { WelcomePanel } from './panels/WelcomePanel';
import { FileBrowserPanel } from './panels/FileBrowserPanel';

// Panel component registry
const PANEL_COMPONENTS: Record<string, React.FC<IDockviewPanelProps>> = {
  welcome: WelcomePanel,
  fileBrowser: FileBrowserPanel,
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

  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;

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

    // Set the welcome panel as larger
    const fileBrowserGroup = event.api.getPanel('fileBrowser')?.group;
    if (fileBrowserGroup) {
      fileBrowserGroup.api.setSize({ width: 250 });
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-background">
      <DockviewReact
        className="dockview-theme-dark"
        onReady={onReady}
        components={{
          default: PanelComponent,
        }}
      />
    </div>
  );
}
