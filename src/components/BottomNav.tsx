import { NavLink } from 'react-router-dom'
import { Home, Code2, Coffee, ListChecks, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useStore, todayKey } from '../store/useStore'

const items = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/dsa', label: 'DSA', Icon: Code2 },
  { to: '/java', label: 'Java', Icon: Coffee },
  { to: '/tasks', label: 'Tasks', Icon: ListChecks },
  { to: '/stats', label: 'Stats', Icon: BarChart3 },
]

export default function BottomNav() {
  const tasks = useStore((s) => s.tasks)
  const key = todayKey()
  const open = tasks.filter((t) => t.date === key && t.completed === 0).length

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 border-t border-white/[0.06] glass-nav"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex h-[var(--nav-h)] items-stretch justify-around px-1">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-2 inset-y-1.5 rounded-xl bg-accent/[0.12]"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  />
                )}
                <span className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.6 : 2}
                    className={clsx('transition-colors', isActive ? 'text-accent' : 'text-muted')}
                  />
                  {to === '/tasks' && open > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-java px-1 text-[9px] font-bold text-[#2a1600]">
                      {open > 9 ? '9+' : open}
                    </span>
                  )}
                </span>
                <span
                  className={clsx(
                    'relative text-[10px] font-semibold tracking-wide',
                    isActive ? 'text-accent' : 'text-muted',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
