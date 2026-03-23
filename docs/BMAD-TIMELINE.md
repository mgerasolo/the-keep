# BMAD Timeline

## Position: ✅ SETUP COMPLETE - Ready for TDD Story Loop

**Status:** All 7 setup steps complete (including test framework). 88 stories in sprint-status.yaml.
**Next:** Step 8 - Dev Story (`/bmad-dev-story`) with TDD workflow

---

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'fontSize': '11px'}}}%%
flowchart TB
    subgraph SETUP["SETUP"]
        direction TB
        S1["1 Brief"]
        S2["2 PRD"]
        S3["3 Arch"]
        S4["4 UX"]
        S5["5 Epics"]
        S6["6 Sprint"]
        S7["6.5 Test Framework"]
        S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
    end

    subgraph LOOP["STORY LOOP (TDD)"]
        direction TB
        L7["7 Create"]
        L8["8 Dev (Red→Green→Refactor)"]
        L9["9 Review"]
        L7 --> L8 --> L9
        L9 -.->|next| L7
    end

    S7 --> LOOP

    style S1 fill:#22c55e,stroke:#4ade80,color:#000
    style S2 fill:#22c55e,stroke:#4ade80,color:#000
    style S3 fill:#22c55e,stroke:#4ade80,color:#000
    style S4 fill:#22c55e,stroke:#4ade80,color:#000
    style S5 fill:#22c55e,stroke:#4ade80,color:#000
    style S6 fill:#22c55e,stroke:#4ade80,color:#000
    style S7 fill:#22c55e,stroke:#4ade80,color:#000
```

---

## Status

| # | Step | Cmd | ✓ |
|---|------|-----|---|
| 1 | Brief | `/bmad-create-product-brief` | ● |
| 2 | PRD | `/bmad-create-prd` | ● |
| 3 | Arch | `/bmad-create-architecture` | ● |
| 4 | UX | `/bmad-create-ux-design` | ● |
| 5 | Epics | `/bmad-create-epics-and-stories` | ● |
| 6 | Sprint | `/bmad-sprint-planning` | ● |
| 6.5 | Test Framework | `/bmad-testarch-framework` | ● |
| 7 | Create | `/bmad-create-story` | ● |
| 8 | Dev (TDD) | `/bmad-dev-story` | ○ |
| 9 | Review | `/bmad-code-review` | ○ |

**Legend:** ▶ NOW · ● DONE · ○ TODO

### TDD Workflow (Step 8)

The Dev step follows **Red→Green→Refactor**:
1. **Red:** Write failing tests first
2. **Green:** Implement minimal code to pass
3. **Refactor:** Clean up while tests stay green
4. **Self-validate:** Run full test suite before declaring done

---

*Oscar enforces this sequence*
