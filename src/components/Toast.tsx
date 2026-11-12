import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const Icon = toast?.tone === 'ok' ? CheckCircle2 : toast?.tone === 'warn' ? AlertTriangle : Info
  const color = toast?.tone === 'ok' ? '#00d4aa' : toast?.tone === 'warn' ? '#ffa500' : '#94a3b8'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--nav-h)+var(--safe-bottom)+14px)] z-[70] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-surface2/95 px-4 py-2.5 text-[13px] font-semibold shadow-card backdrop-blur"
          >
            <Icon size={16} style={{ color }} />
            <span className="max-w-[280px] truncate">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
