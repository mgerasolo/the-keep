# Story 1-1: Dockview Workspace Shell

## Story

**As a** user,
**I want** a VS Code-style workspace with draggable panels and tabs,
**So that** I can arrange my workspace how I prefer.

## Acceptance Criteria

**Given** I am in The Keep
**When** I view the main workspace
**Then** I see a dockview-based panel system with:
- Draggable tabs between panel groups
- Ability to split panels horizontally and vertically
- Tab close buttons with unsaved indicator
- Panel resize handles

**And** clicking a file opens it in a new tab
**And** I can drag a tab to create a split view
**And** the "+" button in tab bar allows opening new content

## Technical Notes

- Use dockview-react library
- Create WorkspaceLayout component as main shell
- Integrate with existing providers (User, tRPC)
- Store layout state (will persist in Story 1-9)

## Tasks

- [ ] Install dockview-react package
- [ ] Create WorkspaceLayout component
- [ ] Add dockview theme/styling
- [ ] Create panel registry for content types
- [ ] Create WelcomePanel as default content
- [ ] Update main page to use workspace
- [ ] Test panel dragging and splitting
