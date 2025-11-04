'use client'

export default function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <header className="relative overflow-hidden hero">
      <div className="text-white pt-24 pb-16 md:pt-28 md:pb-20 shadow-2xl bg-linear-to-tr from-emerald-600 to-emerald-400">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3">Notes that scale with you</h1>
          <p className="text-lg md:text-2xl opacity-90">Drop JSON. Get beautiful, searchable, shareable notes with flashcards and quizzes.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onExplore} className="px-5 py-3 rounded-lg bg-white text-emerald-700 font-semibold hover:bg-emerald-50">Explore Subjects</button>
            <a href="#about" className="px-5 py-3 rounded-lg border border-white/70 text-white font-semibold hover:bg-white/20">How it works</a>
          </div>
        </div>
        <div className="hero-dots"></div>
      </div>
    </header>
  )
}