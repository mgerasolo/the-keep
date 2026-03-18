---
phase: 1
slug: foundation-shell
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + Playwright 1.58.2 |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx playwright test` |
| **Estimated runtime** | ~15 seconds (unit), ~45 seconds (full + E2E) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx playwright test --project=chromium`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | VIEW-01 | unit | `npx vitest run src/__tests__/viewer/markdown-viewer.test.tsx -t "line numbers"` | ❌ W0 | pending |
| 01-01-02 | 01 | 1 | VIEW-02 | unit | `npx vitest run src/__tests__/viewer/code-block.test.tsx` | ❌ W0 | pending |
| 01-01-03 | 01 | 1 | VIEW-03 | unit | `npx vitest run src/__tests__/viewer/frontmatter.test.tsx` | ❌ W0 | pending |
| 01-02-01 | 02 | 1 | SHELL-01 | integration | `npx vitest run src/__tests__/file-tree/file-tree.test.tsx -t "displays files"` | ❌ W0 | pending |
| 01-02-02 | 02 | 1 | SHELL-02 | integration | `npx vitest run src/__tests__/file-tree/file-tree.test.tsx -t "expand collapse"` | ❌ W0 | pending |
| 01-02-03 | 02 | 1 | SHELL-03 | integration | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "open tab"` | ❌ W0 | pending |
| 01-02-04 | 02 | 1 | SHELL-04 | unit | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "multiple tabs"` | ❌ W0 | pending |
| 01-02-05 | 02 | 1 | SHELL-05 | unit | `npx vitest run src/__tests__/tabs/tab-store.test.ts -t "close tab"` | ❌ W0 | pending |
| 01-03-01 | 03 | 2 | SHELL-06 | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "create"` | ❌ W0 | pending |
| 01-03-02 | 03 | 2 | SHELL-07 | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "rename"` | ❌ W0 | pending |
| 01-03-03 | 03 | 2 | SHELL-08 | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "delete"` | ❌ W0 | pending |
| 01-03-04 | 03 | 2 | SHELL-09 | unit | `npx vitest run src/__tests__/actions/file-actions.test.ts -t "move"` | ❌ W0 | pending |
| 01-03-05 | 03 | 2 | SEARCH-01 | unit | `npx vitest run src/__tests__/search/search-index.test.ts -t "search"` | ❌ W0 | pending |
| 01-03-06 | 03 | 2 | SEARCH-02 | unit | `npx vitest run src/__tests__/search/search-index.test.ts -t "results context"` | ❌ W0 | pending |
| 01-03-07 | 03 | 2 | SEARCH-03 | integration | `npx vitest run src/__tests__/search/search-dialog.test.tsx -t "opens tab"` | ❌ W0 | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with jsdom environment, path aliases
- [ ] `src/__tests__/actions/file-actions.test.ts` — covers SHELL-06, SHELL-07, SHELL-08, SHELL-09
- [ ] `src/__tests__/tabs/tab-store.test.ts` — covers SHELL-03, SHELL-04, SHELL-05
- [ ] `src/__tests__/file-tree/file-tree.test.tsx` — covers SHELL-01, SHELL-02
- [ ] `src/__tests__/viewer/markdown-viewer.test.tsx` — covers VIEW-01
- [ ] `src/__tests__/viewer/code-block.test.tsx` — covers VIEW-02
- [ ] `src/__tests__/viewer/frontmatter.test.tsx` — covers VIEW-03
- [ ] `src/__tests__/search/search-index.test.ts` — covers SEARCH-01, SEARCH-02
- [ ] `src/__tests__/search/search-dialog.test.tsx` — covers SEARCH-03
- [ ] `@testing-library/react` + `@testing-library/jest-dom` — testing utilities
- [ ] `vault/` test fixtures directory with sample markdown files

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sidebar resizing | CONTEXT decision | Visual/drag interaction | 1. Drag resize handle, 2. Verify min 200px, max 500px, 3. Refresh - verify persistence |
| Sidebar collapse | CONTEXT decision | Visual/animation | 1. Click collapse button, 2. Verify sidebar hides, 3. Refresh - verify persistence |
| Tab reordering | Future scope | Not Phase 1 | N/A |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
