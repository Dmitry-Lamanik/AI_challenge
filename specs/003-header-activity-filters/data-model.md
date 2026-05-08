# Data model: Header activity filters

## Overview

All structures are **in-memory** views over `UserWithActivities` and related types in `src/types/roster.ts`. Nothing in this feature is persisted.

## Types

### `HeaderFilterState` (proposed)

| Field | Type | Description |
|-------|------|-------------|
| `year` | `'all' \| '2025'` | “All Years” vs concrete year |
| `quarter` | `'all' \| 'Q1' \| 'Q2' \| 'Q3' \| 'Q4'` | Calendar quarter filter |
| `category` | `'all' \| 'Education' \| 'Public speaking' \| 'University partner'` | UI value per FR-004 |
| `searchRaw` | `string` | Raw input; trim for matching |

### `ActivityWithCategory` (existing)

From roster types: `id`, `title`, `date`, `points`, `activity_categories: { name } | null`.

**Filtering**: An activity passes category filter when `category === 'all'` or mapped DB name equals `activity_categories?.name`. Activities with `null` embed fail category filter when a specific category is selected.

### `UserWithActivities` (derived)

Pipeline output per user:

- `activities`: **filtered** array (subset of original).
- `name`, `id`, `position`: unchanged.

Ranking uses `totalPoints(user)` on the filtered `activities` array.

## Validation rules

- Year, quarter, category must be one of the enumerated values (enforced by `<select>` value types).
- Search: trim; empty → no name predicate.

## State transitions

Header controls update `HeaderFilterState` in React state → `useMemo` recomputes derived users → list and podium re-render. No server round-trip.
