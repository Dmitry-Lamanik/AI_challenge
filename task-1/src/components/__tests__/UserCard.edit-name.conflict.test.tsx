import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserNameConflictError } from '../../api/roster'
import { UserCard } from '../UserCard'

const mutateAsync = vi.fn()

vi.mock('../../hooks/useUpdateUserName', () => ({
  useUpdateUserName: () => ({
    mutateAsync,
    isPending: false,
  }),
}))

describe('UserCard conflict handling', () => {
  it('shows conflict message when save detects stale name', async () => {
    mutateAsync.mockRejectedValue(new UserNameConflictError())

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
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'Alice Smith' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }))

    await waitFor(() => {
      expect(screen.getByText('Name was updated elsewhere. Reopen this card and try again.')).toBeInTheDocument()
    })
  })
})
