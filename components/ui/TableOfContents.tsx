/**
 * 📚 ADVANCED TABLE OF CONTENTS
 * Auto-generates TOC from content with smooth navigation
 * Features: Collapsible sidebar, URL hash navigation, active tracking
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ContentNode } from '@/lib/types'

interface TocItem {
  id: string
  title: string
  level: number
  type: string
  children?: TocItem[]
}

interface TableOfContentsProps {
  content: ContentNode[]
  theme?: {
    accent: string
    gradient: string
    glow: string
  }
  className?: string
}

export default function TableOfContents({ content, theme, className = '' }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-close on mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false)
  }, [isMobile])

  // Generate TOC from content
  useEffect(() => {
    const items = generateTocItems(content)
    setTocItems(items)
  }, [content])

  // Track active section with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    // Observe all sections
    const sections = document.querySelectorAll('[data-toc-section]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [tocItems])

  // Smooth scroll to section
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Update URL hash without jumping
      history.pushState(null, '', `#${id}`)
      setActiveId(id)

      // Close on mobile after navigation
      if (isMobile) setIsOpen(false)
    }
  }, [isMobile])

  // Handle initial hash on load
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      setTimeout(() => scrollToSection(hash), 100)
    }
  }, [scrollToSection])

  if (tocItems.length === 0) return null

  const defaultTheme = {
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glow: '#10b981'
  }

  const activeTheme = theme || defaultTheme

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border-2 rounded-xl shadow-lg hover:shadow-xl transition-all ${
          isOpen ? 'left-[280px]' : 'left-4'
        } ${isMobile ? 'top-20' : 'top-24'}`}
        style={{
          borderColor: activeTheme.accent + '40',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={{
          left: isOpen ? (isMobile ? '280px' : '280px') : '1rem'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </motion.svg>
        <span className="font-semibold text-sm hidden sm:inline">
          {isOpen ? 'Hide' : 'Contents'}
        </span>
      </motion.button>

      {/* TOC Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed ${isMobile ? 'top-0 h-full' : 'top-24 h-[calc(100vh-6rem)]'} left-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl z-40 overflow-hidden flex flex-col ${className}`}
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ background: activeTheme.gradient }}
                  >
                    📑
                  </div>
                  <h3 className="font-bold text-sm">Contents</h3>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-neutral-200 dark:bg-neutral-800">
                <motion.div
                  className="h-full"
                  style={{ background: activeTheme.gradient }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${calculateProgress(tocItems, activeId)}%`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* TOC Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {tocItems.map((item, index) => (
                  <TocItemComponent
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onNavigate={scrollToSection}
                    theme={activeTheme}
                    index={index}
                  />
                ))}
              </div>

              {/* Footer Stats */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {tocItems.length} sections
                  </span>
                  <span className="font-mono font-semibold" style={{ color: activeTheme.accent }}>
                    {calculateProgress(tocItems, activeId)}%
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${activeTheme.accent}40;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${activeTheme.accent}60;
        }
      `}</style>
    </>
  )
}

// TOC Item Component
function TocItemComponent({ 
  item, 
  activeId, 
  onNavigate, 
  theme,
  index 
}: { 
  item: TocItem
  activeId: string | null
  onNavigate: (id: string) => void
  theme: any
  index: number
}) {
  const isActive = activeId === item.id
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-start gap-2">
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <motion.svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </button>
        )}

        {/* TOC Link */}
        <button
          onClick={() => onNavigate(item.id)}
          className={`flex-1 text-left py-2 px-3 rounded-lg transition-all text-sm group ${
            isActive
              ? 'font-bold text-white shadow-lg'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          style={
            isActive
              ? {
                  background: theme.gradient,
                  boxShadow: `0 4px 12px ${theme.glow}40`
                }
              : undefined
          }
        >
          <div className="flex items-center gap-2">
            {/* Icon based on type */}
            <span className="text-xs opacity-70">
              {getIconForType(item.type)}
            </span>
            
            {/* Title */}
            <span className={`flex-1 line-clamp-2 ${item.level > 1 ? 'text-xs' : ''}`}>
              {item.title}
            </span>

            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="w-2 h-2 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        </button>
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-5 pl-3 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-1 mt-1"
          >
            {item.children!.map((child, idx) => (
              <TocItemComponent
                key={child.id}
                item={child}
                activeId={activeId}
                onNavigate={onNavigate}
                theme={theme}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Helper: Generate TOC items from content
function generateTocItems(content: ContentNode[], level = 1): TocItem[] {
  const items: TocItem[] = []

  content.forEach((node: any) => {
    // Skip non-section nodes or nodes without titles
    if (!node.id) return

    const title = node.title || getTitleFromNode(node)
    if (!title) return

    const item: TocItem = {
      id: node.id,
      title,
      level,
      type: node.kind || node.type || 'section',
      children: []
    }

    // Recursively process children for sections
    if (node.kind === 'section' && node.children && node.children.length > 0) {
      item.children = generateTocItems(node.children, level + 1)
    }

    items.push(item)
  })

  return items
}

// Helper: Get title from node
function getTitleFromNode(node: any): string {
  if (node.title) return node.title
  if (node.kind === 'markdown' && node.content) {
    // Extract first heading from markdown
    const match = node.content.match(/^#+\s+(.+)$/m)
    if (match) return match[1]
  }
  return node.kind ? node.kind.charAt(0).toUpperCase() + node.kind.slice(1) : 'Section'
}

// Helper: Get icon for node type
function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    section: '📄',
    markdown: '📝',
    quiz: '❓',
    flashcards: '🎴',
    notes: '📋',
    notebox: '📦',
    default: '•'
  }
  return icons[type] || icons.default
}

// Helper: Calculate reading progress
function calculateProgress(items: TocItem[], activeId: string | null): number {
  if (!activeId || items.length === 0) return 0

  const flatItems = flattenTocItems(items)
  const activeIndex = flatItems.findIndex(item => item.id === activeId)
  
  if (activeIndex === -1) return 0
  
  return Math.round(((activeIndex + 1) / flatItems.length) * 100)
}

// Helper: Flatten TOC items
function flattenTocItems(items: TocItem[]): TocItem[] {
  const flat: TocItem[] = []
  
  items.forEach(item => {
    flat.push(item)
    if (item.children && item.children.length > 0) {
      flat.push(...flattenTocItems(item.children))
    }
  })
  
  return flat
}
