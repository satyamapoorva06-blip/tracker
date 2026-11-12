import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Circle, CircleDot, Copy, Coffee, Search, Sparkles, Trash2, Plus } from 'lucide-react'
import clsx from 'clsx'
import { useStore } from '../store/useStore'
import { Card, ProgressBar, Ring, SectionTitle, Sheet, EmptyState } from '../components/ui/Primitives'
import { TEMPLATES, CONCEPT_CATEGORY_LABELS, type Template } from '../data/seed'
import type { ConceptCategory, ConceptStatus, JavaConcept } from '../types'
import { pct } from '../lib/format'

const CATEGORY_ORDER: ConceptCategory[] = ['fundamentals', 'collections', 'java8']
const CATEGORY_COLORS: Record<ConceptCategory, string> = {
  fundamentals: '#f89820',
  collections: '#00d4aa',
  java8: '#7c9bff',
}
const STATUS_META: Record<ConceptStatus, { icon: string; label: string; color: string }> = {
  completed: { icon: '✓', label: 'Completed', color: '#00d4aa' },
  in_progress: { icon: '◐', label: 'In progress', color: '#ffa500' },
  not_started: { icon: '☐', label: 'Not started', color: '#64748b' },
}

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return (
    <button
      onClick={copy}
      className={clsx('btn-ghost shrink-0', small ? 'h-8 min-h-0 px-2.5 text-[11px]' : 'h-9 min-h-0 px-3 text-[11.5px]')}
    >
      {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function JavaConcepts() {
  const concepts = useStore((s) => s.concepts)
  const cycleConcept = useStore((s) => s.cycleConcept)
  const setConcept = useStore((s) => s.setConcept)
  const addConcept = useStore((s) => s.addConcept)
  const deleteConcept = useStore((s) => s.deleteConcept)

  const [tab, setTab] = useState<'progress' | 'templates'>('progress')
  const [openTemplate, setOpenTemplate] = useState<Template | null>(null)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [newTopic, setNewTopic] = useState('')
  const [newSub, setNewSub] = useState('')
  const [newCat, setNewCat] = useState<ConceptCategory>('fundamentals')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATEGORY_ORDER.map((cat) => {
      const items = concepts
        .filter((c) => c.category === cat)
        .filter((c) => !q || `${c.topic} ${c.subtopic}`.toLowerCase().includes(q))
      const completed = items.filter((c) => c.status === 'completed').length
      const inProgress = items.filter((c) => c.status === 'in_progress').length
      return { cat, items, completed, inProgress, total: items.length }
    })
  }, [concepts, query])

  const totalCompleted = concepts.filter((c) => c.status === 'completed').length
  const totalInProgress = concepts.filter((c) => c.status === 'in_progress').length
  const avgConfidence = concepts.length
    ? (concepts.reduce((a, c) => a + c.confidence, 0) / concepts.length).toFixed(1)
    : '0'

  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      !query ||
      `${t.title} ${t.subtitle} ${t.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between px-1 pt-1">
        <div>
          <h1 className="text-[19px] font-extrabold leading-tight">Java Concepts</h1>
          <p className="text-[11.5px] text-muted">Language mastery, separate from DSA</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-java/15 text-lg">☕</div>
      </header>

      {/* Overview */}
      <Card className="flex items-center gap-4 p-4">
        <Ring
          value={totalCompleted}
          max={Math.max(concepts.length, 1)}
          size={104}
          stroke={9}
          color="#f89820"
        >
          <span className="text-[19px] font-extrabold leading-none text-java">
            {pct(totalCompleted, Math.max(concepts.length, 1))}%
          </span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">mastered</span>
        </Ring>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted">Concepts completed</span>
            <span className="text-[12px] font-extrabold">
              {totalCompleted}/{concepts.length}
            </span>
          </div>
          <ProgressBar value={totalCompleted} max={Math.max(concepts.length, 1)} />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted">In progress</span>
            <span className="text-[12px] font-bold text-medium">{totalInProgress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted">Avg confidence</span>
            <span className="text-[12px] font-bold text-java">{avgConfidence}/5</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex rounded-xl bg-white/[0.05] p-1">
        {(['progress', 'templates'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'relative flex-1 rounded-lg py-2 text-[12px] font-bold capitalize transition-colors',
              tab === t ? 'text-[#04231d]' : 'text-muted',
            )}
          >
            {tab === t && (
              <motion.span
                layoutId="concept-tab"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{t === 'progress' ? 'Progress' : 'Templates'}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="field pl-9"
          placeholder={tab === 'progress' ? 'Search concepts…' : 'Search templates…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {tab === 'progress' && (
        <div className="space-y-3">
          {grouped.map((group) => (
            <Card key={group.cat} className="overflow-hidden">
              <div className="px-4 pt-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[13.5px] font-extrabold">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: CATEGORY_COLORS[group.cat] }}
                    />
                    {CONCEPT_CATEGORY_LABELS[group.cat]}
                  </h3>
                  <span className="text-[11px] font-bold" style={{ color: CATEGORY_COLORS[group.cat] }}>
                    {group.completed}/{group.total}
                  </span>
                </div>
                <ProgressBar
                  value={group.completed}
                  max={Math.max(group.total, 1)}
                  className="mt-2"
                  height={4}
                  color={CATEGORY_COLORS[group.cat]}
                />
                <p className="mt-1 text-[10.5px] text-muted">
                  {pct(group.completed, Math.max(group.total, 1))}% complete
                  {group.inProgress > 0 && ` · ${group.inProgress} in progress`}
                </p>
              </div>
              <div className="mt-2 divide-y divide-white/[0.05]">
                {group.items.length === 0 && (
                  <p className="px-4 py-4 text-center text-[11.5px] text-muted">Nothing matches your search</p>
                )}
                {group.items.map((c) => (
                  <ConceptRow
                    key={c.id}
                    concept={c}
                    onCycle={() => cycleConcept(c.id!)}
                    onConfidence={(n) => setConcept(c.id!, { confidence: n })}
                    onDelete={() => deleteConcept(c.id!)}
                  />
                ))}
              </div>
              <button
                className="flex w-full items-center justify-center gap-1 border-t border-white/[0.05] py-2.5 text-[11px] font-bold text-muted active:bg-white/[0.03]"
                onClick={() => {
                  setNewCat(group.cat)
                  setAddOpen(true)
                }}
              >
                <Plus size={12} /> Add concept
              </button>
            </Card>
          ))}
          <p className="px-2 text-center text-[10.5px] leading-relaxed text-muted/60">
            Tap the status icon to cycle ☐ → ◐ → ✓. Tap a dot to set your confidence.
          </p>
        </div>
      )}

      {tab === 'templates' && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/[0.06] px-3 py-2.5">
            <Sparkles size={14} className="shrink-0 text-accent" />
            <p className="text-[11.5px] leading-snug text-accent/95">
              {TEMPLATES.length} copy-paste Java templates. Tap to expand, then copy straight into your IDE.
            </p>
          </div>
          {filteredTemplates.length === 0 && (
            <EmptyState icon="🔍" title="No templates match" hint="Try 'hashmap', 'bfs', or 'binary'." />
          )}
          {filteredTemplates.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <button onClick={() => setOpenTemplate(t)} className="flex w-full items-center gap-3 px-3.5 py-3 text-left">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-base">
                  {t.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{t.title}</p>
                  <p className="truncate text-[10.5px] text-muted">{t.subtitle}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {t.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="chip hidden bg-white/[0.06] text-muted min-[380px]:inline-flex">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Template sheet */}
      <Sheet
        open={Boolean(openTemplate)}
        onClose={() => setOpenTemplate(null)}
        title={openTemplate?.title ?? ''}
        footer={<CopyButton text={openTemplate?.code ?? ''} />}
      >
        {openTemplate && (
          <>
            <p className="mb-2 text-[11.5px] text-muted">{openTemplate.subtitle}</p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {openTemplate.tags.map((tag) => (
                <span key={tag} className="chip bg-java/12 text-java">{tag}</span>
              ))}
            </div>
            <pre className="code-block whitespace-pre">{openTemplate.code}</pre>
            <p className="mt-2 text-[10.5px] text-muted">
              Pure Java — no imports needed beyond <span className="font-mono">java.util.*</span>.
            </p>
          </>
        )}
      </Sheet>

      {/* Add concept sheet */}
      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Java concept"
        footer={
          <button
            className="btn-primary h-11 w-full"
            onClick={() => {
              if (!newSub.trim()) return
              addConcept({
                topic: newTopic.trim() || CONCEPT_CATEGORY_LABELS[newCat],
                subtopic: newSub.trim(),
                category: newCat,
                status: 'not_started',
                confidence: 1,
              })
              setNewSub('')
              setNewTopic('')
              setAddOpen(false)
            }}
          >
            Add concept
          </button>
        }
      >
        <div className="space-y-3.5">
          <div>
            <label className="label">Category</label>
            <div className="flex gap-2">
              {CATEGORY_ORDER.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCat(c)}
                  className={clsx(
                    'flex-1 rounded-xl border py-2.5 text-[11px] font-semibold',
                    newCat === c ? 'border-accent/40 bg-accent/12 text-accent' : 'border-white/[0.08] bg-white/[0.04] text-muted',
                  )}
                >
                  {CONCEPT_CATEGORY_LABELS[c].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Topic</label>
            <input className="field" placeholder="OOP" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
          </div>
          <div>
            <label className="label">Concept</label>
            <input
              className="field"
              placeholder="Abstract classes vs interfaces"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
            />
          </div>
        </div>
      </Sheet>
    </div>
  )
}

function ConceptRow({
  concept,
  onCycle,
  onConfidence,
  onDelete,
}: {
  concept: JavaConcept
  onCycle: () => void
  onConfidence: (n: number) => void
  onDelete: () => void
}) {
  const meta = STATUS_META[concept.status]
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5">
      <button onClick={onCycle} className="tap -ml-1 h-9 w-9 shrink-0 rounded-lg active:bg-white/[0.06]" aria-label="Cycle status">
        {concept.status === 'completed' ? (
          <Check size={17} className="text-accent" />
        ) : concept.status === 'in_progress' ? (
          <CircleDot size={17} className="text-medium" />
        ) : (
          <Circle size={17} className="text-muted/60" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={clsx(
            'text-[12.5px] leading-snug',
            concept.status === 'completed' ? 'text-ink/90' : 'text-ink',
          )}
        >
          {concept.subtopic}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onConfidence(n)}
                className="h-3 w-3 rounded-full transition-transform active:scale-90"
                style={{
                  background: n <= concept.confidence ? meta.color : 'rgba(255,255,255,0.09)',
                }}
                aria-label={`Confidence ${n}`}
              />
            ))}
          </div>
          <span className="text-[9.5px] font-semibold uppercase tracking-wide text-muted/70">
            {meta.label}
          </span>
        </div>
      </div>
      {confirmDelete ? (
        <button className="tap h-8 w-8 shrink-0 text-hard" onClick={onDelete} aria-label="Confirm delete">
          <Trash2 size={14} />
        </button>
      ) : (
        <button
          className="tap h-8 w-8 shrink-0 text-muted/40 hover:text-muted"
          onClick={() => {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 2500)
          }}
          aria-label="Delete concept"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}
