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
