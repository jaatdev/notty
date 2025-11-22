import { getSubjectBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { brandMap, type BrandKey } from '@/lib/brand'
import { getThemeById } from '@/lib/theme-variants'
import SubjectPageClient from './SubjectPageClient'

type Params = { slug: string }

export default async function SubjectOverviewPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const subject = await getSubjectBySlug(slug)
  
  if (!subject) {
    return notFound()
  }

  const brand = brandMap[subject.brandColor as BrandKey] || brandMap.emerald
  const theme = getThemeById(slug)

  return <SubjectPageClient subject={subject} brand={brand} theme={theme} />
}
