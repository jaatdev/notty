// components/ui/PublishedBadge.tsx
'use client'

interface PublishedBadgeProps {
  isPublished: boolean
  publishedAt?: string
  viewCount?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function PublishedBadge({ 
  isPublished, 
  publishedAt, 
  viewCount = 0,
  size = 'sm'
}: PublishedBadgeProps) {
  if (!isPublished) {
    return (
      <span className={`
        inline-flex items-center gap-1 rounded-full
        bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300
        font-medium
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : ''}
        ${size === 'md' ? 'px-3 py-1 text-sm' : ''}
        ${size === 'lg' ? 'px-4 py-2 text-base' : ''}
      `}>
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span>
        Draft
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <span className={`
        inline-flex items-center gap-1 rounded-full
        bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
        font-medium
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : ''}
        ${size === 'md' ? 'px-3 py-1 text-sm' : ''}
        ${size === 'lg' ? 'px-4 py-2 text-base' : ''}
      `}>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Published
      </span>
      {publishedAt && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(publishedAt).toLocaleDateString()}
        </span>
      )}
      {viewCount > 0 && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          👁️ {viewCount} views
        </span>
      )}
    </div>
  )
}
