'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getQuizHistory, type QuizHistoryEntry } from '@/lib/quiz-state'

interface TopicStats {
  topic: string
  total: number
  correct: number
  percentage: number
  attempts: number
}

interface PerformanceData {
  date: string
  score: number
  percentage: number
}

export default function QuizAnalyticsPage() {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  useEffect(() => {
    setHistory(getQuizHistory())
  }, [])

  const subjects = useMemo(() => {
    const subjectSet = new Set(history.map(h => h.subjectId))
    return ['all', ...Array.from(subjectSet)]
  }, [history])

  const filteredHistory = useMemo(() => {
    if (selectedSubject === 'all') return history
    return history.filter(h => h.subjectId === selectedSubject)
  }, [history, selectedSubject])

  const topicStats = useMemo(() => {
    const stats = new Map<string, TopicStats>()
    
    filteredHistory.forEach(entry => {
      entry.questions.forEach(q => {
        const existing = stats.get(q.topic) || {
          topic: q.topic,
          total: 0,
          correct: 0,
          percentage: 0,
          attempts: 0,
        }
        
        existing.total++
        existing.attempts++
        if (q.isCorrect) existing.correct++
        existing.percentage = Math.round((existing.correct / existing.total) * 100)
        
        stats.set(q.topic, existing)
      })
    })
    
    return Array.from(stats.values()).sort((a, b) => a.percentage - b.percentage)
  }, [filteredHistory])

  const performanceOverTime = useMemo(() => {
    return filteredHistory
      .map(entry => ({
        date: new Date(entry.completedAt).toLocaleDateString(),
        score: entry.score.obtained,
        percentage: entry.score.percentage,
      }))
      .reverse()
      .slice(-10) // Last 10 attempts
  }, [filteredHistory])

  const overallStats = useMemo(() => {
    const totalQuestions = filteredHistory.reduce((sum, h) => sum + h.questions.length, 0)
    const totalCorrect = filteredHistory.reduce((sum, h) => 
      sum + h.questions.filter(q => q.isCorrect).length, 0
    )
    const avgScore = filteredHistory.length > 0
      ? filteredHistory.reduce((sum, h) => sum + h.score.percentage, 0) / filteredHistory.length
      : 0
    
    return {
      totalAttempts: filteredHistory.length,
      totalQuestions,
      totalCorrect,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      avgScore: Math.round(avgScore),
    }
  }, [filteredHistory])

  const weakTopics = topicStats.filter(t => t.percentage < 60).slice(0, 5)
  const strongTopics = topicStats.filter(t => t.percentage >= 80).slice(-5).reverse()

  const improvementRate = useMemo(() => {
    if (performanceOverTime.length < 2) return 0
    const recent = performanceOverTime.slice(-3).reduce((sum, p) => sum + p.percentage, 0) / Math.min(3, performanceOverTime.length)
    const older = performanceOverTime.slice(0, 3).reduce((sum, p) => sum + p.percentage, 0) / Math.min(3, performanceOverTime.length)
    return Math.round(recent - older)
  }, [performanceOverTime])

  if (history.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Quiz Data Yet</h2>
          <p className="text-gray-500 dark:text-gray-400">Complete some quizzes to see your analytics!</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quiz Analytics
          </h1>
          
          {/* Subject Filter */}
          <div className="flex gap-2 flex-wrap">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSubject === subject
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Attempts', value: overallStats.totalAttempts, icon: '🎯' },
            { label: 'Total Questions', value: overallStats.totalQuestions, icon: '❓' },
            { label: 'Accuracy', value: `${overallStats.accuracy}%`, icon: '🎪' },
            { label: 'Avg Score', value: `${overallStats.avgScore}%`, icon: '⭐' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-6 bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            📈 Performance Over Time
            {improvementRate !== 0 && (
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  background: improvementRate > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: improvementRate > 0 ? '#22c55e' : '#ef4444',
                }}
              >
                {improvementRate > 0 ? '↗' : '↘'} {Math.abs(improvementRate)}%
              </span>
            )}
          </h2>
          
          <div className="space-y-3">
            {performanceOverTime.map((perf, i) => {
              const maxScore = Math.max(...performanceOverTime.map(p => p.percentage))
              const width = maxScore > 0 ? (perf.percentage / maxScore) * 100 : 0
              
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">{perf.date}</div>
                  <div className="flex-1 relative h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500"
                    />
                    <div className="absolute inset-0 flex items-center px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {perf.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-500 dark:text-gray-400">{perf.score}</div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weak Topics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              🔴 Topics to Improve
            </h2>
            
            {weakTopics.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Great job! No weak topics found! 🎉</p>
            ) : (
              <div className="space-y-4">
                {weakTopics.map((topic, i) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{topic.topic}</div>
                      <div className="text-sm text-red-600 dark:text-red-400">{topic.percentage}%</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{topic.correct}/{topic.total} correct</span>
                      <span>•</span>
                      <span>{topic.attempts} attempts</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full overflow-hidden bg-red-200 dark:bg-red-900/30">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-red-500 to-red-400"
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Strong Topics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              🟢 Strong Topics
            </h2>
            
            {strongTopics.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Complete more quizzes to identify your strengths!</p>
            ) : (
              <div className="space-y-4">
                {strongTopics.map((topic, i) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{topic.topic}</div>
                      <div className="text-sm text-green-600 dark:text-green-400">{topic.percentage}%</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{topic.correct}/{topic.total} correct</span>
                      <span>•</span>
                      <span>{topic.attempts} attempts</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full overflow-hidden bg-green-200 dark:bg-green-900/30">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-green-500 to-green-400"
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
