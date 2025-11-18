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
import ToolsMenu from '@/components/admin/ToolsMenu'
import { useFullscreen } from '@/lib/fullscreen-context'
import { addNote, getNotesForTopic } from '@/lib/notes-hierarchical'
import { measurePerformance, checkStorageHealth } from '@/lib/notes-performance'
import type { ContentNode } from '@/lib/types'
import type { Note } from '@/lib/notes-hierarchical'
import type { BrandKey } from '@/lib/brand'
import { useToast } from '@/components/feedback/ToastProvider'

// Icons (no longer needed with ToolsMenu, but kept for reference)

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
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  // Load topic notes on mount
  useEffect(() => {
    loadNotes()
  }, [subjectSlug, topicId])

  // Keyboard shortcuts for fullscreen mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen()
      }
      // F to enter fullscreen
      if (e.key === 'f' && !isFullscreen) {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, toggleFullscreen])

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
      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fullscreen-exit-btn"
          title="Exit fullscreen mode (Esc)"
          aria-label="Exit fullscreen mode"
        >
          ✕ Exit Focus Mode
        </button>
      )}

      {/* Fullscreen Button (only show when not in fullscreen) */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fullscreen-btn"
          title="Enter fullscreen mode for distraction-free studying"
          aria-label="Enter fullscreen mode"
        >
          ⛶ Focus Mode
        </button>
      )}

      {/* Tools Menu */}
      {!isFullscreen && (
        <div className="fixed top-24 right-6 z-40">
          <ToolsMenu
            onHelpClick={() => setIsHelpOpen(true)}
            onPerformanceClick={() => setIsPerformanceOpen(true)}
            onAnalyticsClick={() => setIsAnalyticsOpen(true)}
            onSearchClick={() => setIsSearchOpen(true)}
            onBackupClick={() => setIsExportImportOpen(true)}
            onQuickNoteClick={() => setIsNotesModalOpen(true)}
          />
        </div>
      )}

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
