import { useId, useMemo, useState } from 'react'
import { isUserNameConflictError } from '../api/roster'
import { useUpdateUserName } from '../hooks/useUpdateUserName'
import type { UserWithActivities } from '../types/roster'
import { UserActivity } from './UserActivity'
import { USER_NAME_EDIT_LABELS, USER_NAME_EDIT_MESSAGES } from './userNameEdit.constants'
import { initialsFromName, totalPoints } from '../utils/rosterLeaderboard'
import './UserCard.css'

/** Display order for known categories (matches common roster layout). */
const CATEGORY_METRIC_ORDER = ['Public Speaking', 'Education', 'University Partnership'] as const

function activityCountsByCategory(user: UserWithActivities): Map<string, number> {
  const map = new Map<string, number>()
  for (const a of user.activities) {
    const name = a.activity_categories?.name ?? 'Unknown'
    map.set(name, (map.get(name) ?? 0) + 1)
  }
  return map
}

/** Categories with at least one activity, ordered for display. */
function categoryMetricsWithCounts(user: UserWithActivities): { name: string; count: number }[] {
  const counts = activityCountsByCategory(user)
  const known = new Set<string>(CATEGORY_METRIC_ORDER)
  const ordered: { name: string; count: number }[] = []
  for (const name of CATEGORY_METRIC_ORDER) {
    const c = counts.get(name) ?? 0
    if (c > 0) ordered.push({ name, count: c })
  }
  const extras = [...counts.entries()]
    .filter(([name, c]) => c > 0 && !known.has(name))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }))
  return [...ordered, ...extras]
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 9.25L12 5.5l8.5 3.75L12 13 3.5 9.25z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 10.7v3.05C6.75 15.55 9.12 17 12 17s5.25-1.45 5.25-3.25V10.7"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.5 10.1v4.4"
      />
    </svg>
  )
}

function PublicSpeakingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 4.5h16.5M6 4.5v8.25h12V4.5M12 12.75v6M8.25 18.75h7.5M6 8.25h12"
      />
    </svg>
  )
}

/** Building / partnership — outline columns + roof */
function UniversityPartnershipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="11" cy="13" r="1.5" fill="currentColor" />
      <circle cx="21" cy="13" r="1.5" fill="currentColor" />
      <path
        d="M10 20c1.5 3 4 4.5 6 4.5s4.5-1.5 6-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GenericCategoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  )
}

function CategoryMetricIcon({ categoryName, className }: { categoryName: string; className?: string }) {
  switch (categoryName) {
    case 'University Partnership':
      return <UniversityPartnershipIcon className={className} />
    case 'Education':
      return <GraduationCapIcon className={`${className ?? ''} user-card__metric-icon--education`.trim()} />
    case 'Public Speaking':
      return <PublicSpeakingIcon className={className} />
    default:
      return <GenericCategoryIcon className={className} />
  }
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.9 7.3L22 9.3l-5.8 5.1L18.2 22 12 18.2 5.8 22l2-7.6L2 9.3l7.1-.4L12 2z"
      />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9l6 6 6-6"
      />
    </svg>
  )
}

export type UserCardProps = {
  user: UserWithActivities
  /** 1-based display index in the list */
  rank: number
}

export function UserCard({ user, rank }: UserCardProps) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [initialName, setInitialName] = useState(user.name)
  const [draftName, setDraftName] = useState(user.name)
  const [editError, setEditError] = useState<string | null>(null)
  const { mutateAsync: updateName, isPending: isSavingName } = useUpdateUserName()
  const points = totalPoints(user)
  const activityCount = user.activities.length

  const categoryMetrics = useMemo(() => categoryMetricsWithCounts(user), [user])
  const trimmedDraftName = draftName.trim()

  function openNameEditor() {
    if (isSavingName) return
    setInitialName(user.name)
    setDraftName(user.name)
    setEditError(null)
    setIsEditingName(true)
  }

  function cancelNameEditing() {
    setDraftName(initialName)
    setEditError(null)
    setIsEditingName(false)
  }

  async function saveNameEdit() {
    if (isSavingName) return

    if (!trimmedDraftName) {
      setEditError(USER_NAME_EDIT_MESSAGES.empty)
      return
    }

    if (trimmedDraftName === initialName.trim()) {
      cancelNameEditing()
      return
    }

    try {
      await updateName({
        userId: user.id,
        nextName: trimmedDraftName,
        expectedCurrentName: initialName,
      })
      setEditError(null)
      setIsEditingName(false)
    } catch (error) {
      if (isUserNameConflictError(error)) {
        setEditError(USER_NAME_EDIT_MESSAGES.conflict)
        return
      }

      setEditError(USER_NAME_EDIT_MESSAGES.generic)
    }
  }

  function handleNameInputChange(value: string) {
    setDraftName(value)
    if (editError && value.trim()) {
      setEditError(null)
    }
  }

  function handleToggleActivities() {
    setExpanded((prev) => {
      const next = !prev
      if (!next && isEditingName) {
        cancelNameEditing()
      }
      return next
    })
  }

  return (
    <li className={`user-card${expanded ? ' user-card--expanded' : ''}`}>
      <div className="user-card__header">
        <div className="user-card__primary">
          <span className="user-card__rank" aria-hidden="true">
            {rank}
          </span>

          <div className="user-card__avatar" aria-hidden="true">
            {initialsFromName(user.name)}
          </div>

          <div className="user-card__identity">
            {isEditingName ? (
              <div className="user-card__name-edit" role="group" aria-label="User name edit form">
                <label className="user-card__name-label" htmlFor={`name-input-${panelId}`}>
                  {USER_NAME_EDIT_LABELS.input}
                </label>
                <input
                  id={`name-input-${panelId}`}
                  className="user-card__name-input"
                  value={draftName}
                  onChange={(event) => handleNameInputChange(event.target.value)}
                  disabled={isSavingName}
                  aria-invalid={editError === USER_NAME_EDIT_MESSAGES.empty}
                />
                <div className="user-card__name-actions">
                  <button
                    type="button"
                    className="user-card__name-save"
                    onClick={() => void saveNameEdit()}
                    disabled={isSavingName}
                  >
                    {isSavingName ? 'Saving...' : USER_NAME_EDIT_LABELS.saveAction}
                  </button>
                  <button
                    type="button"
                    className="user-card__name-cancel"
                    onClick={cancelNameEditing}
                    disabled={isSavingName}
                  >
                    {USER_NAME_EDIT_LABELS.cancelAction}
                  </button>
                </div>
                {editError ? (
                  <p
                    className="user-card__name-error"
                    role={editError === USER_NAME_EDIT_MESSAGES.conflict ? 'alert' : 'status'}
                  >
                    {editError}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="user-card__name-row">
                <h2 className="user-card__name">{user.name}</h2>
                <button
                  type="button"
                  style={{ display: 'none' }}
                  className="user-card__name-edit-trigger"
                  onClick={openNameEditor}
                  aria-label={USER_NAME_EDIT_LABELS.editAction}
                >
                  Edit
                </button>
              </div>
            )}
            <p className="user-card__position">{user.position}</p>
          </div>
        </div>

        <div className="user-card__summary">
          {categoryMetrics.length > 0 ? (
            <div className="user-card__metrics" role="group" aria-label="Activities by category">
              {categoryMetrics.map(({ name, count }) => (
                <div key={name} className="user-card__metric" title={name}>
                  <CategoryMetricIcon categoryName={name} className="user-card__metric-icon" />
                  <span className="user-card__metric-count">{count}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="user-card__divider" aria-hidden="true" />

          <div className="user-card__stats" aria-label="Total points">
            <span className="user-card__stats-label">Total</span>
            <div className="user-card__stats-row">
              <StarIcon className="user-card__star" />
              <span className="user-card__stats-value">{points}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="user-card__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? 'Hide activities' : 'Show activities'}
          onClick={handleToggleActivities}
        >
          <ChevronIcon className="user-card__chevron" />
        </button>
      </div>

      <div
        id={panelId}
        className="user-card__activities-panel"
        hidden={!expanded}
      >
        {activityCount === 0 ? (
          <p className="user-card__activities-empty">No activities recorded.</p>
        ) : (
          <div className="user-card__activities-inner">
            <h3 className="user-card__recent-heading">Recent activity</h3>
            <div className="activity-table-wrap">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {user.activities.map((act) => (
                    <UserActivity key={act.id} activity={act} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
