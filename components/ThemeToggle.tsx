'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const current = theme === 'system' ? systemTheme : theme
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-emerald-500 text-white shadow-2xl z-40 hover:bg-emerald-600 transition no-print"
    >
      {current === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}