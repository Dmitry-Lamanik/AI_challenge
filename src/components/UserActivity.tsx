import type { ActivityWithCategory } from '../types/roster'
import { formatActivityDate } from '../utils/formatActivityDate'

export type UserActivityProps = {
  activity: ActivityWithCategory
}

export function UserActivity({ activity }: UserActivityProps) {
  const category = activity.activity_categories?.name ?? '—'

  return (
    <tr className="activity-row">
      <td className="activity-row__title">{activity.title}</td>
      <td className="activity-row__category-cell">
        <span className="activity-badge">{category}</span>
      </td>
      <td className="activity-row__date">{formatActivityDate(activity.date)}</td>
      <td className="activity-row__points">+{activity.points}</td>
    </tr>
  )
}
