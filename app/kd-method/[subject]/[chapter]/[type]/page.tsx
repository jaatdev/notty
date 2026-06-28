import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getKDChapterTypeData, getKDChapterTypes, getKDChapters, getKDChapterSubjects } from '@/utils/kdMethodParser';
import { ConceptInteractiveViewer } from '@/components/kd-method/ConceptInteractiveViewer';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ subject: string; chapter: string; type: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const typeData = await getKDChapterTypeData(params.subject, params.chapter, params.type);
  
  if (!typeData) {
    return { title: 'Type Not Found' };
  }

  const subjectTitle = params.subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('Gs', 'GS');

  return {
    title: `${typeData.title} | ${subjectTitle} | KD Method`,
    description: `Learn about ${typeData.title}`,
  };
}

export async function generateStaticParams() {
  const subjects = await getKDChapterSubjects();
  const paramsList = [];
  
  for (const subject of subjects) {
    const chapters = await getKDChapters(subject);
    for (const chapter of chapters) {
      const types = await getKDChapterTypes(subject, chapter.slug);
      for (const type of types) {
        paramsList.push({
          subject,
          chapter: chapter.slug,
          type: type.slug,
        });
      }
    }
  }
  
  return paramsList;
}

export default async function TrickFundaTypeViewer(props: Props) {
  const params = await props.params;
  const typeData = await getKDChapterTypeData(params.subject, params.chapter, params.type);

  if (!typeData) {
    notFound();
  }

  // Format title from slug
  const chapterTitle = params.chapter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href={`/kd-method/${params.subject}/${params.chapter}`} 
            className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline inline-flex items-center gap-2"
          >
            <span>←</span> Back to {chapterTitle}
          </Link>
        </div>

        {/* Content Viewer (Reused from English Concepts) */}
        <ConceptInteractiveViewer 
          title={`${chapterTitle}: ${typeData.title}`}
          notesMarkdown={typeData.notesMarkdown}
          noteBoxes={typeData.noteBoxes}
          pdfUrl={typeData.pdfUrl}
          youtubeUrls={typeData.youtubeUrls}
          quizzes={typeData.quizzes}
          slug={typeData.slug}
        />
      </div>
    </main>
  );
}
