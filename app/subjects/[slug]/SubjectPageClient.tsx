'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Subject } from '@/lib/types'
import type { ThemeStyle } from '@/lib/theme-variants'

type SubjectPageClientProps = {
  subject: Subject
  brand: any
  theme: ThemeStyle
}

export default function SubjectPageClient({ subject, brand, theme }: SubjectPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className={`relative overflow-hidden ${brand.hero} text-white`}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-30 animate-pulse" 
            style={{ background: theme.accent }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse" 
            style={{ background: theme.secondary, animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link href="/" className="text-white/70 hover:text-white transition-colors font-medium inline-flex items-center gap-2">
              ← Back to All Subjects
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-7xl mb-6 inline-block animate-bounce">{subject.emoji}</div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              {subject.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-4xl mx-auto">
              {subject.description}
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href={`/subjects/${subject.slug}/quiz`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-2xl hover:shadow-yellow-300/50 hover:scale-105 transform"
              >
                📝 Take Subject Quiz
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
      </header>

      {/* Topics Grid */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4"
            style={{ 
              background: `${theme.accent}15`,
              color: theme.accent,
              border: `1px solid ${theme.accent}30`
            }}
          >
            📚 EXPLORE TOPICS
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Start Your Learning Journey
          </h2>
        </motion.div>

        {subject.topics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-3xl"
          >
            <div className="text-8xl mb-6">📚</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">No topics available yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.topics.map((topic, idx) => {
              const subtopicCount = topic.subTopics?.length || 0
              const quizCount = topic.quiz?.length || 0
              const contentCount = topic.content?.length || 0

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link
                    href={`/subjects/${subject.slug}/${topic.id}`}
                    className="block relative group"
                  >
                    <div 
                      className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all shadow-lg hover:shadow-2xl"
                      style={{
                        boxShadow: `0 4px 20px ${theme.glow}15`,
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                        style={{ background: theme.gradient }}
                      />

                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all"
                          style={{ backgroundImage: theme.gradient }}
                        >
                          {topic.title}
                        </h3>
                        
                        {topic.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {topic.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs mb-4">
                          {contentCount > 0 && (
                            <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold">
                              {contentCount} {contentCount === 1 ? 'Note' : 'Notes'}
                            </span>
                          )}
                          {subtopicCount > 0 && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                              {subtopicCount} {subtopicCount === 1 ? 'Subtopic' : 'Subtopics'}
                            </span>
                          )}
                          {quizCount > 0 && (
                            <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
                              {quizCount} Quiz
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-semibold" style={{ color: theme.accent }}>
                            Start Learning
                          </span>
                          <motion.div
                            className="flex items-center justify-center w-8 h-8 rounded-full"
                            style={{ background: theme.gradient }}
                            whileHover={{ scale: 1.1, rotate: 45 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div 
                          className="absolute top-0 -left-full w-1/2 h-full"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${theme.accent}20, transparent)`,
                            animation: 'shine 2s ease-in-out infinite',
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
