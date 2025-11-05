/**
 * 🎨 THEME VARIANTS - Ultra-Modern Style System
 * Steps 3-5: Theme Variant System (Best from Coder A + H)
 * Deterministic, accessible, and infinitely scalable
 */

import { designTokens } from './design-tokens';

export type ThemeVariant = 
  | 'cyber-blue'
  | 'purple-dream'
  | 'neon-pink'
  | 'emerald-glow'
  | 'sunset-orange'
  | 'indigo-wave'
  | 'gradient-mix'
  | 'aurora'
  | 'matrix'
  | 'crystal'
  | 'nebula'
  | 'ivory';

export interface ThemeStyle {
  name: ThemeVariant;
  gradient: string;
  blur: string;
  glow: string;
  accent: string;
  secondary: string;
  borderColor: string;
  textColor: string;
  description: string;
}

// Comprehensive theme definitions
export const themeVariants: Record<ThemeVariant, ThemeStyle> = {
  'cyber-blue': {
    name: 'cyber-blue',
    gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    blur: 'blur(20px)',
    glow: '0 0 30px rgba(14, 165, 233, 0.3)',
    accent: '#0ea5e9',
    secondary: '#06b6d4',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    textColor: '#bae6fd',
    description: 'Futuristic tech aesthetic with electric blue tones',
  },
  'purple-dream': {
    name: 'purple-dream',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
    blur: 'blur(18px)',
    glow: '0 0 25px rgba(168, 85, 247, 0.4)',
    accent: '#a855f7',
    secondary: '#6366f1',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    textColor: '#d8b4fe',
    description: 'Mystical and creative with purple gradients',
  },
  'neon-pink': {
    name: 'neon-pink',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
    blur: 'blur(16px)',
    glow: '0 0 28px rgba(236, 72, 153, 0.35)',
    accent: '#ec4899',
    secondary: '#ef4444',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    textColor: '#fbcfe8',
    description: 'Bold and energetic with vibrant pink highlights',
  },
  'emerald-glow': {
    name: 'emerald-glow',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    blur: 'blur(22px)',
    glow: '0 0 32px rgba(16, 185, 129, 0.3)',
    accent: '#10b981',
    secondary: '#06b6d4',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#6ee7b7',
    description: 'Natural and fresh with emerald green tones',
  },
  'sunset-orange': {
    name: 'sunset-orange',
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
    blur: 'blur(15px)',
    glow: '0 0 26px rgba(249, 115, 22, 0.3)',
    accent: '#f97316',
    secondary: '#fbbf24',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    textColor: '#fdba74',
    description: 'Warm and inviting with sunset orange hues',
  },
  'indigo-wave': {
    name: 'indigo-wave',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
    blur: 'blur(19px)',
    glow: '0 0 24px rgba(99, 102, 241, 0.3)',
    accent: '#6366f1',
    secondary: '#0ea5e9',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    textColor: '#c7d2fe',
    description: 'Professional and calm with indigo waves',
  },
  'gradient-mix': {
    name: 'gradient-mix',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(14, 165, 233, 0.05) 100%)',
    blur: 'blur(24px)',
    glow: '0 0 35px rgba(168, 85, 247, 0.25)',
    accent: '#ec4899',
    secondary: '#a855f7',
    borderColor: 'linear-gradient(135deg, #ec4899, #a855f7, #0ea5e9)',
    textColor: '#e9d5ff',
    description: 'Multidimensional with rainbow gradients',
  },
  'aurora': {
    name: 'aurora',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(168, 85, 247, 0.08) 100%)',
    blur: 'blur(21px)',
    glow: '0 0 30px rgba(16, 185, 129, 0.2)',
    accent: '#10b981',
    secondary: '#0ea5e9',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#86efac',
    description: 'Magical northern lights effect',
  },
  'matrix': {
    name: 'matrix',
    gradient: 'linear-gradient(120deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    blur: 'blur(12px)',
    glow: '0 0 22px rgba(0, 255, 138, 0.3)',
    accent: '#00ff8a',
    secondary: '#302b63',
    borderColor: 'rgba(0, 255, 138, 0.3)',
    textColor: '#a7f3d0',
    description: 'Hacker-style green on dark matrix theme',
  },
  'crystal': {
    name: 'crystal',
    gradient: 'linear-gradient(120deg, #8e2de2 0%, #4a00e0 100%)',
    blur: 'blur(15px)',
    glow: '0 0 20px rgba(142, 45, 226, 0.3)',
    accent: '#8e2de2',
    secondary: '#4a00e0',
    borderColor: 'rgba(142, 45, 226, 0.3)',
    textColor: '#d8b4fe',
    description: 'Crystalline clarity with deep purple',
  },
  'nebula': {
    name: 'nebula',
    gradient: 'linear-gradient(120deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    blur: 'blur(17px)',
    glow: '0 0 25px rgba(255, 195, 113, 0.2)',
    accent: '#203a43',
    secondary: '#2c5364',
    borderColor: 'rgba(255, 195, 113, 0.3)',
    textColor: '#ffc371',
    description: 'Deep space nebula with cosmic feel',
  },
  'ivory': {
    name: 'ivory',
    gradient: 'linear-gradient(120deg, #3E5151 0%, #DECBA4 100%)',
    blur: 'blur(10px)',
    glow: '0 0 15px rgba(222, 203, 164, 0.2)',
    accent: '#DECBA4',
    secondary: '#3E5151',
    borderColor: 'rgba(222, 203, 164, 0.3)',
    textColor: '#f5f5f4',
    description: 'Elegant academic ivory and sage',
  },
};

/**
 * Hash function for deterministic variant selection
 * Always returns the same variant for the same ID
 */
function hashString(str: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

/**
 * Get deterministic theme variant based on ID
 * Same ID = Same theme always
 */
export function getThemeVariant(id: string): ThemeVariant {
  const variants = Object.keys(themeVariants) as ThemeVariant[];
  const index = hashString(id) % variants.length;
  return variants[index];
}

/**
 * Get theme style object
 */
export function getThemeStyle(variant: ThemeVariant): ThemeStyle {
  return themeVariants[variant];
}

/**
 * Get theme by ID (convenience function)
 */
export function getThemeById(id: string): ThemeStyle {
  const variant = getThemeVariant(id);
  return themeVariants[variant];
}

/**
 * Check if text is readable on background (WCAG AA)
 */
export function getReadableTextColor(bgHex: string): string {
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const luminance = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  const L = 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);
  
  return L > 0.5 ? '#0b0b0b' : '#ffffff';
}

/**
 * Generate CSS variables for a theme
 */
export function generateThemeVars(variant: ThemeVariant): Record<string, string> {
  const theme = themeVariants[variant];
  
  return {
    '--theme-gradient': theme.gradient,
    '--theme-blur': theme.blur,
    '--theme-glow': theme.glow,
    '--theme-accent': theme.accent,
    '--theme-secondary': theme.secondary,
    '--theme-border': theme.borderColor,
    '--theme-text': theme.textColor,
  };
}
