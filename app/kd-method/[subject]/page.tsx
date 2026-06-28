import { getKDChapters, getKDChapterSubjects } from '@/utils/kdMethodParser';
import Link from 'next/link';

export async function generateStaticParams() {
  const subjects = await getKDChapterSubjects();
  return subjects.map(subject => ({ subject }));
}

export default async function TrickFundaIndex({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const chapters = await getKDChapters(subject);

  // Format title from slug
  const subjectTitle = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  // Handle specific acronyms correctly
  const displayTitle = subjectTitle.replace('Gs', 'GS');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/kd-method" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline mb-4 inline-block">
            ← Back to KD Method
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {displayTitle.split(' ')[0]} <span className="text-emerald-500">{displayTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Select a chapter to master its types and tricks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, i) => (
            <Link 
              key={chapter.slug}
              href={`/kd-method/${subject}/${chapter.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                    {i + 1}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">
                  {chapter.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium relative z-10">
                  <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-emerald-600 dark:text-emerald-400">
                    {chapter.typesCount} Type{chapter.typesCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {chapters.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No chapters found for this subject yet. Add folders inside data/kd-method/{subject}/
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
