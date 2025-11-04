'use client'
import { useState } from 'react'
import BookmarkButton from '../ui/BookmarkButton'
import MetaBar from '../ui/MetaBar'
import type { SectionNode } from '@/lib/types'
import { brandMap } from '@/lib/brand'
import ReferencesDrawer from '../ui/ReferencesDrawer'

export default function NodeSection({
  node, brand, bookmarked, onToggleBookmark, children
}: {
  node: SectionNode
  brand: keyof typeof brandMap
  bookmarked: boolean
  onToggleBookmark: ()=>void
  children?: React.ReactNode
}) {
  const [showRefs, setShowRefs] = useState(false)

  return (
    <section id={node.id} data-node-id={node.id} className={`bg-gray-900 dark:bg-gray-950 p-6 rounded-2xl card border-t-4 ${brandMap[brand].border} shadow-xl`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-xl md:text-2xl font-bold text-emerald-400">{node.title}</h3>
        <div className="flex items-center gap-2">
          {node.meta?.refs?.length ? (
            <button onClick={()=>setShowRefs(true)} className="text-xs border px-2 py-1 rounded bg-emerald-900/30 text-emerald-300 border-emerald-700 hover:bg-emerald-800/40">References</button>
          ) : null}
          <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
        </div>
      </div>
      {node.mnemonic && <p className="mt-1 text-sm text-gray-300">💡 Mnemonic: <span className="mnemonic-text">{node.mnemonic}</span></p>}
      <MetaBar meta={node.meta} />
      <div className="mt-4 space-y-4">{children}</div>

      {node.meta?.refs?.length ? (
        <ReferencesDrawer open={showRefs} refs={node.meta.refs} onClose={()=>setShowRefs(false)} />
      ) : null}
    </section>
  )
}