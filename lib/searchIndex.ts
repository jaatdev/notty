// lib/searchIndex.ts
import type { Subject } from './types'

export type SearchItem =
  | { type: 'action'; id: string; label: string; hint?: string }
  | { type: 'subject'; slug: string; title: string; description?: string; tags: string[] }
  | { type: 'node'; subjectSlug: string; nodeId: string; title: string; path: string; tags: string[] }

function collectTags(node: any): string[] {
  const tags = node?.meta?.tags || []
  if (node?.children?.length) return [...tags, ...node.children.flatMap(collectTags)]
  return tags
}

function walkNodesForIndex(nodes: any[], subjectSlug: string, parentPath: string[] = [], out: SearchItem[] = []) {
  for (const n of nodes) {
    const title = n.title || n.kind
    const path = [...parentPath, title]
    out.push({
      type: 'node',
      subjectSlug,
      nodeId: n.id,
      title,
      path: path.join(' > '),
      tags: n?.meta?.tags || [],
    })
    if (n?.children?.length) {
      walkNodesForIndex(n.children, subjectSlug, path, out)
    }
  }
  return out
}

export function buildSearchIndex(subjects: Subject[]): SearchItem[] {
  const items: SearchItem[] = []

  // subjects
  for (const s of subjects) {
    items.push({
      type: 'subject',
      slug: s.slug,
      title: s.title,
      description: s.description,
      tags: (s.nodes as any[]).flatMap(collectTags),
    })
    // nodes
    walkNodesForIndex(s.nodes as any[], s.slug, [], items)
  }

  return items
}