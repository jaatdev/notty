'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
}

/**
 * Wrapper component that hides navbar and footer in fullscreen modes
 * (notes viewing and quiz taking)
 */
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if we're in fullscreen mode (viewing notes or taking quiz)
  const isNotesPage = /^\/subjects\/[^/]+\/[^/]+$/.test(pathname)
  const isQuizPage = /\/quiz/.test(pathname)
  const isFullscreen = isNotesPage || isQuizPage
  
  // Get navbar and footer from children using React.Children to find them
  const childArray = Array.isArray(children) ? children : [children]
  
  // Extract navbar and footer, hide them if fullscreen
  const getVisibility = (child: ReactNode): { style: { display: string } } => {
    if (isFullscreen) {
      return { style: { display: 'none' } }
    }
    return { style: { display: 'block' } }
  }
  
  return (
    <>
      {childArray.map((child, index) => {
        // Check if this is Navbar or Footer by checking props
        if (isFullscreen && child && typeof child === 'object' && 'props' in child) {
          // For Navbar and Footer, apply hidden styles
          if (child.type?.displayName === 'Navbar' || child.type?.name === 'Navbar' || 
              child.type?.displayName === 'Footer' || child.type?.name === 'Footer') {
            return null
          }
        }
        return child
      })}
    </>
  )
}
