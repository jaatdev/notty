'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'UPSC Aspirant',
    image: '👩‍🎓',
    text: 'Notty transformed my preparation! The spaced repetition feature helped me retain complex topics effortlessly. Cleared prelims with 95%!',
    rating: 5,
    exam: 'UPSC CSE 2024'
  },
  {
    name: 'Rahul Verma',
    role: 'JEE Student',
    image: '👨‍🎓',
    text: 'The flashcards and quizzes are game-changers. I improved my Physics score by 40% in just 3 months. Best learning platform ever!',
    rating: 5,
    exam: 'JEE Advanced 2024'
  },
  {
    name: 'Ananya Patel',
    role: 'NEET Aspirant',
    image: '👩‍⚕️',
    text: 'Beautiful interface, powerful features. The achievement system kept me motivated throughout my preparation. Highly recommended!',
    rating: 5,
    exam: 'NEET 2024'
  },
  {
    name: 'Arjun Singh',
    role: 'SSC Candidate',
    image: '👨‍💼',
    text: 'Offline support was a lifesaver during my travels. The notes are crisp and exam-focused. Got selected in SSC CGL!',
    rating: 5,
    exam: 'SSC CGL 2024'
  },
  {
    name: 'Sneha Reddy',
    role: 'Banking Aspirant',
    image: '👩‍💼',
    text: 'The quiz analytics helped me identify weak areas. Improved my accuracy from 60% to 92%. Thank you Notty!',
    rating: 5,
    exam: 'IBPS PO 2024'
  },
  {
    name: 'Vikram Kumar',
    role: 'CAT Aspirant',
    image: '👨‍💻',
    text: 'Smart search and command palette saved me hours. The dark theme is perfect for late-night study sessions. 99 percentile!',
    rating: 5,
    exam: 'CAT 2024'
  },
]

export default function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            💬 Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Hear from students who aced their exams</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onHoverStart={() => setHoveredIndex(idx)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <motion.div
                className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl h-full"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl opacity-0"
                  animate={{ opacity: hoveredIndex === idx ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                  {/* Avatar */}
                  <motion.div
                    className="text-6xl mb-4"
                    animate={hoveredIndex === idx ? {
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.image}
                  </motion.div>

                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 + i * 0.1 }}
                        className="text-yellow-400 text-xl"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-black text-gray-900 dark:text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <motion.span
                      className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      ✓ {testimonial.exam}
                    </motion.span>
                  </div>
                </div>

                {/* Quote decoration */}
                <div className="absolute top-4 right-4 text-6xl text-violet-200 dark:text-violet-900 opacity-20">
                  "
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
