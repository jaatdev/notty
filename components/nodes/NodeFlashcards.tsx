/**
 * 💫 ENHANCED FLASHCARDS - World-Class Learning Experience
 * Steps 36-40: Theme Integration & Advanced Animations
 * ARIA labels, improved accessibility, theme-aware styling
 */

'use client'
import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FlashcardsNode, Flashcard } from '@/lib/types'
import BookmarkButton from '../ui/BookmarkButton'
import MetaBar from '../ui/MetaBar'
import ReferencesDrawer from '../ui/ReferencesDrawer'
import { useSwipe, vibrate } from '@/lib/touch'
import { flashcardMastery } from '@/lib/confetti'
import { getThemeById } from '@/lib/theme-variants'
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

/**
 * Debounce function to prevent rapid flip actions
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

function FlashCard({ card, cardId, subjectSlug, totalCards, onStatsUpdate, theme }: { 
  card: Flashcard; 
  cardId: string; 
  subjectSlug: string;
  totalCards: number;
  onStatsUpdate?: () => void;
  theme: ReturnType<typeof getThemeById>;
}) {
  const [flip, setFlip] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [progress, setProgress] = useState<CardProgress | null>(null)
  const [sessionStart, setSessionStart] = useState<number>(0)
  const [isFlipping, setIsFlipping] = useState(false) // NEW: Prevent rapid flips
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { showToast } = useToast()

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current)
      }
    }
  }, [])

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

  // OPTIMIZED: Use requestAnimationFrame for smooth flip animation
  const handleFlip = useCallback(() => {
    if (isFlipping) return // Prevent rapid flips
    
    setIsFlipping(true)
    
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
      if (!flip) {
        // Flip to back (show answer)
        setFlip(true)
        setShowRating(true)
        setSessionStart(Date.now())
        vibrate(10)
      } else if (flip && !showRating) {
        // Flip back to front (after rating is done)
        setFlip(false)
        vibrate(5)
      }
      
      // Reset flipping state after animation duration (600ms)
      flipTimeoutRef.current = setTimeout(() => {
        setIsFlipping(false)
      }, 600)
    })
  }, [flip, showRating, isFlipping])

  const swipeHandlers = useSwipe({
    onSwipeUp: () => {
      if (!flip) {
        handleFlip()
      }
    },
    threshold: 50,
  })

  // OPTIMIZED: Debounced rating handler to prevent double-clicks
  const handleRating = useCallback((quality: number) => {
    if (!progress || isFlipping) return
    
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
    
    // Use requestAnimationFrame for smooth state reset
    requestAnimationFrame(() => {
      setShowRating(false)
      setFlip(false)
      setSessionStart(0)
      setIsFlipping(false)
    })
    
    onStatsUpdate?.()
    window.dispatchEvent(new CustomEvent('notty:statsUpdated'))
  }, [progress, sessionStart, subjectSlug, cardId, totalCards, onStatsUpdate, showToast, isFlipping])

  const isMastered = progress && progress.repetitions >= 3
  const isDue = progress && progress.nextReview <= Date.now()

  return (
    <div className="relative modern-card animate-fade-in-up" role="article" aria-label="Flashcard">
      {/* Progress Badge */}
      {progress && progress.repetitions > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
          style={{
            background: isMastered ? theme.gradient : theme.accent,
            boxShadow: `0 0 15px ${theme.glow}`,
          }}
        >
          {isMastered && <span>🎓</span>}
          <span>{progress.repetitions} {progress.repetitions === 1 ? 'rep' : 'reps'}</span>
        </motion.div>
      )}
      {isDue && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-2 -left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        >
          📅 Due
        </motion.div>
      )}

      <div 
        onClick={handleFlip} 
        className="cursor-pointer perspective touch-none"
        {...swipeHandlers}
        role="button"
        tabIndex={0}
        aria-label={flip ? "Card back - showing answer" : "Card front - tap to reveal answer"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleFlip()
          }
        }}
      >
        <motion.div 
          className="relative w-full h-full text-center preserve-3d min-h-40"
          animate={{ rotateY: flip ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div 
            className="absolute inset-0 rounded-xl p-4 overflow-y-auto flex flex-col justify-center backdrop-blur-sm"
            style={{
              border: `2px solid ${theme.accent}50`,
              background: `linear-gradient(135deg, ${theme.accent}20, transparent)`,
              boxShadow: `0 4px 15px ${theme.glow}30`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <p className="font-bold wrap-break-word text-lg" style={{ color: theme.accent }}>
              {card.front}
            </p>
            {card.hint && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 wrap-break-word">
                💡 Hint: {card.hint}
              </p>
            )}
            {card.mnemonic && (
              <p className="text-xs mt-2 wrap-break-word">
                <span 
                  className="px-2 py-1 rounded font-semibold"
                  style={{
                    background: `${theme.secondary}30`,
                    color: theme.textColor,
                  }}
                >
                  ✨ {card.mnemonic}
                </span>
              </p>
            )}
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-3 animate-pulse">
              👆 Tap or swipe up to flip
            </p>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 rounded-xl p-4 overflow-y-auto flex flex-col backdrop-blur-sm"
            style={{
              border: `2px solid ${theme.accent}`,
              background: `linear-gradient(135deg, ${theme.accent}30, ${theme.secondary}30)`,
              boxShadow: `0 4px 20px ${theme.glow}50`,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <p className="text-neutral-800 dark:text-neutral-200 mb-4 wrap-break-word shrink-0 text-lg font-medium">
              {card.back}
            </p>
            {showRating && (
              <div className="mt-auto pt-4 shrink-0" 
                style={{ borderTop: `1px solid ${theme.accent}50` }}
                onClick={(e) => e.stopPropagation()}
                role="group"
                aria-label="Rate your recall"
              >
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 text-center font-semibold">
                  ⚡ How well did you know this?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { vibrate(15); handleRating(1); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold rounded-lg transition-all shadow-lg"
                    aria-label="Again - forgot completely"
                  >
                    ❌ Again
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { vibrate(15); handleRating(3); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white text-xs font-semibold rounded-lg transition-all shadow-lg"
                    aria-label="Hard - difficult to recall"
                  >
                    🤔 Hard
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { vibrate(15); handleRating(4); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg transition-all shadow-lg"
                    aria-label="Good - recalled with some effort"
                  >
                    👍 Good
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { vibrate(20); handleRating(5); }} 
                    className="flex-1 min-w-[140px] md:flex-none md:min-w-0 px-4 py-2 md:px-3 md:py-1.5 bg-linear-to-r text-white text-xs font-semibold rounded-lg transition-all shadow-lg"
                    style={{
                      background: theme.gradient,
                      boxShadow: `0 0 20px ${theme.glow}`,
                    }}
                    aria-label="Easy - perfect recall"
                  >
                    ⚡ Easy
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
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
  const [mounted, setMounted] = useState(false)
  
  // Fix hydration: Don't shuffle until client-side
  const [cards, setCards] = useState(node.cards)
  
  useEffect(() => {
    setMounted(true)
    if (node.shuffle) {
      setCards(shuffle(node.cards))
    }
  }, [node])
  
  const slug = subjectSlug || 'default'
  const total = totalCards || cards.length
  
  // Get theme for this flashcard set
  const theme = getThemeById(node.id)

  return (
    <section 
      id={node.id} 
      data-node-id={node.id} 
      className="relative overflow-hidden modern-card animate-fade-in-up p-6 rounded-2xl shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${theme.accent}05, transparent)`,
        borderTop: `4px solid ${theme.accent}`,
        boxShadow: `0 10px 40px ${theme.glow}20`,
      }}
      role="region"
      aria-label={`Flashcards: ${node.title}`}
    >
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: theme.gradient,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 
            className="text-xl md:text-2xl font-bold animate-slide-in-left"
            style={{ color: theme.accent }}
          >
            {node.title}
          </h3>
          <div className="flex items-center gap-2">
            <span 
              className="pill-badge text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: `${theme.accent}20`,
                color: theme.accent,
                border: `1px solid ${theme.accent}40`,
              }}
            >
              {cards.length} cards
            </span>
            {node.meta?.refs?.length ? (
              <button 
                onClick={()=>setShowRefs(true)} 
                className="pill-badge text-xs font-bold px-3 py-1 rounded-full hover:scale-105 transition-all"
                style={{
                  background: `${theme.accent}10`,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`,
                }}
                aria-label="View references"
              >
                📚 References
              </button>
            ) : null}
            <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
          </div>
        </div>
        {node.mnemonic && (
          <p className="mt-1 text-sm animate-fade-in-up delay-100">
            💡 Mnemonic: <span 
              className="px-2 py-1 rounded-lg font-semibold"
              style={{
                background: `${theme.secondary}30`,
                color: theme.textColor,
              }}
            >{node.mnemonic}</span>
          </p>
        )}
        <MetaBar meta={node.meta} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <FlashCard 
                card={c} 
                cardId={`${node.id}-card-${i}`}
                subjectSlug={slug}
                totalCards={total}
                onStatsUpdate={onStatsUpdate}
                theme={theme}
              />
            </motion.div>
          ))}
        </div>

        {node.meta?.refs?.length ? (
          <ReferencesDrawer open={showRefs} refs={node.meta.refs} onClose={()=>setShowRefs(false)} />
        ) : null}
      </div>
    </section>
  )
}