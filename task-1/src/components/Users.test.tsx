import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Users } from './Users'

vi.mock('../api/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}))

vi.mock('../hooks/useUsersWithActivities', () => ({
  useUsersWithActivities: vi.fn(() => ({
    data: undefined,
    isPending: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}))

describe('Users', () => {
  it('renders loading state without throwing', () => {
    render(<Users />)
    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })
})
