'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import NavContinuePill from './NavContinuePill'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
        onClick={() => setOpen(false)}
      >
        <motion.div
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
            active ? 'text-white' : 'text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {active && (
            <motion.div
              layoutId="navbar-active"
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl shadow-lg"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled 
          ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-xl' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-black text-xl">N</span>
          </motion.div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent font-black text-xl">
              Notty
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold text-gray-500 dark:text-gray-400 -mt-1">
              notes that stick
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {link('/', 'Home')}
          <a href="/#subjects">
            <motion.div
              className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.div>
          </a>
          <a href="/#features">
            <motion.div
              className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Features
            </motion.div>
          </a>

          <motion.button
            onClick={() => window.dispatchEvent(new Event('notty:openCommand'))}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open command palette"
          >
            <span className="text-xs opacity-60">⌘K</span>
          </motion.button>

          <NavContinuePill />
          <InstallPrompt />

          <motion.button
            aria-label="Toggle dark mode"
            onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
            className="ml-2 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            suppressHydrationWarning
          >
            {current === 'dark' ? '☀️' : '🌙'}
          </motion.button>

          <SignedOut>
            <Link href="/sign-in">
              <motion.div
                className="ml-2 px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.div>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <motion.button
          className="md:hidden p-2 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {open ? '✖️' : '☰'}
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {link('/', 'Home')}
              <a href="/#subjects" className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300">
                Explore
              </a>
              <a href="/#features" className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300">
                Features
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event('notty:openCommand'))}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 text-left"
                aria-label="Open command palette"
              >
                ⌘K Search
              </button>
              <button
                aria-label="Toggle dark mode"
                onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
                className="mt-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                suppressHydrationWarning
              >
                {current === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <SignedOut>
                  <a href="/sign-in" className="block w-full px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center">
                    Sign In
                  </a>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
