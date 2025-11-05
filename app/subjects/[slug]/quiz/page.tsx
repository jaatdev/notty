'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSubjectData, collectAllQuizQuestions, sampleRandom } from '@/lib/data'
import type { QuizQuestion } from '@/lib/types'
import { quizComplete } from '@/lib/confetti'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [picked, setPicked] = useState<Record<string, number>>({})
  const [checked, setChecked] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const subject = getSubjectData(slug)
    if (!subject) {
      router.push('/subjects')
      return
    }

    // Collect all questions from the subject
    const allQuestions = collectAllQuizQuestions(subject)

    // Select 10 random questions
    const randomQuestions = sampleRandom(allQuestions, 10)

    setQuestions(randomQuestions)
    setLoading(false)
  }, [slug, router])

  function onPick(qid: string, idx: number) {
    const next = { ...picked, [qid]: idx }
    setPicked(next)
  }

  const total = questions.length
  const correct = questions.reduce((acc, q) => acc + (picked[q.id] === q.answerIndex ? 1 : 0), 0)
  const score = total > 0 ? Math.round((correct / total) * 100) : 0

  // Trigger confetti when quiz is checked and score is calculated
  useEffect(() => {
    if (checked && !celebrated && Object.keys(picked).length === total) {
      quizComplete(score)
      setCelebrated(true)
    }
  }, [checked, score, total, celebrated, picked])

  // Reset celebration flag when quiz is reset
  useEffect(() => {
    if (!checked) {
      setCelebrated(false)
    }
  }, [checked])

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quiz questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href={`/subjects/${slug}`} className="text-indigo-400 hover:text-indigo-300">
              ← Back to Subject
            </Link>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">No Quiz Questions Available</h1>
            <p className="text-gray-400 mb-6">
              This subject doesn't have any quiz questions yet.
            </p>
            <Link
              href={`/subjects/${slug}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Subject
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/subjects/${slug}`} className="text-indigo-400 hover:text-indigo-300">
            ← Back to Subject
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border-t-4 border-emerald-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Quiz: {getSubjectData(slug)?.title}</h1>
            <p className="text-gray-400">Test your knowledge with 10 random questions</p>
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => {
              const user = picked[q.id]
              const isCorrect = checked && user === q.answerIndex
              const isWrong = checked && user !== undefined && user !== q.answerIndex
              return (
                <div key={q.id} className="p-6 bg-gray-700 rounded-lg shadow-md border-l-4 border-emerald-500">
                  <p className="font-semibold text-lg text-gray-200 mb-4">
                    {index + 1}. {q.prompt}
                  </p>
                  <div className="space-y-3">
                    {q.options.map((opt, idx) => (
                      <label key={idx} className="flex items-center space-x-3 text-gray-300 hover:bg-gray-600 p-3 rounded-md cursor-pointer transition">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={user === idx}
                          onChange={() => onPick(q.id, idx)}
                          className="text-emerald-500 h-4 w-4"
                        />
                        <span className={`${
                          checked
                            ? (idx === q.answerIndex ? 'text-green-400 font-bold' : (user === idx ? 'text-red-400' : ''))
                            : ''
                        }`}>
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                  {checked && (
                    <div className={`mt-4 p-3 text-sm font-medium rounded ${
                      isCorrect
                        ? 'bg-green-900/40 text-green-300 border border-green-700'
                        : isWrong
                        ? 'bg-red-900/40 text-red-300 border border-red-700'
                        : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                    }`}>
                      {isCorrect
                        ? '✅ Correct!'
                        : isWrong
                        ? <>❌ Incorrect. Correct: <strong>{q.options[q.answerIndex]}</strong>{q.reason ? <> — {q.reason}</> : null}</>
                        : 'Select an option'
                      }
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            {!checked ? (
              <button
                onClick={() => setChecked(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Submit Quiz
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setPicked({}); setChecked(false) }}
                  className="border border-emerald-600 text-emerald-400 font-bold py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  Try Again
                </button>
                <Link
                  href={`/subjects/${slug}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Back to Subject
                </Link>
              </>
            )}
            {checked && (
              <div className="ml-auto text-center">
                <div className="text-2xl font-bold text-emerald-400">{score}%</div>
                <div className="text-sm text-gray-400">Score: {correct} / {total}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
