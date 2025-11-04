'use client'

import { useEffect, useState } from 'react'
import type { CiteStyle } from '@/lib/cite'

export type SubjectSettings = {
  defaultFocus: boolean
  defaultInstant: boolean
  defaultCiteStyle: CiteStyle
}

export default function SubjectSettingsModal({
  slug,
  open,
  onClose,
  onApply,
}: {
  slug: string
  open: boolean
  onClose: () => void
  onApply: (cfg: SubjectSettings) => void
}) {
  const key = `settings:${slug}`
  const [cfg, setCfg] = useState<SubjectSettings>({ defaultFocus: false, defaultInstant: false, defaultCiteStyle: 'mla' })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setCfg(JSON.parse(raw))
    } catch {}
  }, [key])

  function save() {
    localStorage.setItem(key, JSON.stringify(cfg))
    onApply(cfg)
    onClose()
  }
  function reset() {
    const def = { defaultFocus: false, defaultInstant: false, defaultCiteStyle: 'mla' as CiteStyle }
    setCfg(def)
    localStorage.setItem(key, JSON.stringify(def))
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 no-print" onClick={(e)=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[min(100%,560px)] bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Subject Settings</h3>
          <button onClick={onClose} className="text-sm border px-3 py-1 rounded">Close</button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm">Default: Focus Mode</span>
            <input type="checkbox" checked={cfg.defaultFocus} onChange={(e)=>setCfg({ ...cfg, defaultFocus: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm">Default: Instant Quiz</span>
            <input type="checkbox" checked={cfg.defaultInstant} onChange={(e)=>setCfg({ ...cfg, defaultInstant: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm">Default: Citation Style</span>
            <select value={cfg.defaultCiteStyle} onChange={(e)=>setCfg({ ...cfg, defaultCiteStyle: e.target.value as CiteStyle })} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827]">
              <option value="mla">MLA</option>
              <option value="bluebook">Bluebook</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={reset} className="text-sm underline">Reset to defaults</button>
          <div className="flex gap-2">
            <button onClick={()=>{ onApply(cfg) }} className="text-sm border px-3 py-1 rounded">Apply Now</button>
            <button onClick={save} className="text-sm border px-3 py-1 rounded bg-emerald-600 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}