import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KD Method | TrickFunda',
  description: 'Learn concepts quickly with the KD Method.',
};

export default function KDMethodLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-24 pb-8 px-8 md:pt-32 md:pb-16 md:px-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            KD Method
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            A new way to quickly master concepts through notes and interactive quizzes.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <Link 
            href="/kd-method/english-100-concepts"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">
                  English 100 Concepts
                </h2>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 flex-grow">
                Master the top 100 English grammar rules and concepts with our proven KD Method. Includes notes and targeted quizzes.
              </p>
            </div>
          </Link>
          <Link 
            href="/kd-method/maths-trickfunda"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">
                  Maths TrickFunda
                </h2>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 flex-grow">
                Master essential mathematics concepts, chapter by chapter, with bilingual quizzes and interactive notes.
              </p>
            </div>
          </Link>
          <Link 
            href="/kd-method/gs-trickfunda"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">
                  GS TrickFunda
                </h2>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 flex-grow">
                Master General Studies with tricks and mnemonics, structured by history, geography, and more.
              </p>
            </div>
          </Link>

          <Link 
            href="/kd-method/reasoning-trickfunda"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">
                  Reasoning TrickFunda
                </h2>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 flex-grow">
                Solve logical puzzles in seconds with proven methods and daily practice quizzes.
              </p>
            </div>
          </Link>

          <Link 
            href="/kd-method/vocab-trickfunda"
            className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">
                  Vocab TrickFunda
                </h2>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 flex-grow">
                Memorize thousands of words effortlessly using visual cues, root words, and association tricks.
              </p>
            </div>
          </Link>
          
          {/* Add more categories here in the future */}
        </section>
      </div>
    </div>
  );
}
