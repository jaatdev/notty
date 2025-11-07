// app/admin/notes/new/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import NoteBoxCreator from '@/components/admin/NoteBoxCreator';
import { createNotesManager } from '@/lib/notesManager';
import type { NoteBox } from '@/lib/admin-types';

export default function NewNotePage() {
  const manager = createNotesManager();
  const [ids, setIds] = useState({ subjectId: '', topicId: '', subtopicId: '' });

  useEffect(() => {
    const subjects = manager.listSubjects();
    if (subjects.length === 0) {
      const s = manager.createSubject('Admin Subject');
      const t = manager.createTopic(s.id, 'Default Topic');
      if (!t) return;
      const st = manager.createSubtopic(s.id, t.id, 'Default Subtopic');
      if (!st) return;
      setIds({ subjectId: s.id, topicId: t.id, subtopicId: st.id });
    } else {
      const s = subjects[0];
      const t = s.topics[0];
      if (t) {
        const st = t.subtopics[0];
        if (st) {
          setIds({ subjectId: s.id, topicId: t.id, subtopicId: st.id });
        } else {
          const newSt = manager.createSubtopic(s.id, t.id, 'Default Subtopic');
          if (!newSt) return;
          setIds({ subjectId: s.id, topicId: t.id, subtopicId: newSt.id });
        }
      } else {
        const newT = manager.createTopic(s.id, 'Default Topic');
        if (!newT) return;
        const newSt = manager.createSubtopic(s.id, newT.id, 'Default Subtopic');
        if (!newSt) return;
        setIds({ subjectId: s.id, topicId: newT.id, subtopicId: newSt.id });
      }
    }
  }, []);

  if (!ids.subjectId) return <div>Preparing...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Create a new Note</h2>
      <NoteBoxCreator 
        subjectId={ids.subjectId} 
        topicId={ids.topicId} 
        subtopicId={ids.subtopicId} 
        onCreated={(n: NoteBox) => {
          console.log('created note', n);
        }} 
      />
    </div>
  );
}
