import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { Trash2 } from 'lucide-react'
import { Sheet } from './ui/Primitives'
import type { Task, TaskCategory, Priority, TaskLanguage } from '../types'

const CATEGORIES: TaskCategory[] = ['Java DSA', 'Java Theory', 'CS Fundamentals', 'Development', 'Review']
const LANGUAGES: TaskLanguage[] = ['Java', 'Python', 'JS', 'SQL', 'Theory']
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']
const REPEATS: Task['repeat'][] = ['None', 'Daily', 'Weekly']

export default function TaskForm({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
  defaultCategory = 'Java DSA',
}: {
  open: boolean
  onClose: () => void
  onSave: (t: Omit<Task, 'id'>) => void
  onDelete?: () => void
  initial?: Task | null
  defaultCategory?: TaskCategory
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>(defaultCategory)
  const [language, setLanguage] = useState<TaskLanguage>('Java')
  const [minutes, setMinutes] = useState(30)
  const [priority, setPriority] = useState<Priority>('Medium')
  const [repeat, setRepeat] = useState<Task['repeat']>('None')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    if (initial) {
      setTitle(initial.title)
      setCategory(initial.category)
      setLanguage(initial.language)
      setMinutes(initial.estimatedMinutes)
      setPriority(initial.priority)
      setRepeat(initial.repeat)
      setDate(initial.date)
    } else {
      setTitle('')
      setCategory(defaultCategory)
      setLanguage('Java')
      setMinutes(30)
      setPriority('Medium')
      setRepeat('None')
      setDate(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [open, initial, defaultCategory])

  const submit = () => {
    if (!title.trim()) return setError('Give the task a name')
    onSave({
      title: title.trim(),
      category,
      completed: initial?.completed ?? 0,
      date,
      estimatedMinutes: Math.max(5, minutes),
      priority,
      language,
      repeat,
      createdAt: initial?.createdAt ?? Date.now(),
      completedAt: initial?.completedAt,
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? 'Edit task' : 'Add task'}
      footer={
        <div className="flex gap-2">
          {initial && onDelete && (
            <button
              className="btn h-11 shrink-0 bg-hard/15 px-3 text-hard"
              onClick={() => {
                onDelete()
                onClose()
              }}
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button className="btn-primary h-11 flex-1" onClick={submit}>
            {initial ? 'Save changes' : 'Add task'}
          </button>
        </div>
      }
    >
      <div className="space-y-3.5">
        {error && (
          <p className="rounded-xl border border-hard/30 bg-hard/10 px-3 py-2 text-[12px] font-semibold text-hard">{error}</p>
        )}
        <div>
          <label className="label">Task name</label>
          <input
            className="field"
            placeholder="Solve #200 Number of Islands"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Language tag</label>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={clsx(
                  'rounded-xl border px-3 py-2 text-[12px] font-semibold',
                  language === l ? 'border-accent/45 bg-accent/12 text-accent' : 'border-white/[0.08] bg-white/[0.04] text-muted',
                )}
              >
                [{l}]
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="label">Estimated minutes</label>
            <input
              className="field"
              type="number"
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Priority</label>
          <div className="flex gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={clsx(
                  'flex-1 rounded-xl border py-2.5 text-[12px] font-semibold',
                  priority === p ? 'border-white/25 bg-white/[0.12] text-ink' : 'border-white/[0.08] bg-white/[0.04] text-muted',
                )}
              >
                {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Repeat</label>
          <div className="flex gap-1.5">
            {REPEATS.map((r) => (
              <button
                key={r}
                onClick={() => setRepeat(r)}
                className={clsx(
                  'flex-1 rounded-xl border py-2.5 text-[12px] font-semibold',
                  repeat === r ? 'border-java/45 bg-java/12 text-java' : 'border-white/[0.08] bg-white/[0.04] text-muted',
                )}
              >
                {r}
              </button>
            ))}
          </div>
          {repeat !== 'None' && (
            <p className="mt-1.5 text-[10.5px] text-muted">
              Repeats {repeat.toLowerCase()} — completing it adds the next copy automatically.
            </p>
          )}
        </div>
      </div>
    </Sheet>
  )
}
