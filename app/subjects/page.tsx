import { getAllSubjects } from '@/lib/data'
import Link from 'next/link'
import { brandMap, type BrandKey } from '@/lib/brand'
import ScrollAnimation from '@/components/ScrollAnimation'
import '../scroll-animations.css'

export const metadata = {
  title: 'All Subjects - Notty',
  description: 'Explore all subjects available on Notty learning platform'
}

export default async function SubjectsPage() {
  const subjects = await getAllSubjects()

  const gradients = [
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-purple-600'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-violet-600 via-fuchsia-500 to-pink-500 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <ScrollAnimation animation="fade-up">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-6 border border-white/30">
              📚 ALL SUBJECTS
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Master Every Subject
            </h1>
            <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
              Comprehensive study material for UPSC, SSC, Banking, and more competitive exams
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-black bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{subjects.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">Total Subjects</div>
            </div>
            <div>
              <div className="text-4xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {subjects.reduce((sum, s) => sum + s.topics.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">Topics Covered</div>
            </div>
            <div>
              <div className="text-4xl font-black bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">Free Access</div>
            </div>
            <div>
              <div className="text-4xl font-black bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16 bg-linear-to-b from-white via-violet-50/30 to-white dark:from-gray-900 dark:via-violet-950/10 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject, idx) => {
              const gradient = gradients[idx % gradients.length]
              
              return (
                <ScrollAnimation key={subject.slug} animation="scale" delay={idx * 30}>
                  <Link
                    href={`/subjects/${subject.slug}`}
                    className="group relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 dark:border-gray-700 hover:border-transparent overflow-hidden h-full flex flex-col"
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className="relative z-10 flex-grow">
                      <div className="text-6xl mb-4 transition-all group-hover:scale-125 group-hover:rotate-12 inline-block">
                        {subject.emoji}
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-white mb-2 transition-colors">
                        {subject.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 line-clamp-3 mb-4 transition-colors">
                        {subject.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between text-xs mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 group-hover:border-white/20">
                      <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 text-gray-700 dark:text-gray-300 group-hover:text-white font-bold transition-colors">
                        {subject.topics.length} {subject.topics.length === 1 ? 'Topic' : 'Topics'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-white font-bold group-hover:translate-x-2 transition-all inline-flex items-center gap-1">
                        Start <span>→</span>
                      </span>
                    </div>
                  </Link>
                </ScrollAnimation>
              )
            })}
          </div>

          {subjects.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No subjects available yet</p>
              <p className="text-gray-600 dark:text-gray-400">
                Add subjects to <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">data/notes.json</code> to get started
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-violet-950 to-gray-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <ScrollAnimation animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Can't Find Your Subject?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              We're constantly adding new subjects. Request yours today!
            </p>
            <a href="#" className="inline-block px-10 py-4 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-lg hover:from-violet-700 hover:to-fuchsia-700 shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105">
              Request a Subject
            </a>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}
