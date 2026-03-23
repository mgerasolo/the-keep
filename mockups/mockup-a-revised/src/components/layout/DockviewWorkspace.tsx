"use client";

import { useCallback, useRef } from "react";
import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewApi,
  IDockviewHeaderActionsProps,
} from "dockview-react";
import "dockview/dist/styles/dockview.css";
import { FileExplorer } from "@/components/panels/FileExplorer";
import { MarkdownEditor } from "@/components/panels/MarkdownEditor";
import { AIChatPanel } from "@/components/panels/AIChatPanel";
import { WelcomePanel } from "@/components/panels/WelcomePanel";
import { MemoryGridPanel } from "@/components/panels/MemoryGridPanel";
import { CrossProjectInboxPanel } from "@/components/panels/CrossProjectInboxPanel";
import { DailyJournalPanel } from "@/components/panels/DailyJournalPanel";
import { Plus, SplitSquareHorizontal, SplitSquareVertical, ChevronDown } from "lucide-react";

// Panel components
const panelComponents: Record<string, React.FC<IDockviewPanelProps>> = {
  fileExplorer: FileExplorer,
  markdownEditor: MarkdownEditor,
  aiChat: AIChatPanel,
  welcome: WelcomePanel,
  memoryGrid: MemoryGridPanel,
  crossProjectInbox: CrossProjectInboxPanel,
  dailyJournal: DailyJournalPanel,
};

function PanelWrapper(props: IDockviewPanelProps) {
  const Component = panelComponents[props.params.component as string];
  if (!Component) {
    return (
      <div className="p-4 text-muted-foreground">
        Unknown panel: {props.params.component}
      </div>
    );
  }
  return <Component {...props} />;
}

// Right header actions component - renders inline with tabs
function RightHeaderActions(props: IDockviewHeaderActionsProps) {
  const handleSplitHorizontal = () => {
    const activePanel = props.containerApi.activePanel;
    if (activePanel) {
      props.containerApi.addPanel({
        id: `split-h-${Date.now()}`,
        component: "default",
        params: { component: "welcome" },
        title: "New Panel",
        position: { referencePanel: activePanel.id, direction: "below" },
      });
    }
  };

  const handleSplitVertical = () => {
    const activePanel = props.containerApi.activePanel;
    if (activePanel) {
      props.containerApi.addPanel({
        id: `split-v-${Date.now()}`,
        component: "default",
        params: { component: "welcome" },
        title: "New Panel",
        position: { referencePanel: activePanel.id, direction: "right" },
      });
    }
  };

  return (
    <div className="flex items-center gap-0.5 pr-1">
      {/* Add Tab */}
      <button
        onClick={() => {
          const activePanel = props.containerApi.activePanel;
          props.containerApi.addPanel({
            id: `new-${Date.now()}`,
            component: "default",
            params: { component: "welcome" },
            title: "New Tab",
            position: { referencePanel: activePanel?.id, direction: "within" },
          });
        }}
        className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        title="New Tab"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Split Horizontal */}
      <button
        onClick={handleSplitHorizontal}
        className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        title="Split Down"
      >
        <SplitSquareHorizontal className="w-3.5 h-3.5" />
      </button>

      {/* Split Vertical */}
      <button
        onClick={handleSplitVertical}
        className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        title="Split Right"
      >
        <SplitSquareVertical className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function DockviewWorkspace() {
  const apiRef = useRef<DockviewApi | null>(null);

  const onReady = useCallback((event: DockviewReadyEvent) => {
    const api = event.api;
    apiRef.current = api;

    // Create initial layout

    // File Explorer (left sidebar)
    api.addPanel({
      id: "fileExplorer",
      component: "default",
      params: { component: "fileExplorer" },
      title: "Explorer",
      position: { direction: "left" },
    });

    // Welcome panel (center)
    api.addPanel({
      id: "welcome",
      component: "default",
      params: { component: "welcome" },
      title: "Welcome",
      position: { referencePanel: "fileExplorer", direction: "right" },
    });

    // Markdown Editor (center, as tab)
    api.addPanel({
      id: "editor-1",
      component: "default",
      params: {
        component: "markdownEditor",
        fileId: "labs-2026-03",
      },
      title: "2026-03-bloodwork.md",
      position: { referencePanel: "welcome", direction: "within" },
    });

    // Second editor tab for demo
    api.addPanel({
      id: "editor-2",
      component: "default",
      params: {
        component: "markdownEditor",
        fileId: "daily-stack",
      },
      title: "daily-stack.md",
      position: { referencePanel: "editor-1", direction: "within" },
    });

    // AI Chat (right sidebar)
    api.addPanel({
      id: "aiChat",
      component: "default",
      params: { component: "aiChat" },
      title: "AI Chat",
      position: { referencePanel: "editor-1", direction: "right" },
    });

    // Memory Grid (as tab in right panel)
    api.addPanel({
      id: "memoryGrid",
      component: "default",
      params: { component: "memoryGrid" },
      title: "Memory Grid",
      position: { referencePanel: "aiChat", direction: "within" },
    });

    // Cross-Project Inbox (as tab in right panel)
    api.addPanel({
      id: "crossProjectInbox",
      component: "default",
      params: { component: "crossProjectInbox" },
      title: "Inbox",
      position: { referencePanel: "memoryGrid", direction: "within" },
    });

    // Daily Journal (as tab in right panel)
    api.addPanel({
      id: "dailyJournal",
      component: "default",
      params: { component: "dailyJournal" },
      title: "Journal",
      position: { referencePanel: "crossProjectInbox", direction: "within" },
    });

    // Set initial sizes
    const fileExplorerGroup = api.getPanel("fileExplorer")?.group;
    const aiChatGroup = api.getPanel("aiChat")?.group;
    if (fileExplorerGroup) {
      fileExplorerGroup.api.setSize({ width: 280 });
    }
    if (aiChatGroup) {
      aiChatGroup.api.setSize({ width: 380 });
    }

    // Set AI Chat as active tab in right panel
    const aiChatPanel = api.getPanel("aiChat");
    if (aiChatPanel) {
      aiChatPanel.api.setActive();
    }
  }, []);

  return (
    <div className="h-full">
      <DockviewReact
        className="dockview-theme-dark"
        onReady={onReady}
        components={{ default: PanelWrapper }}
        rightHeaderActionsComponent={RightHeaderActions}
        watermarkComponent={() => (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Drag files here or click to open</p>
          </div>
        )}
      />
    </div>
  );
}
