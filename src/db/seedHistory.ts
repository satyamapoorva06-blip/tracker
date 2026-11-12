import { format, subDays, startOfDay } from 'date-fns'
import { PROBLEM_CATALOG } from '../data/problems'
import { buildPlanTasks } from '../data/plan'
import type {
  DsaProblem, Task, StudySession, StreakDay, Approach, ProblemStatus,
} from '../types'
import { TOTAL_TARGET } from '../data/seed'

/** Deterministic PRNG so the first-run history is stable & reproducible. */
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20261112)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const randInt = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))

const NOTES: Record<string, string[]> = {
  Graphs: [
    'BFS from every unvisited land cell; sink the island by marking visited.',
    'Multi-source BFS: seed the queue with all rotten oranges, expand level by level.',
    'Topological sort with indegree array (Kahn). Detects cycles if order length < n.',
  ],
  DP: [
    'State: dp[i] = best answer for prefix i. Transition from the two previous states.',
    'Clarified base cases first, then filled the table bottom-up — no recursion overhead.',
    'Used a 1D rolling array to drop space from O(n²) to O(n).',
  ],
  Trees: [
    'Recursive DFS returning (height, diameter) lets both answers fall out in one pass.',
    'Level-order traversal with a queue; track size per level to build the result rows.',
    'Inorder traversal of a BST is sorted — used that to validate the tree.',
  ],
  HashMap: [
    'Frequency map with getOrDefault, then a second pass to find the answer.',
    'Prefix-sum + HashMap: count how many earlier prefixes equal sum - k.',
  ],
  Arrays: [
    'Two passes instead of one: build the prefix and suffix products separately.',
    'Sorted then used two pointers inward — O(n log n) overall.',
    'Boyer-Moore voting for O(1) space majority.',
  ],
  Stack: [
    'Monotonic decreasing stack keeps indices of unresolved elements.',
    'Stack held (count, char) pairs so popping was trivial on decode.',
  ],
  LinkedList: [
    'Fast/slow pointers found the middle, then reversed the second half in place.',
    'Dummy head node removed all the null checks for insertion and deletion.',
  ],
  Heaps: [
    'Two heaps (max for lower half, min for upper half) kept the median O(log n).',
    'Bounded min-heap of size k — every push/pop is O(log k).',
  ],
}

const APPROACHES: Approach[] = ['Optimal', 'Optimal', 'Optimal', 'Better', 'Brute Force']
const SPACES = ['O(1)', 'O(n)', 'O(log n)', 'O(n)'] as const

/**
 * Builds a 120-day study history: 142 logged problems, a task history with a
 * natural 47-day current streak (plus an earlier 15-day run), study sessions
 * and per-day streak rows.
 */
export function buildSeedHistory(): {
  problems: DsaProblem[]
  tasks: Task[]
  sessions: StudySession[]
  streaks: StreakDay[]
} {
  const today = startOfDay(new Date())
  const dateFor = (daysAgo: number) => format(subDays(today, daysAgo), 'yyyy-MM-dd')

  // ── Day activity map over the last 120 days (0 = today) ──
  const activeDays = new Set<number>()
  // Older run: a solid 52-day streak that ended when exams hit.
  for (let d = 101; d >= 50; d--) activeDays.add(d)
  // Three genuinely missed days break the streak.
  // Current run: 47 continuous days, alive through today.
  for (let d = 46; d >= 0; d--) activeDays.add(d)
  // Sporadic practice before the older run.
  const sparsePool = Array.from({ length: 17 }, (_, i) => i + 103)
  for (let i = 0; i < 8; i++) {
    activeDays.add(sparsePool.splice(Math.floor(rand() * sparsePool.length), 1)[0])
  }

  // ── DSA problems: pick 142 catalog rows, spread over active days ──
  const catalog = [...PROBLEM_CATALOG]
  const solved = catalog.splice(0, TOTAL_TARGET)
  const activeSorted = [...activeDays].sort((a, b) => b - a) // oldest first
  const problems: DsaProblem[] = solved.map((row, i) => {
    const [problemNumber, problemName, difficulty, pattern, collections] = row
    // Weight problem assignment toward recent days (more practice lately).
    const dayIdx = Math.min(
      activeSorted.length - 1,
      Math.floor(Math.pow(i / solved.length, 0.82) * activeSorted.length),
    )
    const daysAgo = activeSorted[dayIdx]
    const status: ProblemStatus =
      rand() < 0.06 ? 'Need Revision' : rand() < 0.05 ? 'Attempted' : 'Solved'
    const baseTime =
      difficulty === 'Easy' ? randInt(8, 20) : difficulty === 'Medium' ? randInt(16, 38) : randInt(35, 70)
    const notes = NOTES[pattern] ? pick(NOTES[pattern]) : ''
    return {
      problemNumber,
      problemName,
      platform: rand() < 0.92 ? 'LeetCode' : pick(['GFG', 'HackerRank', 'CodeChef'] as const),
      difficulty,
      pattern,
      status,
      approach: status === 'Attempted' ? pick(['Brute Force', 'Better'] as Approach[]) : pick(APPROACHES),
      timeTakenMinutes: baseTime,
      spaceComplexity: pick([...SPACES]),
      javaCollectionsUsed: collections,
      notes: i % 3 === 0 ? '' : notes,
      solvedDate: dateFor(daysAgo),
    }
  })

  // ── Tasks: last 21 days of the rotating plan, earlier days completed ──
  const tasks: Task[] = []
  for (let daysAgo = 21; daysAgo >= 0; daysAgo--) {
    const date = dateFor(daysAgo)
    const weekday = (subDays(today, daysAgo).getDay() + 6) % 7
    const plan = buildPlanTasks(weekday, date, daysAgo * 100)
    // Don't flood the login day: today's plan is pre-loaded but mostly open.
    const completionRate =
      daysAgo === 0 ? 0.55 : daysAgo === 1 ? 0.9 : daysAgo === 2 ? 0.75 : randInt(55, 100) / 100
    plan.forEach((t, i) => {
      const done = activeDays.has(daysAgo) && rand() < completionRate
      tasks.push({
        ...t,
        completed: done ? 1 : 0,
        completedAt: done ? subDays(today, daysAgo).getTime() + 36_000_000 + i * 60_000 : undefined,
      })
    })
  }

  // ── Study sessions ──
  const sessions: StudySession[] = []
  const sessionTopics: Record<StudySession['type'], string[]> = {
    java_dsa: ['Graph BFS', 'DP tabulation', 'Sliding window', 'Trees traversal', 'Heap / priority queue', 'Union Find'],
    java_theory: ['Collections framework', 'OOP principles', 'Generics', 'Streams & lambdas'],
    cs_fundamentals: ['OS — deadlock', 'DBMS — normalization', 'CN — TCP/IP', 'OOP design'],
    project: ['FastAPI auth', 'React dashboard', 'Project refactor'],
    revision: ['Revision block', 'Mock interview', 'Pattern revision'],
  }
  const sessionTypes: StudySession['type'][] = ['java_dsa', 'java_dsa', 'java_dsa', 'java_theory', 'cs_fundamentals', 'project', 'revision']
  for (const daysAgo of activeSorted) {
    const blocks = randInt(1, 3)
    const used = new Set<string>()
    for (let b = 0; b < blocks; b++) {
      const type = pick(sessionTypes)
      const topic = pick(sessionTopics[type])
      const key = `${type}:${topic}`
      if (used.has(key)) continue
      used.add(key)
      sessions.push({
        date: dateFor(daysAgo),
        durationMinutes: type === 'project' ? randInt(40, 90) : randInt(20, 60),
        topic,
        type,
      })
    }
  }

  // ── Streak rows ──
  const streaks: StreakDay[] = []
  for (let daysAgo = 119; daysAgo >= 0; daysAgo--) {
    const date = dateFor(daysAgo)
    const dayTasks = tasks.filter((t) => t.date === date)
    const completed = dayTasks.filter((t) => t.completed === 1).length
    const active = activeDays.has(daysAgo)
    streaks.push({
      date,
      active: active ? 1 : 0,
      tasksCompleted: completed,
      totalTasks: dayTasks.length || (active ? 6 : 0),
    })
  }

  return { problems, tasks, sessions, streaks }
}
