import type { Task, TaskCategory, Priority, TaskLanguage } from '../types'
import { DIFFICULTY_TARGETS, TOTAL_TARGET } from './seed'

export interface PlanDay {
  title: string
  category: TaskCategory
  estimatedMinutes: number
  priority: Priority
  language: TaskLanguage
}

/**
 * A compact 6-day rotating rotation of a 12-month placement roadmap.
 * Deterministic by weekday so "Load Today's Java Plan" is stable per day.
 */
export const PLAN_ROTATION: Record<number, { javaDsa: PlanDay[]; theory: PlanDay[]; cs: PlanDay[]; dev: PlanDay[]; review: PlanDay[] }> = {
  0: {
    javaDsa: [
      { title: 'Solve #200 Number of Islands (Graph BFS)', category: 'Java DSA', estimatedMinutes: 45, priority: 'High', language: 'Java' },
      { title: 'Solve #994 Rotting Oranges (multi-source BFS)', category: 'Java DSA', estimatedMinutes: 40, priority: 'High', language: 'Java' },
      { title: 'Revise HashMap pattern — 3 problems', category: 'Java DSA', estimatedMinutes: 45, priority: 'Medium', language: 'Java' },
      { title: 'Implement UnionFind class from scratch in Java', category: 'Java DSA', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'Study Java Collections — PriorityQueue deep dive', category: 'Java Theory', estimatedMinutes: 40, priority: 'High', language: 'Theory' },
      { title: 'Practice Comparable vs Comparator with examples', category: 'Java Theory', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
    ],
    cs: [
      { title: 'OS — Deadlock (4 conditions + Banker\u2019s algorithm)', category: 'CS Fundamentals', estimatedMinutes: 40, priority: 'Medium', language: 'Theory' },
      { title: 'DBMS — Normalization (1NF to BCNF)', category: 'CS Fundamentals', estimatedMinutes: 35, priority: 'Low', language: 'Theory' },
    ],
    dev: [
      { title: 'Build FastAPI auth endpoint', category: 'Development', estimatedMinutes: 60, priority: 'Medium', language: 'Python' },
      { title: 'React — connect frontend to backend', category: 'Development', estimatedMinutes: 50, priority: 'Medium', language: 'JS' },
    ],
    review: [
      { title: 'Push Java solutions to GitHub', category: 'Review', estimatedMinutes: 15, priority: 'Low', language: 'Java' },
      { title: 'Write daily learning journal', category: 'Review', estimatedMinutes: 10, priority: 'Low', language: 'Theory' },
      { title: 'Update DSA tracker', category: 'Review', estimatedMinutes: 5, priority: 'Low', language: 'Theory' },
    ],
  },
  1: {
    javaDsa: [
      { title: 'Solve #207 Course Schedule (topological sort)', category: 'Java DSA', estimatedMinutes: 45, priority: 'High', language: 'Java' },
      { title: 'Solve #210 Course Schedule II (Kahn\u2019s algorithm)', category: 'Java DSA', estimatedMinutes: 40, priority: 'High', language: 'Java' },
      { title: 'Solve #547 Number of Provinces (Union Find)', category: 'Java DSA', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'Java Generics — bounded types & wildcards', category: 'Java Theory', estimatedMinutes: 35, priority: 'Medium', language: 'Theory' },
      { title: 'ArrayDeque as Stack and Queue', category: 'Java Theory', estimatedMinutes: 25, priority: 'Medium', language: 'Java' },
    ],
    cs: [
      { title: 'OS — Scheduling (FCFS, SJF, Round Robin)', category: 'CS Fundamentals', estimatedMinutes: 40, priority: 'Medium', language: 'Theory' },
      { title: 'DBMS — Indexing & B+ trees', category: 'CS Fundamentals', estimatedMinutes: 30, priority: 'Low', language: 'Theory' },
    ],
    dev: [
      { title: 'JWT refresh-token flow in FastAPI', category: 'Development', estimatedMinutes: 55, priority: 'Medium', language: 'Python' },
    ],
    review: [
      { title: 'Re-solve 1 problem from memory (no hints)', category: 'Review', estimatedMinutes: 30, priority: 'High', language: 'Java' },
      { title: 'Update revision list in DSA tracker', category: 'Review', estimatedMinutes: 5, priority: 'Low', language: 'Theory' },
    ],
  },
  2: {
    javaDsa: [
      { title: 'Solve #322 Coin Change (1D DP)', category: 'Java DSA', estimatedMinutes: 45, priority: 'High', language: 'Java' },
      { title: 'Solve #300 Longest Increasing Subsequence', category: 'Java DSA', estimatedMinutes: 40, priority: 'High', language: 'Java' },
      { title: 'Solve #1143 Longest Common Subsequence', category: 'Java DSA', estimatedMinutes: 40, priority: 'Medium', language: 'Java' },
      { title: 'Revise DP — 3 problems with tabulation', category: 'Java DSA', estimatedMinutes: 45, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'Lambda expressions & functional interfaces', category: 'Java Theory', estimatedMinutes: 35, priority: 'High', language: 'Java' },
      { title: 'Stream API — filter / map / collect', category: 'Java Theory', estimatedMinutes: 40, priority: 'Medium', language: 'Java' },
    ],
    cs: [
      { title: 'OS — Memory management & page replacement', category: 'CS Fundamentals', estimatedMinutes: 35, priority: 'Medium', language: 'Theory' },
      { title: 'DBMS — Transactions & ACID', category: 'CS Fundamentals', estimatedMinutes: 30, priority: 'Low', language: 'Theory' },
    ],
    dev: [
      { title: 'Build project dashboard UI in React', category: 'Development', estimatedMinutes: 70, priority: 'Medium', language: 'JS' },
      { title: 'Write SQL schema for project', category: 'Development', estimatedMinutes: 30, priority: 'Low', language: 'SQL' },
    ],
    review: [
      { title: 'Push Java code to GitHub', category: 'Review', estimatedMinutes: 15, priority: 'Low', language: 'Java' },
    ],
  },
  3: {
    javaDsa: [
      { title: 'Solve #295 Find Median from Data Stream (two heaps)', category: 'Java DSA', estimatedMinutes: 50, priority: 'High', language: 'Java' },
      { title: 'Solve #347 Top K Frequent Elements', category: 'Java DSA', estimatedMinutes: 35, priority: 'High', language: 'Java' },
      { title: 'Solve #215 Kth Largest Element (quickselect)', category: 'Java DSA', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'Exception handling & custom exceptions', category: 'Java Theory', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
      { title: 'OOP — interfaces vs abstract classes', category: 'Java Theory', estimatedMinutes: 35, priority: 'High', language: 'Theory' },
    ],
    cs: [
      { title: 'CN — TCP vs UDP & the 3-way handshake', category: 'CS Fundamentals', estimatedMinutes: 35, priority: 'Medium', language: 'Theory' },
    ],
    dev: [
      { title: 'Add pagination to the project API', category: 'Development', estimatedMinutes: 45, priority: 'Low', language: 'Python' },
    ],
    review: [
      { title: 'Write daily learning journal', category: 'Review', estimatedMinutes: 10, priority: 'Low', language: 'Theory' },
      { title: 'Review weak patterns from Stats screen', category: 'Review', estimatedMinutes: 20, priority: 'Medium', language: 'Java' },
    ],
  },
  4: {
    javaDsa: [
      { title: 'Solve #76 Minimum Window Substring (hard sliding window)', category: 'Java DSA', estimatedMinutes: 55, priority: 'High', language: 'Java' },
      { title: 'Solve #239 Sliding Window Maximum (monotonic deque)', category: 'Java DSA', estimatedMinutes: 45, priority: 'High', language: 'Java' },
      { title: 'Revise sliding window — 3 problems', category: 'Java DSA', estimatedMinutes: 40, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'TreeMap / TreeSet — floor & ceiling queries', category: 'Java Theory', estimatedMinutes: 30, priority: 'Medium', language: 'Java' },
      { title: 'Collections.sort() with custom Comparator', category: 'Java Theory', estimatedMinutes: 25, priority: 'Medium', language: 'Java' },
    ],
    cs: [
      { title: 'OOP interview questions — SOLID principles', category: 'CS Fundamentals', estimatedMinutes: 40, priority: 'Medium', language: 'Theory' },
    ],
    dev: [
      { title: 'Deploy project 2 to Vercel', category: 'Development', estimatedMinutes: 40, priority: 'Medium', language: 'JS' },
    ],
    review: [
      { title: 'Mock interview — 2 medium problems, 45 min', category: 'Review', estimatedMinutes: 45, priority: 'High', language: 'Java' },
    ],
  },
  5: {
    javaDsa: [
      { title: 'Contest practice — attempt 3 problems in 90 min', category: 'Java DSA', estimatedMinutes: 90, priority: 'High', language: 'Java' },
      { title: 'Upsolve 2 contest problems', category: 'Java DSA', estimatedMinutes: 60, priority: 'High', language: 'Java' },
    ],
    theory: [
      { title: 'Weekly Java theory revision — rest of collections', category: 'Java Theory', estimatedMinutes: 40, priority: 'Medium', language: 'Theory' },
    ],
    cs: [
      { title: 'Revise all OS notes from the week', category: 'CS Fundamentals', estimatedMinutes: 45, priority: 'Medium', language: 'Theory' },
      { title: 'Revise all DBMS notes from the week', category: 'CS Fundamentals', estimatedMinutes: 40, priority: 'Low', language: 'Theory' },
    ],
    dev: [
      { title: 'Weekly project review & refactor', category: 'Development', estimatedMinutes: 50, priority: 'Medium', language: 'JS' },
    ],
    review: [
      { title: 'Plan next week\u2019s study targets', category: 'Review', estimatedMinutes: 20, priority: 'Medium', language: 'Theory' },
      { title: 'Update resume with this week\u2019s projects', category: 'Review', estimatedMinutes: 20, priority: 'Low', language: 'Theory' },
    ],
  },
  6: {
    javaDsa: [
      { title: 'Solve 3 unsolved problems from weakest pattern', category: 'Java DSA', estimatedMinutes: 75, priority: 'High', language: 'Java' },
      { title: 'Re-solve 2 problems from memory (no hints)', category: 'Java DSA', estimatedMinutes: 50, priority: 'High', language: 'Java' },
      { title: 'Update revision list & pattern notes', category: 'Java DSA', estimatedMinutes: 20, priority: 'Medium', language: 'Java' },
    ],
    theory: [
      { title: 'Java theory — weekly self-quiz on collections', category: 'Java Theory', estimatedMinutes: 30, priority: 'Medium', language: 'Theory' },
    ],
    cs: [
      { title: 'CS fundamentals — write 1-page notes per subject', category: 'CS Fundamentals', estimatedMinutes: 40, priority: 'Medium', language: 'Theory' },
    ],
    dev: [
      { title: 'Ship one small feature on project 2', category: 'Development', estimatedMinutes: 60, priority: 'Medium', language: 'JS' },
    ],
    review: [
      { title: 'Weekly review — stats, streak, plan next week', category: 'Review', estimatedMinutes: 20, priority: 'Medium', language: 'Theory' },
      { title: 'Push all Java code to GitHub', category: 'Review', estimatedMinutes: 15, priority: 'Low', language: 'Java' },
    ],
  },
}

export const CATEGORY_ORDER: TaskCategory[] = [
  'Java DSA',
  'Java Theory',
  'CS Fundamentals',
  'Development',
  'Review',
]

export const CATEGORY_META: Record<TaskCategory, { icon: string; color: string }> = {
  'Java DSA': { icon: 'Code2', color: '#f89820' },
  'Java Theory': { icon: 'BookOpen', color: '#00d4aa' },
  'CS Fundamentals': { icon: 'Library', color: '#7cc5ff' },
  Development: { icon: 'Hammer', color: '#a78bfa' },
  Review: { icon: 'NotebookPen', color: '#94a3b8' },
}

/** Builds the full "today" plan (24-ish tasks) for a given weekday. */
export function buildPlanTasks(weekday: number, date: string, seedSalt = 0): Omit<Task, 'id'>[] {
  const day = PLAN_ROTATION[weekday % 7]
  const now = Date.now()
  const rows = [
    ...day.javaDsa,
    ...day.theory,
    ...day.cs,
    ...day.dev,
    ...day.review,
  ]
  return rows.map((r, i) => ({
    title: r.title,
    category: r.category,
    completed: 0,
    date,
    estimatedMinutes: r.estimatedMinutes,
    priority: r.priority,
    language: r.language,
    repeat: 'None',
    createdAt: now + i + seedSalt,
    group: r.category,
  }))
}

export interface RoadmapPosition {
  phase: number
  month: number
  week: number
  day: number
  phaseTitle: string
  taskPercent: number
}

export const PHASES = [
  { phase: 1, title: 'Foundations', range: 'Month 1–3' },
  { phase: 2, title: 'Java DSA Deep Dive', range: 'Month 4–6' },
  { phase: 3, title: 'Advanced DSA + CS Fundamentals', range: 'Month 7–9' },
  { phase: 4, title: 'Projects & Interviews', range: 'Month 10–12' },
]

/**
 * Converts elapsed days since Jan 1 of the current study year into
 * Phase → Month → Week → Day, using a 12-month / 52-week roadmap.
 */
export function roadmapPosition(problemCount: number = 0): RoadmapPosition {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1
  const month = Math.min(12, Math.ceil(dayOfYear / 30.4))
  const week = Math.min(52, Math.ceil(dayOfYear / 7))
  const phase = Math.min(4, Math.ceil(month / 3))
  const weekInMonth = ((week - 1) % 4) + 1
  const dayInWeek = (now.getDay() + 6) % 7 + 1 // Monday = 1
  return {
    phase,
    month,
    week,
    day: dayInWeek,
    phaseTitle: PHASES[phase - 1].title,
    taskPercent: Math.round((problemCount / TOTAL_TARGET) * 100),
  }
}

export const MILESTONES: { label: string; test: 'problems' | 'concepts' | 'manual'; target?: number; manual?: boolean }[] = [
  { label: 'Java OOP Mastered', test: 'concepts', target: 0 },
  { label: 'Java Collections Framework', test: 'concepts', target: 1 },
  { label: '50 Java DSA Problems', test: 'problems', target: 50 },
  { label: 'React Basics', test: 'manual', manual: true },
  { label: 'Project 1 Complete', test: 'manual', manual: true },
  { label: '100 Java DSA Problems', test: 'problems', target: 100 },
  { label: 'CS Fundamentals Complete', test: 'concepts', target: 2 },
  { label: 'Project 2 Complete', test: 'manual', manual: true },
]

export { DIFFICULTY_TARGETS }
