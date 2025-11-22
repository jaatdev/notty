'use client'

import { motion } from 'framer-motion'

export default function FloatingElements() {
  const elements = [
    { emoji: '📚', size: 'text-4xl', delay: 0 },
    { emoji: '🎯', size: 'text-3xl', delay: 0.5 },
    { emoji: '⭐', size: 'text-2xl', delay: 1 },
    { emoji: '🏆', size: 'text-4xl', delay: 1.5 },
    { emoji: '💡', size: 'text-3xl', delay: 2 },
    { emoji: '🚀', size: 'text-2xl', delay: 2.5 },
    { emoji: '✨', size: 'text-3xl', delay: 3 },
    { emoji: '🎓', size: 'text-4xl', delay: 3.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className={`absolute ${element.size} opacity-20 dark:opacity-10`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  )
}
