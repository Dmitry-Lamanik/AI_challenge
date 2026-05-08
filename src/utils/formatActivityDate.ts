/** Formats an ISO date string as "31-Dec-2025" (short English month). */
export function formatActivityDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleString('en-GB', { month: 'short' })
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}
