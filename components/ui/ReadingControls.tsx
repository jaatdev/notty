'use client'
import { useState, useEffect } from 'react'
import { persist, retrieve } from '@/lib/localStorage'

type FontSize = 'comfortable' | 'default' | 'compact'
type LineHeight = 'relaxed' | 'normal' | 'tight'
type ReadingWidth = 'wide' | 'medium' | 'narrow'

interface ReadingSettings {
  fontSize: FontSize
  lineHeight: LineHeight
  readingWidth: ReadingWidth
  dyslexiaFont: boolean
}

export default function ReadingControls({ slug }: { slug: string }) {
  const [settings, setSettings] = useState<ReadingSettings>(() => 
    retrieve(`reading_settings_${slug}`, {
      fontSize: 'default',
      lineHeight: 'normal',
      readingWidth: 'medium',
      dyslexiaFont: false,
    } as ReadingSettings)
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    persist(`reading_settings_${slug}`, settings)
    
    // Apply settings to the document
    const root = document.documentElement
    
    console.log('📖 Applying reading settings:', settings)
    
    // Font size
    if (settings.fontSize === 'comfortable') {
      root.style.setProperty('--reading-font-size', '1.25rem') // 20px
      console.log('Font size: comfortable (1.25rem)')
    } else if (settings.fontSize === 'compact') {
      root.style.setProperty('--reading-font-size', '1rem') // 16px
      console.log('Font size: compact (1rem)')
    } else {
      root.style.setProperty('--reading-font-size', '1.125rem') // 18px - default
      console.log('Font size: default (1.125rem)')
    }
    
    // Line height
    if (settings.lineHeight === 'relaxed') {
      root.style.setProperty('--reading-line-height', '2')
      console.log('Line height: relaxed (2)')
    } else if (settings.lineHeight === 'tight') {
      root.style.setProperty('--reading-line-height', '1.5')
      console.log('Line height: tight (1.5)')
    } else {
      root.style.setProperty('--reading-line-height', '1.75') // default
      console.log('Line height: normal (1.75)')
    }
    
    // Reading width
    if (settings.readingWidth === 'wide') {
      root.style.setProperty('--reading-max-width', '960px')
      console.log('Width: wide (960px)')
    } else if (settings.readingWidth === 'narrow') {
      root.style.setProperty('--reading-max-width', '600px')
      console.log('Width: narrow (600px)')
    } else {
      root.style.setProperty('--reading-max-width', '720px') // default
      console.log('Width: medium (720px)')
    }
    
    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.style.setProperty('--reading-font-family', 'OpenDyslexic, Arial, sans-serif')
      console.log('Font: Dyslexic')
    } else {
      root.style.setProperty('--reading-font-family', "var(--font-reading)")
      console.log('Font: Default')
    }
    
    console.log('✅ Reading settings applied!')
  }, [settings, slug])

  // Inline mode for TOC (only mode now)
  return (
    <div className="w-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          title="Reading Controls"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Reading</span>
        </button>

        {/* Controls Panel */}
        {isOpen && (
          <div className="mt-3 p-4 bg-gray-800 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-200">Reading Settings</h4>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Font Size</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['compact', 'default', 'comfortable'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                    className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                      settings.fontSize === size
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {size[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Spacing</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['tight', 'normal', 'relaxed'] as LineHeight[]).map((height) => (
                  <button
                    key={height}
                    onClick={() => setSettings(s => ({ ...s, lineHeight: height }))}
                    className={`px-2 py-1.5 rounded text-xs font-medium capitalize transition-all ${
                      settings.lineHeight === height
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {height[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Width */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Width</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['narrow', 'medium', 'wide'] as ReadingWidth[]).map((width) => (
                  <button
                    key={width}
                    onClick={() => setSettings(s => ({ ...s, readingWidth: width }))}
                    className={`px-2 py-1.5 rounded text-xs font-medium capitalize transition-all ${
                      settings.readingWidth === width
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {width[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia Font */}
            <label className="flex items-center justify-between cursor-pointer border-t border-gray-700 pt-3">
              <span className="text-xs font-medium text-gray-300">Dyslexia Font</span>
              <input
                type="checkbox"
                checked={settings.dyslexiaFont}
                onChange={(e) => setSettings(s => ({ ...s, dyslexiaFont: e.target.checked }))}
                className="rounded border-gray-600 bg-gray-700 text-emerald-500"
              />
            </label>

            {/* Reset */}
            <button
              onClick={() => setSettings({
                fontSize: 'default',
                lineHeight: 'normal',
                readingWidth: 'medium',
                dyslexiaFont: false,
              })}
              className="mt-3 w-full px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-all"
            >
              Reset
            </button>
          </div>
        )}
      </div>
  )
}
