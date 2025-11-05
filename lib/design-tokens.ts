/**
 * 🎨 NOTTY DESIGN TOKENS - World-Class Design System
 * Central source of truth for all design decisions
 * Step 1-2: Design Token System (from Coder H)
 */

export const designTokens = {
  // Color Palettes
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      purple: '#a855f7',
      pink: '#ec4899',
      orange: '#f97316',
      green: '#10b981',
      yellow: '#fbbf24',
      red: '#ef4444',
      cyan: '#06b6d4',
      indigo: '#6366f1',
      emerald: '#10b981',
      teal: '#14b8a6',
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    dark: {
      bg: {
        primary: '#0a0a0f',
        secondary: '#13131a',
        tertiary: '#1a1a24',
      },
      border: 'rgba(255, 255, 255, 0.08)',
      text: {
        primary: '#ffffff',
        secondary: '#a1a1aa',
        tertiary: '#71717a',
      },
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.05)',
      dark: 'rgba(0, 0, 0, 0.1)',
    },
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    danger: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    sunset: 'linear-gradient(135deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    aurora: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    cyber: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    neon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },

  // Spacing (rem)
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  // Border Radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: {
      primary: '0 0 20px rgba(14, 165, 233, 0.3)',
      accent: '0 0 30px rgba(168, 85, 247, 0.4)',
      success: '0 0 20px rgba(16, 185, 129, 0.3)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      display: "'Orbitron', 'Inter', sans-serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type DesignTokens = typeof designTokens;
