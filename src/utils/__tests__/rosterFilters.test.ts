import { describe, expect, it } from 'vitest'
import type { ActivityWithCategory, HeaderFilterState, UserWithActivities } from '../../types/roster'
import {
  activityPassesHeaderFilters,
  applyRosterHeaderFilters,
  defaultHeaderFilterState,
} from '../rosterFilters'

function act(
  id: number,
  date: string,
  categoryName: string | null,
  points = 1,
): ActivityWithCategory {
  return {
    id,
    title: 'Activity',
    date,
    points,
    activity_categories: categoryName ? { name: categoryName } : null,
  }
}

function makeUser(partial: {
  id: number
  name: string
  activities?: ActivityWithCategory[]
}): UserWithActivities {
  return {
    id: partial.id,
    name: partial.name,
    position: 'Role',
    activities: partial.activities ?? [],
  }
}

describe('defaultHeaderFilterState', () => {
  it('matches FR-009 defaults', () => {
    expect(defaultHeaderFilterState()).toEqual({
      year: 'all',
      quarter: 'all',
      category: 'all',
      searchRaw: '',
    })
  })
})

describe('activityPassesHeaderFilters', () => {
  const mid2025Q2 = act(1, '2025-05-10T12:00:00.000Z', 'Education')

  it('passes when all dimensions are all', () => {
    expect(
      activityPassesHeaderFilters(mid2025Q2, {
        year: 'all',
        quarter: 'all',
        category: 'all',
      }),
    ).toBe(true)
  })

  it('filters by year 2025', () => {
    const in2024 = act(2, '2024-06-01T00:00:00.000Z', 'Education')
    expect(
      activityPassesHeaderFilters(in2024, { year: '2025', quarter: 'all', category: 'all' }),
    ).toBe(false)
    expect(
      activityPassesHeaderFilters(mid2025Q2, { year: '2025', quarter: 'all', category: 'all' }),
    ).toBe(true)
  })

  it('filters by quarter Q2 (UTC)', () => {
    const q1 = act(3, '2025-01-15T00:00:00.000Z', 'Education')
    expect(
      activityPassesHeaderFilters(q1, { year: 'all', quarter: 'Q2', category: 'all' }),
    ).toBe(false)
    expect(
      activityPassesHeaderFilters(mid2025Q2, { year: 'all', quarter: 'Q2', category: 'all' }),
    ).toBe(true)
  })

  it('with All Years, quarter applies to each activity own year', () => {
    const q2_2024 = act(4, '2024-05-01T00:00:00.000Z', 'Education')
    expect(
      activityPassesHeaderFilters(q2_2024, { year: 'all', quarter: 'Q2', category: 'all' }),
    ).toBe(true)
  })

  it('maps UI category labels to DB names', () => {
    const pub = act(5, '2025-03-01T00:00:00.000Z', 'Public Speaking')
    const uni = act(6, '2025-03-02T00:00:00.000Z', 'University Partnership')
    expect(
      activityPassesHeaderFilters(pub, {
        year: 'all',
        quarter: 'all',
        category: 'Public speaking',
      }),
    ).toBe(true)
    expect(
      activityPassesHeaderFilters(uni, {
        year: 'all',
        quarter: 'all',
        category: 'University partner',
      }),
    ).toBe(true)
    expect(
      activityPassesHeaderFilters(pub, {
        year: 'all',
        quarter: 'all',
        category: 'University partner',
      }),
    ).toBe(false)
  })

  it('fails category filter when embed is null', () => {
    const noCat = act(7, '2025-03-01T00:00:00.000Z', null)
    expect(
      activityPassesHeaderFilters(noCat, {
        year: 'all',
        quarter: 'all',
        category: 'Education',
      }),
    ).toBe(false)
  })

  it('combines year, quarter, and category with AND', () => {
    const ok = act(8, '2025-05-01T00:00:00.000Z', 'Education')
    const wrongQuarter = act(9, '2025-01-01T00:00:00.000Z', 'Education')
    const wrongCat = act(10, '2025-05-01T00:00:00.000Z', 'Public Speaking')
    const f = { year: '2025' as const, quarter: 'Q2' as const, category: 'Education' as const }
    expect(activityPassesHeaderFilters(ok, f)).toBe(true)
    expect(activityPassesHeaderFilters(wrongQuarter, f)).toBe(false)
    expect(activityPassesHeaderFilters(wrongCat, f)).toBe(false)
  })

  it('treats invalid activity date as non-matching for year/quarter', () => {
    const bad = act(11, 'not-a-date', 'Education')
    expect(
      activityPassesHeaderFilters(bad, { year: '2025', quarter: 'all', category: 'all' }),
    ).toBe(false)
    expect(
      activityPassesHeaderFilters(bad, { year: 'all', quarter: 'Q1', category: 'all' }),
    ).toBe(false)
  })
})

describe('applyRosterHeaderFilters', () => {
  const users: UserWithActivities[] = [
    makeUser({
      id: 1,
      name: 'Alice Smith',
      activities: [act(1, '2025-06-01T00:00:00.000Z', 'Education', 5)],
    }),
    makeUser({
      id: 2,
      name: 'Bob Jones',
      activities: [act(2, '2025-06-02T00:00:00.000Z', 'Public Speaking', 3)],
    }),
  ]

  it('returns all users with all activities when filters default', () => {
    const out = applyRosterHeaderFilters(users, defaultHeaderFilterState())
    expect(out).toHaveLength(2)
    expect(out[0].activities).toHaveLength(1)
    expect(out[1].activities).toHaveLength(1)
  })

  it('filters activities and keeps user with zero matches only if name matches search', () => {
    const f: HeaderFilterState = {
      ...defaultHeaderFilterState(),
      year: '2025',
      quarter: 'Q1',
      category: 'all',
      searchRaw: 'alice',
    }
    const out = applyRosterHeaderFilters(users, f)
    expect(out).toHaveLength(1)
    expect(out[0].name).toBe('Alice Smith')
    expect(out[0].activities).toHaveLength(0)
  })

  it('applies case-insensitive substring name filter', () => {
    const f = { ...defaultHeaderFilterState(), searchRaw: 'JONE' }
    const out = applyRosterHeaderFilters(users, f)
    expect(out.map((u) => u.name)).toEqual(['Bob Jones'])
  })

  it('treats whitespace-only search as no name filter', () => {
    const f = { ...defaultHeaderFilterState(), searchRaw: '   \t  ' }
    const out = applyRosterHeaderFilters(users, f)
    expect(out).toHaveLength(2)
  })

  it('trims search for matching', () => {
    const f = { ...defaultHeaderFilterState(), searchRaw: '  alice  ' }
    const out = applyRosterHeaderFilters(users, f)
    expect(out.map((u) => u.id)).toEqual([1])
  })

  it('excludes users when search matches nobody', () => {
    const f = { ...defaultHeaderFilterState(), searchRaw: 'zzz' }
    expect(applyRosterHeaderFilters(users, f)).toHaveLength(0)
  })

  it('live-search style incremental query narrows results', () => {
    const u = makeUser({
      id: 1,
      name: 'Ann Anderson',
      activities: [act(1, '2025-01-01T00:00:00.000Z', 'Education')],
    })
    expect(applyRosterHeaderFilters([u], { ...defaultHeaderFilterState(), searchRaw: 'A' })).toHaveLength(1)
    expect(applyRosterHeaderFilters([u], { ...defaultHeaderFilterState(), searchRaw: 'Anx' })).toHaveLength(0)
  })
})
