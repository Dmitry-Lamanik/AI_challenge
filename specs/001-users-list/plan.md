# Implementation Plan: Users list with activities

**Branch**: `001-users-list` | **Date**: 2026-04-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-users-list/spec.md`

## Summary

Deliver a full-width roster screen listing every **user** with **name**, **position**, and nested **activities** showing **category name**, **timestamp**, and **points**. Users appear in **stable datastore order** (e.g. ascending user id). Activities within each block are **newest-first** by activity date/time. Loading, empty, and error states MUST be explicit (FR-006/007). Data comes from **Supabase Postgres** via **`@supabase/supabase-js`** using a nested select on `users` → `activities` → `activity_categories`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19, Vite 8  
**Primary Dependencies**: `react`, `react-dom`, `@supabase/supabase-js`; **planned**: `@tanstack/react-query` for server state per constitution  
**Storage**: Supabase Postgres (`public.users`, `public.activities`, `public.activity_categories`)  
**Testing**: Vitest not yet in `package.json` — add when implementing automated tests for roster hook/UI  
**Target Platform**: Modern evergreen browsers (desktop-first per spec assumptions)  
**Project Type**: SPA (Vite + React)  
**Performance Goals**: First meaningful roster content within a few seconds on typical broadband (SC-003); list scrollable for 50+ users (SC-001)  
**Constraints**: ESLint + Prettier must pass; constitution MUST rules for API layering, React Query, and hooks (see below)  
**Scale/Scope**: Read-only roster; ~100 users / ~1k activities seeded in dev scripts — design must not assume tiny datasets only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Per `.specify/memory/constitution.md`:

| Principle | Status | Notes |
|-----------|--------|--------|
| I Vite | Pass | Build remains Vite |
| II React + TS + `type` in `src/types/` | Partial → addressed in Phase 1 | Move/narrow DTO types for roster into `src/types/` using `type`; retire `interface` for those DTOs |
| III API isolation (`src/api/`) | Partial → addressed | Supabase access only via `src/api/` modules — **not** raw `createClient` in components (see Complexity for Axios wording) |
| IV React Query | Violation → remediated in plan | Add TanStack Query; roster fetch via query hook, not `useState` for server data |
| V Hooks vs components | Violation → remediated | Business/data fetch in `src/hooks/`; `Users` presents UI only |
| VI ESLint + Prettier | Pass | No broad rule suppression |
| VII Vitest / tests | Partial | Add Vitest + smoke test for hook or component when implementing |
| VIII Simplicity | Pass | React Query is justified by constitution |

**Post-design (Phase 1) re-check**: Architecture below routes Supabase calls through `src/api/`, wraps server state in React Query hooks under `src/hooks/`, and keeps UI components thin — satisfying I–VI/VIII intent. Remaining gap: Vitest wiring (tracked as implementation task).

## Project Structure

### Documentation (this feature)

```text
specs/001-users-list/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # From /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── supabaseClient.ts    # createClient + export (moved from lib or re-export)
│   └── roster.ts            # fetchUsersWithActivities() — Supabase query only
├── hooks/
│   └── useUsersWithActivities.ts   # useQuery wrapper, maps/errors
├── components/
│   ├── Users.tsx
│   └── Users.css
├── types/
│   └── roster.ts            # DTO types for nested query result (type aliases)
├── App.tsx
└── main.tsx                 # QueryClientProvider wrapper added here or App root

scripts/
└── run-seed.mjs

supabase/
└── seed.sql
```

**Structure Decision**: Single Vite SPA under `src/`; Supabase DDL/SQL under `supabase/` and `scripts/` unchanged. No separate backend repo.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constitution refers to **Axios**; stack uses **Supabase-js** | Postgres access is via Supabase Data API (`@supabase/supabase-js`), not a bespoke REST layer | Adding Axios-only wrappers would add dependency without replacing Supabase transport; **API isolation** is implemented as dedicated **`src/api/*` modules** wrapping Supabase calls |
| `authStore.ts` not used for MVP | Roster is anonymous read-only; no auth flows in spec | Store adds complexity without requirement |
| Tests not present yet | Vitest not configured in repo | Plan adds test tasks in `/speckit-tasks`; waiver for merge only if tasks slip |

## Phase 0 — Research

See [research.md](./research.md). All technical unknowns for ordering, query shape, and constitution alignment are resolved there.

## Phase 1 — Design & Contracts

| Artifact | Purpose |
|----------|---------|
| [data-model.md](./data-model.md) | Entities, keys, relationships matching Postgres |
| [contracts/roster-read.md](./contracts/roster-read.md) | Canonical read contract (nested select + ordering) |
| [quickstart.md](./quickstart.md) | Env vars, seed, dev server |

## Agent context

Cursor rule `.cursor/rules/specify-rules.mdc` updated to point to this plan (between `SPECKIT` markers).

## Next steps

1. Run **`/speckit-tasks`** to generate `tasks.md` from this plan + spec.  
2. Implement: React Query provider, `src/api/roster.ts`, `useUsersWithActivities`, refactor `Users`.  
3. Add Vitest + minimal test per constitution VII.
