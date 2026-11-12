import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flame, CheckCircle2, Timer, ArrowUpRight } from 'lucide-react'
import { useStore, todayKey, useStreak } from '../store/useStore'
import { problemStats, sessionTotals } from '../lib/calc'
import { TOTAL_TARGET } from '../data/seed'
import { hm, pct } from '../lib/format'

/** Compact home-screen style widget at /widget — 4x2 card, taps into the app. */
export default function Widget() {
  const problems = useStore((s) => s.problems)
  const tasks = useStore((s) => s.tasks)
  const sessions = useStore((s) => s.sessions)
  const streak = useStreak()
  const ready = useStore((s) => s.ready)

  const key = todayKey()
  const stats = useMemo(() => problemStats(problems), [problems])
  const dayTasks = tasks.filter((t) => t.date === key)
  const done = dayTasks.filter((t) => t.completed === 1).length
  const studied = sessions.filter((s) => s.date === key).reduce((a, s) => a + s.durationMinutes, 0)

  const cells = [
    {
      icon: '☕',
      label: 'Java DSA',
      value: ready ? `${stats.total}/${TOTAL_TARGET}` : '—',
      color: '#f89820',
      bar: ready ? pct(stats.total, TOTAL_TARGET) : 0,
    },
    {
      icon: <Flame size={13} className="text-java" />,
      label: 'Streak',
      value: ready ? `${streak.current} days` : '—',
      color: '#ffa500',
      bar: ready ? Math.min(100, (streak.current / Math.max(streak.longest, 1)) * 100) : 0,
    },
    {
      icon: <CheckCircle2 size={13} className="text-accent" />,
      label: 'Today',
      value: ready ? `${done}/${dayTasks.length} tasks` : '—',
      color: '#00d4aa',
      bar: ready ? pct(done, Math.max(dayTasks.length, 1)) : 0,
    },
    {
      icon: <Timer size={13} className="text-[#7c9bff]" />,
      label: 'Studied',
      value: ready ? hm(studied) : '—',
      color: '#7c9bff',
      bar: ready ? Math.min(100, (studied / 240) * 100) : 0,
    },
  ]

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-6">
      <Link
        to="/"
        className="group relative block overflow-hidden rounded-[28px] border border-white/[0.07] bg-surface p-4 shadow-card transition-transform active:scale-[0.985]"
        style={{ background: 'linear-gradient(150deg,#1b2a4a 0%,#16213e 55%,#131c33 100%)' }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-25 blur-2xl"
          style={{ background: 'radial-gradient(circle,#f89820 0%,transparent 70%)' }}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-java/15 text-base">☕</span>
            <div>
              <p className="text-[12px] font-extrabold leading-none">JavaPrepTracker</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                Placement prep
              </p>
            </div>
          </div>
          <ArrowUpRight size={15} className="text-muted transition-colors group-hover:text-accent" />
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-2.5">
          {cells.map((c) => (
            <div key={c.label} className="rounded-2xl bg-white/[0.045] p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-white/[0.06] text-[10px]">{c.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted">{c.label}</span>
              </div>
              <p className="mt-1.5 text-[16px] font-extrabold leading-none" style={{ color: c.color }}>
                {c.value}
              </p>
              <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full rounded-full" style={{ width: `${c.bar}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>

        <p className="relative mt-3 text-center text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Tap to open full app
        </p>
      </Link>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link to="/tasks" className="btn-ghost text-[11.5px]">Tasks</Link>
        <Link to="/dsa" className="btn-ghost text-[11.5px]">DSA</Link>
        <Link to="/stats" className="btn-ghost text-[11.5px]">Stats</Link>
      </div>
      <p className="mt-3 text-center text-[10.5px] leading-relaxed text-muted/60">
        Add <span className="font-mono text-muted">/widget</span> to your Android home screen
        <br />
        (Chrome → ⋮ → Add to Home screen) for a 2×2 view.
      </p>
    </div>
  )
}
