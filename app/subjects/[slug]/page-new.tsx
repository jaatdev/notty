import { getSubjectBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { brandMap, type BrandKey } from '@/lib/brand'

type Params = { slug: string }

export default async function SubjectOverviewPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const subject = await getSubjectBySlug(slug)
  
  if (!subject) {
    return notFound()
  }

  const brand = brandMap[subject.brandColor as BrandKey] || brandMap.emerald

  return (
    <div className="notes-theme min-h-screen">
      {/* Subject Header */}
      <header className={`hero-bg ${brand.hero} text-white relative overflow-hidden no-print`}>
        <div className="p-10 md:p-14 shadow-2xl relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                ← Back to All Subjects
              </Link>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">{subject.emoji}</div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-3">
                {subject.title}
              </h1>
              <p className="text-lg md:text-2xl opacity-90 mb-6">
                {subject.description}
              </p>
              
              {/* Subject-level Quiz Button */}
              <div className="flex gap-4 justify-center">
                <Link
                  href={`/subjects/${subject.slug}/quiz`}
                  className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
                >
                  📝 Take Subject Quiz
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-dots"></div>
        </div>
      </header>

      {/* Topics Grid */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          📚 Topics
        </h2>

        {subject.topics.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <p className="text-gray-600 dark:text-gray-400">No topics available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.topics.map((topic, idx) => {
              const topicBrand = topic.brandColor ? brandMap[topic.brandColor as BrandKey] : brand
              const subtopicCount = topic.subTopics?.length || 0
              const quizCount = topic.quiz?.length || 0
              const contentCount = topic.content?.length || 0

              return (
                <Link
                  key={topic.id}
                  href={`/subjects/${subject.slug}/${topic.id}`}
                  className="card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all group animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h3>
                  
                  {topic.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {topic.description}
                    </p>
                  )}

                  {/* Topic Stats */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {contentCount > 0 && (
                      <span className={`px-2 py-1 rounded-full ${topicBrand.bg} ${topicBrand.text} font-semibold`}>
                        {contentCount} {contentCount === 1 ? 'Note' : 'Notes'}
                      </span>
                    )}
                    {subtopicCount > 0 && (
                      <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                        {subtopicCount} {subtopicCount === 1 ? 'Subtopic' : 'Subtopics'}
                      </span>
                    )}
                    {quizCount > 0 && (
                      <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
                        {quizCount} {quizCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-4 text-right text-gray-400 group-hover:text-indigo-600 transition-colors">
                    Start Learning →
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
