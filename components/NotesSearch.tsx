'use client'

// ============================================================================
// NOTES SEARCH & FILTER
// Fuzzy search with real-time results, tag filtering, and date range filters
// ============================================================================

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchNotes, getAllNotesForSubject } from '@/lib/notes-hierarchical'
import type { Note } from '@/lib/notes-hierarchical'
import { debounce, getVisibleItems, measurePerformance } from '@/lib/notes-performance'

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

interface NotesSearchProps {
  subjectSlug: string
  isOpen: boolean
  onClose: () => void
  onSelectNote?: (note: Note) => void
}

export default function NotesSearch({ subjectSlug, isOpen, onClose, onSelectNote }: NotesSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingQuery, setPendingQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(600)
  const ITEM_HEIGHT = 112 // approx height of each note card

  // Load all notes on mount
  useEffect(() => {
    if (isOpen) {
      measurePerformance('loadAllNotes', () => {
        const notes = getAllNotesForSubject(subjectSlug)
        setAllNotes(notes)
      }, { subjectSlug })
    }
  }, [isOpen, subjectSlug])

  // Get all unique tags from all notes
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    allNotes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [allNotes])

  // Fuzzy search implementation
  const fuzzyMatch = (text: string, query: string): boolean => {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    
    // Direct substring match
    if (lowerText.includes(lowerQuery)) return true
    
    // Fuzzy matching - characters in order but not necessarily consecutive
    let textIndex = 0
    let queryIndex = 0
    
    while (textIndex < lowerText.length && queryIndex < lowerQuery.length) {
      if (lowerText[textIndex] === lowerQuery[queryIndex]) {
        queryIndex++
      }
      textIndex++
    }
    
    return queryIndex === lowerQuery.length
  }

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    return measurePerformance('filterNotes', () => {
      let results = [...allNotes]

      // Search filter (use pendingQuery -> committed to searchQuery by debounce)
      if (searchQuery.trim()) {
        results = results.filter(note => {
          const searchableText = `${note.title || ''} ${note.content} ${note.tags?.join(' ') || ''}`
          return fuzzyMatch(searchableText, searchQuery)
        })
      }

      // Tag filter
      if (selectedTags.length > 0) {
        results = results.filter(note => {
          return selectedTags.some(tag => note.tags?.includes(tag))
        })
      }

      // Date filter
      if (dateFrom) {
        const fromTimestamp = new Date(dateFrom).getTime()
        results = results.filter(note => new Date(note.createdAt).getTime() >= fromTimestamp)
      }

      if (dateTo) {
        const toTimestamp = new Date(dateTo).getTime() + 86400000 // include end date
        results = results.filter(note => new Date(note.createdAt).getTime() <= toTimestamp)
      }

      // Sort by most recent first
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, { subjectSlug, searchQueryLength: searchQuery.length, tagCount: selectedTags.length })
  }, [allNotes, searchQuery, selectedTags, dateFrom, dateTo, subjectSlug])

  // Highlight search query in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)
    
    if (index === -1) return text
    
    const before = text.slice(0, index)
    const match = text.slice(index, index + query.length)
    const after = text.slice(index + query.length)
    
    return (
      <>
        {before}
        <mark className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">{match}</mark>
        {after}
      </>
    )
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setDateFrom('')
    setDateTo('')
    setShowFilters(false)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Debounced search commit - update searchQuery after user stops typing
  // Use a local pendingQuery so the input remains snappy
  useEffect(() => {
    const commit = debounce((q: string) => setSearchQuery(q), 250)
    commit(pendingQuery)
    return () => { /* noop - debounce closures cleaned on unmount */ }
  }, [pendingQuery])

  // Setup container height and scroll listener for virtualization
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => setScrollTop(el.scrollTop)
    setContainerHeight(el.clientHeight)
    el.addEventListener('scroll', onScroll)
    window.addEventListener('resize', () => setContainerHeight(el.clientHeight))

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', () => setContainerHeight(el.clientHeight))
    }
  }, [containerRef.current])

  // Compute visible window for virtualization
  const { visibleItems, startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    if (!filteredNotes) return { visibleItems: [], startIndex: 0, endIndex: 0, totalHeight: 0, offsetY: 0 }
    return getVisibleItems(filteredNotes, scrollTop, containerHeight, ITEM_HEIGHT, 3)
  }, [filteredNotes, scrollTop, containerHeight])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 relative">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes... (fuzzy matching enabled)"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  showFilters || selectedTags.length > 0 || dateFrom || dateTo
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <FilterIcon />
                Filters
                {(selectedTags.length > 0 || dateFrom || dateTo) && (
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs font-bold">
                    {selectedTags.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                  </span>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {/* Tags Filter */}
                    {availableTags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Filter by Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date Range Filter */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <CalendarIcon />
                          From Date
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <CalendarIcon />
                          To Date
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(selectedTags.length > 0 || dateFrom || dateTo) && (
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm font-medium"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results */}
          <div ref={containerRef} className="p-4 overflow-y-auto max-h-[calc(80vh-200px)] smooth-scroll">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-400">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg mb-2">No notes found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                  {visibleItems.map((note: Note, idx: number) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => onSelectNote?.(note)}
                      className="glass-card p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer group"
                      style={{ height: ITEM_HEIGHT }}
                    >
                      {/* Note Title */}
                      {note.title && (
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">
                          {highlightText(note.title, searchQuery)}
                        </h3>
                      )}

                      {/* Note Content Preview */}
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {highlightText(note.content, searchQuery)}
                      </p>

                      {/* Note Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span>
                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-1">
                              {note.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {note.tags.length > 3 && (
                                <span className="text-gray-400">+{note.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
                          Click to view →
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
