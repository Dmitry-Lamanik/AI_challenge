# Research: Users list with activities

## 1. User ordering (FR-008)

- **Decision**: Rely on Supabase `.order('id', { ascending: true })` on `users` (stable identity order).
- **Rationale**: Matches clarification “stable database order / ascending user id”.
- **Alternatives considered**: Sort client-side by `id` after fetch (redundant if query orders); alphabetical by name (rejected by clarification).

## 2. Activity ordering per user (FR-009)

- **Decision**: Prefer ordering in SQL via embedded resource hint if supported; otherwise sort client-side by `date` descending, tie-break by `id` descending for stability.
- **Rationale**: Spec requires newest-first; explicit tie-break avoids flicker when timestamps duplicate.
- **Alternatives considered**: Sort by points (rejected by clarification).

## 3. Nested select shape (Supabase/PostgREST)

- **Decision**: Single query from `users` selecting nested `activities ( id, date, points, activity_categories ( name ) )` with FKs from `seed.sql`.
- **Rationale**: One round-trip; category name resolved without N+1 queries.
- **Alternatives considered**: Separate queries merged in JS (more code, more latency).

## 4. Constitution alignment (React Query + API layer)

- **Decision**: Add `@tanstack/react-query`. Implement `fetchUsersWithActivities` in `src/api/roster.ts` using the shared Supabase client from `src/api/supabaseClient.ts`. Expose `useUsersWithActivities` in `src/hooks/` calling `useQuery`.
- **Rationale**: Satisfies “server state via React Query” and keeps components free of fetch logic.
- **Alternatives considered**: Inline `useState` + `useEffect` in component (rejected — violates IV/V).

## 5. Axios vs Supabase (Principle III)

- **Decision**: Treat **`src/api/` Supabase wrappers** as the API isolation layer; do **not** introduce Axios solely for this feature.
- **Rationale**: No parallel REST API exists; constitution’s Axios singleton addresses HTTP centralization — Supabase client centralization is equivalent for this stack.
- **Alternatives considered**: Wrap Supabase in Axios-shaped facades (unnecessary indirection).

## 6. Testing

- **Decision**: Add Vitest + `@testing-library/react` when implementing tests; first test targets hook or component happy-path render with mocked query client.
- **Rationale**: Constitution VII + Vite defaults favor Vitest.
- **Alternatives considered**: No tests (rejected for compliance).
