# Tasks: Header activity filters and employee search

**Input**: Design documents from `/specs/003-header-activity-filters/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/roster-header-filters.md`, `quickstart.md`

**Tests**: Include automated unit tests for filter utilities per `plan.md` and constitution testing discipline.

**Organization**: Tasks are grouped by user story for incremental delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`US1`, `US2`, `US3`)
- Each task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared types and constants for header filters.

- [x] T001 Add `HeaderFilterState` and filter value union types to `src/types/roster.ts`
- [x] T002 [P] Add default `HeaderFilterState`, category UI→DB name map, and option value constants to `src/utils/rosterFilters.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure filter pipeline and tests; **no user story UI work** until this phase completes.

**⚠️ CRITICAL**: All user stories depend on this phase.

- [x] T003 Implement UTC year/quarter predicates and per-activity category matching in `src/utils/rosterFilters.ts`
- [x] T004 Implement `applyRosterHeaderFilters(users, filters)` returning filtered `UserWithActivities[]` per `specs/003-header-activity-filters/contracts/roster-header-filters.md` in `src/utils/rosterFilters.ts`
- [x] T005 Add Vitest cases (year, quarter, category map, combined AND, invalid date handling, name trim/empty/whitespace-only, case-insensitive substring) in `src/utils/__tests__/rosterFilters.test.ts`

**Checkpoint**: `npm run test` passes for `rosterFilters`; functions ready for `Users.tsx`.

---

## Phase 3: User Story 1 - Filter activities from the header (Priority: P1) 🎯 MVP (part 1)

**Goal**: Year, quarter, and category selects narrow activities for points, list, and podium.

**Independent Test**: Change each select; list and podium counts/order update to only include matching activities (see `specs/003-header-activity-filters/quickstart.md` steps 2–5 without search).

### Implementation for User Story 1

- [x] T006 [US1] Add three controlled `<select>` elements (year, quarter, category) and `useState` for `HeaderFilterState` in `src/components/Users.tsx`
- [x] T007 [US1] Derive `useMemo` pipeline: `applyRosterHeaderFilters` → `sortUsersByPointsDesc` → pass slices into `WinnersPodium` and `UserCard` in `src/components/Users.tsx`

**Checkpoint**: Activity filters alone behave per FR-002–FR-006 and FR-008–FR-010 (dropdown side).

---

## Phase 4: User Story 2 - Find employees by name from the header (Priority: P1) 🎯 MVP (part 2)

**Goal**: Live search field narrows visible users by name substring; list and podium stay in sync.

**Independent Test**: Type and clear search; verify live updates and case-insensitivity (`spec.md` US2, clarification B).

### Tests for User Story 2

- [x] T008 [P] [US2] Add or extend name-filter and live-search edge cases in `src/utils/__tests__/rosterFilters.test.ts` if gaps remain after T005

### Implementation for User Story 2

- [x] T009 [US2] Add controlled search `<input>` with placeholder `Search employee..` updating `searchRaw` on every input event in `src/components/Users.tsx`

**Checkpoint**: User Stories 1 and 2 together satisfy P1 acceptance; `T008` may be a no-op if T005 already covers all cases—close checkbox with note in commit if skipped.

---

## Phase 5: User Story 3 - Single-row header layout (Priority: P2)

**Goal**: One horizontal row for three selects + search on typical desktop; sensible narrowing on small viewports.

**Independent Test**: Visual check per `spec.md` US3 and `quickstart.md` step 1.

### Implementation for User Story 3

- [x] T010 [P] [US3] Add flex/grid styles for header filter row and spacing in `src/components/Users.css`
- [x] T011 [US3] Associate `<label>` / `aria-label` with each control and wrap row in a landmark-friendly container in `src/components/Users.tsx`

**Checkpoint**: Layout matches FR-001 / US3.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Manual validation and quality gates.

- [x] T012 Run all steps in `specs/003-header-activity-filters/quickstart.md` and fix defects in `src/components/Users.tsx`, `src/components/Users.css`, or `src/utils/rosterFilters.ts`
- [x] T013 [P] Run `npm run lint`, `npm run test`, and `npm run build` at repository root and resolve failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phases 3–5** → **Phase 6**
- **Phase 3 (US1)** and **Phase 4 (US2)**: US2 builds on the same `Users.tsx` state as US1; execute **US1 before US2** (or merge in one PR after T006–T007 exist, then T009).

### User Story Dependencies

- **US1**: Starts after Phase 2.
- **US2**: Depends on US1 wiring in `Users.tsx` (shared state row).
- **US3**: Depends on controls existing in `Users.tsx`; can follow US1+US2 or proceed once T006 places markup (prefer after T009 so labels cover all controls).

### Parallel Opportunities

- **T001** and **T002** different files — parallel.
- **T010** and **T011** — parallel after Phase 4 markup stable (or late Phase 3 if structure frozen).
- **T013** after implementation complete.

---

## Parallel Example: Phase 1

```text
T001: Add types in src/types/roster.ts
T002: Add constants/map in src/utils/rosterFilters.ts
```

---

## Implementation Strategy

### MVP (both P1 stories)

1. Complete Phase 1 and Phase 2 (types, utils, tests).
2. Complete Phase 3 (US1) then Phase 4 (US2).
3. Stop and run `quickstart.md` checks for P1 flows.

### Full feature

1. MVP as above.
2. Phase 5 (US3) layout and a11y labels.
3. Phase 6 polish and CI-local commands.

### Suggested task counts

| Phase        | Tasks | Notes                          |
|-------------|-------|---------------------------------|
| Phase 1     | 2     | T001–T002                       |
| Phase 2     | 3     | T003–T005                       |
| Phase 3 US1 | 2     | T006–T007                       |
| Phase 4 US2 | 2     | T008–T009                       |
| Phase 5 US3 | 2     | T010–T011                       |
| Phase 6     | 2     | T012–T013                       |
| **Total**   | **13** |                               |

---

## Extension Hooks

**Optional Hook** (after tasks): git — `/speckit.git.commit` — commit `tasks.md` if desired.
