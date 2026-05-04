# Implementation Plan: Header activity filters and employee search

**Branch**: `003-header-activity-filters` | **Date**: 2026-05-04 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-header-activity-filters/spec.md`

## Summary

Add a single-row header on the users roster page with three selects (year, quarter, category) and a live employee search field. Activity filters narrow which activities contribute to per-user points and to each card’s activity list; the name filter narrows which users appear in the list and on the podium. All filtering and ranking run **client-side** on the existing `UserWithActivities[]` payload from `useUsersWithActivities` (no new API). Category labels in the UI follow the spec strings and map to seeded DB category names where they differ.

## Technical Context

**Language/Version**: TypeScript (strict), React 19, Vite 8  
**Primary Dependencies**: `react`, `react-dom`, `@tanstack/react-query`, `@supabase/supabase-js`  
**Storage**: Supabase Postgres (existing `users` / `activities` / `activity_categories`); reads unchanged  
**Testing**: Vitest + Testing Library (`npm run test`)  
**Target Platform**: Modern evergreen browsers (desktop-first; responsive header per spec)  
**Project Type**: SPA (Vite + React)  
**Performance Goals**: Filtered list and podium recompute on each control change without perceptible stall for demo-sized rosters; live search per keystroke per clarification B  
**Constraints**: Roster fetch only via `src/api/roster.ts`; server state via React Query; filter state is derived local/UI state; lint/format must pass  
**Scale/Scope**: Fixed option sets (years, quarters, categories); no schema migration for this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Per `.specify/memory/constitution.md`:

- **I Vite Build Pipeline**: Pass. No bundler change.
- **II React with TypeScript**: Pass. New types in `src/types/` if needed; use `type` not `interface` for DTO-shaped types.
- **III API-Layer Isolation**: Pass. No new network paths required; components do not import Supabase client for this feature.
- **IV Server State via React Query**: Pass. Roster remains `useUsersWithActivities()`; filtering is `useMemo` (or small hook) over cached query data.
- **V Component-Logic Separation**: Pass. Pure filter/ranking helpers in `src/utils/`; `Users.tsx` wires controls + derived lists; optional thin `useRosterHeaderFilters` in `src/hooks/` only if it improves readability.
- **VI ESLint and Prettier**: Pass.
- **VII Testing Discipline**: Pass. Unit tests for date/quarter/category/name matching and combined pipeline (see research.md).
- **VIII Simplicity and Dependencies**: Pass. No new dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/003-header-activity-filters/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── roster-header-filters.md
└── tasks.md             # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── api/
│   └── roster.ts                     # unchanged for this feature
├── hooks/
│   └── useUsersWithActivities.ts     # unchanged
├── components/
│   ├── Users.tsx                     # header controls + derived ranked list & podium inputs
│   ├── Users.css                     # header filter row layout
│   ├── UserCard.tsx                  # receives user with pre-filtered activities (or equivalent prop)
│   └── WinnersPodium.tsx             # unchanged props; fed filtered top three
├── utils/
│   └── rosterFilters.ts              # NEW: activity + name predicates, mapUsersWithFilteredActivities
└── types/
    └── roster.ts                     # optional: HeaderFilterState type export

src/utils/__tests__/
└── rosterFilters.test.ts             # NEW: filter + ranking cases
```

**Structure Decision**: Single SPA; add one focused utility module for filter semantics and tests; extend `Users` + CSS for the header row; pass filtered `UserWithActivities` into existing `UserCard` / `WinnersPodium` so points and tables stay consistent.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase 0 — Research

See [research.md](./research.md). Resolves quarter boundaries, category label ↔ DB mapping, live search behavior, and empty/edge handling.

## Phase 1 — Design & Contracts

| Artifact | Purpose |
|----------|---------|
| [data-model.md](./data-model.md) | Header filter state, derived user view, activity predicates |
| [contracts/roster-header-filters.md](./contracts/roster-header-filters.md) | Pure-function contract for client-side roster filtering |
| [quickstart.md](./quickstart.md) | Local manual verification checklist |

## Agent context

Updated `.cursor/rules/specify-rules.mdc` between `SPECKIT` markers to reference `specs/003-header-activity-filters/plan.md`.

## Post-design Constitution Re-check

Filtering remains pure client derivation over React Query data; API and query modules untouched. No constitution violations.

## Next steps

1. Run `/speckit-tasks` to generate `tasks.md`.
2. Implement `rosterFilters.ts`, header UI in `Users.tsx`, wire `UserCard` with filtered activities.
3. Add `rosterFilters.test.ts` and run `npm run test`, `npm run lint`, `npm run build`.

## Implementation validation results

- _Pending implementation._
