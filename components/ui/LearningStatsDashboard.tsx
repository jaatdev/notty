'use client'
import { useEffect, useState } from 'react'
import { getLearningStats, checkAndUpdateStreak, getCardStats, ACHIEVEMENTS, type LearningStats } from '@/lib/learningProgress'

interface LearningStatsDashboardProps {
  subjectSlug: string
  totalCards: number
  isOpen?: boolean
  onClose?: () => void
}

export default function LearningStatsDashboard({ subjectSlug, totalCards, isOpen: externalIsOpen, onClose }: LearningStatsDashboardProps) {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onClose ? (value: boolean) => { if (!value) onClose() } : setInternalIsOpen

  const refreshStats = () => {
    const currentStats = getLearningStats(subjectSlug, totalCards)
    const streak = checkAndUpdateStreak(subjectSlug)
    const { mastered, due } = getCardStats(subjectSlug)
    
    // Update stats with accurate counts from localStorage
    setStats({ 
      ...currentStats, 
      studyStreak: streak,
      masteredCards: mastered,
      dueCards: due
    })
  }

  useEffect(() => {
    refreshStats()
  }, [subjectSlug, totalCards])

  useEffect(() => {
    // Listen for stats updates from flashcards
    const handleStatsUpdate = () => {
      refreshStats()
    }
    
    window.addEventListener('notty:statsUpdated', handleStatsUpdate)
    return () => window.removeEventListener('notty:statsUpdated', handleStatsUpdate)
  }, [subjectSlug, totalCards])

  if (!stats) return null

  const progress = totalCards > 0 ? Math.round((stats.masteredCards / totalCards) * 100) : 0
  const unlockedAchievements = ACHIEVEMENTS.filter(a => stats.achievements.includes(a.id))

  const handleOpen = () => {
    refreshStats() // Refresh stats when opening
    if (externalIsOpen === undefined) {
      setInternalIsOpen(true)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-gray-900 border-2 border-emerald-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-linear-to-r from-emerald-600 to-emerald-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">📈</span>
                  Learning Analytics
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white text-3xl hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="text-3xl mb-2">🎴</div>
                  <div className="text-2xl font-bold text-emerald-400">{stats.totalCards}</div>
                  <div className="text-xs text-gray-400">Total Cards</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-emerald-400">{stats.masteredCards}</div>
                  <div className="text-xs text-gray-400">Mastered</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-orange-400">{stats.studyStreak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalStudyTime}</div>
                  <div className="text-xs text-gray-400">Min Studied</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Overall Progress</span>
                  <span className="text-sm font-bold text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${progress}%` }}
                  >
                    {progress > 10 && <span className="text-xs font-bold text-white">🎯</span>}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ACHIEVEMENTS.map((achievement) => {
                    const unlocked = stats.achievements.includes(achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border transition-all ${
                          unlocked
                            ? 'bg-emerald-900/30 border-emerald-600/50'
                            : 'bg-gray-900 border-gray-700 opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{achievement.icon}</div>
                        <div className={`text-sm font-semibold ${unlocked ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-linear-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-blue-700/50">
                <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Study Tip
                </h4>
                <p className="text-xs text-gray-300">
                  {stats.studyStreak === 0 && "Start your learning journey today! Consistency is key to mastery."}
                  {stats.studyStreak > 0 && stats.studyStreak < 7 && "Great start! Keep your streak going to build a strong habit."}
                  {stats.studyStreak >= 7 && stats.studyStreak < 30 && "You're on fire! 🔥 Spaced repetition works best with regular practice."}
                  {stats.studyStreak >= 30 && "Legendary dedication! You're a true learning master. 👑"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
