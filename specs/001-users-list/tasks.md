---

description: "Task list for Users list with activities"
---

# Tasks: Users list with activities

**Input**: Design documents from `/specs/001-users-list/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Constitution and plan call for Vitest smoke coverage — test tasks included in Polish phase.

**Organization**: Phases follow user stories US1 (P1), US2 (P2); foundational work blocks both.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no conflicting dependencies)
- **[Story]**: [US1] / [US2] for user-story phases only

## Path Conventions

Single Vite SPA: `src/` at repository root (see `plan.md`).

---

## Phase 1: Setup (shared infrastructure)

**Purpose**: Dependencies and types needed by API layer and hooks.

- [x] T001 Add `@tanstack/react-query` to project dependencies (`package.json`, run install at repo root)
- [x] T002 [P] Create `src/types/roster.ts` with `type` aliases for nested roster rows per `contracts/roster-read.md` (users → activities → category name)
- [x] T003 Move `src/lib/supabaseClient.ts` and `src/lib/database.types.ts` into `src/api/` (same filenames), update imports in `src/components/Users.tsx`, remove empty `src/lib/` if unused

---

## Phase 2: Foundational (blocking)

**Purpose**: Query client, isolated Supabase reads, hook — **must finish before US1/US2 UI work.**

**⚠️ CRITICAL**: No user story completion until this phase is done.

- [x] T004 Implement `fetchUsersWithActivities()` in `src/api/roster.ts` using `src/api/supabaseClient.ts` — nested select and `users` ordered ascending by `id`; normalize activity rows **newest-first** by `date` (tie-break by `id` desc per spec edge case)
- [x] T005 Implement `useUsersWithActivities()` in `src/hooks/useUsersWithActivities.ts` with `useQuery` (stable query key, expose `data`, `isLoading`, `isError`, `error`, `refetch`)
- [x] T006 Wrap the app tree in `QueryClientProvider` with a shared `QueryClient` in `src/main.tsx` (keep `StrictMode`)

**Checkpoint**: API + hook ready — user story UI can consume `useUsersWithActivities` only.

---

## Phase 3: User Story 1 — View roster with activity detail (Priority: P1) 🎯 MVP

**Goal**: Full-width user blocks with name, position, activities showing category name, date, points; stable user order and newest-first activities (FR-001–FR-006, FR-008–FR-009).

**Independent Test**: With seeded Supabase data, open app — see ordered users and categorized activities per `quickstart.md`.

### Implementation

- [x] T007 [US1] Refactor `src/components/Users.tsx` to use only `useUsersWithActivities` (remove direct `supabase` imports); render loading and empty states; full-width cards via `src/components/Users.css`; list activities with category label, formatted timestamp, points; show per-user total points if present in UI
- [x] T008 [US1] Ensure `src/App.tsx` renders `<Users />` as the primary screen inside `.app-main` per FR-005 (`src/App.css`)

**Checkpoint**: US1 acceptance scenarios pass manually.

---

## Phase 4: User Story 2 — Recover from unavailable data (Priority: P2)

**Goal**: Visible error and retry when roster fetch fails (FR-007).

**Independent Test**: Break Supabase URL or block network — error message appears; Retry triggers refetch without crash.

### Implementation

- [x] T009 [US2] In `src/components/Users.tsx`, render query error state from the hook with a concise message and a **Retry** control that calls `refetch()` from `useUsersWithActivities`

**Checkpoint**: US2 acceptance scenario passes manually.

---

## Phase 5: Polish & cross-cutting

**Purpose**: Vitest wiring, smoke test, quality gates.

- [x] T010 Add Vitest + `@testing-library/react` (+ `jsdom`, `@testing-library/jest-dom` as needed), `vitest.config.ts`, and `npm run test` script in `package.json`
- [x] T011 [P] Add smoke test `src/components/Users.test.tsx` (render with `QueryClientProvider` and mocked `fetchUsersWithActivities` or MSW — minimal: renders loading or list without throwing)
- [x] T012 Run `npm run lint` and `npm run build`; resolve any issues introduced by the refactor

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1** → **Phase 2** → **Phase 3 (US1)** → **Phase 4 (US2)** → **Phase 5**
- **US2** depends on **US1** only insofar as it extends `Users.tsx` — complete T007 before T009 or implement error UI in same file after T005–T006 exist.

### User story dependencies

- **US1 (P1)**: Starts after Phase 2.
- **US2 (P2)**: Starts after Phase 2; logically follows US1 file ownership (`Users.tsx`) — execute T009 after T007–T008.

### Parallel opportunities

- T002 can run parallel to T001 (different concerns) once repo is writable.
- T011 can run parallel to T012 after T010 completes.

---

## Parallel example (after Phase 2)

```bash
# Developer A: US1 UI (T007–T008)
# Developer B: prepare Vitest config early (T010) only after T001 — avoid conflicting package-lock edits without coordination
```

---

## Implementation strategy

### MVP first (US1 only)

1. Complete Phase 1 + Phase 2  
2. Complete Phase 3 (T007–T008) — validate roster  
3. Add Phase 4 (T009) for production-grade error handling  
4. Phase 5 for constitution testing discipline  

### Suggested MVP scope

- **MVP**: Phases 1–3 (T001–T008) — demo-ready roster  
- **Recommended before merge**: T009–T012  

---

## Notes

- Single feature branch / single `Users.tsx`: serialize edits if one developer to avoid merge conflicts.  
- Contract reference: `contracts/roster-read.md`.  
- Env setup: `.env` per `quickstart.md` for manual testing.
