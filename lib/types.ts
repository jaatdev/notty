// ============================================================================
// NOTTY TYPE DEFINITIONS - NEW HIERARCHICAL STRUCTURE
// Subject -> Topic -> SubTopic (recursive)
// ============================================================================

import type { BrandKey } from './brand'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed'

export type RefType = 'case' | 'article' | 'act' | 'doctrine' | 'book' | 'link'

export type Reference = {
  type?: RefType
  label: string
  url?: string
}

export type NodeMeta = {
  tags?: string[]
  difficulty?: Difficulty
  updatedAt?: string   // ISO date
  refs?: Reference[]
}

// ============================================================================
// CONTENT NODES (Building blocks for topic content)
// ============================================================================

export type BaseNode = {
  id: string
  kind: 'markdown' | 'flashcards'
  title?: string
  mnemonic?: string
  meta?: NodeMeta
}

export type MarkdownNode = BaseNode & {
  kind: 'markdown'
  body: string
}

export type Flashcard = {
  front: string
  back: string
  hint?: string
  mnemonic?: string
}

export type FlashcardsNode = BaseNode & {
  kind: 'flashcards'
  shuffle?: boolean
  cards: Flashcard[]
}

export type ContentNode = MarkdownNode | FlashcardsNode

// ============================================================================
// QUIZ QUESTIONS (Reusable across all levels)
// ============================================================================

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  reason?: string
  meta?: NodeMeta
}

// ============================================================================
// TOPIC HIERARCHY (Recursive structure)
// ============================================================================

export type Topic = {
  id: string
  title: string
  description?: string
  brandColor?: BrandKey
  
  // Content for THIS topic
  content: ContentNode[]
  
  // Quiz questions for THIS topic
  quiz: QuizQuestion[]
  
  // Nested sub-topics (recursive - unlimited depth)
  subTopics: Topic[]
}

// ============================================================================
// SUBJECT (Top-level container)
// ============================================================================

export type Subject = {
  slug: string
  title: string
  description: string
  emoji?: string
  brandColor: BrandKey
  
  // Top-level topics
  topics: Topic[]
}

// ============================================================================
// LEGACY TYPES (for backward compatibility with existing components)
// ============================================================================

export type SectionNode = {
  id: string
  kind: 'section'
  title?: string
  mnemonic?: string
  children: Node[]
  meta?: NodeMeta
}

export type QuizNode = {
  id: string
  kind: 'quiz'
  title?: string
  questions: QuizQuestion[]
  meta?: NodeMeta
}

export type Node = SectionNode | MarkdownNode | FlashcardsNode | QuizNode

// Re-export BrandKey for convenience
export type { BrandKey } from './brand'