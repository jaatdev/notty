'use client'
import { useMemo, useState, useEffect } from 'react'
import type { FlashcardsNode, Flashcard } from '@/lib/types'
import BookmarkButton from '../ui/BookmarkButton'
import MetaBar from '../ui/MetaBar'
import ReferencesDrawer from '../ui/ReferencesDrawer'
import { useSwipe, vibrate } from '@/lib/touch'
import { flashcardMastery } from '@/lib/confetti'
import { 
  getCardProgress, 
  setCardProgress, 
  calculateNextReview, 
  getLearningStats, 
  updateLearningStats, 
  checkAchievements,
  getCardStats,
  type CardProgress 
} from '@/lib/learningProgress'
import { useToast } from '../feedback/ToastProvider'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i=a.length-1;i>0;i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]] }
  return a
}

function FlashCard({ card, cardId, subjectSlug, totalCards, onStatsUpdate }: { 
  card: Flashcard; 
  cardId: string; 
  subjectSlug: string;
  totalCards: number;
  onStatsUpdate?: () => void;
}) {
  const [flip, setFlip] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [progress, setProgress] = useState<CardProgress | null>(null)
  const [sessionStart, setSessionStart] = useState<number>(0)
  const { showToast } = useToast()

  useEffect(() => {
    const existing = getCardProgress(subjectSlug, cardId)
    if (existing) {
      setProgress(existing)
    } else {
      setProgress({
        cardId,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: Date.now(),
        lastReview: 0,
        streak: 0
      })
    }
  }, [cardId, subjectSlug])

  const handleFlip = () => {
    if (!flip) {
      setFlip(true)
      setShowRating(true)
      setSessionStart(Date.now()) // Start timing
      vibrate(10) // Haptic feedback on flip
    }
  }

  // Swipe to flip card (mobile)
  const swipeHandlers = useSwipe({
    onSwipeUp: () => {
      if (!flip) {
        handleFlip()
      }
    },
    threshold: 50,
  })

  const handleRating = (quality: number) => {
    if (!progress) return
    
    // Calculate study time (in seconds)
    const studyTimeSeconds = sessionStart > 0 ? Math.round((Date.now() - sessionStart) / 1000) : 5
    
    const newProgress = calculateNextReview(progress, quality)
    setCardProgress(subjectSlug, cardId, newProgress)
    setProgress(newProgress)
    
    // Update learning stats - get accurate counts from localStorage
    const currentStats = getLearningStats(subjectSlug, totalCards)
    const { mastered, due } = getCardStats(subjectSlug)
    
    // Add study time (convert to minutes, minimum 1 minute per card)
    const newStudyTime = currentStats.totalStudyTime + Math.max(1, Math.round(studyTimeSeconds / 60))
    
    const updatedStats = {
      ...currentStats, // Include ALL current stats including achievements
      totalCards,
      masteredCards: mastered,
      dueCards: due,
      totalStudyTime: newStudyTime
    }
    
    updateLearningStats(subjectSlug, updatedStats)
    
    // Check for achievements AFTER updating stats
    const unlockedAchievements = checkAchievements(subjectSlug, updatedStats)
    
    // Show achievement notifications
    if (unlockedAchievements.length > 0) {
      unlockedAchievements.forEach(achievement => {
        import('@/lib/learningProgress').then(({ ACHIEVEMENTS }) => {
          const ach = ACHIEVEMENTS.find(a => a.id === achievement)
          if (ach) {
            showToast({
              message: `🏆 Achievement Unlocked: ${ach.icon} ${ach.name}!`,
              variant: 'success'
            })
            // Trigger achievement confetti
            import('@/lib/confetti').then(({ achievementUnlock }) => {
              achievementUnlock()
            })
          }
        })
      })
    }
    
    // Show feedback based on quality
    if (quality >= 4) {
      showToast({
        message: quality === 5 ? '⚡ Perfect! Easy recall!' : '👍 Good job!',
        variant: 'success'
      })
      // Trigger confetti for high ratings
      if (quality === 5) {
        flashcardMastery()
      }
    }
    
    setShowRating(false)
    
    // Trigger stats refresh in parent
    onStatsUpdate?.()
    
    // Dispatch event for LearningStatsDashboard
    window.dispatchEvent(new CustomEvent('notty:statsUpdated'))
    
    // Reset flip after 1 second
    setTimeout(() => setFlip(false), 1000)
  }

  const isMastered = progress && progress.repetitions >= 3
  const isDue = progress && progress.nextReview <= Date.now()

  return (
    <div className="relative">
      {/* Progress Indicator */}
      {progress && progress.repetitions > 0 && (
        <div className="absolute -top-2 -right-2 z-10 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          {isMastered && <span>🎓</span>}
          <span>{progress.repetitions} {progress.repetitions === 1 ? 'rep' : 'reps'}</span>
        </div>
      )}
      {isDue && (
        <div className="absolute -top-2 -left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          📅 Due
        </div>
      )}

      <div 
        onClick={handleFlip} 
        className="cursor-pointer perspective touch-none"
        {...swipeHandlers}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-500 preserve-3d min-h-40 ${flip ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden rounded-xl p-4 border border-emerald-700 bg-gray-800 overflow-y-auto flex flex-col justify-center">
            <p className="font-bold text-emerald-400 wrap-break-word">{card.front}</p>
            {card.hint && <p className="text-xs text-gray-400 mt-2 wrap-break-word">Hint: {card.hint}</p>}
            {card.mnemonic && <p className="text-xs mt-2 wrap-break-word">💡 <span className="mnemonic-text">{card.mnemonic}</span></p>}
            <p className="text-gray-500 text-sm mt-2">Tap or swipe up to flip</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-4 border border-emerald-600 bg-emerald-900/40 overflow-y-auto flex flex-col">
            <p className="text-gray-200 mb-4 wrap-break-word shrink-0">{card.back}</p>
            {showRating && (
              <div className="mt-auto pt-4 border-t border-emerald-700/50 shrink-0" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-gray-400 mb-3 text-center">How well did you know this?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => { vibrate(15); handleRating(1); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold rounded transition-colors"
                  >
                    ❌ Again
                  </button>
                  <button 
                    onClick={() => { vibrate(15); handleRating(3); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white text-xs font-semibold rounded transition-colors"
                  >
                    🤔 Hard
                  </button>
                  <button 
                    onClick={() => { vibrate(15); handleRating(4); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded transition-colors"
                  >
                    👍 Good
                  </button>
                  <button 
                    onClick={() => { vibrate(20); handleRating(5); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded transition-colors"
                  >
                    ⚡ Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .perspective { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
      </div>
    </div>
  )
}

export default function NodeFlashcards({
  node, bookmarked, onToggleBookmark, subjectSlug, totalCards, onStatsUpdate
}: { 
  node: FlashcardsNode; 
  bookmarked: boolean; 
  onToggleBookmark: () => void; 
  subjectSlug?: string;
  totalCards?: number;
  onStatsUpdate?: () => void;
}) {
  const [showRefs, setShowRefs] = useState(false)
  const cards = useMemo(() => node.shuffle ? shuffle(node.cards) : node.cards, [node])
  const slug = subjectSlug || 'default'
  const total = totalCards || cards.length

  return (
    <section id={node.id} data-node-id={node.id} className="bg-gray-900 dark:bg-gray-950 p-6 rounded-2xl card border-t-4 border-emerald-500 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-xl md:text-2xl font-bold text-emerald-400">{node.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">{cards.length} cards</span>
          {node.meta?.refs?.length ? (
            <button onClick={()=>setShowRefs(true)} className="text-xs border px-2 py-1 rounded bg-emerald-900/30 text-emerald-300 border-emerald-700 hover:bg-emerald-800/40">References</button>
          ) : null}
          <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
        </div>
      </div>
      {node.mnemonic && <p className="mt-1 text-sm">💡 Mnemonic: <span className="mnemonic-text">{node.mnemonic}</span></p>}
      <MetaBar meta={node.meta} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cards.map((c, i) => (
          <FlashCard 
            key={i} 
            card={c} 
            cardId={`${node.id}-card-${i}`}
            subjectSlug={slug}
            totalCards={total}
            onStatsUpdate={onStatsUpdate}
          />
        ))}
      </div>

      {node.meta?.refs?.length ? (
        <ReferencesDrawer open={showRefs} refs={node.meta.refs} onClose={()=>setShowRefs(false)} />
      ) : null}
    </section>
  )
}