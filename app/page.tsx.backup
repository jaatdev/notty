'use client'

import { useMemo, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getAllSubjects } from '@/lib/data'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import SubjectCard from '@/components/home/SubjectCard'
import ContinueStrip from '@/components/home/ContinueStrip'
import SearchBar from '@/components/ui/SearchBar'
import { SubjectCardSkeleton } from '@/components/ui/LoadingSkeleton'

// Lazy load heavy components
const TagCloud = dynamic(() => import('@/components/home/TagCloud'), {
  loading: () => <div className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 rounded"></div>,
})

const UpdatesTicker = dynamic(() => import('@/components/home/UpdatesTicker'), {
  ssr: false,
})

export default function HomePage() {
  const subjects = getAllSubjects()

  function countNodes(nodes: any[]): number {
    let c = 0
    for (const n of nodes) {
      c++
      if (n.children?.length) c += countNodes(n.children)
    }
    return c
  }
  const stats = useMemo(() => {
    const totalNodes = subjects.reduce((a, s) => a + countNodes(s.nodes as any), 0)
    const latest = subjects.flatMap(s => collectUpdated(s.nodes as any)).filter(Boolean).sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0]
    return { subjects: subjects.length, nodes: totalNodes, updated: latest ? new Date(latest).toISOString() : undefined }
  }, [subjects])

  const allTags = useMemo(() => Array.from(new Set(subjects.flatMap(s => (s.nodes as any[]).flatMap(collectTags)))).sort(), [subjects])

  const [query, setQuery] = useState('')
  const [selTags, setSelTags] = useState<string[]>([])
  const toggleTag = (t: string) => setSelTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subjects.filter(s => {
      const titleHit = s.title.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
      const tagHit = selTags.length === 0 || subjectHasAllTags(s, selTags)
      return titleHit && tagHit
    })
  }, [subjects, query, selTags])

  return (
    <>
      <Hero onExplore={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })} />
      <section className="mt-8">
        <Stats subjects={stats.subjects} nodes={stats.nodes} updated={stats.updated} />
      </section>

      <UpdatesTicker subjects={subjects} />

      {/* NEW: continue strip */}
      <ContinueStrip subjects={subjects} />

      <section id="subjects" className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold">Explore Subjects</h2>
          <div className="w-full sm:w-96">
            <SearchBar value={query} onChange={setQuery} placeholder="Search subjects..." />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6">
            <TagCloud tags={allTags.slice(0, 20)} selected={selTags} onToggle={toggleTag} />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filtered.map(s => <SubjectCard key={s.slug} s={s} />)}
          {filtered.length === 0 && (
            <div className="col-span-full p-6 text-center border rounded-2xl animate-fade-in">
              <p className="text-gray-600">No subjects match your search/filters.</p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-16" id="about">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 card">
          <h3 className="text-xl md:text-2xl font-bold mb-2">How Notty works</h3>
          <ol className="list-decimal ml-5 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Add or edit subjects in data/notes.json.</li>
            <li>Each subject has nested nodes: section, markdown, flashcards, quiz.</li>
            <li>Optional meta: tags, difficulty, updatedAt, references (inline chips or meta list).</li>
            <li>UI updates automatically. Export PDF, print, focus mode, search—built in.</li>
          </ol>
        </div>
      </section>
    </>
  )
}

function collectTags(node: any): string[] {
  const tags = node?.meta?.tags || []
  if (node?.children?.length) return [...tags, ...node.children.flatMap(collectTags)]
  return tags
}
function subjectHasAllTags(subject: any, tags: string[]) {
  const subjectTags = (subject.nodes as any[]).flatMap(collectTags)
  return tags.every(t => subjectTags.includes(t))
}
function collectUpdated(nodes: any[]): (string | undefined)[] {
  const arr: (string | undefined)[] = []
  for (const n of nodes) {
    if (n?.meta?.updatedAt) arr.push(n.meta.updatedAt)
    if (n.children?.length) arr.push(...collectUpdated(n.children))
  }
  return arr
}
