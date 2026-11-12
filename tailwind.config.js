/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Mandated palette ────────────────────────────────────────────
        base: '#1a1a2e',
        surface: '#16213e',
        accent: '#00d4aa',
        java: '#f89820',
        easy: '#00d4aa',
        medium: '#ffa500',
        hard: '#ff4757',
        ink: '#e2e8f0',
        muted: '#94a3b8',

        // ── Derived elevation + hairline tokens (support the palette) ───
        surface2: '#1c2946',
        surface3: '#233254',
        line: '#2a3752',
        'ink-dim': '#c3cede',
        'ink-soft': '#b6c2d4',
        violet: '#a78bfa',
        sky: '#7cc5ff',
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: ['SF Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '13px', letterSpacing: '0.02em' }],
        '3xs': ['9px', { lineHeight: '12px', letterSpacing: '0.04em' }],
      },
      letterSpacing: {
        caps: '0.14em',
        tighter2: '-0.03em',
      },
      boxShadow: {
        card: '0 16px 40px -28px rgba(0,0,0,0.9)',
        raised: '0 24px 60px -32px rgba(0,0,0,0.95)',
        menu: '0 30px 70px -30px rgba(0,0,0,0.95)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.055)',
        glow: '0 0 0 1px rgba(0,212,170,0.22), 0 14px 34px -18px rgba(0,212,170,0.4)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '4xl': '1.75rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(.2,.9,.2,1)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.86)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        flame: {
          '0%,100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.07) rotate(2deg)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pop: 'pop 0.3s cubic-bezier(.2,.9,.2,1)',
        flame: 'flame 2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
