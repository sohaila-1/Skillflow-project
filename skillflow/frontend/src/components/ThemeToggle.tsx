'use client'

import { useTheme } from '../providers/theme-provider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      style={{
        width: 36, height: 36,
        borderRadius: '50%',
        background: 'var(--bg-alt)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 16, flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
