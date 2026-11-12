import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

/**
 * In-app splash, shown while IndexedDB seeds on the very first launch.
 * The static HTML splash in index.html covers the pre-React paint.
 */
export default function SplashGate({ children }: { children: ReactNode }) {
  const ready = useStore((s) => s.ready)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (ready) {
      const id = window.setTimeout(() => setShow(false), 220)
      return () => window.clearTimeout(id)
    }
  }, [ready])

  return (
    <>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-base"
            style={{ background: 'radial-gradient(120% 80% at 50% 0%, #1f2b47 0%, #1a1a2e 55%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 12px 28px rgba(248,152,32,0.35))' }}
            >
              ☕
            </motion.div>
            <div className="text-xl font-extrabold tracking-tight">JavaPrepTracker</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Java DSA · Placement Prep
            </div>
            <div className="mt-1 h-[3px] w-32 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full w-1/3 rounded-full"
                style={{ background: 'linear-gradient(90deg,#00d4aa,#f89820)' }}
                animate={{ x: ['-110%', '320%'] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
