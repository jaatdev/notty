'use client'
import { useState, useRef, useEffect } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: string
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  icon = '📖'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/70 transition-colors group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl transition-transform duration-300" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            ▼
          </span>
          <span className="text-lg">{icon}</span>
          <h3 className="font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {isOpen ? 'Collapse' : 'Expand'}
        </span>
      </button>
      
      <div
        ref={contentRef}
        style={{ 
          height: height,
          opacity: isOpen ? 1 : 0,
        }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="p-4 pt-0 border-t border-gray-700/50">
          {children}
        </div>
      </div>
    </div>
  )
}
