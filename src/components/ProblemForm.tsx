import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { Plus, Trash2 } from 'lucide-react'
import { Sheet } from './ui/Primitives'
import { ALL_COLLECTIONS, ALL_PATTERNS, COLLECTION_GROUPS } from '../data/seed'
import type {
  Approach, Difficulty, DsaProblem, JavaCollection, Pattern, Platform, ProblemStatus, SpaceComplexity,
} from '../types'

const PLATFORMS: Platform[] = ['LeetCode', 'HackerRank', 'GFG', 'CodeChef', 'College Exam']
const DIFFS: Difficulty[] = ['Easy', 'Medium', 'Hard']
const STATUSES: ProblemStatus[] = ['Solved', 'Attempted', 'Need Revision']
const APPROACHES: Approach[] = ['Brute Force', 'Better', 'Optimal']
const SPACES: SpaceComplexity[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)']

const empty = (): Omit<DsaProblem, 'id'> => ({
  problemNumber: 0,
  problemName: '',
  platform: 'LeetCode',
  difficulty: 'Medium',
  pattern: 'Arrays',
  status: 'Solved',
  approach: 'Optimal',
  timeTakenMinutes: 25,
  spaceComplexity: 'O(n)',
  javaCollectionsUsed: [],
  notes: '',
  solvedDate: format(new Date(), 'yyyy-MM-dd'),
})

function Choice<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  colors?: Record<string, string>
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o === value
        const color = colors?.[o]
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={clsx(
              'rounded-xl border px-3 py-2 text-[12px] font-semibold transition-colors',
              active
                ? 'border-transparent'
                : 'border-white/[0.08] bg-white/[0.04] text-muted',
            )}
            style={
              active
                ? {
                    background: `${color ?? '#00d4aa'}1f`,
                    color: color ?? '#00d4aa',
                    borderColor: `${color ?? '#00d4aa'}55`,
                  }
                : undefined
            }
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export default function ProblemForm({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSave: (p: Omit<DsaProblem, 'id'>) => void
  onDelete?: () => void
  initial?: DsaProblem | null
}) {
  const [form, setForm] = useState<Omit<DsaProblem, 'id'>>(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : empty())
      setError('')
    }
  }, [open, initial])

  const set = <K extends keyof Omit<DsaProblem, 'id'>>(k: K, v: Omit<DsaProblem, 'id'>[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleCollection = (c: JavaCollection) => {
    setForm((f) => ({
      ...f,
      javaCollectionsUsed: f.javaCollectionsUsed.includes(c)
        ? f.javaCollectionsUsed.filter((x) => x !== c)
        : [...f.javaCollectionsUsed, c],
    }))
  }

  const submit = () => {
    if (!form.problemName.trim()) return setError('Problem name is required')
    if (!form.problemNumber || form.problemNumber <= 0) return setError('Enter a valid problem number')
    if (form.timeTakenMinutes <= 0) return setError('Time taken must be greater than 0')
    onSave({ ...form, problemName: form.problemName.trim(), notes: form.notes.trim() })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? 'Edit problem' : 'Add problem'}
      footer={
        <div className="flex gap-2">
          {initial && onDelete && (
            <button
              className="btn h-11 shrink-0 bg-hard/15 px-3 text-hard"
              onClick={() => {
                onDelete()
                onClose()
              }}
              aria-label="Delete problem"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button className="btn-primary h-11 flex-1" onClick={submit}>
            <Plus size={16} /> {initial ? 'Save changes' : 'Log problem'}
          </button>
        </div>
      }
    >
      <div className="space-y-3.5">
        {error && (
          <p className="rounded-xl border border-hard/30 bg-hard/10 px-3 py-2 text-[12px] font-semibold text-hard">
            {error}
          </p>
        )}

        <div className="grid grid-cols-[92px_1fr] gap-2.5">
          <div>
            <label className="label">Number</label>
            <input
              className="field text-center font-mono"
              type="number"
              inputMode="numeric"
              placeholder="200"
              value={form.problemNumber || ''}
              onChange={(e) => set('problemNumber', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Problem name</label>
            <input
              className="field"
              placeholder="Number of Islands"
              value={form.problemName}
              onChange={(e) => set('problemName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Platform</label>
          <Choice options={PLATFORMS} value={form.platform} onChange={(v) => set('platform', v)} />
        </div>

        <div>
          <label className="label">Difficulty</label>
          <Choice
            options={DIFFS}
            value={form.difficulty}
            onChange={(v) => set('difficulty', v)}
            colors={{ Easy: '#00d4aa', Medium: '#ffa500', Hard: '#ff4757' }}
          />
        </div>

        <div>
          <label className="label">Pattern</label>
          <select
            className="field"
            value={form.pattern}
            onChange={(e) => set('pattern', e.target.value as Pattern)}
          >
            {ALL_PATTERNS.map((p) => (
              <option key={p} value={p} className="bg-surface2">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Java collections used ({form.javaCollectionsUsed.length})</label>
          <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            {COLLECTION_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-muted/70">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((c) => {
                    const active = form.javaCollectionsUsed.includes(c)
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCollection(c)}
                        className={clsx(
                          'rounded-lg border px-2 py-1 font-mono text-[10.5px] font-medium transition',
                          active
                            ? 'border-java/50 bg-java/20 text-java'
                            : 'border-white/[0.08] bg-white/[0.03] text-muted',
                        )}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <button
              type="button"
              className="text-[10.5px] font-semibold text-muted hover:text-ink"
              onClick={() => set('javaCollectionsUsed', [...ALL_COLLECTIONS])}
            >
              Select all
            </button>
            <button
              type="button"
              className="text-[10.5px] font-semibold text-muted hover:text-ink"
              onClick={() => set('javaCollectionsUsed', [])}
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <label className="label">Status</label>
          <Choice
            options={STATUSES}
            value={form.status}
            onChange={(v) => set('status', v)}
            colors={{ Solved: '#00d4aa', Attempted: '#ffa500', 'Need Revision': '#ff4757' }}
          />
        </div>

        <div>
          <label className="label">Approach quality</label>
          <Choice options={APPROACHES} value={form.approach} onChange={(v) => set('approach', v)} />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="label">Time taken (min)</label>
            <input
              className="field"
              type="number"
              inputMode="numeric"
              value={form.timeTakenMinutes}
              onChange={(e) => set('timeTakenMinutes', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Space complexity</label>
            <select
              className="field"
              value={form.spaceComplexity}
              onChange={(e) => set('spaceComplexity', e.target.value as SpaceComplexity)}
            >
              {SPACES.map((s) => (
                <option key={s} value={s} className="bg-surface2">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Date solved</label>
          <input
            className="field"
            type="date"
            value={form.solvedDate}
            onChange={(e) => set('solvedDate', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Notes / approach</label>
          <textarea
            className="field min-h-[88px] resize-none"
            placeholder="Key insight, edge cases, complexity…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>
    </Sheet>
  )
}
