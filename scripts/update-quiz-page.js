const fs = require('fs');
const path = require('path');

const content = `'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug, findTopicByPath } from '@/lib/data'
import type { QuizQuestion, Subject, Topic } from '@/lib/types'
import { brandMap } from '@/lib/brand'
import { quizComplete } from '@/lib/confetti'

type QuizState = {
  questions: QuizQuestion[]
  currentIndex: number
  answers: Record<string, number>
  showResults: boolean
}

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const slug = params?.slug as string
  const topicPath = searchParams?.get('topic') // e.g., "preamble" or "preamble/pillars-preamble"
  
  const [subject, setSubject] = useState<Subject | null>(null)
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [loading, setLoading] = useState(true)
  const [celebrated, setCelebrated] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const subjectData = await getSubjectBySlug(slug)
        if (!subjectData) {
          setLoading(false)
          return
        }
        
        setSubject(subjectData)
        
        let allQuestions: QuizQuestion[] = []
        
        if (topicPath) {
          // Topic or subtopic quiz
          const pathParts = topicPath.split('/')
          const topic = findTopicByPath(subjectData, pathParts)
          
          if (topic) {
            // Collect questions from this topic and all its subtopics recursively
            const collectQuestions = (t: Topic): QuizQuestion[] => {
              const questions = [...(t.quiz || [])]
              if (t.subTopics) {
                t.subTopics.forEach(st => {
                  questions.push(...collectQuestions(st))
                })
              }
              return questions
            }
            
            allQuestions = collectQuestions(topic)
          }
        } else {
          // Subject-level quiz - collect from all topics
          const collectFromTopics = (topics: Topic[]): QuizQuestion[] => {
            let questions: QuizQuestion[] = []
            topics.forEach(topic => {
              questions.push(...(topic.quiz || []))
              if (topic.subTopics) {
                questions.push(...collectFromTopics(topic.subTopics))
              }
            })
            return questions
          }
          
          allQuestions = collectFromTopics(subjectData.topics || [])
        }
        
        // Shuffle and pick 10 random questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, Math.min(10, shuffled.length))
        
        setQuiz({
          questions: selected,
          currentIndex: 0,
          answers: {},
          showResults: false,
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading quiz:', error)
        setLoading(false)
      }
    }
    
    loadQuiz()
  }, [slug, topicPath])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    )
  }

  if (!subject || !quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href={\`/subjects/\${slug}\`} className="text-indigo-400 hover:text-indigo-300">
              ← Back to Subject
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold mb-4">No Quiz Available</h1>
            <p className="text-gray-400 mb-6">
              There are no quiz questions available for this {topicPath ? 'topic' : 'subject'} yet.
            </p>
            <Link
              href={\`/subjects/\${slug}\`}
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Back to {subject?.title || 'Subject'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const colors = brandMap[subject.brandColor]
  const currentQuestion = quiz.questions[quiz.currentIndex]
  const totalQuestions = quiz.questions.length
  const isLastQuestion = quiz.currentIndex === totalQuestions - 1

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setQuiz(prev => prev ? {
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIndex }
    } : null)
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      setQuiz(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null)
    }
  }

  const handlePrevious = () => {
    if (quiz.currentIndex > 0) {
      setQuiz(prev => prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : null)
    }
  }

  const handleSubmit = () => {
    const answered = Object.keys(quiz.answers).length
    if (answered < totalQuestions) {
      const confirm = window.confirm(
        \`You have only answered \${answered} out of \${totalQuestions} questions. Submit anyway?\`
      )
      if (!confirm) return
    }
    
    setQuiz(prev => prev ? { ...prev, showResults: true } : null)
    
    // Calculate score and trigger confetti
    const correct = quiz.questions.reduce((acc, q) => 
      acc + (quiz.answers[q.id] === q.answerIndex ? 1 : 0), 0
    )
    const score = Math.round((correct / totalQuestions) * 100)
    
    if (!celebrated) {
      quizComplete(score)
      setCelebrated(true)
    }
  }

  const handleRetry = () => {
    // Reshuffle and pick new questions
    const allQuestions = quiz.questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    
    setQuiz({
      questions: shuffled,
      currentIndex: 0,
      answers: {},
      showResults: false,
    })
    setCelebrated(false)
  }

  if (quiz.showResults) {
    const correct = quiz.questions.reduce((acc, q) => 
      acc + (quiz.answers[q.id] === q.answerIndex ? 1 : 0), 0
    )
    const score = Math.round((correct / totalQuestions) * 100)
    
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className={\`bg-gradient-to-br \${colors.hero} rounded-2xl p-8 mb-8 text-center\`}>
            <div className="text-6xl mb-4">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
            <div className="text-6xl font-bold mb-2">{score}%</div>
            <p className="text-xl text-white/90">
              You got {correct} out of {totalQuestions} questions correct
            </p>
          </div>

          {/* Review Answers */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
            {quiz.questions.map((q, idx) => {
              const userAnswer = quiz.answers[q.id]
              const isCorrect = userAnswer === q.answerIndex
              const wasAnswered = userAnswer !== undefined
              
              return (
                <div 
                  key={q.id} 
                  className="bg-gray-800 rounded-xl p-6 border-l-4"
                  style={{ 
                    borderColor: !wasAnswered ? '#6b7280' : isCorrect ? '#10b981' : '#ef4444' 
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">
                      {!wasAnswered ? '⚪' : isCorrect ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-lg mb-3">
                        {idx + 1}. {q.prompt}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isUserAnswer = userAnswer === optIdx
                          const isCorrectAnswer = optIdx === q.answerIndex
                          
                          return (
                            <div
                              key={optIdx}
                              className={\`p-3 rounded-lg border-2 \${
                                isCorrectAnswer
                                  ? 'bg-green-900/40 border-green-500 text-green-200'
                                  : isUserAnswer
                                  ? 'bg-red-900/40 border-red-500 text-red-200'
                                  : 'bg-gray-700 border-gray-600'
                              }\`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <span className="text-green-400">✓</span>}
                                {isUserAnswer && !isCorrectAnswer && <span className="text-red-400">✗</span>}
                                <span>{opt}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {q.reason && (
                        <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                          <p className="text-sm text-blue-200">
                            <strong>Explanation:</strong> {q.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              🔄 Try Again
            </button>
            <Link
              href={topicPath ? \`/subjects/\${slug}/\${topicPath}\` : \`/subjects/\${slug}\`}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            >
              ← Back to {topicPath ? 'Topic' : 'Subject'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Quiz in progress
  const userAnswer = quiz.answers[currentQuestion.id]
  const progress = ((quiz.currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href={topicPath ? \`/subjects/\${slug}/\${topicPath}\` : \`/subjects/\${slug}\`}
            className="text-indigo-400 hover:text-indigo-300 inline-block mb-4"
          >
            ← Back
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{subject.emoji} {subject.title}</h1>
              <p className="text-gray-400">
                {topicPath ? \`Topic Quiz: \${topicPath.split('/').pop()}\` : 'Subject Quiz'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{quiz.currentIndex + 1}/{totalQuestions}</div>
              <div className="text-sm text-gray-400">Questions</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={\`h-2 rounded-full bg-gradient-to-r \${colors.hero} transition-all duration-300\`}
              style={{ width: \`\${progress}%\` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <p className="text-2xl font-semibold mb-6">{currentQuestion.prompt}</p>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = userAnswer === idx
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQuestion.id, idx)}
                  className={\`w-full text-left p-4 rounded-lg border-2 transition \${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-650'
                  }\`}
                >
                  <div className="flex items-center gap-3">
                    <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center \${
                      isSelected ? 'border-white bg-white' : 'border-gray-400'
                    }\`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={quiz.currentIndex === 0}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg transition"
          >
            ← Previous
          </button>

          <div className="text-center text-sm text-gray-400">
            {Object.keys(quiz.answers).length} of {totalQuestions} answered
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              Submit Quiz ✓
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Next →
            </button>
          )}
        </div>

        {/* Answer Status Grid */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 mb-3">Question Status:</p>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((q, idx) => {
              const isAnswered = quiz.answers[q.id] !== undefined
              const isCurrent = idx === quiz.currentIndex
              
              return (
                <button
                  key={q.id}
                  onClick={() => setQuiz(prev => prev ? { ...prev, currentIndex: idx } : null)}
                  className={\`aspect-square rounded-lg font-semibold text-sm transition \${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : isAnswered
                      ? 'bg-green-700 text-white hover:bg-green-600'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }\`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
`;

const quizPagePath = path.join(__dirname, '..', 'app', 'subjects', '[slug]', 'quiz', 'page.tsx');

try {
  fs.writeFileSync(quizPagePath, content, 'utf8');
  console.log('✅ Quiz page successfully updated!');
  console.log(`   File: ${quizPagePath}`);
  console.log(`   Size: ${content.length} bytes`);
} catch (error) {
  console.error('❌ Error updating quiz page:', error.message);
  process.exit(1);
}
