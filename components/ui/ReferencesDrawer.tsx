'use client'

import { useState } from 'react'
import type { Reference } from '@/lib/types'
import RefChip from './RefChip'

export default function ReferencesDrawer({
  open, refs = [], onClose
}: {
  open: boolean
  refs: Reference[]
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  if (!open) return null

  const copyAll = async () => {
    const text = refs.map(r => `${r.label}${r.url ? ` — ${r.url}` : ''}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 no-print" onClick={(e)=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-2xl bg-white dark:bg-[#1f2937] rounded-t-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">References</h3>
          <div className="flex items-center gap-2">
            <button onClick={copyAll} className="text-sm border px-3 py-1 rounded bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={onClose} className="text-sm border px-3 py-1 rounded">Close</button>
          </div>
        </div>
        <div className="max-h-[50vh] overflow-y-auto pr-1">
          {refs.length === 0 ? <p className="text-sm text-gray-600">No references.</p> : (
            <ul className="space-y-2">
              {refs.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <RefChip type={r.url ? 'link' : 'book'} label={r.label} href={r.url} />
                  {!r.url ? <span className="text-sm text-gray-600">{r.label}</span> : (
                    <a href={r.url} target="_blank" className="text-sm underline text-emerald-700 hover:text-emerald-800">{r.url}</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}