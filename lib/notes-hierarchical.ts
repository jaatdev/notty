// ============================================================================
// HIERARCHICAL NOTES MANAGEMENT SYSTEM V2
// Uses proper Subject → Topic → Subtopic JSON structure
// ============================================================================

import { getAllSubjectsData } from './data'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NoteMetadata {
  wordCount: number
  readingTime: number
  isPinned?: boolean
  isArchived?: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  metadata?: NoteMetadata
  // Context fields (not stored in JSON, added at runtime)
  subjectSlug?: string
  topicId?: string
  subtopicId?: string
}

export interface SubtopicNotes {
  subtopicId: string
  subtopicTitle?: string
  notes: Note[]
}

export interface TopicNotes {
  topicId: string
  topicTitle?: string
  notes: Note[] // Topic-level notes
  subtopics?: {
    [subtopicId: string]: SubtopicNotes
  }
}

export interface SubjectNotes {
  metadata: {
    title: string
    slug: string
    totalNotes: number
    lastUpdated: string
  }
  topics: {
    [topicId: string]: TopicNotes
  }
}

export interface UserNotesData {
  version: string
  lastSync: string
  subjects: {
    [subjectSlug: string]: SubjectNotes
  }
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEY = 'notty_user_notes_v2'
const BACKUP_PREFIX = 'notty_backup_v2_'
const MAX_BACKUPS = 5

// ============================================================================
// CORE STORAGE FUNCTIONS
// ============================================================================

/**
 * Load all user notes from localStorage
 */
function loadUserNotes(): UserNotesData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading user notes:', error)
  }

  // Return empty structure if nothing exists
  return {
    version: '1.0.0',
    lastSync: new Date().toISOString(),
    subjects: {}
  }
}

/**
 * Save all user notes to localStorage
 */
function saveUserNotes(data: UserNotesData): boolean {
  try {
    data.lastSync = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving user notes:', error)
    return false
  }
}

/**
 * Initialize subject if it doesn't exist
 */
function ensureSubjectExists(data: UserNotesData, subjectSlug: string, subjectTitle?: string): void {
  if (!data.subjects[subjectSlug]) {
    data.subjects[subjectSlug] = {
      metadata: {
        title: subjectTitle || subjectSlug,
        slug: subjectSlug,
        totalNotes: 0,
        lastUpdated: new Date().toISOString()
      },
      topics: {}
    }
  }
}

/**
 * Initialize topic if it doesn't exist
 */
function ensureTopicExists(
  subject: SubjectNotes,
  topicId: string,
  topicTitle?: string
): void {
  if (!subject.topics[topicId]) {
    subject.topics[topicId] = {
      topicId,
      topicTitle,
      notes: [],
      subtopics: {}
    }
  }
}

/**
 * Initialize subtopic if it doesn't exist
 */
function ensureSubtopicExists(
  topic: TopicNotes,
  subtopicId: string,
  subtopicTitle?: string
): void {
  if (!topic.subtopics) {
    topic.subtopics = {}
  }
  if (!topic.subtopics[subtopicId]) {
    topic.subtopics[subtopicId] = {
      subtopicId,
      subtopicTitle,
      notes: []
    }
  }
}

/**
 * Calculate metadata for a note
 */
function calculateMetadata(content: string): NoteMetadata {
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // Avg 200 words/min
  return {
    wordCount,
    readingTime,
    isPinned: false,
    isArchived: false
  }
}

/**
 * Update subject metadata
 */
function updateSubjectMetadata(subject: SubjectNotes): void {
  let totalNotes = 0
  Object.values(subject.topics).forEach(topic => {
    totalNotes += topic.notes.length
    if (topic.subtopics) {
      Object.values(topic.subtopics).forEach(subtopic => {
        totalNotes += subtopic.notes.length
      })
    }
  })
  subject.metadata.totalNotes = totalNotes
  subject.metadata.lastUpdated = new Date().toISOString()
}

// ============================================================================
// BACKUP FUNCTIONS
// ============================================================================

/**
 * Create a backup of current notes
 */
function createBackup(): void {
  try {
    const currentData = loadUserNotes()
    const timestamp = Date.now()
    const backupKey = `${BACKUP_PREFIX}${timestamp}`
    
    localStorage.setItem(backupKey, JSON.stringify(currentData))
    
    // Clean old backups
    const allKeys = Object.keys(localStorage)
    const backupKeys = allKeys
      .filter(k => k.startsWith(BACKUP_PREFIX))
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
 * Get all available backups
 */
export function getBackups(): Array<{ timestamp: number; date: string; totalNotes: number }> {
  const allKeys = Object.keys(localStorage)
  const backupKeys = allKeys
    .filter(k => k.startsWith(BACKUP_PREFIX))
    .map(k => {
      const timestamp = parseInt(k.replace(BACKUP_PREFIX, ''))
      const data = localStorage.getItem(k)
      let totalNotes = 0
      if (data) {
        const parsed: UserNotesData = JSON.parse(data)
        Object.values(parsed.subjects).forEach(subject => {
          totalNotes += subject.metadata.totalNotes
        })
      }
      return {
        timestamp,
        date: new Date(timestamp).toLocaleString(),
        totalNotes
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
  
  return backupKeys
}

/**
 * Restore from a specific backup
 */
export function restoreFromBackup(timestamp: number): boolean {
  try {
    const backupKey = `${BACKUP_PREFIX}${timestamp}`
    const backupData = localStorage.getItem(backupKey)
    
    if (!backupData) return false
    
    localStorage.setItem(STORAGE_KEY, backupData)
    return true
  } catch (error) {
    console.error('Error restoring backup:', error)
    return false
  }
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Get notes for a topic or subtopic
 */
export function getNotesForTopic(
  subjectSlug: string,
  topicId: string,
  subtopicId?: string
): Note[] {
  const data = loadUserNotes()
  const subject = data.subjects[subjectSlug]
  
  if (!subject) return []
  
  const topic = subject.topics[topicId]
  if (!topic) return []
  
  if (subtopicId) {
    const subtopic = topic.subtopics?.[subtopicId]
    return subtopic ? subtopic.notes.map(note => ({
      ...note,
      subjectSlug,
      topicId,
      subtopicId
    })) : []
  }
  
  return topic.notes.map(note => ({
    ...note,
    subjectSlug,
    topicId
  }))
}

/**
 * Add a new note
 */
export function addNote(
  subjectSlug: string,
  topicId: string,
  content: string,
  title?: string,
  subtopicId?: string,
  subjectTitle?: string,
  topicTitle?: string,
  subtopicTitle?: string
): Note {
  createBackup() // Auto-backup before changes
  
  const data = loadUserNotes()
  
  // Ensure hierarchy exists
  ensureSubjectExists(data, subjectSlug, subjectTitle)
  const subject = data.subjects[subjectSlug]
  
  ensureTopicExists(subject, topicId, topicTitle)
  const topic = subject.topics[topicId]
  
  // Create new note
  const newNote: Note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: title || 'Untitled Note',
    content,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: calculateMetadata(content)
  }
  
  // Add to appropriate location
  if (subtopicId) {
    ensureSubtopicExists(topic, subtopicId, subtopicTitle)
    topic.subtopics![subtopicId].notes.unshift(newNote)
  } else {
    topic.notes.unshift(newNote)
  }
  
  // Update metadata
  updateSubjectMetadata(subject)
  saveUserNotes(data)
  
  return {
    ...newNote,
    subjectSlug,
    topicId,
    subtopicId
  }
}

/**
 * Update an existing note
 */
export function updateNote(
  subjectSlug: string,
  topicId: string,
  noteId: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt' | 'subjectSlug' | 'topicId' | 'subtopicId'>>,
  subtopicId?: string
): Note | null {
  createBackup() // Auto-backup before changes
  
  const data = loadUserNotes()
  const subject = data.subjects[subjectSlug]
  if (!subject) return null
  
  const topic = subject.topics[topicId]
  if (!topic) return null
  
  // Find and update note
  let notes: Note[]
  if (subtopicId && topic.subtopics?.[subtopicId]) {
    notes = topic.subtopics[subtopicId].notes
  } else {
    notes = topic.notes
  }
  
  const noteIndex = notes.findIndex(n => n.id === noteId)
  if (noteIndex === -1) return null
  
  // Apply updates
  const updatedNote: Note = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  // Recalculate metadata if content changed
  if (updates.content) {
    updatedNote.metadata = {
      ...updatedNote.metadata,
      ...calculateMetadata(updates.content)
    }
  }
  
  notes[noteIndex] = updatedNote
  updateSubjectMetadata(subject)
  saveUserNotes(data)
  
  return {
    ...updatedNote,
    subjectSlug,
    topicId,
    subtopicId
  }
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
  createBackup() // Auto-backup before changes
  
  const data = loadUserNotes()
  const subject = data.subjects[subjectSlug]
  if (!subject) return false
  
  const topic = subject.topics[topicId]
  if (!topic) return false
  
  // Find and delete note
  let notes: Note[]
  if (subtopicId && topic.subtopics?.[subtopicId]) {
    notes = topic.subtopics[subtopicId].notes
  } else {
    notes = topic.notes
  }
  
  const initialLength = notes.length
  const filtered = notes.filter(n => n.id !== noteId)
  
  if (filtered.length === initialLength) return false
  
  // Update notes array
  if (subtopicId && topic.subtopics?.[subtopicId]) {
    topic.subtopics[subtopicId].notes = filtered
  } else {
    topic.notes = filtered
  }
  
  updateSubjectMetadata(subject)
  saveUserNotes(data)
  return true
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all notes for a subject
 */
export function getAllNotesForSubject(subjectSlug: string): Note[] {
  const data = loadUserNotes()
  const subject = data.subjects[subjectSlug]
  
  if (!subject) return []
  
  const allNotes: Note[] = []
  
  Object.entries(subject.topics).forEach(([topicId, topic]) => {
    // Add topic-level notes
    topic.notes.forEach(note => {
      allNotes.push({
        ...note,
        subjectSlug,
        topicId
      })
    })
    
    // Add subtopic-level notes
    if (topic.subtopics) {
      Object.entries(topic.subtopics).forEach(([subtopicId, subtopic]) => {
        subtopic.notes.forEach(note => {
          allNotes.push({
            ...note,
            subjectSlug,
            topicId,
            subtopicId
          })
        })
      })
    }
  })
  
  // Sort by creation date (newest first)
  return allNotes.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * Search notes across all subjects or specific subject
 */
export function searchNotes(query: string, subjectSlug?: string): Note[] {
  const data = loadUserNotes()
  const lowerQuery = query.toLowerCase()
  const results: Note[] = []
  
  const subjectsToSearch = subjectSlug
    ? [data.subjects[subjectSlug]].filter(Boolean)
    : Object.values(data.subjects)
  
  subjectsToSearch.forEach(subject => {
    Object.entries(subject.topics).forEach(([topicId, topic]) => {
      // Search topic-level notes
      topic.notes.forEach(note => {
        if (
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery) ||
          note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        ) {
          results.push({
            ...note,
            subjectSlug: subject.metadata.slug,
            topicId
          })
        }
      })
      
      // Search subtopic-level notes
      if (topic.subtopics) {
        Object.entries(topic.subtopics).forEach(([subtopicId, subtopic]) => {
          subtopic.notes.forEach(note => {
            if (
              note.title.toLowerCase().includes(lowerQuery) ||
              note.content.toLowerCase().includes(lowerQuery) ||
              note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
            ) {
              results.push({
                ...note,
                subjectSlug: subject.metadata.slug,
                topicId,
                subtopicId
              })
            }
          })
        })
      }
    })
  })
  
  return results
}

/**
 * Get notes statistics
 */
export function getNotesStats(subjectSlug?: string) {
  const data = loadUserNotes()
  const now = Date.now()
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
  
  const allNotes = subjectSlug
    ? getAllNotesForSubject(subjectSlug)
    : Object.values(data.subjects).flatMap(s => getAllNotesForSubject(s.metadata.slug))
  
  // Count by level
  const topicNotes = allNotes.filter(n => !n.subtopicId).length
  const subtopicNotes = allNotes.filter(n => n.subtopicId).length
  
  // Tag frequency
  const tagFrequency: { [tag: string]: number } = {}
  allNotes.forEach(note => {
    note.tags?.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
    })
  })
  
  return {
    total: allNotes.length,
    byLevel: {
      topic: topicNotes,
      subtopic: subtopicNotes
    },
    recentlyUpdated: allNotes.filter(n => {
      const daysSinceUpdate = (now - new Date(n.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceUpdate <= 7
    }).length,
    last7Days: allNotes.filter(n => new Date(n.createdAt).getTime() > sevenDaysAgo).length,
    last30Days: allNotes.filter(n => new Date(n.createdAt).getTime() > thirtyDaysAgo).length,
    bySubject: allNotes.reduce((acc, note) => {
      const slug = note.subjectSlug || 'unknown'
      acc[slug] = (acc[slug] || 0) + 1
      return acc
    }, {} as { [key: string]: number }),
    topTags: Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count })),
    avgNotesPerDay: allNotes.length > 0
      ? (allNotes.length / Math.max(1, Math.ceil((now - new Date(allNotes[allNotes.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))))
      : 0
  }
}

// ============================================================================
// EXPORT/IMPORT FUNCTIONS
// ============================================================================

/**
 * Export all notes as JSON
 */
export function exportNotes(subjectSlug?: string): string {
  const data = loadUserNotes()
  
  if (subjectSlug) {
    const subject = data.subjects[subjectSlug]
    if (!subject) return JSON.stringify({ error: 'Subject not found' }, null, 2)
    
    return JSON.stringify({
      version: data.version,
      exportDate: new Date().toISOString(),
      subject
    }, null, 2)
  }
  
  return JSON.stringify(data, null, 2)
}

/**
 * Import notes from JSON
 */
export function importNotes(jsonData: string, subjectSlug?: string): boolean {
  try {
    const importedData = JSON.parse(jsonData)
    const currentData = loadUserNotes()
    
    createBackup() // Backup before import
    
    if (subjectSlug && importedData.subject) {
      // Import single subject
      currentData.subjects[subjectSlug] = importedData.subject
    } else if (importedData.subjects) {
      // Import all subjects
      currentData.subjects = {
        ...currentData.subjects,
        ...importedData.subjects
      }
    } else {
      return false
    }
    
    return saveUserNotes(currentData)
  } catch (error) {
    console.error('Error importing notes:', error)
    return false
  }
}

// ============================================================================
// MIGRATION FROM OLD FORMAT
// ============================================================================

/**
 * Migrate notes from old localStorage format to new hierarchical format
 */
export function migrateFromOldFormat(): boolean {
  try {
    const data = loadUserNotes()
    const subjects = getAllSubjectsData()
    let migrated = false
    
    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        // Check old storage key
        const oldKey = `notty_notes_${subject.slug}_${topic.id}`
        const oldData = localStorage.getItem(oldKey)
        
        if (oldData) {
          const oldNotes = JSON.parse(oldData)
          
          // Ensure subject/topic exists in new format
          ensureSubjectExists(data, subject.slug, subject.title)
          ensureTopicExists(data.subjects[subject.slug], topic.id, topic.title)
          
          // Migrate notes
          data.subjects[subject.slug].topics[topic.id].notes = oldNotes.map((note: any) => ({
            id: note.id,
            title: note.title || 'Untitled Note',
            content: note.content,
            tags: note.tags || [],
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            metadata: calculateMetadata(note.content)
          }))
          
          migrated = true
          // Don't delete old data yet (for safety)
        }
      })
    })
    
    if (migrated) {
      Object.values(data.subjects).forEach(subject => {
        updateSubjectMetadata(subject)
      })
      saveUserNotes(data)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error migrating notes:', error)
    return false
  }
}
