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

export type BaseNode = {
  id: string
  kind: 'section' | 'markdown' | 'flashcards' | 'quiz'
  title?: string
  mnemonic?: string
  meta?: NodeMeta
}

export type SectionNode = BaseNode & {
  kind: 'section'
  children: Node[]
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

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  reason?: string
}

export type QuizNode = BaseNode & {
  kind: 'quiz'
  questions: QuizQuestion[]
}

export type Node = SectionNode | MarkdownNode | FlashcardsNode | QuizNode

export type Subject = {
  slug: string
  title: string
  description?: string
  brandColor?: 'emerald' | 'indigo' | 'blue' | 'red' | 'yellow'
  nodes: Node[]
}