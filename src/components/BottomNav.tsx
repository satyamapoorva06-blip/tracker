import { NavLink } from 'react-router-dom'
import { Home, Code2, Coffee, ListChecks, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useStore, todayKey } from '../store/useStore'

const items = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/dsa', label: 'DSA', Icon: Code2 },
  { to: '/java', label: 'Concepts', Icon: Coffee },
  { to: '/tasks', label: 'Tasks', Icon: ListChecks },
  { to: '/stats', label: 'Stats', Icon: BarChart3 },
]

export default function BottomNav() {
  const tasks = useStore((s) => s.tasks)
  const key = todayKey()
  const open = tasks.filter((t) => t.date === key && t.completed === 0).length

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 glass-nav"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
      aria-label="Primary"
    >
      <div className="flex h-[var(--nav-h)] items-stretch justify-around px-1.5">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="group relative flex flex-1 flex-col items-center justify-center gap-[5px] py-1.5"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute top-0 h-[2.5px] w-8 rounded-full bg-accent"
                    style={{ boxShadow: '0 0 12px rgba(0,212,170,0.75)' }}
                    transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                  />
                )}
                <span className="relative">
                  <Icon
                    size={19.5}
                    strokeWidth={isActive ? 2.4 : 1.9}
                    className={clsx('transition-colors duration-150', isActive ? 'text-accent' : 'text-muted group-active:text-ink')}
                  />
                  {to === '/tasks' && open > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-java px-1 text-[8.5px] font-bold leading-none text-[#2a1600] ring-2 ring-[#131a2e]">
                      {open > 9 ? '9+' : open}
                    </span>
                  )}
                </span>
                <span
                  className={clsx(
                    'text-[9.5px] font-semibold tracking-[0.02em] transition-colors',
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
