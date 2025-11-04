'use client'
import { useEffect, useState } from 'react'
import { fireworks } from '@/lib/confetti'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export default function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      console.log('Key pressed:', key, 'Expected:', KONAMI_CODE[konamiIndex], 'Index:', konamiIndex)

      // Check Konami code
      if (key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1
        setKonamiIndex(nextIndex)
        console.log('✅ Correct! Moving to index:', nextIndex)

        if (nextIndex === KONAMI_CODE.length) {
          // Konami code complete!
          console.log('🎊 KONAMI CODE ACTIVATED!')
          triggerKonamiReward()
          setKonamiIndex(0)
        }
      } else {
        // Reset on wrong key
        if (konamiIndex > 0) {
          console.log('❌ Wrong key! Expected:', KONAMI_CODE[konamiIndex], 'Got:', key, 'Resetting...')
        }
        setKonamiIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiIndex])

  const triggerKonamiReward = () => {
    console.log('🎉 KONAMI REWARD TRIGGERED!')
    console.log('Setting showSecret to TRUE')
    setShowSecret(true)
    
    // Trigger fireworks immediately
    console.log('🎆 Starting fireworks...')
    fireworks()
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      console.log('Auto-hiding popup...')
      setShowSecret(false)
    }, 8000)
  }

  console.log('EasterEggs render - showSecret:', showSecret)

  return (
    <>
      {showSecret && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none" 
          style={{ zIndex: 99999 }}
        >
          <div className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 p-2 rounded-3xl animate-scale-in pointer-events-auto shadow-2xl">
            <div className="bg-gray-900 p-8 rounded-2xl text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-red-400 mb-3">
                Konami Code Activated!
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                You've unlocked the secret! 🎉
              </p>
              <p className="text-gray-400 text-sm">
                You're a true gamer! Keep exploring and learning! 🚀
              </p>
              <button
                onClick={() => setShowSecret(false)}
                className="mt-6 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-2 rounded-full transition-all hover:scale-105"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
