/** Nested roster rows returned by `fetchUsersWithActivities` (see contracts/roster-read.md). */

export type ActivityCategoryEmbed = {
  name: string
}

export type ActivityWithCategory = {
  id: number
  title: string
  date: string
  points: number
  activity_categories: ActivityCategoryEmbed | null
}

export type UserWithActivities = {
  id: number
  name: string
  position: string
  activities: ActivityWithCategory[]
}

export type UpdateUserNameInput = {
  userId: number
  nextName: string
  expectedCurrentName: string
}

export type UpdateUserNameResult = Pick<UserWithActivities, 'id' | 'name' | 'position'>

/** Header roster filters (see `specs/003-header-activity-filters/data-model.md`). */

export type HeaderFilterYear = 'all' | '2025'

export type HeaderFilterQuarter = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'

export type HeaderFilterCategory = 'all' | 'Education' | 'Public speaking' | 'University partner'

export type HeaderFilterState = {
  year: HeaderFilterYear
  quarter: HeaderFilterQuarter
  category: HeaderFilterCategory
  searchRaw: string
}
