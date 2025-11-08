'use client'
import type { Node } from '@/lib/types'
import type { NoteBox } from '@/lib/admin-types'
import NodeSection from './nodes/NodeSection'
import NodeMarkdown from './nodes/NodeMarkdown'
import NodeFlashcards from './nodes/NodeFlashcards'
import NodeQuiz from './nodes/NodeQuiz'
import NoteBoxRenderer from './NoteBoxRenderer'
import { brandMap } from '@/lib/brand'

export type RendererProps = {
  node: Node | NoteBox
  brand: keyof typeof brandMap
  instantQuiz: boolean
  bookmarks: string[]
  onToggleBookmark: (id: string)=>void
  subjectSlug?: string
  index?: number
}

export default function NodeRenderer(props: RendererProps) {
  const { node, brand, instantQuiz, bookmarks, onToggleBookmark, subjectSlug, index = 0 } = props
  const bookmarked = bookmarks.includes(node.id)

  // Check if this is a NoteBox (has 'type' property)
  if ('type' in node && typeof node.type === 'string') {
    return <NoteBoxRenderer note={node as NoteBox} index={index} />
  }

  // Legacy Node types
  if ('kind' in node) {
    if (node.kind === 'section') {
      return (
        <NodeSection node={node} brand={brand} bookmarked={bookmarked} onToggleBookmark={()=>onToggleBookmark(node.id)}>
          {node.children?.map((child, idx) => (
            <NodeRenderer key={child.id} node={child} brand={brand} instantQuiz={instantQuiz} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} subjectSlug={subjectSlug} index={idx}/>
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
  }

  return null
}