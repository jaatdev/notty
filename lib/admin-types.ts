// ============================================================================
// ADMIN CONTENT MANAGEMENT TYPES
// Defines 7 box types for admin-created educational content
// ============================================================================

export type NoteBoxType =
  // Content Presentation
  | 'big-notes'
  | 'small-notes'
  | 'container-notes'
  | 'rich-content'
  | 'story-box'
  | 'definition-box'
  | 'example-box'
  | 'summary-box'
  // Memory & Learning
  | 'mnemonic-magic'
  | 'mnemonic-card'
  | 'flashcard'
  | 'acronym-box'
  | 'analogy-box'
  | 'pattern-box'
  | 'memory-palace'
  // Assessment & Practice
  | 'right-wrong'
  | 'quiz-box'
  | 'case-study'
  | 'problem-solution'
  | 'practice-box'
  | 'challenge-box'
  // Reference & Quick Access
  | 'quick-reference'
  | 'formula-box'
  | 'timeline-box'
  | 'comparison-box'
  | 'checklist-box'
  // Visual & Interactive
  | 'diagram-box'
  | 'flowchart-box'
  | 'infographic-box'
  | 'gallery-box'
  // Special Purpose
  | 'warning-box'
  | 'tip-box'
  | 'quote-box';

export interface NoteBox {
  id: string;
  type: NoteBoxType;
  title: string;
  content: Record<string, any>;
  themeId: string;       // key to the theme registry
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// BIG NOTES - Large formatted content blocks
// ============================================================================
export interface BigNotesContent {
  heading: string;
  body: string;
  highlights?: string[];
}

// ============================================================================
// SMALL NOTES - Compact bullet-point lists
// ============================================================================
export interface SmallNotesContent {
  title: string;
  points: string[];
}

// ============================================================================
// RIGHT/WRONG - True/False statement verification
// ============================================================================
export interface RightWrongEntry {
  id: string;
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface RightWrongContent {
  title?: string;
  statements: RightWrongEntry[];
}

// ============================================================================
// MNEMONIC MAGIC - Memory aids with breakdown
// ============================================================================
export interface MnemonicBreakdownItem {
  letter: string;
  word: string;
  meaning: string;
}

export interface MnemonicMagicContent {
  title?: string;
  mnemonic: string;
  breakdown: MnemonicBreakdownItem[];
}

// ============================================================================
// MNEMONIC CARD - Term cards with dates/facts
// ============================================================================
export interface MnemonicCardItem {
  id: string;
  term: string;
  definition: string;
  date?: string;
  facts?: string[];
}

export interface MnemonicCardContent {
  title?: string;
  mnemonic?: string;
  items: MnemonicCardItem[];
}

// ============================================================================
// CONTAINER NOTES - Multi-section organized content
// ============================================================================
export interface ContainerSection {
  id: string;
  heading: string;
  content: string;
}

export interface ContainerNotesContent {
  title?: string;
  sections: ContainerSection[];
}

// ============================================================================
// QUICK REFERENCE - Fast fact lookup
// ============================================================================
export interface QuickReferenceItem {
  id: string;
  label: string;
  value: string;
}

export interface QuickReferenceContent {
  title?: string;
  facts: QuickReferenceItem[];
}

// ============================================================================
// FLASHCARD - Q&A cards for spaced repetition
// ============================================================================
export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface FlashcardContent {
  title?: string;
  cards: FlashcardItem[];
}

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================

export function isBigNotesContent(content: any): content is BigNotesContent {
  return content && typeof content.heading === 'string' && typeof content.body === 'string';
}

export function isSmallNotesContent(content: any): content is SmallNotesContent {
  return content && typeof content.title === 'string' && Array.isArray(content.points);
}

export function isRightWrongContent(content: any): content is RightWrongContent {
  return content && Array.isArray(content.statements);
}

export function isMnemonicMagicContent(content: any): content is MnemonicMagicContent {
  return content && typeof content.mnemonic === 'string' && Array.isArray(content.breakdown);
}

export function isMnemonicCardContent(content: any): content is MnemonicCardContent {
  return content && Array.isArray(content.items);
}

export function isContainerNotesContent(content: any): content is ContainerNotesContent {
  return content && Array.isArray(content.sections);
}

export function isQuickReferenceContent(content: any): content is QuickReferenceContent {
  return content && Array.isArray(content.facts);
}

export function isFlashcardContent(content: any): content is FlashcardContent {
  return content && Array.isArray(content.cards);
}

// ============================================================================
// NEW BOX TYPES - Extended Content Types
// ============================================================================

// RICH CONTENT
export interface RichContentData {
  title: string;
  content: string;
  images?: Array<{url: string; caption: string}>;
}

// STORY BOX
export interface StoryBoxContent {
  title: string;
  story: string;
  moral?: string;
  image?: string;
}

// DEFINITION BOX
export interface DefinitionBoxContent {
  term: string;
  definition: string;
  examples: string[];
  etymology?: string;
}

// EXAMPLE BOX
export interface ExampleBoxContent {
  title: string;
  examples: Array<{title: string; description: string; code?: string}>;
}

// SUMMARY BOX
export interface SummaryBoxContent {
  title: string;
  points: string[];
  keyTakeaway: string;
}

// ACRONYM BOX
export interface AcronymBoxContent {
  acronym: string;
  fullForm: string;
  breakdown: Array<{letter: string; word: string; meaning: string}>;
}

// ANALOGY BOX
export interface AnalogyBoxContent {
  concept: string;
  analogy: string;
  explanation: string;
  image?: string;
}

// PATTERN BOX
export interface PatternBoxContent {
  title: string;
  pattern: string;
  examples: string[];
  rule: string;
}

// MEMORY PALACE
export interface MemoryPalaceContent {
  title: string;
  locations: Array<{place: string; item: string; image?: string}>;
}

// QUIZ BOX
export interface QuizBoxContent {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

// CASE STUDY
export interface CaseStudyContent {
  title: string;
  scenario: string;
  analysis: string;
  outcome: string;
  lessons: string[];
}

// PROBLEM SOLUTION
export interface ProblemSolutionContent {
  problem: string;
  approach: string;
  steps: string[];
  solution: string;
  verification?: string;
}

// PRACTICE BOX
export interface PracticeBoxContent {
  title: string;
  problems: Array<{
    id: string;
    question: string;
    difficulty: 'easy' | 'medium' | 'hard';
    hint?: string;
  }>;
}

// CHALLENGE BOX
export interface ChallengeBoxContent {
  title: string;
  challenge: string;
  difficulty: number;
  timeLimit?: string;
  reward?: string;
}

// FORMULA BOX
export interface FormulaBoxContent {
  name: string;
  formula: string;
  variables: Array<{symbol: string; meaning: string}>;
  example?: string;
}

// TIMELINE BOX
export interface TimelineBoxContent {
  title: string;
  events: Array<{
    date: string;
    event: string;
    description?: string;
    image?: string;
  }>;
}

// COMPARISON BOX
export interface ComparisonBoxContent {
  title: string;
  items: Array<{name: string; features: string[]}>;
  conclusion?: string;
}

// CHECKLIST BOX
export interface ChecklistBoxContent {
  title: string;
  items: Array<{text: string; completed?: boolean; note?: string}>;
}

// DIAGRAM BOX
export interface DiagramBoxContent {
  title: string;
  imageUrl: string;
  annotations: Array<{label: string; description: string}>;
}

// FLOWCHART BOX
export interface FlowchartBoxContent {
  title: string;
  steps: Array<{
    id: string;
    type: 'start' | 'process' | 'decision' | 'end';
    text: string;
    next?: string[];
  }>;
}

// INFOGRAPHIC BOX
export interface InfographicBoxContent {
  title: string;
  imageUrl: string;
  dataPoints: Array<{label: string; value: string}>;
}

// GALLERY BOX
export interface GalleryBoxContent {
  title: string;
  images: Array<{url: string; caption: string; description?: string}>;
}

// WARNING BOX
export interface WarningBoxContent {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
}

// TIP BOX
export interface TipBoxContent {
  title: string;
  tip: string;
  category?: string;
  icon?: string;
}

// QUOTE BOX
export interface QuoteBoxContent {
  quote: string;
  author: string;
  context?: string;
  image?: string;
}
