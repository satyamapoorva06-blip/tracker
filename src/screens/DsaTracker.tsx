import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, Plus, SlidersHorizontal, ChevronDown, X, CalendarDays, Clock, Pencil,
  Layers3, TrendingUp, Target,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import clsx from 'clsx'
import { useStore } from '../store/useStore'
import { Card, DiffBadge, EmptyState, ProgressBar, SectionTitle, Sheet, Tag } from '../components/ui/Primitives'
import ProblemForm from '../components/ProblemForm'
import CheatSheetButton from '../components/CheatSheet'
import { ALL_PATTERNS, ALL_COLLECTIONS, DIFFICULTY_COLORS, DIFFICULTY_TARGETS, TOTAL_TARGET } from '../data/seed'
import { dShort, hm, pct } from '../lib/format'
import { problemStats } from '../lib/calc'
import type { Difficulty, DsaProblem, JavaCollection, Pattern, ProblemStatus } from '../types'

type SortKey = 'date' | 'difficulty' | 'time'
const DIFF_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }
const PAGE = 25

export default function DsaTracker() {
  const problems = useStore((s) => s.problems)
  const addProblem = useStore((s) => s.addProblem)
  const updateProblem = useStore((s) => s.updateProblem)
  const deleteProblem = useStore((s) => s.deleteProblem)
  const sessionCount = useStore((s) => s.sessions.length)

  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [pattern, setPattern] = useState<Pattern | 'All'>('All')
  const [status, setStatus] = useState<ProblemStatus | 'All'>('All')
  const [collection, setCollection] = useState<JavaCollection | 'All'>('All')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sort, setSort] = useState<SortKey>('date')
  const [filterOpen, setFilterOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<DsaProblem | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [limit, setLimit] = useState(PAGE)
  const [showPatterns, setShowPatterns] = useState(true)
  const [showCollections, setShowCollections] = useState(false)

  const stats = useMemo(() => problemStats(problems), [problems])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = problems.filter((p) => {
      if (q && !`${p.problemNumber} ${p.problemName} ${p.pattern}`.toLowerCase().includes(q)) return false
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false
      if (pattern !== 'All' && p.pattern !== pattern) return false
      if (status !== 'All' && p.status !== status) return false
      if (collection !== 'All' && !p.javaCollectionsUsed.includes(collection)) return false
      if (from && p.solvedDate < from) return false
      if (to && p.solvedDate > to) return false
      return true
    })
    return out.sort((a, b) => {
      if (sort === 'date') return b.solvedDate.localeCompare(a.solvedDate) || b.problemNumber - a.problemNumber
      if (sort === 'difficulty') return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] || b.solvedDate.localeCompare(a.solvedDate)
      return a.timeTakenMinutes - b.timeTakenMinutes
    })
  }, [problems, query, difficulty, pattern, status, collection, from, to, sort])

  const activeFilters =
    (difficulty !== 'All' ? 1 : 0) + (pattern !== 'All' ? 1 : 0) + (status !== 'All' ? 1 : 0) +
    (collection !== 'All' ? 1 : 0) + (from || to ? 1 : 0)

  const resetFilters = () => {
    setDifficulty('All'); setPattern('All'); setStatus('All'); setCollection('All'); setFrom(''); setTo('')
  }

  const topCollections = stats.collectionRows.slice(0, 5)
  const pieData = stats.collectionRows.slice(0, 5).map((r) => ({ name: r.name, value: r.count }))
  const PIE_COLORS = ['#00d4aa', '#f89820', '#7c9bff', '#c084fc', '#94a3b8', '#ffa500']

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-[19px] font-extrabold leading-tight">Java DSA Tracker</h1>
          <p className="text-[11.5px] text-muted">Every problem, in Java, tracked</p>
        </div>
        <CheatSheetButton compact />
      </header>

      {/* Headline stat */}
      <Card className="overflow-hidden p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">Total solved in Java</p>
            <p className="mt-0.5 text-[32px] font-extrabold leading-none tracking-tight">
              {stats.total}
              <span className="text-[15px] font-bold text-muted">/{TOTAL_TARGET}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="chip border border-accent/25 bg-accent/10 text-accent">
              {pct(stats.total, TOTAL_TARGET)}% of target
            </div>
            <p className="mt-1.5 text-[10.5px] text-muted">{TOTAL_TARGET - stats.total} to go</p>
          </div>
        </div>
        <ProgressBar value={stats.total} max={TOTAL_TARGET} height={8} className="mt-3" color="#f89820" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
            <div key={d} className="rounded-xl bg-white/[0.04] p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: DIFFICULTY_COLORS[d] }}>
                  {d}
                </span>
                <span className="text-[11px] font-extrabold">
                  {stats.byDiff[d]}<span className="font-semibold text-muted">/{DIFFICULTY_TARGETS[d]}</span>
                </span>
              </div>
              <ProgressBar
                value={stats.byDiff[d]}
                max={DIFFICULTY_TARGETS[d]}
                height={4}
                className="mt-1.5"
                color={DIFFICULTY_COLORS[d]}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            <Target size={11} /> Current pattern
          </div>
          <p className="mt-1 truncate text-[14px] font-extrabold text-java">
            {stats.patternRows[0]?.pattern ?? '—'}
          </p>
          <p className="text-[10.5px] text-muted">{stats.patternRows[0]?.count ?? 0} solved</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            <TrendingUp size={11} /> This week
          </div>
          <p className="mt-1 text-[14px] font-extrabold">{stats.weekCount} problems</p>
          <p className="text-[10.5px] text-muted">{sessionCount} study blocks logged</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            <Clock size={11} /> Avg time / problem
          </div>
          <p className="mt-1 text-[14px] font-extrabold text-accent">{stats.avgTime} min</p>
          <p className="text-[10.5px] text-muted">across {stats.total} solves</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            <Layers3 size={11} /> Need revision
          </div>
          <p className="mt-1 text-[14px] font-extrabold text-hard">{stats.revision.length}</p>
          <p className="text-[10.5px] text-muted">flagged for a re-solve</p>
        </Card>
      </div>

      {/* Collections usage strip */}
      <Card className="p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Collections used</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {topCollections.map((c) => (
            <span key={c.name} className="chip border border-java/25 bg-java/10 font-mono text-java">
              {c.name} ({c.count})
            </span>
          ))}
          {topCollections.length === 0 && <span className="text-[11px] text-muted">No problems logged yet</span>}
        </div>
      </Card>

      {/* Search + filter */}
      <div className="sticky top-0 z-20 -mx-4 space-y-2 bg-base/95 px-4 pb-2 pt-1 backdrop-blur">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="field pl-9"
              placeholder="Search #, name, pattern…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE) }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className={clsx(
              'btn relative h-11 shrink-0 px-3',
              activeFilters ? 'bg-accent/15 text-accent' : 'bg-white/[0.06] text-muted',
            )}
            onClick={() => setFilterOpen(true)}
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-[#04231d]">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setLimit(PAGE) }}
              className={clsx(
                'chip shrink-0 border px-3 py-1.5',
                difficulty === d
                  ? 'border-transparent bg-white/[0.14] text-ink'
                  : 'border-white/[0.06] bg-white/[0.03] text-muted',
              )}
            >
              {d}
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px shrink-0 bg-white/10" />
          {(['date', 'difficulty', 'time'] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={clsx(
                'chip shrink-0 border px-3 py-1.5 capitalize',
                sort === s
                  ? 'border-accent/30 bg-accent/10 text-accent'
                  : 'border-white/[0.06] bg-white/[0.03] text-muted',
              )}
            >
              {s === 'time' ? 'time ↑' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      <div>
        <SectionTitle
          title={`Problem log · ${filtered.length}`}
          action={
            activeFilters > 0 ? (
              <button onClick={resetFilters} className="text-[11px] font-bold text-hard">
                Clear filters
              </button>
            ) : undefined
          }
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No problems match"
            hint="Try clearing filters, or log a new problem with the + button."
          />
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, limit).map((p) => {
              const isOpen = expanded === p.id
              return (
                <Card key={p.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : p.id!)}
                    className="w-full px-3.5 py-3 text-left"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] font-bold text-muted">
                        #{p.problemNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-bold leading-snug">{p.problemName}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <DiffBadge d={p.difficulty} />
                          <Tag color="#7c9bff">{p.pattern}</Tag>
                          {p.status !== 'Solved' && (
                            <Tag color={p.status === 'Attempted' ? '#ffa500' : '#ff4757'}>{p.status}</Tag>
                          )}
                        </div>
                        {p.javaCollectionsUsed.length > 0 && (
                          <p className="mt-1.5 truncate font-mono text-[10.5px] text-muted">
                            {p.javaCollectionsUsed.join(', ')}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-2.5 text-[10.5px] text-muted">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={10} /> {dShort(p.solvedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {p.timeTakenMinutes}m
                          </span>
                          <span>· {p.approach}</span>
                          <span>· {p.spaceComplexity}</span>
                        </div>
                      </div>
                      <ChevronDown
                        size={15}
                        className={clsx('mt-1 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')}
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] px-3.5 py-3">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="rounded-lg bg-white/[0.04] px-2.5 py-1.5">
                              <span className="text-muted">Platform</span>
                              <p className="font-semibold">{p.platform}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-2.5 py-1.5">
                              <span className="text-muted">Approach</span>
                              <p className="font-semibold">{p.approach}</p>
                            </div>
                          </div>
                          <p className="mt-2.5 text-[12px] leading-relaxed text-ink/85">
                            {p.notes || <span className="italic text-muted">No notes yet — tap edit to add your approach.</span>}
                          </p>
                          <div className="mt-2.5 flex gap-2">
                            <button
                              className="btn-ghost h-9 min-h-0 flex-1 text-[11.5px]"
                              onClick={() => { setEditing(p); setAddOpen(true) }}
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              className="btn-ghost h-9 min-h-0 flex-1 text-[11.5px] text-accent"
                              onClick={() => updateProblem(p.id!, { status: 'Need Revision' })}
                            >
                              Mark for revision
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )
            })}
            {filtered.length > limit && (
              <button className="btn-ghost w-full text-xs" onClick={() => setLimit((l) => l + PAGE)}>
                Show {Math.min(PAGE, filtered.length - limit)} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pattern breakdown */}
      <div>
        <SectionTitle
          title="Pattern breakdown"
          action={
            <button
              className="flex items-center gap-1 text-[11px] font-bold text-muted"
              onClick={() => setShowPatterns((v) => !v)}
            >
              {showPatterns ? 'Hide' : 'Show'}
              <ChevronDown size={12} className={clsx('transition-transform', showPatterns && 'rotate-180')} />
            </button>
          }
        />
        {showPatterns && (
          <Card className="p-3">
            <div style={{ height: Math.min(560, stats.patternRows.length * 26 + 20) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.patternRows}
                  layout="vertical"
                  margin={{ top: 4, right: 42, bottom: 0, left: 0 }}
                  barCategoryGap={4}
                >
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis
                    type="category"
                    dataKey="pattern"
                    width={96}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    formatter={(v: number, _n, p: any) => [`${v}/${p.payload.target} solved`, 'Progress']}
                  />
                  <Bar dataKey="count" radius={[0, 5, 5, 0]} barSize={11}>
                    {stats.patternRows.map((r) => (
                      <Cell
                        key={r.pattern}
                        fill={r.percent >= 80 ? '#00d4aa' : r.percent >= 40 ? '#f89820' : '#ff4757'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 flex items-center justify-center gap-3 text-[9.5px] text-muted">
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-accent" /> ≥80%</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-java" /> 40–79%</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-hard" /> &lt;40%</span>
            </div>
          </Card>
        )}
      </div>

      {/* Collections pie */}
      <div>
        <SectionTitle
          title="Java collections usage"
          action={
            <button
              className="flex items-center gap-1 text-[11px] font-bold text-muted"
              onClick={() => setShowCollections((v) => !v)}
            >
              {showCollections ? 'Hide' : 'Show'}
              <ChevronDown size={12} className={clsx('transition-transform', showCollections && 'rotate-180')} />
            </button>
          }
        />
        {showCollections && (
          <Card className="p-2">
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, n) => [`${v} problems`, n]} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 10.5 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {pieData.length === 0 && <p className="pb-3 text-center text-[11px] text-muted">No data yet</p>}
          </Card>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => { setEditing(null); setAddOpen(true) }}
        className="fixed bottom-[calc(var(--nav-h)+var(--safe-bottom)+16px)] right-[max(16px,calc(50%-244px))] z-40 flex h-14 items-center gap-2 rounded-full bg-java px-5 font-bold text-[#2a1600] shadow-[0_12px_30px_-8px_rgba(248,152,32,0.7)]"
        aria-label="Add problem"
      >
        <Plus size={20} strokeWidth={3} /> <span className="text-[13px]">Problem</span>
      </motion.button>

      <ProblemForm
        open={addOpen}
        onClose={() => { setAddOpen(false); setEditing(null) }}
        initial={editing}
        onSave={(p) => (editing ? updateProblem(editing.id!, p) : addProblem(p))}
        onDelete={editing ? () => deleteProblem(editing.id!) : undefined}
      />

      {/* Filter sheet */}
      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter problems"
        footer={
          <div className="flex gap-2">
            <button className="btn-ghost h-11 flex-1 text-xs" onClick={resetFilters}>
              Reset
            </button>
            <button className="btn-primary h-11 flex-1 text-xs" onClick={() => setFilterOpen(false)}>
              Show {filtered.length} problems
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Pattern</label>
            <select className="field" value={pattern} onChange={(e) => setPattern(e.target.value as any)}>
              <option value="All">All patterns</option>
              {ALL_PATTERNS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {['All', 'Solved', 'Attempted', 'Need Revision'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Collection used</label>
            <select className="field" value={collection} onChange={(e) => setCollection(e.target.value as any)}>
              <option value="All">Any collection</option>
              {ALL_COLLECTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="label">From</label>
              <input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="label">To</label>
              <input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Sort by</label>
            <div className="flex gap-2">
              {(['date', 'difficulty', 'time'] as SortKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={clsx(
                    'flex-1 rounded-xl border py-2.5 text-[12px] font-semibold capitalize',
                    sort === s ? 'border-accent/40 bg-accent/12 text-accent' : 'border-white/[0.08] bg-white/[0.04] text-muted',
                  )}
                >
                  {s === 'time' ? 'Time taken' : s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-[11px] text-muted">
            {filtered.length} of {problems.length} problems match
          </p>
        </div>
      </Sheet>
    </div>
  )
}
