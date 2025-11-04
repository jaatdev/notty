'use client'
import { useState } from 'react'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

export default function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const lang = language || className?.replace('language-', '') || 'text'

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-gray-800 border-t border-x border-gray-700 rounded-t-lg px-4 py-2">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wide">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-emerald-600 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={`${className} mt-0! rounded-t-none! border border-gray-700 bg-gray-900`}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}
