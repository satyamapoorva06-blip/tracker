import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

export const dShort = (d: string) => format(parseISO(d), 'd MMM')
export const dMedium = (d: string) => format(parseISO(d), 'd MMM yyyy')
export const dDay = (d: string) => format(parseISO(d), 'EEE, d MMM')
export const relative = (d: string) => formatDistanceToNowStrict(parseISO(d), { addSuffix: true })

/** 200 → "3h 20m" */
export function hm(minutes: number): string {
  const m = Math.max(0, Math.round(minutes))
  const h = Math.floor(m / 60)
  const r = m % 60
  if (h === 0) return `${r}m`
  if (r === 0) return `${h}h`
  return `${h}h ${r}m`
}

export function mmss(total: number): string {
  const s = Math.max(0, Math.floor(total))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export const pct = (a: number, b: number) => (b <= 0 ? 0 : Math.round((a / b) * 100))

export const priorityMeta: Record<string, { dot: string; label: string; color: string }> = {
  High: { dot: '🔴', label: 'High', color: '#ff4757' },
  Medium: { dot: '🟡', label: 'Medium', color: '#ffa500' },
  Low: { dot: '🟢', label: 'Low', color: '#00d4aa' },
}
