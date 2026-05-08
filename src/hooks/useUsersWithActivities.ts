import { useQuery } from '@tanstack/react-query'
import { fetchUsersWithActivities } from '../api/roster'
import { isSupabaseConfigured } from '../api/supabaseClient'

export const usersRosterQueryKey = ['users', 'roster'] as const

export function useUsersWithActivities() {
  const enabled = isSupabaseConfigured()

  return useQuery({
    queryKey: usersRosterQueryKey,
    enabled,
    queryFn: fetchUsersWithActivities,
  })
}
