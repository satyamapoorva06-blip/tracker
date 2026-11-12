import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format, subDays, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { Flame, ChevronRight, BookOpen, Layers, GraduationCap, Hammer, Timer, Sparkles, Snowflake, CheckCircle2, Circle } from 'lucide-react'
import { useStore, todayKey, useStreak } from '../store/useStore'
import { Card, Ring, ProgressBar, SectionTitle } from '../components/ui/Primitives'
import { hm, pct } from '../lib/format'
import { problemStats, sessionTotals, taskCompletion, weakestPatterns } from '../lib/calc'
import { DIFFICULTY_TARGETS, TOTAL_TARGET, JAVA_FACTS } from '../data/seed'
import { roadmapPosition } from '../data/plan'
import CheatSheetButton from '../components/CheatSheet'
import SettingsSheet from '../components/SettingsSheet'
import { Settings } from 'lucide-react'

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

  const csConcepts = concepts.filter((c) => c.category === 'collections')
  const completedConcepts = concepts.filter((c) => c.status === 'completed').length
  const overall = taskCompletion(tasks.filter((t) => t.date >= format(subDays(new Date(), 7), 'yyyy-MM-dd')))
  const previewTasks = [...dayTasks].sort((a, b) => a.completed - b.completed || a.id! - b.id!).slice(0, 4)
  const focusPattern = weak?.pattern ?? Array.from(stats.byPattern.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'HashMap'
  const focusTopic = ({
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
  } as Record<string, string>)[focusPattern] ?? focusPattern

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-java/15 text-xl shadow-[0_6px_18px_-8px_rgba(248,152,32,0.7)]">
            ☕
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {format(new Date(), 'EEEE')}
            </p>
            <h1 className="text-[17px] font-extrabold leading-tight">JavaPrepTracker</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CheatSheetButton compact />
          <button
            onClick={() => setSettingsOpen(true)}
            className="tap rounded-xl bg-white/[0.06] px-3 text-muted hover:text-ink"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Streak card */}
      <Card className="relative overflow-hidden p-4">
        <div
          className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-30 blur-2xl"
          style={{ background: 'radial-gradient(circle,#f89820 0%,transparent 70%)' }}
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="grid h-14 w-14 place-items-center rounded-2xl bg-java/12"
              animate={streak.current > 0 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame size={30} className="text-java" fill="rgba(248,152,32,0.25)" />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[30px] font-extrabold leading-none tracking-tight">
                  {streak.current > 0 ? `Day ${streak.current}` : 'Day 0'}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted">
                Longest streak: <span className="font-bold text-ink/80">{streak.longest} days</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">30-day</div>
            <div className="text-sm font-extrabold text-accent">
              {heat.filter((h) => h.active).length}
              <span className="text-[11px] font-semibold text-muted">/30</span>
            </div>
          </div>
        </div>

        {streak.current === 0 && (
          <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-java/25 bg-java/[0.07] px-3 py-2.5">
            <Sparkles size={15} className="shrink-0 text-java" />
            <p className="text-[12px] font-semibold text-java/95">Start your streak today! ☕</p>
          </div>
        )}

        {/* 30-day heatmap */}
        <div className="relative mt-3.5">
          <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
            {heat.map((h) => (
              <motion.div
                key={h.k}
                title={`${h.label} — ${h.active ? 'active' : 'missed'}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, delay: heat.indexOf(h) * 0.008 }}
                className="aspect-square rounded-[4px]"
                style={{
                  background: h.active ? '#00d4aa' : 'rgba(255,255,255,0.06)',
                  boxShadow: h.active ? '0 0 8px rgba(0,212,170,0.25)' : 'none',
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-muted">30 days ago</span>
            <button
              onClick={() => applyFreeze(key)}
              disabled={!streak.freezeAvailable}
              className="flex items-center gap-1 text-[10.5px] font-semibold disabled:opacity-40"
              style={{ color: streak.freezeAvailable ? '#7c9bff' : '#64748b' }}
            >
              <Snowflake size={11} />
              {streak.freezeAvailable ? 'Freeze available (1/week)' : 'Freeze used this week'}
            </button>
          </div>
        </div>
      </Card>

      {/* Today's progress ring */}
      <Card className="flex items-center gap-4 p-4">
        <Ring value={done} max={Math.max(dayTasks.length, 1)} size={112} stroke={10} color={done === dayTasks.length && dayTasks.length > 0 ? '#f89820' : '#00d4aa'}>
          <span className="text-[22px] font-extrabold leading-none">{pct(done, Math.max(dayTasks.length, 1))}%</span>
          <span className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted">done</span>
        </Ring>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Today&apos;s progress</p>
          <p className="mt-0.5 text-[17px] font-extrabold leading-tight">
            {done} <span className="text-muted">of</span> {dayTasks.length || 0} tasks
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-muted">
            <Timer size={13} className="text-accent" />
            <span>
              <span className="font-bold text-ink/90">{hm(todayMinutes)}</span> studied today
            </span>
          </div>
          <ProgressBar value={done} max={Math.max(dayTasks.length, 1)} className="mt-2.5" />
          <Link to="/tasks" className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-accent">
            Open today&apos;s plan <ChevronRight size={13} />
          </Link>
        </div>
      </Card>

      {/* Quick stats — horizontal scroll */}
      <div>
        <SectionTitle title="Quick stats" />
        <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar">
          <Link to="/dsa" className="card min-w-[168px] snap-start p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              ☕ Java DSA
            </div>
            <p className="mt-1 text-[17px] font-extrabold leading-none">
              {stats.total}
              <span className="text-[12px] font-semibold text-muted">/{TOTAL_TARGET}</span>
            </p>
            <ProgressBar value={stats.total} max={TOTAL_TARGET} className="mt-2" color="#f89820" />
            <p className="mt-1.5 text-[10.5px] text-muted">{pct(stats.total, TOTAL_TARGET)}% of target</p>
          </Link>

          <Link to="/tasks" className="card min-w-[152px] snap-start p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              📅 Phase
            </div>
            <p className="mt-1 text-[17px] font-extrabold leading-none">
              Phase {roadmap.phase}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-java">
              Month {roadmap.month} · Week {roadmap.week}
            </p>
            <p className="mt-1.5 truncate text-[10.5px] text-muted">{roadmap.phaseTitle}</p>
          </Link>

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
            className="card min-w-[178px] snap-start p-3 text-left"
          >
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              📚 CS
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-extrabold">
              {(['DBMS', 'OS', 'CN'] as const).map((sub) => (
                <span key={sub} className="flex items-center gap-0.5">
                  {sub}
                  <span
                    style={{
                      color:
                        settings.csSubjects[sub] === 2
                          ? '#00d4aa'
                          : settings.csSubjects[sub] === 1
                            ? '#ffa500'
                            : '#64748b',
                    }}
                  >
                    {settings.csSubjects[sub] === 2 ? '✓' : settings.csSubjects[sub] === 1 ? '◐' : '☐'}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[10.5px] text-muted">
              Java theory{' '}
              <span className="font-bold text-ink/80">
                {completedConcepts}/{concepts.length}
              </span>
            </p>
            <p className="mt-0.5 text-[9.5px] text-muted/60">tap CS to cycle DBMS</p>
          </button>

          <Link to="/stats" className="card min-w-[148px] snap-start p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              🔨 Projects
            </div>
            <p className="mt-1 text-[17px] font-extrabold leading-none">2<span className="text-[12px] font-semibold text-muted">/3</span></p>
            <ProgressBar value={2} max={3} className="mt-2" color="#c084fc" />
            <p className="mt-1.5 text-[10.5px] text-muted">complete</p>
          </Link>
        </div>
      </div>

      {/* Today's Java focus */}
      <div>
        <SectionTitle title="Today's Java focus" icon={<BookOpen size={13} className="text-java" />} />
        <Card className="relative overflow-hidden p-[18px]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,#f89820,transparent)' }}
          />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Java topic</p>
              <h3 className="mt-0.5 text-[16px] font-extrabold leading-snug text-ink">{focusTopic}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="chip border border-java/30 bg-java/10 text-java">
                  Pattern · {focusPattern}
                </span>
                <span className="chip border border-white/10 bg-white/[0.05] text-muted">
                  Target 3 problems
                </span>
              </div>
            </div>
            <div className="shrink-0 rounded-xl bg-java/12 px-2.5 py-2 text-center">
              <div className="text-[19px] font-extrabold leading-none text-java">{weak?.count ?? 0}</div>
              <div className="text-[9px] font-semibold uppercase text-muted">solved</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/dsa" className="btn-java flex-1 text-[12.5px]">
              Log today&apos;s problems
            </Link>
            <CheatSheetButton />
          </div>
        </Card>
      </div>

      {/* Today's tasks preview */}
      <div>
        <SectionTitle
          title="Today's tasks"
          action={
            <Link to="/tasks" className="text-[11.5px] font-bold text-accent">
              View all →
            </Link>
          }
        />
        <Card className="divide-y divide-white/[0.05] overflow-hidden">
          {previewTasks.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-[13px] font-semibold">No tasks yet for today</p>
              <button className="btn-primary mt-3 text-xs" onClick={() => navigate('/tasks')}>
                Load today&apos;s Java plan
              </button>
            </div>
          )}
          {previewTasks.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTask(t.id!)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-white/[0.04]"
            >
              {t.completed === 1 ? (
                <CheckCircle2 size={20} className="shrink-0 text-accent" />
              ) : (
                <Circle size={20} className="shrink-0 text-muted/60" />
              )}
              <span
                className={`min-w-0 flex-1 truncate text-[13px] ${
                  t.completed === 1 ? 'text-muted line-through' : 'text-ink'
                }`}
              >
                {t.title}
              </span>
              <span className="shrink-0 text-[10.5px] font-semibold text-muted">{t.estimatedMinutes}m</span>
            </button>
          ))}
          {previewTasks.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[10.5px] text-muted">
                {done}/{dayTasks.length} complete · {overall.percent}% this week
              </span>
              <div className="flex items-center gap-1 text-[10.5px] font-semibold text-accent">
                <Layers size={11} /> {new Set(dayTasks.map((t) => t.category)).size} categories
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Daily Java fact */}
      <Card className="p-4" onClick={() => setFactIndex((i) => (i + 1) % JAVA_FACTS.length)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-java">
            <GraduationCap size={13} /> Daily Java fact
          </div>
          <span className="text-[9.5px] font-semibold uppercase tracking-wider text-muted">tap for next</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/90">{JAVA_FACTS[factIndex]}</p>
      </Card>

      {/* Study streak summary footer */}
      <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2 text-[11.5px] text-muted">
          <Hammer size={13} className="text-accent" />
          Active days: <span className="font-bold text-ink/80">{streak.totalActive}</span>
        </div>
        <div className="text-[11.5px] text-muted">
          Total study: <span className="font-bold text-ink/80">{hm(sessionStats.totalMinutes)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pb-1">
        <Link to="/widget" className="text-[10.5px] font-semibold text-muted">
          Home-screen widget
        </Link>
        <span className="text-muted/30">•</span>
        <span className="text-[10.5px] text-muted/60">
          Targets: Easy {DIFFICULTY_TARGETS.Easy} · Medium {DIFFICULTY_TARGETS.Medium} · Hard {DIFFICULTY_TARGETS.Hard}
        </span>
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
