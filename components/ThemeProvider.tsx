/**
 * 🎨 THEME PROVIDER - World-Class Theme Management
 * Steps 26-28: React Context for Theme Switching
 * Persistent theme selection with localStorage
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeVariant, getThemeStyle, ThemeStyle } from '@/lib/theme-variants';

interface ThemeContextValue {
  currentTheme: ThemeVariant;
  themeStyle: ThemeStyle;
  setTheme: (theme: ThemeVariant) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeVariant;
}

export function ThemeProvider({ children, defaultTheme = 'cyber-blue' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('notty-theme') as ThemeVariant;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('notty-dark-mode');
    if (savedDarkMode !== null) {
      setIsDark(savedDarkMode === 'true');
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('notty-theme', currentTheme);
  }, [currentTheme, mounted]);

  // Apply dark mode to document
  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('notty-dark-mode', isDark.toString());
  }, [isDark, mounted]);

  const setTheme = (theme: ThemeVariant) => {
    setCurrentTheme(theme);
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const themeStyle = getThemeStyle(currentTheme);

  const value: ThemeContextValue = {
    currentTheme,
    themeStyle,
    setTheme,
    isDark,
    toggleDarkMode,
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
