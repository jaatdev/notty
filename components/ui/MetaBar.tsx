'use client'
import { useState, useEffect } from 'react'
import TagBadge from './TagBadge'
import DifficultyBadge from './DifficultyBadge'
import type { NodeMeta } from '@/lib/types'

export default function MetaBar({ meta }: { meta?: NodeMeta }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null)
  
  // Format date only on client after hydration to avoid mismatch
  useEffect(() => {
    if (meta?.updatedAt) {
      setFormattedDate(new Date(meta.updatedAt).toLocaleDateString())
    }
  }, [meta?.updatedAt])

  if (!meta) return null

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-2">
      {meta.tags?.map(t => <TagBadge key={t} tag={t} />)}
      <DifficultyBadge level={meta.difficulty} />
      {formattedDate && <span className="italic text-gray-500">Updated: {formattedDate}</span>}
      {meta.refs?.length ? (
        <span className="ml-auto flex items-center gap-2">
          {meta.refs.map((r, i) => r.url
            ? <a key={i} href={r.url} target="_blank" className="underline text-emerald-400 hover:text-emerald-300">{r.label}</a>
            : <span key={i} className="text-gray-500">{r.label}</span>
          )}
        </span>
      ) : null}
    </div>
  )
}