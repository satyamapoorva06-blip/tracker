/**
 * Brand mark — the same coffee-cup glyph as the PWA icon, inlined as SVG so it
 * stays crisp at any size and costs zero extra requests (offline-first).
 */
export default function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="JavaPrepTracker"
    >
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="0.28" y2="1">
          <stop offset="0%" stopColor="#2a3a62" />
          <stop offset="46%" stopColor="#1a2340" />
          <stop offset="100%" stopColor="#111120" />
        </linearGradient>
        <linearGradient id="lg-body" x1="0.1" y1="0" x2="0.92" y2="0.9">
          <stop offset="0%" stopColor="#ffcf80" />
          <stop offset="22%" stopColor="#fba63e" />
          <stop offset="56%" stopColor="#f89820" />
          <stop offset="86%" stopColor="#dd7c07" />
          <stop offset="100%" stopColor="#b45c02" />
        </linearGradient>
        <linearGradient id="lg-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe8c2" />
          <stop offset="55%" stopColor="#ffbe66" />
          <stop offset="100%" stopColor="#f59a24" />
        </linearGradient>
        <linearGradient id="lg-coffee" x1="0.2" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#6f4114" />
          <stop offset="40%" stopColor="#3e2109" />
          <stop offset="100%" stopColor="#201003" />
        </linearGradient>
        <linearGradient id="lg-steam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.95" />
          <stop offset="52%" stopColor="#2fdfbd" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#2fdfbd" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="118" fill="url(#lg-bg)" />
      <g transform="translate(256 308) scale(0.5)">
        <g fill="none" stroke="url(#lg-steam)" strokeLinecap="round">
          <path d="M-104 -252 c 40 -46 -36 -80 6 -132" strokeWidth="22" />
          <path d="M0 -268 c 40 -46 -36 -80 6 -132" strokeWidth="22" />
          <path d="M104 -252 c 40 -46 -36 -80 6 -132" strokeWidth="22" />
        </g>
        <circle cx="150" cy="-16" r="86" fill="none" stroke="#c96f06" strokeWidth="52" />
        <circle cx="150" cy="-16" r="86" fill="none" stroke="url(#lg-rim)" strokeWidth="34" />
        <circle cx="150" cy="-16" r="86" fill="none" stroke="#42230a" strokeWidth="16" opacity="0.75" />
        <path
          d="M-166 -132 H166 L150 108 Q146 168 88 168 H-88 Q-146 168 -150 108 Z"
          fill="url(#lg-body)"
        />
        <path d="M-166 -132 H-104 L-112 150 Q-140 162 -150 108 Z" fill="#ffe8c2" opacity="0.26" />
        <path
          d="M112 -132 H166 L150 108 Q144 160 96 168 H56 Q112 156 118 104 Z"
          fill="#8f4602"
          opacity="0.2"
        />
        <ellipse cx="0" cy="150" rx="120" ry="26" fill="#8a4602" opacity="0.32" />
        <ellipse cx="0" cy="-132" rx="166" ry="38" fill="url(#lg-rim)" />
        <ellipse cx="0" cy="-128" rx="138" ry="28" fill="url(#lg-coffee)" />
        <path d="M-138 -130 a138 28 0 0 0 276 0 a138 28 0 0 1 -276 0 z" fill="#8a5626" opacity="0.4" />
      </g>
    </svg>
  )
}
