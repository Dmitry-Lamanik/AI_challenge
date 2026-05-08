import { supabase } from './supabaseClient'
import type {
  ActivityWithCategory,
  UpdateUserNameInput,
  UpdateUserNameResult,
  UserWithActivities,
} from '../types/roster'

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

export class UserNameConflictError extends Error {
  constructor() {
    super('User name has been modified by another session.')
    this.name = 'UserNameConflictError'
  }
}

export function isUserNameConflictError(error: unknown): error is UserNameConflictError {
  return error instanceof UserNameConflictError
}

export async function updateUserName({
  userId,
  nextName,
  expectedCurrentName,
}: UpdateUserNameInput): Promise<UpdateUserNameResult> {
  const trimmedName = nextName.trim()

  const { data, error } = await supabase
    .from('users')
    .update({ name: trimmedName } as never)
    .eq('id', userId)
    .eq('name', expectedCurrentName)
    .select('id, name, position')
    .limit(1)

  if (error) {
    throw error
  }

  if (!data?.length) {
    throw new UserNameConflictError()
  }

  return data[0]
}
