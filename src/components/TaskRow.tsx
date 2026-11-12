import { useRef, useState, type PointerEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Clock, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import type { Task } from '../types'
import { priorityMeta } from '../lib/format'

const LANG_COLORS: Record<string, string> = {
  Java: '#f89820',
  Python: '#7c9bff',
  JS: '#ffd166',
  SQL: '#c084fc',
  Theory: '#94a3b8',
}

export default function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const [dx, setDx] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const startX = useRef<number | null>(null)
  const startY = useRef(0)
  const pressing = useRef(false)
  const longPressTimer = useRef<number | null>(null)
  const moved = useRef(false)
  const [pressingVisual, setPressingVisual] = useState(false)
  const done = task.completed === 1
  const priority = priorityMeta[task.priority]

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setPressingVisual(false)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    startX.current = e.clientX
    startY.current = e.clientY
    moved.current = false
    pressing.current = true
    setPressingVisual(true)
    longPressTimer.current = window.setTimeout(() => {
      if (!moved.current && pressing.current) {
        setPressingVisual(false)
        onEdit()
      }
    }, 520)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return
    const deltaX = e.clientX - startX.current
    const deltaY = e.clientY - startY.current
    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      moved.current = true
      clearLongPress()
    }
    if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setDx(Math.max(-96, deltaX))
    } else if (deltaX > 0 && dx < 0) {
      setDx(Math.min(0, -96 + deltaX))
    }
  }

  const onPointerUp = () => {
    pressing.current = false
    startX.current = null
    clearLongPress()
    if (dx < -56) setDx(-88)
    else setDx(0)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Swipe backdrop */}
      <div aria-hidden className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-hard/90">
        <button
          onClick={() => {
            if (confirmDelete) onDelete()
            else {
              setConfirmDelete(true)
              window.setTimeout(() => setConfirmDelete(false), 2500)
            }
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-white"
        >
          <Trash2 size={17} />
          {confirmDelete ? 'Confirm' : 'Delete'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: dx }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 40 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onEdit}
          className={clsx(
            'relative flex touch-pan-y items-start gap-3 bg-surface px-3.5 py-3 transition-colors',
            pressingVisual && 'bg-surface2',
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!moved.current) onToggle()
            }}
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors"
            style={{
              borderColor: done ? '#00d4aa' : 'rgba(148,163,184,0.4)',
              background: done ? '#00d4aa' : 'transparent',
            }}
            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          >
            <AnimatePresence>
              {done && (
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                >
                  <Check size={15} strokeWidth={3.5} className="text-[#04231d]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={clsx(
                'text-[13px] leading-snug transition-colors',
                done ? 'text-muted line-through' : 'font-medium text-ink',
              )}
            >
              {task.title}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted">
              <span className="flex items-center gap-0.5">
                <Clock size={9} /> {task.estimatedMinutes}m
              </span>
              <span className="flex items-center gap-0.5" title={`${task.priority} priority`}>
                {priority.dot} {task.priority}
              </span>
              <span
                className="rounded px-1 py-[1px] font-mono font-semibold"
                style={{
                  color: LANG_COLORS[task.language],
                  background: `${LANG_COLORS[task.language]}18`,
                }}
              >
                [{task.language}]
              </span>
              {task.repeat !== 'None' && (
                <span className="flex items-center gap-0.5 text-accent/80">
                  <AlertTriangle size={9} /> {task.repeat}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
