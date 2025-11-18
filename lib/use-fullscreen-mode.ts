'use client'

import { usePathname } from 'next/navigation'

/**
 * Hook to determine if current page should be fullscreen (hide navbar/footer)
 * Returns true for:
 * - Note pages: /subjects/[slug]/[topicId]
 * - Quiz pages: /subjects/[slug]/quiz
 */
export function useFullscreenMode(): boolean {
  const pathname = usePathname()
  
  // Check if we're viewing notes (has topicId in path like /subjects/hindi/top_varnamala)
  const isNotesPage = /^\/subjects\/[^/]+\/[^/]+$/.test(pathname)
  
  // Check if we're taking a quiz (has /quiz in path)
  const isQuizPage = /\/quiz/.test(pathname)
  
  return isNotesPage || isQuizPage
}
