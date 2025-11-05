/**
 * 🎨 THEME SELECTOR - World-Class Theme Switcher UI
 * Steps 29-30: Beautiful Theme Selection Interface
 * Visual theme picker with live preview
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { ThemeVariant, themeVariants } from '@/lib/theme-variants';

export function ThemeSelector() {
  const { currentTheme, setTheme, isDark, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: ThemeVariant[] = [
    'cyber-blue',
    'purple-dream',
    'neon-pink',
    'emerald-glow',
    'sunset-orange',
    'indigo-wave',
    'gradient-mix',
    'aurora',
    'matrix',
    'crystal',
    'nebula',
    'ivory',
  ];

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Change theme"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1300"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1400 w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Choose Your Theme</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Select a color theme that suits your style
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="mt-4 flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="font-medium">Dark Mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        isDark ? 'bg-blue-600' : 'bg-neutral-300'
                      }`}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: isDark ? 28 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>

                {/* Theme Grid */}
                <div className="p-6 overflow-y-auto max-h-96">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {themes.map((theme) => {
                      const style = themeVariants[theme];
                      const isSelected = currentTheme === theme;

                      return (
                        <motion.button
                          key={theme}
                          onClick={() => {
                            setTheme(theme);
                            setTimeout(() => setIsOpen(false), 300);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative p-4 rounded-xl transition-all ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
                              : 'hover:shadow-lg'
                          }`}
                          style={{
                            background: style.gradient,
                            boxShadow: isSelected ? `0 0 30px ${style.glow}` : undefined,
                          }}
                        >
                          {/* Selected Check */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}

                          {/* Theme Preview */}
                          <div className="h-20 rounded-lg bg-white/10 backdrop-blur-sm mb-3 flex items-center justify-center">
                            <div 
                              className="w-12 h-12 rounded-full"
                              style={{
                                background: `radial-gradient(circle, ${style.accent}, transparent)`,
                                boxShadow: `0 0 20px ${style.glow}`,
                              }}
                            />
                          </div>

                          {/* Theme Name */}
                          <p className="text-sm font-bold text-white text-center capitalize">
                            {theme.replace('-', ' ')}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Your theme preference is saved automatically
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact Theme Selector (for toolbar)
export function ThemeSelectorCompact() {
  const [mounted, setMounted] = useState(false);
  
  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg">
        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>
    );
  }
  
  return <ThemeSelectorCompactInner />;
}

function ThemeSelectorCompactInner() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: ThemeVariant[] = [
    'cyber-blue',
    'purple-dream',
    'neon-pink',
    'emerald-glow',
    'sunset-orange',
    'indigo-wave',
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Quick theme switch"
      >
        <div 
          className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900"
          style={{ background: themeVariants[currentTheme].gradient }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-1000"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 z-1100"
            >
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => {
                  const style = themeVariants[theme];
                  const isSelected = currentTheme === theme;

                  return (
                    <motion.button
                      key={theme}
                      onClick={() => {
                        setTheme(theme);
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        isSelected ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{
                        background: style.gradient,
                        boxShadow: isSelected ? `0 0 15px ${style.glow}` : undefined,
                      }}
                      title={theme.replace('-', ' ')}
                    />
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
