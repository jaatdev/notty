'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Fuse from 'fuse.js'
import { getAllSubjects } from '@/lib/data'
import { buildSearchIndex, type SearchItem } from '@/lib/searchIndex'
import { useStoredState } from '@/lib/localStorage'
import { timeAgo } from '@/lib/time'

type Result = SearchItem & { _kind: 'action'|'subject'|'topic' }

const ACTIONS_GLOBAL: { id: string; label: string; hint?: string }[] = [
  { id: 'goto-home', label: 'Go to Home', hint: 'Navigate to homepage' },
  { id: 'goto-explore', label: 'Explore Subjects', hint: 'Jump to Explore section' },
  { id: 'toggle-theme', label: 'Toggle Theme', hint: 'Light/Dark' },
  { id: 'scroll-top', label: 'Scroll to Top' },
  { id: 'print', label: 'Print Page' },
]

const ACTIONS_SUBJECT: { id: string; label: string; hint?: string }[] = [
  { id: 'open-refs', label: 'Open All References' },
  { id: 'open-bookmarks', label: 'Open Bookmarks' },
  { id: 'open-last-read', label: 'Open Last Read' },  // NEW
  { id: 'toggle-focus', label: 'Toggle Focus Mode' },
  { id: 'toggle-instant', label: 'Toggle Instant Quiz' },
  { id: 'export-pdf', label: 'Export PDF' },
]

type RecentItem =
  | { t: 'subject'; slug: string; title: string; at: number }
  | { t: 'topic'; slug: string; id: string; title: string; path: string; at: number }

const RECENTS_KEY = 'notty_recent_v2'

function loadRecents(): RecentItem[] {
  try { const v = localStorage.getItem(RECENTS_KEY); return v ? JSON.parse(v) : [] } catch { return [] }
}
function pushRecent(item: RecentItem) {
  try {
    const cur = loadRecents()
    const key = JSON.stringify({ ...item, at: 0 })
    const dedup = [item, ...cur.filter(v => JSON.stringify({ ...v, at: 0 }) !== key)]
      .sort((a,b)=> b.at - a.at)
      .slice(0, 10)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(dedup))
  } catch {}
}

export default function CommandPalette() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [recents, setRecents] = useState<RecentItem[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const subjects = getAllSubjects()
  const index = useMemo(() => buildSearchIndex(subjects), [subjects])

  const isSubjectPage = pathname?.startsWith('/subjects/')
  const actions: Result[] = useMemo(() => {
    const base: Result[] = ACTIONS_GLOBAL.map(a => ({ _kind:'action', type:'action', id:a.id, label:a.label, hint:a.hint } as any))
    if (isSubjectPage) {
      base.push(...ACTIONS_SUBJECT.map(a => ({ _kind:'action', type:'action', id:a.id, label:a.label, hint:a.hint } as any)))
    }
    return base
  }, [isSubjectPage])

  const [groupNodesBySubject, setGroupNodesBySubject] = useStoredState<boolean>('cmd:groupNodesBySubject', true)

  // Fuse index
  const fuse = useMemo(() => new Fuse<Result>(
    [
      ...actions,
      ...index.filter(i => i.type === 'subject').map(s => ({ _kind:'subject', ...s } as Result)),
      ...index.filter(i => i.type === 'topic').map(n => ({ _kind:'topic', ...n } as Result)),
    ],
    {
      includeScore: true,
      keys: [
        { name: 'label', weight: 2 },
        { name: 'hint', weight: 0.5 },
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'path', weight: 1.5 },
        { name: 'tags', weight: 1 },
      ],
      threshold: 0.32,
    }
  ), [actions, index])

  const results: Result[] = useMemo(() => {
    if (!query.trim()) {
      // show recents + top actions when empty
      const recentResults: Result[] = recents.map(r => {
        if (r.t === 'subject') {
          return { _kind:'subject', type:'subject', slug:r.slug, title:r.title, description:`Recent • ${timeAgo(r.at)}`, tags:[] } as any
        }
        return { _kind:'topic', type:'topic', subjectSlug:r.slug, topicId:r.id, title:r.title, path:`${r.path} • ${timeAgo(r.at)}`, tags:[] } as any
      })
      return [...actions.slice(0, 5), ...recentResults]
    }
    return fuse.search(query).map(r => r.item).slice(0, 30)
  }, [query, fuse, recents, actions])

  // Open/close handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const hotkey = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
      if (hotkey) {
        e.preventDefault()
        setOpen(v => !v)
        setTimeout(()=> inputRef.current?.focus(), 10)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const openPalette = () => { setOpen(true); setTimeout(()=> inputRef.current?.focus(), 10) }
    window.addEventListener('notty:openCommand', openPalette as any)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('notty:openCommand', openPalette as any) }
  }, [])

  useEffect(() => { if (open) { setActive(0); setQuery(''); setRecents(loadRecents()) } }, [open])

  function close() { setOpen(false); setQuery('') }

  // Execute handler
  function run(item: Result) {
    if (item._kind === 'action') {
      handleAction((item as any).id)
      close()
      return
    }
    if (item._kind === 'subject') {
      pushRecent({ t:'subject', slug: (item as any).slug, title: (item as any).title, at: Date.now() })
      router.push(`/subjects/${(item as any).slug}`)
      close()
      return
    }
    if (item._kind === 'topic') {
      const slug = (item as any).subjectSlug
      const topicId = (item as any).topicId
      pushRecent({ t:'topic', slug, id: topicId, title: (item as any).title, path: (item as any).path, at: Date.now() })
      router.push(`/subjects/${slug}/${topicId}`)
      close()
    }
  }

  function handleAction(id: string) {
    switch (id) {
      case 'goto-home':
        router.push('/')
        break
      case 'goto-explore':
        if (pathname === '/') document.getElementById('subjects')?.scrollIntoView({ behavior:'smooth' })
        else router.push('/#subjects')
        break
      case 'toggle-theme':
        setTheme(currentTheme === 'dark' ? 'light' : 'dark')
        break
      case 'open-refs':
        window.dispatchEvent(new CustomEvent('notty:openRefsAll'))
        break
      case 'open-last-read':
        window.dispatchEvent(new CustomEvent('notty:openLastRead'))
        break
      case 'toggle-focus':
        window.dispatchEvent(new CustomEvent('notty:toggleFocus'))
        break
      case 'toggle-instant':
        window.dispatchEvent(new CustomEvent('notty:toggleInstantQuiz'))
        break
      case 'export-pdf':
        window.dispatchEvent(new CustomEvent('notty:exportPDF'))
        break
      case 'print':
        window.print()
        break
      case 'scroll-top':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        break
    }
  }

  // Keyboard navigation in list
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min((results.length - 1), a + 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(0, a - 1)) }
      if (e.key === 'Enter') {
        e.preventDefault()
        const it = results[active]
        if (it) run(it)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, active])

  // Grouping - MUST be before early return to avoid conditional hooks
  const groups = [
    { key: 'action', label: 'Actions' },
    { key: 'subject', label: 'Subjects' },
    { key: 'topic', label: 'Topics' },
  ] as const

  const topicResults = results.filter(r => r._kind === 'topic')
  const topicsBySubject = useMemo(() => {
    if (!groupNodesBySubject) return null
    const g: Record<string, Result[]> = {}
    topicResults.forEach(n => {
      const slug = (n as any).subjectSlug as string
      ;(g[slug] ||= []).push(n)
    })
    return g
  }, [topicResults, groupNodesBySubject])

  // Early return AFTER all hooks
  if (!open) return null

  return (
    <div className="fixed inset-0 z-100">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[min(100%,900px)] bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            ref={inputRef}
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search commands, subjects, or nodes…"
            className="w-full bg-transparent outline-none text-base px-2 py-1"
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {groups.map(g => {
            if (g.key !== 'topic' || !groupNodesBySubject) {
              const items = results.filter(r => r._kind === g.key)
              if (!items.length) return null
              return (
                <div key={g.key} className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{g.label}</div>
                  <ul>
                    {items.map((r, idx) => {
                      const absoluteIndex = results.indexOf(r)
                      const isActive = absoluteIndex === active
                      return (
                        <li key={absoluteIndex}>
                          <button
                            className={`w-full text-left px-3 py-2 rounded-lg border transition ${isActive ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                            onMouseEnter={()=>setActive(absoluteIndex)}
                            onClick={()=>run(r)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 text-center">
                                {r._kind === 'action' ? '🧭' : r._kind === 'subject' ? '📚' : '�'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">
                                  {(r as any).label || (r as any).title}
                                </div>
                                <div className={`text-xs truncate ${isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                                  {r._kind === 'action' ? (r as any).hint || '' :
                                    r._kind === 'subject' ? (r as any).description || '' :
                                    (r as any).path}
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            } else {
              // Grouped by subject
              if (!topicsBySubject || Object.keys(topicsBySubject).length === 0) return null
              return (
                <div key="topic-grouped" className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Topics (by subject)</div>
                  {Object.entries(topicsBySubject).map(([slug, items]) => {
                    const subj = subjects.find(s => s.slug === slug)
                    return (
                      <div key={slug} className="mb-1">
                        <div className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {subj?.title || slug} <span className="text-gray-400">({items.length})</span>
                        </div>
                        <ul>
                          {items.map((r) => {
                            const absoluteIndex = results.indexOf(r)
                            const isActive = absoluteIndex === active
                            return (
                              <li key={absoluteIndex}>
                                <button
                                  className={`w-full text-left px-3 py-2 rounded-lg border transition ${isActive ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                                  onMouseEnter={()=>setActive(absoluteIndex)}
                                  onClick={()=>run(r)}
                                >
                                  <div className="font-semibold truncate">{(r as any).title}</div>
                                  <div className={`text-xs truncate ${isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {(r as any).path}
                                  </div>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )
            }
          })}
          {results.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-600">No matches.</div>
          )}
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>Esc to close • Enter to run • ↑/↓ to navigate</span>
            <label className="inline-flex items-center gap-1 ml-3">
              <input type="checkbox" checked={groupNodesBySubject} onChange={(e)=>setGroupNodesBySubject(e.target.checked)} />
              Group topics by subject
            </label>
          </div>
          <div>Cmd/Ctrl+K to toggle</div>
        </div>
      </div>
    </div>
  )
}