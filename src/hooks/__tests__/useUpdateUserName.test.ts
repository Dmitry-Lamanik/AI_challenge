import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserNameConflictError, updateUserName } from '../../api/roster'
import type { UserWithActivities } from '../../types/roster'
import { createTestQueryClient } from '../../test/queryTestUtils'
import { useUpdateUserName } from '../useUpdateUserName'
import { usersRosterQueryKey } from '../useUsersWithActivities'

vi.mock('../../api/roster', async () => {
  const actual = await vi.importActual<typeof import('../../api/roster')>('../../api/roster')
  return {
    ...actual,
    updateUserName: vi.fn(),
  }
})

describe('useUpdateUserName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates cached roster user on success', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const initialUsers: UserWithActivities[] = [
      { id: 1, name: 'Alice Doe', position: 'Engineer', activities: [] },
      { id: 2, name: 'Bob Doe', position: 'Designer', activities: [] },
    ]
    queryClient.setQueryData(usersRosterQueryKey, initialUsers)

    vi.mocked(updateUserName).mockResolvedValue({
      id: 1,
      name: 'Alice Smith',
      position: 'Engineer',
    })

    const { result } = renderHook(() => useUpdateUserName(), { wrapper })

    result.current.mutate({
      userId: 1,
      nextName: 'Alice Smith',
      expectedCurrentName: 'Alice Doe',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const cached = queryClient.getQueryData<UserWithActivities[]>(usersRosterQueryKey)
    expect(cached?.[0].name).toBe('Alice Smith')
    expect(cached?.[1].name).toBe('Bob Doe')
  })

  it('surfaces conflict errors without overwriting cache', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const initialUsers: UserWithActivities[] = [{ id: 1, name: 'Alice Doe', position: 'Engineer', activities: [] }]
    queryClient.setQueryData(usersRosterQueryKey, initialUsers)

    vi.mocked(updateUserName).mockRejectedValue(new UserNameConflictError())

    const { result } = renderHook(() => useUpdateUserName(), { wrapper })

    result.current.mutate({
      userId: 1,
      nextName: 'Alice Smith',
      expectedCurrentName: 'Alice Doe',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const cached = queryClient.getQueryData<UserWithActivities[]>(usersRosterQueryKey)
    expect(cached?.[0].name).toBe('Alice Doe')
  })
})
