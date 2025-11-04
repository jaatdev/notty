'use client'
import { useEffect, useState } from 'react'

interface KeyboardNavProps {
  sections: { id: string; title: string }[]
  onNavigate: (id: string) => void
}

export default function KeyboardNav({ sections, onNavigate }: KeyboardNavProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return
      }

      // Ignore if modifier keys are pressed (Ctrl, Cmd, Alt) - those are for other shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return
      }

      // J - Next section
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1)
        setCurrentIndex(nextIndex)
        onNavigate(sections[nextIndex].id)
        setShowHint(false)
      }

      // K - Previous section
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        const prevIndex = Math.max(currentIndex - 1, 0)
        setCurrentIndex(prevIndex)
        onNavigate(sections[prevIndex].id)
        setShowHint(false)
      }

      // G - Go to top
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setShowHint(false)
      }

      // ? - Show help
      if (e.key === '?') {
        e.preventDefault()
        setShowHint(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, sections, onNavigate])

  return (
    <>
      {showHint && (
        <div className="fixed bottom-24 left-6 z-40 no-print animate-fade-in">
          <div className="bg-gray-900 border-2 border-emerald-500/30 text-gray-200 px-5 py-4 rounded-2xl shadow-2xl max-w-xs backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <span className="text-lg">⌨️</span>
                Keyboard Shortcuts
              </h4>
              <button 
                onClick={() => setShowHint(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
                aria-label="Close hint"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2 text-gray-300">
              <div className="flex items-center justify-between">
                <span>Next section</span>
                <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-emerald-400 font-mono font-semibold">J</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Previous section</span>
                <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-emerald-400 font-mono font-semibold">K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Go to top</span>
                <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-emerald-400 font-mono font-semibold">G</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Show this help</span>
                <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-emerald-400 font-mono font-semibold">?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
