// lib/searchIndex.ts
import type { Subject, Topic } from './types'

export type SearchItem =
  | { type: 'action'; id: string; label: string; hint?: string }
  | { type: 'subject'; slug: string; title: string; description?: string; tags: string[] }
  | { type: 'topic'; subjectSlug: string; topicId: string; title: string; path: string; tags: string[] }

function collectTopicTags(topic: Topic): string[] {
  const tags: string[] = []
  
  if (topic.content) {
    topic.content.forEach(node => {
      if (node.meta?.tags) tags.push(...node.meta.tags)
    })
  }
  
  if (topic.quiz) {
    topic.quiz.forEach(q => {
      if (q.meta?.tags) tags.push(...q.meta.tags)
    })
  }
  
  if (topic.subTopics) {
    topic.subTopics.forEach(subTopic => {
      tags.push(...collectTopicTags(subTopic))
    })
  }
  
  return tags
}

function walkTopicsForIndex(
  topics: Topic[], 
  subjectSlug: string, 
  parentPath: string[] = [], 
  out: SearchItem[] = []
) {
  for (const topic of topics) {
    const path = [...parentPath, topic.title]
    out.push({
      type: 'topic',
      subjectSlug,
      topicId: topic.id,
      title: topic.title,
      path: path.join(' > '),
      tags: collectTopicTags(topic),
    })
    
    if (topic.subTopics && topic.subTopics.length > 0) {
      walkTopicsForIndex(topic.subTopics, subjectSlug, path, out)
    }
  }
  return out
}

export function buildSearchIndex(subjects: Subject[]): SearchItem[] {
  const items: SearchItem[] = []

  for (const s of subjects) {
    items.push({
      type: 'subject',
      slug: s.slug,
      title: s.title,
      description: s.description,
      tags: s.topics.flatMap(collectTopicTags),
    })
    
    walkTopicsForIndex(s.topics, s.slug, [], items)
  }

  return items
}
