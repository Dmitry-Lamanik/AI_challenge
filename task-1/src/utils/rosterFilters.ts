import type {
  ActivityWithCategory,
  HeaderFilterCategory,
  HeaderFilterQuarter,
  HeaderFilterState,
  HeaderFilterYear,
  UserWithActivities,
} from '../types/roster'

/** Default header filter state (FR-009). */
export const defaultHeaderFilterState = (): HeaderFilterState => ({
  year: 'all',
  quarter: 'all',
  category: 'all',
  searchRaw: '',
})

/** FR-002–FR-004: option values used by `<select>` and state. */
export const HEADER_FILTER_YEAR_OPTIONS: { value: HeaderFilterYear; label: string }[] = [
  { value: 'all', label: 'All Years' },
  { value: '2025', label: '2025' },
]

export const HEADER_FILTER_QUARTER_OPTIONS: { value: HeaderFilterQuarter; label: string }[] = [
  { value: 'all', label: 'All Quarters' },
  { value: 'Q1', label: 'Q1' },
  { value: 'Q2', label: 'Q2' },
  { value: 'Q3', label: 'Q3' },
  { value: 'Q4', label: 'Q4' },
]

export const HEADER_FILTER_CATEGORY_OPTIONS: { value: HeaderFilterCategory; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'Education', label: 'Education' },
  { value: 'Public speaking', label: 'Public speaking' },
  { value: 'University partner', label: 'University partner' },
]

/** Map UI category (FR-004) to seeded `activity_categories.name`. */
const CATEGORY_UI_TO_DB: Record<Exclude<HeaderFilterCategory, 'all'>, string> = {
  Education: 'Education',
  'Public speaking': 'Public Speaking',
  'University partner': 'University Partnership',
}

function utcYearMonth(isoDate: string): { year: number; month: number } | null {
  const t = Date.parse(isoDate)
  if (Number.isNaN(t)) return null
  const d = new Date(t)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
}

function monthInQuarter(month: number, quarter: Exclude<HeaderFilterQuarter, 'all'>): boolean {
  const start = (Number(quarter[1]) - 1) * 3
  return month >= start && month < start + 3
}

function activityMatchesYear(
  activity: ActivityWithCategory,
  year: HeaderFilterYear,
): boolean {
  if (year === 'all') return true
  const ym = utcYearMonth(activity.date)
  if (!ym) return false
  if (year === '2025') return ym.year === 2025
  return false
}

function activityMatchesQuarter(
  activity: ActivityWithCategory,
  quarter: HeaderFilterQuarter,
): boolean {
  if (quarter === 'all') return true
  const ym = utcYearMonth(activity.date)
  if (!ym) return false
  return monthInQuarter(ym.month, quarter)
}

function activityMatchesCategory(
  activity: ActivityWithCategory,
  category: HeaderFilterCategory,
): boolean {
  if (category === 'all') return true
  const dbName = CATEGORY_UI_TO_DB[category]
  const name = activity.activity_categories?.name
  return name === dbName
}

/** Single activity passes year + quarter + category (AND). */
export function activityPassesHeaderFilters(
  activity: ActivityWithCategory,
  filters: Pick<HeaderFilterState, 'year' | 'quarter' | 'category'>,
): boolean {
  return (
    activityMatchesYear(activity, filters.year) &&
    activityMatchesQuarter(activity, filters.quarter) &&
    activityMatchesCategory(activity, filters.category)
  )
}

function userNameMatchesSearch(name: string, searchRaw: string): boolean {
  const q = searchRaw.trim()
  if (q === '') return true
  return name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
}

/**
 * Returns users with `activities` replaced by the filtered subset; drops users
 * who fail the name filter. Per contract: users with zero matching activities
 * remain if their name matches.
 */
export function applyRosterHeaderFilters(
  users: UserWithActivities[],
  filters: HeaderFilterState,
): UserWithActivities[] {
  const activityPick = (a: ActivityWithCategory) =>
    activityPassesHeaderFilters(a, {
      year: filters.year,
      quarter: filters.quarter,
      category: filters.category,
    })

  const withFilteredActivities = users.map((u) => ({
    ...u,
    activities: u.activities.filter(activityPick),
  }))

  return withFilteredActivities.filter((u) => userNameMatchesSearch(u.name, filters.searchRaw))
}
