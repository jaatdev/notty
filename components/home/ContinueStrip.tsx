'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Subject } from '@/lib/types'
import { timeAgo } from '@/lib/time'

type Last = { slug: string; subjectTitle: string; nodeId: string; nodeTitle: string; at?: number }

export default function ContinueStrip({ subjects }: { subjects: Subject[] }) {
  const [items, setItems] = useState<Last[]>([])

  useEffect(() => {
    try {
      const arr: Last[] = []
      for (const s of subjects) {
        const raw = localStorage.getItem(`lastRead:${s.slug}`)
        if (!raw) continue
        const { nodeId, title, path, at } = JSON.parse(raw)
        if (!nodeId) continue
        arr.push({
          slug: s.slug,
          subjectTitle: s.title,
          nodeId,
          nodeTitle: title || (path?.split(' > ').pop()) || 'Last read',
          at,
        })
      }
      arr.sort((a,b) => (b.at || 0) - (a.at || 0))
      setItems(arr.slice(0, 3))
    } catch {}
  }, [subjects])

  if (items.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-extrabold">Continue learning</h3>
          <span className="text-xs text-gray-500">Jump back into your last reads</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {items.map(it => (
            <Link key={`${it.slug}-${it.nodeId}`} href={`/subjects/${it.slug}#${it.nodeId}`} className="min-w-[280px] flex-1 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/10">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{it.subjectTitle}</div>
              <div className="font-bold mt-1 line-clamp-2">{it.nodeTitle}</div>
              <div className="text-xs text-gray-500 mt-1">{it.at ? timeAgo(it.at) : ''}</div>
              <div className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Resume →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}