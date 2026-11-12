/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#1a1a2e',
        surface: '#16213e',
        surface2: '#1f2b47',
        line: '#29344f',
        accent: '#00d4aa',
        java: '#f89820',
        easy: '#00d4aa',
        medium: '#ffa500',
        hard: '#ff4757',
        ink: '#e2e8f0',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(0,212,170,0.25), 0 10px 30px -12px rgba(0,212,170,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        flame: {
          '0%,100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.08) rotate(2deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        pop: 'pop 0.35s ease-out',
        flame: 'flame 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
