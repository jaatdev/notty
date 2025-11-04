import notes from '@/data/notes.json'
import type { Subject } from './types'

export function getAllSubjects(): Subject[] {
  return notes.subjects as Subject[]
}
export function getSubjectBySlug(slug: string): Subject | undefined {
  return getAllSubjects().find(s => s.slug === slug)
}
export function getAllSubjectSlugs(): string[] {
  return getAllSubjects().map(s => s.slug)
}