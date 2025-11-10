// lib/published-notes-helper.ts
// Helper functions to check and display published status of notes

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

/**
 * Generate a note_key from hierarchy
 * Format: subject-slug-topic-id-subtopic-id or subject-slug-topic-id
 */
export function generateNoteKey(
  subjectSlug: string,
  topicId: string,
  subtopicId?: string,
  noteIndex?: number
): string {
  if (subtopicId && noteIndex !== undefined) {
    return `${subjectSlug}-${topicId}-${subtopicId}-${noteIndex}`
  }
  if (subtopicId) {
    return `${subjectSlug}-${topicId}-${subtopicId}`
  }
  return `${subjectSlug}-${topicId}`
}

/**
 * Check if a note is published in the published_notes table
 * Returns the published note metadata if found, null otherwise
 */
export async function getPublishedNoteStatus(
  subjectSlug: string,
  topicId: string,
  subtopicId?: string,
  noteIndex?: number
): Promise<{
  isPublished: boolean
  publishedAt?: string
  viewCount?: number
} | null> {
  try {
    const noteKey = generateNoteKey(subjectSlug, topicId, subtopicId, noteIndex)
    
    const { data, error } = await supabase
      .from('published_notes')
      .select('published_at, view_count')
      .eq('note_key', noteKey)
      .single()
    
    if (error) {
      // No published note found
      return { isPublished: false }
    }
    
    return {
      isPublished: true,
      publishedAt: data?.published_at,
      viewCount: data?.view_count || 0
    }
  } catch (err) {
    console.error('Error checking published status:', err)
    return null
  }
}

/**
 * Batch check multiple notes for published status
 * Returns map of note_key -> published status
 */
export async function checkMultipleNotesPublished(
  noteKeys: string[]
): Promise<Record<string, boolean>> {
  try {
    const { data, error } = await supabase
      .from('published_notes')
      .select('note_key')
      .in('note_key', noteKeys)
    
    if (error) {
      console.error('Error checking published notes:', error)
      return {}
    }
    
    const publishedSet = new Set(data?.map((n: any) => n.note_key) || [])
    
    return Object.fromEntries(
      noteKeys.map(key => [key, publishedSet.has(key)])
    )
  } catch (err) {
    console.error('Error in batch check:', err)
    return {}
  }
}

/**
 * Get all published notes for a specific topic/subtopic
 */
export async function getPublishedNotesForLocation(
  subjectSlug: string,
  topicId: string,
  subtopicId?: string
): Promise<string[]> {
  try {
    let query = supabase
      .from('published_notes')
      .select('note_key')
      .eq('subject_slug', subjectSlug)
      .eq('topic_id', topicId)
    
    if (subtopicId) {
      query = query.eq('subtopic_id', subtopicId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching published notes:', error)
      return []
    }
    
    return data?.map((n: any) => n.note_key) || []
  } catch (err) {
    console.error('Error fetching published notes for location:', err)
    return []
  }
}
