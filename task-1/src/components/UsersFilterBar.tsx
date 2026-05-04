import { useId, type Dispatch, type SetStateAction } from 'react'
import {
  HEADER_FILTER_CATEGORY_OPTIONS,
  HEADER_FILTER_QUARTER_OPTIONS,
  HEADER_FILTER_YEAR_OPTIONS,
} from '../utils/rosterFilters'
import type { HeaderFilterState } from '../types/roster'
import './UsersFilterBar.css'

export type UsersFilterBarProps = {
  filters: HeaderFilterState
  onFiltersChange: Dispatch<SetStateAction<HeaderFilterState>>
}

export function UsersFilterBar({ filters, onFiltersChange }: UsersFilterBarProps) {
  const baseId = useId()
  const yearId = `${baseId}-year`
  const quarterId = `${baseId}-quarter`
  const categoryId = `${baseId}-category`
  const searchId = `${baseId}-search`

  return (
    <header className="users-filter-bar" aria-label="Roster filters">
      <div className="users-filter-bar__panel">
        <div className="users-filter-bar__row">
          <div className="users-filter-bar__field users-filter-bar__field--year">
            <select
              id={yearId}
              className="users-filter-bar__select"
              aria-label="Year"
              value={filters.year}
              onChange={(e) =>
                onFiltersChange((f) => ({
                  ...f,
                  year: e.target.value as HeaderFilterState['year'],
                }))
              }
            >
              {HEADER_FILTER_YEAR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="users-filter-bar__field users-filter-bar__field--quarter">
            <select
              id={quarterId}
              className="users-filter-bar__select"
              aria-label="Quarter"
              value={filters.quarter}
              onChange={(e) =>
                onFiltersChange((f) => ({
                  ...f,
                  quarter: e.target.value as HeaderFilterState['quarter'],
                }))
              }
            >
              {HEADER_FILTER_QUARTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="users-filter-bar__field users-filter-bar__field--category">
            <select
              id={categoryId}
              className="users-filter-bar__select"
              aria-label="Category"
              value={filters.category}
              onChange={(e) =>
                onFiltersChange((f) => ({
                  ...f,
                  category: e.target.value as HeaderFilterState['category'],
                }))
              }
            >
              {HEADER_FILTER_CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="users-filter-bar__field users-filter-bar__field--grow">
            <input
              id={searchId}
              className="users-filter-bar__search"
              type="search"
              placeholder="Search employee..."
              autoComplete="off"
              aria-label="Search employees by name"
              value={filters.searchRaw}
              onChange={(e) => onFiltersChange((f) => ({ ...f, searchRaw: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
