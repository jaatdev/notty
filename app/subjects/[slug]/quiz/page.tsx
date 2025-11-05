/**
 * 🎯 QUIZ PAGE - World-Class Quiz Interface
 * Steps 16-20: Integration with Advanced QuizPanel
 * Steps 46: Lazy loading optimization
 * Ultra-modern exam-style quiz with theme integration
 */

'use client'
import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSubjectData, collectAllQuizQuestions, sampleRandom } from '@/lib/data'
import type { QuizQuestion } from '@/lib/types'
import { quizComplete } from '@/lib/confetti'

// Lazy load the heavy QuizPanel component
const QuizPanel = lazy(() => import('@/components/quiz/QuizPanel').then(mod => ({ default: mod.QuizPanel })))

// Loading fallback component
function QuizLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Preparing quiz interface...</p>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    try {
      const subject = getSubjectData(slug)
      if (!subject) {
        setError('Subject not found')
        setLoading(false)
        return
      }

      // Collect all questions from the subject
      const allQuestions = collectAllQuizQuestions(subject)

      if (allQuestions.length === 0) {
        setError('No questions available')
        setLoading(false)
        return
      }

      // Select 10 random questions (or all if less than 10)
      const questionCount = Math.min(10, allQuestions.length)
      const randomQuestions = sampleRandom(allQuestions, questionCount)

      setQuestions(randomQuestions)
      setLoading(false)
    } catch (err) {
      console.error('Error loading quiz:', err)
      setError('Failed to load quiz')
      setLoading(false)
    }
  }, [slug, router])

  // Handle quiz completion with confetti
  const handleQuizComplete = (score: number) => {
    quizComplete(score)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  // Error state - Subject not found
  if (error === 'Subject not found') {
    return (
      <div className="min-h-screen p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">Subject Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The subject you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state - No questions available
  if (error === 'No questions available' || questions.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="mb-6">
            <Link 
              href={`/subjects/${slug}`} 
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Subject
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">No Quiz Questions Available</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              This subject doesn't have any quiz questions yet. Check back later!
            </p>
            <Link
              href={`/subjects/${slug}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Subject
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Generic error state
  if (error) {
    return (
      <div className="min-h-screen p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">Error Loading Quiz</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <Link
                href={`/subjects/${slug}`}
                className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Back to Subject
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main quiz interface with new QuizPanel (lazy loaded)
  return (
    <Suspense fallback={<QuizLoadingFallback />}>
      <QuizPanel 
        questions={questions} 
        topicId={slug}
        onComplete={handleQuizComplete}
      />
    </Suspense>
  )
}
