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

describe('UserCard name edit dismiss behavior', () => {
  it('discards unsaved draft when activities panel is closed', () => {
    render(
      <ul>
        <UserCard
          rank={1}
          user={{
            id: 1,
            name: 'Alice Doe',
            position: 'Engineer',
            activities: [{ id: 10, title: 'Talk', date: '2026-01-01T00:00:00.000Z', points: 2, activity_categories: null }],
          }}
        />
      </ul>,
    )

    const toggle = screen.getByRole('button', { name: 'Show activities' })
    fireEvent.click(toggle)
    fireEvent.click(screen.getByRole('button', { name: 'Edit user name' }))
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'Discard Me' } })
    fireEvent.click(screen.getByRole('button', { name: 'Hide activities' }))

    fireEvent.click(screen.getByRole('button', { name: 'Edit user name' }))
    expect(screen.getByLabelText('User name')).toHaveValue('Alice Doe')
  })
})
