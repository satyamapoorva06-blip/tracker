import { useMemo, useState } from 'react'
import { format, addDays } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown, Plus, Timer, Play, Pause, RotateCcw, Wand2, Trash2, CalendarDays,
  Code2, BookOpen, Library, Hammer, NotebookPen, Coffee, type LucideIcon,
} from 'lucide-react'
import clsx from 'clsx'
import { useStore, todayKey } from '../store/useStore'
import { Card, ProgressBar, Ring, SectionTitle, Sheet } from '../components/ui/Primitives'
import TaskForm from '../components/TaskForm'
import TaskRow from '../components/TaskRow'
import { CATEGORY_META, CATEGORY_ORDER, roadmapPosition } from '../data/plan'
import { hm, mmss, pct } from '../lib/format'
import { sessionTotals } from '../lib/calc'
import type { SessionType, Task, TaskCategory } from '../types'
import CheatSheetButton from '../components/CheatSheet'
import AppBar from '../components/AppBar'

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Code2,
  BookOpen,
  Library,
  Hammer,
  NotebookPen,
}

const TIMER_TYPES: { type: SessionType; label: string }[] = [
  { type: 'java_dsa', label: 'Java DSA' },
  { type: 'java_theory', label: 'Theory' },
  { type: 'cs_fundamentals', label: 'CS' },
  { type: 'project', label: 'Dev' },
]

export default function Tasks() {
  const tasks = useStore((s) => s.tasks)
  const sessions = useStore((s) => s.sessions)
  const problems = useStore((s) => s.problems)
  const addTask = useStore((s) => s.addTask)
  const updateTask = useStore((s) => s.updateTask)
  const deleteTask = useStore((s) => s.deleteTask)
  const toggleTask = useStore((s) => s.toggleTask)
  const loadTodayPlan = useStore((s) => s.loadTodayPlan)
  const clearTodayTasks = useStore((s) => s.clearTodayTasks)
  const timer = useStore((s) => s.timer)
  const setTimer = useStore((s) => s.setTimer)
  const logSession = useStore((s) => s.logSession)
  const settings = useStore((s) => s.settings)

  const [open, setOpen] = useState<Record<string, boolean>>({
    'Java DSA': true,
    'Java Theory': false,
    'CS Fundamentals': false,
    Development: false,
    Review: false,
  })
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [defaultCategory, setDefaultCategory] = useState<TaskCategory>('Java DSA')
  const [timerOpen, setTimerOpen] = useState(false)
  const [planConfirm, setPlanConfirm] = useState(false)

  const key = todayKey()
  const dayTasks = useMemo(() => tasks.filter((t) => t.date === key), [tasks, key])
  const done = dayTasks.filter((t) => t.completed === 1).length
  const totalMinutes = dayTasks.reduce((a, t) => a + t.estimatedMinutes, 0)
  const studied = useMemo(() => sessionTotals(sessions), [sessions])
  const roadmap = roadmapPosition(problems.length)

  const byCategory = useMemo(() => {
    const map = new Map<TaskCategory, Task[]>()
    for (const c of CATEGORY_ORDER) map.set(c, [])
    for (const t of dayTasks) {
      const arr = map.get(t.category) ?? []
      arr.push(t)
      map.set(t.category, arr)
    }
    return map
  }, [dayTasks])

  const allDone = dayTasks.length > 0 && done === dayTasks.length

  const openAdd = (cat: TaskCategory) => {
    setDefaultCategory(cat)
    setEditing(null)
    setAddOpen(true)
  }

  const onSave = (t: Omit<Task, 'id'>) => {
    if (editing) updateTask(editing.id!, t)
    else addTask(t)
  }

  const handleToggle = async (task: Task) => {
    await toggleTask(task.id!)
    // Repeat handling: spawn the next occurrence when a repeating task is completed
    if (task.completed === 0 && task.repeat !== 'None') {
      const nextDate =
        task.repeat === 'Daily' ? format(addDays(new Date(), 1), 'yyyy-MM-dd')
        : format(addDays(new Date(), 7), 'yyyy-MM-dd')
      const exists = tasks.some((x) => x.title === task.title && x.date === nextDate)
      if (!exists) {
        const { id, ...rest } = task
        void id
        await addTask({ ...rest, completed: 0, completedAt: undefined, date: nextDate, createdAt: Date.now() })
      }
    }
  }

  return (
    <div className="space-y-4">
      <AppBar
        eyebrow={format(new Date(), 'EEEE, d MMMM')}
        title="Daily tasks"
        actions={
          <>
            <CheatSheetButton compact />
            <button
              onClick={() => setTimerOpen(true)}
              className={clsx('icon-btn relative', timer.running && 'border-accent/35 bg-accent/[0.12] text-accent')}
              aria-label="Study timer"
            >
              <Timer size={16} />
              {timer.running && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </button>
          </>
        }
      />

      {/* Roadmap + day progress */}
      <Card raised hairline className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[`Phase ${roadmap.phase}`, `Month ${roadmap.month}`, `Week ${roadmap.week}`, `Day ${roadmap.day}`].map(
              (seg, i, arr) => (
                <span key={seg} className="flex shrink-0 items-center gap-1">
                  <span
                    className={clsx(
                      'rounded-md px-1.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em]',
                      i === arr.length - 1
                        ? 'bg-java/[0.14] text-java'
                        : 'bg-white/[0.045] text-muted',
                    )}
                  >
                    {seg}
                  </span>
                  {i < arr.length - 1 && <span className="text-[9px] text-muted/35">›</span>}
                </span>
              ),
            )}
          </div>

          <div className="mt-3.5 flex items-center gap-4">
            <Ring
              value={done}
              max={Math.max(dayTasks.length, 1)}
              size={88}
              stroke={8}
              color={allDone ? '#f89820' : '#00d4aa'}
            >
              <span className="metric text-[17px]">{pct(done, Math.max(dayTasks.length, 1))}%</span>
            </Ring>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-extrabold leading-none tracking-tighter2">
                {done}
                <span className="text-[13px] font-semibold text-muted"> / {dayTasks.length} done</span>
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                <span className="font-bold text-ink-dim">{hm(totalMinutes)}</span> planned
                <span className="mx-1.5 text-muted/30">·</span>
                <span className="font-bold text-ink-dim">{hm(studied.todayMinutes)}</span> studied
              </p>
              <ProgressBar value={done} max={Math.max(dayTasks.length, 1)} className="mt-2" gradient />
              <p className="mt-1.5 flex items-center gap-1 truncate text-[10px] text-muted/85">
                <CalendarDays size={10} /> {roadmap.phaseTitle}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex gap-2">
            <button className="btn-java h-10 min-h-0 flex-1 text-[12px]" onClick={() => setPlanConfirm(true)}>
              <Wand2 size={13.5} /> Load today&apos;s Java plan
            </button>
            <button
              className="btn-ghost h-10 min-h-0 w-10 px-0"
              aria-label="Add task"
              onClick={() => {
                setDefaultCategory('Java DSA')
                setEditing(null)
                setAddOpen(true)
              }}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      </Card>

      {/* Category-wise time */}
      <Card className="p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Study time by category</p>
          <span className="text-[10.5px] font-bold text-accent">{hm(studied.totalMinutes)} total</span>
        </div>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
          {studied.byType.map((t) => (
            <div
              key={t.type}
              style={{
                width: `${(t.minutes / Math.max(studied.totalMinutes, 1)) * 100}%`,
                background: {
                  java_dsa: '#f89820',
                  java_theory: '#00d4aa',
                  cs_fundamentals: '#7c9bff',
                  project: '#c084fc',
                  revision: '#94a3b8',
                }[t.type],
              }}
              title={`${t.label}: ${hm(t.minutes)}`}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {studied.byType.map((t) => (
            <span key={t.type} className="flex items-center gap-1 text-[10px] text-muted">
              <i
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: {
                    java_dsa: '#f89820',
                    java_theory: '#00d4aa',
                    cs_fundamentals: '#7c9bff',
                    project: '#c084fc',
                    revision: '#94a3b8',
                  }[t.type],
                }}
              />
              {t.label} {hm(t.minutes)}
            </span>
          ))}
          {studied.byType.length === 0 && <span className="text-[10px] text-muted">No sessions logged yet</span>}
        </div>
      </Card>

      {/* Accordion categories */}
      <div className="space-y-2.5">
        <SectionTitle
          title="Today's plan"
          action={
            dayTasks.length > 0 ? (
              <button onClick={clearTodayTasks} className="flex items-center gap-1 text-[11px] font-bold text-muted">
                <Trash2 size={11} /> Clear
              </button>
            ) : undefined
          }
        />
        {CATEGORY_ORDER.map((cat) => {
          const items = byCategory.get(cat) ?? []
          const catDone = items.filter((t) => t.completed === 1).length
          const meta = CATEGORY_META[cat]
          const isOpen = open[cat]
          return (
            <Card key={cat} className="overflow-hidden">
              <button
                onClick={() => setOpen((o) => ({ ...o, [cat]: !o[cat] }))}
                className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors active:bg-white/[0.02]"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                  style={{ background: `${meta.color}14`, color: meta.color, border: `1px solid ${meta.color}26` }}
                >
                  {(() => {
                    const Icon = CATEGORY_ICON[meta.icon] ?? Code2
                    return <Icon size={14.5} strokeWidth={2.2} />
                  })()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-dim">{cat}</span>
                    <span className="text-[9.5px] font-semibold text-muted tabular">
                      {catDone}/{items.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={catDone}
                    max={Math.max(items.length, 1)}
                    height={3}
                    className="mt-1.5"
                    color={meta.color}
                  />
                </div>
                <ChevronDown
                  size={15}
                  className={clsx('shrink-0 text-muted transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden border-t border-white/[0.05]"
                  >
                    {items.length === 0 ? (
                      <div className="px-4 py-4 text-center">
                        <p className="text-[11.5px] text-muted">No {cat.toLowerCase()} tasks today</p>
                        <button
                          onClick={() => openAdd(cat)}
                          className="mt-2 text-[11.5px] font-bold text-accent"
                        >
                          + Add one
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/[0.05]">
                        {items
                          .slice()
                          .sort((a, b) => a.completed - b.completed || a.id! - b.id!)
                          .map((t) => (
                            <TaskRow
                              key={t.id}
                              task={t}
                              onToggle={() => handleToggle(t)}
                              onDelete={() => deleteTask(t.id!)}
                              onEdit={() => {
                                setEditing(t)
                                setAddOpen(true)
                              }}
                            />
                          ))}
                      </div>
                    )}
                    <button
                      onClick={() => openAdd(cat)}
                      className="flex w-full items-center justify-center gap-1 py-2.5 text-[11px] font-bold text-muted active:bg-white/[0.03]"
                    >
                      <Plus size={12} /> Add to {cat}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>

      <p className="px-2 text-center text-[10.5px] leading-relaxed text-muted/60">
        Tap the circle to complete · swipe left to delete · long-press (or double-tap) to edit
      </p>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => openAdd('Java DSA')}
        className="fixed bottom-[calc(var(--nav-h)+var(--safe-bottom)+16px)] right-[max(16px,calc(50%-244px))] z-40 flex h-14 items-center gap-2 rounded-full bg-accent px-5 font-bold text-[#04231d] shadow-[0_12px_30px_-8px_rgba(0,212,170,0.7)]"
        aria-label="Add task"
      >
        <Plus size={20} strokeWidth={3} /> <span className="text-[13px]">Task</span>
      </motion.button>

      <TaskForm
        open={addOpen}
        onClose={() => {
          setAddOpen(false)
          setEditing(null)
        }}
        initial={editing}
        defaultCategory={defaultCategory}
        onSave={onSave}
        onDelete={editing ? () => deleteTask(editing.id!) : undefined}
      />

      {/* Study timer sheet */}
      <Sheet open={timerOpen} onClose={() => setTimerOpen(false)} title="Pomodoro study timer">
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {timer.mode === 'work' ? 'Focus block' : 'Break'}
          </p>
          <div className="mt-3">
            <Ring
              value={timer.secondsLeft}
              max={(timer.mode === 'work' ? settings.timerMinutes : settings.breakMinutes) * 60}
              size={186}
              stroke={12}
              color={timer.mode === 'work' ? '#00d4aa' : '#f89820'}
            >
              <span className="font-mono text-[34px] font-extrabold leading-none tabular-nums">
                {mmss(timer.secondsLeft)}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {timer.mode === 'work' ? `${settings.timerMinutes} min focus` : `${settings.breakMinutes} min break`}
              </span>
            </Ring>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              className="btn-primary h-12 w-28"
              onClick={() => setTimer({ running: !timer.running })}
            >
              {timer.running ? <Pause size={16} /> : <Play size={16} />}
              {timer.running ? 'Pause' : 'Start'}
            </button>
            <button
              className="btn-ghost h-12 w-12 px-0"
              onClick={() =>
                setTimer({
                  running: false,
                  mode: 'work',
                  secondsLeft: settings.timerMinutes * 60,
                })
              }
              aria-label="Reset timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="mt-5 w-full">
            <p className="label">Log this block to</p>
            <div className="grid grid-cols-4 gap-1.5">
              {TIMER_TYPES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setTimer({ sessionType: t.type })}
                  className={clsx(
                    'rounded-xl border py-2 text-[10.5px] font-semibold',
                    timer.sessionType === t.type
                      ? 'border-accent/40 bg-accent/12 text-accent'
                      : 'border-white/[0.08] bg-white/[0.04] text-muted',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-ghost mt-3 h-10 w-full text-[11.5px]"
            onClick={async () => {
              await logSession({
                date: todayKey(),
                durationMinutes: settings.timerMinutes,
                topic: 'Manual focus block',
                type: timer.sessionType,
              })
            }}
          >
            <Coffee size={13} /> Log a completed {settings.timerMinutes}-min block
          </button>

          <div className="mt-5 w-full space-y-1.5 rounded-2xl bg-white/[0.04] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Category-wise time</p>
            {studied.byType.map((t) => (
              <div key={t.type} className="flex items-center justify-between text-[11.5px]">
                <span className="text-muted">{t.label}</span>
                <span className="font-bold">{hm(t.minutes)}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-white/[0.07] pt-1.5 text-[12px]">
              <span className="font-semibold">Total study time</span>
              <span className="font-extrabold text-accent">{hm(studied.totalMinutes)}</span>
            </div>
          </div>
        </div>
      </Sheet>

      {/* Load plan confirmation */}
      <Sheet open={planConfirm} onClose={() => setPlanConfirm(false)} title="Load today's Java plan">
        <p className="text-[12.5px] leading-relaxed text-muted">
          This adds the roadmap tasks for <span className="font-semibold text-ink">{format(new Date(), 'EEEE')}</span> —
          Java DSA problems, Java theory, CS fundamentals, development and review blocks.
        </p>
        <div className="mt-3 space-y-1.5 rounded-2xl bg-white/[0.04] p-3">
          <div className="flex justify-between text-[11.5px]">
            <span className="text-muted">Phase</span>
            <span className="font-semibold">Phase {roadmap.phase} · {roadmap.phaseTitle}</span>
          </div>
          <div className="flex justify-between text-[11.5px]">
            <span className="text-muted">Position</span>
            <span className="font-semibold">Month {roadmap.month} · Week {roadmap.week}</span>
          </div>
          <div className="flex justify-between text-[11.5px]">
            <span className="text-muted">Already today</span>
            <span className="font-semibold">{dayTasks.length} tasks</span>
          </div>
        </div>
        <button
          className="btn-primary mt-4 h-11 w-full"
          onClick={async () => {
            await loadTodayPlan()
            setPlanConfirm(false)
          }}
        >
          <Wand2 size={15} /> Load tasks
        </button>
        <p className="mt-2 text-center text-[10.5px] text-muted">
          Tasks you already have are not duplicated.
        </p>
      </Sheet>
    </div>
  )
}
