import type { UserWithActivities } from '../types/roster'
import { initialsFromName, totalPoints } from '../utils/rosterLeaderboard'
import './WinnersPodium.css'

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.9 7.3L22 9.3l-5.8 5.1L18.2 22 12 18.2 5.8 22l2-7.6L2 9.3l7.1-.4L12 2z"
      />
    </svg>
  )
}

function PodiumPlace({
  place,
  user,
  variant,
}: {
  place: 1 | 2 | 3
  user: UserWithActivities
  variant: 'gold' | 'silver' | 'bronze'
}) {
  const score = totalPoints(user)
  const initials = initialsFromName(user.name)

  return (
    <div className={`winners-podium__column winners-podium__column--${place}`}>
      <div className="winners-podium__upper">
        <div className={`winners-podium__avatar-wrap winners-podium__avatar-wrap--${variant}`}>
          <div className="winners-podium__avatar" aria-hidden="true">
            {initials}
          </div>
          <span className={`winners-podium__badge winners-podium__badge--${variant}`}>{place}</span>
        </div>
        <p className="winners-podium__name">{user.name}</p>
        <p className="winners-podium__position">{user.position}</p>
        <div className={`winners-podium__score winners-podium__score--${variant}`}>
          <StarIcon className="winners-podium__star" />
          <span className="winners-podium__score-value">{score}</span>
        </div>
      </div>
      <div className={`winners-podium__block winners-podium__block--${place}`} aria-hidden="true">
        <span className="winners-podium__block-num">{place}</span>
      </div>
    </div>
  )
}

export type WinnersPodiumProps = {
  first: UserWithActivities
  second?: UserWithActivities
  third?: UserWithActivities
}

export function WinnersPodium({ first, second, third }: WinnersPodiumProps) {
  const layout =
    second === undefined && third === undefined ? 'single' : third === undefined ? 'two' : 'triple'

  return (
    <section className="winners-podium" aria-label="Top three by total points">
      <div className={`winners-podium__grid winners-podium__grid--${layout}`} role="list">
        {layout === 'single' ? (
          <div className="winners-podium__slot winners-podium__slot--1" role="listitem">
            <PodiumPlace place={1} user={first} variant="gold" />
          </div>
        ) : null}

        {layout === 'two' && second ? (
          <>
            <div className="winners-podium__slot winners-podium__slot--2" role="listitem">
              <PodiumPlace place={2} user={second} variant="silver" />
            </div>
            <div className="winners-podium__slot winners-podium__slot--1" role="listitem">
              <PodiumPlace place={1} user={first} variant="gold" />
            </div>
          </>
        ) : null}

        {layout === 'triple' && second && third ? (
          <>
            <div className="winners-podium__slot winners-podium__slot--2" role="listitem">
              <PodiumPlace place={2} user={second} variant="silver" />
            </div>
            <div className="winners-podium__slot winners-podium__slot--1" role="listitem">
              <PodiumPlace place={1} user={first} variant="gold" />
            </div>
            <div className="winners-podium__slot winners-podium__slot--3" role="listitem">
              <PodiumPlace place={3} user={third} variant="bronze" />
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
