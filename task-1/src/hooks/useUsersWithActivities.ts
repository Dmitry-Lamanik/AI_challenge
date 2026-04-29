import { useQuery } from '@tanstack/react-query'
import { fetchUsersWithActivities } from '../api/roster'
import { isSupabaseConfigured } from '../api/supabaseClient'

export function useUsersWithActivities() {
  const enabled = isSupabaseConfigured()

  return useQuery({
    queryKey: ['users', 'roster'] as const,
    enabled,
    queryFn: fetchUsersWithActivities,
  })
}
