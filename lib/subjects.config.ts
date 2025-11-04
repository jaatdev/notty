// ============================================================================
// MASTER SUBJECTS CONFIGURATION
// Defines all available subjects in the learning platform
// ============================================================================

import type { BrandKey } from './brand'

export type SubjectConfig = {
  slug: string
  title: string
  description: string
  emoji: string
  brandColor: BrandKey
}

export const allSubjectsConfig: SubjectConfig[] = [
  {
    slug: 'polity',
    title: 'Indian Polity',
    description: 'Constitution, Governance, Political System',
    emoji: '🏛️',
    brandColor: 'indigo'
  },
  {
    slug: 'history',
    title: 'History',
    description: 'Ancient, Medieval, Modern Indian History',
    emoji: '📜',
    brandColor: 'amber'
  },
  {
    slug: 'geography',
    title: 'Geography',
    description: 'Physical, Human & Economic Geography',
    emoji: '🌍',
    brandColor: 'emerald'
  },
  {
    slug: 'maths',
    title: 'Mathematics',
    description: 'Quantitative Aptitude & Advanced Math',
    emoji: '📊',
    brandColor: 'blue'
  },
  {
    slug: 'reasoning',
    title: 'Reasoning',
    description: 'Logical, Analytical & Verbal Reasoning',
    emoji: '🧠',
    brandColor: 'purple'
  },
  {
    slug: 'biology',
    title: 'Biology',
    description: 'Botany, Zoology & General Science',
    emoji: '🧬',
    brandColor: 'green'
  },
  {
    slug: 'physics',
    title: 'Physics',
    description: 'Mechanics, Optics, Thermodynamics',
    emoji: '⚛️',
    brandColor: 'cyan'
  },
  {
    slug: 'chemistry',
    title: 'Chemistry',
    description: 'Organic, Inorganic & Physical Chemistry',
    emoji: '🧪',
    brandColor: 'pink'
  },
  {
    slug: 'hindi',
    title: 'Hindi',
    description: 'व्याकरण, साहित्य और भाषा कौशल',
    emoji: '✍️',
    brandColor: 'orange'
  },
  {
    slug: 'english',
    title: 'English',
    description: 'Grammar, Vocabulary & Comprehension',
    emoji: '🇬🇧',
    brandColor: 'blue'
  },
  {
    slug: 'moolvidhi',
    title: 'Moolvidhi',
    description: 'IPC, CrPC, Evidence Act & Constitution',
    emoji: '⚖️',
    brandColor: 'slate'
  },
  {
    slug: 'gk-eco-current',
    title: 'GK & Current Affairs',
    description: 'Economy, Banking, Current Events',
    emoji: '📰',
    brandColor: 'red'
  }
]

/**
 * Get subject configuration by slug
 */
export function getSubjectConfig(slug: string): SubjectConfig | undefined {
  return allSubjectsConfig.find(s => s.slug === slug)
}
