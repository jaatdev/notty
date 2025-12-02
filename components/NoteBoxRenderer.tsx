'use client'

import { NoteBox } from '@/lib/admin-types'
import { themeMap } from '@/lib/admin-themes'

type Props = {
  note: NoteBox
  index: number
}

export default function NoteBoxRenderer({ note }: Props) {
  // Get theme with fallback
  const rawTheme = themeMap[note.themeId] || themeMap['ocean-blue'] || Object.values(themeMap)[0]
  
  // Adapt theme to expected format
  const theme = {
    bgClass: `bg-gradient-to-br ${rawTheme?.gradient || 'from-slate-800 to-slate-900'}`,
    borderClass: rawTheme?.borderColor || 'border-slate-700',
    textClass: rawTheme?.textColor || 'text-slate-100',
    accentBg: rawTheme?.accentColor || 'bg-indigo-600',
    accentText: 'text-white',
    gradient: rawTheme?.gradient || 'from-indigo-600 to-cyan-500',
  }
  
  switch (note.type) {
    // Content Presentation
    case 'big-notes': return <BigNotesBox note={note} theme={theme} />
    case 'small-notes': return <SmallNotesBox note={note} theme={theme} />
    case 'container-notes': return <ContainerNotesBox note={note} theme={theme} />
    case 'rich-content': return <RichContentBox note={note} theme={theme} />
    case 'story-box': return <StoryBox note={note} theme={theme} />
    case 'definition-box': return <DefinitionBox note={note} theme={theme} />
    case 'example-box': return <ExampleBox note={note} theme={theme} />
    case 'summary-box': return <SummaryBox note={note} theme={theme} />
    
    // Memory & Learning
    case 'mnemonic-magic': return <MnemonicMagicBox note={note} theme={theme} />
    case 'mnemonic-card': return <MnemonicCardBox note={note} theme={theme} />
    case 'flashcard': return <FlashcardBox note={note} theme={theme} />
    case 'acronym-box': return <AcronymBox note={note} theme={theme} />
    case 'analogy-box': return <AnalogyBox note={note} theme={theme} />
    case 'pattern-box': return <PatternBox note={note} theme={theme} />
    case 'memory-palace': return <MemoryPalaceBox note={note} theme={theme} />
    
    // Assessment & Practice
    case 'right-wrong': return <RightWrongBox note={note} theme={theme} />
    case 'quiz-box': return <QuizBox note={note} theme={theme} />
    case 'case-study': return <CaseStudyBox note={note} theme={theme} />
    case 'problem-solution': return <ProblemSolutionBox note={note} theme={theme} />
    case 'practice-box': return <PracticeBox note={note} theme={theme} />
    case 'challenge-box': return <ChallengeBox note={note} theme={theme} />
    
    // Reference & Quick Access
    case 'quick-reference': return <QuickReferenceBox note={note} theme={theme} />
    case 'formula-box': return <FormulaBox note={note} theme={theme} />
    case 'timeline-box': return <TimelineBox note={note} theme={theme} />
    case 'comparison-box': return <ComparisonBox note={note} theme={theme} />
    case 'checklist-box': return <ChecklistBox note={note} theme={theme} />
    
    // Visual & Interactive
    case 'diagram-box': return <DiagramBox note={note} theme={theme} />
    case 'flowchart-box': return <FlowchartBox note={note} theme={theme} />
    case 'infographic-box': return <InfographicBox note={note} theme={theme} />
    case 'gallery-box': return <GalleryBox note={note} theme={theme} />
    
    // Special Purpose
    case 'warning-box': return <WarningBox note={note} theme={theme} />
    case 'tip-box': return <TipBox note={note} theme={theme} />
    case 'quote-box': return <QuoteBox note={note} theme={theme} />
    
    default: return <DefaultBox note={note} theme={theme} />
  }
}

function BigNotesBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-sm border-2 border-purple-500/40 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02]">
      {/* Double border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-blue-400/10 m-2" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Decorative corner accents with borders */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full border-l-2 border-b-2 border-purple-400/30" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full border-r-2 border-t-2 border-blue-400/30" />
      
      {/* Box type label */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md border border-purple-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Big Notes</span>
        </div>
      </div>
      
      <div className="relative p-8">
        {/* Icon badge with border */}
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-purple-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Title with gradient text and border accent */}
        <div className="mb-6 pb-4 border-b-2 border-purple-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.heading || note.title}
          </h3>
        </div>

        {/* Content with enhanced styling and border */}
        <div className="relative p-6 rounded-xl bg-slate-900/30 border border-purple-500/20 backdrop-blur-sm">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-purple-200 prose-headings:font-bold
            prose-p:text-slate-200 prose-p:leading-relaxed
            prose-strong:text-purple-300 prose-strong:font-semibold
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
            prose-code:text-pink-300 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-pink-500/20
            prose-ul:text-slate-200 prose-ol:text-slate-200
            prose-li:marker:text-purple-400"
            dangerouslySetInnerHTML={{ __html: content.body }} 
          />
        </div>

        {/* Highlights with animated pills */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Key Highlights</span>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2">
              {content.highlights.map((h: string, i: number) => (
                <span 
                  key={i} 
                  className="group/pill relative px-4 py-2 rounded-full text-sm font-medium text-white
                    bg-gradient-to-r from-purple-600 to-pink-600 
                    hover:from-purple-500 hover:to-pink-500
                    shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                    transform hover:-translate-y-0.5 transition-all duration-300
                    border-2 border-purple-400/40 hover:border-pink-400/60"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {h}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/pill:translate-x-full transition-transform duration-1000" />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom accent line with border */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function SmallNotesBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-cyan-900/40 backdrop-blur-sm border-2 border-emerald-500/40 shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-[1.02]">
      {/* Triple border layers */}
      <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 m-2" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-2xl" />
      
      {/* Box type label */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-md border border-emerald-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Small Notes</span>
        </div>
      </div>
      
      <div className="relative p-8">
        {/* Icon badge */}
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-emerald-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>

        {/* Title with gradient text */}
        <div className="mb-6 pb-4 border-b-2 border-emerald-500/30">
          <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>

        {/* Points list with enhanced styling */}
        <ul className="space-y-3">
          {content.points?.map((point: string, i: number) => (
            <li 
              key={i} 
              className="group/item flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-emerald-500/20 hover:border-teal-400/40 hover:bg-slate-900/60 transition-all duration-300 hover:translate-x-1"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Animated bullet */}
              <div className="relative flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover/item:shadow-emerald-500/50 transition-all duration-300 border border-emerald-400/30">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                {/* Connecting line for next item */}
                {i < (content.points?.length - 1) && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-emerald-500/50 to-transparent" />
                )}
              </div>
              
              {/* Point text */}
              <div className="flex-1">
                <span className="text-slate-200 leading-relaxed block">{point}</span>
                {/* Hover indicator */}
                <div className="h-0.5 w-0 group-hover/item:w-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 mt-2 rounded-full" />
              </div>
              
              {/* Check icon on hover */}
              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </li>
          ))}
        </ul>

        {/* Bottom stats bar */}
        <div className="mt-6 pt-4 border-t-2 border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              {content.points?.length || 0} Key Points
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(Math.min(content.points?.length || 0, 5))].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function RightWrongBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/40 via-gray-900/30 to-slate-900/40 backdrop-blur-sm border-2 border-slate-500/40 shadow-2xl hover:shadow-slate-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-gray-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-slate-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-slate-600/10 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-600/90 to-gray-600/90 backdrop-blur-md border border-slate-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Right/Wrong</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-green-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-slate-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-green-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-slate-200 via-gray-200 to-slate-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-4">
          {content.statements?.map((stmt: any, i: number) => (
            <div key={i} className={`group/stmt relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
              stmt.isCorrect 
                ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-500/40 hover:border-green-400/60 shadow-lg hover:shadow-green-500/20' 
                : 'bg-gradient-to-br from-red-900/40 to-rose-900/30 border-red-500/40 hover:border-red-400/60 shadow-lg hover:shadow-red-500/20'
            }`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${
                stmt.isCorrect 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`} />
              <div className="p-5 flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 ${
                  stmt.isCorrect
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-300/50 shadow-green-500/50'
                    : 'bg-gradient-to-br from-red-500 to-rose-500 border-red-300/50 shadow-red-500/50'
                }`}>
                  {stmt.isCorrect ? (
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-lg leading-relaxed">{stmt.statement}</p>
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-3xl ${
                stmt.isCorrect
                  ? 'bg-gradient-to-tl from-green-500/10 to-transparent'
                  : 'bg-gradient-to-tl from-red-500/10 to-transparent'
              }`} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-slate-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">
                {content.statements?.filter((s: any) => s.isCorrect).length || 0} Correct
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">
                {content.statements?.filter((s: any) => !s.isCorrect).length || 0} Wrong
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-slate-500 to-red-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function MnemonicMagicBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-900/40 via-purple-900/30 to-pink-900/40 backdrop-blur-sm border-2 border-fuchsia-500/40 shadow-2xl hover:shadow-fuchsia-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-pink-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-600/90 to-purple-600/90 backdrop-blur-md border border-fuchsia-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Mnemonic Magic</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-fuchsia-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 blur-2xl opacity-50 animate-pulse" />
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-fuchsia-600/30 to-purple-600/20 border-2 border-fuchsia-400/40 backdrop-blur-sm">
              <div className="text-6xl font-black bg-gradient-to-r from-fuchsia-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl tracking-wider">
                {content.mnemonic}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-fuchsia-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-fuchsia-300 uppercase tracking-wider">Memory Breakdown</span>
            <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-500/50 via-purple-500/50 to-transparent" />
          </div>
          <div className="space-y-4">
            {content.breakdown?.map((item: any, i: number) => (
              <div key={i} className="group/item relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-fuchsia-500/30 hover:border-purple-400/50 transition-all duration-300 hover:translate-x-2">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 via-purple-500 to-pink-500" />
                <div className="p-5 flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/50 border-2 border-fuchsia-300/50 group-hover/item:scale-110 transition-transform duration-300">
                      <span className="text-4xl font-black text-white drop-shadow-lg">{item.letter}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold text-fuchsia-200">{item.word}</h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-500/30 to-transparent" />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{item.meaning}</p>
                    <div className="h-0.5 w-0 group-hover/item:w-full bg-gradient-to-r from-fuchsia-400 to-purple-400 transition-all duration-500 mt-3 rounded-full" />
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-fuchsia-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-fuchsia-500/10 to-transparent rounded-tl-3xl" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-fuchsia-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            <span className="text-xs font-semibold text-fuchsia-300 uppercase tracking-wider">
              {content.breakdown?.length || 0} Letters to Remember
            </span>
          </div>
          <div className="flex gap-1">
            {content.breakdown?.map((_: any, i: number) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function MnemonicCardBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/40 via-fuchsia-900/30 to-violet-900/40 backdrop-blur-sm border-2 border-pink-500/40 shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-fuchsia-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-violet-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-fuchsia-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/90 to-fuchsia-600/90 backdrop-blur-md border border-pink-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Mnemonic Card</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-pink-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-pink-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        {content.mnemonic && (
          <div className="mb-8 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 blur-xl opacity-40" />
              <div className="relative px-6 py-4 rounded-xl bg-gradient-to-br from-pink-600/20 to-fuchsia-600/10 border border-pink-400/30">
                <div className="text-4xl font-black bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent tracking-wide">
                  {content.mnemonic}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-4">
          {content.breakdown?.map((item: any, i: number) => (
            <div key={i} className="group/card relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-pink-500/30 hover:border-fuchsia-400/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500" />
              <div className="p-5 flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/50 border-2 border-pink-300/50 group-hover/card:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-black text-white">{item.letter}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-pink-200">{item.word}</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.meaning}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-pink-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
              {content.breakdown?.length || 0} Memory Cards
            </span>
          </div>
          <div className="flex gap-1">
            {content.breakdown?.map((_: any, i: number) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function ContainerNotesBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-yellow-900/40 backdrop-blur-sm border-2 border-orange-500/40 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-[1.02]">
      {/* Multi-layer borders */}
      <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-yellow-400/10 m-2" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Geometric decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 border-r-2 border-b-2 border-orange-500/20 rounded-br-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-l-2 border-t-2 border-amber-500/20 rounded-tl-3xl" />
      
      {/* Box type label */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-600/90 to-amber-600/90 backdrop-blur-md border border-orange-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Container</span>
        </div>
      </div>
      
      <div className="relative p-8">
        {/* Icon badge */}
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-orange-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        {/* Title section */}
        <div className="mb-6 pb-4 border-b-2 border-orange-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.heading || note.title}
          </h3>
        </div>

        {/* Content container with nested border design */}
        <div className="relative">
          {/* Outer container */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 border-2 border-orange-500/30 shadow-inner">
            {/* Inner container */}
            <div className="p-5 rounded-lg bg-slate-900/40 border border-amber-500/20 backdrop-blur-sm">
              <div className="prose prose-invert prose-lg max-w-none
                prose-headings:text-orange-200 prose-headings:font-bold
                prose-p:text-slate-200 prose-p:leading-relaxed
                prose-strong:text-amber-300 prose-strong:font-semibold
                prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:text-yellow-300
                prose-code:text-orange-300 prose-code:bg-slate-800/70 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-orange-500/30
                prose-ul:text-slate-200 prose-ol:text-slate-200
                prose-li:marker:text-orange-400
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/10 prose-blockquote:py-2"
                dangerouslySetInnerHTML={{ __html: content.body }} 
              />
            </div>
          </div>
          
          {/* Corner decorations on container */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-orange-400/60 rounded-tl" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/60 rounded-tr" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/60 rounded-bl" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-orange-400/60 rounded-br" />
        </div>

        {/* Highlights section */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-orange-500/30">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">Featured Highlights</span>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 via-amber-500/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {content.highlights.map((h: string, i: number) => (
                <div 
                  key={i} 
                  className="group/highlight relative p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-amber-600/10 border-2 border-orange-500/30 hover:border-amber-400/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-tr-xl" />
                  
                  <div className="relative flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold border border-orange-400/50">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-200 font-medium leading-snug">{h}</span>
                  </div>
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-amber-500/10 to-orange-500/0 opacity-0 group-hover/highlight:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function QuickReferenceBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-900/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm border-2 border-sky-500/40 shadow-2xl hover:shadow-sky-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-indigo-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 via-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-600/90 to-blue-600/90 backdrop-blur-md border border-sky-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Quick Reference</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-sky-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-sky-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="grid gap-3">
          {content.facts?.map((fact: any, i: number) => (
            <div key={i} className="group/fact relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-sky-500/30 hover:border-blue-400/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-500 via-blue-500 to-indigo-500" />
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold border border-sky-400/50 shadow-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-300 font-medium">{fact.label}</span>
                </div>
                <div className="flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-br from-sky-600/30 to-blue-600/20 border border-sky-500/40">
                  <span className="text-sky-200 font-bold">{fact.value}</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-sky-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
              {content.facts?.length || 0} Quick Facts
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function FlashcardBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900/40 via-cyan-900/30 to-sky-900/40 backdrop-blur-sm border-2 border-teal-500/40 shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-sky-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-sky-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-gradient-to-tr from-sky-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600/90 to-cyan-600/90 backdrop-blur-md border border-teal-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Flashcard</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-teal-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-teal-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-4">
          {content.cards?.map((card: any, i: number) => (
            <div key={i} className="group/card relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-teal-500/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="relative p-5">
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-teal-500/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold border border-teal-400/50 shadow-lg">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-semibold leading-relaxed">{card.question}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold border border-cyan-400/50 shadow-lg">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-teal-200 leading-relaxed">{card.answer}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
              {content.cards?.length || 0} Flashcards
            </span>
          </div>
          <div className="flex gap-1">
            {content.cards?.map((_: any, i: number) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function RichContentBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/40 via-pink-900/30 to-fuchsia-900/40 backdrop-blur-sm border-2 border-rose-500/40 shadow-2xl hover:shadow-rose-500/30 transition-all duration-500 hover:scale-[1.02]">
      {/* Multi-layer borders */}
      <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-fuchsia-400/10 m-2" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 via-pink-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Floating orbs */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-36 h-36 bg-gradient-to-tr from-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Box type label */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600/90 to-pink-600/90 backdrop-blur-md border border-rose-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Rich Content</span>
        </div>
      </div>
      
      <div className="relative p-8">
        {/* Icon badge */}
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-rose-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title section */}
        <div className="mb-6 pb-4 border-b-2 border-rose-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-rose-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>

        {/* Rich content with magazine-style layout */}
        <div className="relative p-6 rounded-xl bg-slate-900/40 border border-rose-500/20 backdrop-blur-sm mb-6">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-rose-200 prose-headings:font-bold
            prose-p:text-slate-200 prose-p:leading-relaxed prose-p:text-justify
            prose-strong:text-pink-300 prose-strong:font-semibold
            prose-a:text-fuchsia-400 prose-a:no-underline hover:prose-a:text-fuchsia-300
            prose-code:text-rose-300 prose-code:bg-slate-800/70 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-rose-500/30
            prose-ul:text-slate-200 prose-ol:text-slate-200
            prose-li:marker:text-rose-400
            prose-blockquote:border-l-4 prose-blockquote:border-rose-500 prose-blockquote:bg-rose-500/10 prose-blockquote:py-2"
            dangerouslySetInnerHTML={{ __html: content.content }} 
          />
        </div>

        {/* Image gallery with enhanced styling */}
        {content.images && content.images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Media Gallery</span>
              <div className="flex-1 h-px bg-gradient-to-r from-rose-500/50 via-pink-500/50 to-transparent" />
              <span className="text-xs text-slate-400">{content.images.length} items</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {content.images.map((img: any, i: number) => (
                <div 
                  key={i} 
                  className="group/img relative overflow-hidden rounded-xl bg-slate-900/60 border-2 border-rose-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    
                    {/* Image number badge */}
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold border border-rose-300/50 shadow-lg">
                      {i + 1}
                    </div>
                    
                    {/* Zoom icon on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-sm flex items-center justify-center border border-rose-400/50">
                        <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div className="p-3 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-t border-rose-500/20">
                    <p className="text-sm text-slate-300 font-medium leading-snug line-clamp-2">{img.caption}</p>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-rose-500/20 to-transparent rounded-tl-2xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function StoryBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-purple-900/40 backdrop-blur-sm border-2 border-indigo-500/40 shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-purple-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-purple-500/30" />
      <div className="absolute top-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20" />
      <div className="absolute top-6 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/90 to-violet-600/90 backdrop-blur-md border border-indigo-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Story</span>
        </div>
      </div>
      <div className="relative p-8 pt-12">
        <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-indigo-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-indigo-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-full" />
            <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              {content.title || note.title}
            </h3>
          </div>
        </div>
        {content.image && (
          <div className="mb-6 relative">
            <div className="relative overflow-hidden rounded-xl border-2 border-indigo-500/30 shadow-2xl">
              <img src={content.image} alt="Story" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-300/60" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-violet-300/60" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-violet-300/60" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-indigo-300/60" />
            </div>
          </div>
        )}
        <div className="relative mb-6">
          <div className="absolute -top-4 -left-2 text-6xl text-indigo-500/30 font-serif leading-none">"</div>
          <div className="relative p-6 rounded-xl bg-slate-900/40 border border-indigo-500/20 backdrop-blur-sm">
            <div className="text-slate-200 leading-relaxed text-lg font-serif indent-8">{content.story}</div>
          </div>
          <div className="absolute -bottom-8 -right-2 text-6xl text-violet-500/30 font-serif leading-none">"</div>
        </div>
        {content.moral && (
          <div className="mt-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Moral of the Story</span>
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 via-violet-500/50 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border-l-4 border-indigo-400 p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center border-2 border-indigo-300/50 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-slate-100 text-lg font-medium leading-relaxed">{content.moral}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function DefinitionBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-sky-900/30 to-blue-900/40 backdrop-blur-sm border-2 border-cyan-500/40 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-sky-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-blue-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-sky-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/90 to-sky-600/90 backdrop-blur-md border border-cyan-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Definition</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-cyan-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              {content.term}
            </h3>
            <span className="text-sm text-cyan-400 font-mono italic">/pronunciation/</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-cyan-600/30 border border-cyan-500/40 text-xs font-semibold text-cyan-300">noun</div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
        </div>
        <div className="relative p-6 rounded-xl bg-slate-900/40 border-l-4 border-cyan-400 backdrop-blur-sm mb-6">
          <div className="absolute top-2 left-2 text-6xl text-cyan-500/10 font-serif leading-none">"</div>
          <p className="text-slate-200 text-lg leading-relaxed relative z-10">{content.definition}</p>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Examples in Context</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-sky-500/50 to-transparent" />
          </div>
          <div className="space-y-3">
            {content.examples?.map((ex: string, i: number) => (
              <div key={i} className="group/ex flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-cyan-500/20 hover:border-sky-400/40 hover:bg-slate-900/60 transition-all duration-300">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold border border-cyan-400/50 shadow-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 leading-relaxed italic">{ex}</p>
                  <div className="h-0.5 w-0 group-hover/ex:w-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-500 mt-2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {content.etymology && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600/20 to-sky-600/10 border border-cyan-500/30 p-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full" />
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center border border-cyan-400/50 shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">Etymology</div>
                <p className="text-sm text-slate-300 italic leading-relaxed">{content.etymology}</p>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function ExampleBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-900/40 via-green-900/30 to-emerald-900/40 backdrop-blur-sm border-2 border-lime-500/40 shadow-2xl hover:shadow-lime-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-green-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-emerald-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-lime-600/10 via-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-lime-500/20 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-tr-full" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-600/90 to-green-600/90 backdrop-blur-md border border-lime-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Examples</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-lime-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-lime-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-lime-300 via-green-300 to-emerald-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-4">
          {content.examples?.map((ex: any, i: number) => (
            <div key={i} className="group/example relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-lime-500/30 hover:border-green-400/50 transition-all duration-300 hover:translate-y-[-2px] shadow-lg hover:shadow-lime-500/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500" />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center text-white text-lg font-black border-2 border-lime-400/50 shadow-lg shadow-lime-500/30">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-lime-200 mb-2">{ex.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{ex.description}</p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover/example:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/20 border border-lime-400/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                {ex.code && (
                  <div className="relative mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">Code Example</span>
                      </div>
                      <button className="px-2 py-1 rounded bg-lime-600/30 border border-lime-500/40 text-xs text-lime-300 hover:bg-lime-600/50 transition-colors duration-200">
                        Copy
                      </button>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-lime-500/30">
                      <pre className="bg-slate-950/80 p-4 overflow-x-auto">
                        <code className="text-sm text-lime-200 font-mono">{ex.code}</code>
                      </pre>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-lime-500/10 to-transparent rounded-tl-2xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-lime-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
              {content.examples?.length || 0} Examples
            </span>
          </div>
          <div className="flex gap-2">
            {content.examples?.map((_: any, i: number) => (
              <div key={i} className="w-8 h-1 rounded-full bg-gradient-to-r from-lime-500 to-green-500" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function DefaultBox({ note, theme }: any) {
  return (
    <div className={`rounded-xl p-6 ${theme.bgClass} ${theme.borderClass} border-2`}>
      <h3 className={`text-xl font-bold mb-4 ${theme.textClass}`}>{note.title}</h3>
      <div className="text-slate-400 text-sm">Renderer for type "{note.type}" not yet implemented</div>
      <pre className="mt-4 text-xs text-slate-500 overflow-auto">{JSON.stringify(note.content, null, 2)}</pre>
    </div>
  )
}

function SummaryBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/40 via-orange-900/30 to-red-900/40 backdrop-blur-sm border-2 border-yellow-500/40 shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-red-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-red-500/40" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-yellow-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-600/90 to-orange-600/90 backdrop-blur-md border border-yellow-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Summary</span>
        </div>
      </div>
      <div className="relative p-8 pt-10">
        <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-yellow-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-yellow-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Key Points</span>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 via-orange-500/50 to-transparent" />
          </div>
          <ul className="space-y-3">
            {content.points?.map((point: string, i: number) => (
              <li key={i} className="group/point flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-yellow-500/20 hover:border-orange-400/40 hover:bg-slate-900/60 transition-all duration-300 hover:translate-x-1">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover/point:shadow-yellow-500/50 transition-all duration-300 border border-yellow-400/50">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {i < (content.points?.length - 1) && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-yellow-500/50 to-transparent" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-slate-200 leading-relaxed block">{point}</span>
                  <div className="h-0.5 w-0 group-hover/point:w-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 mt-2 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-600/30 to-orange-600/20 border-2 border-yellow-500/40 p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg shadow-yellow-500/50">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-yellow-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>Key Takeaway</span>
                <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent" />
              </div>
              <p className="text-slate-100 text-lg font-semibold leading-relaxed">{content.keyTakeaway}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-yellow-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">
              {content.points?.length || 0} Points Summarized
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(content.points?.length || 0, 5))].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}


function AcronymBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm border-2 border-slate-500/40 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-indigo-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-600/90 to-blue-600/90 backdrop-blur-md border border-slate-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Acronym</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-slate-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-blue-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-500 blur-2xl opacity-50" />
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-slate-600/30 to-blue-600/20 border-2 border-blue-400/40">
              <div className="text-6xl font-black bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent tracking-widest">
                {content.acronym}
              </div>
            </div>
          </div>
          <div className="mt-4 text-slate-300 text-lg font-medium">{content.fullForm}</div>
        </div>
        <div className="space-y-4">
          {content.breakdown?.map((item: any, i: number) => (
            <div key={i} className="group/item relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-slate-500/30 hover:border-blue-400/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-500 via-blue-500 to-indigo-500" />
              <div className="p-5 flex items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-blue-300/50 group-hover/item:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-black text-white">{item.letter}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-blue-200 mb-1">{item.word}</h4>
                  <p className="text-slate-300 leading-relaxed">{item.meaning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-slate-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              {content.breakdown?.length || 0} Letters
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function AnalogyBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-orange-900/40 backdrop-blur-sm border-2 border-amber-500/40 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-orange-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600/90 to-yellow-600/90 backdrop-blur-md border border-amber-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Analogy</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-amber-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-amber-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.concept}
          </h3>
        </div>
        {content.image && (
          <div className="mb-6 relative">
            <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/30 shadow-2xl">
              <img src={content.image} alt="Analogy" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent" />
            </div>
          </div>
        )}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-600/30 to-yellow-600/20 border-l-4 border-amber-400 p-6 mb-6 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center border-2 border-amber-300/50 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Analogy</div>
              <p className="text-slate-100 text-lg font-medium leading-relaxed">{content.analogy}</p>
            </div>
          </div>
        </div>
        <div className="relative p-6 rounded-xl bg-slate-900/40 border border-amber-500/20">
          <p className="text-slate-200 leading-relaxed">{content.explanation}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function PatternBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-fuchsia-900/40 backdrop-blur-sm border-2 border-violet-500/40 shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-fuchsia-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/90 to-purple-600/90 backdrop-blur-md border border-violet-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Pattern</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-violet-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-violet-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="mb-6 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 blur-xl opacity-40" />
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 border-2 border-violet-400/40">
              <div className="text-4xl font-mono font-black bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent tracking-wider">
                {content.pattern}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Examples</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
          </div>
          <ul className="space-y-3">
            {content.examples?.map((ex: string, i: number) => (
              <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-violet-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border border-violet-400/50">
                  {i + 1}
                </div>
                <span className="text-slate-200">{ex}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 border-l-4 border-violet-400 p-6 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center border-2 border-violet-300/50 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-2">Pattern Rule</div>
              <p className="text-slate-100 text-lg font-medium leading-relaxed">{content.rule}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function MemoryPalaceBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-cyan-900/40 backdrop-blur-sm border-2 border-indigo-500/40 shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/90 to-blue-600/90 backdrop-blur-md border border-indigo-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Memory Palace</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-indigo-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-indigo-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-4">
          {content.locations?.map((loc: any, i: number) => (
            <div key={i} className="group/loc relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-indigo-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
              <div className="p-5 flex items-start gap-5">
                {loc.image && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-indigo-400/50 shadow-lg">
                      <img src={loc.image} alt={loc.place} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold border border-indigo-300/50 shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-xl font-bold text-indigo-200">{loc.place}</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{loc.item}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              {content.locations?.length || 0} Memory Locations
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function QuizBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-sm border-2 border-blue-500/40 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-purple-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-md border border-blue-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Quiz</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-blue-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-blue-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            Quiz Challenge
          </h3>
        </div>
        <div className="space-y-6">
          {content.questions?.map((q: any, i: number) => (
            <div key={i} className="group/q relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-blue-500/30 hover:border-indigo-400/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-black border-2 border-blue-300/50 shadow-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-100 text-lg font-semibold leading-relaxed">{q.question}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {q.options?.map((opt: string, j: number) => (
                    <div key={j} className={`relative overflow-hidden rounded-lg p-4 transition-all duration-300 ${
                      j === q.correctIndex
                        ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/20 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                        : 'bg-slate-800/50 border border-slate-600/30 hover:border-blue-400/40 hover:bg-slate-800/70'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold border ${
                          j === q.correctIndex
                            ? 'bg-green-500 text-white border-green-400'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}>
                          {String.fromCharCode(65 + j)}
                        </div>
                        <span className="text-slate-200">{opt}</span>
                        {j === q.correctIndex && (
                          <svg className="ml-auto w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-l-4 border-blue-400 p-4">
                    <div className="flex items-start gap-3">
                      <svg className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Explanation</div>
                        <p className="text-slate-300 text-sm italic leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              {content.questions?.length || 0} Questions
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function CaseStudyBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-sm border-2 border-teal-500/40 shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-blue-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600/90 to-cyan-600/90 backdrop-blur-md border border-teal-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Case Study</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-teal-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-teal-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 border-teal-400 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center border border-teal-400/50">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h4 className="text-lg font-bold text-teal-200">Scenario</h4>
            </div>
            <p className="text-slate-200 leading-relaxed">{content.scenario}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 border-cyan-400 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center border border-cyan-400/50">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h4 className="text-lg font-bold text-cyan-200">Analysis</h4>
            </div>
            <p className="text-slate-200 leading-relaxed">{content.analysis}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 border-blue-400 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center border border-blue-400/50">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h4 className="text-lg font-bold text-blue-200">Outcome</h4>
            </div>
            <p className="text-slate-200 leading-relaxed">{content.outcome}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-600/30 to-cyan-600/20 border-2 border-teal-500/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h4 className="text-lg font-bold text-teal-200">Lessons Learned</h4>
            </div>
            <ul className="space-y-2">
              {content.lessons?.map((lesson: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/30 border border-teal-400/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-200 leading-relaxed">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function ProblemSolutionBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-teal-900/40 backdrop-blur-sm border-2 border-emerald-500/40 shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-green-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-teal-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/90 to-green-600/90 backdrop-blur-md border border-emerald-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Problem Solution</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-emerald-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-xl bg-red-900/30 border-2 border-red-500/40 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="text-xl font-bold text-red-200">Problem</h4>
            </div>
            <p className="text-slate-200 leading-relaxed">{content.problem}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 border-emerald-400 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h4 className="text-xl font-bold text-emerald-200">Approach</h4>
            </div>
            <p className="text-slate-200 leading-relaxed">{content.approach}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-green-500/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="text-xl font-bold text-green-200">Steps</h4>
            </div>
            <ol className="space-y-3">
              {content.steps?.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold border border-green-400/50 flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-200 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/20 border-2 border-emerald-500/50 p-6 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center border-2 border-emerald-300/50 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">Solution</div>
                <p className="text-slate-100 text-lg font-semibold leading-relaxed">{content.solution}</p>
              </div>
            </div>
          </div>
          {content.verification && (
            <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border border-teal-500/30 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">Verification</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{content.verification}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function PracticeBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-yellow-900/40 backdrop-blur-sm border-2 border-orange-500/40 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-yellow-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-600/90 to-amber-600/90 backdrop-blur-md border border-orange-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Practice</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-orange-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-orange-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-4">
          {content.problems?.map((prob: any, i: number) => (
            <div key={i} className="group/prob relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-orange-500/30 hover:border-amber-400/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold border border-orange-400/50 shadow-lg">
                      {i + 1}
                    </div>
                    <span className="text-slate-200 font-semibold leading-relaxed pt-0.5">{prob.question}</span>
                  </div>
                  <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 ${
                    prob.difficulty === 'easy' 
                      ? 'bg-green-600/30 border-green-500/50 text-green-300'
                      : prob.difficulty === 'medium'
                      ? 'bg-yellow-600/30 border-yellow-500/50 text-yellow-300'
                      : 'bg-red-600/30 border-red-500/50 text-red-300'
                  }`}>
                    {prob.difficulty}
                  </div>
                </div>
                {prob.hint && (
                  <div className="relative overflow-hidden rounded-lg bg-amber-600/20 border-l-4 border-amber-400 p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Hint: </span>
                        <span className="text-slate-300 text-sm italic">{prob.hint}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
              {content.problems?.length || 0} Practice Problems
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function ChallengeBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/40 via-orange-900/30 to-yellow-900/40 backdrop-blur-sm border-2 border-red-500/40 shadow-2xl hover:shadow-red-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-yellow-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/90 to-orange-600/90 backdrop-blur-md border border-red-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Challenge</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-red-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-red-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/30 to-orange-600/20 border-2 border-red-500/50 p-6 mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center border-2 border-red-300/50 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">Challenge Task</div>
                <p className="text-slate-100 text-xl font-bold leading-relaxed">{content.challenge}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-5 pt-5 border-t-2 border-red-500/30">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <div className="text-xs text-orange-300 font-semibold uppercase tracking-wider">Difficulty</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < content.difficulty ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {content.timeLimit && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-xs text-orange-300 font-semibold uppercase tracking-wider">Time Limit</div>
                    <div className="text-slate-100 font-bold">{content.timeLimit}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {content.reward && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-600/30 to-amber-600/20 border-2 border-yellow-500/50 p-5 text-center shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent" />
            <div className="relative flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Reward</div>
                <div className="text-slate-100 text-lg font-bold">{content.reward}</div>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function FormulaBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-indigo-900/40 backdrop-blur-sm border-2 border-purple-500/40 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-indigo-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-violet-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/90 to-violet-600/90 backdrop-blur-md border border-purple-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Formula</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-purple-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-purple-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.name}
          </h3>
        </div>
        <div className="mb-6 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 blur-2xl opacity-50" />
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-purple-600/30 to-violet-600/20 border-2 border-purple-400/40">
              <div className="text-4xl font-mono font-black bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 bg-clip-text text-transparent tracking-wider">
                {content.formula}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Variables</span>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
          </div>
          <div className="space-y-3">
            {content.variables?.map((v: any, i: number) => (
              <div key={i} className="group/var flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-purple-500/20 hover:border-violet-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center border-2 border-purple-300/50 shadow-lg flex-shrink-0">
                  <span className="text-white text-xl font-mono font-black">{v.symbol}</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-purple-300 font-bold">=</span>
                  <span className="text-slate-200 font-medium">{v.meaning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {content.example && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/30 to-violet-600/20 border-2 border-purple-500/40 p-5 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center border-2 border-purple-300/50 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Example</div>
                <p className="text-slate-100 text-lg font-medium leading-relaxed">{content.example}</p>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function TimelineBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/40 backdrop-blur-sm border-2 border-indigo-500/40 shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-pink-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md border border-indigo-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Timeline</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-indigo-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-indigo-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="relative">
          <div className="absolute left-28 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
          <div className="space-y-6">
            {content.events?.map((event: any, i: number) => (
              <div key={i} className="relative flex gap-6">
                <div className="w-24 flex-shrink-0 relative z-10">
                  <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-600/40 to-purple-600/30 border-2 border-indigo-500/50 text-center">
                    <div className="text-indigo-200 font-black text-lg leading-tight">{event.date}</div>
                  </div>
                </div>
                <div className="absolute left-28 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-indigo-300 shadow-lg z-10" />
                <div className="flex-1 relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-indigo-500/30 hover:border-purple-400/50 transition-all duration-300 group/event">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  {event.image && (
                    <div className="relative overflow-hidden">
                      <img src={event.image} alt={event.event} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h4 className="text-xl font-bold text-indigo-200 mb-2">{event.event}</h4>
                    {event.description && <p className="text-slate-300 leading-relaxed">{event.description}</p>}
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              {content.events?.length || 0} Events
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function ComparisonBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-sm border-2 border-cyan-500/40 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-purple-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-md border border-cyan-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Comparison</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-cyan-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-cyan-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {content.items?.map((item: any, i: number) => (
            <div key={i} className={`group/item relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
              i === 0 
                ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border-cyan-500/40 hover:border-cyan-400/60'
                : 'bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border-purple-500/40 hover:border-purple-400/60'
            }`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${
                i === 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-lg ${
                    i === 0
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-300/50'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-300/50'
                  }`}>
                    <span className="text-white text-lg font-bold">{i + 1}</span>
                  </div>
                  <h4 className={`text-2xl font-bold ${
                    i === 0 ? 'text-cyan-200' : 'text-purple-200'
                  }`}>{item.name}</h4>
                </div>
                <ul className="space-y-2">
                  {item.features?.map((feat: string, j: number) => (
                    <li key={j} className="flex items-start gap-2">
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        i === 0 ? 'text-cyan-400' : 'text-purple-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-200 leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-3xl ${
                i === 0
                  ? 'bg-gradient-to-tl from-cyan-500/10 to-transparent'
                  : 'bg-gradient-to-tl from-purple-500/10 to-transparent'
              }`} />
            </div>
          ))}
        </div>
        {content.conclusion && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/20 border-2 border-blue-500/50 p-6 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center border-2 border-blue-300/50 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Conclusion</div>
                <p className="text-slate-100 text-lg font-semibold leading-relaxed">{content.conclusion}</p>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function ChecklistBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/40 backdrop-blur-sm border-2 border-green-500/40 shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-teal-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md border border-green-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Checklist</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-green-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-green-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="space-y-3">
          {content.items?.map((item: any, i: number) => (
            <div key={i} className={`group/item relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
              item.completed
                ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-500/40 hover:border-green-400/60'
                : 'bg-slate-900/40 border-slate-500/30 hover:border-emerald-400/40'
            }`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${
                item.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-slate-500 to-slate-600'
              }`} />
              <div className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    item.completed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400'
                      : 'bg-slate-800 border-slate-600 group-hover/item:border-emerald-400'
                  }`}>
                    {item.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`font-semibold leading-relaxed ${
                    item.completed ? 'text-green-200 line-through' : 'text-slate-200'
                  }`}>{item.text}</div>
                  {item.note && (
                    <div className="mt-2 text-sm text-slate-400 italic leading-relaxed">{item.note}</div>
                  )}
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 w-12 h-12 rounded-tl-2xl ${
                item.completed
                  ? 'bg-gradient-to-tl from-green-500/10 to-transparent'
                  : 'bg-gradient-to-tl from-slate-500/10 to-transparent'
              }`} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-green-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">
              {content.items?.filter((i: any) => i.completed).length || 0}/{content.items?.length || 0} Complete
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function DiagramBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-teal-900/40 backdrop-blur-sm border-2 border-blue-500/40 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-teal-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/90 to-cyan-600/90 backdrop-blur-md border border-blue-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Diagram</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-blue-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-blue-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="mb-6 relative overflow-hidden rounded-xl border-2 border-blue-500/40 shadow-2xl">
          <img src={content.imageUrl} alt="Diagram" className="w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none" />
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-blue-300/60" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-300/60" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-300/60" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-blue-300/60" />
        </div>
        <div className="space-y-3">
          {content.annotations?.map((ann: any, i: number) => (
            <div key={i} className="group/ann relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-blue-500/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <div className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold border border-blue-400/50 shadow-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-blue-200 mb-1">{ann.label}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{ann.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              {content.annotations?.length || 0} Annotations
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function FlowchartBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-fuchsia-900/30 to-pink-900/40 backdrop-blur-sm border-2 border-violet-500/40 shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-fuchsia-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-pink-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 backdrop-blur-md border border-violet-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Flowchart</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-violet-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-violet-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-pink-500" />
          <div className="space-y-4">
            {content.steps?.map((step: any, i: number) => (
              <div key={i} className="relative">
                <div className={`relative mx-auto rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  step.type === 'start'
                    ? 'w-48 bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-500/50 shadow-lg shadow-green-500/20'
                    : step.type === 'end'
                    ? 'w-48 bg-gradient-to-br from-red-900/40 to-rose-900/30 border-red-500/50 shadow-lg shadow-red-500/20'
                    : step.type === 'decision'
                    ? 'w-56 bg-gradient-to-br from-yellow-900/40 to-amber-900/30 border-yellow-500/50 shadow-lg shadow-yellow-500/20 rotate-45'
                    : 'w-64 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30 border-violet-500/40 shadow-lg shadow-violet-500/20'
                }`}>
                  <div className={`p-4 text-center ${
                    step.type === 'decision' ? '-rotate-45' : ''
                  }`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                      step.type === 'start' ? 'text-green-300'
                      : step.type === 'end' ? 'text-red-300'
                      : step.type === 'decision' ? 'text-yellow-300'
                      : 'text-violet-300'
                    }`}>{step.type}</div>
                    <div className="text-slate-200 font-semibold leading-snug">{step.text}</div>
                  </div>
                </div>
                {i < content.steps.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-fuchsia-500" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-violet-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
              {content.steps?.length || 0} Steps
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function InfographicBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/40 via-pink-900/30 to-orange-900/40 backdrop-blur-sm border-2 border-rose-500/40 shadow-2xl hover:shadow-rose-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-orange-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 via-pink-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600/90 to-pink-600/90 backdrop-blur-md border border-rose-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Infographic</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-rose-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-rose-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-rose-300 via-pink-300 to-orange-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="mb-6 relative overflow-hidden rounded-xl border-2 border-rose-500/40 shadow-2xl">
          <img src={content.imageUrl} alt="Infographic" className="w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent pointer-events-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {content.dataPoints?.map((dp: any, i: number) => (
            <div key={i} className="group/dp relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-600/30 to-pink-600/20 border-2 border-rose-500/40 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 text-center p-5 shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
              <div className="relative">
                <div className="text-4xl font-black bg-gradient-to-r from-rose-200 to-pink-200 bg-clip-text text-transparent mb-2">
                  {dp.value}
                </div>
                <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{dp.label}</div>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-rose-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              {content.dataPoints?.length || 0} Data Points
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function GalleryBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-fuchsia-900/40 backdrop-blur-sm border-2 border-purple-500/40 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-fuchsia-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md border border-purple-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Gallery</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-purple-300/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-purple-500/30">
          <h3 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.images?.map((img: any, i: number) => (
            <div key={i} className="group/img relative overflow-hidden rounded-xl bg-slate-900/40 border-2 border-purple-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
              <div className="relative aspect-video overflow-hidden">
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold border border-purple-300/50 shadow-lg">
                  {i + 1}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-t border-purple-500/20">
                <p className="text-sm text-slate-300 font-medium leading-snug mb-1">{img.caption}</p>
                {img.description && <p className="text-xs text-slate-400 leading-relaxed">{img.description}</p>}
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              {content.images?.length || 0} Images
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function WarningBox({ note, theme }: any) {
  const content = note.content
  const severityConfig = {
    low: { bg: 'from-blue-900/40 via-sky-900/30 to-cyan-900/40', border: 'border-blue-500/40', shadow: 'shadow-blue-500/30', gradient: 'from-blue-600/90 to-sky-600/90', text: 'text-blue-200', icon: 'from-blue-500 to-sky-500', accent: 'from-blue-500 via-sky-500 to-cyan-500' },
    medium: { bg: 'from-yellow-900/40 via-amber-900/30 to-orange-900/40', border: 'border-yellow-500/40', shadow: 'shadow-yellow-500/30', gradient: 'from-yellow-600/90 to-amber-600/90', text: 'text-yellow-200', icon: 'from-yellow-500 to-amber-500', accent: 'from-yellow-500 via-amber-500 to-orange-500' },
    high: { bg: 'from-orange-900/40 via-red-900/30 to-rose-900/40', border: 'border-orange-500/40', shadow: 'shadow-orange-500/30', gradient: 'from-orange-600/90 to-red-600/90', text: 'text-orange-200', icon: 'from-orange-500 to-red-500', accent: 'from-orange-500 via-red-500 to-rose-500' },
    critical: { bg: 'from-red-900/40 via-rose-900/30 to-pink-900/40', border: 'border-red-500/40', shadow: 'shadow-red-500/30', gradient: 'from-red-600/90 to-rose-600/90', text: 'text-red-200', icon: 'from-red-500 to-rose-500', accent: 'from-red-500 via-rose-500 to-pink-500' }
  }
  const config = severityConfig[content.severity as keyof typeof severityConfig] || severityConfig.medium
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bg} backdrop-blur-sm border-2 ${config.border} shadow-2xl hover:${config.shadow} transition-all duration-500 hover:scale-[1.02]`}>
      <div className={`absolute inset-0 rounded-2xl border-2 ${config.border} opacity-50 m-1`} />
      <div className="absolute inset-0 rounded-2xl border border-white/10 m-2" />
      <div className="absolute top-4 right-4 z-10">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} backdrop-blur-md border border-white/30 shadow-lg`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{content.severity} Warning</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className={`absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br ${config.icon} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 border-2 border-white/50`}>
          <span className="text-3xl">{content.icon || '⚠️'}</span>
        </div>
        <div className="mb-4">
          <h3 className={`text-3xl font-black ${config.text} leading-tight drop-shadow-lg mb-3`}>
            {content.title || note.title}
          </h3>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 ${config.border} p-6">
          <p className="text-slate-100 text-lg leading-relaxed">{content.message}</p>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function TipBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-cyan-900/40 backdrop-blur-sm border-2 border-emerald-500/40 shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-md border border-emerald-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Pro Tip</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-emerald-300/50">
          <span className="text-3xl">{content.icon || '💡'}</span>
        </div>
        <div className="mb-4">
          <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            {content.title || note.title}
          </h3>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-slate-900/40 border-l-4 border-emerald-400 p-6 mb-4">
          <p className="text-slate-200 text-lg leading-relaxed">{content.tip}</p>
        </div>
        {content.category && (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600/30 to-teal-600/20 border border-emerald-500/40">
              <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{content.category}</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}

function QuoteBox({ note, theme }: any) {
  const content = note.content
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-sm border-2 border-indigo-500/40 shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 m-1" />
      <div className="absolute inset-0 rounded-2xl border border-purple-400/10 m-2" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/90 to-blue-600/90 backdrop-blur-md border border-indigo-300/30 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Quote</span>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:rotate-12 transition-transform duration-300 border-2 border-indigo-300/50">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        {content.image && (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/50 shadow-2xl">
                <img src={content.image} alt={content.author} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-900/40 to-transparent" />
            </div>
          </div>
        )}
        <blockquote className="text-center relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl text-indigo-500/20 font-serif leading-none">“</div>
          <div className="relative mb-6">
            <p className="text-3xl font-serif italic bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 bg-clip-text text-transparent leading-relaxed px-8">
              {content.quote}
            </p>
          </div>
          <div className="absolute -bottom-6 right-1/2 translate-x-1/2 text-8xl text-purple-500/20 font-serif leading-none">”</div>
        </blockquote>
        <footer className="mt-8 pt-6 border-t-2 border-indigo-500/30 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 blur-xl opacity-30" />
            <div className="relative px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-600/30 to-blue-600/20 border border-indigo-500/40">
              <cite className="text-xl font-bold text-indigo-200 not-italic">— {content.author}</cite>
            </div>
          </div>
          {content.context && (
            <div className="mt-4 text-sm text-slate-400 italic">{content.context}</div>
          )}
        </footer>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 border-t border-white/20" />
        </div>
      </div>
    </div>
  )
}
