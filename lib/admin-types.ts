// ============================================================================
// ADMIN CONTENT MANAGEMENT TYPES
// Defines 7 box types for admin-created educational content
// ============================================================================

export type NoteBoxType =
  | 'big-notes'
  | 'small-notes'
  | 'right-wrong'
  | 'mnemonic-magic'
  | 'mnemonic-card'
  | 'container-notes'
  | 'quick-reference'
  | 'flashcard';

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
