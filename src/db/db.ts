import Dexie, { type Table } from 'dexie'
import type {
  Task, DsaProblem, JavaConcept, StudySession, Setting, StreakDay,
} from '../types'
import { SEED_CONCEPTS } from '../data/seed'
import { buildSeedHistory } from './seedHistory'

class JavaPrepDB extends Dexie {
  tasks!: Table<Task, number>
  dsaProblems!: Table<DsaProblem, number>
  javaConcepts!: Table<JavaConcept, number>
  studySessions!: Table<StudySession, number>
  settings!: Table<Setting, string>
  streaks!: Table<StreakDay, string>

  constructor() {
    super('javapreptracker')
    this.version(1).stores({
      tasks: '++id, date, category, completed, priority, language',
      dsaProblems: '++id, solvedDate, difficulty, pattern, status, platform, problemNumber',
      javaConcepts: '++id, category, status, topic',
      studySessions: '++id, date, type',
      settings: 'key',
      streaks: 'date',
    })
  }
}

export const db = new JavaPrepDB()

/** Flag stored in settings once the first-run demo history has been written. */
export const SEED_FLAG = 'seed:v1'

export async function isSeeded(): Promise<boolean> {
  const row = await db.settings.get(SEED_FLAG)
  return Boolean(row?.value)
}

/**
 * First-run bootstrap. Writes a realistic 12-week history so the dashboard,
 * charts and streak widgets have something meaningful to show immediately.
 * Every row is ordinary user data — it can be edited or deleted from the UI.
 */
export async function seedDatabase(): Promise<void> {
  if (await isSeeded()) return

  const history = buildSeedHistory()

  await db.transaction('rw', [db.tasks, db.dsaProblems, db.javaConcepts, db.studySessions, db.streaks, db.settings], async () => {
    await db.javaConcepts.bulkAdd(SEED_CONCEPTS as JavaConcept[])
    await db.dsaProblems.bulkAdd(history.problems)
    await db.tasks.bulkAdd(history.tasks)
    await db.studySessions.bulkAdd(history.sessions)
    await db.streaks.bulkAdd(history.streaks)
    await db.settings.put({ key: SEED_FLAG, value: Date.now() })
  })
}
