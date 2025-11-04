'use client'

interface BreadcrumbProps {
  path: string[]
  className?: string
}

export default function Breadcrumb({ path, className = '' }: BreadcrumbProps) {
  if (!path || path.length === 0) return null

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
      {path.map((segment, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <span className="text-gray-600 dark:text-gray-500">›</span>}
          <span 
            className={
              idx === path.length - 1 
                ? 'text-emerald-400 font-semibold' 
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            {segment}
          </span>
        </div>
      ))}
    </nav>
  )
}
