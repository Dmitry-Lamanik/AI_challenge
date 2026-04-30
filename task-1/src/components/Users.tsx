import { useMemo } from 'react'
import { useUsersWithActivities } from '../hooks/useUsersWithActivities'
import { isSupabaseConfigured } from '../api/supabaseClient'
import { sortUsersByPointsDesc } from '../utils/rosterLeaderboard'
import { UserCard } from './UserCard'
import { WinnersPodium } from './WinnersPodium'
import './Users.css'

export function Users() {
  const configured = isSupabaseConfigured()
  const { data: users, isPending, isError, error, refetch } = useUsersWithActivities()

  const ranked = useMemo(
    () => (users?.length ? sortUsersByPointsDesc(users) : []),
    [users],
  )

  if (!configured) {
    return (
      <section className="users users--error" role="status">
        <p>Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env</p>
      </section>
    )
  }

  if (isPending) {
    return (
      <section className="users users--loading" aria-busy="true">
        <p>Loading users…</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="users users--error" role="alert">
        <p>{error instanceof Error ? error.message : 'Failed to load users.'}</p>
        <button type="button" className="users__retry" onClick={() => void refetch()}>
          Retry
        </button>
      </section>
    )
  }

  if (!users?.length) {
    return (
      <section className="users users--empty">
        <p>No users found. Run the database seed if this project uses demo data.</p>
      </section>
    )
  }

  const first = ranked[0]
  const second = ranked[1]
  const third = ranked[2]

  return (
    <section className="users" aria-label="Users list">
      {first ? (
        <WinnersPodium first={first} second={second} third={third} />
      ) : null}
      <ul className="users__list">
        {ranked.map((user, index) => (
          <UserCard key={user.id} user={user} rank={index + 1} />
        ))}
      </ul>
    </section>
  )
}
