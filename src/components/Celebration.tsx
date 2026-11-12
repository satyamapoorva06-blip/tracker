import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useStore, todayKey } from '../store/useStore'
import { hm } from '../lib/format'
import { sessionTotals } from '../lib/calc'

export default function Celebration() {
  const celebrating = useStore((s) => s.celebrating)
  const setCelebrating = useStore((s) => s.setCelebrating)
  const tasks = useStore((s) => s.tasks)
  const sessions = useStore((s) => s.sessions)
  const settings = useStore((s) => s.settings)

  const dayTasks = tasks.filter((t) => t.date === todayKey())
  const done = dayTasks.filter((t) => t.completed === 1).length
  const studied = sessionTotals(sessions.filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i)).todayMinutes

  useEffect(() => {
    if (!celebrating) return
    if (!settings.confetti) return
    const colors = ['#00d4aa', '#f89820', '#ffa500', '#e2e8f0']
    confetti({ particleCount: 90, spread: 78, origin: { y: 0.72 }, colors, scalar: 0.9 })
    const t = window.setTimeout(
      () => confetti({ particleCount: 55, spread: 110, origin: { x: 0.5, y: 0.5 }, colors, scalar: 1.1, startVelocity: 28 }),
      260,
    )
    return () => window.clearTimeout(t)
  }, [celebrating, settings.confetti])

  return (
    <AnimatePresence>
      {celebrating && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-base/92 backdrop-blur-sm" onClick={() => setCelebrating(false)} />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-accent/25 bg-surface2 p-6 text-center shadow-glow"
          >
            <motion.div
              className="mx-auto mb-3 text-5xl"
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8 }}
            >
              🎉
            </motion.div>
            <h2 className="text-xl font-extrabold">Day Complete!</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Every task on today&apos;s Java plan is checked off. That&apos;s how placements get won.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white/[0.05] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Tasks</div>
                <div className="mt-0.5 text-lg font-extrabold text-accent">{done}/{dayTasks.length}</div>
              </div>
              <div className="rounded-2xl bg-white/[0.05] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Studied</div>
                <div className="mt-0.5 text-lg font-extrabold text-java">{hm(studied)}</div>
              </div>
            </div>

            <button className="btn-primary mt-5 w-full" onClick={() => setCelebrating(false)}>
              Keep the streak alive 🔥
            </button>
            <button
              className="mt-2 w-full py-2 text-[12px] font-semibold text-muted hover:text-ink"
              onClick={() => setCelebrating(false)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
