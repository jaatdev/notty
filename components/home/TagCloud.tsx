'use client'

export default function TagCloud({ tags, selected, onToggle }: { tags: string[]; selected: string[]; onToggle: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(t => {
        const active = selected.includes(t)
        return (
          <button
            key={t}
            onClick={() => onToggle(t)}
            className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
          >
            #{t}
          </button>
        )
      })}
    </div>
  )
}