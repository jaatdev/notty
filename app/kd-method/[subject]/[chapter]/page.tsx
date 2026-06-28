import { getKDChapterTypes, getKDChapters, getKDChapterSubjects } from '@/utils/kdMethodParser';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ subject: string; chapter: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const chapterTitle = params.chapter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const subjectTitle = params.subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('Gs', 'GS');
  
  return {
    title: `${chapterTitle} | ${subjectTitle} | KD Method`,
    description: `Learn about ${chapterTitle}`,
  };
}

export async function generateStaticParams() {
  const subjects = await getKDChapterSubjects();
  const paramsList = [];
  
  for (const subject of subjects) {
    const chapters = await getKDChapters(subject);
    for (const chapter of chapters) {
      paramsList.push({
        subject,
        chapter: chapter.slug,
      });
    }
  }
  
  return paramsList;
}

export default async function TrickFundaChapter(props: Props) {
  const params = await props.params;
  const types = await getKDChapterTypes(params.subject, params.chapter);
  
  // Format title from slug
  const chapterTitle = params.chapter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const subjectTitle = params.subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('Gs', 'GS');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href={`/kd-method/${params.subject}`} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline mb-4 inline-block">
            ← Back to {subjectTitle}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {chapterTitle}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Select a specific type to learn the tricks and practice bilingual questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type, i) => (
            <Link 
              key={type.slug}
              href={`/kd-method/${params.subject}/${params.chapter}/${type.slug}`}
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
                  {type.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium relative z-10">
                  {type.youtubeUrls && type.youtubeUrls.length > 0 && <span>📺 {type.youtubeUrls.length} Video{type.youtubeUrls.length !== 1 ? 's' : ''}</span>}
                  {type.pdfUrl && <span>📄 PDF Notes</span>}
                  {!type.pdfUrl && type.noteBoxes && type.noteBoxes.length > 0 && <span>📦 Noteboxes</span>}
                  {!type.pdfUrl && (!type.noteBoxes || type.noteBoxes.length === 0) && type.notesMarkdown && <span>📝 Notes</span>}
                  {type.quizzes && type.quizzes.length > 0 && (
                    <span>🎯 {type.quizzes.reduce((acc, q) => acc + q.questions.length, 0)} Question{type.quizzes.reduce((acc, q) => acc + q.questions.length, 0) !== 1 ? 's' : ''} {type.quizzes.length > 1 ? `(${type.quizzes.length} Quizzes)` : ''}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {types.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No types found for this chapter yet. Add folders inside data/kd-method/{params.subject}/{params.chapter}/
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
