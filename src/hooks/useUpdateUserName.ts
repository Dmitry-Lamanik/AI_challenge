import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserName } from '../api/roster'
import type { UserWithActivities } from '../types/roster'
import { usersRosterQueryKey } from './useUsersWithActivities'

export function useUpdateUserName() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserName,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserWithActivities[] | undefined>(usersRosterQueryKey, (current) => {
        if (!current) return current
        return current.map((user) =>
          user.id === updatedUser.id
            ? {
                ...user,
                name: updatedUser.name,
                position: updatedUser.position,
              }
            : user,
        )
      })
    },
  })
}
