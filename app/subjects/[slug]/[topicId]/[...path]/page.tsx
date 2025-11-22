import { notFound } from 'next/navigation'
import { getSubjectBySlug, findTopicByPath } from '@/lib/data'
import { brandMap } from '@/lib/brand'
import { getThemeById } from '@/lib/theme-variants'
import SubTopicPageClient from './SubTopicPageClient'

type Params = {
  slug: string
  topicId: string
  path: string[]
}

export default async function SubTopicPage({ params }: { params: Promise<Params> }) {
  const { slug, topicId, path } = await params
  const subject = await getSubjectBySlug(slug)
  
  if (!subject) {
    notFound()
  }

  // Build the full path to the subtopic
  const fullPath = [topicId, ...path]
  const topic = findTopicByPath(subject, fullPath)
  
  if (!topic) {
    notFound()
  }

  const colors = brandMap[subject.brandColor]
  const theme = getThemeById(`${slug}-${fullPath.join('-')}`)

  // Build breadcrumb path
  const buildBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', href: '/' },
      { label: `${subject.emoji} ${subject.title}`, href: `/subjects/${slug}` },
    ]
    
    // Add each level of the path
    let currentPath = `/subjects/${slug}/${topicId}`
    const rootTopic = findTopicByPath(subject, [topicId])
    if (rootTopic) {
      crumbs.push({ label: rootTopic.title, href: currentPath })
    }
    
    // Add intermediate subtopics
    for (let i = 0; i < path.length - 1; i++) {
      currentPath += `/${path[i]}`
      const intermediateTopic = findTopicByPath(subject, [topicId, ...path.slice(0, i + 1)])
      if (intermediateTopic) {
        crumbs.push({ label: intermediateTopic.title, href: currentPath })
      }
    }
    
    // Current page
    crumbs.push({ label: topic.title, href: '' })
    
    return crumbs
  }

  const breadcrumbs = buildBreadcrumbs()
  const parentPath = breadcrumbs[breadcrumbs.length - 2]?.href || `/subjects/${slug}`

  return (
    <SubTopicPageClient
      subject={subject}
      topic={topic}
      slug={slug}
      topicId={topicId}
      fullPath={fullPath}
      breadcrumbs={breadcrumbs}
      parentPath={parentPath}
      colors={colors}
      theme={theme}
    />
  )
}
