'use client'
import type { RefType } from '@/lib/types'

const styleMap: Record<RefType, string> = {
  case: 'bg-rose-100 text-rose-800 border-rose-200',
  article: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  act: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  doctrine: 'bg-violet-100 text-violet-800 border-violet-200',
  book: 'bg-amber-100 text-amber-800 border-amber-200',
  link: 'bg-slate-100 text-slate-800 border-slate-200',
}

export default function RefChip({ type='link', label, href }: { type?: RefType, label: string, href?: string }) {
  const cls = styleMap[type]
  const El = (href ? 'a' : 'span') as any
  return (
    <El
      {...(href ? { href, target:'_blank', rel:'noopener noreferrer' } : {})}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold mr-1 mb-1 hover:opacity-90 ${cls}`}
      title={href ? `Open: ${href}` : label}
    >
      {type === 'case' && '⚖️'}
      {type === 'article' && '📜'}
      {type === 'act' && '🏛️'}
      {type === 'doctrine' && '📚'}
      {type === 'book' && '📖'}
      {type === 'link' && '🔗'}
      <span>{label}</span>
    </El>
  )
}