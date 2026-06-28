import Link from 'next/link';
import { Metadata } from 'next';
import { getKDConcepts } from '@/utils/kdMethodParser';

export const metadata: Metadata = {
  title: 'English 100 Concepts | KD Method | TrickFunda',
  description: 'Master the top 100 English grammar concepts.',
};

export default async function EnglishConceptsPage() {
  const concepts = await getKDConcepts('english-100-concepts');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-24 pb-8 px-8 md:pt-32 md:pb-16 md:px-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/kd-method" className="hover:text-emerald-500 transition-colors">KD Method</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">English 100 Concepts</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            English 100 Concepts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Select a concept to review the notes and test your knowledge.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {concepts.length === 0 ? (
            <p className="col-span-full text-gray-500">No concepts found. Create a concept folder in data/kd-method/english-100-concepts.</p>
          ) : (
            concepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/kd-method/english-100-concepts/${concept.slug}`}
                className="group block p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-500 transition-colors">
                  {concept.title}
                </h3>
                <div className="flex space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  {concept.youtubeUrls && concept.youtubeUrls.length > 0 && (
                    <span>📺 {concept.youtubeUrls.length} Video{concept.youtubeUrls.length !== 1 ? 's' : ''}</span>
                  )}
                  {concept.pdfUrl && <span>📄 PDF Notes</span>}
                  {!concept.pdfUrl && concept.noteBoxes && concept.noteBoxes.length > 0 && <span>📦 Noteboxes</span>}
                  {!concept.pdfUrl && (!concept.noteBoxes || concept.noteBoxes.length === 0) && concept.notesMarkdown && <span>📝 Notes</span>}
                  {concept.quizzes && concept.quizzes.length > 0 && (
                    <span>🎯 {concept.quizzes.reduce((acc, q) => acc + q.questions.length, 0)} Question{concept.quizzes.reduce((acc, q) => acc + q.questions.length, 0) !== 1 ? 's' : ''} {concept.quizzes.length > 1 ? `(${concept.quizzes.length} Quizzes)` : ''}</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
