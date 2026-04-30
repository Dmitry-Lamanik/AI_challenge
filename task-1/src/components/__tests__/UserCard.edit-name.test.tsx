import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserCard } from '../UserCard'

const mutateAsync = vi.fn()

vi.mock('../../hooks/useUpdateUserName', () => ({
  useUpdateUserName: () => ({
    mutateAsync,
    isPending: false,
  }),
}))

describe('UserCard edit name success flow', () => {
  it('allows click-to-edit and saves name', async () => {
    mutateAsync.mockResolvedValue({
      id: 1,
      name: 'Alice Smith',
      position: 'Engineer',
    })

    render(
      <ul>
        <UserCard
          rank={1}
          user={{
            id: 1,
            name: 'Alice Doe',
            position: 'Engineer',
            activities: [],
          }}
        />
      </ul>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit user name' }))
    const input = screen.getByLabelText('User name')
    fireEvent.change(input, { target: { value: 'Alice Smith' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        userId: 1,
        nextName: 'Alice Smith',
        expectedCurrentName: 'Alice Doe',
      })
    })
  })
})
