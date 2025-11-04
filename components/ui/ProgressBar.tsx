'use client'
export default function ProgressBar({
  progress,
  colorClass = 'bg-emerald-500',
  className = '',
}: { progress: number; colorClass?: string; className?: string }) {
  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-transparent z-50 no-print ${className}`}>
      <div className={`h-1 ${colorClass} w-0 transition-all duration-150`} style={{ width: `${progress}%` }} />
    </div>
  )
}