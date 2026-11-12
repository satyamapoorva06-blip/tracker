import { useMemo } from 'react'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
} from 'recharts'
import { Flame, TrendingUp, Award, Target, CalendarCheck2, Check } from 'lucide-react'
import clsx from 'clsx'
import { useStore, useStreak } from '../store/useStore'
import { Card, ProgressBar, SectionTitle, Stat } from '../components/ui/Primitives'
import AppBar from '../components/AppBar'
import {
  last7Days, problemStats, problemsPerWeek, radarData, sessionTotals, taskCompletion,
  weakestPatterns, avgTimeTrend,
} from '../lib/calc'
import { DIFFICULTY_COLORS, DIFFICULTY_TARGETS, TOTAL_TARGET } from '../data/seed'
import { MILESTONES } from '../data/plan'
import { hm, pct } from '../lib/format'
import type { Difficulty } from '../types'

export default function Stats() {
  const tasks = useStore((s) => s.tasks)
  const problems = useStore((s) => s.problems)
  const sessions = useStore((s) => s.sessions)
  const streaks = useStore((s) => s.streaks)
  const concepts = useStore((s) => s.concepts)
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const streak = useStreak()

  const stats = useMemo(() => problemStats(problems), [problems])
  const week = useMemo(() => last7Days(sessions), [sessions])
  const perWeek = useMemo(() => problemsPerWeek(problems, 8), [problems])
  const totals = useMemo(() => sessionTotals(sessions), [sessions])
  const radar = useMemo(() => radarData(problems), [problems])
  const weak = useMemo(() => weakestPatterns(problems, 4), [problems])
  const trend = useMemo(() => avgTimeTrend(problems, 8), [problems])
  const overall = useMemo(() => taskCompletion(tasks), [tasks])
  const recent = useMemo(
    () => taskCompletion(tasks, format(subDays(new Date(), 6), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')),
    [tasks],
  )

  const phasePercent = Math.round(
    (pct(stats.total, TOTAL_TARGET) * 0.5 +
      pct(concepts.filter((c) => c.status === 'completed').length, Math.max(concepts.length, 1)) * 0.3 +
      overall.percent * 0.2),
  )

  const milestoneState = MILESTONES.map((m) => {
    let done = false
    let progress = 0
    if (m.test === 'problems' && m.target) {
      done = stats.total >= m.target
      progress = Math.min(100, Math.round((stats.total / m.target) * 100))
    } else if (m.test === 'concepts' && m.target !== undefined) {
      const cat = (['fundamentals', 'collections', 'java8'] as const)[m.target]
      const items = concepts.filter((c) => c.category === cat)
      const completed = items.filter((c) => c.status === 'completed').length
      done = items.length > 0 && completed === items.length
      progress = pct(completed, Math.max(items.length, 1))
    } else {
      done = Boolean(settings.milestones[m.label])
      progress = done ? 100 : 0
    }
    return { ...m, done, progress }
  })
  const milestonesDone = milestoneState.filter((m) => m.done).length

  // Monthly heatmap (current month, GitHub-style)
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const leadingBlanks = (getDay(monthStart) + 6) % 7 // Monday-first
  const streakMap = new Map(streaks.map((s) => [s.date, s]))
  const monthlyActive = monthDays.filter((d) => streakMap.get(format(d, 'yyyy-MM-dd'))?.active).length

  const weeklyConsistency = Math.round((streak.totalActive / Math.max(streaks.length, 1)) * 100)

  return (
    <div className="space-y-4">
      <AppBar eyebrow={format(new Date(), 'MMMM yyyy')} title="Statistics" />

      {/* Headline */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <Stat label="Problems" value={stats.total} hint={`of ${TOTAL_TARGET}`} color="#00d4aa" />
        </Card>
        <Card className="p-3">
          <Stat label="Study time" value={hm(totals.totalMinutes)} hint={`${sessions.length} sessions`} color="#f89820" />
        </Card>
        <Card className="p-3">
          <Stat label="Completion" value={`${overall.percent}%`} hint={`${overall.done}/${overall.total} tasks`} color="#7cc5ff" />
        </Card>
      </div>

      {/* Weekly overview */}
      <div>
        <SectionTitle title="This week" icon={<TrendingUp size={12} className="text-accent" />} />
        <Card className="p-3.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[11.5px] font-semibold text-muted">Study hours / day</p>
            <p className="text-[11px] font-bold text-accent">
              {week.reduce((a, w) => a + w.hours, 0).toFixed(1)}h total
            </p>
          </div>
          <div className="mt-2 h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 6, right: 4, bottom: 0, left: -22 }} barCategoryGap="26%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}h`, 'Studied']} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="hours" fill="#00d4aa" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="divider my-2.5" />
          <div className="flex items-baseline justify-between">
            <p className="text-[11.5px] font-semibold text-muted">Problems / week</p>
            <p className="text-[11px] font-bold text-java">{stats.weekCount} this week</p>
          </div>
          <div className="mt-2 h-[130px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perWeek} margin={{ top: 6, right: 8, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [`${v} problems`, 'Solved']} />
                <Line
                  type="monotone"
                  dataKey="problems"
                  stroke="#f89820"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f89820', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly heatmap */}
      <div>
        <SectionTitle title="Monthly activity" icon={<CalendarCheck2 size={12} className="text-accent" />} />
        <Card className="p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">{format(new Date(), 'MMMM yyyy')}</p>
            <p className="text-[10.5px] text-muted">
              {monthlyActive}/{monthDays.length} active days
            </p>
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-center text-[9px] font-semibold text-muted/70">
                {d}
              </span>
            ))}
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <span key={`b${i}`} />
            ))}
            {monthDays.map((d) => {
              const row = streakMap.get(format(d, 'yyyy-MM-dd'))
              const active = row?.active === 1
              const partial = !active && (row?.tasksCompleted ?? 0) > 0
              return (
                <div
                  key={d.toISOString()}
                  title={`${format(d, 'd MMM')} — ${active ? 'active' : partial ? 'partial' : 'rest'}`}
                  className="aspect-square rounded-[4px]"
                  style={{
                    background: active ? '#00d4aa' : partial ? 'rgba(0,212,170,0.22)' : 'rgba(255,255,255,0.055)',
                    boxShadow: isSameMonth(d, new Date()) && format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ? '0 0 0 1.5px #f89820'
                      : undefined,
                  }}
                />
              )
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/[0.04] p-2.5 text-center">
              <p className="text-[15px] font-extrabold">{stats.total}</p>
              <p className="text-[9.5px] uppercase tracking-wide text-muted">Problems</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5 text-center">
              <p className="text-[15px] font-extrabold">{Math.round(totals.totalMinutes / 60)}h</p>
              <p className="text-[9.5px] uppercase tracking-wide text-muted">Studied</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5 text-center">
              <p className="text-[15px] font-extrabold text-accent">{overall.percent}%</p>
              <p className="text-[9.5px] uppercase tracking-wide text-muted">Done</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Phase progress + milestones */}
      <div>
        <SectionTitle title="Phase progress" icon={<Target size={12} className="text-java" />} />
        <Card raised className="p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-caps text-muted">Phase 2</p>
              <p className="mt-1 text-[16px] font-extrabold leading-none tracking-tighter2">Java DSA Deep Dive</p>
            </div>
            <span className="metric text-[22px] text-accent">{phasePercent}%</span>
          </div>
          <ProgressBar value={phasePercent} max={100} height={6} className="mt-3" gradient />
          <p className="mt-2 text-[10px] text-muted">
            {milestonesDone} of {milestoneState.length} milestones · Month {format(new Date(), 'M')} of 12
          </p>

          <div className="mt-3.5 space-y-0.5">
            {milestoneState.map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  if (m.test === 'manual') {
                    updateSettings({ milestones: { ...settings.milestones, [m.label]: !settings.milestones[m.label] } })
                  }
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg px-1 py-[7px] text-left transition-colors active:bg-white/[0.03]"
              >
                <span
                  className={clsx(
                    'grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full border transition-colors',
                    m.done
                      ? 'border-accent bg-accent text-[#04231d]'
                      : 'border-white/18 text-transparent',
                  )}
                >
                  <Check size={10} strokeWidth={3.6} />
                </span>
                <span className={clsx('min-w-0 flex-1 text-[11.5px]', m.done ? 'text-muted' : 'font-medium text-ink')}>
                  {m.label}
                  {!m.done && m.progress > 0 && m.progress < 100 && (
                    <span className="ml-1.5 text-[9.5px] font-bold text-medium">{m.progress}%</span>
                  )}
                </span>
                {m.test === 'manual' && (
                  <span className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-muted/50">tap</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* DSA analytics */}
      <div>
        <SectionTitle title="Java DSA analytics" icon={<Award size={12} className="text-java" />} />

        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-2">
            <p className="px-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted">Difficulty split</p>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.diffRows}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={34}
                    outerRadius={56}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {stats.diffRows.map((d) => (
                      <Cell key={d.name} fill={DIFFICULTY_COLORS[d.name as Difficulty]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, n) => [`${v} problems`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-2 pb-1.5">
              {stats.diffRows.map((d) => (
                <span key={d.name} className="flex items-center gap-1 text-[9px] text-muted">
                  <i className="h-1.5 w-1.5 rounded-full" style={{ background: DIFFICULTY_COLORS[d.name as Difficulty] }} />
                  {d.name} {d.value}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-2">
            <p className="px-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted">Pattern strength</p>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="68%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="pattern" tick={{ fill: '#94a3b8', fontSize: 7.5 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.32} strokeWidth={1.6} />
                  <Tooltip formatter={(v: number) => [`${v}% of target`, 'Strength']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mt-2.5 p-3.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Weakest patterns</p>
          <div className="mt-2 space-y-2">
            {weak.map((w) => (
              <div key={w.pattern}>
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="font-semibold">{w.pattern}</span>
                  <span className="text-muted">
                    {w.count}/{w.target} · {w.percent}%
                  </span>
                </div>
                <ProgressBar
                  value={w.count}
                  max={w.target}
                  height={4}
                  className="mt-1"
                  color={w.percent < 40 ? '#ff4757' : w.percent < 75 ? '#ffa500' : '#00d4aa'}
                />
              </div>
            ))}
            {weak.length === 0 && <p className="text-[11px] text-muted">Log a few problems to see this</p>}
          </div>
        </Card>

        <Card className="mt-2.5 p-3.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Avg solve time trend</p>
            <p className="text-[11px] font-bold text-accent">{stats.avgTime} min avg</p>
          </div>
          <div className="mt-2 h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 6, right: 6, bottom: 0, left: -26 }}>
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c9bff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7c9bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v} min`, 'Avg time']} />
                <Area type="monotone" dataKey="minutes" stroke="#7c9bff" strokeWidth={2} fill="url(#timeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="mt-2.5 p-3.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Collections frequency</p>
          <div className="mt-2 space-y-1.5">
            {stats.collectionRows.slice(0, 6).map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-[92px] shrink-0 truncate font-mono text-[10.5px] text-java">{c.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-java to-medium"
                    style={{ width: `${Math.max(4, (c.count / Math.max(stats.collectionRows[0]?.count ?? 1, 1)) * 100)}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-[10.5px] font-bold">{c.count}</span>
              </div>
            ))}
            {stats.collectionRows.length === 0 && <p className="text-[11px] text-muted">No data yet</p>}
          </div>
        </Card>
      </div>

      {/* Streak analytics */}
      <div>
        <SectionTitle title="Streak analytics" icon={<Flame size={12} className="text-java" />} />
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-java/20 to-transparent p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Current streak</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-java">{streak.current}</p>
              <p className="text-[10px] text-muted">days</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-accent/16 to-transparent p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Longest streak</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-accent">{streak.longest}</p>
              <p className="text-[10px] text-muted">days</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-white/[0.04] p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Total active days</p>
              <p className="mt-0.5 text-[16px] font-extrabold">{streak.totalActive}</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Consistency</p>
              <p className="mt-0.5 text-[16px] font-extrabold text-medium">{weeklyConsistency}%</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10.5px] text-muted">
              <span>Weekly consistency score</span>
              <span className="font-bold text-ink/80">{recent.percent}% of tasks done</span>
            </div>
            <ProgressBar value={recent.percent} max={100} height={6} className="mt-1.5" color="#ffa500" />
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-muted/70">
            Targets: Easy {DIFFICULTY_TARGETS.Easy} · Medium {DIFFICULTY_TARGETS.Medium} · Hard {DIFFICULTY_TARGETS.Hard}.
            At your current pace you&apos;ll hit {TOTAL_TARGET} problems in about{' '}
            {Math.max(1, Math.ceil((TOTAL_TARGET - stats.total) / Math.max(stats.weekCount, 1)))} weeks.
          </p>
        </Card>
      </div>
    </div>
  )
}
