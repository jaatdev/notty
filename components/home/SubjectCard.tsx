/**
 * 🎨 ENHANCED SUBJECT CARD - World-Class Design
 * Steps 31-33: Theme-Aware Card with Procedural Styling
 * Beautiful gradients, glassmorphism, and animations
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Subject } from '@/lib/types'
import { timeAgo } from '@/lib/time'
import { getThemeById } from '@/lib/theme-variants'

export default function SubjectCard({ s }: { s: Subject }) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [resume, setResume] = useState<{ nodeId: string, title: string, at?: number } | null>(null)
  
  // Get deterministic theme for this subject
  const theme = getThemeById(s.slug)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`lastRead:${s.slug}`)
      if (!raw || raw.trim() === '') return
      const parsed = JSON.parse(raw)
      if (parsed && parsed.nodeId) {
        setResume({ nodeId: parsed.nodeId, title: parsed.title, at: parsed.at })
      }
    } catch (error) {
      // Silently handle invalid JSON
      console.debug('Failed to parse lastRead data:', error)
    }
  }, [s.slug])

  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const midX = rect.width / 2
    const midY = rect.height / 2
    const rotX = ((y - midY) / midY) * -4
    const rotY = ((x - midX) / midX) * 4
    el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`
  }
  function onLeave() { if (ref.current) ref.current.style.transform = '' }

  return (
    <Link href={`/subjects/${s.slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative group"
      >
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 transition-all will-change-transform"
          style={{
            boxShadow: `0 4px 20px ${theme.glow}20`,
          }}
        >
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
            style={{
              background: theme.gradient,
            }}
          />
          
          {/* Gradient Border on Hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
            style={{
              background: theme.gradient,
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with Theme Color */}
            <div className="flex items-center justify-between mb-3">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: `${theme.accent}15`,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`,
                }}
              >
                {s.emoji && <span className="text-base">{s.emoji}</span>}
                {s.brandColor || 'Subject'}
              </div>
              
              {/* Glow Indicator */}
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  background: theme.accent,
                  boxShadow: `0 0 10px ${theme.glow}`,
                }}
              />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r transition-all"
              style={{
                backgroundImage: theme.gradient,
              }}
            >
              {s.title}
            </h3>

            {/* Description */}
            {s.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                {s.description}
              </p>
            )}

            {/* Resume Button */}
            {resume && (
              <div className="mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/subjects/${s.slug}#${resume.nodeId}`)
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all group/resume hover:shadow-lg"
                  style={{
                    background: `${theme.accent}10`,
                    color: theme.accent,
                    border: `1px solid ${theme.accent}20`,
                  }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Continue: {resume.title}</span>
                  {resume.at && (
                    <span className="opacity-70">• {timeAgo(resume.at)}</span>
                  )}
                </button>
              </div>
            )}

            {/* Footer with Arrow */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-sm font-semibold" style={{ color: theme.accent }}>
                Explore Subject
              </span>
              <motion.div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  background: theme.gradient,
                }}
                whileHover={{ scale: 1.1, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div 
              className="absolute top-0 -left-full w-1/2 h-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accent}20, transparent)`,
                animation: 'shine 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}