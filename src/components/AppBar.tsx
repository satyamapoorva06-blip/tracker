import type { ReactNode } from 'react'
import clsx from 'clsx'

/**
 * Sticky screen header. Replaces the bespoke <header> blocks so all five
 * screens share one rhythm: eyebrow → title → actions, over a frosted bar.
 */
export default function AppBar({
  eyebrow,
  title,
  subtitle,
  actions,
  sticky = true,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  sticky?: boolean
}) {
  return (
    <header className={clsx('appbar', !sticky && 'static')}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow truncate">{eyebrow}</p>}
          <h1 className={clsx('screen-title truncate', eyebrow && 'mt-1')}>{title}</h1>
          {subtitle && <p className="mt-1 truncate text-[11.5px] text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
      </div>
      <span className="appbar-line" aria-hidden />
    </header>
  )
}
