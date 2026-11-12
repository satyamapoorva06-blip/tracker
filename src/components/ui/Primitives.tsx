import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

/* ─────────────────────────────────────────────────────────────────────
   Surfaces
   ───────────────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  onClick,
  raised = false,
  hairline = false,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  raised?: boolean
  hairline?: boolean
}) {
  const Comp: any = onClick ? motion.button : 'div'
  return (
    <Comp
      {...(onClick ? { whileTap: { scale: 0.988 }, onClick, type: 'button' } : {})}
      className={clsx('card', raised && 'card-raised', hairline && 'hairline', className)}
    >
      {children}
    </Comp>
  )
}

export function SectionTitle({
  title,
  action,
  icon,
  className,
}: {
  title: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('mb-2 mt-1 flex items-center justify-between px-1', className)}>
      <h2 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-caps text-muted">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Data viz primitives
   ───────────────────────────────────────────────────────────────────── */

export function ProgressBar({
  value,
  max,
  color = '#00d4aa',
  height = 5,
  className,
  track = 'rgba(255,255,255,0.075)',
  gradient = false,
}: {
  value: number
  max: number
  color?: string
  height?: number
  className?: string
  track?: string
  gradient?: boolean
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
        className="h-full rounded-full transition-[width] duration-700 ease-spring"
        style={{
          width: `${pct}%`,
          background: gradient ? `linear-gradient(90deg, ${color}99, ${color})` : color,
        }}
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
  glow = true,
}: {
  value: number
  max: number
  size?: number
  stroke?: number
  color?: string
  children?: ReactNode
  track?: string
  glow?: boolean
}) {
  const pct = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
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
          style={{
            transition: 'stroke-dashoffset 800ms cubic-bezier(.2,.9,.2,1)',
            filter: glow ? `drop-shadow(0 0 5px ${color}55)` : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Badges
   ───────────────────────────────────────────────────────────────────── */

export function DiffBadge({ d, dim = false }: { d: 'Easy' | 'Medium' | 'Hard'; dim?: boolean }) {
  const map = {
    Easy: 'text-easy bg-easy/[0.11] border-easy/25',
    Medium: 'text-medium bg-medium/[0.11] border-medium/25',
    Hard: 'text-hard bg-hard/[0.11] border-hard/25',
  } as const
  return (
    <span
      className={clsx(
        'chip border tracking-[0.02em]',
        map[d],
        dim && 'opacity-80',
      )}
    >
      {d}
    </span>
  )
}

export function Tag({ children, color = '#94a3b8' }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="chip border"
      style={{ color, borderColor: `${color}3d`, background: `${color}14` }}
    >
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Segmented control
   ───────────────────────────────────────────────────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  layoutId,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
  layoutId: string
}) {
  return (
    <div
      className={clsx(
        'flex gap-1 rounded-xl p-1',
        className,
      )}
      style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.06)' }}
      role="tablist"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={clsx('segment', active ? 'text-[#04231d]' : 'text-muted hover:text-ink')}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-lg bg-accent"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Sheet (bottom sheet on mobile, dialog on desktop)
   ───────────────────────────────────────────────────────────────────── */

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  subtitle,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  subtitle?: string
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 48, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 460, damping: 40 }}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-[26px] bg-surface2 pb-[var(--safe-bottom)] shadow-menu sm:rounded-[26px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
      >
        <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-white/20 sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-2.5">
          <div className="min-w-0">
            <h3 className="text-[15.5px] font-bold leading-tight">{title}</h3>
            {subtitle && <p className="mt-0.5 text-[11.5px] text-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="icon-btn -mr-1" aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        {footer && (
          <div className="border-t border-white/[0.07] px-4 py-3 pb-[max(12px,var(--safe-bottom))]">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Empty + stat
   ───────────────────────────────────────────────────────────────────── */

export function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-2xl px-6 py-10 text-center"
      style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.05] text-muted">{icon}</div>
      <p className="text-[13.5px] font-semibold text-ink/95">{title}</p>
      {hint && <p className="max-w-[280px] text-[11.5px] leading-relaxed text-muted">{hint}</p>}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
  color,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  color?: string
  className?: string
}) {
  return (
    <div className={clsx('flex min-w-0 flex-col', className)}>
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</span>
      <span className="metric mt-1 truncate text-[17px]" style={color ? { color } : undefined}>
        {value}
      </span>
      {hint && <span className="mt-0.5 truncate text-[10px] text-muted/85">{hint}</span>}
    </div>
  )
}

/** KPI tile — the recurring "one number + label + sparkline/bar" block. */
export function KpiTile({
  label,
  value,
  hint,
  color = '#00d4aa',
  progress,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  color?: string
  progress?: { value: number; max: number }
  icon?: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx('min-w-0 rounded-xl px-2.5 py-2.5', className)}
      style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.045)' }}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span style={{ color }}>{icon}</span>}
        <span className="truncate text-[9.5px] font-semibold uppercase tracking-[0.09em] text-muted">
          {label}
        </span>
      </div>
      <p className="metric mt-1.5 truncate text-[16px]" style={{ color }}>
        {value}
      </p>
      {progress && (
        <ProgressBar
          value={progress.value}
          max={progress.max}
          color={color}
          height={3}
          className="mt-1.5"
        />
      )}
      {hint && <p className="mt-1.5 truncate text-[9.5px] text-muted/80">{hint}</p>}
    </div>
  )
}
