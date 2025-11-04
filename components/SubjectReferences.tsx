'use client'

import { useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Subject, RefType } from '@/lib/types'
import { aggregateSubjectRefs, AggregatedRef, toCSV } from '@/lib/ref'
import RefChip from './ui/RefChip'
import SearchBar from './ui/SearchBar'
import { useStoredState } from '@/lib/localStorage'
import { formatCitations, CiteStyle } from '@/lib/cite'

type Props = {
  subject: Subject
  open: boolean
  onClose: () => void
  onJump: (id: string) => void
}

const typeOrder = ['case','article','act','doctrine','book','link'] as const
type SortBy = 'type' | 'label' | 'path' | 'updatedAt' | 'nodeTitle'
type SortDir = 'asc' | 'desc'

function defaultPinned(allTypes: RefType[]) {
  const preferred: RefType[] = ['case','article','act']
  const picked = preferred.filter(t => allTypes.includes(t))
  return picked.length ? picked : allTypes
}

type ViewConfig = {
  q: string
  types: RefType[]
  pinned: RefType[]
  onlyPinned: boolean
  tags: string[]
  diff: string
  sortBy: SortBy
  sortDir: SortDir
  groupBy: boolean
}
type SavedView = { id: string; name: string; config: ViewConfig }

export default function SubjectReferences({ subject, open, onClose, onJump }: Props) {
  const refs = useMemo(() => aggregateSubjectRefs(subject), [subject])

  const [allTypes, allTags, allDiffs] = useMemo(() => ([
    Array.from(new Set(refs.map(r => r.type))) as RefType[],
    Array.from(new Set(refs.flatMap(r => r.tags || []))).sort(),
    Array.from(new Set(refs.map(r => r.difficulty).filter(Boolean))) as string[],
  ]), [refs])

  // Keys
  const key = (k: string) => `refs:${subject.slug}:${k}`

  // Persisted filters
  const [query, setQuery] = useStoredState<string>(key('q'), '')
  const [types, setTypes] = useStoredState<RefType[]>(key('types'), [])
  const [pinnedTypes, setPinnedTypes] = useStoredState<RefType[]>(key('pinned'), [])
  const [onlyPinned, setOnlyPinned] = useStoredState<boolean>(key('onlyPinned'), false)
  const [tagSel, setTagSel] = useStoredState<string[]>(key('tags'), [])
  const [diffSel, setDiffSel] = useStoredState<string>(key('diff'), 'all')
  const [sortBy, setSortBy] = useStoredState<SortBy>(key('sortBy'), 'type')
  const [sortDir, setSortDir] = useStoredState<SortDir>(key('sortDir'), 'asc')
  const [groupByType, setGroupByType] = useStoredState<boolean>(key('groupBy'), true)
  const [citeStyle, setCiteStyle] = useStoredState<CiteStyle>(key('citeStyle'), 'mla')

  // Saved Views
  const [views, setViews] = useStoredState<SavedView[]>(key('views'), [])
  const [activeViewId, setActiveViewId] = useStoredState<string>(key('viewActive'), '')

  // Init defaults
  useEffect(() => {
    if (allTypes.length && types.length === 0) setTypes(allTypes)
    if (allTypes.length && pinnedTypes.length === 0) setPinnedTypes(defaultPinned(allTypes))
    // sanitize types if allTypes changed
    if (types.length) setTypes(types.filter(t => allTypes.includes(t)) as RefType[])
    if (pinnedTypes.length) setPinnedTypes(pinnedTypes.filter(t => allTypes.includes(t)) as RefType[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTypes])

  const fuse = useMemo(() => new Fuse(refs, {
    keys: ['label','nodeTitle','pathTitles','type'],
    threshold: 0.3,
  }), [refs])

  const activeTypes = useMemo(() => {
    const base = onlyPinned ? pinnedTypes : types
    return base.length ? base : allTypes
  }, [onlyPinned, pinnedTypes, types, allTypes])

  function sortRefs(list: AggregatedRef[]): AggregatedRef[] {
    const dir = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      let cmp = 0
      if (sortBy === 'type') {
        const ta = typeOrder.indexOf(a.type as any), tb = typeOrder.indexOf(b.type as any)
        cmp = ta - tb
      } else if (sortBy === 'label') {
        cmp = a.label.localeCompare(b.label)
      } else if (sortBy === 'path') {
        cmp = a.pathTitles.join(' > ').localeCompare(b.pathTitles.join(' > '))
      } else if (sortBy === 'updatedAt') {
        const da = a.updatedAt ? Date.parse(a.updatedAt) : 0
        const db = b.updatedAt ? Date.parse(b.updatedAt) : 0
        cmp = (da - db)
      } else if (sortBy === 'nodeTitle') {
        cmp = a.nodeTitle.localeCompare(b.nodeTitle)
      }
      return cmp * dir
    })
  }

  const visible: AggregatedRef[] = useMemo(() => {
    let base = refs
    if (query.trim()) base = fuse.search(query).map(r => r.item)
    base = base.filter(r => activeTypes.includes(r.type))
    if (diffSel !== 'all') base = base.filter(r => r.difficulty === diffSel)
    if (tagSel.length) {
      base = base.filter(r => {
        const t = r.tags || []
        return tagSel.every(tag => t.includes(tag))
      })
    }
    return sortRefs(base)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs, fuse, query, activeTypes, diffSel, tagSel, sortBy, sortDir])

  const grouped = useMemo(() => {
    if (!groupByType) return null
    const g: Record<string, AggregatedRef[]> = {}
    visible.forEach(r => { (g[r.type] ||= []).push(r) })
    return g
  }, [visible, groupByType])

  // Helpers
  function toggleArray(setter: (val:any)=>void, arr: string[], val: string) {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }
  function toggleType(t: string) { toggleArray(setTypes as any, types, t) }
  function togglePin(t: string) { toggleArray(setPinnedTypes as any, pinnedTypes, t) }
  function toggleTag(t: string) { toggleArray(setTagSel as any, tagSel, t) }

  function resetToPinned() { if (pinnedTypes.length) setTypes(pinnedTypes); setOnlyPinned(true) }
  function saveCurrentAsPinned() { const active = types.length ? types : allTypes; setPinnedTypes(active) }
  function clearFilters() {
    setQuery(''); setTypes(allTypes); setTagSel([]); setDiffSel('all'); setOnlyPinned(false)
  }

  async function copyVisible() {
    const text = visible.map(r => `${r.label}${r.url ? ` — ${r.url}` : ''} (${r.type}) • ${r.pathTitles.join(' > ')}`).join('\n')
    await navigator.clipboard.writeText(text)
  }

  async function copyCitations() {
    const text = formatCitations(visible, citeStyle)
    await navigator.clipboard.writeText(text)
  }

  function exportCSV() {
    const blob = new Blob([toCSV(visible)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${subject.slug}-references.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // Views
  function currentConfig(): ViewConfig {
    return { q: query, types, pinned: pinnedTypes, onlyPinned, tags: tagSel, diff: diffSel, sortBy, sortDir, groupBy: groupByType }
  }
  function applyConfig(c: ViewConfig) {
    setQuery(c.q); setTypes(c.types); setPinnedTypes(c.pinned); setOnlyPinned(c.onlyPinned); setTagSel(c.tags); setDiffSel(c.diff)
    setSortBy(c.sortBy); setSortDir(c.sortDir); setGroupByType(c.groupBy)
  }
  function saveView() {
    const name = window.prompt('Save current filters as view name:', 'My View')
    if (!name) return
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`
    const v: SavedView = { id, name, config: currentConfig() }
    setViews([...views, v]); setActiveViewId(v.id)
  }
  function applyView(id: string) {
    const v = views.find(v => v.id === id)
    if (!v) return
    setActiveViewId(id)
    applyConfig(v.config)
  }
  function renameView() {
    const v = views.find(v => v.id === activeViewId)
    if (!v) return
    const name = window.prompt('Rename view', v.name)
    if (!name) return
    setViews(views.map(x => x.id === v.id ? { ...x, name } : x))
  }
  function deleteView() {
    if (!activeViewId) return
    if (!confirm('Delete this view?')) return
    setViews(views.filter(v => v.id !== activeViewId))
    setActiveViewId('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 no-print" onClick={(e)=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[min(100%,1100px)] bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700">
        {/* Title + actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold">All References</h3>
          <div className="flex flex-wrap items-center gap-2">
            <select value={citeStyle} onChange={(e)=>setCiteStyle(e.target.value as CiteStyle)} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827]">
              <option value="mla">Copy as MLA</option>
              <option value="bluebook">Copy as Bluebook</option>
            </select>
            <button onClick={copyCitations} className="text-sm border px-3 py-1 rounded bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Copy Citations</button>
            <button onClick={copyVisible} className="text-sm border px-3 py-1 rounded">Copy Visible</button>
            <button onClick={exportCSV} className="text-sm border px-3 py-1 rounded">Export CSV</button>
            <button onClick={onClose} className="text-sm border px-3 py-1 rounded">Close</button>
          </div>
        </div>

        {/* Views */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <label className="text-xs text-gray-600">Views</label>
          <select value={activeViewId} onChange={(e)=>applyView(e.target.value)} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827] min-w-[180px]">
            <option value="">— Select view —</option>
            {views.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <button onClick={saveView} className="text-sm border px-3 py-1 rounded">Save current</button>
          <button onClick={renameView} className="text-sm border px-3 py-1 rounded disabled:opacity-50" disabled={!activeViewId}>Rename</button>
          <button onClick={deleteView} className="text-sm border px-3 py-1 rounded disabled:opacity-50" disabled={!activeViewId}>Delete</button>
        </div>

        {/* Search + core filters */}
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <SearchBar value={query} onChange={setQuery} placeholder="Search refs, nodes, path..." />
          </div>

          {/* Types with pinning */}
          <div className="md:col-span-2 flex flex-wrap items-center gap-2">
            {allTypes.map(t => {
              const sel = activeTypes.includes(t)
              const pinned = pinnedTypes.includes(t)
              return (
                <div key={t} className="inline-flex items-center gap-1">
                  <button onClick={()=>toggleType(t)} className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${sel ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {t}
                  </button>
                  <button onClick={()=>togglePin(t)} title={pinned ? 'Unpin' : 'Pin'} className={`text-xs ${pinned ? 'text-yellow-500' : 'text-gray-400'} hover:opacity-90`}>★</button>
                </div>
              )
            })}
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Difficulty</label>
            <select value={diffSel} onChange={(e)=>setDiffSel(e.target.value)} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827]">
              <option value="all">All</option>
              {allDiffs.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Sort + Group */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-gray-600">Sort</label>
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value as SortBy)} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827]">
              <option value="type">Type</option>
              <option value="label">Label</option>
              <option value="path">Path</option>
              <option value="updatedAt">Updated</option>
              <option value="nodeTitle">Node Title</option>
            </select>
            <select value={sortDir} onChange={(e)=>setSortDir(e.target.value as SortDir)} className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#111827]">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
            <label className="inline-flex items-center gap-2 text-sm ml-2">
              <input type="checkbox" checked={groupByType} onChange={(e)=>setGroupByType(e.target.checked)} />
              Group by type
            </label>
          </div>
        </div>

        {/* Tags */}
        {allTags.length ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {allTags.map(t => (
              <button key={t} onClick={()=>toggleTag(t)} className={`px-2 py-0.5 rounded-full border text-xs ${tagSel.includes(t) ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                #{t}
              </button>
            ))}
            {tagSel.length ? <button onClick={()=>setTagSel([])} className="ml-2 text-xs underline">Clear tags</button> : null}
          </div>
        ) : null}

        {/* Pinned controls */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyPinned} onChange={(e)=>setOnlyPinned(e.target.checked)} />
            Only pinned types
          </label>
          <button onClick={resetToPinned} className="text-sm border px-3 py-1 rounded">Reset to pinned</button>
          <button onClick={saveCurrentAsPinned} className="text-sm border px-3 py-1 rounded">Save current as pinned</button>
          <button onClick={clearFilters} className="text-sm underline ml-auto">Clear filters</button>
        </div>

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1 space-y-3">
          {visible.length === 0 ? (
            <p className="text-sm text-gray-600">No references match filters.</p>
          ) : groupByType && grouped ? (
            Object.keys(grouped).sort((a,b)=> typeOrder.indexOf(a as any) - typeOrder.indexOf(b as any)).map(type => (
              <div key={type}>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">{type} <span className="text-gray-400">({grouped[type].length})</span></div>
                <div className="space-y-2">
                  {grouped[type].map(r => (
                    <div key={r.id} className="p-3 rounded border bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <RefChip type={r.type} label={r.label} href={r.url} />
                          {r.url && <a href={r.url} target="_blank" className="ml-2 text-sm underline text-emerald-700 hover:text-emerald-800 break-all">{r.url}</a>}
                        </div>
                        <button onClick={()=>{ onJump(r.nodeId); onClose() }} className="text-xs border px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-[#0b1220]">Jump</button>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {r.pathTitles.join(' > ')}
                        {r.difficulty && <span className="ml-2">• {r.difficulty}</span>}
                        {r.tags?.length ? <span className="ml-2">• {r.tags.map(t=>`#${t}`).join(' ')}</span> : null}
                        {r.updatedAt && <span className="ml-2">• Updated {new Date(r.updatedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            visible.map(r => (
              <div key={r.id} className="p-3 rounded border bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <RefChip type={r.type} label={r.label} href={r.url} />
                    {r.url && <a href={r.url} target="_blank" className="ml-2 text-sm underline text-emerald-700 hover:text-emerald-800 break-all">{r.url}</a>}
                  </div>
                  <button onClick={()=>{ onJump(r.nodeId); onClose() }} className="text-xs border px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-[#0b1220]">Jump</button>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {r.pathTitles.join(' > ')}
                  {r.difficulty && <span className="ml-2">• {r.difficulty}</span>}
                  {r.tags?.length ? <span className="ml-2">• {r.tags.map(t=>`#${t}`).join(' ')}</span> : null}
                  {r.updatedAt && <span className="ml-2">• Updated {new Date(r.updatedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}