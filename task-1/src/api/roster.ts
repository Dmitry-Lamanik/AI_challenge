import { supabase } from './supabaseClient'
import type { ActivityWithCategory, UserWithActivities } from '../types/roster'

function sortActivitiesNewestFirst(rows: ActivityWithCategory[]): ActivityWithCategory[] {
  return [...rows].sort((a, b) => {
    const byDate = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (byDate !== 0) return byDate
    return b.id - a.id
  })
}

function normalizeUsers(data: unknown): UserWithActivities[] {
  if (!Array.isArray(data)) return []
  return data.map((row: unknown) => {
    const raw = row as UserWithActivities
    const acts = raw.activities ? sortActivitiesNewestFirst(raw.activities) : []
    return {
      id: raw.id,
      name: raw.name,
      position: raw.position,
      activities: acts,
    }
  })
}

/**
 * Loads users in ascending id order with nested activities and category names.
 */
export async function fetchUsersWithActivities(): Promise<UserWithActivities[]> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      position,
      activities (
        id,
        title,
        date,
        points,
        activity_categories (
          name
        )
      )
    `,
    )
    .order('id')

  if (error) {
    throw error
  }

  return normalizeUsers(data)
}
