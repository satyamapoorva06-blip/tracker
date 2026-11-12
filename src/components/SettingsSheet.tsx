import { useRef, useState } from 'react'
import { Download, Upload, RefreshCw, Vibrate, PartyPopper, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Sheet } from './ui/Primitives'

function Toggle({
  on,
  onChange,
  label,
  hint,
  icon,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
  hint: string
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors active:bg-white/[0.06]"
      style={{ background: 'rgba(255,255,255,0.032)', border: '1px solid rgba(255,255,255,0.045)' }}
    >
      <span className="text-muted">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold">{label}</span>
        <span className="block text-[10.5px] text-muted">{hint}</span>
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: on ? '#00d4aa' : 'rgba(255,255,255,0.12)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: on ? 22 : 2 }}
        />
      </span>
    </button>
  )
}

export default function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const exportData = useStore((s) => s.exportData)
  const importData = useStore((s) => s.importData)
  const resetDemo = useStore((s) => s.resetDemo)
  const showToast = useStore((s) => s.showToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const doExport = async () => {
    const json = await exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `javapreptracker-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup downloaded', 'ok')
  }

  return (
    <Sheet open={open} onClose={onClose} title="Settings" subtitle="Preferences, timer and local data">
      <div className="space-y-3">
        <p className="label mb-0 flex items-center gap-1.5">
          <i className="h-1 w-1 rounded-full bg-accent" /> Experience
        </p>
        <Toggle
          on={settings.haptics}
          onChange={(v) => updateSettings({ haptics: v })}
          label="Haptic feedback"
          hint="Short vibration when checking off a task"
          icon={<Vibrate size={16} />}
        />
        <Toggle
          on={settings.confetti}
          onChange={(v) => updateSettings({ confetti: v })}
          label="Celebration confetti"
          hint="Fire confetti when the whole day is complete"
          icon={<PartyPopper size={16} />}
        />

        <div className="divider my-1" />
        <p className="label mb-0 flex items-center gap-1.5">
          <i className="h-1 w-1 rounded-full bg-java" /> Pomodoro
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Focus (min)</label>
            <input
              type="number"
              className="field"
              value={settings.timerMinutes}
              onChange={(e) => updateSettings({ timerMinutes: Math.max(5, Number(e.target.value) || 25) })}
            />
          </div>
          <div>
            <label className="label">Break (min)</label>
            <input
              type="number"
              className="field"
              value={settings.breakMinutes}
              onChange={(e) => updateSettings({ breakMinutes: Math.max(1, Number(e.target.value) || 5) })}
            />
          </div>
        </div>

        <div className="divider my-1" />
        <p className="label mb-0 flex items-center gap-1.5">
          <i className="h-1 w-1 rounded-full bg-sky" /> Data · on this device only
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost text-[12px]" onClick={doExport}>
            <Download size={14} /> Export JSON
          </button>
          <button className="btn-ghost text-[12px]" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Import JSON
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
              await importData(await file.text())
            } catch (err) {
              showToast((err as Error).message || 'Import failed', 'warn')
            }
            e.target.value = ''
          }}
        />
        <button
          className="btn h-11 w-full bg-hard/12 text-[12px] text-hard"
          onClick={async () => {
            if (!confirmReset) {
              setConfirmReset(true)
              window.setTimeout(() => setConfirmReset(false), 3000)
              return
            }
            await resetDemo()
            setConfirmReset(false)
            onClose()
          }}
        >
          <RefreshCw size={14} /> {confirmReset ? 'Tap again to confirm reset' : 'Reset to demo data'}
        </button>

        <div className="mt-2 flex items-start gap-2 rounded-xl border border-white/[0.055] bg-white/[0.025] p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-muted" />
          <p className="text-[10.5px] leading-relaxed text-muted">
            JavaPrepTracker keeps everything in IndexedDB on this device. No account, no server, no
            analytics. Export a JSON backup before clearing browser data.
          </p>
        </div>
      </div>
    </Sheet>
  )
}
