const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, '..', 'data', 'notes.json');
const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));

function fixQuizQuestion(q) {
  if (q.options && Array.isArray(q.options) && q.options.length > 0 && typeof q.options[0] === 'object') {
    // Old format - convert
    const newOptions = q.options.map(opt => opt.text);
    const answerIndex = q.options.findIndex(opt => opt.id === q.correctOptionId);
    
    return {
      id: q.id,
      prompt: q.prompt,
      options: newOptions,
      answerIndex: answerIndex,
      reason: q.explanation,
      meta: q.meta
    };
  }
  return q;
}

function fixTopic(topic) {
  if (topic.quiz) {
    topic.quiz = topic.quiz.map(fixQuizQuestion);
  }
  if (topic.subTopics) {
    topic.subTopics = topic.subTopics.map(fixTopic);
  }
  return topic;
}

// Fix all subjects
notes.subjects = notes.subjects.map(subject => {
  if (subject.topics) {
    subject.topics = subject.topics.map(fixTopic);
  }
  return subject;
});

// Write back
fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf8');
console.log('✅ Fixed quiz format in notes.json');
