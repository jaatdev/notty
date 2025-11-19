const fs = require('fs');
const path = require('path');

/**
 * Build static data.json from folder structure
 * This runs at build time to create a single JSON file for client-side use
 */

const SUBJECTS_DIR = path.join(process.cwd(), 'data', 'subjects');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'notes-static.json');

function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Could not read ${filePath}`);
    return null;
  }
}

function buildStaticData() {
  console.log('🔨 Building static data from folder structure...\n');

  const indexPath = path.join(SUBJECTS_DIR, 'index.json');
  const index = readJSON(indexPath);

  if (!index || !index.subjects) {
    throw new Error('Invalid subjects index.json');
  }

  const subjects = index.subjects.map(subjectMeta => {
    console.log(`Processing: ${subjectMeta.title}`);
    
    const subjectDir = path.join(SUBJECTS_DIR, subjectMeta.slug);
    const subjectData = readJSON(path.join(subjectDir, 'subject.json'));

    if (!subjectData) {
      console.warn(`Subject data missing for ${subjectMeta.slug}`);
      return null;
    }

    const topics = subjectData.topics.map(topicMeta => {
      const topicDir = path.join(subjectDir, topicMeta.slug);
      const topicData = readJSON(path.join(topicDir, 'topic.json'));

      if (!topicData) {
        console.warn(`Topic data missing for ${topicMeta.slug}`);
        return null;
      }

      const subTopics = topicData.subTopics.map(subTopicMeta => {
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

  const finalData = { subjects };

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2), 'utf8');

  console.log('\n✅ Static data built successfully!');
  console.log(`📄 Output: ${OUTPUT_FILE}\n`);
}

try {
  buildStaticData();
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
}
