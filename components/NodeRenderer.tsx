'use client'
import type { Node } from '@/lib/types'
import NodeSection from './nodes/NodeSection'
import NodeMarkdown from './nodes/NodeMarkdown'
import NodeFlashcards from './nodes/NodeFlashcards'
import NodeQuiz from './nodes/NodeQuiz'
import { brandMap } from '@/lib/brand'

export type RendererProps = {
  node: Node
  brand: keyof typeof brandMap
  instantQuiz: boolean
  bookmarks: string[]
  onToggleBookmark: (id: string)=>void
  subjectSlug?: string
}

export default function NodeRenderer(props: RendererProps) {
  const { node, brand, instantQuiz, bookmarks, onToggleBookmark, subjectSlug } = props
  const bookmarked = bookmarks.includes(node.id)

  if (node.kind === 'section') {
    return (
      <NodeSection node={node} brand={brand} bookmarked={bookmarked} onToggleBookmark={()=>onToggleBookmark(node.id)}>
        {node.children?.map(child => (
          <NodeRenderer key={child.id} node={child} brand={brand} instantQuiz={instantQuiz} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} subjectSlug={subjectSlug}/>
        ))}
      </NodeSection>
    )
  }
  if (node.kind === 'markdown') {
    return <NodeMarkdown node={node} bookmarked={bookmarked} onToggleBookmark={()=>onToggleBookmark(node.id)} />
  }
  if (node.kind === 'flashcards') {
    return <NodeFlashcards node={node} bookmarked={bookmarked} onToggleBookmark={()=>onToggleBookmark(node.id)} subjectSlug={subjectSlug} />
  }
  if (node.kind === 'quiz') {
    return <NodeQuiz node={node} instant={instantQuiz} bookmarked={bookmarked} onToggleBookmark={()=>onToggleBookmark(node.id)} />
  }
  return null
}