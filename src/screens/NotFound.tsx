import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-5xl">☕</div>
      <h1 className="mt-3 text-lg font-extrabold">Page not found</h1>
      <p className="mt-1 max-w-[260px] text-[12.5px] leading-relaxed text-muted">
        This route doesn&apos;t exist — but your progress is safe in IndexedDB.
      </p>
      <Link to="/" className="btn-primary mt-5 px-5 text-sm">
        Back to dashboard
      </Link>
    </div>
  )
}
