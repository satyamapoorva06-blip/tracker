export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemStatus = 'Solved' | 'Attempted' | 'Need Revision'
export type Approach = 'Brute Force' | 'Better' | 'Optimal'
export type Platform = 'LeetCode' | 'HackerRank' | 'GFG' | 'CodeChef' | 'College Exam'
export type SpaceComplexity = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n²)'

export type TaskCategory =
  | 'Java DSA'
  | 'Java Theory'
  | 'CS Fundamentals'
  | 'Development'
  | 'Review'

export type Priority = 'High' | 'Medium' | 'Low'
export type TaskLanguage = 'Java' | 'Python' | 'JS' | 'SQL' | 'Theory'

export interface Task {
  id?: number
  title: string
  category: TaskCategory
  completed: 0 | 1
  date: string // yyyy-MM-dd
  estimatedMinutes: number
  priority: Priority
  language: TaskLanguage
  repeat: 'None' | 'Daily' | 'Weekly'
  createdAt: number
  completedAt?: number
  /** optional grouping label, e.g. "Java DSA" */
  group?: string
}

export interface DsaProblem {
  id?: number
  problemNumber: number
  problemName: string
  platform: Platform
  difficulty: Difficulty
  pattern: Pattern
  status: ProblemStatus
  approach: Approach
  timeTakenMinutes: number
  spaceComplexity: SpaceComplexity
  javaCollectionsUsed: JavaCollection[]
  notes: string
  solvedDate: string // yyyy-MM-dd
}

export type Pattern =
  | 'Arrays'
  | 'Strings'
  | 'HashMap'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Binary Search'
  | 'Stack'
  | 'Queue'
  | 'LinkedList'
  | 'Trees'
  | 'BST'
  | 'Heaps'
  | 'Graphs'
  | 'DP'
  | 'Backtracking'
  | 'Greedy'
  | 'Intervals'
  | 'Trie'
  | 'Bit Manipulation'
  | 'Math'
  | 'Sorting'
  | 'Union Find'

export type JavaCollection =
  | 'ArrayList'
  | 'LinkedList'
  | 'HashMap'
  | 'TreeMap'
  | 'LinkedHashMap'
  | 'HashSet'
  | 'TreeSet'
  | 'LinkedHashSet'
  | 'Stack'
  | 'ArrayDeque'
  | 'PriorityQueue'
  | 'Arrays'
  | 'Collections'
  | 'StringBuilder'
  | 'String'
  | 'int[]'
  | 'char[][]'

export type ConceptCategory = 'fundamentals' | 'collections' | 'java8'
export type ConceptStatus = 'not_started' | 'in_progress' | 'completed'

export interface JavaConcept {
  id?: number
  topic: string
  subtopic: string
  category: ConceptCategory
  status: ConceptStatus
  confidence: number // 1-5
  lastReviewed?: string // yyyy-MM-dd
}

export type SessionType = 'java_dsa' | 'java_theory' | 'cs_fundamentals' | 'project' | 'revision'

export interface StudySession {
  id?: number
  date: string
  durationMinutes: number
  topic: string
  type: SessionType
}

export interface Setting {
  key: string
  value: unknown
}

export interface StreakDay {
  date: string // primary key
  active: 0 | 1
  tasksCompleted: number
  totalTasks: number
  freezeUsed?: 0 | 1
}
