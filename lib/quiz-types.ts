/**
 * 🎯 ADVANCED QUIZ TYPES - World-Class Quiz System
 * Steps 6-8: Quiz Type System (Best from Coder B + G)
 * Complete type safety for quiz functionality
 */

import { QuizQuestion } from './types';

// Quiz Question Status
export type QuestionStatus = 
  | 'not-answered' 
  | 'answered' 
  | 'marked' 
  | 'answered-marked'
  | 'skipped';

// Quiz State
export type QuizState = 'loading' | 'active' | 'paused' | 'finished' | 'reviewing';

// Quiz Mode
export type QuizMode = 
  | 'practice'      // Can see answers immediately
  | 'exam'          // Only see results at end
  | 'timed'         // With time limit
  | 'adaptive';     // Difficulty adjusts based on performance

// Single Question Attempt
export interface QuizAttemptState {
  question: QuizQuestion;
  status: QuestionStatus;
  selectedOptionId: string | null;
  timeSpent: number; // in seconds
  attempts: number;
  markedAt?: number; // timestamp
  answeredAt?: number; // timestamp
}

// Complete Quiz Session
export interface QuizSession {
  id: string;
  subjectSlug: string;
  topicId: string;
  mode: QuizMode;
  state: QuizState;
  questions: QuizAttemptState[];
  currentQuestionIndex: number;
  startedAt: number;
  finishedAt?: number;
  totalTimeLimit?: number; // in seconds
  timeRemaining?: number;
  score?: QuizScore;
  settings: QuizSettings;
}

// Quiz Settings
export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanations: boolean;
  allowReview: boolean;
  allowSkip: boolean;
  allowMarkForReview: boolean;
  negativeMarking: boolean;
  negativeMarkValue: number; // e.g., -0.25
  passingPercentage: number;
  questionsPerSession: number;
}

// Quiz Score/Results
export interface QuizScore {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  skipped: number;
  marked: number;
  percentage: number;
  passed: boolean;
  totalTimeSpent: number; // in seconds
  averageTimePerQuestion: number;
  breakdown: QuestionBreakdown[];
}

// Individual Question Result
export interface QuestionBreakdown {
  questionId: string;
  questionText: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  status: QuestionStatus;
  explanation?: string;
}

// Quiz Analytics
export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number;
  averageTimePerAttempt: number;
  strongTopics: string[];
  weakTopics: string[];
  improvementRate: number; // percentage
  lastAttemptDate: number;
}

// Quiz Progress Tracking
export interface QuizProgress {
  subjectSlug: string;
  topicId: string;
  totalQuestions: number;
  attemptedQuestions: number;
  masteredQuestions: number; // correctly answered 3+ times
  weakQuestions: number; // incorrectly answered 2+ times
  sessions: QuizSession[];
  analytics: QuizAnalytics;
}

// Timer State
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeElapsed: number; // in seconds
  timeRemaining?: number; // for timed quizzes
  warningThreshold: number; // seconds remaining to show warning
  criticalThreshold: number; // seconds remaining to show critical warning
}

// Quiz Navigation
export interface QuizNavigation {
  canGoNext: boolean;
  canGoPrevious: boolean;
  canSubmit: boolean;
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  skippedCount: number;
}

// Quiz Actions (for state management)
export type QuizAction =
  | { type: 'START_QUIZ'; payload: QuizSession }
  | { type: 'SELECT_OPTION'; payload: { questionIndex: number; optionId: string } }
  | { type: 'MARK_FOR_REVIEW'; payload: { questionIndex: number } }
  | { type: 'UNMARK_QUESTION'; payload: { questionIndex: number } }
  | { type: 'SKIP_QUESTION'; payload: { questionIndex: number } }
  | { type: 'CLEAR_ANSWER'; payload: { questionIndex: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_QUESTION'; payload: { index: number } }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'FINISH_QUIZ'; payload: QuizScore }
  | { type: 'UPDATE_TIMER'; payload: { elapsed: number; remaining?: number } }
  | { type: 'SAVE_PROGRESS' };

// Quiz Reducer State
export interface QuizReducerState {
  session: QuizSession | null;
  navigation: QuizNavigation;
  timer: TimerState;
  isLoading: boolean;
  error: string | null;
}

// Quiz Statistics for Display
export interface QuizStats {
  totalQuestions: number;
  answered: number;
  unanswered: number;
  marked: number;
  correct?: number; // Only available after submission
  incorrect?: number;
  accuracy?: number; // percentage
  timeSpent: number;
  averageTimePerQuestion: number;
}

// Question Difficulty (for adaptive quizzes)
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Extended Quiz Question with Metadata
export interface EnhancedQuizQuestion extends QuizQuestion {
  difficulty?: QuestionDifficulty;
  tags?: string[];
  timeLimit?: number; // seconds for this specific question
  points?: number; // custom scoring
  hint?: string;
  references?: string[];
}

// Quiz Template (for creating new quizzes)
export interface QuizTemplate {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  topicId: string;
  questions: EnhancedQuizQuestion[];
  settings: QuizSettings;
  estimatedDuration: number; // in minutes
  difficulty: QuestionDifficulty;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// Export utility type for question filter
export type QuestionFilter = {
  difficulty?: QuestionDifficulty[];
  tags?: string[];
  status?: QuestionStatus[];
  timeRange?: [number, number]; // min and max time spent
};
