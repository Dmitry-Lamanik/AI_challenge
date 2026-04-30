# Contract: Update user name from popup

## Operation

- **Kind**: Supabase/PostgREST update mutation
- **Entry**: `updateUserName()` in `src/api/roster.ts`
- **Caller**: `useUpdateUserName()` hook in `src/hooks/`

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | number | Yes | Target `users.id` |
| `nextName` | string | Yes | New display name |
| `expectedCurrentName` | string | Yes | Snapshot name used for conflict detection |

## Preconditions

- `nextName.trim()` MUST be non-empty.
- `nextName.trim()` SHOULD differ from `expectedCurrentName`.

## Mutation semantics

- Update target: `public.users`.
- Set: `name = nextName.trim()`.
- Filter: `id = userId AND name = expectedCurrentName`.
- Response expectation:
  - **1 row updated**: success.
  - **0 rows updated**: conflict (name changed externally or stale popup state).

## Outcomes

| Outcome | Condition | UI action |
|---------|-----------|-----------|
| `success` | Exactly one row updated | Exit edit mode and show updated name |
| `conflict` | Zero rows updated with no transport error | Show conflict message and require popup reopen/reload |
| `error` | Transport/backend error | Show retryable error and keep previous saved name |

## Cache synchronization

- On success, roster query (`['users', 'roster']`) MUST be refreshed or updated so popup and card show the same name.
- On conflict/error, existing roster cache remains authoritative.
