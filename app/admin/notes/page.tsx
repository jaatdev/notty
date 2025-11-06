// app/admin/notes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createNotesManager, NotesManager } from '@/lib/notesManager';
import DragDropNoteList from '@/components/admin/DragDropNoteList';
import BulkOperationsBar from '@/components/admin/BulkOperationsBar';

export default function NotesManagementPage() {
  const [manager] = useState<NotesManager>(() => createNotesManager());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const subjects = manager.listSubjects();
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const selectedTopic = selectedSubject?.topics.find(t => t.id === selectedTopicId);

  // Initialize selections
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
      if (subjects[0].topics.length > 0) {
        setSelectedTopicId(subjects[0].topics[0].id);
        if (subjects[0].topics[0].subtopics.length > 0) {
          setSelectedSubtopicId(subjects[0].topics[0].subtopics[0].id);
        }
      }
    }
  }, [subjects, selectedSubjectId]);

  const handleBulkComplete = () => {
    setSelectedNoteIds([]);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notes Management</h2>
          <p className="text-sm text-slate-500">
            Organize and manage your educational content with drag & drop
          </p>
        </div>
      </div>

      {/* Subject/Topic/Subtopic Selector */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <select
            value={selectedSubjectId ?? ''}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              const subject = subjects.find(s => s.id === e.target.value);
              setSelectedTopicId(subject?.topics[0]?.id ?? null);
              setSelectedSubtopicId(subject?.topics[0]?.subtopics[0]?.id ?? null);
              setSelectedNoteIds([]);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <select
            value={selectedTopicId ?? ''}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              const topic = selectedSubject?.topics.find(t => t.id === e.target.value);
              setSelectedSubtopicId(topic?.subtopics[0]?.id ?? null);
              setSelectedNoteIds([]);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!selectedSubject}
          >
            {selectedSubject?.topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtopic</label>
          <select
            value={selectedSubtopicId ?? ''}
            onChange={(e) => {
              setSelectedSubtopicId(e.target.value);
              setSelectedNoteIds([]);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!selectedTopic}
          >
            {selectedTopic?.subtopics.map(subtopic => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List with Drag & Drop */}
      {selectedSubjectId && selectedTopicId && selectedSubtopicId && (
        <DragDropNoteList
          key={refreshKey}
          subjectId={selectedSubjectId}
          topicId={selectedTopicId}
          subtopicId={selectedSubtopicId}
          manager={manager}
          onSelectionChange={setSelectedNoteIds}
          selectedIds={selectedNoteIds}
        />
      )}

      {/* Bulk Operations Bar */}
      {selectedNoteIds.length > 0 && selectedSubjectId && selectedTopicId && selectedSubtopicId && (
        <BulkOperationsBar
          selectedIds={selectedNoteIds}
          manager={manager}
          subjectId={selectedSubjectId}
          topicId={selectedTopicId}
          subtopicId={selectedSubtopicId}
          onComplete={handleBulkComplete}
        />
      )}
    </div>
  );
}
