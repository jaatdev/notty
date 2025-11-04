import type { Node } from './types'

export function flattenNodes(nodes: Node[]) {
  const out: { id: string, title: string, level: number }[] = []
  function walk(arr: Node[], level = 1) {
    for (const n of arr) {
      const title = (n as any).title || (n.kind.charAt(0).toUpperCase() + n.kind.slice(1))
      out.push({ id: n.id, title, level })
      if (n.kind === 'section' && n.children?.length) {
        walk(n.children, level + 1)
      }
    }
  }
  walk(nodes)
  return out
}