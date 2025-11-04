'use client'

import { timeAgo } from '@/lib/time'

export default function BannerResume({
  title, at, onResume, onDismiss
}: {
  title: string
  at?: number
  onResume: () => void
  onDismiss: () => void
}) {
  return (
    <div className="mx-4 md:mx-auto md:max-w-6xl mt-4">
      <div className="flex items-center justify-between gap-3 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-100 dark:border-emerald-800 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📌</span>
          <div>
            <div className="font-semibold">Continue where you left off</div>
            <div className="text-sm">
              {title} {at ? <span className="text-gray-600 dark:text-gray-300">• {timeAgo(at)}</span> : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onResume} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Resume</button>
          <button onClick={onDismiss} className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-transparent dark:text-emerald-200">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}