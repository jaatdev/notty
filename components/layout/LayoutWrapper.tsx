'use client'

import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
}

/**
 * Simple wrapper component for layout structure
 * Fullscreen behavior is now handled by CSS and GlobalFullscreenButton
 */
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  )
}
