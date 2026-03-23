# Story 0-9: Empty States & Loading Skeletons

## Story

**As a** user,
**I want** helpful feedback when there's no data or content is loading,
**So that** the app never feels broken or unresponsive.

## Acceptance Criteria

**Given** a section has no data
**When** I view it
**Then** I see an empty state with:
- Friendly illustration or icon
- Clear message ("No projects yet")
- Call to action button ("Create your first project")

**Given** content is loading
**When** I view the area
**Then** I see skeleton placeholders matching the content shape

**And** reusable components exist: `<EmptyState>`, `<Skeleton>`, `<LoadingSpinner>`
**And** empty states are contextual (different for files vs projects vs memories)

## Tasks

- [ ] Create Skeleton component with variants
- [ ] Create LoadingSpinner component
- [ ] Create EmptyState component with icon/title/description/action
- [ ] Create contextual empty states (projects, files, memories, chat)
- [ ] Add tests for components
