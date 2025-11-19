'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThemeById } from '@/lib/theme-variants';

interface QuizAttempt {
  questionId: string;
  prompt: string;
  options: string[];
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  reason?: string;
  status: string;
  timeSpent?: number;
}

interface QuizReviewProps {
  attempts: QuizAttempt[];
  score: {
    correct: number;
    incorrect: number;
    unanswered: number;
    percentage: number;
    passed: boolean;
  };
  topicId: string;
  onClose: () => void;
}

export function QuizReview({ attempts, score, topicId, onClose }: QuizReviewProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const theme = getThemeById(topicId);

  // Filter attempts based on selected status
  const filteredAttempts = attempts.filter((attempt) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'correct') return attempt.isCorrect;
    if (filterStatus === 'incorrect') return !attempt.isCorrect && attempt.status !== 'skipped';
    if (filterStatus === 'skipped') return attempt.status === 'skipped';
    return true;
  });

  const correctCount = attempts.filter(a => a.isCorrect).length;
  const incorrectCount = attempts.filter(a => !a.isCorrect && a.status !== 'skipped').length;
  const skippedCount = attempts.filter(a => a.status === 'skipped').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 md:p-6">
      {/* Header */
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">📊 Quiz Review</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Score Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border-l-4 border-l-green-500"
          >
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">✓ Correct</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
            <div className="text-xs text-neutral-500 mt-1">{Math.round((correctCount / attempts.length) * 100)}%</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border-l-4 border-l-red-500"
          >
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">✗ Incorrect</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</div>
            <div className="text-xs text-neutral-500 mt-1">{Math.round((incorrectCount / attempts.length) * 100)}%</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border-l-4 border-l-neutral-400"
          >
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">⊘ Skipped</div>
            <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{skippedCount}</div>
            <div className="text-xs text-neutral-500 mt-1">{Math.round((skippedCount / attempts.length) * 100)}%</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm"
            style={{ borderLeftColor: theme.accent, borderLeftWidth: 4 }}
          >
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">📈 Score</div>
            <div className="text-2xl font-bold" style={{ color: theme.accent }}>
              {Math.round(score.percentage)}%
            </div>
            <div className="text-xs text-neutral-500 mt-1">{score.passed ? '✓ Passed' : '✗ Needs Work'}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-2"
      >
        {(['all', 'correct', 'incorrect', 'skipped'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'text-white shadow-lg'
                : 'bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
            style={
              filterStatus === status
                ? { background: theme.gradient }
                : undefined
            }
          >
            {status === 'all' && `All Questions (${attempts.length})`}
            {status === 'correct' && `✓ Correct (${correctCount})`}
            {status === 'incorrect' && `✗ Incorrect (${incorrectCount})`}
            {status === 'skipped' && `⊘ Skipped (${skippedCount})`}
          </button>
        ))}
      </motion.div>

      {/* Questions List */}
      <div className="max-w-4xl mx-auto space-y-3">
        <AnimatePresence>
          {filteredAttempts.map((attempt, index) => {
            const isExpanded = expandedQuestion === attempt.questionId;
            const correctAnswer = attempt.options[parseInt(attempt.correctOptionId)];
            const selectedAnswer = attempt.selectedOptionId
              ? attempt.options[parseInt(attempt.selectedOptionId)]
              : null;

            return (
              <motion.div
                key={attempt.questionId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-neutral-900 rounded-xl shadow-sm border-l-4 overflow-hidden ${
                  attempt.isCorrect
                    ? 'border-l-green-500'
                    : attempt.status === 'skipped'
                      ? 'border-l-neutral-400'
                      : 'border-l-red-500'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : attempt.questionId)}
                  className="w-full p-4 md:p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-neutral-500">
                          Q{attempts.indexOf(attempt) + 1}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attempt.isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : attempt.status === 'skipped'
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {attempt.isCorrect ? '✓ Correct' : attempt.status === 'skipped' ? '⊘ Skipped' : '✗ Wrong'}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                        {attempt.prompt}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-neutral-200 dark:border-neutral-800"
                    >
                      <div className="p-4 md:p-5 space-y-4">
                        {/* Your Answer */}
                        <div>
                          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                            Your Answer
                          </div>
                          <div className={`p-3 rounded-lg border-2 ${
                            attempt.status === 'skipped'
                              ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 text-neutral-500'
                              : attempt.isCorrect
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                          }`}>
                            {attempt.status === 'skipped' ? (
                              <p className="text-sm font-medium">Not Answered</p>
                            ) : (
                              <p className="text-sm font-medium">{selectedAnswer}</p>
                            )}
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!attempt.isCorrect && (
                          <div>
                            <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 uppercase tracking-wider">
                              ✓ Correct Answer
                            </div>
                            <div className="p-3 rounded-lg border-2 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
                              <p className="text-sm font-medium text-green-900 dark:text-green-100">{correctAnswer}</p>
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        {attempt.reason && (
                          <div>
                            <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                              📖 Explanation
                            </div>
                            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                {attempt.reason}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* All Options */}
                        <div>
                          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                            All Options
                          </div>
                          <div className="space-y-2">
                            {attempt.options.map((option, optIndex) => {
                              const isCorrectOption = optIndex.toString() === attempt.correctOptionId;
                              const isSelectedOption = optIndex.toString() === attempt.selectedOptionId;

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    isCorrectOption
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                                      : isSelectedOption
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                                        : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                                >`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isCorrectOption
                                        ? 'bg-green-500 text-white'
                                        : isSelectedOption
                                          ? 'bg-red-500 text-white'
                                          : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300'
                                    }`}>
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                    <p className="text-sm flex-1">{option}</p>
                                    {isCorrectOption && <span className="text-green-600 dark:text-green-400 font-bold">✓</span>}
                                    {isSelectedOption && !isCorrectOption && <span className="text-red-600 dark:text-red-400 font-bold">✗</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto mt-8 flex gap-3"
      >
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all hover:shadow-lg"
          style={{ background: theme.gradient }}
        >
          Back to Quiz
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Back to Topic
        </button>
      </motion.div>
    </div>
  );
}
