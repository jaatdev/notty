'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Subject } from '@/lib/types'
import { timeAgo } from '@/lib/time'

export default function SubjectCard({ s }: { s: Subject }) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [resume, setResume] = useState<{ nodeId: string, title: string, at?: number } | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`lastRead:${s.slug}`)
      if (!raw) return
      const { nodeId, title, at } = JSON.parse(raw)
      if (nodeId) setResume({ nodeId, title, at })
    } catch {}
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
    <Link href={`/subjects/${s.slug}`} className="block animate-slide-up">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 card transition-transform will-change-transform hover:shadow-2xl"
      >
        <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{s.brandColor || 'Notty'}</div>
        <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
        {s.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{s.description}</p>}
        <div className="mt-4 flex items-center gap-2">
          {resume && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/subjects/${s.slug}#${resume.nodeId}`)
              }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-full border border-emerald-200 dark:border-emerald-800"
            >
              Resume: {resume.title}
              {resume.at && <span className="text-emerald-600 dark:text-emerald-400"> • {timeAgo(resume.at)}</span>}
            </button>
          )}
          <span className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold">Open</span> →
        </div>
      </div>
    </Link>
  )
}