'use client'
import { useEffect } from 'react'
import { achievementUnlock } from '@/lib/confetti'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

export default function AchievementModal({ 
  achievement, 
  onClose 
}: { 
  achievement: Achievement | null
  onClose: () => void 
}) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti when achievement modal opens
      achievementUnlock()
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-linear-to-br from-yellow-400 via-amber-500 to-orange-500 p-1 rounded-3xl animate-scale-in max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-900 rounded-3xl p-8 text-center">
          {/* Trophy Animation */}
          <div className="relative mb-6">
            <div className="text-8xl animate-bounce inline-block">
              {achievement.icon}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-yellow-400/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Achievement Title */}
          <h2 className="text-3xl font-extrabold text-yellow-400 mb-2 animate-slide-in-left">
            🎉 Achievement Unlocked! 🎉
          </h2>

          {/* Achievement Name */}
          <h3 className="text-2xl font-bold text-white mb-3 animate-slide-in-right">
            {achievement.name}
          </h3>

          {/* Achievement Description */}
          <p className="text-gray-300 text-lg mb-6 animate-fade-in">
            {achievement.description}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Awesome!
          </button>

          {/* Sparkles */}
          <div className="absolute top-4 left-4 text-yellow-400 text-2xl animate-pulse">✨</div>
          <div className="absolute top-6 right-6 text-yellow-400 text-xl animate-pulse delay-100">⭐</div>
          <div className="absolute bottom-8 left-6 text-yellow-400 text-xl animate-pulse delay-200">💫</div>
          <div className="absolute bottom-6 right-8 text-yellow-400 text-2xl animate-pulse delay-300">🌟</div>
        </div>
      </div>
    </div>
  )
}
