// lib/time.ts
export function timeAgo(input: number | string | Date): string {
  const ts = typeof input === 'number' ? input : new Date(input).getTime()
  const diff = Math.max(0, Date.now() - ts)
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  const w = Math.floor(d / 7)
  const mon = Math.floor(d / 30)
  const y = Math.floor(d / 365)
  if (s < 45) return `${s}s ago`
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7) return `${d}d ago`
  if (w < 5) return `${w}w ago`
  if (mon < 12) return `${mon}mo ago`
  return `${y}y ago`
}