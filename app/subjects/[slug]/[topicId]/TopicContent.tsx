'use client'

import { useState } from 'react'
import NodeRenderer from '@/components/NodeRenderer'
import type { ContentNode } from '@/lib/types'
import type { BrandKey } from '@/lib/brand'

type TopicContentProps = {
  content: ContentNode[]
  subjectSlug: string
  brandColor: BrandKey
}

export default function TopicContent({ content, subjectSlug, brandColor }: TopicContentProps) {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [instantQuiz, setInstantQuiz] = useState(false)

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(b => b !== id) 
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 mb-12">
      {content.map((node: any) => (
        <NodeRenderer 
          key={node.id} 
          node={node} 
          brand={brandColor}
          instantQuiz={instantQuiz}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          subjectSlug={subjectSlug}
        />
      ))}
    </div>
  )
}
