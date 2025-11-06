'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getNotesStats, getAllNotesForSubject } from '@/lib/notes-hierarchical'
import type { Note } from '@/lib/notes-hierarchical'

// Define NotesStats type based on the return from getNotesStats
interface NotesStats {
  total: number
  byLevel: {
    topic: number
    subtopic: number
  }
  recentlyUpdated: number
  last7Days: number
  last30Days: number
  bySubject: { [key: string]: number }
  topTags: Array<{ tag: string; count: number }>
  avgNotesPerDay: number
}

// Icon Components
const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const TrendUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const FireIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z" />
  </svg>
)

interface NotesAnalyticsProps {
  subjectSlug: string
  isOpen: boolean
  onClose: () => void
}

export default function NotesAnalytics({ subjectSlug, isOpen, onClose }: NotesAnalyticsProps) {
  const [stats, setStats] = useState<NotesStats | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')
  const [loading, setLoading] = useState(true)

  // Load stats whenever modal opens or subject changes
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      const notesStats = getNotesStats(subjectSlug)
      setStats(notesStats)
      setLoading(false)
    }
  }, [isOpen, subjectSlug])

  // Calculate time-filtered stats
  const filteredStats = useMemo(() => {
    if (!stats) return null

    const now = Date.now()
    const cutoffDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : Infinity
    const cutoffTime = now - cutoffDays * 24 * 60 * 60 * 1000

    // Filter notes based on time range
    const allNotes = getAllNotesForSubject(subjectSlug)
    const filteredNotes = timeRange === 'all' 
      ? allNotes 
      : allNotes.filter(note => new Date(note.createdAt).getTime() >= cutoffTime)

    // Calculate filtered stats manually
    const topicNotes = filteredNotes.filter(n => !n.subtopicId).length
    const subtopicNotes = filteredNotes.filter(n => n.subtopicId).length
    
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
    
    const tagFrequency: { [tag: string]: number } = {}
    filteredNotes.forEach(note => {
      note.tags?.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    })

    return {
      total: filteredNotes.length,
      byLevel: { topic: topicNotes, subtopic: subtopicNotes },
      recentlyUpdated: filteredNotes.filter(n => {
        const daysSinceUpdate = (now - new Date(n.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceUpdate <= 7
      }).length,
      last7Days: filteredNotes.filter(n => new Date(n.createdAt).getTime() > sevenDaysAgo).length,
      last30Days: filteredNotes.filter(n => new Date(n.createdAt).getTime() > thirtyDaysAgo).length,
      bySubject: filteredNotes.reduce((acc, note) => {
        const slug = note.subjectSlug || 'unknown'
        acc[slug] = (acc[slug] || 0) + 1
        return acc
      }, {} as { [key: string]: number }),
      topTags: Object.entries(tagFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      avgNotesPerDay: filteredNotes.length > 0
        ? (filteredNotes.length / Math.max(1, Math.ceil((now - new Date(filteredNotes[filteredNotes.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))))
        : 0
    }
  }, [stats, timeRange, subjectSlug])

  // Calculate study streak (consecutive days with notes)
  const calculateStreak = useMemo(() => {
    if (!stats) return 0

    const allNotes = getAllNotesForSubject(subjectSlug)
    if (allNotes.length === 0) return 0

    // Sort notes by date (newest first)
    const sortedNotes = [...allNotes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    // Get unique dates (just the day, not time)
    const uniqueDays = new Set(
      sortedNotes.map(note => new Date(note.createdAt).toDateString())
    )

    let streak = 0
    const today = new Date().toDateString()
    let currentDate = new Date()

    // Check consecutive days backwards from today
    while (true) {
      const dateString = currentDate.toDateString()
      if (uniqueDays.has(dateString)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (dateString === today && streak === 0) {
        // If no notes today, start checking from yesterday
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }, [stats, subjectSlug])

  // Calculate productivity score (0-100)
  const productivityScore = useMemo(() => {
    if (!filteredStats) return 0

    const factors = {
      totalNotes: Math.min(filteredStats.total / 10, 30), // Max 30 points
      recentActivity: filteredStats.last7Days > 0 ? 20 : 0, // 20 points for recent activity
      tagDiversity: Math.min(filteredStats.topTags.length * 5, 20), // Max 20 points
      streak: Math.min(calculateStreak * 10, 30), // Max 30 points
    }

    return Math.round(
      factors.totalNotes + factors.recentActivity + factors.tagDiversity + factors.streak
    )
  }, [filteredStats, calculateStreak])

  // Get activity timeline data
  const activityTimeline = useMemo(() => {
    if (!stats) return []

    const allNotes = getAllNotesForSubject(subjectSlug)
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const timeline: { date: string; count: number; day: string }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

      const count = allNotes.filter(note => 
        new Date(note.createdAt).toDateString() === dateString
      ).length

      timeline.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
        day: dayName
      })
    }

    return timeline
  }, [stats, timeRange, subjectSlug])

  const maxActivity = Math.max(...activityTimeline.map(d => d.count), 1)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(243,244,246,0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
                  <AnalyticsIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Notes Analytics
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your learning insights and productivity metrics
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                aria-label="Close analytics"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2 mt-4">
              {(['7d', '30d', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredStats ? (
            <div className="p-8 space-y-8">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Notes</p>
                      <p className="text-4xl font-bold mt-2">{filteredStats.total}</p>
                    </div>
                    <TrendUpIcon />
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Last 7 Days</p>
                      <p className="text-4xl font-bold mt-2">{filteredStats.last7Days}</p>
                    </div>
                    <CalendarIcon />
                  </div>
                </motion.div>

                {/* Study Streak */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Study Streak</p>
                      <p className="text-4xl font-bold mt-2">{calculateStreak} days</p>
                    </div>
                    <FireIcon />
                  </div>
                </motion.div>

                {/* Productivity Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Productivity</p>
                      <p className="text-4xl font-bold mt-2">{productivityScore}/100</p>
                    </div>
                    <div className="relative w-12 h-12">
                      <svg className="transform -rotate-90 w-12 h-12">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="opacity-30"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(productivityScore / 100) * 125.6} 125.6`}
                          className="opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Activity Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <CalendarIcon />
                  Activity Timeline
                </h3>
                <div className="flex items-end justify-between gap-1 h-48">
                  {activityTimeline.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 relative group"
                        style={{
                          height: `${(day.count / maxActivity) * 100}%`,
                          minHeight: day.count > 0 ? '8px' : '2px',
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {day.count} notes
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Tags & Additional Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TagIcon />
                    Top Tags
                  </h3>
                  <div className="space-y-3">
                    {filteredStats.topTags.slice(0, 8).map((tag, index) => (
                      <div key={tag.tag} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {tag.tag}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tag.count}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(tag.count / filteredStats.topTags[0].count) * 100}%` }}
                              transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredStats.topTags.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No tags yet. Add tags to your notes for better organization!
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Productivity Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Productivity Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Average notes/day
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {filteredStats.avgNotesPerDay.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Topic notes
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {filteredStats.byLevel.topic}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Unique tags
                      </span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {filteredStats.topTags.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last 30 days
                      </span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {filteredStats.last30Days}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No notes data available. Start taking notes to see your analytics!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
