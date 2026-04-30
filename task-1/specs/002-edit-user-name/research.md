# Research: Edit user name in popup

## 1. Update API placement and shape

- **Decision**: Implement `updateUserName(userId, nextName, expectedCurrentName)` in `src/api/roster.ts` as the single mutation entry point.
- **Rationale**: Keeps write operations in the API layer and aligned with constitution principle III.
- **Alternatives considered**: Calling Supabase directly in component/hook (rejected: breaks layering and complicates reuse/tests).

## 2. Mutation state management

- **Decision**: Use a dedicated React Query mutation hook (`useUpdateUserName`) that updates/invalidate roster cache after success.
- **Rationale**: Keeps server-state lifecycle centralized (loading, success, error) and prevents stale UI state.
- **Alternatives considered**: Local `useState` network handling in component (rejected: duplicates request/error logic).

## 3. Concurrency conflict handling (clarified)

- **Decision**: Detect conflict on save by matching both `id` and `expectedCurrentName`; if no row updated, treat as conflict and require popup reopen/reload before retry.
- **Rationale**: Implements approved clarification outcome and avoids silent overwrite.
- **Alternatives considered**: Last write wins silently (rejected by clarification), automatic merge (rejected as non-deterministic for names).

## 4. Validation boundaries

- **Decision**: Apply trim-based validation in UI and API call boundary; block empty/whitespace-only values and unchanged values before mutation.
- **Rationale**: Fast feedback for operator, avoids unnecessary writes, and keeps behavior deterministic.
- **Alternatives considered**: Backend-only validation (rejected: slower UX and extra requests).

## 5. Error taxonomy for popup UX

- **Decision**: Distinguish three outcomes in edit flow: generic failure, conflict, and in-flight submit lock.
- **Rationale**: Each outcome has different operator action (retry, reload, or wait), reducing confusion.
- **Alternatives considered**: Single generic error state (rejected: does not satisfy clarified conflict behavior).

## 6. Testing focus

- **Decision**: Add interaction tests for click-to-edit/save/cancel/validation and hook-level tests for success/failure/conflict mapping.
- **Rationale**: Covers highest-risk regressions and constitution principle VII with minimal test surface.
- **Alternatives considered**: End-to-end only (rejected: slower feedback loop and harder failure localization).
