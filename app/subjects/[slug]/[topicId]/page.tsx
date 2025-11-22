import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug, findTopicByPath } from '@/lib/data'
import { brandMap } from '@/lib/brand'
import { getThemeById } from '@/lib/theme-variants'
import TopicContent from './TopicContent'
import TopicPageClient from './TopicPageClient'

type Params = {
  slug: string
  topicId: string
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { slug, topicId } = await params
  const subject = await getSubjectBySlug(slug)
  
  if (!subject) {
    notFound()
  }

  // Find the topic by path (topicId)
  const topic = findTopicByPath(subject, [topicId])
  
  if (!topic) {
    notFound()
  }

  const colors = brandMap[subject.brandColor]
  const theme = getThemeById(`${slug}-${topicId}`)

  return (
    <TopicPageClient
      subject={subject}
      topic={topic}
      slug={slug}
      topicId={topicId}
      colors={colors}
      theme={theme}
    />
  )
}
