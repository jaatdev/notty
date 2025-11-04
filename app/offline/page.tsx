export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-emerald-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          You're Offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          No internet connection detected. Don't worry, your previously viewed content is still available!
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            What you can do:
          </h2>
          <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">✓</span>
              <span>Review your learning statistics and achievements</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">✓</span>
              <span>Practice flashcards from cached subjects</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">✓</span>
              <span>Browse previously visited notes</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2">✓</span>
              <span>Access your bookmarks</span>
            </li>
          </ul>
        </div>

        <a 
          href="/"
          className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
        >
          Go Home
        </a>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          PWA powered by Notty • Offline mode active
        </p>
      </div>
    </div>
  )
}