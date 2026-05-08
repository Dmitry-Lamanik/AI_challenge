import type { UserWithActivities } from '../types/roster'

export function totalPoints(user: UserWithActivities): number {
  return user.activities.reduce((sum, a) => sum + a.points, 0)
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }
  if (parts.length === 1) {
    const w = parts[0]
    if (w.length >= 2) return w.slice(0, 2).toUpperCase()
    if (w.length === 1) return w.toUpperCase()
  }
  return '?'
}

/** Stable tie-break: higher points first, then lower user id. */
export function sortUsersByPointsDesc(users: UserWithActivities[]): UserWithActivities[] {
  return [...users].sort((a, b) => {
    const diff = totalPoints(b) - totalPoints(a)
    if (diff !== 0) return diff
    return a.id - b.id
  })
}
