'use client'
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { Subject } from '@/lib/types'
import { flattenNodes } from '@/lib/toc'
import { brandMap, BrandKey } from '@/lib/brand'
import { exportPDF } from '@/lib/pdf'
import { highlightSearch } from '@/lib/search'
import { persist, retrieve } from '@/lib/localStorage'
import { useSwipe, vibrate } from '@/lib/touch'
import SearchBar from './ui/SearchBar'
import Toc from './Toc'
import NodeRenderer from './NodeRenderer'
import SubjectHeader from './SubjectHeader'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from './ui/BackToTop'
import BannerResume from './ui/BannerResume'
import QuickToggles from './ui/QuickToggles'
import { useToast } from '@/components/feedback/ToastProvider'
import SubjectReferences from './SubjectReferences'
import ReadingControls from './ui/ReadingControls'
import KeyboardNav from './ui/KeyboardNav'
import Breadcrumb from './ui/Breadcrumb'
import MobileTocDrawer from './ui/MobileTocDrawer'
import MobileBottomNav from './ui/MobileBottomNav'

// Lazy load heavy components
const BookmarksModal = dynamic(() => import('./BookmarksModal'), {
  ssr: false,
})

const SubjectSettingsModal = dynamic(() => import('./SubjectSettingsModal'), {
  ssr: false,
})

const LearningStatsDashboard = dynamic(() => import('./ui/LearningStatsDashboard'), {
  ssr: false,
})

// Import the type separately for type safety
import type { SubjectSettings } from './SubjectSettingsModal'

function buildPathMap(nodes: any[], parentPath: string[] = [], out: Record<string, { title: string, path: string[] }> = {}) {
  for (const n of nodes) {
    const title = n.title || n.kind
    const path = [...parentPath, title]
    out[n.id] = { title, path }
    if (n.children?.length) buildPathMap(n.children, path, out)
  }
  return out
}

export default function SubjectShell({ subject }: { subject: Subject }) {
  const raw = (subject.brandColor || 'emerald') as BrandKey
  const brand: BrandKey = (brandMap as any)[raw] ? raw : 'emerald' // guard fallback

  const [search, setSearch] = useState('')
  const [focusMode, setFocusMode] = useState<boolean>(() => retrieve(`notty_focus_${subject.slug}`, false))
  const [instantQuiz, setInstantQuiz] = useState<boolean>(() => retrieve(`notty_iq_${subject.slug}`, false))
  const [bookmarks, setBookmarks] = useState<string[]>(() => retrieve(`notty_bm_${subject.slug}`, [] as string[]))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showBM, setShowBM] = useState(false)
  const [showRefsAll, setShowRefsAll] = useState(false)
  const [resume, setResume] = useState<{ nodeId: string, title: string, at?: number } | null>(null)
  const [resumeDismissed, setResumeDismissed] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem(`resume:dismissed:${subject.slug}`) || 'false') } catch { return false }
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showMobileToc, setShowMobileToc] = useState(false)
  const [showLearningStats, setShowLearningStats] = useState(false)
  const [tocVisible, setTocVisible] = useState(true)

  const { showToast } = useToast()

  const contentRef = useRef<HTMLDivElement>(null)
  const toc = useMemo(() => flattenNodes(subject.nodes), [subject.nodes])
  const pathMap = useMemo(() => buildPathMap(subject.nodes as any[]), [subject.nodes])
  const titleMap = useMemo(
    () => toc.reduce<Record<string,string>>((acc, t)=> (acc[t.id]=t.title, acc), {}),
    [toc]
  )

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`lastRead:${subject.slug}`)
      if (!raw) return
      const last = JSON.parse(raw) as { nodeId: string, title: string, path: string, at: number }
      if (!last?.nodeId) return
      setResume({ nodeId: last.nodeId, title: last.title || last.path?.split(' > ').pop() || 'Last read', at: last.at })
    } catch {}
  }, [subject.slug])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`settings:${subject.slug}`)
      if (!raw) return
      const s = JSON.parse(raw) as SubjectSettings
      if (typeof s.defaultFocus === 'boolean') setFocusMode(s.defaultFocus)
      if (typeof s.defaultInstant === 'boolean') setInstantQuiz(s.defaultInstant)
      // Default cite style used by All References drawer
      const citeKey = `refs:${subject.slug}:citeStyle`
      if (s.defaultCiteStyle && !localStorage.getItem(citeKey)) {
        localStorage.setItem(citeKey, JSON.stringify(s.defaultCiteStyle))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.slug])

  useEffect(()=>persist(`notty_focus_${subject.slug}`, focusMode), [focusMode, subject.slug])
  useEffect(()=>persist(`notty_iq_${subject.slug}`, instantQuiz), [instantQuiz, subject.slug])
  useEffect(()=>persist(`notty_bm_${subject.slug}`, bookmarks), [bookmarks, subject.slug])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    highlightSearch(el, search)
  }, [search])

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY
      const doc = document.documentElement.scrollHeight - window.innerHeight
      const pct = Math.max(0, Math.min(1, top / doc))
      setProgress(Math.round(pct * 100))

      const sections = contentRef.current?.querySelectorAll('section[data-node-id]')
      let current: string | null = null
      sections?.forEach(sec => {
        const rect = (sec as HTMLElement).getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.33) current = (sec as HTMLElement).getAttribute('data-node-id')
      })
      if (current) {
        setActiveId(current)
        // Persist last read
        const meta = pathMap[current] || { title: '', path: [] }
        const last = { nodeId: current, title: meta.title, path: meta.path.join(' > '), at: Date.now() }
        try { localStorage.setItem(`lastRead:${subject.slug}`, JSON.stringify(last)) } catch {}
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => document.removeEventListener('scroll', onScroll)
  }, [pathMap, subject.slug])

  // Touch gesture navigation for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      // Next section
      const currentIndex = toc.findIndex(t => t.id === activeId)
      if (currentIndex >= 0 && currentIndex < toc.length - 1) {
        const next = toc[currentIndex + 1]
        document.getElementById(next.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        vibrate(10)
      }
    },
    onSwipeRight: () => {
      // Previous section
      const currentIndex = toc.findIndex(t => t.id === activeId)
      if (currentIndex > 0) {
        const prev = toc[currentIndex - 1]
        document.getElementById(prev.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        vibrate(10)
      }
    },
    threshold: 100, // Require 100px swipe
  })

  // Keyboard navigation is now handled by KeyboardNav component

  useEffect(() => {
    const openRefs = () => setShowRefsAll(true)
    const openBM = () => setShowBM(true)
    const toggleFocus = () => setFocusMode(v => !v)
    const toggleInstant = () => setInstantQuiz(v => !v)
    const doExport = () => exportPDF(`${subject.slug}.pdf`)

    window.addEventListener('notty:openRefsAll', openRefs as any)
    window.addEventListener('notty:openBookmarks', openBM as any)
    window.addEventListener('notty:toggleFocus', toggleFocus as any)
    window.addEventListener('notty:toggleInstantQuiz', toggleInstant as any)
    window.addEventListener('notty:exportPDF', doExport as any)
    return () => {
      window.removeEventListener('notty:openRefsAll', openRefs as any)
      window.removeEventListener('notty:openBookmarks', openBM as any)
      window.removeEventListener('notty:toggleFocus', toggleFocus as any)
      window.removeEventListener('notty:toggleInstantQuiz', toggleInstant as any)
      window.removeEventListener('notty:exportPDF', doExport as any)
    }
  }, [subject.slug])

  function jumpToLastRead() {
    try {
      const raw = localStorage.getItem(`lastRead:${subject.slug}`)
      if (!raw) return
      const last = JSON.parse(raw) as { nodeId: string }
      if (!last.nodeId) return
      const el = document.getElementById(last.nodeId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } catch {}
  }

  useEffect(() => {
    const openLast = () => jumpToLastRead()
    window.addEventListener('notty:openLastRead', openLast as any)
    return () => window.removeEventListener('notty:openLastRead', openLast as any)
  }, [subject.slug])

  function scrollTo(id: string, byFocus = false) {
    const el = document.getElementById(id)
    if (!el) return
    if (focusMode && byFocus) {
      contentRef.current?.querySelectorAll(':scope > section').forEach(sec => {
        if ((sec as HTMLElement).id !== id) sec.classList.add('section-hidden')
        else sec.classList.remove('section-hidden')
      })
    }
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  function onToggleBookmark(id: string) {
    setBookmarks(prev => {
      const adding = !prev.includes(id)
      const next = adding ? [...prev, id] : prev.filter(x => x !== id)
      // Undo action
      showToast({
        message: adding ? 'Bookmarked' : 'Bookmark removed',
        variant: 'success',
        action: {
          label: 'Undo',
          onClick: () => {
            setBookmarks(curr => (adding ? curr.filter(x => x !== id) : [...curr, id]))
          }
        }
      })
      return next
    })
  }

  function copyMnemonics() {
    const out: string[] = []
    const walk = (nodes: any[]) => nodes.forEach(n => { if (n.mnemonic) out.push(n.mnemonic); if (n.children) walk(n.children) })
    walk(subject.nodes)
    if (out.length) navigator.clipboard.writeText(out.join(' | '))
  }

  function resumeNow() {
    if (!resume) return
    const el = document.getElementById(resume.nodeId)
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      location.hash = `#${resume.nodeId}`
    }
  }
  function dismissResume() {
    setResumeDismissed(true)
    try { localStorage.setItem(`resume:dismissed:${subject.slug}`, 'true') } catch {}
  }

  return (
    <div className="notes-theme">
      <ProgressBar progress={progress} colorClass={brandMap[brand].progress} />

      <SubjectHeader
        title={subject.title}
        description={subject.description}
        brand={brand}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        instantQuiz={instantQuiz}
        setInstantQuiz={setInstantQuiz}
        exportPDF={()=>exportPDF(`${subject.slug}.pdf`)}
        copyMnemonics={copyMnemonics}
        onOpenRefsAll={()=>setShowRefsAll(true)}
      />

      {resume && !resumeDismissed && activeId !== resume.nodeId && (
        <BannerResume
          title={resume.title}
          at={resume.at}
          onResume={resumeNow}
          onDismiss={dismissResume}
        />
      )}

      {/* Mobile TOC + search */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm border-b border-gray-200 md:hidden no-print">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {toc.slice(0, 8).map(t => (
              <button key={t.id} onClick={()=>scrollTo(t.id)} className="whitespace-nowrap border border-emerald-500 text-emerald-700 bg-emerald-50/50 px-3 py-1 rounded-full font-semibold text-sm">
                {t.title}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search topics..." />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Desktop TOC */}
          <aside className={`hidden md:block transition-all duration-300 no-print ${tocVisible ? 'md:col-span-3' : 'md:col-span-0 md:w-0'}`}>
            {tocVisible && (
            <div className="sticky top-20">
              <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl shadow-xl p-4 border border-gray-700 dark:border-gray-800 toc">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-emerald-400">Table of Contents</h3>
                  <button
                    onClick={() => setTocVisible(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Hide TOC"
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-3">
                  <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
                </div>
                <Toc items={toc} activeId={activeId} onJump={(id)=>scrollTo(id)} />
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={focusMode} onChange={(e)=>setFocusMode(e.target.checked)} className="rounded border-gray-600 bg-gray-800"/>
                    Focus Mode
                  </label>
                  <button onClick={()=>setShowBM(true)} className="text-xs text-emerald-400 hover:text-emerald-300 underline">Bookmarks</button>
                </div>

                <QuickToggles
                  slug={subject.slug}
                  focusMode={focusMode}
                  setFocusMode={setFocusMode}
                  instantQuiz={instantQuiz}
                  setInstantQuiz={setInstantQuiz}
                />

                {/* Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowLearningStats(true)}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📊</span>
                    <span>Stats</span>
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>
                
                {/* Reading Controls in TOC */}
                <div className="mt-3">
                  <ReadingControls slug={subject.slug} />
                </div>
              </div>
            </div>
            )}
          </aside>

          {/* Content */}
          <section 
            id="contentWrap" 
            ref={contentRef} 
            className={`space-y-8 pb-12 transition-all duration-300 ${tocVisible ? 'col-span-12 md:col-span-9' : 'col-span-12'}`}
            {...swipeHandlers}
          >
            {/* TOC Toggle Button - Shows when TOC is hidden */}
            {!tocVisible && (
              <button
                onClick={() => setTocVisible(true)}
                className="hidden md:flex fixed left-4 top-24 z-50 items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-colors no-print"
                title="Show TOC"
              >
                <span>☰</span>
                <span className="text-sm font-semibold">TOC</span>
              </button>
            )}
            {/* Breadcrumb Navigation */}
            {activeId && pathMap[activeId] && (
              <div className="sticky top-16 z-20 bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700 shadow-lg no-print">
                <Breadcrumb path={pathMap[activeId].path} />
              </div>
            )}
            
            <div className="reading-content">
              {subject.nodes.map(n => (
                <NodeRenderer
                  key={n.id}
                  node={n}
                  brand={brand}
                  instantQuiz={instantQuiz}
                  bookmarks={bookmarks}
                  onToggleBookmark={onToggleBookmark}
                  subjectSlug={subject.slug}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <BackToTop />
      
      <LearningStatsDashboard 
        subjectSlug={subject.slug} 
        totalCards={subject.nodes.filter((n: any) => n.kind === 'flashcards').reduce((acc: number, n: any) => acc + (n.cards?.length || 0), 0)}
        isOpen={showLearningStats}
        onClose={() => setShowLearningStats(false)}
      />
      <KeyboardNav 
        sections={toc.map(t => ({ id: t.id, title: t.title }))}
        onNavigate={(id) => scrollTo(id, true)}
      />

      {/* Mobile TOC Drawer */}
      <MobileTocDrawer isOpen={showMobileToc} onClose={() => setShowMobileToc(false)}>
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
        </div>
        <Toc items={toc} activeId={activeId} onJump={(id) => { scrollTo(id); setShowMobileToc(false); }} />
        
        {/* Reading Controls in Mobile TOC */}
        <div className="mt-4">
          <ReadingControls slug={subject.slug} />
        </div>
        
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={focusMode} 
              onChange={(e) => setFocusMode(e.target.checked)} 
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Focus Mode</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={instantQuiz} 
              onChange={(e) => setInstantQuiz(e.target.checked)} 
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Instant Quiz</span>
          </label>
        </div>
      </MobileTocDrawer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onTocToggle={() => setShowMobileToc(true)}
        onSettingsOpen={() => setShowSettings(true)}
        onBookmarksOpen={() => setShowBM(true)}
        showStats={true}
        onStatsOpen={() => setShowLearningStats(true)}
      />

      <BookmarksModal
        open={showBM}
        bookmarks={bookmarks}
        titles={titleMap}
        onClose={()=>setShowBM(false)}
        onRemove={(id)=>setBookmarks(prev=>prev.filter(x=>x!==id))}
        onJump={(id)=>scrollTo(id)}
      />
      <SubjectReferences
        subject={subject}
        open={showRefsAll}
        onClose={()=>setShowRefsAll(false)}
        onJump={(id)=>scrollTo(id)}
      />
      <SubjectSettingsModal
        slug={subject.slug}
        open={showSettings}
        onClose={()=>setShowSettings(false)}
        onApply={(cfg)=> {
          // Apply without saving
          setFocusMode(cfg.defaultFocus)
          setInstantQuiz(cfg.defaultInstant)
          const citeKey = `refs:${subject.slug}:citeStyle`
          localStorage.setItem(citeKey, JSON.stringify(cfg.defaultCiteStyle))
          showToast({ message: 'Settings applied', variant: 'success' })
        }}
      />
    </div>
  )
}