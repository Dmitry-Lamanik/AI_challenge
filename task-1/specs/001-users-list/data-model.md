# Data model: Users list

Source of truth: `supabase/seed.sql` (public schema).

## Entity: `users`

| Field | SQL type | Notes |
|-------|----------|--------|
| `id` | `BIGINT` identity PK | Stable roster ordering (ascending) |
| `name` | `TEXT` NOT NULL | Display name |
| `position` | `TEXT` NOT NULL | Role / title |

**Relationships**: One-to-many with `activities`.

## Entity: `activity_categories`

| Field | SQL type | Notes |
|-------|----------|--------|
| `id` | `BIGINT` identity PK | |
| `name` | `TEXT` NOT NULL | e.g. Education, Public Speaking, University Partnership |

**Relationships**: Referenced by `activities.category_id`.

## Entity: `activities`

| Field | SQL type | Notes |
|-------|----------|--------|
| `id` | `BIGINT` identity PK | Tie-break for same timestamp |
| `user_id` | `BIGINT` FK → `users(id)` ON DELETE CASCADE | |
| `category_id` | `BIGINT` FK → `activity_categories(id)` | |
| `date` | `TIMESTAMPTZ` NOT NULL | Sort key for FR-009 (desc) |
| `points` | `INTEGER` NOT NULL | Display + total sum per user |

**Validation / rules**

- Activities belong to exactly one user and one category.
- Uniqueness: no business constraint on duplicate (user, category, date) in seed — UI lists all rows.

## Row Level Security

`seed.sql` enables RLS with permissive policies for `anon` / `authenticated` for development. Production deployments MUST replace with least-privilege policies (out of scope for this spec).
