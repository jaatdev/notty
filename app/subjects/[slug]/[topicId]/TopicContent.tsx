'use client'

import { useState, useEffect } from 'react'
import NodeRenderer from '@/components/NodeRenderer'
import NoteBoxRenderer from '@/components/NoteBoxRenderer'
import NotesModal from '@/components/NotesModal'
import NotesExportImport from '@/components/NotesExportImport'
import NotesSearch from '@/components/NotesSearch'
import NotesAnalytics from '@/components/NotesAnalytics'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp'
import { addNote, getNotesForTopic } from '@/lib/notes-hierarchical'
import { measurePerformance, checkStorageHealth } from '@/lib/notes-performance'
import type { ContentNode } from '@/lib/types'
import type { Note } from '@/lib/notes-hierarchical'
import type { BrandKey } from '@/lib/brand'
import { useToast } from '@/components/feedback/ToastProvider'

// Icons
const NotesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const BackupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/></svg>
const PerformanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

type TopicContentProps = {
  content: ContentNode[]
  subjectSlug: string
  topicId: string
  brandColor: BrandKey
  subjectTitle?: string
  topicTitle?: string
}

export default function TopicContent({ content, subjectSlug, topicId, brandColor, subjectTitle, topicTitle }: TopicContentProps) {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [instantQuiz, setInstantQuiz] = useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [isExportImportOpen, setIsExportImportOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const { showToast } = useToast()

  // Load topic notes on mount
  useEffect(() => {
    loadNotes()
  }, [subjectSlug, topicId])

  // Check storage health on mount
  useEffect(() => {
    const health = checkStorageHealth()
    if (!health.healthy && health.warning) {
      showToast({
        message: health.warning,
        variant: health.stats.critical ? 'error' : 'warning',
        timeout: 8000
      })
    }
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea (except our shortcuts)
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // ? to open help (works even when typing)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !isHelpOpen && !isTyping) {
        e.preventDefault()
        setIsHelpOpen(true)
        return
      }

      // Ctrl+/ or Cmd+/ to open search (browser-safe alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === '/' && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
        return
      }

      // Ctrl+K or Cmd+K to open search (command palette style)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
        return
      }

      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
        return
      }
      
      // Ctrl+N or Cmd+N to create new note (prevent new window/tab)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isNotesModalOpen) {
        e.preventDefault()
        setIsNotesModalOpen(true)
        return
      }

      // Ctrl+Shift+N or Cmd+Shift+N to create new note (alternative)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N' && !isNotesModalOpen) {
        e.preventDefault()
        setIsNotesModalOpen(true)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, isNotesModalOpen, isHelpOpen])

  const loadNotes = () => {
    measurePerformance('loadNotes', () => {
      const topicNotes = getNotesForTopic(subjectSlug, topicId)
      setNotes(topicNotes)
    }, { subjectSlug, topicId })
  }

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(b => b !== id) 
        : [...prev, id]
    )
  }

  const handleCreateNote = (data: { title: string; content: string; tags: string[] }) => {
    measurePerformance('createNote', () => {
      try {
        const newNote = addNote(
          subjectSlug,
          topicId,
          data.content,
          data.title,
          undefined, // subtopicId - undefined for topic-level notes
          subjectTitle,
          topicTitle
        )
        
        // Update with tags if provided
        if (data.tags && data.tags.length > 0) {
          newNote.tags = data.tags
        }
        
        loadNotes()
        setIsNotesModalOpen(false)
        
        showToast({
          message: '✅ Note created successfully!',
          variant: 'success'
        })
      } catch (error) {
        showToast({
          message: '❌ Failed to create note',
          variant: 'error'
        })
      }
    }, { subjectSlug, topicId, hasTitle: !!data.title, tagCount: data.tags?.length || 0 })
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Help Button */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
          aria-label="Show keyboard shortcuts"
          title="Keyboard Shortcuts (?)"
        >
          <HelpIcon />
          <span className="hidden md:inline">Help</span>
        </button>

        {/* Performance Monitor Button */}
        <button
          onClick={() => setIsPerformanceOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
          aria-label="View performance"
          title="Performance Monitor"
        >
          <PerformanceIcon />
          <span className="hidden md:inline">Performance</span>
        </button>

        {/* Analytics Button */}
        <button
          onClick={() => setIsAnalyticsOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
          aria-label="View analytics"
          title="View Analytics"
        >
          <AnalyticsIcon />
          <span className="hidden md:inline">Analytics</span>
        </button>

        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
          aria-label="Search notes"
          title="Search Notes (Ctrl+F)"
        >
          <SearchIcon />
          <span className="hidden md:inline">Search</span>
        </button>

        {/* Backup/Export Button */}
        <button
          onClick={() => setIsExportImportOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
          aria-label="Backup and export notes"
          title="Backup & Export"
        >
          <BackupIcon />
          <span className="hidden md:inline">Backup</span>
        </button>

        {/* Quick Notes Button */}
        <button
          onClick={() => setIsNotesModalOpen(true)}
          className="px-5 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
          style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
          aria-label="Create new note"
          title="Create Note (Ctrl+N)"
        >
          <NotesIcon />
          <span className="hidden md:inline">Quick Note</span>
          {notes.length > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {notes.length}
            </span>
          )}
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
      />

      {/* Notes Analytics */}
      <NotesAnalytics
        subjectSlug={subjectSlug}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Notes Search */}
      <NotesSearch
        subjectSlug={subjectSlug}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={handleCreateNote}
        mode="create"
      />

      {/* Export/Import Modal */}
      <NotesExportImport
        subjectSlug={subjectSlug}
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />

      {/* Existing Content */}
      <div className="space-y-6 mb-12">
        {content.map((node: any, index: number) => {
          // Check if this is a NoteBox (has 'type' field instead of 'kind')
          if (node.type && !node.kind) {
            return <NoteBoxRenderer key={node.id} note={node} index={index} />
          }
          // Otherwise render as regular ContentNode
          return (
            <NodeRenderer 
              key={node.id} 
              node={node} 
              brand={brandColor}
              instantQuiz={instantQuiz}
              bookmarks={bookmarks}
              onToggleBookmark={toggleBookmark}
              subjectSlug={subjectSlug}
            />
          )
        })}
      </div>
    </>
  )
}
