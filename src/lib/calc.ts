import { format, parseISO, startOfWeek, subDays, differenceInCalendarDays } from 'date-fns'
import type { DsaProblem, StudySession, Task, Pattern, JavaCollection, Difficulty } from '../types'
import { PATTERN_TARGETS, DIFFICULTY_TARGETS } from '../data/seed'

export const todayStr = () => format(new Date(), 'yyyy-MM-dd')

export function problemStats(problems: DsaProblem[]) {
  const byDiff: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
  const byPattern = new Map<Pattern, number>()
  const byCollection = new Map<JavaCollection, number>()
  const revision = problems.filter((p) => p.status === 'Need Revision')
  let timeSum = 0
  let timeCount = 0
  let weekCount = 0
  let solved = 0

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  for (const p of problems) {
    byDiff[p.difficulty]++
    byPattern.set(p.pattern, (byPattern.get(p.pattern) ?? 0) + 1)
    for (const c of p.javaCollectionsUsed ?? []) {
      byCollection.set(c, (byCollection.get(c) ?? 0) + 1)
    }
    if (p.status === 'Solved') solved++
    if (p.timeTakenMinutes > 0) {
      timeSum += p.timeTakenMinutes
      timeCount++
    }
    const d = parseISO(p.solvedDate)
    if (d >= weekStart) weekCount++
  }

  const total = problems.length
  return {
    total,
    solved,
    byDiff,
    byPattern,
    byCollection,
    revision,
    weekCount,
    avgTime: timeCount ? Math.round(timeSum / timeCount) : 0,
    patternRows: [...byPattern.entries()]
      .map(([pattern, count]) => ({
        pattern,
        count,
        target: PATTERN_TARGETS[pattern] ?? 10,
        percent: Math.round((count / (PATTERN_TARGETS[pattern] ?? 10)) * 100),
      }))
      .sort((a, b) => b.count - a.count),
    diffRows: (['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => ({
      name: d,
      value: byDiff[d],
      target: DIFFICULTY_TARGETS[d],
    })),
    collectionRows: [...byCollection.entries()]
      .map(([name, count]) => ({ name, count, percent: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count),
  }
}

/** Patterns with the lowest % of target solved = weakest. */
export function weakestPatterns(problems: DsaProblem[], limit = 4) {
  const counts = new Map<Pattern, number>()
  for (const p of problems) counts.set(p.pattern, (counts.get(p.pattern) ?? 0) + 1)
  return (Object.keys(PATTERN_TARGETS) as Pattern[])
    .map((pattern) => {
      const count = counts.get(pattern) ?? 0
      const target = PATTERN_TARGETS[pattern]
      return { pattern, count, target, percent: Math.round((count / target) * 100) }
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => a.percent - b.percent || a.count - b.count)
    .slice(0, limit)
}

export function sessionTotals(sessions: StudySession[]) {
  const total = sessions.reduce((a, s) => a + s.durationMinutes, 0)
  const byType = new Map<string, number>()
  for (const s of sessions) byType.set(s.type, (byType.get(s.type) ?? 0) + s.durationMinutes)
  const today = sessions.filter((s) => s.date === todayStr()).reduce((a, s) => a + s.durationMinutes, 0)
  return {
    totalMinutes: total,
    todayMinutes: today,
    byType: [...byType.entries()]
      .map(([type, minutes]) => ({
        type,
        minutes,
        label: { java_dsa: 'Java DSA', java_theory: 'Java Theory', cs_fundamentals: 'CS', project: 'Dev', revision: 'Revision' }[type] ?? type,
      }))
      .sort((a, b) => b.minutes - a.minutes),
  }
}

export function weekBuckets(sessions: StudySession[], weeks = 8) {
  const out: { label: string; start: Date; hours: number; problems: number }[] = []
  const now = new Date()
  const thisWeek = startOfWeek(now, { weekStartsOn: 1 })
  for (let i = weeks - 1; i >= 0; i--) {
    const start = subDays(thisWeek, i * 7)
    out.push({ label: format(start, 'd MMM'), start, hours: 0, problems: 0 })
  }
  for (const s of sessions) {
    const d = parseISO(s.date)
    const idx = out.findIndex((b) => differenceInCalendarDays(d, b.start) >= 0 && differenceInCalendarDays(d, b.start) < 7)
    if (idx >= 0) out[idx].hours += s.durationMinutes / 60
  }
  return out.map((b) => ({ ...b, hours: Math.round(b.hours * 10) / 10 }))
}

export function problemsPerWeek(problems: DsaProblem[], weeks = 8) {
  const out: { label: string; start: Date; problems: number }[] = []
  const thisWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  for (let i = weeks - 1; i >= 0; i--) {
    const start = subDays(thisWeek, i * 7)
    out.push({ label: format(start, 'd MMM'), start, problems: 0 })
  }
  for (const p of problems) {
    const d = parseISO(p.solvedDate)
    const idx = out.findIndex((b) => differenceInCalendarDays(d, b.start) >= 0 && differenceInCalendarDays(d, b.start) < 7)
    if (idx >= 0) out[idx].problems += 1
  }
  return out
}

export function last7Days(sessions: StudySession[]) {
  const out: { label: string; date: string; hours: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    const key = format(d, 'yyyy-MM-dd')
    const minutes = sessions.filter((s) => s.date === key).reduce((a, s) => a + s.durationMinutes, 0)
    out.push({ label: format(d, 'EEE'), date: key, hours: Math.round((minutes / 60) * 10) / 10 })
  }
  return out
}

export function taskCompletion(tasks: Task[], from?: string, to?: string) {
  const scope = tasks.filter((t) => (!from || t.date >= from) && (!to || t.date <= to))
  const done = scope.filter((t) => t.completed === 1).length
  return { done, total: scope.length, percent: scope.length ? Math.round((done / scope.length) * 100) : 0 }
}

/** Radar score per pattern: % of target completed, capped at 100. */
export function radarData(problems: DsaProblem[]) {
  const keys: Pattern[] = ['Arrays', 'Trees', 'Graphs', 'DP', 'HashMap', 'Binary Search', 'Heaps', 'Two Pointers', 'Stack', 'Strings']
  const counts = new Map<Pattern, number>()
  for (const p of problems) counts.set(p.pattern, (counts.get(p.pattern) ?? 0) + 1)
  return keys.map((k) => ({
    pattern: k,
    score: Math.min(100, Math.round(((counts.get(k) ?? 0) / PATTERN_TARGETS[k]) * 100)),
    solved: counts.get(k) ?? 0,
  }))
}

/** Average solve time by week (trend line). */
export function avgTimeTrend(problems: DsaProblem[], weeks = 8) {
  const buckets = problemsPerWeek(problems, weeks)
  return buckets.map((b, i) => {
    const next = buckets[i + 1]
    const inWeek = problems.filter((p) => {
      const diff = differenceInCalendarDays(parseISO(p.solvedDate), b.start)
      return diff >= 0 && diff < 7
    })
    const avg = inWeek.length
      ? Math.round(inWeek.reduce((a, p) => a + p.timeTakenMinutes, 0) / inWeek.length)
      : 0
    return { label: b.label, minutes: avg }
  })
}
