import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import Celebration from './components/Celebration'
import InstallPrompt from './components/InstallPrompt'
import SplashGate from './components/SplashGate'
import Home from './screens/Home'
import DsaTracker from './screens/DsaTracker'
import JavaConcepts from './screens/JavaConcepts'
import Tasks from './screens/Tasks'
import Stats from './screens/Stats'
import Widget from './screens/Widget'
import NotFound from './screens/NotFound'

const NAV_ROUTES = ['/', '/dsa', '/java', '/tasks', '/stats']

export default function App({ onReady }: { onReady?: () => void }) {
  const init = useStore((s) => s.init)
  const ready = useStore((s) => s.ready)
  const tick = useStore((s) => s.tick)
  const timerRunning = useStore((s) => s.timer.running)
  const location = useLocation()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (!ready) return
    const id = window.setTimeout(() => onReady?.(), 60)
    return () => window.clearTimeout(id)
  }, [ready, onReady])

  // Single global pomodoro ticker
  useEffect(() => {
    if (!timerRunning) return
    const id = window.setInterval(() => tick(), 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, tick])

  const showNav = NAV_ROUTES.includes(location.pathname)

  return (
    <SplashGate>
      <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col bg-base">
        <main
          className="flex-1 px-4 pb-[calc(var(--nav-h)+var(--safe-bottom)+20px)]"
          key="main"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/dsa" element={<DsaTracker />} />
                <Route path="/java" element={<JavaConcepts />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/widget" element={<Widget />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        {showNav && <BottomNav />}
      </div>
      <Toast />
      <Celebration />
      <InstallPrompt />
    </SplashGate>
  )
}
