'use client'

import { motion, AnimatePresence } from 'framer-motion'

// Icon Components
const KeyboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutGroup {
  title: string
  icon: string
  shortcuts: Array<{
    keys: string[]
    description: string
    context?: string
  }>
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Notes Management',
    icon: '📝',
    shortcuts: [
      {
        keys: ['Ctrl', 'N'],
        description: 'Create new note',
        context: 'From any topic page (prevents new tab)'
      },
      {
        keys: ['Ctrl', 'Shift', 'N'],
        description: 'Create new note (alternative)',
        context: 'If Ctrl+N doesn\'t work'
      },
      {
        keys: ['Ctrl', 'F'],
        description: 'Search notes',
        context: 'Opens search (overrides browser find)'
      },
      {
        keys: ['Ctrl', 'K'],
        description: 'Search notes (alternative)',
        context: 'Command palette style'
      },
      {
        keys: ['Ctrl', 'S'],
        description: 'Save note',
        context: 'In note editor'
      },
      {
        keys: ['Ctrl', 'P'],
        description: 'Toggle preview',
        context: 'In note editor'
      }
    ]
  },
  {
    title: 'Navigation',
    icon: '🧭',
    shortcuts: [
      {
        keys: ['Escape'],
        description: 'Close modal/dialog',
        context: 'In any modal'
      },
      {
        keys: ['?'],
        description: 'Show keyboard shortcuts',
        context: 'From anywhere'
      }
    ]
  },
  {
    title: 'Flashcards',
    icon: '🎴',
    shortcuts: [
      {
        keys: ['Space'],
        description: 'Flip card',
        context: 'In flashcard view'
      },
      {
        keys: ['1', '2', '3', '4'],
        description: 'Rate difficulty (Easy → Hard)',
        context: 'After flipping card'
      }
    ]
  },
  {
    title: 'Fullscreen Mode',
    icon: '🎯',
    shortcuts: [
      {
        keys: ['F11'],
        description: 'Toggle true fullscreen',
        context: 'Hides ALL OS UI (taskbar, window controls, etc.)'
      },
      {
        keys: ['Ctrl', 'Shift', 'F'],
        description: 'Toggle fullscreen (alternative)',
        context: 'Custom shortcut for fullscreen'
      },
      {
        keys: ['Escape'],
        description: 'Exit fullscreen',
        context: 'When in fullscreen mode'
      }
    ]
  },
  {
    title: 'General',
    icon: '⚡',
    shortcuts: [
      {
        keys: ['Ctrl', '/'],
        description: 'Quick search',
        context: 'Open search modal'
      }
    ]
  }
]

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null

  // Detect OS for displaying correct modifier key
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
  const modifierKey = isMac ? 'Cmd' : 'Ctrl'

  // Replace Ctrl with Cmd for Mac users
  const formatKey = (key: string) => {
    if (key === 'Ctrl' && isMac) return 'Cmd'
    return key
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(243,244,246,0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl">
                  <KeyboardIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Master these shortcuts to boost your productivity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* OS Indicator */}
            <div className="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm flex items-center gap-2">
              <span className="text-lg">{isMac ? '🍎' : '🪟'}</span>
              <span>
                Shortcuts shown for <strong>{isMac ? 'macOS' : 'Windows'}</strong>
                {isMac ? ' (Cmd = ⌘)' : ' (Ctrl = Control)'}
              </span>
            </div>
          </div>

          {/* Shortcuts Grid */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shortcutGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-3xl">{group.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {group.title}
                  </h3>
                </div>

                {/* Shortcuts List */}
                <div className="space-y-4">
                  {group.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="inline-flex items-center">
                              <kbd className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-900 dark:text-white shadow-sm">
                                {formatKey(key)}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-gray-400">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {shortcut.description}
                        </p>
                        {shortcut.context && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {shortcut.context}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Pro tip:</strong> Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">?</kbd> anytime to view this guide
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
