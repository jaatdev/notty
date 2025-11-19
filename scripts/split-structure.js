const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  inputFile: './data/notes.json',           // Your original JSON file
  outputDir: './data/subjects',            // Output directory
  prettyPrint: true,                  // Format JSON nicely
  indent: 2                          // Indentation spaces
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created: ${dirPath}`);
  }
}

/**
 * Write JSON file with pretty formatting
 */
function writeJSON(filePath, data) {
  const content = CONFIG.prettyPrint 
    ? JSON.stringify(data, null, CONFIG.indent)
    : JSON.stringify(data);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`📄 Created: ${filePath}`);
}

/**
 * Extract only metadata (remove nested data)
 */
function extractMetadata(obj, keysToRemove = []) {
  const cleaned = { ...obj };
  keysToRemove.forEach(key => delete cleaned[key]);
  return cleaned;
}

// ============================================
// MAIN TRANSFORMATION LOGIC
// ============================================

/**
 * Process entire JSON structure
 */
function transformStructure(data) {
  console.log('\n🚀 Starting transformation...\n');

  // Create base directory
  ensureDir(CONFIG.outputDir);

  // 1. Create subjects/index.json
  createSubjectsIndex(data.subjects);

  // 2. Process each subject
  data.subjects.forEach(subject => {
    processSubject(subject);
  });

  console.log('\n✨ Transformation complete!\n');
}

/**
 * Create main index file
 */
function createSubjectsIndex(subjects) {
  const index = {
    subjects: subjects.map(s => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      emoji: s.emoji,
      brandColor: s.brandColor,
      description: s.description
    }))
  };

  writeJSON(path.join(CONFIG.outputDir, 'index.json'), index);
}

/**
 * Process individual subject
 */
function processSubject(subject) {
  console.log(`\n📚 Processing Subject: ${subject.title}`);
  
  const subjectDir = path.join(CONFIG.outputDir, subject.slug);
  ensureDir(subjectDir);

  // Create subject.json
  const subjectMeta = {
    ...extractMetadata(subject, ['topics']),
    topics: subject.topics.map(t => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description
    }))
  };

  writeJSON(path.join(subjectDir, 'subject.json'), subjectMeta);

  // Process each topic
  subject.topics.forEach(topic => {
    processTopic(topic, subjectDir);
  });
}

/**
 * Process individual topic
 */
function processTopic(topic, subjectDir) {
  console.log(`  📖 Processing Topic: ${topic.title}`);
  
  const topicDir = path.join(subjectDir, topic.slug);
  ensureDir(topicDir);

  // Create topic.json
  const topicMeta = {
    ...extractMetadata(topic, ['subTopics']),
    subTopics: topic.subTopics.map(st => ({
      id: st.id,
      slug: st.slug,
      title: st.title,
      description: st.description
    }))
  };

  writeJSON(path.join(topicDir, 'topic.json'), topicMeta);

  // Process each sub-topic
  topic.subTopics.forEach(subTopic => {
    processSubTopic(subTopic, topicDir);
  });
}

/**
 * Process individual sub-topic
 */
function processSubTopic(subTopic, topicDir) {
  console.log(`    📝 Processing Sub-topic: ${subTopic.title}`);
  
  const subTopicDir = path.join(topicDir, subTopic.slug);
  ensureDir(subTopicDir);

  // 1. Create subtopic.json (metadata only)
  const subTopicMeta = {
    id: subTopic.id,
    slug: subTopic.slug,
    title: subTopic.title,
    description: subTopic.description,
    contentCount: subTopic.content?.length || 0,
    quizCount: subTopic.quiz?.length || 0,
    createdAt: subTopic.createdAt,
    updatedAt: subTopic.updatedAt
  };

  writeJSON(path.join(subTopicDir, 'subtopic.json'), subTopicMeta);

  // 2. Create content.json
  if (subTopic.content && subTopic.content.length > 0) {
    const contentData = {
      items: subTopic.content
    };
    writeJSON(path.join(subTopicDir, 'content.json'), contentData);
  }

  // 3. Create quiz.json
  if (subTopic.quiz && subTopic.quiz.length > 0) {
    const quizData = {
      questions: subTopic.quiz
    };
    writeJSON(path.join(subTopicDir, 'quiz.json'), quizData);
  }
}

// ============================================
// EXECUTION
// ============================================

try {
  // Read input file
  console.log(`📖 Reading: ${CONFIG.inputFile}`);
  const rawData = fs.readFileSync(CONFIG.inputFile, 'utf8');
  const data = JSON.parse(rawData);

  // Transform
  transformStructure(data);

  console.log('━'.repeat(50));
  console.log('✅ SUCCESS! Your folder structure is ready.');
  console.log(`📁 Location: ${path.resolve(CONFIG.outputDir)}`);
  console.log('━'.repeat(50));

} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
