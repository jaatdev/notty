/**
 * Styling Utilities for Notty Design System
 * Provides intelligent style application based on subject, content type, and context
 */

import { allSubjectsConfig, getSubjectConfig } from './subjects.config'
import type { BrandKey } from './brand'

export type GradientVariant = 
  | 'indigo' 
  | 'purple' 
  | 'pink' 
  | 'blue' 
  | 'green' 
  | 'amber' 
  | 'red' 
  | 'teal'
  | 'emerald'

export type AnimationType = 
  | 'fade-in-up' 
  | 'slide-in-left' 
  | 'slide-in-right' 
  | 'scale-in' 
  | 'float' 
  | 'pulse' 
  | 'bounce' 
  | 'glow' 
  | 'spin' 
  | 'ripple' 
  | 'gradient-shift'

export type StylePreset = {
  name: string
  gradient: GradientVariant
  animation: AnimationType
  useHero: boolean
  description: string
}

/**
 * Style Presets for Different Moods/Contexts
 */
export const STYLE_PRESETS: StylePreset[] = [
  {
    name: 'heroic',
    gradient: 'purple',
    animation: 'fade-in-up',
    useHero: true,
    description: 'Grand, important topics with hero banner'
  },
  {
    name: 'minimal',
    gradient: 'blue',
    animation: 'scale-in',
    useHero: false,
    description: 'Clean, focused content'
  },
  {
    name: 'vibrant',
    gradient: 'pink',
    animation: 'slide-in-left',
    useHero: true,
    description: 'Energetic, engaging topics'
  },
  {
    name: 'professional',
    gradient: 'indigo',
    animation: 'fade-in-up',
    useHero: false,
    description: 'Serious, formal content'
  },
  {
    name: 'playful',
    gradient: 'amber',
    animation: 'bounce',
    useHero: true,
    description: 'Fun, creative learning'
  },
  {
    name: 'serene',
    gradient: 'teal',
    animation: 'float',
    useHero: false,
    description: 'Calm, contemplative topics'
  },
]

/**
 * Subject to Gradient Mapping
 */
const SUBJECT_GRADIENTS: Record<string, GradientVariant> = {
  polity: 'red',
  history: 'amber',
  geography: 'blue',
  economics: 'teal',
  science: 'green',
  math: 'purple',
  literature: 'pink',
  philosophy: 'indigo',
  default: 'blue',
}

/**
 * Content Type to Animation Mapping
 */
const CONTENT_ANIMATIONS: Record<string, AnimationType> = {
  hero: 'gradient-shift',
  heading: 'slide-in-left',
  card: 'fade-in-up',
  badge: 'pulse',
  quiz: 'scale-in',
  flashcard: 'fade-in-up',
  success: 'glow',
  loading: 'spin',
  notification: 'bounce',
}

/**
 * Get gradient variant for a subject
 */
export function getSubjectGradient(subjectSlug: string): GradientVariant {
  return SUBJECT_GRADIENTS[subjectSlug] || SUBJECT_GRADIENTS.default
}

/**
 * Get animation class for content type
 */
export function getContentAnimation(contentType: keyof typeof CONTENT_ANIMATIONS): string {
  return `animate-${CONTENT_ANIMATIONS[contentType] || 'fade-in-up'}`
}

/**
 * Get gradient card class
 */
export function getGradientCard(variant: GradientVariant): string {
  return `gradient-card-${variant}`
}

/**
 * Get complete card classes
 */
export function getCardClasses(
  subjectSlug?: string, 
  options?: {
    animation?: AnimationType
    gradient?: GradientVariant
    includeBase?: boolean
  }
): string {
  const baseClass = options?.includeBase !== false ? 'modern-card' : ''
  const gradient = options?.gradient || (subjectSlug ? getSubjectGradient(subjectSlug) : 'blue')
  const animation = options?.animation ? `animate-${options.animation}` : 'animate-fade-in-up'
  
  return `${baseClass} ${getGradientCard(gradient)} ${animation}`.trim()
}

/**
 * Select random style preset
 */
export function getRandomPreset(): StylePreset {
  return STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)]
}

/**
 * Select preset based on topic importance
 */
export function getPresetByImportance(importance: 'high' | 'medium' | 'low'): StylePreset {
  if (importance === 'high') {
    return STYLE_PRESETS.find(p => p.name === 'heroic') || STYLE_PRESETS[0]
  } else if (importance === 'medium') {
    return STYLE_PRESETS.find(p => p.name === 'professional') || STYLE_PRESETS[3]
  } else {
    return STYLE_PRESETS.find(p => p.name === 'minimal') || STYLE_PRESETS[1]
  }
}

/**
 * Get staggered animation delay
 */
export function getStaggerDelay(index: number, baseDelay: number = 100): string {
  const delay = Math.min(index * baseDelay, 800)
  return delay > 0 ? `delay-${delay}` : ''
}

/**
 * Get inline stagger delay style
 */
export function getStaggerStyle(index: number, baseDelay: number = 100): React.CSSProperties {
  return {
    animationDelay: `${index * baseDelay}ms`
  }
}

/**
 * Generate hero section HTML
 */
export function generateHeroHTML(
  title: string,
  subtitle?: string,
  badges?: string[]
): string {
  const badgesHTML = badges?.map(b => `<span class="pill-badge">${b}</span>`).join(' ') || ''
  
  return `
<div class="hero-section">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">${title}</h1>
    ${subtitle ? `<p class="text-xl text-gray-300 mb-4 animate-fade-in-up delay-200">${subtitle}</p>` : ''}
    ${badgesHTML ? `<div class="flex gap-2 justify-center flex-wrap animate-fade-in-up delay-300">${badgesHTML}</div>` : ''}
  </div>
</div>
  `.trim()
}

/**
 * Wrap content in modern card
 */
export function wrapInCard(
  content: string,
  variant?: GradientVariant,
  animation?: AnimationType
): string {
  const classes = getCardClasses(undefined, { gradient: variant, animation })
  return `<div class="${classes}">\n\n${content}\n\n</div>`
}

/**
 * Create pill badge HTML
 */
export function createPillBadge(text: string, className?: string): string {
  return `<span class="pill-badge ${className || ''}">${text}</span>`
}

/**
 * Get quiz option classes
 */
export function getQuizOptionClasses(
  state: 'default' | 'selected' | 'correct' | 'incorrect',
  index: number
): string {
  const baseClasses = 'modern-card transition-all duration-300 hover:scale-105 animate-fade-in-up'
  const stagger = getStaggerDelay(index)
  
  const stateClasses = {
    default: 'gradient-card-blue hover:shadow-lg',
    selected: 'gradient-card-purple ring-4 ring-purple-500',
    correct: 'gradient-card-green ring-4 ring-green-500 animate-glow',
    incorrect: 'gradient-card-red ring-4 ring-red-500'
  }
  
  return `${baseClasses} ${stateClasses[state]} ${stagger}`.trim()
}

/**
 * Get flashcard classes based on mastery
 */
export function getFlashcardClasses(
  mastered: boolean,
  isDue: boolean
): string {
  const baseClasses = 'modern-card animate-fade-in-up'
  
  if (mastered) {
    return `${baseClasses} gradient-card-emerald ring-2 ring-emerald-500 animate-glow`
  } else if (isDue) {
    return `${baseClasses} gradient-card-amber ring-2 ring-amber-500`
  } else {
    return `${baseClasses} gradient-card-blue`
  }
}

/**
 * Auto-style markdown content
 * Wraps sections in modern cards and adds hero if applicable
 */
export function autoStyleMarkdown(
  markdown: string,
  options?: {
    subjectSlug?: string
    addHero?: boolean
    heroTitle?: string
    heroSubtitle?: string
    preset?: StylePreset
  }
): string {
  let styled = markdown
  
  // Add hero section if requested
  if (options?.addHero && options?.heroTitle) {
    const hero = generateHeroHTML(
      options.heroTitle,
      options.heroSubtitle
    )
    styled = `${hero}\n\n${styled}`
  }
  
  // Detect and wrap major sections
  // This is a simple implementation - can be enhanced
  const sections = styled.split(/\n(?=##\s)/)
  
  if (sections.length > 1) {
    const preset = options?.preset || (options?.subjectSlug ? 
      { gradient: getSubjectGradient(options.subjectSlug), animation: 'fade-in-up' as AnimationType } : 
      undefined)
    
    styled = sections.map((section, i) => {
      if (i === 0 && options?.addHero) return section // Skip first if hero was added
      if (section.trim().length < 50) return section // Skip small sections
      
      return wrapInCard(section, preset?.gradient, preset?.animation)
    }).join('\n\n')
  }
  
  return styled
}

/**
 * Get subject brand color (from subjects.config)
 */
export function getSubjectBrandColor(subjectSlug: string): string {
  const subject = getSubjectConfig(subjectSlug)
  return subject?.brandColor || 'blue'
}

/**
 * Generate CSS variable overrides for subject theming
 */
export function getSubjectThemeVars(subjectSlug: string): Record<string, string> {
  const brandColor = getSubjectBrandColor(subjectSlug)
  const gradient = getSubjectGradient(subjectSlug)
  
  return {
    '--subject-brand-color': brandColor,
    '--subject-gradient': gradient,
  }
}
