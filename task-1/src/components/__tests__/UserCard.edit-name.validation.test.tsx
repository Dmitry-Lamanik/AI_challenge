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

describe('UserCard name validation flow', () => {
  it('blocks save for empty and whitespace-only values', () => {
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
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }))

    expect(screen.getByText('Name cannot be empty.')).toBeInTheDocument()
    expect(mutateAsync).not.toHaveBeenCalled()
  })

  it('clears validation error once input becomes valid', () => {
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
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }))
    expect(screen.getByText('Name cannot be empty.')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Alice Smith' } })
    expect(screen.queryByText('Name cannot be empty.')).not.toBeInTheDocument()
  })
})
