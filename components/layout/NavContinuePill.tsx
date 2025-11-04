'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { timeAgo } from '@/lib/time'

export default function NavContinuePill() {
  const pathname = usePathname()
  const isSubject = pathname?.startsWith('/subjects/')
  const slug = isSubject ? pathname!.split('/')[2] : null
  const [last, setLast] = useState<{ nodeId:string; title:string; at?:number } | null>(null)

  useEffect(() => {
    if (!slug) return
    try {
      const raw = localStorage.getItem(`lr-${slug}`)
      if (!raw) return
      const { nodeId, title, path, at } = JSON.parse(raw)
      if (nodeId) {
        // Use startTransition to avoid cascading render warning
        setTimeout(() => {
          setLast({ nodeId, title: title || (path?.split(' > ').pop()) || 'Last read', at })
        }, 0)
      }
    } catch {}
  }, [slug])

  if (!slug || !last) return null
  return (
    <Link href={`/subjects/${slug}#${last.nodeId}`} className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
      Resume: {last.title} {last.at ? <span className="text-gray-500">• {timeAgo(last.at)}</span> : null}
    </Link>
  )
}