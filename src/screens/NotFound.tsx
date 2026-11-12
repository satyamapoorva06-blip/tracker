import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Logo size={60} className="opacity-90" />
      <h1 className="mt-5 text-[17px] font-extrabold tracking-tighter2">Page not found</h1>
      <p className="mt-1 max-w-[260px] text-[12.5px] leading-relaxed text-muted">
        This route doesn&apos;t exist — but your progress is safe in IndexedDB.
      </p>
      <Link to="/" className="btn-primary mt-5 px-4 text-[12.5px]">
        <ArrowLeft size={14} /> Back to dashboard
      </Link>
    </div>
  )
}
