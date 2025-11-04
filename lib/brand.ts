export const brandMap = {
  emerald: {
    hero: 'from-emerald-600 to-emerald-400',
    text: 'text-emerald-700',
    border: 'border-emerald-500',
    chip: 'text-emerald-700',
    progress: 'bg-emerald-500',
  },
  indigo: {
    hero: 'from-indigo-600 to-indigo-400',
    text: 'text-indigo-700',
    border: 'border-indigo-500',
    chip: 'text-indigo-700',
    progress: 'bg-indigo-500',
  },
  blue: {
    hero: 'from-blue-600 to-blue-400',
    text: 'text-blue-700',
    border: 'border-blue-500',
    chip: 'text-blue-700',
    progress: 'bg-blue-500',
  },
  red: {
    hero: 'from-red-600 to-red-400',
    text: 'text-red-700',
    border: 'border-red-500',
    chip: 'text-red-700',
    progress: 'bg-red-500',
  },
  yellow: {
    hero: 'from-yellow-600 to-yellow-400',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
    chip: 'text-yellow-700',
    progress: 'bg-yellow-500',
  },
} as const

export type BrandKey = keyof typeof brandMap