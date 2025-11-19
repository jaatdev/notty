const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  inputDir: './data/subjects',
  outputFile: './data/notes-combined.json',
  prettyPrint: true,
  indent: 2
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}`);
    return null;
  }
}

function getSubdirectories(dirPath) {
  return fs.readdirSync(dirPath)
    .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());
}

// ============================================
// COMBINE LOGIC
// ============================================

function combineStructure() {
  console.log('\n🔄 Combining folder structure into single JSON...\n');

  const indexPath = path.join(CONFIG.inputDir, 'index.json');
  const index = readJSON(indexPath);

  if (!index || !index.subjects) {
    throw new Error('Invalid index.json structure');
  }

  const subjects = index.subjects.map(subjectMeta => {
    console.log(`📚 Processing: ${subjectMeta.title}`);
    
    const subjectDir = path.join(CONFIG.inputDir, subjectMeta.slug);
    const subjectData = readJSON(path.join(subjectDir, 'subject.json'));

    const topics = subjectData.topics.map(topicMeta => {
      console.log(`  📖 Processing: ${topicMeta.title}`);
      
      const topicDir = path.join(subjectDir, topicMeta.slug);
      const topicData = readJSON(path.join(topicDir, 'topic.json'));

      const subTopics = topicData.subTopics.map(subTopicMeta => {
        console.log(`    📝 Processing: ${subTopicMeta.title}`);
        
        const subTopicDir = path.join(topicDir, subTopicMeta.slug);
        const subTopicData = readJSON(path.join(subTopicDir, 'subtopic.json'));
        const contentData = readJSON(path.join(subTopicDir, 'content.json'));
        const quizData = readJSON(path.join(subTopicDir, 'quiz.json'));

        return {
          ...subTopicData,
          content: contentData?.items || [],
          quiz: quizData?.questions || []
        };
      });

      return {
        ...topicData,
        subTopics
      };
    });

    return {
      ...subjectData,
      topics
    };
  });

  const finalData = { subjects };

  // Write output
  const content = CONFIG.prettyPrint 
    ? JSON.stringify(finalData, null, CONFIG.indent)
    : JSON.stringify(finalData);

  fs.writeFileSync(CONFIG.outputFile, content, 'utf8');

  console.log('\n✅ Successfully combined!');
  console.log(`📄 Output: ${path.resolve(CONFIG.outputFile)}\n`);
}

// ============================================
// EXECUTION
// ============================================

try {
  combineStructure();
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
