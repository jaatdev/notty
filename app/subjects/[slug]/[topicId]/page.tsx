import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug, findTopicByPath } from '@/lib/data'
import { brandMap } from '@/lib/brand'
import TopicContent from './TopicContent'

type Params = {
  slug: string
  topicId: string
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { slug, topicId } = await params
  const subject = await getSubjectBySlug(slug)
  
  if (!subject) {
    notFound()
  }

  // Find the topic by path (topicId)
  const topic = findTopicByPath(subject, [topicId])
  
  if (!topic) {
    notFound()
  }

  const colors = brandMap[subject.brandColor]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div 
        className={`relative py-12 px-4 md:px-6 bg-linear-to-br ${colors.hero}`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm">
            <ol className="flex items-center gap-2 text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/subjects/${slug}`} className="hover:text-white transition">
                  {subject.emoji} {subject.title}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{topic.title}</li>
            </ol>
          </nav>

          {/* Topic Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-lg text-white/90 max-w-3xl">
              {topic.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {topic.quiz && topic.quiz.length > 0 && (
              <Link
                href={`/subjects/${slug}/quiz?topic=${topicId}`}
                className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                📝 Take Quiz ({topic.quiz.length} questions)
              </Link>
            )}
            <Link
              href={`/subjects/${slug}`}
              className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-white/30"
            >
              ← Back to {subject.title}
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Content Nodes */}
        {topic.content && topic.content.length > 0 && (
          <TopicContent 
            content={topic.content} 
            subjectSlug={slug}
            topicId={topicId}
            brandColor={subject.brandColor}
            subjectTitle={subject.title}
            topicTitle={topic.title}
          />
        )}

        {/* Subtopics */}
        {topic.subTopics && topic.subTopics.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📚 Subtopics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.subTopics.map((subtopic: any) => (
                <Link
                  key={subtopic.id}
                  href={`/subjects/${slug}/${topicId}/${subtopic.id}`}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {subtopic.title}
                  </h3>
                  {subtopic.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {subtopic.description}
                    </p>
                  )}
                  {subtopic.content && (
                    <div className="mt-3 text-xs text-gray-500">
                      {subtopic.content.length} content item(s)
                      {subtopic.quiz && subtopic.quiz.length > 0 && (
                        <> • {subtopic.quiz.length} quiz question(s)</>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!topic.content || topic.content.length === 0) && 
         (!topic.subTopics || topic.subTopics.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No content yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Content for this topic will be added soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
