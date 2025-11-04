import { getAllSubjects } from '@/lib/data'
import Link from 'next/link'
import { brandMap, type BrandKey } from '@/lib/brand'

export default async function HomePage() {
  const subjects = await getAllSubjects()

  // Calculate stats
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0)
  const totalQuizzes = subjects.reduce((sum, s) => {
    return sum + s.topics.reduce((topicSum, t) => topicSum + (t.quiz?.length || 0), 0)
  }, 0)

  return (
    <>
      {/* Hero Section */}
      <header className="hero-bg text-white relative overflow-hidden no-print">
        <div className="p-10 md:p-14 shadow-2xl relative">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3 animate-fade-in">
              📚 Welcome to Notty
            </h1>
            <p className="text-lg md:text-2xl opacity-90 animate-slide-up">
              Your World-Class Learning Platform for Competitive Exams
            </p>
          </div>
          <div className="hero-dots"></div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-indigo-600">{subjects.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Subjects</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-emerald-600">{totalTopics}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-amber-600">{totalQuizzes}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Questions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-pink-600">🎯</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Practice Mode</div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section id="subjects" className="max-w-6xl mx-auto px-4 md:px-6 mt-12 mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
          📖 All Subjects
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
          {subjects.map((subject, idx) => {
            const brand = (brandMap[subject.brandColor as BrandKey] || brandMap.emerald)
            
            return (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all group animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="text-4xl mb-3 transition-transform group-hover:scale-110">
                  {subject.emoji}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {subject.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {subject.description}
                </p>
                
                {/* Topic Count Badge */}
                <div className="mt-auto flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${brand.bg} ${brand.text} font-semibold`}>
                    {subject.topics.length} {subject.topics.length === 1 ? 'Topic' : 'Topics'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Start →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <p className="text-gray-600 dark:text-gray-400">No subjects available yet.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Add subjects to <code>data/notes.json</code> to get started.
            </p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-16">
        <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white card">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">🚀 How Notty Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">📚</div>
              <h4 className="font-bold mb-2">Hierarchical Learning</h4>
              <p className="text-sm opacity-90">
                Subject → Topic → Sub-Topic structure for organized learning
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-bold mb-2">Smart Quizzes</h4>
              <p className="text-sm opacity-90">
                Take quizzes at any level - subject, topic, or subtopic
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold mb-2">Performance Tracking</h4>
              <p className="text-sm opacity-90">
                Track progress, bookmarks, and learning stats
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
