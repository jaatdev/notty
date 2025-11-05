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
      setSessionStart(Date.now())
      vibrate(10)
    }
  }

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
    
    const studyTimeSeconds = sessionStart > 0 ? Math.round((Date.now() - sessionStart) / 1000) : 5
    
    const newProgress = calculateNextReview(progress, quality)
    setCardProgress(subjectSlug, cardId, newProgress)
    setProgress(newProgress)
    
    const currentStats = getLearningStats(subjectSlug, totalCards)
    const { mastered, due } = getCardStats(subjectSlug)
    
    const newStudyTime = currentStats.totalStudyTime + Math.max(1, Math.round(studyTimeSeconds / 60))
    
    const updatedStats = {
      ...currentStats,
      totalCards,
      masteredCards: mastered,
      dueCards: due,
      totalStudyTime: newStudyTime
    }
    
    updateLearningStats(subjectSlug, updatedStats)
    
    const unlockedAchievements = checkAchievements(subjectSlug, updatedStats)
    
    if (unlockedAchievements.length > 0) {
      unlockedAchievements.forEach(achievement => {
        import('@/lib/learningProgress').then(({ ACHIEVEMENTS }) => {
          const ach = ACHIEVEMENTS.find(a => a.id === achievement)
          if (ach) {
            showToast({
              message: `🏆 Achievement Unlocked: ${ach.icon} ${ach.name}!`,
              variant: 'success'
            })
            import('@/lib/confetti').then(({ achievementUnlock }) => {
              achievementUnlock()
            })
          }
        })
      })
    }
    
    if (quality >= 4) {
      showToast({
        message: quality === 5 ? '⚡ Perfect! Easy recall!' : '👍 Good job!',
        variant: 'success'
      })
      if (quality === 5) {
        flashcardMastery()
      }
    }
    
    setShowRating(false)
    onStatsUpdate?.()
    window.dispatchEvent(new CustomEvent('notty:statsUpdated'))
    
    setTimeout(() => setFlip(false), 1000)
  }

  const isMastered = progress && progress.repetitions >= 3
  const isDue = progress && progress.nextReview <= Date.now()

  return (
    <div className="relative modern-card animate-fade-in-up">
      {progress && progress.repetitions > 0 && (
        <div className="absolute -top-2 -right-2 z-10 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
          {isMastered && <span>🎓</span>}
          <span>{progress.repetitions} {progress.repetitions === 1 ? 'rep' : 'reps'}</span>
        </div>
      )}
      {isDue && (
        <div className="absolute -top-2 -left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
          📅 Due
        </div>
      )}

      <div 
        onClick={handleFlip} 
        className="cursor-pointer perspective touch-none"
        {...swipeHandlers}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-500 preserve-3d min-h-40 ${flip ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden rounded-xl p-4 border-2 border-emerald-700/50 bg-linear-to-br from-gray-800/90 to-gray-900/90 overflow-y-auto flex flex-col justify-center backdrop-blur-sm">
            <p className="font-bold text-emerald-400 wrap-break-word text-lg">{card.front}</p>
            {card.hint && <p className="text-xs text-gray-400 mt-2 wrap-break-word">💡 Hint: {card.hint}</p>}
            {card.mnemonic && <p className="text-xs mt-2 wrap-break-word"><span className="mnemonic-text bg-purple-900/30 px-2 py-1 rounded">✨ {card.mnemonic}</span></p>}
            <p className="text-gray-500 text-sm mt-3 animate-pulse">👆 Tap or swipe up to flip</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-4 border-2 border-emerald-600 bg-linear-to-br from-emerald-900/50 to-teal-900/50 overflow-y-auto flex flex-col backdrop-blur-sm">
            <p className="text-gray-200 mb-4 wrap-break-word shrink-0 text-lg font-medium">{card.back}</p>
            {showRating && (
              <div className="mt-auto pt-4 border-t border-emerald-700/50 shrink-0" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-gray-400 mb-3 text-center font-semibold">⚡ How well did you know this?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => { vibrate(15); handleRating(1); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    ❌ Again
                  </button>
                  <button 
                    onClick={() => { vibrate(15); handleRating(3); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    🤔 Hard
                  </button>
                  <button 
                    onClick={() => { vibrate(15); handleRating(4); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    👍 Good
                  </button>
                  <button 
                    onClick={() => { vibrate(20); handleRating(5); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg animate-glow"
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
    <section id={node.id} data-node-id={node.id} className="modern-card gradient-card-emerald animate-fade-in-up p-6 border-t-4 border-emerald-500 shadow-2xl">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-xl md:text-2xl font-bold text-emerald-300 animate-slide-in-left">{node.title}</h3>
        <div className="flex items-center gap-2">
          <span className="pill-badge bg-emerald-600/30 text-emerald-200 border-emerald-500/50">{cards.length} cards</span>
          {node.meta?.refs?.length ? (
            <button onClick={()=>setShowRefs(true)} className="pill-badge bg-emerald-900/50 text-emerald-300 border-emerald-600 hover:bg-emerald-800/60 hover:scale-105 transition-all">
              📚 References
            </button>
          ) : null}
          <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
        </div>
      </div>
      {node.mnemonic && (
        <p className="mt-1 text-sm animate-fade-in-up delay-100">
          💡 Mnemonic: <span className="mnemonic-text bg-purple-900/40 px-2 py-1 rounded-lg font-semibold text-purple-200">{node.mnemonic}</span>
        </p>
      )}
      <MetaBar meta={node.meta} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cards.map((c, i) => (
          <div 
            key={i}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <FlashCard 
              card={c} 
              cardId={`${node.id}-card-${i}`}
              subjectSlug={slug}
              totalCards={total}
              onStatsUpdate={onStatsUpdate}
            />
          </div>
        ))}
      </div>

      {node.meta?.refs?.length ? (
        <ReferencesDrawer open={showRefs} refs={node.meta.refs} onClose={()=>setShowRefs(false)} />
      ) : null}
    </section>
  )
}