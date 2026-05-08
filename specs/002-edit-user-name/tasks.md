# Tasks: Edit user name in popup

**Input**: Design documents from `/specs/002-edit-user-name/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/user-name-update.md`, `quickstart.md`

**Tests**: Include automated tests because specification and plan define measurable verification and test coverage for success/error/conflict paths.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Each task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare test/runtime scaffolding for popup name-edit work.

- [x] T001 Add name-edit testing helpers and React Query test wrapper in `src/test/queryTestUtils.tsx`
- [x] T002 [P] Add Supabase mutation mock fixtures for name update outcomes in `src/test/fixtures/userNameUpdate.ts`
- [x] T003 [P] Add shared constants/messages for popup name edit flow in `src/components/userNameEdit.constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared mutation and API infrastructure required by all stories.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [x] T004 Implement `updateUserName()` API mutation with conflict detection in `src/api/roster.ts`
- [x] T005 [P] Add mutation-specific error/result types for edit flow in `src/types/roster.ts`
- [x] T006 Implement `useUpdateUserName()` React Query mutation hook with cache sync in `src/hooks/useUpdateUserName.ts`
- [x] T007 Add hook-level mutation tests for success, error, and conflict mapping in `src/hooks/__tests__/useUpdateUserName.test.ts`

**Checkpoint**: Shared mutation contract is implemented and testable.

---

## Phase 3: User Story 1 - Edit user name directly (Priority: P1) 🎯 MVP

**Goal**: Operator can click name in popup, edit, save, and immediately see updated value.

**Independent Test**: Open popup, click name, edit and save valid value, verify popup and card show updated name without page reload.

### Tests for User Story 1

- [x] T008 [P] [US1] Add interaction test for click-to-edit and successful save in `src/components/__tests__/UserCard.edit-name.test.tsx`
- [x] T009 [P] [US1] Add interaction test for concurrent conflict message and retry guidance in `src/components/__tests__/UserCard.edit-name.conflict.test.tsx`

### Implementation for User Story 1

- [x] T010 [US1] Integrate editable-name popup UI state machine into `src/components/UserCard.tsx`
- [x] T011 [US1] Wire save action to `useUpdateUserName` with loading lock and success exit in `src/components/UserCard.tsx`
- [x] T012 [P] [US1] Add popup editable-name controls and feedback styles in `src/components/UserCard.css`
- [x] T013 [US1] Connect roster cache refresh behavior after successful save in `src/hooks/useUpdateUserName.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Cancel accidental edits (Priority: P2)

**Goal**: Operator can cancel edit mode safely without persisting changes.

**Independent Test**: Enter edit mode, change draft value, cancel or close popup, verify original saved name remains unchanged.

### Tests for User Story 2

- [x] T014 [P] [US2] Add interaction test for explicit cancel action preserving original name in `src/components/__tests__/UserCard.edit-name.cancel.test.tsx`
- [x] T015 [P] [US2] Add interaction test for popup-close discard behavior in `src/components/__tests__/UserCard.edit-name.dismiss.test.tsx`

### Implementation for User Story 2

- [x] T016 [US2] Implement cancel handler and draft reset behavior in `src/components/UserCard.tsx`
- [x] T017 [US2] Implement popup-dismiss cleanup for unsaved edit state in `src/components/UserCard.tsx`
- [x] T018 [P] [US2] Add cancel/dismiss UI affordance styling updates in `src/components/UserCard.css`

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - Input validation feedback (Priority: P3)

**Goal**: Invalid names are blocked with clear feedback, and valid correction re-enables save.

**Independent Test**: Enter empty/whitespace value, verify save blocked with message; enter valid value and verify message cleared with save available.

### Tests for User Story 3

- [x] T019 [P] [US3] Add validation test for empty and whitespace-only input in `src/components/__tests__/UserCard.edit-name.validation.test.tsx`
- [x] T020 [P] [US3] Add validation recovery test for clearing error on valid input in `src/components/__tests__/UserCard.edit-name.validation.test.tsx`

### Implementation for User Story 3

- [x] T021 [US3] Implement trim-based validation and unchanged-value short-circuit in `src/components/UserCard.tsx`
- [x] T022 [P] [US3] Render inline validation messages and disabled-save visual states in `src/components/UserCard.css`

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and documentation alignment.

- [x] T023 [P] Add/update popup edit flow notes and manual checks in `specs/002-edit-user-name/quickstart.md`
- [x] T024 Run full quality suite (`npm run test`, `npm run lint`, `npm run build`) and record outcomes in `specs/002-edit-user-name/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; MVP.
- **Phase 4 (US2)**: Depends on Phase 3 shared UI edit mode.
- **Phase 5 (US3)**: Depends on Phase 3 edit UI baseline.
- **Phase 6 (Polish)**: Depends on completion of targeted stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational phase.
- **US2 (P2)**: Reuses US1 edit mode and adds safe cancellation behavior.
- **US3 (P3)**: Reuses US1 edit mode and adds validation constraints.

### Within Each User Story

- Write tests first and ensure they fail before implementation.
- Implement logic in `UserCard.tsx` before final style polish in `UserCard.css`.
- Keep API and mutation logic in `src/api/` and `src/hooks/` only.

### Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T005 and T007 can run in parallel with parts of T004/T006 once interfaces stabilize.
- In US1, T008/T009 and T012 can run in parallel with T010.
- In US2, T014/T015 and T018 can run in parallel with T016.
- In US3, T019/T020 and T022 can run in parallel with T021.

---

## Parallel Example: User Story 1

```bash
Task: "T008 [US1] Add interaction test for click-to-edit and successful save in src/components/__tests__/UserCard.edit-name.test.tsx"
Task: "T009 [US1] Add interaction test for concurrent conflict message and retry guidance in src/components/__tests__/UserCard.edit-name.conflict.test.tsx"
Task: "T012 [US1] Add popup editable-name controls and feedback styles in src/components/UserCard.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate MVP with independent US1 test criteria.

### Incremental Delivery

1. Deliver US1 (editable save flow).
2. Add US2 (cancel and dismiss safety).
3. Add US3 (validation feedback and blocking).
4. Finish with cross-cutting polish checks.

### Parallel Team Strategy

1. One developer finishes Phase 1-2 foundation.
2. Then split by story:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3

---

## Notes

- `[P]` tasks touch different files and can be run concurrently.
- All story tasks include `[US#]` labels for traceability.
- Avoid broad refactors outside files listed in this plan.
