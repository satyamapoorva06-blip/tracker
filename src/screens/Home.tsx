import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Flame,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Timer,
  Snowflake,
  Check,
  Settings,
  ArrowUpRight,
  Target,
  Layers,
  CalendarRange,
  BookMarked,
  FolderKanban,
  Activity,
} from 'lucide-react'
import { useStore, todayKey, useStreak } from '../store/useStore'
import AppBar from '../components/AppBar'
import Logo from '../components/Logo'
import { Card, Ring, ProgressBar, SectionTitle } from '../components/ui/Primitives'
import { hm, pct } from '../lib/format'
import { problemStats, sessionTotals, taskCompletion, weakestPatterns } from '../lib/calc'
import { DIFFICULTY_TARGETS, TOTAL_TARGET, JAVA_FACTS } from '../data/seed'
import { roadmapPosition } from '../data/plan'
import CheatSheetButton from '../components/CheatSheet'
import SettingsSheet from '../components/SettingsSheet'

const FOCUS_TOPICS: Record<string, string> = {
  HashMap: 'HashMap & HashSet',
  Arrays: 'Array traversal & prefix sums',
  DP: '1D Dynamic Programming',
  Graphs: 'Graph BFS / DFS',
  Trees: 'Binary tree traversal',
  Heaps: 'PriorityQueue & heaps',
  'Two Pointers': 'Two pointers & sorted arrays',
  'Sliding Window': 'Variable sliding window',
  'Binary Search': 'Binary search on answer',
  Stack: 'Monotonic stack',
  Backtracking: 'Backtracking & subsets',
  'Union Find': 'Disjoint Set Union',
  Strings: 'String builders & char arrays',
  Intervals: 'Interval merging',
  Greedy: 'Greedy scheduling',
  Trie: 'Trie prefix trees',
  LinkedList: 'Linked list pointers',
  'Bit Manipulation': 'Bit tricks & masks',
  Math: 'Number theory basics',
  BST: 'Binary search trees',
  Queue: 'Queues & deques',
  Sorting: 'Sorting comparators',
}

export default function Home() {
  const navigate = useNavigate()
  const tasks = useStore((s) => s.tasks)
  const problems = useStore((s) => s.problems)
  const sessions = useStore((s) => s.sessions)
  const streaks = useStore((s) => s.streaks)
  const concepts = useStore((s) => s.concepts)
  const settings = useStore((s) => s.settings)
  const toggleTask = useStore((s) => s.toggleTask)
  const applyFreeze = useStore((s) => s.applyFreeze)
  const updateSettings = useStore((s) => s.updateSettings)
  const streak = useStreak()
  const [factIndex, setFactIndex] = useState(() => new Date().getDate() % JAVA_FACTS.length)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const key = todayKey()
  const dayTasks = useMemo(() => tasks.filter((t) => t.date === key), [tasks, key])
  const done = dayTasks.filter((t) => t.completed === 1).length
  const stats = useMemo(() => problemStats(problems), [problems])
  const sessionStats = useMemo(() => sessionTotals(sessions), [sessions])
  const todayMinutes = useMemo(
    () => sessions.filter((s) => s.date === key).reduce((a, s) => a + s.durationMinutes, 0),
    [sessions, key],
  )
  const roadmap = useMemo(() => roadmapPosition(stats.total), [stats.total])
  const weak = useMemo(() => weakestPatterns(problems, 1)[0], [problems])

  const heat = useMemo(() => {
    const map = new Map(streaks.map((s) => [s.date, s.active]))
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i)
      const k = format(d, 'yyyy-MM-dd')
      return { k, active: Boolean(map.get(k)), label: format(d, 'd MMM') }
    })
  }, [streaks])

  const completedConcepts = concepts.filter((c) => c.status === 'completed').length
  const overall = taskCompletion(tasks.filter((t) => t.date >= format(subDays(new Date(), 7), 'yyyy-MM-dd')))
  const previewTasks = [...dayTasks].sort((a, b) => a.completed - b.completed || a.id! - b.id!).slice(0, 4)
  const focusPattern =
    weak?.pattern ?? Array.from(stats.byPattern.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'HashMap'
  const focusTopic = FOCUS_TOPICS[focusPattern] ?? focusPattern
  const heatActive = heat.filter((h) => h.active).length
  const dayPercent = pct(done, Math.max(dayTasks.length, 1))
  const allDone = dayTasks.length > 0 && done === dayTasks.length

  const quickStats = [
    {
      to: '/dsa',
      icon: <Target size={12} />,
      label: 'Java DSA',
      value: `${stats.total}`,
      suffix: `/${TOTAL_TARGET}`,
      color: '#f89820',
      bar: { value: stats.total, max: TOTAL_TARGET },
      hint: `${pct(stats.total, TOTAL_TARGET)}% of target`,
    },
    {
      to: '/tasks',
      icon: <CalendarRange size={12} />,
      label: 'Roadmap',
      value: `P${roadmap.phase}`,
      suffix: ` · M${roadmap.month}`,
      color: '#a78bfa',
      bar: { value: roadmap.month, max: 12 },
      hint: `${roadmap.phaseTitle} · W${roadmap.week}`,
    },
    {
      to: '/java',
      icon: <BookMarked size={12} />,
      label: 'Java theory',
      value: `${completedConcepts}`,
      suffix: `/${concepts.length}`,
      color: '#00d4aa',
      bar: { value: completedConcepts, max: Math.max(concepts.length, 1) },
      hint: `${pct(completedConcepts, concepts.length)}% mastered`,
    },
    {
      to: '/stats',
      icon: <FolderKanban size={12} />,
      label: 'Projects',
      value: '2',
      suffix: '/3',
      color: '#7cc5ff',
      bar: { value: 2, max: 3 },
      hint: '1 in progress',
    },
  ]

  return (
    <div className="space-y-5">
      <AppBar
        eyebrow={format(new Date(), 'EEEE, d MMMM')}
        title={
          <span className="flex items-center gap-2">
            <Logo size={26} className="shrink-0" />
            JavaPrepTracker
          </span>
        }
        actions={
          <>
            <CheatSheetButton compact />
            <button onClick={() => setSettingsOpen(true)} className="icon-btn" aria-label="Settings">
              <Settings size={16} />
            </button>
          </>
        }
      />

      {/* ── Hero: streak + today ─────────────────────────────────────── */}
      <Card raised hairline className="overflow-hidden">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-[0.22] blur-[46px]"
          style={{ background: 'radial-gradient(circle,#f89820 0%,transparent 70%)' }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

        <div className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-caps text-java">
                <Flame size={12} strokeWidth={2.6} />
                Current streak
              </div>
              <div className="mt-1.5 flex items-end gap-2">
                <span className="metric text-[40px] leading-[0.86]">
                  {streak.current}
                </span>
                <span className="pb-1 text-[13px] font-semibold text-muted">
                  {streak.current === 1 ? 'day' : 'days'}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted">
                Best <span className="font-bold text-ink-dim">{streak.longest} days</span>
                <span className="mx-1.5 text-muted/30">·</span>
                <span className="font-bold text-ink-dim">{streak.totalActive}</span> active days
              </p>
            </div>

            <Ring value={heatActive} max={30} size={78} stroke={7} color="#f89820">
              <span className="metric text-[16px] text-java">{heatActive}</span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-muted">of 30</span>
            </Ring>
          </div>

          {streak.current === 0 && (
            <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-java/25 bg-java/[0.07] px-3 py-2.5">
              <Flame size={14} className="shrink-0 text-java" />
              <p className="text-[11.5px] font-semibold text-java/95">Start your streak today — finish one task.</p>
            </div>
          )}

          {/* 30-day activity strip */}
          <div className="relative mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                Last 30 days
              </span>
              <span className="text-[9.5px] text-muted/70">30 days ago → today</span>
            </div>
            <div className="flex gap-[3px]">
              {heat.map((h, i) => (
                <motion.div
                  key={h.k}
                  title={`${h.label} — ${h.active ? 'active' : 'missed'}`}
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.008, ease: [0.2, 0.9, 0.2, 1] }}
                  className="h-6 flex-1 rounded-[3px]"
                  style={{
                    background: h.active
                      ? `rgba(0,212,170,${0.42 + (i / 30) * 0.58})`
                      : 'rgba(255,255,255,0.055)',
                  }}
                />
              ))}
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <span className="h-2 w-2 rounded-[2px] bg-accent" /> Active
                <span className="ml-1.5 h-2 w-2 rounded-[2px] bg-white/10" /> Missed
              </span>
              <button
                onClick={() => applyFreeze(key)}
                disabled={!streak.freezeAvailable}
                className="flex items-center gap-1 text-[10px] font-semibold disabled:opacity-35"
                style={{ color: streak.freezeAvailable ? '#7cc5ff' : '#64748b' }}
              >
                <Snowflake size={10.5} />
                {streak.freezeAvailable ? 'Streak freeze available' : 'Freeze used this week'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Today's progress ────────────────────────────────────────── */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Ring value={done} max={Math.max(dayTasks.length, 1)} size={104} stroke={9.5} color={allDone ? '#f89820' : '#00d4aa'}>
            <span className="metric text-[22px]">{dayPercent}%</span>
            <span className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-muted">done</span>
          </Ring>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-caps text-muted">Today</p>
              <Link to="/tasks" className="flex items-center gap-0.5 text-[11px] font-bold text-accent">
                Open plan <ChevronRight size={12} />
              </Link>
            </div>
            <p className="mt-1 text-[19px] font-extrabold leading-none tracking-tighter2">
              {done}
              <span className="text-[14px] font-semibold text-muted"> / {dayTasks.length || 0} tasks</span>
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted">
              <Timer size={12} className="text-accent" />
              <span className="font-bold text-ink-dim">{hm(todayMinutes)}</span> studied
            </div>
            <ProgressBar value={done} max={Math.max(dayTasks.length, 1)} className="mt-2.5" gradient />
            <p className="mt-1.5 text-[10px] text-muted/80">{overall.percent}% of this week&apos;s tasks complete</p>
          </div>
        </div>
      </Card>

      {/* ── Quick stats ─────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="At a glance"
          icon={<Layers size={12} />}
          action={
            <Link to="/stats" className="flex items-center gap-0.5 text-[11px] font-bold text-accent">
              Details <ArrowUpRight size={11} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-2.5">
          {quickStats.map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="card group p-3 transition-colors active:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-muted">
                  <span style={{ color: q.color }}>{q.icon}</span>
                  {q.label}
                </span>
                <ChevronRight size={12} className="text-muted/40 transition-transform group-active:translate-x-0.5" />
              </div>
              <p className="metric mt-2 text-[20px]">
                {q.value}
                <span className="text-[12px] font-bold text-muted">{q.suffix}</span>
              </p>
              <ProgressBar value={q.bar.value} max={q.bar.max} color={q.color} height={3} className="mt-2" />
              <p className="mt-1.5 truncate text-[9.5px] text-muted/85">{q.hint}</p>
            </Link>
          ))}
        </div>

        {/* CS fundamentals — interactive strip */}
        <button
          onClick={() =>
            updateSettings({
              csSubjects: {
                DBMS: ((settings.csSubjects.DBMS + 1) % 3) as 0 | 1 | 2,
                OS: settings.csSubjects.OS,
                CN: settings.csSubjects.CN,
              },
            })
          }
          className="card mt-2.5 flex w-full items-center justify-between gap-3 p-3 text-left"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-muted">
              <BookMarked size={12} className="text-violet" /> CS fundamentals
            </p>
            <p className="mt-1 text-[10px] text-muted/70">Tap to cycle DBMS readiness</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {(['DBMS', 'OS', 'CN'] as const).map((sub) => {
              const v = settings.csSubjects[sub]
              const color = v === 2 ? '#00d4aa' : v === 1 ? '#ffa500' : '#64748b'
              return (
                <span
                  key={sub}
                  className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-bold"
                  style={{ background: `${color}14`, border: `1px solid ${color}30`, color: '#c3cede' }}
                >
                  {sub}
                  <span style={{ color }}>{v === 2 ? '✓' : v === 1 ? '◐' : '○'}</span>
                </span>
              )
            })}
          </div>
        </button>
      </div>

      {/* ── Today's Java focus ──────────────────────────────────────── */}
      <div>
        <SectionTitle title="Today's focus" icon={<BookOpen size={12} className="text-java" />} />
        <Card hairline className="overflow-hidden p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.09em] text-java">Java topic</p>
              <h3 className="mt-1 text-[16px] font-extrabold leading-snug text-ink">{focusTopic}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="chip border border-java/28 bg-java/10 text-java">{focusPattern}</span>
                <span className="chip-soft">Target 3 problems</span>
              </div>
            </div>
            <div className="shrink-0 rounded-xl border border-java/20 bg-java/10 px-2.5 py-2 text-center">
              <div className="metric text-[18px] text-java">{weak?.count ?? 0}</div>
              <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.08em] text-muted">solved</div>
            </div>
          </div>
          <div className="mt-3.5 flex gap-2">
            <Link to="/dsa" className="btn-java flex-1 text-[12px]">
              Log problems
            </Link>
            <CheatSheetButton />
          </div>
        </Card>
      </div>

      {/* ── Tasks preview ───────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="Today's tasks"
          icon={<Check size={12} />}
          action={
            <Link to="/tasks" className="flex items-center gap-0.5 text-[11px] font-bold text-accent">
              View all <ChevronRight size={11} />
            </Link>
          }
        />
        <Card className="overflow-hidden">
          {previewTasks.length === 0 && (
            <div className="px-4 py-7 text-center">
              <p className="text-[13px] font-semibold">Nothing planned for today</p>
              <p className="mt-1 text-[11.5px] text-muted">Load the roadmap plan to get started.</p>
              <button className="btn-primary mt-3 text-xs" onClick={() => navigate('/tasks')}>
                Load today&apos;s Java plan
              </button>
            </div>
          )}

          {previewTasks.map((t) => {
            const isDone = t.completed === 1
            return (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id!)}
                className="flex w-full items-center gap-3 border-b border-white/[0.045] px-4 py-3 text-left last:border-0 active:bg-white/[0.03]"
              >
                <span
                  className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border transition-colors ${
                    isDone ? 'border-accent bg-accent text-[#04231d]' : 'border-white/20'
                  }`}
                >
                  {isDone && <Check size={12} strokeWidth={3.2} />}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-[12.5px] ${
                    isDone ? 'text-muted line-through decoration-muted/40' : 'text-ink'
                  }`}
                >
                  {t.title}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-muted tabular">{t.estimatedMinutes}m</span>
              </button>
            )
          })}

          {previewTasks.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[10px] text-muted">
                <span className="font-bold text-ink-dim">{done}</span>/{dayTasks.length} complete
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-accent">
                <Activity size={10.5} /> {new Set(dayTasks.map((t) => t.category)).size} categories
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* ── Daily fact ──────────────────────────────────────────────── */}
      <Card onClick={() => setFactIndex((i) => (i + 1) % JAVA_FACTS.length)} className="p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-java">
            <GraduationCap size={12} /> Daily Java fact
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted/70">tap for next</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink/90">{JAVA_FACTS[factIndex]}</p>
      </Card>

      {/* ── Footer meta ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.045] px-3.5 py-2.5">
        <span className="text-[10.5px] text-muted">
          Total study <span className="font-bold text-ink-dim">{hm(sessionStats.totalMinutes)}</span>
        </span>
        <Link to="/widget" className="text-[10.5px] font-semibold text-muted/80">
          Home-screen widget
        </Link>
      </div>
      <p className="pb-1 text-center text-[9.5px] text-muted/50">
        Targets — Easy {DIFFICULTY_TARGETS.Easy} · Medium {DIFFICULTY_TARGETS.Medium} · Hard{' '}
        {DIFFICULTY_TARGETS.Hard}
      </p>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
