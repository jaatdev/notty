import fs from 'fs';
import path from 'path';

/**
 * Data Loader for new folder-based structure
 * Loads subjects/topics/subtopics from organized folders
 * SERVER-SIDE ONLY - uses Node.js fs module
 */

const SUBJECTS_DIR = path.join(process.cwd(), 'data', 'subjects');

// Cache for loaded data
let cachedData: any = null;

/**
 * Read JSON file
 */
function readJSON(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Could not read ${filePath}`);
    return null;
  }
}

/**
 * Load all subjects with full nested structure
 * Caches result for performance
 */
export function loadAllSubjects() {
  // Return cached data if available
  if (cachedData) {
    return cachedData;
  }

  const indexPath = path.join(SUBJECTS_DIR, 'index.json');
  const index = readJSON(indexPath);

  if (!index || !index.subjects) {
    throw new Error('Invalid subjects index.json');
  }

  const subjects = index.subjects.map((subjectMeta: any) => {
    const subjectDir = path.join(SUBJECTS_DIR, subjectMeta.slug);
    const subjectData = readJSON(path.join(subjectDir, 'subject.json'));

    if (!subjectData) {
      console.warn(`Subject data missing for ${subjectMeta.slug}`);
      return null;
    }

    const topics = subjectData.topics.map((topicMeta: any) => {
      const topicDir = path.join(subjectDir, topicMeta.slug);
      const topicData = readJSON(path.join(topicDir, 'topic.json'));

      if (!topicData) {
        console.warn(`Topic data missing for ${topicMeta.slug}`);
        return null;
      }

      const subTopics = topicData.subTopics.map((subTopicMeta: any) => {
        const subTopicDir = path.join(topicDir, subTopicMeta.slug);
        const subTopicData = readJSON(path.join(subTopicDir, 'subtopic.json'));
        const contentData = readJSON(path.join(subTopicDir, 'content.json'));
        const quizData = readJSON(path.join(subTopicDir, 'quiz.json'));

        return {
          ...subTopicData,
          content: contentData?.items || [],
          quiz: quizData?.questions || []
        };
      }).filter(Boolean);

      return {
        ...topicData,
        subTopics
      };
    }).filter(Boolean);

    return {
      ...subjectData,
      topics
    };
  }).filter(Boolean);

  const result = { subjects };
  
  // Cache the result
  cachedData = result;
  
  return result;
}

/**
 * Load specific subject
 */
export function loadSubject(slug: string) {
  const subjectDir = path.join(SUBJECTS_DIR, slug);
  const subjectData = readJSON(path.join(subjectDir, 'subject.json'));

  if (!subjectData) {
    return null;
  }

  const topics = subjectData.topics.map((topicMeta: any) => {
    const topicDir = path.join(subjectDir, topicMeta.slug);
    const topicData = readJSON(path.join(topicDir, 'topic.json'));

    if (!topicData) return null;

    const subTopics = topicData.subTopics.map((subTopicMeta: any) => {
      const subTopicDir = path.join(topicDir, subTopicMeta.slug);
      const subTopicData = readJSON(path.join(subTopicDir, 'subtopic.json'));
      const contentData = readJSON(path.join(subTopicDir, 'content.json'));
      const quizData = readJSON(path.join(subTopicDir, 'quiz.json'));

      return {
        ...subTopicData,
        content: contentData?.items || [],
        quiz: quizData?.questions || []
      };
    }).filter(Boolean);

    return {
      ...topicData,
      subTopics
    };
  }).filter(Boolean);

  return {
    ...subjectData,
    topics
  };
}

/**
 * Load specific topic
 */
export function loadTopic(subjectSlug: string, topicSlug: string) {
  const topicDir = path.join(SUBJECTS_DIR, subjectSlug, topicSlug);
  const topicData = readJSON(path.join(topicDir, 'topic.json'));

  if (!topicData) {
    return null;
  }

  const subTopics = topicData.subTopics.map((subTopicMeta: any) => {
    const subTopicDir = path.join(topicDir, subTopicMeta.slug);
    const subTopicData = readJSON(path.join(subTopicDir, 'subtopic.json'));
    const contentData = readJSON(path.join(subTopicDir, 'content.json'));
    const quizData = readJSON(path.join(subTopicDir, 'quiz.json'));

    return {
      ...subTopicData,
      content: contentData?.items || [],
      quiz: quizData?.questions || []
    };
  }).filter(Boolean);

  return {
    ...topicData,
    subTopics
  };
}

/**
 * Load specific subtopic
 */
export function loadSubTopic(subjectSlug: string, topicSlug: string, subTopicSlug: string) {
  const subTopicDir = path.join(SUBJECTS_DIR, subjectSlug, topicSlug, subTopicSlug);
  const subTopicData = readJSON(path.join(subTopicDir, 'subtopic.json'));
  const contentData = readJSON(path.join(subTopicDir, 'content.json'));
  const quizData = readJSON(path.join(subTopicDir, 'quiz.json'));

  if (!subTopicData) {
    return null;
  }

  return {
    ...subTopicData,
    content: contentData?.items || [],
    quiz: quizData?.questions || []
  };
}

/**
 * Get subjects list (metadata only)
 */
export function getSubjectsList() {
  const indexPath = path.join(SUBJECTS_DIR, 'index.json');
  const index = readJSON(indexPath);
  return index?.subjects || [];
}

/**
 * Get topics list for a subject (metadata only)
 */
export function getTopicsList(subjectSlug: string) {
  const subjectDir = path.join(SUBJECTS_DIR, subjectSlug);
  const subjectData = readJSON(path.join(subjectDir, 'subject.json'));
  return subjectData?.topics || [];
}

/**
 * Get subtopics list for a topic (metadata only)
 */
export function getSubTopicsList(subjectSlug: string, topicSlug: string) {
  const topicDir = path.join(SUBJECTS_DIR, subjectSlug, topicSlug);
  const topicData = readJSON(path.join(topicDir, 'topic.json'));
  return topicData?.subTopics || [];
}

// Export for backward compatibility (loads everything)
export function getAllData() {
  return loadAllSubjects();
}
