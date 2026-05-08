import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserCard } from '../UserCard'

const mutateAsync = vi.fn()

vi.mock('../../hooks/useUpdateUserName', () => ({
  useUpdateUserName: () => ({
    mutateAsync,
    isPending: false,
  }),
}))

describe('UserCard name edit cancel', () => {
  it('restores original value and skips save when canceled', () => {
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
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'Temp Name' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel name edit' }))

    expect(screen.getByText('Alice Doe')).toBeInTheDocument()
    expect(mutateAsync).not.toHaveBeenCalled()
  })
})
