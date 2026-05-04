# Research: Header activity filters and employee search

## 1. Where filtering runs

**Decision**: Client-side only on the existing `UserWithActivities[]` from `fetchUsersWithActivities`.

**Rationale**: Spec requires instant updates on every control change and live search; the roster payload already embeds activities with `date` and category. Demo scale fits in memory; avoids new API parameters and cache key fragmentation.

**Alternatives considered**: Server-side filtered query — rejected for this iteration due to scope and React Query key complexity for marginal gain at current scale.

## 2. Calendar year and quarter from `activities.date`

**Decision**: Parse each activity’s `date` as an ISO calendar date in **UTC** (`Date` + `getUTCFullYear`, `getUTCMonth`). Year filter `2025` keeps activities with UTC year 2025. Quarters: Q1 months 0–2, Q2 3–5, Q3 6–8, Q4 9–11. “All Years” with a specific quarter keeps activities whose `(year, quarter)` matches that quarter in the activity’s own year.

**Rationale**: Matches spec edge case on “All Years” + quarter; stable regardless of viewer timezone if dates are stored as timestamptz ISO strings from seed.

**Alternatives considered**: Local timezone — rejected to avoid off-by-one near midnight unless product later standardizes on locale.

## 3. Category filter labels vs database strings

**Decision**: UI options use **exact** spec strings (`Education`, `Public speaking`, `University partner`). Implement a fixed map to seeded category names: `Public speaking` → `Public Speaking`, `University partner` → `University Partnership`, `Education` → `Education`. Matching compares `activity.activity_categories?.name` to the mapped DB name (case-sensitive equality to seed data).

**Rationale**: FR-004 mandates display strings; seed uses title case and “Partnership”.

**Alternatives considered**: Rename DB seed — out of scope and breaks existing `UserCard` category icons keyed on DB names.

## 4. Live employee search

**Decision**: On each controlled input change, trim the query; if empty or whitespace-only after trim, skip name filter. Otherwise case-insensitive substring match on `user.name` (`toLocaleLowerCase()` on both sides for simple i18n-safe default).

**Rationale**: Clarification session B requires live updates; spec whitespace rule.

**Alternatives considered**: Debounced search — not used per spec; may be noted later if roster size grows.

## 5. Combined list + podium semantics

**Decision**: For each user, replace `activities` with the filtered subset. Apply the name filter on users (trimmed query). Ranking uses `totalPoints` / `sortUsersByPointsDesc` on filtered activities. Users who pass the name filter but have **no** matching activities still appear (0 points, empty activity panel when expanded). Podium = first three of that sorted list.

**Rationale**: Name search answers “where is this person?” even when the current activity slice is empty; ordering stays deterministic.

**Alternatives considered**: Hide users with zero filtered activities — rejected; would remove name matches from the directory when filters are tight.

## 6. Testing strategy

**Decision**: Vitest unit tests on `rosterFilters` for year, quarter, category, name, combinations, and whitespace; no MSW required.

**Rationale**: Pure functions are fast and stable; constitution VII.

**Alternatives considered**: E2E only — higher cost for same logic guarantees.
