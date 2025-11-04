import { getAllSubjectSlugs, getSubjectBySlug } from '@/lib/data'
import SubjectShell from '@/components/SubjectShell'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getAllSubjectSlugs().map(slug => ({ slug }))
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const subject = getSubjectBySlug(slug)
  if (!subject) return notFound()
  return <SubjectShell subject={subject} />
}