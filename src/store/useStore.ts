import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subDays, differenceInCalendarDays, parseISO, startOfWeek } from 'date-fns'
import { db, seedDatabase } from '../db/db'
import type {
  Task, DsaProblem, JavaConcept, StudySession, StreakDay, SessionType,
} from '../types'
import { buildPlanTasks } from '../data/plan'

export const todayKey = () => format(new Date(), 'yyyy-MM-dd')

const uid = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export interface Settings {
  haptics: boolean
  confetti: boolean
  timerMinutes: number
  breakMinutes: number
  installPromptDismissed: boolean
  freezeUsedWeek: Record<string, boolean>
  milestones: Record<string, boolean>
  /** CS subject readiness: 0 = not started, 1 = partial, 2 = confident */
  csSubjects: Record<'DBMS' | 'OS' | 'CN', 0 | 1 | 2>
}

const defaultSettings: Settings = {
  haptics: true,
  confetti: true,
  timerMinutes: 25,
  breakMinutes: 5,
  installPromptDismissed: false,
  freezeUsedWeek: {},
  milestones: { 'React Basics': true, 'Project 1 Complete': true },
  csSubjects: { DBMS: 2, OS: 2, CN: 1 },
}

interface TimerState {
  running: boolean
  mode: 'work' | 'break'
  secondsLeft: number
  sessionType: SessionType
}

interface Store {
  ready: boolean
  tasks: Task[]
  problems: DsaProblem[]
  concepts: JavaConcept[]
  sessions: StudySession[]
  streaks: StreakDay[]
  settings: Settings
  timer: TimerState
  toast: { id: string; message: string; tone?: 'ok' | 'info' | 'warn' } | null
  celebrating: boolean

  init: () => Promise<void>
  refresh: () => Promise<void>

  addTask: (t: Omit<Task, 'id'>) => Promise<void>
  updateTask: (id: number, patch: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  toggleTask: (id: number) => Promise<void>
  loadTodayPlan: () => Promise<number>
  clearTodayTasks: () => Promise<void>

  addProblem: (p: Omit<DsaProblem, 'id'>) => Promise<void>
  updateProblem: (id: number, patch: Partial<DsaProblem>) => Promise<void>
  deleteProblem: (id: number) => Promise<void>

  cycleConcept: (id: number) => Promise<void>
  setConcept: (id: number, patch: Partial<JavaConcept>) => Promise<void>
  addConcept: (c: Omit<JavaConcept, 'id'>) => Promise<void>
  deleteConcept: (id: number) => Promise<void>

  logSession: (s: Omit<StudySession, 'id'>) => Promise<void>
  applyFreeze: (date: string) => Promise<void>

  updateSettings: (patch: Partial<Settings>) => void
  setTimer: (patch: Partial<TimerState>) => void
  tick: () => void
  showToast: (message: string, tone?: 'ok' | 'info' | 'warn') => void
  setCelebrating: (v: boolean) => void
  exportData: () => Promise<string>
  importData: (json: string) => Promise<void>
  resetDemo: () => Promise<void>
}

function haptic(enabled: boolean) {
  if (!enabled) return
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(12) } catch { /* ignore */ }
  }
}

/** Recompute today's streak row from tasks + sessions, then persist. */
async function syncTodayStreak(tasks: Task[]) {
  const key = todayKey()
  const dayTasks = tasks.filter((t) => t.date === key)
  const completed = dayTasks.filter((t) => t.completed === 1).length
  const existing = await db.streaks.get(key)
  const row: StreakDay = {
    date: key,
    active: completed > 0 || Boolean(existing?.active) ? 1 : 0,
    tasksCompleted: completed,
    totalTasks: dayTasks.length,
    freezeUsed: existing?.freezeUsed ?? 0,
  }
  await db.streaks.put(row)
  return row
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ready: false,
      tasks: [],
      problems: [],
      concepts: [],
      sessions: [],
      streaks: [],
      settings: defaultSettings,
      timer: { running: false, mode: 'work', secondsLeft: defaultSettings.timerMinutes * 60, sessionType: 'java_dsa' },
      toast: null,
      celebrating: false,

      init: async () => {
        await seedDatabase()
        await get().refresh()
        set({ ready: true })
        // Roll the timer default if settings changed
        if (!get().timer.running) {
          set((s) => ({ timer: { ...s.timer, secondsLeft: s.settings.timerMinutes * 60 } }))
        }
        await syncTodayStreak(get().tasks)
      },

      refresh: async () => {
        const [tasks, problems, concepts, sessions, streaks] = await Promise.all([
          db.tasks.toArray(),
          db.dsaProblems.toArray(),
          db.javaConcepts.toArray(),
          db.studySessions.toArray(),
          db.streaks.toArray(),
        ])
        set({ tasks, problems, concepts, sessions, streaks })
      },

      // ─────────────────────────── Tasks ───────────────────────────
      addTask: async (t) => {
        await db.tasks.add(t as Task)
        await get().refresh()
        haptic(get().settings.haptics)
        get().showToast('Task added', 'ok')
      },

      updateTask: async (id, patch) => {
        await db.tasks.update(id, patch)
        await get().refresh()
      },

      deleteTask: async (id) => {
        await db.tasks.delete(id)
        await get().refresh()
        haptic(get().settings.haptics)
        get().showToast('Task deleted', 'info')
      },

      toggleTask: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return
        const completed = task.completed === 1 ? 0 : 1
        await db.tasks.update(id, {
          completed: completed as 0 | 1,
          completedAt: completed ? Date.now() : undefined,
        })
        if (completed) {
          // Log study time automatically from the task's estimate
          await db.studySessions.add({
            date: todayKey(),
            durationMinutes: Math.round(task.estimatedMinutes * 0.85),
            topic: task.title,
            type:
              task.category === 'Java DSA' ? 'java_dsa'
              : task.category === 'Java Theory' ? 'java_theory'
              : task.category === 'CS Fundamentals' ? 'cs_fundamentals'
              : task.category === 'Development' ? 'project'
              : 'revision',
          })
        }
        await get().refresh()
        haptic(get().settings.haptics)
        await syncTodayStreak(get().tasks)

        const dayTasks = get().tasks.filter((t) => t.date === todayKey())
        const allDone = dayTasks.length > 0 && dayTasks.every((t) => t.completed === 1)
        if (allDone && completed) set({ celebrating: true })
      },

      loadTodayPlan: async () => {
        const key = todayKey()
        const existing = get().tasks.filter((t) => t.date === key)
        if (existing.length > 0) {
          // Merge only tasks that aren't already present by title
          const titles = new Set(existing.map((t) => t.title))
          const weekday = (new Date().getDay() + 6) % 7
          const plan = buildPlanTasks(weekday, key).filter((t) => !titles.has(t.title))
          if (plan.length) await db.tasks.bulkAdd(plan as Task[])
          await get().refresh()
          get().showToast(plan.length ? `Added ${plan.length} roadmap tasks` : 'Today\u2019s plan is already loaded', 'ok')
          return plan.length
        }
        const weekday = (new Date().getDay() + 6) % 7
        const plan = buildPlanTasks(weekday, key)
        await db.tasks.bulkAdd(plan as Task[])
        await get().refresh()
        await syncTodayStreak(get().tasks)
        get().showToast(`Loaded ${plan.length} tasks for today`, 'ok')
        return plan.length
      },

      clearTodayTasks: async () => {
        const key = todayKey()
        const ids = get().tasks.filter((t) => t.date === key).map((t) => t.id!)
        await db.tasks.bulkDelete(ids)
        await get().refresh()
        get().showToast('Today\u2019s tasks cleared', 'info')
      },

      // ─────────────────────────── Problems ───────────────────────────
      addProblem: async (p) => {
        await db.dsaProblems.add(p as DsaProblem)
        await get().refresh()
        haptic(get().settings.haptics)
        get().showToast(`#${p.problemNumber} logged in Java`, 'ok')
      },

      updateProblem: async (id, patch) => {
        await db.dsaProblems.update(id, patch)
        await get().refresh()
      },

      deleteProblem: async (id) => {
        await db.dsaProblems.delete(id)
        await get().refresh()
        get().showToast('Problem removed', 'info')
      },

      // ─────────────────────────── Concepts ───────────────────────────
      cycleConcept: async (id) => {
        const c = get().concepts.find((x) => x.id === id)
        if (!c) return
        const next =
          c.status === 'not_started' ? 'in_progress'
          : c.status === 'in_progress' ? 'completed'
          : 'not_started'
        await db.javaConcepts.update(id, {
          status: next,
          confidence: next === 'completed' ? Math.max(c.confidence, 4) : c.confidence,
          lastReviewed: todayKey(),
        })
        await get().refresh()
        haptic(get().settings.haptics)
      },

      setConcept: async (id, patch) => {
        await db.javaConcepts.update(id, patch)
        await get().refresh()
      },

      addConcept: async (c) => {
        await db.javaConcepts.add(c as JavaConcept)
        await get().refresh()
        get().showToast('Concept added', 'ok')
      },

      deleteConcept: async (id) => {
        await db.javaConcepts.delete(id)
        await get().refresh()
      },

      // ─────────────────────────── Sessions ───────────────────────────
      logSession: async (s) => {
        await db.studySessions.add(s as StudySession)
        await get().refresh()
        await syncTodayStreak(get().tasks)
      },

      applyFreeze: async (date) => {
        const weekKey = format(startOfWeek(parseISO(date), { weekStartsOn: 1 }), 'yyyy-MM-dd')
        const used = get().settings.freezeUsedWeek[weekKey]
        if (used) {
          get().showToast('Streak freeze already used this week', 'warn')
          return
        }
        const existing = await db.streaks.get(date)
        await db.streaks.put({
          date,
          active: 1,
          tasksCompleted: existing?.tasksCompleted ?? 0,
          totalTasks: existing?.totalTasks ?? 0,
          freezeUsed: 1,
        })
        set((s) => ({
          settings: { ...s.settings, freezeUsedWeek: { ...s.settings.freezeUsedWeek, [weekKey]: true } },
        }))
        await get().refresh()
        get().showToast('Streak freeze applied \u2744\ufe0f', 'ok')
      },

      updateSettings: (patch) => {
        set((s) => ({ settings: { ...s.settings, ...patch } }))
      },

      setTimer: (patch) => set((s) => ({ timer: { ...s.timer, ...patch } })),

      tick: () => {
        const { timer, settings } = get()
        if (!timer.running) return
        if (timer.secondsLeft > 1) {
          set((s) => ({ timer: { ...s.timer, secondsLeft: s.timer.secondsLeft - 1 } }))
          return
        }
        // Phase finished
        if (timer.mode === 'work') {
          get().logSession({
            date: todayKey(),
            durationMinutes: settings.timerMinutes,
            topic: 'Pomodoro focus',
            type: timer.sessionType,
          })
          haptic(settings.haptics)
          get().showToast('Focus block done — take a break \u2615', 'ok')
          set({
            timer: { ...timer, mode: 'break', secondsLeft: settings.breakMinutes * 60, running: true },
          })
        } else {
          haptic(settings.haptics)
          get().showToast('Break over — back to it \ud83d\ude80', 'info')
          set({
            timer: { ...timer, mode: 'work', secondsLeft: settings.timerMinutes * 60, running: false },
          })
        }
      },

      showToast: (message, tone = 'info') => {
        const id = uid()
        set({ toast: { id, message, tone } })
        setTimeout(() => {
          if (get().toast?.id === id) set({ toast: null })
        }, 2600)
      },

      setCelebrating: (v) => set({ celebrating: v }),

      exportData: async () => {
        const [tasks, problems, concepts, sessions, streaks, settings] = await Promise.all([
          db.tasks.toArray(), db.dsaProblems.toArray(), db.javaConcepts.toArray(),
          db.studySessions.toArray(), db.streaks.toArray(), db.settings.toArray(),
        ])
        return JSON.stringify(
          { app: 'JavaPrepTracker', version: 1, exportedAt: new Date().toISOString(), tasks, problems, concepts, sessions, streaks, settings },
          null,
          2,
        )
      },

      importData: async (json) => {
        const parsed = JSON.parse(json)
        if (parsed.app !== 'JavaPrepTracker') throw new Error('Not a JavaPrepTracker backup file')
        await db.transaction('rw', [db.tasks, db.dsaProblems, db.javaConcepts, db.studySessions, db.streaks], async () => {
          await Promise.all([db.tasks.clear(), db.dsaProblems.clear(), db.javaConcepts.clear(), db.studySessions.clear(), db.streaks.clear()])
          if (parsed.tasks) await db.tasks.bulkAdd(parsed.tasks)
          if (parsed.problems) await db.dsaProblems.bulkAdd(parsed.problems)
          if (parsed.concepts) await db.javaConcepts.bulkAdd(parsed.concepts)
          if (parsed.sessions) await db.studySessions.bulkAdd(parsed.sessions)
          if (parsed.streaks) await db.streaks.bulkAdd(parsed.streaks)
        })
        await get().refresh()
        get().showToast('Backup restored', 'ok')
      },

      resetDemo: async () => {
        await Promise.all([
          db.tasks.clear(), db.dsaProblems.clear(), db.javaConcepts.clear(),
          db.studySessions.clear(), db.streaks.clear(), db.settings.clear(),
        ])
        await seedDatabase()
        await get().refresh()
        get().showToast('Demo data restored', 'ok')
      },
    }),
    {
      name: 'javaprep-settings',
      partialize: (s) => ({ settings: s.settings }),
      // Deep-merge defaults so older persisted settings never miss new keys.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Store>
        return {
          ...current,
          settings: { ...current.settings, ...(p.settings ?? {}) },
        }
      },
    },
  ),
)

// ───────────────────────────── Selectors ─────────────────────────────

export function useTodayTasks() {
  return useStore((s) => s.tasks.filter((t) => t.date === todayKey()))
}

export interface StreakSummary {
  current: number
  longest: number
  totalActive: number
  freezeAvailable: boolean
}

export function computeStreak(streaks: StreakDay[], settings: Settings): StreakSummary {
  const map = new Map(streaks.map((s) => [s.date, s]))
  const today = new Date()

  let current = 0
  // Allow the streak to still count if today is not yet active (grace day).
  const startOffset = map.get(format(today, 'yyyy-MM-dd'))?.active ? 0 : 1
  for (let i = startOffset; i < 400; i++) {
    const key = format(subDays(today, i), 'yyyy-MM-dd')
    if (map.get(key)?.active) current++
    else break
  }

  // Longest run in the whole dataset
  const sorted = [...streaks].filter((s) => s.active).map((s) => s.date).sort()
  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const d of sorted) {
    if (prev && differenceInCalendarDays(parseISO(d), parseISO(prev)) === 1) run++
    else run = 1
    longest = Math.max(longest, run)
    prev = d
  }

  const weekKey = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  return {
    current,
    longest: Math.max(longest, current),
    totalActive: sorted.length,
    freezeAvailable: !settings.freezeUsedWeek[weekKey],
  }
}

export function useStreak() {
  const streaks = useStore((s) => s.streaks)
  const settings = useStore((s) => s.settings)
  return computeStreak(streaks, settings)
}
