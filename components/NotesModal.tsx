'use client'

// ============================================================================
// NOTES EDITOR MODAL - Rich Note Creation & Editing
// Full-featured modal with tags, markdown preview, and keyboard shortcuts
// ============================================================================

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Note } from '@/lib/types'
import RichTextEditor from './RichTextEditor'

// Icons
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
const TypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; content: string; tags: string[] }) => void
  initialData?: Partial<Note>
  mode?: 'create' | 'edit'
}

export default function NotesModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create'
}: NotesModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg')
  
  const titleInputRef = useRef<HTMLInputElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '')
      setContent(initialData?.content || '')
      setTags(initialData?.tags || [])
      setTagInput('')
      setShowPreview(false)
      
      // Auto-focus title input
      setTimeout(() => titleInputRef.current?.focus(), 100)
    }
  }, [isOpen, initialData])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      
      // Escape to close
      if (e.key === 'Escape' && !tagInput) {
        e.preventDefault()
        onClose()
      }
      
      // Ctrl+P or Cmd+P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        setShowPreview(!showPreview)
      }
      
      // Ctrl+Shift+M to toggle editor mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault()
        setEditorMode(prev => prev === 'wysiwyg' ? 'markdown' : 'wysiwyg')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showPreview, onClose, tagInput, editorMode])

  const handleSave = async () => {
    if (!content.trim()) return
    
    setIsSaving(true)
    
    // Simulate async save with animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onSave({ title: title.trim(), content: content.trim(), tags })
    setIsSaving(false)
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Simple markdown-to-HTML for preview (basic implementation)
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(3)}</h2>
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
        }
        
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={i} className="ml-4">{line.slice(2)}</li>
        }
        
        // Bold and italic (simple)
        let processedLine = line
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
        processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded">$1</code>')
        
        // Empty lines
        if (!line.trim()) {
          return <br key={i} />
        }
        
        return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />
      })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'create' ? '📝 Create Note' : '✏️ Edit Note'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {showPreview ? 'Preview Mode' : editorMode === 'wysiwyg' ? 'WYSIWYG Mode' : 'Markdown Mode'} • Ctrl+S to save • Ctrl+Shift+M to toggle mode
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] smooth-scroll">
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your note..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                disabled={showPreview}
              />
            </div>

            {/* Content Area */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Content *
                </label>
                <div className="flex items-center gap-2">
                  {/* Mode Toggle */}
                  <button
                    onClick={() => setEditorMode(prev => prev === 'wysiwyg' ? 'markdown' : 'wysiwyg')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
                    title="Ctrl+Shift+M"
                  >
                    {editorMode === 'wysiwyg' ? (
                      <>
                        <CodeIcon />
                        Markdown
                      </>
                    ) : (
                      <>
                        <TypeIcon />
                        WYSIWYG
                      </>
                    )}
                  </button>
                  
                  {/* Preview Toggle */}
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors text-sm"
                    title="Ctrl+P"
                  >
                    {showPreview ? (
                      <>
                        <EditIcon />
                        Edit
                      </>
                    ) : (
                      <>
                        <EyeIcon />
                        Preview
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="w-full min-h-[300px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 prose prose-invert max-w-none">
                  {content ? renderMarkdown(content) : <p className="text-gray-500">No content to preview</p>}
                </div>
              ) : editorMode === 'wysiwyg' ? (
                <RichTextEditor
                  content={content}
                  onChange={(html, markdown) => {
                    // Store as markdown for compatibility
                    setContent(markdown)
                  }}
                  placeholder="Write your note here... Use the toolbar for formatting"
                />
              ) : (
                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here... (Markdown supported: **bold**, *italic*, `code`, # headers, - lists)"
                  rows={12}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                />
              )}
            </div>

            {/* Tags Section */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <TagIcon />
                Tags
              </label>
              
              {/* Tag Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tags (press Enter)"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm font-medium"
                >
                  Add Tag
                </button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-3 py-1.5 bg-linear-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <XIcon />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* Character Count */}
            <div className="text-xs text-gray-500 text-right">
              {content.length} characters • {content.split(/\s+/).filter(w => w).length} words
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-neutral-900/50 backdrop-blur-sm">
            <div className="text-sm text-gray-400">
              {content.trim() ? (
                <span className="text-green-400">✓ Ready to save</span>
              ) : (
                <span className="text-yellow-400">⚠ Content required</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="px-6 py-2.5 bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <SaveIcon />
                {isSaving ? 'Saving...' : mode === 'create' ? 'Create Note' : 'Update Note'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
