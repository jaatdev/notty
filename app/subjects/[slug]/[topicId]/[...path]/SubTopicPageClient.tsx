'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import TopicContent from '../TopicContent'
import type { Subject, Topic } from '@/lib/types'
import type { ThemeStyle } from '@/lib/theme-variants'

type Breadcrumb = {
  label: string
  href: string
}

type SubTopicPageClientProps = {
  subject: Subject
  topic: Topic
  slug: string
  topicId: string
  fullPath: string[]
  breadcrumbs: Breadcrumb[]
  parentPath: string
  colors: any
  theme: ThemeStyle
}

export default function SubTopicPageClient({ 
  subject, 
  topic, 
  slug, 
  topicId, 
  fullPath, 
  breadcrumbs, 
  parentPath, 
  colors, 
  theme 
}: SubTopicPageClientProps) {
  const contentCount = topic.content?.length || 0
  const subtopicCount = topic.subTopics?.length || 0
  const quizCount = topic.quiz?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Animated Header with Gradient */}
      <div className={`relative overflow-hidden ${colors.hero}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-30 animate-pulse" 
            style={{ background: theme.accent }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse" 
            style={{ background: theme.secondary, animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
          {/* Breadcrumb with Animation */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-white/50">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-white/70 hover:text-white transition-colors font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-bold">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

          {/* Topic Header with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="text-lg md:text-xl text-white/90 max-w-4xl mb-6 leading-relaxed">
                {topic.description}
              </p>
            )}

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {contentCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30"
                >
                  📄 {contentCount} {contentCount === 1 ? 'Note' : 'Notes'}
                </motion.div>
              )}
              {subtopicCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30"
                >
                  📚 {subtopicCount} {subtopicCount === 1 ? 'Subtopic' : 'Subtopics'}
                </motion.div>
              )}
              {quizCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30"
                >
                  ❓ {quizCount} {quizCount === 1 ? 'Question' : 'Questions'}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              {topic.quiz && topic.quiz.length > 0 && (
                <Link
                  href={`/subjects/${slug}/quiz?topic=${fullPath.join('/')}`}
                  className="group px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-2xl hover:shadow-yellow-300/50 hover:scale-105 transform inline-flex items-center gap-2"
                >
                  📝 Take Quiz ({topic.quiz.length})
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}
              <Link
                href={parentPath}
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all border-2 border-white/40 hover:border-white/60 inline-flex items-center gap-2"
              >
                ← Back
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Content Nodes */}
        {topic.content && topic.content.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TopicContent 
              content={topic.content} 
              subjectSlug={slug} 
              topicId={topicId}
              brandColor={subject.brandColor}
            />
          </motion.div>
        )}

        {/* Subtopics Grid */}
        {topic.subTopics && topic.subTopics.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4"
                style={{ 
                  background: `${theme.accent}15`,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`
                }}
              >
                📚 EXPLORE SUBTOPICS
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Dive Deeper
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topic.subTopics.map((subtopic: any, idx: number) => (
                <motion.div
                  key={subtopic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link
                    href={`/subjects/${slug}/${fullPath.join('/')}/${subtopic.id}`}
                    className="block relative group"
                  >
                    <div 
                      className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all shadow-lg hover:shadow-2xl"
                      style={{
                        boxShadow: `0 4px 20px ${theme.glow}15`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                        style={{ background: theme.gradient }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all"
                          style={{ backgroundImage: theme.gradient }}
                        >
                          {subtopic.title}
                        </h3>
                        
                        {subtopic.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {subtopic.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 text-xs mb-4">
                          {subtopic.content && subtopic.content.length > 0 && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                              {subtopic.content.length} {subtopic.content.length === 1 ? 'Note' : 'Notes'}
                            </span>
                          )}
                          {subtopic.quiz && subtopic.quiz.length > 0 && (
                            <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
                              {subtopic.quiz.length} Quiz
                            </span>
                          )}
                        </div>

                        {/* Arrow */}
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

                      {/* Shine Effect */}
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
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {(!topic.content || topic.content.length === 0) && 
         (!topic.subTopics || topic.subTopics.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="relative inline-block">
              <div className="text-8xl mb-6 animate-bounce">📚</div>
              <div className="absolute inset-0 blur-2xl opacity-30" style={{ background: theme.accent }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No content yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Content for this topic will be added soon.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
