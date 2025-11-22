/**
 * Fullscreen Mode Context
 * Manages fullscreen/exam mode state for immersive note viewing and quiz taking
 */

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface FullscreenContextType {
  isFullscreen: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined)

export function FullscreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Listen to fullscreen changes (e.g., when user presses ESC or F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement)
      
      setIsFullscreen(isCurrentlyFullscreen)
      
      if (isCurrentlyFullscreen) {
        document.documentElement.classList.add('fullscreen-mode')
        document.documentElement.setAttribute('data-fullscreen', 'true')
        document.body.classList.add('fullscreen-mode')
      } else {
        document.documentElement.classList.remove('fullscreen-mode')
        document.documentElement.removeAttribute('data-fullscreen')
        document.body.classList.remove('fullscreen-mode')
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement
      
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen()
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen()
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen()
      }
      
      // State will be updated by the event listener
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
      // Fallback: just add the class without browser fullscreen
      setIsFullscreen(true)
      document.documentElement.classList.add('fullscreen-mode')
      document.documentElement.setAttribute('data-fullscreen', 'true')
      document.body.classList.add('fullscreen-mode')
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement || 
          (document as any).webkitFullscreenElement || 
          (document as any).mozFullScreenElement || 
          (document as any).msFullscreenElement) {
        
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
      }
      
      // State will be updated by the event listener
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
      // Fallback: just remove the class
      setIsFullscreen(false)
      document.documentElement.classList.remove('fullscreen-mode')
      document.documentElement.removeAttribute('data-fullscreen')
      document.body.classList.remove('fullscreen-mode')
    }
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
