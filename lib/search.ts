export function highlightSearch(container: HTMLElement, term: string) {
  container.querySelectorAll('mark.search-hit').forEach(m => {
    const p = m.parentNode
    if (!p) return
    p.replaceChild(document.createTextNode(m.textContent || ''), m)
    p.normalize()
  })
  if (!term) return
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  })
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const nodes: Node[] = []
  while (walker.nextNode()) {
    const cur = walker.currentNode
    if ((cur.parentNode as Element)?.tagName !== 'MARK') nodes.push(cur)
  }
  nodes.forEach(node => {
    const text = node.nodeValue || ''
    if (!regex.test(text)) return
    const frag = document.createDocumentFragment()
    let lastIndex = 0
    text.replace(regex, (match, _g, offset) => {
      const before = text.slice(lastIndex, offset)
      if (before) frag.appendChild(document.createTextNode(before))
      const mark = document.createElement('mark')
      mark.className = 'search-hit'
      mark.textContent = match
      frag.appendChild(mark)
      lastIndex = offset + match.length
      return ''
    })
    const after = text.slice(lastIndex)
    if (after) frag.appendChild(document.createTextNode(after))
    if (frag.childNodes.length > 1) node.parentNode?.replaceChild(frag, node)
  })
}