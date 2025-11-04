'use client'
import Link from 'next/link'
import { useMemo } from 'react'
import type { Subject } from '@/lib/types'

export default function UpdatesTicker({ subjects, limit = 12 }: { subjects: Subject[]; limit?: number }) {
  const items = useMemo(() => {
    function collect(topics: any[], slug: string, subjectTitle: string, out: any[] = [], path: string[] = []) {
      for (const topic of topics) {
        const title = topic.title
        const newPath = [...path, title]
        // Check if any content node has updatedAt metadata
        if (topic.content) {
          for (const node of topic.content) {
            if (node?.meta?.updatedAt) {
              out.push({ slug, topicId: topic.id, subjectTitle, topicTitle: title, path: newPath.join(' > '), at: Date.parse(node.meta.updatedAt) })
              break // Only add once per topic
            }
          }
        }
        // Recursively check subtopics
        if (topic.subTopics?.length) collect(topic.subTopics, slug, subjectTitle, out, newPath)
      }
      return out
    }
    const arr = subjects.flatMap(s => collect(s.topics || [], s.slug, s.title))
      .filter(x => !!x.at)
      .sort((a,b) => b.at - a.at)
      .slice(0, limit)
    return arr
  }, [subjects, limit])

  if (items.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
      <div className="rounded-2xl border bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 p-3 overflow-hidden">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>🕒</span><span className="font-semibold">Recently updated</span>
        </div>
        <div className="marquee whitespace-nowrap">
          {items.map((it, i) => (
            <Link key={i} href={`/subjects/${it.slug}/${it.topicId}`} className="inline-block mr-6 text-sm hover:underline">
              <span className="font-semibold">{it.subjectTitle}</span>: {it.topicTitle}
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .marquee {
          animation: scroll 24s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}