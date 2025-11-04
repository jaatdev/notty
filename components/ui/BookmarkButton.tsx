'use client'
export default function BookmarkButton({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <button
      title="Bookmark this"
      className={`text-lg no-print ${active ? 'bookmarked' : ''}`}
      onClick={onToggle}
      suppressHydrationWarning
    >
      📌
    </button>
  )
}