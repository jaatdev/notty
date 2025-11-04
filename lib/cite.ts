// lib/cite.ts
import type { AggregatedRef } from './ref'

export type CiteStyle = 'mla' | 'bluebook'

function formatDate(d = new Date()) {
  const month = d.toLocaleString('en-US', { month: 'long' })
  const day = d.getDate()
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatCitation(ref: AggregatedRef, style: CiteStyle): string {
  const accessed = formatDate()
  const label = ref.label
  const url = ref.url || ''
  const type = ref.type

  if (style === 'bluebook') {
    // Minimal Bluebook-like for online: Label, URL (last visited D Mon YYYY)
    // Example: Kesavananda Bharati (1973), https://... (last visited 31 Oct 2025)
    const mon = new Date().toLocaleString('en-US', { month: 'short' })
    const date = `${new Date().getDate()} ${mon} ${new Date().getFullYear()}`
    return url ? `${label}, ${url} (last visited ${date})` : `${label}`
  }

  // Default: MLA-like for web: "Label." URL. Accessed D Month YYYY.
  // Example: "Article 368 - Amendment." https://... Accessed 31 October 2025.
  return url ? `"${label}." ${url}. Accessed ${accessed}.` : `"${label}."`
}

export function formatCitations(refs: AggregatedRef[], style: CiteStyle): string {
  return refs.map(r => formatCitation(r, style)).join('\n')
}