'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import NavContinuePill from './NavContinuePill'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const current = (theme === 'system' ? systemTheme : theme) || 'light'
  const link = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        key={href}
        href={href}
        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
          active ? 'bg-emerald-600 text-white' : 'text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
        }`}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className={`fixed top-0 w-full z-50 ${scrolled ? 'backdrop-blur bg-white/70 dark:bg-[#0b1220]/60 border-b border-gray-200/70 dark:border-gray-800/70 shadow-sm' : ''}`}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="inline-block bg-linear-to-tr from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Notty</span>
          <span className="hidden sm:inline text-xs font-semibold text-gray-500 dark:text-gray-400">notes that stick</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {link('/', 'Home')}
          <a href="/#subjects" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Explore</a>
          <a href="/#about" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">About</a>

          <button
            onClick={() => window.dispatchEvent(new Event('notty:openCommand'))}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            aria-label="Open command palette"
          >
            ⌘K
          </button>

          <NavContinuePill />

          <InstallPrompt />

          <button
            aria-label="Toggle dark mode"
            onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
            className="ml-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            suppressHydrationWarning
          >
            {current === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✖️' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            {link('/', 'Home')}
            <a href="/#subjects" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Explore</a>
            <a href="/#about" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">About</a>
            <button
              onClick={() => window.dispatchEvent(new Event('notty:openCommand'))}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            <button
              aria-label="Toggle dark mode"
              onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
              className="mt-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              suppressHydrationWarning
            >
              {current === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}