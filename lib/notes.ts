// ============================================================================
// HIERARCHICAL NOTES MANAGEMENT SYSTEM
// Provides file-based notes organization with Subject > Topic > Subtopic structure
// ============================================================================

import { getAllSubjectsData } from './data'

export interface Note {
  id: string
  content: string
  title?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  topicId: string
  subtopicId?: string // NEW: Support for subtopic-level notes
  subjectSlug: string
}

export interface NotesStorage {
  [subjectSlug: string]: {
    [topicId: string]: Note[]
  }
}

/**
 * Get notes storage key for localStorage
 */
function getStorageKey(subjectSlug: string, topicId: string, subtopicId?: string): string {
  if (subtopicId) {
    return `notty_notes_${subjectSlug}_${topicId}_${subtopicId}`
  }
  return `notty_notes_${subjectSlug}_${topicId}`
}

/**
 * Get backup storage key
 */
function getBackupKey(subjectSlug: string, timestamp: number): string {
  return `notty_backup_${subjectSlug}_${timestamp}`
}

const MAX_BACKUPS = 5

/**
 * Create backup before major operations
 */
function createBackup(subjectSlug: string): void {
  try {
    const allNotes = getAllNotesForSubject(subjectSlug)
    const timestamp = Date.now()
    const backupKey = getBackupKey(subjectSlug, timestamp)
    
    localStorage.setItem(backupKey, JSON.stringify(allNotes))
    
    // Clean old backups
    const allKeys = Object.keys(localStorage)
    const backupKeys = allKeys
      .filter(k => k.startsWith(`notty_backup_${subjectSlug}_`))
      .sort()
      .reverse()
    
    if (backupKeys.length > MAX_BACKUPS) {
      backupKeys.slice(MAX_BACKUPS).forEach(k => localStorage.removeItem(k))
    }
  } catch (error) {
    console.error('Error creating backup:', error)
  }
}

/**
 * Load all notes for a specific topic or subtopic
 */
export function getNotesForTopic(
  subjectSlug: string,
  topicId: string,
  subtopicId?: string
): Note[] {
  try {
    const key = getStorageKey(subjectSlug, topicId, subtopicId)
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading notes:', error)
    return []
  }
}

/**
 * Save a new note to a topic or subtopic
 */
export function addNote(
  subjectSlug: string,
  topicId: string,
  content: string,
  title?: string,
  subtopicId?: string
): Note {
  createBackup(subjectSlug) // Auto-backup before changes
  
  const notes = getNotesForTopic(subjectSlug, topicId, subtopicId)
  
  const newNote: Note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    title: title || 'Untitled Note',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topicId,
    subtopicId, // NEW: Track subtopic
    subjectSlug,
    tags: []
  }
  
  notes.unshift(newNote) // Add to beginning
  saveNotes(subjectSlug, topicId, notes, subtopicId)
  
  return newNote
}

/**
 * Update an existing note
 */
export function updateNote(
  subjectSlug: string,
  topicId: string,
  noteId: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt' | 'subjectSlug' | 'topicId'>>,
  subtopicId?: string
): Note | null {
  createBackup(subjectSlug) // Auto-backup before changes
  
  const notes = getNotesForTopic(subjectSlug, topicId, subtopicId)
  const index = notes.findIndex(n => n.id === noteId)
  
  if (index === -1) return null
  
  notes[index] = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  saveNotes(subjectSlug, topicId, notes, subtopicId)
  return notes[index]
}

/**
 * Delete a note
 */
export function deleteNote(
  subjectSlug: string,
  topicId: string,
  noteId: string,
  subtopicId?: string
): boolean {
  createBackup(subjectSlug) // Auto-backup before changes
  
  const notes = getNotesForTopic(subjectSlug, topicId, subtopicId)
  const filtered = notes.filter(n => n.id !== noteId)
  
  if (filtered.length === notes.length) return false
  
  saveNotes(subjectSlug, topicId, filtered, subtopicId)
  return true
}

/**
 * Save notes to localStorage
 */
function saveNotes(
  subjectSlug: string,
  topicId: string,
  notes: Note[],
  subtopicId?: string
): void {
  try {
    const key = getStorageKey(subjectSlug, topicId, subtopicId)
    localStorage.setItem(key, JSON.stringify(notes))
  } catch (error) {
    console.error('Error saving notes:', error)
  }
}

/**
 * Get all notes for a subject (across all topics)
 */
export function getAllNotesForSubject(subjectSlug: string): Note[] {
  const subjects = getAllSubjectsData()
  const subject = subjects.find(s => s.slug === subjectSlug)
  
  if (!subject) return []
  
  const allNotes: Note[] = []
  
  subject.topics.forEach(topic => {
    const topicNotes = getNotesForTopic(subjectSlug, topic.id)
    allNotes.push(...topicNotes)
  })
  
  return allNotes.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * Search notes by content or title
 */
export function searchNotes(query: string, subjectSlug?: string): Note[] {
  const subjects = subjectSlug 
    ? getAllSubjectsData().filter(s => s.slug === subjectSlug)
    : getAllSubjectsData()
  
  const allNotes: Note[] = []
  const lowerQuery = query.toLowerCase()
  
  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      const notes = getNotesForTopic(subject.slug, topic.id)
      const matched = notes.filter(note => 
        note.content.toLowerCase().includes(lowerQuery) ||
        note.title?.toLowerCase().includes(lowerQuery) ||
        note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      allNotes.push(...matched)
    })
  })
  
  return allNotes
}

/**
 * Export notes for a subject as JSON
 */
export function exportNotes(subjectSlug: string): string {
  const notes = getAllNotesForSubject(subjectSlug)
  return JSON.stringify(notes, null, 2)
}

/**
 * Import notes from JSON
 */
export function importNotes(jsonData: string): boolean {
  try {
    const notes: Note[] = JSON.parse(jsonData)
    
    // Group by subject and topic
    const grouped: { [key: string]: { [topicId: string]: Note[] } } = {}
    
    notes.forEach(note => {
      if (!grouped[note.subjectSlug]) {
        grouped[note.subjectSlug] = {}
      }
      if (!grouped[note.subjectSlug][note.topicId]) {
        grouped[note.subjectSlug][note.topicId] = []
      }
      grouped[note.subjectSlug][note.topicId].push(note)
    })
    
    // Save each group
    Object.entries(grouped).forEach(([subjectSlug, topics]) => {
      Object.entries(topics).forEach(([topicId, topicNotes]) => {
        saveNotes(subjectSlug, topicId, topicNotes)
      })
    })
    
    return true
  } catch (error) {
    console.error('Error importing notes:', error)
    return false
  }
}

/**
 * Get notes statistics
 */
export function getNotesStats(subjectSlug?: string) {
  const notes = subjectSlug 
    ? getAllNotesForSubject(subjectSlug)
    : getAllSubjectsData().flatMap(s => getAllNotesForSubject(s.slug))
  
  const now = Date.now()
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
  
  // Count notes by level
  const topicNotes = notes.filter(n => !n.subtopicId).length
  const subtopicNotes = notes.filter(n => n.subtopicId).length
  
  // Tag frequency
  const tagFrequency: { [tag: string]: number } = {}
  notes.forEach(note => {
    note.tags?.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
    })
  })
  
  return {
    total: notes.length,
    byLevel: {
      topic: topicNotes,
      subtopic: subtopicNotes
    },
    recentlyUpdated: notes.filter(n => {
      const daysSinceUpdate = (now - new Date(n.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceUpdate <= 7
    }).length,
    last7Days: notes.filter(n => new Date(n.createdAt).getTime() > sevenDaysAgo).length,
    last30Days: notes.filter(n => new Date(n.createdAt).getTime() > thirtyDaysAgo).length,
    bySubject: notes.reduce((acc, note) => {
      acc[note.subjectSlug] = (acc[note.subjectSlug] || 0) + 1
      return acc
    }, {} as { [key: string]: number }),
    topTags: Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count })),
    avgNotesPerDay: notes.length > 0
      ? (notes.length / Math.max(1, Math.ceil((now - new Date(notes[notes.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))))
      : 0
  }
}

/**
 * Get all available backups for a subject
 */
export function getBackups(subjectSlug: string): Array<{ timestamp: number; date: string; noteCount: number }> {
  const allKeys = Object.keys(localStorage)
  const backupKeys = allKeys
    .filter(k => k.startsWith(`notty_backup_${subjectSlug}_`))
    .map(k => {
      const timestamp = parseInt(k.split('_').pop() || '0')
      const data = localStorage.getItem(k)
      const noteCount = data ? JSON.parse(data).length : 0
      return {
        timestamp,
        date: new Date(timestamp).toLocaleString(),
        noteCount
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
  
  return backupKeys
}

/**
 * Restore notes from a specific backup
 */
export function restoreFromBackup(subjectSlug: string, timestamp: number): boolean {
  try {
    const backupKey = getBackupKey(subjectSlug, timestamp)
    const backupData = localStorage.getItem(backupKey)
    
    if (!backupData) return false
    
    const notes: Note[] = JSON.parse(backupData)
    
    // Clear existing notes for this subject
    const allKeys = Object.keys(localStorage)
    const notesKeys = allKeys.filter(k => k.startsWith(`notty_notes_${subjectSlug}_`))
    notesKeys.forEach(k => localStorage.removeItem(k))
    
    // Restore notes
    const grouped: { [key: string]: Note[] } = {}
    notes.forEach(note => {
      const key = getStorageKey(subjectSlug, note.topicId, note.subtopicId)
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(note)
    })
    
    Object.entries(grouped).forEach(([key, groupedNotes]) => {
      localStorage.setItem(key, JSON.stringify(groupedNotes))
    })
    
    return true
  } catch (error) {
    console.error('Error restoring backup:', error)
    return false
  }
}

/**
 * Delete old backups to free up space
 */
export function cleanOldBackups(subjectSlug: string, keepCount: number = MAX_BACKUPS): number {
  const backups = getBackups(subjectSlug)
  const toDelete = backups.slice(keepCount)
  
  toDelete.forEach(backup => {
    const backupKey = getBackupKey(subjectSlug, backup.timestamp)
    localStorage.removeItem(backupKey)
  })
  
  return toDelete.length
}
