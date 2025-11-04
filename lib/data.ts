// ============================================================================
// DATA LOADING UTILITIES
// Functions to load and traverse the hierarchical subject data structure
// ============================================================================

import notes from '@/data/notes.json'
import type { Subject, Topic, QuizQuestion } from './types'
import { allSubjectsConfig, type SubjectConfig } from './subjects.config'

/**
 * Get the master list of all subject configurations
 */
export function getAllSubjectConfigs(): SubjectConfig[] {
  return allSubjectsConfig
}

/**
 * Load all subjects data from notes.json
 */
export function getAllSubjectsData(): Subject[] {
  return (notes.subjects as Subject[]) || []
}

/**
 * Get a single subject's data by slug
 */
export function getSubjectData(slug: string): Subject | null {
  const subjects = getAllSubjectsData()
  return subjects.find(s => s.slug === slug) || null
}

// Legacy function names for backward compatibility
export function getAllSubjects(): Subject[] {
  return getAllSubjectsData()
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return getSubjectData(slug) || undefined
}

export function getAllSubjectSlugs(): string[] {
  return getAllSubjects().map(s => s.slug)
}

/**
 * Recursively find a topic/subtopic by following a path array
 * @param subject The subject containing topics
 * @param path Array of topic IDs (e.g., ['preamble', 'pillars'])
 * @returns The found topic or null
 */
export function findTopicByPath(subject: Subject, path: string[]): Topic | null {
  if (!path || path.length === 0) {
    return null
  }

  let currentTopics: Topic[] = subject.topics || []
  let foundTopic: Topic | null = null

  for (const segment of path) {
    const topic = currentTopics.find(t => t.id === segment)
    if (topic) {
      foundTopic = topic
      currentTopics = topic.subTopics || []
    } else {
      return null // Path segment not found
    }
  }

  return foundTopic
}

/**
 * Recursively collect all quiz questions from a topic and its nested subtopics
 * @param topic The topic to collect questions from
 * @returns Array of all questions
 */
export function collectQuizQuestions(topic: Topic): QuizQuestion[] {
  let questions: QuizQuestion[] = [...(topic.quiz || [])]

  if (topic.subTopics && topic.subTopics.length > 0) {
    for (const subTopic of topic.subTopics) {
      questions = [...questions, ...collectQuizQuestions(subTopic)]
    }
  }

  return questions
}

/**
 * Collect all quiz questions from entire subject (all topics and subtopics)
 */
export function collectAllQuizQuestions(subject: Subject): QuizQuestion[] {
  let questions: QuizQuestion[] = []

  if (!subject.topics) return questions

  for (const topic of subject.topics) {
    questions = [...questions, ...collectQuizQuestions(topic)]
  }

  return questions
}

/**
 * Shuffle array and return first n items (for random quiz selection)
 */
export function sampleRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

/**
 * Build breadcrumb path for a topic
 * @param subject The subject
 * @param topicPath Array of topic IDs
 * @returns Array of { id, title, path } objects for breadcrumb
 */
export function buildBreadcrumb(
  subject: Subject,
  topicPath: string[]
): Array<{ id: string; title: string; path: string[] }> {
  const breadcrumbs: Array<{ id: string; title: string; path: string[] }> = []

  let currentTopics = subject.topics || []
  const accumulatedPath: string[] = []

  for (const segment of topicPath) {
    const topic = currentTopics.find(t => t.id === segment)
    if (topic) {
      accumulatedPath.push(segment)
      breadcrumbs.push({
        id: topic.id,
        title: topic.title,
        path: [...accumulatedPath]
      })
      currentTopics = topic.subTopics || []
    }
  }

  return breadcrumbs
}

/**
 * Get table of contents for a topic (all content nodes)
 */
export function getTopicTOC(topic: Topic): Array<{ id: string; title: string }> {
  return (topic.content || []).map(node => ({
    id: node.id,
    title: node.title || 'Untitled'
  }))
}

/**
 * Recursively get all topics and subtopics as flat list
 */
export function flattenTopics(topics: Topic[], parentPath: string[] = []): Array<{
  id: string
  title: string
  path: string[]
  depth: number
}> {
  const result: Array<{ id: string; title: string; path: string[]; depth: number }> = []

  for (const topic of topics) {
    const currentPath = [...parentPath, topic.id]
    result.push({
      id: topic.id,
      title: topic.title,
      path: currentPath,
      depth: parentPath.length
    })

    if (topic.subTopics && topic.subTopics.length > 0) {
      result.push(...flattenTopics(topic.subTopics, currentPath))
    }
  }

  return result
}