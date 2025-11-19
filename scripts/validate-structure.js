const fs = require('fs');
const path = require('path');

const CONFIG = {
  inputDir: './data/subjects'
};

function validateStructure() {
  console.log('\n🔍 Validating folder structure...\n');
  
  let errors = 0;
  let warnings = 0;

  // Check if subjects directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error('❌ Subjects directory not found!');
    return;
  }

  // Check index.json
  const indexPath = path.join(CONFIG.inputDir, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.json not found!');
    errors++;
  } else {
    console.log('✅ index.json found');
    
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      
      // Validate each subject
      index.subjects.forEach(subject => {
        const subjectDir = path.join(CONFIG.inputDir, subject.slug);
        
        if (!fs.existsSync(subjectDir)) {
          console.error(`❌ Subject folder missing: ${subject.slug}`);
          errors++;
          return;
        }

        const subjectFile = path.join(subjectDir, 'subject.json');
        if (!fs.existsSync(subjectFile)) {
          console.error(`❌ subject.json missing in: ${subject.slug}`);
          errors++;
        } else {
          console.log(`  ✅ ${subject.title}`);
          
          try {
            const subjectData = JSON.parse(fs.readFileSync(subjectFile, 'utf8'));
            
            // Validate topics
            subjectData.topics.forEach(topic => {
              const topicDir = path.join(subjectDir, topic.slug);
              
              if (!fs.existsSync(topicDir)) {
                console.error(`    ❌ Topic folder missing: ${topic.slug}`);
                errors++;
                return;
              }

              const topicFile = path.join(topicDir, 'topic.json');
              if (!fs.existsSync(topicFile)) {
                console.error(`    ❌ topic.json missing in: ${topic.slug}`);
                errors++;
              } else {
                console.log(`    ✅ ${topic.title}`);

                try {
                  const topicData = JSON.parse(fs.readFileSync(topicFile, 'utf8'));
                  
                  // Validate sub-topics
                  topicData.subTopics.forEach(subTopic => {
                    const subTopicDir = path.join(topicDir, subTopic.slug);
                    
                    if (!fs.existsSync(subTopicDir)) {
                      console.error(`      ❌ Sub-topic folder missing: ${subTopic.slug}`);
                      errors++;
                      return;
                    }

                    const requiredFiles = ['subtopic.json'];
                    const optionalFiles = ['content.json', 'quiz.json'];
                    
                    requiredFiles.forEach(file => {
                      if (!fs.existsSync(path.join(subTopicDir, file))) {
                        console.error(`      ❌ ${file} missing in: ${subTopic.slug}`);
                        errors++;
                      }
                    });

                    let hasContent = false;
                    let hasQuiz = false;

                    optionalFiles.forEach(file => {
                      const filePath = path.join(subTopicDir, file);
                      if (!fs.existsSync(filePath)) {
                        console.warn(`      ⚠️  ${file} missing in: ${subTopic.slug}`);
                        warnings++;
                      } else {
                        if (file === 'content.json') hasContent = true;
                        if (file === 'quiz.json') hasQuiz = true;
                      }
                    });

                    if (errors === 0 && hasContent && hasQuiz) {
                      console.log(`      ✅ ${subTopic.title}`);
                    } else if (errors === 0) {
                      console.log(`      ⚠️  ${subTopic.title} (incomplete)`);
                    }
                  });
                } catch (e) {
                  console.error(`    ❌ Invalid topic.json in: ${topic.slug}`);
                  errors++;
                }
              }
            });
          } catch (e) {
            console.error(`  ❌ Invalid subject.json in: ${subject.slug}`);
            errors++;
          }
        }
      });
    } catch (e) {
      console.error('❌ Invalid index.json format');
      console.error(e.message);
      errors++;
    }
  }

  console.log('\n' + '━'.repeat(50));
  if (errors === 0 && warnings === 0) {
    console.log('✅ Structure is perfect! No errors or warnings.');
  } else {
    console.log(`📊 Errors: ${errors} | Warnings: ${warnings}`);
    if (errors > 0) {
      console.log('❌ Please fix errors before proceeding.');
    }
    if (warnings > 0) {
      console.log('⚠️  Warnings indicate missing optional files.');
    }
  }
  console.log('━'.repeat(50) + '\n');
  
  return { errors, warnings };
}

const result = validateStructure();
process.exit(result.errors > 0 ? 1 : 0);
