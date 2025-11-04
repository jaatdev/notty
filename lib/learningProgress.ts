// Spaced Repetition System using SM-2 Algorithm
export interface CardProgress {
  cardId: string
  easeFactor: number // 1.3 - 2.5 (difficulty)
  interval: number // days until next review
  repetitions: number // how many times reviewed correctly
  nextReview: number // timestamp
  lastReview: number // timestamp
  streak: number // consecutive correct answers
}

export interface LearningStats {
  totalCards: number
  masteredCards: number // repetitions >= 3
  dueCards: number
  studyStreak: number // consecutive days
  totalStudyTime: number // minutes
  lastStudyDate: string // ISO date
  achievements: string[]
}

const INITIAL_EASE = 2.5
const MIN_EASE = 1.3

// SM-2 Algorithm for spaced repetition
export function calculateNextReview(
  card: CardProgress,
  quality: number // 0-5 (0=complete blackout, 5=perfect recall)
): CardProgress {
  const newCard = { ...card, lastReview: Date.now() }

  if (quality < 3) {
    // Failed - reset
    newCard.repetitions = 0
    newCard.interval = 1
    newCard.streak = 0
  } else {
    // Passed
    newCard.repetitions++
    newCard.streak++
    
    // Update ease factor
    const newEase = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    newCard.easeFactor = Math.max(MIN_EASE, newEase)

    // Calculate new interval
    if (newCard.repetitions === 1) {
      newCard.interval = 1
    } else if (newCard.repetitions === 2) {
      newCard.interval = 6
    } else {
      newCard.interval = Math.round(card.interval * newCard.easeFactor)
    }
  }

  // Set next review timestamp
  newCard.nextReview = Date.now() + newCard.interval * 24 * 60 * 60 * 1000

  return newCard
}

export function getCardProgress(subjectSlug: string, cardId: string): CardProgress | null {
  try {
    const key = `progress:${subjectSlug}:${cardId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setCardProgress(subjectSlug: string, cardId: string, progress: CardProgress): void {
  try {
    const key = `progress:${subjectSlug}:${cardId}`
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (err) {
    console.error('Failed to save card progress:', err)
  }
}

export function getLearningStats(subjectSlug: string, totalCards: number): LearningStats {
  try {
    const key = `stats:${subjectSlug}`
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
  } catch {}

  return {
    totalCards,
    masteredCards: 0,
    dueCards: totalCards,
    studyStreak: 0,
    totalStudyTime: 0,
    lastStudyDate: new Date().toISOString().split('T')[0],
    achievements: []
  }
}

export function updateLearningStats(subjectSlug: string, updates: Partial<LearningStats>): void {
  try {
    const key = `stats:${subjectSlug}`
    const current = getLearningStats(subjectSlug, updates.totalCards || 0)
    const updated = { ...current, ...updates }
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to update learning stats:', err)
  }
}

export function checkAndUpdateStreak(subjectSlug: string): number {
  try {
    const stats = getLearningStats(subjectSlug, 0)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    if (stats.lastStudyDate === today) {
      return stats.studyStreak
    } else if (stats.lastStudyDate === yesterday) {
      const newStreak = stats.studyStreak + 1
      updateLearningStats(subjectSlug, {
        studyStreak: newStreak,
        lastStudyDate: today
      })
      return newStreak
    } else {
      // Streak broken
      updateLearningStats(subjectSlug, {
        studyStreak: 1,
        lastStudyDate: today
      })
      return 1
    }
  } catch {
    return 0
  }
}

export const ACHIEVEMENTS = [
  { id: 'first_card', name: 'First Steps', description: 'Review your first flashcard', icon: '🌱' },
  { id: 'streak_3', name: '3-Day Streak', description: 'Study for 3 consecutive days', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Study for 7 consecutive days', icon: '⚡' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Study for 30 consecutive days', icon: '🏆' },
  { id: 'master_10', name: 'Decagon', description: 'Master 10 flashcards', icon: '🌟' },
  { id: 'master_50', name: 'Half Century', description: 'Master 50 flashcards', icon: '💎' },
  { id: 'master_100', name: 'Centurion', description: 'Master 100 flashcards', icon: '👑' },
  { id: 'quiz_perfect', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '🎯' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 20 cards in one session', icon: '⚡' },
  { id: 'night_owl', name: 'Night Owl', description: 'Study after midnight', icon: '🦉' },
]

export function checkAchievements(subjectSlug: string, stats: LearningStats): string[] {
  const unlocked: string[] = []
  
  // First card - triggers when you've reviewed at least 1 card (not mastered)
  const totalReviewed = getAllStudiedCardIds(subjectSlug).length
  if (totalReviewed >= 1 && !stats.achievements.includes('first_card')) {
    unlocked.push('first_card')
  }
  if (stats.studyStreak >= 3 && !stats.achievements.includes('streak_3')) {
    unlocked.push('streak_3')
  }
  if (stats.studyStreak >= 7 && !stats.achievements.includes('streak_7')) {
    unlocked.push('streak_7')
  }
  if (stats.studyStreak >= 30 && !stats.achievements.includes('streak_30')) {
    unlocked.push('streak_30')
  }
  if (stats.masteredCards >= 10 && !stats.achievements.includes('master_10')) {
    unlocked.push('master_10')
  }
  if (stats.masteredCards >= 50 && !stats.achievements.includes('master_50')) {
    unlocked.push('master_50')
  }
  if (stats.masteredCards >= 100 && !stats.achievements.includes('master_100')) {
    unlocked.push('master_100')
  }
  
  if (unlocked.length > 0) {
    const newAchievements = [...stats.achievements, ...unlocked]
    updateLearningStats(subjectSlug, { achievements: newAchievements })
  }
  
  return unlocked
}

// Helper to get all card IDs that have been studied
export function getAllStudiedCardIds(subjectSlug: string): string[] {
  const studiedCards: string[] = []
  
  // Check localStorage for all cards with this subject prefix
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`progress:${subjectSlug}:`)) {
        const cardId = key.replace(`progress:${subjectSlug}:`, '')
        studiedCards.push(cardId)
      }
    }
  } catch {
    // Ignore errors
  }
  
  return studiedCards
}

// Helper to count mastered and due cards
export function getCardStats(subjectSlug: string): { mastered: number; due: number } {
  const cardIds = getAllStudiedCardIds(subjectSlug)
  let mastered = 0
  let due = 0
  const now = Date.now()
  
  for (const cardId of cardIds) {
    const progress = getCardProgress(subjectSlug, cardId)
    if (progress) {
      if (progress.repetitions >= 3) mastered++
      if (progress.nextReview <= now) due++
    }
  }
  
  return { mastered, due }
}
