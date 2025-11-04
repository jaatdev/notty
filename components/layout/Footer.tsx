import Link from 'next/link'
import { getAllSubjects } from '@/lib/data'

export default function Footer() {
  const subjects = getAllSubjects()
  const quick = subjects.slice(0, 6)
  const allTags = Array.from(
    new Set(
      subjects.flatMap(s =>
        s.topics.flatMap(topic => collectTopicTags(topic))
      )
    )
  ).slice(0, 12)

  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b1220]">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-extrabold text-lg">Notty</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">World class learning platform</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">Made with â¤ï¸ for learners.</p>
        </div>

        <div>
          <h5 className="font-bold mb-2">Quick Links</h5>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><a href="/#subjects" className="hover:underline">Explore</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-2">Subjects</h5>
          <ul className="space-y-1 text-sm">
            {quick.map(s => (
              <li key={s.slug}><Link href={`/subjects/${s.slug}`} className="hover:underline">{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-2">Top Tags</h5>
          <div className="flex flex-wrap gap-2">
            {allTags.length > 0 ? allTags.map(t => (
              <span key={t} className="px-2 py-0.5 text-xs rounded-full border bg-blue-50 text-blue-700 border-blue-200">#{t}</span>
            )) : <span className="text-xs text-gray-500">No tags yet</span>}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 text-center py-4 text-xs text-gray-500">
        Â© {new Date().getFullYear()} Notty. All rights reserved.
      </div>
    </footer>
  )
}

function collectTopicTags(topic: any): string[] {
  const tags: string[] = []
  if (topic.content) {
    topic.content.forEach((node: any) => {
      if (node.meta?.tags) tags.push(...node.meta.tags)
    })
  }
  if (topic.quiz) {
    topic.quiz.forEach((q: any) => {
      if (q.meta?.tags) tags.push(...q.meta.tags)
    })
  }
  if (topic.subTopics && topic.subTopics.length > 0) {
    topic.subTopics.forEach((subTopic: any) => {
      tags.push(...collectTopicTags(subTopic))
    })
  }
  return tags
}
