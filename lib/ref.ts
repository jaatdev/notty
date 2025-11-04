import type { Subject, Node, MarkdownNode, Reference, RefType, Difficulty } from './types'

const INLINE_REF_RE = /\[\[(\w+):\s*([^\]|]+?)(?:\|([^\]]+))?\]\]/g

export type AggregatedRef = {
  id: string
  type: RefType
  label: string
  url?: string
  nodeId: string
  nodeTitle: string
  pathTitles: string[]
  tags?: string[]
  difficulty?: Difficulty
  updatedAt?: string
}

function toRefType(raw?: string): RefType {
  const t = (raw || '').toLowerCase()
  if (['case','article','act','doctrine','book','link'].includes(t)) return t as RefType
  return 'link'
}

export function extractInlineRefs(body: string): Reference[] {
  const refs: Reference[] = []
  if (!body) return refs
  let m: RegExpExecArray | null
  while ((m = INLINE_REF_RE.exec(body)) !== null) {
    const [, type, label, url] = m
    refs.push({ type: toRefType(type), label: label.trim(), url: url?.trim() })
  }
  return refs
}

function walkNodes(nodes: Node[], parentPath: string[] = [], out: AggregatedRef[] = []) {
  for (const n of nodes) {
    const myTitle = n.title || n.kind
    const path = [...parentPath, myTitle]

    // meta.refs
    const metaRefs = n.meta?.refs || []
    metaRefs.forEach((r, i) => {
      out.push({
        id: `${n.id}#m${i}`,
        type: toRefType(r.type),
        label: r.label,
        url: r.url,
        nodeId: n.id,
        nodeTitle: myTitle,
        pathTitles: path,
        tags: n.meta?.tags,
        difficulty: n.meta?.difficulty,
        updatedAt: n.meta?.updatedAt,
      })
    })

    // inline refs (markdown only)
    if (n.kind === 'markdown') {
      const md = n as MarkdownNode
      const inlines = extractInlineRefs(md.body)
      inlines.forEach((r, i) => {
        out.push({
          id: `${n.id}#i${i}`,
          type: toRefType(r.type),
          label: r.label,
          url: r.url,
          nodeId: n.id,
          nodeTitle: myTitle,
          pathTitles: path,
          tags: n.meta?.tags,
          difficulty: n.meta?.difficulty,
          updatedAt: n.meta?.updatedAt,
        })
      })
    }

    // children
    if (n.kind === 'section' && (n as any).children?.length) {
      walkNodes((n as any).children, path, out)
    }
  }
  return out
}

export function aggregateSubjectRefs(subject: Subject): AggregatedRef[] {
  const all = walkNodes(subject.nodes)
  // Dedup by nodeId + label + url + type
  const seen = new Set<string>()
  const unique: AggregatedRef[] = []
  for (const r of all) {
    const key = `${r.nodeId}|${r.type}|${r.label}|${r.url || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(r)
  }
  return unique
}

export function toCSV(refs: AggregatedRef[]) {
  const head = ['Type','Label','URL','Node Title','Path','Tags','Difficulty','Updated At']
  const rows = refs.map(r => [
    r.type,
    r.label.replace(/"/g, '""'),
    r.url || '',
    r.nodeTitle.replace(/"/g, '""'),
    r.pathTitles.join(' > ').replace(/"/g, '""'),
    (r.tags || []).join(', ').replace(/"/g, '""'),
    r.difficulty || '',
    r.updatedAt || ''
  ])
  const csv = [head, ...rows].map(cols => cols.map(c => `"${c}"`).join(',')).join('\n')
  return csv
}