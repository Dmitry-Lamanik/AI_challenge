# Contract: Read roster (users with nested activities)

## Operation

- **Kind**: Supabase/PostgREST single query (read-only)
- **Entry**: `fetchUsersWithActivities()` in `src/api/roster.ts` (planned)

## Query semantics

- **From**: `users`
- **Select** (nested):

```text
id,
name,
position,
activities (
  id,
  date,
  points,
  activity_categories (
    name
  )
)
```

- **Order**: `users.id` ascending (FR-008).

## Ordering rules

| Level | Order |
|-------|--------|
| Users | Ascending `users.id` |
| Activities (per user) | Descending `activities.date`; if equal, descending `activities.id` (implementation detail, SHOULD) |

## Response shape (logical)

- Array of **User** objects each containing:
  - `id`, `name`, `position`
  - `activities`: array of `{ id, date, points, activity_categories: { name } | null }`

## Errors

- Network / Supabase errors surface as query failure → UI error state (FR-007).
- Missing embed relation → treat as implementation bug; contract assumes FKs from `seed.sql`.
