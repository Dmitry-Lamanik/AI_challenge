# Contract: Client-side roster header filters

## Scope

Pure TypeScript functions (planned entry: `src/utils/rosterFilters.ts`) that transform `UserWithActivities[]` and `HeaderFilterState` into a filtered, sorted roster for UI. No I/O.

## Inputs

- `users: UserWithActivities[]` — non-null array (caller handles loading).
- `filters: HeaderFilterState` — see [data-model.md](../data-model.md).

## Output

- `filteredUsers: UserWithActivities[]` — subset of input users passing the name filter (when active). Each element is `{ ...user, activities: filteredActivities }` where `filteredActivities` satisfies year, quarter, and category rules (users with zero matching activities are still included if they pass the name filter).
- Caller runs `sortUsersByPointsDesc(filteredUsers)` for podium and list order.

## Activity inclusion rules

1. **Year**: `all` → no year predicate. `2025` → activity UTC year === 2025.
2. **Quarter**: `all` → no quarter predicate. Else activity’s `(UTC year, UTC month)` must fall in that calendar quarter for that activity’s year.
3. **Category**: `all` → no category predicate. Else activity’s `activity_categories.name` equals the DB name mapped from the UI option (`Public speaking` → `Public Speaking`, `University partner` → `University Partnership`, `Education` → `Education`).

All selected non-`all` dimensions apply (**AND**).

## Name filter

After building each user’s filtered activities:

- Let `q = filters.searchRaw.trim()`.
- If `q === ''`, keep all users.
- Else keep users where `user.name.toLocaleLowerCase()` contains `q.toLocaleLowerCase()` as a contiguous substring.

## Ordering

Sorting and tie-breaks are **not** part of this contract; reuse `sortUsersByPointsDesc` from `src/utils/rosterLeaderboard.ts`.

## Errors

Invalid dates on an activity: implementation SHOULD treat as non-matching for year/quarter filters (or exclude that activity only) without throwing; document chosen behavior in implementation.
