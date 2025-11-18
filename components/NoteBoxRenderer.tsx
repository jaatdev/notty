'use client'

import React from 'react'
import type { NoteBox, BigNotesContent, SmallNotesContent, MnemonicMagicContent, QuickReferenceContent, RightWrongContent, FlashcardContent } from '@/lib/admin-types'
import { themeMap } from '@/lib/admin-themes'
import { sanitizeHtml } from '@/lib/sanitize'

type NoteBoxRendererProps = {
  note: NoteBox
  index?: number
}

// Seeded random function for consistent theme selection
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Premium CSS variant selectors for visual variety
const sscdrVariants = ['sovereign', 'socialist', 'secular', 'democratic', 'republic']
const jlefVariants = ['justice', 'liberty', 'equality', 'fraternity']
const gradientVariants = [
  'bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400',
  'bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400',
  'bg-linear-to-r from-purple-400 via-pink-400 to-rose-400',
  'bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400',
  'bg-linear-to-r from-red-400 via-orange-400 to-amber-400',
  'bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400',
  'bg-linear-to-r from-pink-400 via-rose-400 to-red-400',
  'bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400',
  'bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400',
  'bg-linear-to-r from-lime-400 via-green-400 to-emerald-400',
]

export default function NoteBoxRenderer({ note, index = 0 }: NoteBoxRendererProps) {
  const theme = themeMap[note.themeId] || themeMap['ocean-blue']
  const animationDelay = Math.min(index, 8) * 100
  
  // Generate seeded random index for consistent but varied theme selection
  const seed = `${note.id}-${note.type}`
  const randomSeed = seededRandom(seed)
  const gradientIndex = randomSeed % gradientVariants.length
  const selectedGradient = gradientVariants[gradientIndex]

  // BIG NOTES - Ultra Premium Authority Card Style
  if (note.type === 'big-notes') {
    const content = note.content as BigNotesContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="preamble-hero">
          <h2 className={`text-3xl font-black mb-4 ${selectedGradient} bg-clip-text text-transparent`}>
            {note.title}
          </h2>
          {content.heading && (
            <h3 className="text-2xl font-bold mb-6 opacity-90">{content.heading}</h3>
          )}
          <div 
            className="text-lg leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.body) }}
          />
          {content.highlights && content.highlights.length > 0 && (
            <div className="essence-card">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Key Highlights</span>
              </h4>
              <div className="feature-pills">
                {content.highlights.map((highlight, i) => (
                  <div key={i} className="pill">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }


  // SMALL NOTES - Legal Grid Style with Premium Cards
  if (note.type === 'small-notes') {
    const content = note.content as SmallNotesContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        {content.title && content.title !== note.title && (
          <h3 className="text-xl font-bold mb-4 opacity-90">{content.title}</h3>
        )}
        <div className="legal-grid">
          {content.points?.map((point, i) => (
            <div key={i} className="legal-card">
              <div className="text-lg font-semibold mb-2 text-blue-300">Point {i + 1}</div>
              <div className="text-base">{point}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // MNEMONIC MAGIC - Premium Mnemonic Hero Style
  if (note.type === 'mnemonic-magic') {
    const content = note.content as MnemonicMagicContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        {content.title && content.title !== note.title && (
          <h3 className="text-xl font-bold mb-4 opacity-90">{content.title}</h3>
        )}
        <div className="mnemonic-hero">
          <div className="text-sm uppercase tracking-widest opacity-75 mb-3">Key Mnemonic</div>
          <div className="bg-linear-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-xl p-6 mb-8">
            <h1 className="text-2xl font-bold leading-relaxed text-center mb-4">{content.mnemonic}</h1>
            {content.breakdown && content.breakdown.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {content.breakdown.map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all">
                    <div className="text-sm uppercase opacity-60 mb-1">Step {i + 1}</div>
                    <div className="font-bold text-lg">{item.letter}</div>
                    <div className="text-sm opacity-75">{item.word}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sscdr-grid">
          {content.breakdown?.map((item, i) => {
            // Use seeded random for consistent variant selection
            const variantSeed = seededRandom(`${note.id}-sscdr-${i}`)
            const variant = sscdrVariants[variantSeed % sscdrVariants.length]
            return (
              <div key={i} className={`sscdr-card ${variant}`}>
                <h3 className="text-2xl font-black mb-3 flex items-center gap-3">
                  <span className="text-3xl">{item.letter}</span>
                  <span>{item.word}</span>
                </h3>
                <div className="text-base leading-relaxed mb-3">{item.meaning}</div>
                <div className="visual-hint">
                  <span className="font-semibold">💡 Remember:</span> {item.letter} = {item.word}
                </div>
                <span className="badge-42">Point {i + 1}</span>
              </div>
            )
          })}
        </div>
        <div className="mnemonic-tag">
          🎯 Key Pattern: {content.breakdown?.map(b => b.letter).join(' → ').substring(0, 50)}...
        </div>
      </div>
    )
  }

  // QUICK REFERENCE - Timeline Grid Style
  if (note.type === 'quick-reference') {
    const content = note.content as QuickReferenceContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        {content.title && content.title !== note.title && (
          <h3 className="text-xl font-bold mb-4 opacity-90">{content.title}</h3>
        )}
        <div className="timeline-grid">
          {content.facts?.map((fact, i) => (
            <div key={fact.id} className="timeline-card">
              <div className="text-sm uppercase tracking-wider opacity-75 mb-2 text-blue-300 font-bold">
                {fact.label}
              </div>
              <div className="text-xl font-bold mb-2">{fact.value}</div>
              <div className="visual-hint">
                📌 Quick Reference #{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // RIGHT/WRONG - Premium Case Pills Style
  if (note.type === 'right-wrong') {
    const content = note.content as RightWrongContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        {content.title && content.title !== note.title && (
          <h3 className="text-xl font-bold mb-4 opacity-90">{content.title}</h3>
        )}
        <div className="case-pills">
          {content.statements?.map((stmt, i) => (
            <div key={stmt.id} className={`case-pill ${stmt.isCorrect ? 'green' : 'red'}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{stmt.isCorrect ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-2">{stmt.statement}</div>
                  {stmt.explanation && (
                    <div className="text-sm opacity-90 italic">{stmt.explanation}</div>
                  )}
                  <div className="mt-3">
                    <span className="badge-42">
                      {stmt.isCorrect ? 'CORRECT ✓' : 'INCORRECT ✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // FLASHCARD - JLEF Container Style (Justice/Liberty/Equality/Fraternity Cards)
  if (note.type === 'flashcard') {
    const content = note.content as FlashcardContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        <div className="jlef-container">
          {content.cards?.map((card, i) => {
            // Use seeded random for consistent variant selection
            const variantSeed = seededRandom(`${note.id}-jlef-${i}`)
            const variant = jlefVariants[variantSeed % jlefVariants.length]
            return (
              <div key={card.id} className={`jlef-card ${variant}`}>
                <div className="mb-4 pb-4 border-b border-white/20">
                  <div className="text-xs uppercase tracking-widest opacity-75 mb-2 font-bold">
                    ❓ Question
                  </div>
                  <div className="text-lg font-bold">{card.question}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-75 mb-2 font-bold">
                    💡 Answer
                  </div>
                  <div className="text-base leading-relaxed">{card.answer}</div>
                </div>
                <div className="mt-4">
                  <span className="badge-42">Card {i + 1}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // MNEMONIC CARD - Flashcards for exam questions
  if (note.type === 'mnemonic-card') {
    const content = note.content as any
    const flashcards = content.flashcards || []
    const [flipped, setFlipped] = React.useState<Set<string>>(new Set())

    const toggleFlip = (id: string) => {
      const newFlipped = new Set(flipped)
      if (newFlipped.has(id)) {
        newFlipped.delete(id)
      } else {
        newFlipped.add(id)
      }
      setFlipped(newFlipped)
    }

    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <h2 className={`text-3xl font-black mb-6 ${selectedGradient} bg-clip-text text-transparent`}>
          {note.title}
        </h2>
        <p className="text-sm opacity-75 mb-4 text-center">Click cards to flip • {flashcards.length} questions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map((card: any) => (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className={`h-48 cursor-pointer rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-105 ${
                flipped.has(card.id)
                  ? `bg-linear-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50`
                  : `bg-linear-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 hover:border-blue-400/75`
              }`}
            >
              <div className="text-xs uppercase tracking-widest opacity-60 mb-3">
                {flipped.has(card.id) ? 'Answer' : 'Question'}
              </div>
              <div className={`text-lg font-semibold leading-relaxed ${
                flipped.has(card.id) ? 'text-green-300' : 'text-blue-300'
              }`}>
                {flipped.has(card.id) ? card.back : card.front}
              </div>
              <div className="mt-4 text-xs opacity-50">Click to flip</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // CONTAINER NOTES - Multi-Section Premium Layout
  if (note.type === 'container-notes') {
    const content = note.content as BigNotesContent
    return (
      <div 
        className="animate-fade-in-up prose prose-invert max-w-none"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="preamble-hero">
          <h2 className={`text-3xl font-black mb-4 ${selectedGradient} bg-clip-text text-transparent`}>
            {note.title}
          </h2>
          {content.heading && (
            <div className="essence-card">
              <h3 className="text-2xl font-bold mb-3">{content.heading}</h3>
            </div>
          )}
          <div 
            className="text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.body) }}
          />
          {content.highlights && content.highlights.length > 0 && (
            <div className="legal-grid mt-6">
              {content.highlights.map((highlight, i) => (
                <div key={i} className="legal-card">
                  <span className="text-2xl mb-2 block">✨</span>
                  <div className="font-semibold">{highlight}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback for unknown types - Still make it look premium
  return (
    <div 
      className="animate-fade-in-up prose prose-invert max-w-none"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="preamble-hero">
        <h3 className="text-2xl font-bold mb-3">{note.title}</h3>
        <div className="text-sm opacity-75 mb-4">Type: {note.type}</div>
        <div className="visual-hint">
          <span className="font-semibold">⚠️ Unknown Note Type</span>
          <pre className="mt-3 p-3 bg-black/30 rounded text-xs overflow-auto">
            {JSON.stringify(note.content, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
