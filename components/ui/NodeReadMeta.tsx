'use client'
import { useEffect, useRef, useState } from 'react'

export function estimateMinutes(text: string, wpm = 220) {
  const words = (text || '').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wpm))
}

export default function NodeReadMeta({ targetId, minutes }: { targetId: string; minutes: number }) {
  const [pct, setPct] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const total = rect.height + vh
        const read = Math.min(total, Math.max(0, vh - Math.max(0, rect.top) + Math.max(0, -rect.bottom)))
        const ratio = Math.max(0, Math.min(1, read / total))
        setPct(Math.round(ratio * 100))
        ticking.current = false
      })
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => document.removeEventListener('scroll', onScroll)
  }, [targetId])

  return (
    <div className="mt-2 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
      <span>⏱️ {minutes} min</span>
      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded">
        <div className="h-1 bg-emerald-500 rounded" style={{ width: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
    </div>
  )
}