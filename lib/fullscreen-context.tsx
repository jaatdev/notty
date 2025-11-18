/**
 * Fullscreen Mode Context
 * Manages fullscreen/exam mode state for immersive note viewing and quiz taking
 */

'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface FullscreenContextType {
  isFullscreen: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined)

export function FullscreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true)
    document.documentElement.classList.add('fullscreen-mode')
    document.body.classList.add('fullscreen-mode')
  }, [])

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false)
    document.documentElement.classList.remove('fullscreen-mode')
    document.body.classList.remove('fullscreen-mode')
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  return (
    <FullscreenContext.Provider value={{ isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  )
}

export function useFullscreen() {
  const context = useContext(FullscreenContext)
  if (!context) {
    throw new Error('useFullscreen must be used within FullscreenProvider')
  }
  return context
}
