// ============================================================================
// ADMIN THEME REGISTRY
// Theme catalog for all 7 box types with Tailwind-based styling
// ============================================================================

export interface BoxTheme {
  id: string;            // unique key (used in NoteBox.themeId)
  name: string;          // human label
  gradient: string;      // tailwind gradient classes or CSS
  textColor: string;     // tailwind text color class
  accentColor: string;   // tailwind bg class for accents
  borderColor: string;
  recommendedFor?: string[]; // e.g. ['big-notes','mnemonic-magic']
}

// ============================================================================
// THEME COLLECTIONS BY BOX TYPE
// ============================================================================

export const boxThemes: Record<string, BoxTheme[]> = {
  'big-notes': [
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      gradient: 'from-blue-50 to-cyan-50',
      textColor: 'text-slate-900',
      accentColor: 'bg-blue-600',
      borderColor: 'border-blue-200',
      recommendedFor: ['big-notes'],
    },
    {
      id: 'sunset-amber',
      name: 'Sunset Amber',
      gradient: 'from-orange-50 to-amber-50',
      textColor: 'text-amber-900',
      accentColor: 'bg-amber-600',
      borderColor: 'border-amber-200',
      recommendedFor: ['big-notes'],
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      gradient: 'from-green-50 to-emerald-50',
      textColor: 'text-green-900',
      accentColor: 'bg-green-600',
      borderColor: 'border-green-200',
      recommendedFor: ['big-notes'],
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      gradient: 'from-purple-50 to-violet-50',
      textColor: 'text-purple-900',
      accentColor: 'bg-purple-600',
      borderColor: 'border-purple-200',
      recommendedFor: ['big-notes'],
    },
  ],

  'small-notes': [
    {
      id: 'mint',
      name: 'Mint Fresh',
      gradient: 'from-teal-50 to-emerald-50',
      textColor: 'text-emerald-900',
      accentColor: 'bg-emerald-600',
      borderColor: 'border-emerald-200',
      recommendedFor: ['small-notes'],
    },
    {
      id: 'coral',
      name: 'Coral Pink',
      gradient: 'from-pink-50 to-rose-50',
      textColor: 'text-rose-900',
      accentColor: 'bg-rose-600',
      borderColor: 'border-rose-200',
      recommendedFor: ['small-notes'],
    },
    {
      id: 'lavender',
      name: 'Lavender',
      gradient: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-900',
      accentColor: 'bg-indigo-600',
      borderColor: 'border-indigo-200',
      recommendedFor: ['small-notes'],
    },
  ],

  'right-wrong': [
    {
      id: 'truth-clarity',
      name: 'Truth & Clarity',
      gradient: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-900',
      accentColor: 'bg-blue-600',
      borderColor: 'border-blue-200',
      recommendedFor: ['right-wrong'],
    },
    {
      id: 'fact-checker',
      name: 'Fact Checker',
      gradient: 'from-gray-50 to-slate-50',
      textColor: 'text-slate-900',
      accentColor: 'bg-slate-600',
      borderColor: 'border-slate-200',
      recommendedFor: ['right-wrong'],
    },
  ],

  'mnemonic-magic': [
    {
      id: 'magic-purple',
      name: 'Magic Purple',
      gradient: 'from-purple-100 via-pink-100 to-red-100',
      textColor: 'text-purple-900',
      accentColor: 'bg-purple-600',
      borderColor: 'border-purple-300',
      recommendedFor: ['mnemonic-magic', 'mnemonic-card'],
    },
    {
      id: 'memory-gold',
      name: 'Memory Gold',
      gradient: 'from-yellow-100 via-amber-100 to-orange-100',
      textColor: 'text-amber-900',
      accentColor: 'bg-amber-600',
      borderColor: 'border-amber-300',
      recommendedFor: ['mnemonic-magic'],
    },
    {
      id: 'rainbow-recall',
      name: 'Rainbow Recall',
      gradient: 'from-red-100 via-yellow-100 to-green-100',
      textColor: 'text-gray-900',
      accentColor: 'bg-rainbow',
      borderColor: 'border-rainbow-300',
      recommendedFor: ['mnemonic-magic'],
    },
  ],

  'mnemonic-card': [
    {
      id: 'card-sun',
      name: 'Card Sun',
      gradient: 'from-yellow-50 to-orange-50',
      textColor: 'text-yellow-900',
      accentColor: 'bg-yellow-600',
      borderColor: 'border-yellow-300',
      recommendedFor: ['mnemonic-card'],
    },
    {
      id: 'card-ocean',
      name: 'Card Ocean',
      gradient: 'from-cyan-50 to-blue-50',
      textColor: 'text-cyan-900',
      accentColor: 'bg-cyan-600',
      borderColor: 'border-cyan-300',
      recommendedFor: ['mnemonic-card'],
    },
    {
      id: 'card-earth',
      name: 'Card Earth',
      gradient: 'from-lime-50 to-green-50',
      textColor: 'text-lime-900',
      accentColor: 'bg-lime-600',
      borderColor: 'border-lime-300',
      recommendedFor: ['mnemonic-card'],
    },
  ],

  'container-notes': [
    {
      id: 'container-soft',
      name: 'Soft Container',
      gradient: 'from-gray-50 to-slate-50',
      textColor: 'text-gray-900',
      accentColor: 'bg-gray-600',
      borderColor: 'border-gray-200',
      recommendedFor: ['container-notes'],
    },
    {
      id: 'container-warm',
      name: 'Warm Container',
      gradient: 'from-orange-50 to-red-50',
      textColor: 'text-orange-900',
      accentColor: 'bg-orange-600',
      borderColor: 'border-orange-200',
      recommendedFor: ['container-notes'],
    },
    {
      id: 'container-cool',
      name: 'Cool Container',
      gradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-900',
      accentColor: 'bg-blue-600',
      borderColor: 'border-blue-200',
      recommendedFor: ['container-notes'],
    },
  ],

  'quick-reference': [
    {
      id: 'quick-sky',
      name: 'Quick Sky',
      gradient: 'from-sky-50 to-blue-50',
      textColor: 'text-sky-900',
      accentColor: 'bg-sky-600',
      borderColor: 'border-sky-300',
      recommendedFor: ['quick-reference'],
    },
    {
      id: 'quick-fire',
      name: 'Quick Fire',
      gradient: 'from-red-50 to-orange-50',
      textColor: 'text-red-900',
      accentColor: 'bg-red-600',
      borderColor: 'border-red-300',
      recommendedFor: ['quick-reference'],
    },
    {
      id: 'quick-mint',
      name: 'Quick Mint',
      gradient: 'from-teal-50 to-cyan-50',
      textColor: 'text-teal-900',
      accentColor: 'bg-teal-600',
      borderColor: 'border-teal-300',
      recommendedFor: ['quick-reference'],
    },
  ],

  'flashcard': [
    {
      id: 'flash-neutral',
      name: 'Flash Neutral',
      gradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      accentColor: 'bg-gray-700',
      borderColor: 'border-gray-200',
      recommendedFor: ['flashcard'],
    },
    {
      id: 'flash-classic',
      name: 'Flash Classic',
      gradient: 'from-amber-50 to-yellow-50',
      textColor: 'text-amber-900',
      accentColor: 'bg-amber-700',
      borderColor: 'border-amber-200',
      recommendedFor: ['flashcard'],
    },
    {
      id: 'flash-modern',
      name: 'Flash Modern',
      gradient: 'from-violet-50 to-purple-50',
      textColor: 'text-violet-900',
      accentColor: 'bg-violet-700',
      borderColor: 'border-violet-200',
      recommendedFor: ['flashcard'],
    },
  ],
};

// ============================================================================
// THEME LOOKUP UTILITIES
// ============================================================================

/**
 * Flat map of all themes by ID for quick lookup
 */
export const themeMap: Record<string, BoxTheme> = Object.values(boxThemes)
  .flat()
  .reduce((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {} as Record<string, BoxTheme>);

/**
 * Get theme by ID
 */
export function getThemeById(themeId: string): BoxTheme | undefined {
  return themeMap[themeId];
}

/**
 * Get all themes for a specific box type
 */
export function getThemesForType(boxType: string): BoxTheme[] {
  return boxThemes[boxType] || [];
}

/**
 * Get a random theme for a specific box type
 */
export function getRandomTheme(boxType: string): BoxTheme | undefined {
  const themes = getThemesForType(boxType);
  if (themes.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

/**
 * Get all available theme IDs
 */
export function getAllThemeIds(): string[] {
  return Object.keys(themeMap);
}

/**
 * Validate if a theme ID exists
 */
export function isValidThemeId(themeId: string): boolean {
  return themeId in themeMap;
}

/**
 * Get theme CSS classes as object
 */
export function getThemeClasses(themeId: string): {
  gradient: string;
  text: string;
  accent: string;
  border: string;
} | null {
  const theme = getThemeById(themeId);
  if (!theme) return null;

  return {
    gradient: theme.gradient,
    text: theme.textColor,
    accent: theme.accentColor,
    border: theme.borderColor,
  };
}
