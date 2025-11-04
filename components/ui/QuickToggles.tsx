'use client'

import { useEffect, useState } from 'react'
import type { CiteStyle } from '@/lib/cite'
import { useToast } from '@/components/feedback/ToastProvider'

export default function QuickToggles({
  slug,
  focusMode, setFocusMode,
  instantQuiz, setInstantQuiz
}: {
  slug: string
  focusMode: boolean
  setFocusMode: (v:boolean)=>void
  instantQuiz: boolean
  setInstantQuiz: (v:boolean)=>void
}) {
  const { showToast } = useToast()

  const citeKey = `refs:${slug}:citeStyle`
  const [cite, setCite] = useState<CiteStyle>('mla')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(citeKey)
      if (raw) {
        // Use setTimeout to avoid cascading render warning
        setTimeout(() => setCite(JSON.parse(raw)), 0)
      }
    } catch {}
  }, [citeKey])

  function setCiteStyle(v: CiteStyle) {
    setCite(v)
    try { localStorage.setItem(citeKey, JSON.stringify(v)) } catch {}
    showToast({ message: `Citation: ${v.toUpperCase()}`, variant: 'success' })
  }

  return (
    <div className="mt-4 p-3 rounded-lg border border-gray-700 bg-gray-800">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Quick toggles</div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-sm text-gray-300">Focus Mode</label>
        <input
          type="checkbox"
          checked={focusMode}
          onChange={(e)=>{ setFocusMode(e.target.checked); localStorage.setItem(`notty_focus_${slug}`, JSON.stringify(e.target.checked)); showToast({ message: e.target.checked ? 'Focus ON' : 'Focus OFF', variant: 'info' }) }}
          className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-sm text-gray-300">Instant Quiz</label>
        <input
          type="checkbox"
          checked={instantQuiz}
          onChange={(e)=>{ setInstantQuiz(e.target.checked); localStorage.setItem(`notty_iq_${slug}`, JSON.stringify(e.target.checked)); showToast({ message: e.target.checked ? 'Instant Quiz ON' : 'Instant Quiz OFF', variant: 'info' }) }}
          className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Cite Style</label>
        <select
          value={cite}
          onChange={(e)=> setCiteStyle(e.target.value as CiteStyle)}
          className="border border-gray-600 rounded px-2 py-1 text-sm bg-gray-700 text-gray-200"
        >
          <option value="mla">MLA</option>
          <option value="bluebook">Bluebook</option>
        </select>
      </div>
    </div>
  )
}