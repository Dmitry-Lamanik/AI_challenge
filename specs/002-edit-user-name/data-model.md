# Data model: Edit user name in popup

Source of truth: `public.users` in `supabase/seed.sql`.

## Entity: `users`

| Field | SQL type | Notes |
|-------|----------|-------|
| `id` | `BIGINT` identity PK | Immutable user identity |
| `name` | `TEXT` NOT NULL | Editable display name |
| `position` | `TEXT` NOT NULL | Read-only for this feature |

## Logical entity: `NameEditSession` (UI state)

| Field | Type | Notes |
|-------|------|-------|
| `userId` | number | Target user id |
| `initialName` | string | Name value at popup open / edit start |
| `draftName` | string | Current input value |
| `status` | `idle \| editing \| saving \| success \| error \| conflict` | Edit lifecycle state |
| `errorMessage` | string \| null | Validation/network/conflict feedback |

## Validation rules

- `draftName.trim().length > 0` is required for save.
- Save is skipped when `draftName.trim()` equals `initialName`.
- Concurrent conflict: if update request with (`id`, `initialName`) filter updates zero rows, map to `conflict`.

## State transitions

`idle -> editing -> saving -> success`

`editing -> idle` (cancel)

`saving -> error` (network/backend error)

`saving -> conflict` (stale initial value due to concurrent external update)
