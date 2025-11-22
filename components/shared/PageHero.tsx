'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageHeroProps {
  badge?: string
  title: string
  description: string
  gradient: string
  icon?: ReactNode
}

export default function PageHero({ badge, title, description, gradient, icon }: PageHeroProps) {
  return (
    <section className={`relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
          >
            <span className="text-white text-sm font-bold">{badge}</span>
          </motion.div>
        )}

        {icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            {icon}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}
