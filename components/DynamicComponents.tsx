'use client'

import dynamic from 'next/dynamic'

// Lazy load heavy components for better performance
export const CommandPalette = dynamic(() => import('@/components/command/CommandPalette'), {
  ssr: false,
  loading: () => null,
})

export const EasterEggs = dynamic(() => import('@/components/ui/EasterEggs'), {
  ssr: false,
  loading: () => null,
})
