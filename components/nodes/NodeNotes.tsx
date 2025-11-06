'use client'

// ============================================================================
// NOTES DISPLAY & MANAGEMENT COMPONENT
// Displays notes for a specific topic with create/edit/delete functionality
// ============================================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getNotesForTopic, addNote, updateNote, deleteNote, type Note } from '@/lib/notes-hierarchical'
import BookmarkButton from '../ui/BookmarkButton'

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>

interface NodeNotesProps {
  subjectSlug: string
  topicId: string
  subtopicId?: string // NEW: Support for subtopic-level notes
  bookmarked: boolean
  onToggleBookmark: () => void
}

export default function NodeNotes({ 
  subjectSlug, 
  topicId,
  subtopicId, // NEW: Support for subtopic-level notes
  bookmarked, 
  onToggleBookmark 
}: NodeNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    loadNotes()
  }, [subjectSlug, topicId, subtopicId])

  const loadNotes = () => {
    const loadedNotes = getNotesForTopic(subjectSlug, topicId, subtopicId)
    setNotes(loadedNotes)
  }

  const handleCreate = () => {
    if (!formData.content.trim()) return
    
    addNote(subjectSlug, topicId, formData.content, formData.title, subtopicId)
    setFormData({ title: '', content: '' })
    setIsCreating(false)
    loadNotes()
  }

  const handleUpdate = () => {
    if (!editingId || !formData.content.trim()) return
    
    updateNote(subjectSlug, topicId, editingId, {
      title: formData.title,
      content: formData.content
    }, subtopicId)
    setFormData({ title: '', content: '' })
    setEditingId(null)
    loadNotes()
  }

  const handleDelete = (noteId: string) => {
    if (confirm('Delete this note?')) {
      deleteNote(subjectSlug, topicId, noteId, subtopicId)
      loadNotes()
    }
  }

  const startEdit = (note: Note) => {
    setFormData({ title: note.title || '', content: note.content })
    setEditingId(note.id)
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setFormData({ title: '', content: '' })
    setEditingId(null)
    setIsCreating(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">📝 Your Notes</h3>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <PlusIcon />
              New Note
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass-card p-4 rounded-xl border border-purple-500/30">
              <input
                type="text"
                placeholder="Note Title (optional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 mb-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
              />
              <textarea
                placeholder="Write your note here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 mb-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={!formData.content.trim()}
                  className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SaveIcon />
                  {editingId ? 'Update' : 'Create'} Note
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <XIcon />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400"
            >
              <p className="text-lg mb-2">No notes yet</p>
              <p className="text-sm">Click "New Note" to create your first note!</p>
            </motion.div>
          ) : (
            notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {note.title && (
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {note.title}
                      </h4>
                    )}
                    <p className="text-sm text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {note.updatedAt !== note.createdAt && (
                        <span className="ml-2 text-purple-400">(edited)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(note)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      title="Edit note"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
