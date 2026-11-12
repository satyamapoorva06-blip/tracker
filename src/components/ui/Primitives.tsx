import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const Comp: any = onClick ? motion.button : 'div'
  return (
    <Comp
      {...(onClick ? { whileTap: { scale: 0.985 }, onClick, type: 'button' } : {})}
      className={clsx('card text-left', className)}
    >
      {children}
    </Comp>
  )
}

export function SectionTitle({
  title,
  action,
  icon,
}: {
  title: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="mb-2.5 mt-1 flex items-center justify-between px-1">
      <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  )
}

export function ProgressBar({
  value,
  max,
  color = '#00d4aa',
  height = 6,
  className,
  track = 'rgba(255,255,255,0.07)',
}: {
  value: number
  max: number
  color?: string
  height?: number
  className?: string
  track?: string
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={clsx('w-full overflow-hidden rounded-full', className)}
      style={{ height, background: track }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export function Ring({
  value,
  max,
  size = 148,
  stroke = 11,
  color = '#00d4aa',
  children,
  track = 'rgba(255,255,255,0.07)',
}: {
  value: number
  max: number
  size?: number
  stroke?: number
  color?: string
  children?: ReactNode
  track?: string
}) {
  const pct = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)', filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function DiffBadge({ d }: { d: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: 'bg-easy/12 text-easy border-easy/25',
    Medium: 'bg-medium/12 text-medium border-medium/25',
    Hard: 'bg-hard/12 text-hard border-hard/25',
  } as const
  return <span className={clsx('chip border', map[d])}>{d}</span>
}

export function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="chip border"
      style={{
        color: color ?? '#94a3b8',
        borderColor: `${color ?? '#94a3b8'}40`,
        background: `${color ?? '#94a3b8'}14`,
      }}
    >
      {children}
    </span>
  )
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <motion.div
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0.6, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-surface2 pb-[var(--safe-bottom)] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
          <h3 className="text-base font-bold">{title}</h3>
          <button onClick={onClose} className="tap -mr-2 rounded-xl px-3 text-muted hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && <div className="border-t border-white/[0.07] px-4 py-3 pb-[max(12px,var(--safe-bottom))]">{footer}</div>}
      </motion.div>
    </div>
  )
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/[0.08] px-6 py-10 text-center">
      <div className="text-3xl opacity-70">{icon}</div>
      <p className="text-sm font-semibold text-ink/90">{title}</p>
      {hint && <p className="max-w-[260px] text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  )
}

export function Stat({ label, value, hint, color }: { label: string; value: ReactNode; hint?: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">{label}</span>
      <span className="text-[17px] font-extrabold leading-tight" style={color ? { color } : undefined}>
        {value}
      </span>
      {hint && <span className="text-[10.5px] text-muted/80">{hint}</span>}
    </div>
  )
}
