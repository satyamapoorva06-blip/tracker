import { useEffect, useState } from 'react'
import Logo from './Logo'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useStore } from '../store/useStore'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'javaprep-install-dismissed'

export default function InstallPrompt() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === '1' || settings.installPromptDismissed
    if (dismissed) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as BeforeInstallPromptEvent)
      // Only surface the prompt after the user has had a moment in the app.
      window.setTimeout(() => setVisible(true), 6000)
    }
    const onInstalled = () => {
      setVisible(false)
      localStorage.setItem(DISMISS_KEY, '1')
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    // iOS/Safari never fires beforeinstallprompt — show a hint instead.
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    let iosTimer = 0
    if (isIOS && !standalone) iosTimer = window.setTimeout(() => setVisible(true), 6000)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.clearTimeout(iosTimer)
    }
  }, [settings.installPromptDismissed])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, '1')
    updateSettings({ installPromptDismissed: true })
  }

  const install = async () => {
    if (evt) {
      await evt.prompt()
      const choice = await evt.userChoice
      if (choice.outcome === 'accepted') dismiss()
      else setVisible(false)
    } else {
      setVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-[calc(var(--nav-h)+var(--safe-bottom)+10px)] z-[65] mx-auto w-[calc(100%-24px)] max-w-[480px]"
        >
          <div className="flex items-center gap-3 rounded-2xl p-3 shadow-menu backdrop-blur-xl"
            style={{ background: 'rgba(28,41,70,0.96)', border: '1px solid rgba(0,212,170,0.28)' }}>
            <Logo size={42} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold leading-tight">Install JavaPrepTracker</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">
                Home screen app · works fully offline
              </p>
            </div>
            <button className="btn-primary h-9 min-h-0 shrink-0 px-3 text-xs" onClick={install}>
              <Download size={14} /> Add
            </button>
            <button className="tap -ml-1 h-9 min-h-0 w-8 shrink-0 text-muted" onClick={dismiss} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
