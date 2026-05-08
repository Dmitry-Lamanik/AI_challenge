<!--
Sync Impact Report
- Version change: 0.0.0-template → 1.0.0
- Modified principles: (initial adoption — template placeholders replaced)
  - N/A → I. Vite Build Pipeline
  - N/A → II. React with TypeScript
  - N/A → III. ESLint and Prettier (NON-NEGOTIABLE)
  - N/A → IV. Testing Discipline
  - N/A → V. Simplicity and Dependencies
- Added sections: Technology Stack Requirements; Development Workflow & Quality Gates
- Removed sections: none (template sections renamed/filled)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ updated (Constitution Check gates)
  - .specify/templates/spec-template.md — ✅ updated (assumption example)
  - .specify/templates/tasks-template.md — ✅ updated (setup phase examples)
  - .specify/templates/commands/*.md — ⚠ pending (directory not present in repo)
- Follow-up TODOs: none
-->

# AI Challenge Task 1 Constitution

## Core Principles

### I. Vite Build Pipeline

All frontend development and production builds MUST use Vite (`vite` dev server, `vite build`).
Alternate bundlers or dev servers are not permitted unless this constitution is amended and the
plan documents migration impact.

**Rationale**: A single build tool keeps configuration, plugins, and performance tuning consistent.

### II. React with TypeScript

User interfaces MUST be implemented with React. Application source MUST use TypeScript (`.ts`,
`.tsx`). Project configuration SHOULD enable TypeScript `strict` checks. Avoid `any`; use
`unknown`, generics, or explicit types instead. Object shapes MUST use `type` declarations (not `interface`). All types mirroring backend DTOs MUST live in src/types/

**Rationale**: Shared typing reduces runtime defects and keeps components refactor-safe.

### III. API-Layer Isolation

All HTTP communication with the backend MUST pass through dedicated
functions in `src/api/`. Components and hooks MUST NOT import or call
`axios` directly. The Axios instance in `src/api/` is the single point
for base URL configuration, Bearer token attachment, and 401/refresh
interceptor logic.

**Rationale**: Centralizing network calls prevents token-handling bugs,
enforces consistent error handling, and makes backend contract changes
a single-file update.

### IV. Server State via React Query
All data fetched from the API MUST be managed through TanStack React Query (@tanstack/react-query). Components MUST NOT store API response data in useState or global stores. Cache invalidation, background refetching, and loading/error states MUST be handled by React Query hooks defined in src/hooks/.

**Rationale**: React Query provides deduplication, caching, and background sync out of the box. Duplicating server state into local state leads to stale data and synchronization bugs.

### V. Component-Logic Separation
Business logic and data-fetching MUST live in custom hooks inside src/hooks/. React components MUST only handle rendering and local UI state (modals, toggles, form inputs). Global client state (auth tokens, current user) MUST live in src/stores/authStore.ts backed by localStorage.

**Rationale**: Keeping logic in hooks makes it reusable across pages, testable in isolation, and prevents components from becoming monolithic.

### VI. ESLint and Prettier (NON-NEGOTIABLE)

Code MUST pass ESLint using the repository ESLint configuration. Formatting MUST follow Prettier;
style disputes are resolved by formatter and shared rules, not ad hoc edits. Automated checks
(MUST run locally before merge and in CI when CI exists) MUST include lint and format verification
(`eslint`, `prettier --check` or equivalent integration).

**Rationale**: Consistent lint and format reduce review noise and catch classes of bugs early.

### VII. Testing Discipline

Features MUST include automated tests appropriate to the risk of the change when the project has a
test runner configured (Vitest is the default choice alongside Vite). Regressions on critical paths
MUST not be merged without a failing test caught first or an explicit documented waiver in the
plan.

**Rationale**: Tests protect refactors and document expected behavior.

### VIII. Simplicity and Dependencies

Prefer built-in Vite and React capabilities before adding libraries. New dependencies MUST be
justified for maintenance cost, bundle size, and security exposure.

**Rationale**: Fewer dependencies reduce attack surface and upgrade burden.

## Technology Stack Requirements

The default approved frontend stack is:

- **Build tool**: Vite
- **UI library**: React
- **Language**: TypeScript
- **Linting**: ESLint (project config extends shared standards as defined in repo)
- **Formatting**: Prettier (single source of truth for code style)

Backend services, APIs, or databases used by this repository MUST be listed in feature plans when
relevant; they do not replace the frontend stack requirements above.

## Development Workflow & Quality Gates

- Changes MUST keep `npm run` / `pnpm` / `yarn` scripts for `lint`, `format` (or combined checks)
  passing as defined in the repository.
- Pull requests MUST not disable or broadly suppress ESLint rules without review and plan-level
  justification.
- Prettier configuration MUST remain the authority for formatting; avoid manual formatting that
  fights Prettier output.

## Governance

This constitution supersedes informal coding preferences for this repository. Amendments MUST be
recorded in `.specify/memory/constitution.md` with an updated Sync Impact Report, version bump, and
`Last Amended` date.

**Versioning**: `MAJOR` for incompatible governance or removal of principles; `MINOR` for new
principles or materially expanded rules; `PATCH` for clarifications and non-semantic edits.

**Compliance**: Feature plans (`plan.md`) MUST complete the Constitution Check before Phase 0
research and re-validate after Phase 1 design. Reviewers MUST reject changes that violate MUST rules
here unless the plan’s Complexity Tracking section documents an approved exception.

**Version**: 1.0.0 | **Ratified**: 2026-04-29 | **Last Amended**: 2026-04-29
