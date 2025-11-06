// components/admin/NoteBoxCreator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { NotesManager } from '@/lib/notesManager';
import { NoteBoxType, NoteBox } from '@/lib/admin-types';
import { themeMap } from '@/lib/admin-themes';
import NoteBoxPreview from '@/components/admin/NoteBoxPreview';

interface Props {
  subjectId: string;
  manager: NotesManager;
  onNoteCreated?: () => void;
}

const NOTE_TYPES: Array<{ value: NoteBoxType; label: string; icon: string }> = [
  { value: 'big-notes', label: 'Big Notes', icon: '📝' },
  { value: 'small-notes', label: 'Small Notes', icon: '📌' },
  { value: 'right-wrong', label: 'Right/Wrong', icon: '✅' },
  { value: 'mnemonic-magic', label: 'Mnemonic Magic', icon: '🧠' },
  { value: 'mnemonic-card', label: 'Mnemonic Card', icon: '🃏' },
  { value: 'container-notes', label: 'Container Notes', icon: '📦' },
  { value: 'quick-reference', label: 'Quick Reference', icon: '⚡' },
  { value: 'flashcard', label: 'Flashcard', icon: '🎴' },
];

// Content templates for each note type
const CONTENT_TEMPLATES: Record<NoteBoxType, any> = {
  'big-notes': {
    heading: 'Main Concept',
    body: 'Detailed explanation here...'
  },
  'small-notes': {
    points: ['Point 1', 'Point 2', 'Point 3']
  },
  'right-wrong': {
    correct: ['Correct item 1'],
    incorrect: ['Incorrect item 1']
  },
  'mnemonic-magic': {
    mnemonic: 'ACRONYM',
    breakdown: {
      A: 'First word',
      C: 'Second word'
    }
  },
  'mnemonic-card': {
    title: 'Memory Card',
    items: ['Item 1', 'Item 2']
  },
  'container-notes': {
    sections: [
      { title: 'Section 1', content: 'Content here' }
    ]
  },
  'quick-reference': {
    facts: [
      { id: '1', label: 'Fact', value: 'Value' }
    ]
  },
  'flashcard': {
    cards: [
      { id: '1', question: 'Question?', answer: 'Answer' }
    ]
  }
};

export default function NoteBoxCreator({ 
  subjectId, 
  manager, 
  onNoteCreated 
}: Props) {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [subtopicId, setSubtopicId] = useState<string | null>(null);
  const [noteType, setNoteType] = useState<NoteBoxType>('big-notes');
  const [themeId, setThemeId] = useState<string>(Object.keys(themeMap)[0]);
  const [title, setTitle] = useState<string>('');
  const [contentJson, setContentJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

  const subject = manager.getSubject(subjectId);
  const topics = subject?.topics ?? [];
  const selectedTopic = topics.find(t => t.id === topicId);
  const subtopics = selectedTopic?.subtopics ?? [];

  // Initialize with first topic/subtopic
  useEffect(() => {
    if (topics.length > 0 && !topicId) {
      setTopicId(topics[0].id);
      setSubtopicId(topics[0].subtopics[0]?.id ?? null);
    }
  }, [topics, topicId]);

  // Update content template when type changes
  useEffect(() => {
    const template = CONTENT_TEMPLATES[noteType];
    setContentJson(JSON.stringify(template, null, 2));
    setJsonError('');
  }, [noteType]);

  // Validate JSON
  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError('Invalid JSON format');
      return false;
    }
  };

  // Create topic
  const handleCreateTopic = () => {
    const topicName = prompt('Topic name:');
    if (!topicName) return;
    
    const newTopic = manager.createTopic(subjectId, topicName);
    if (!newTopic) return;
    
    const newSubtopic = manager.createSubtopic(
      subjectId, 
      newTopic.id, 
      'General'
    );
    
    setTopicId(newTopic.id);
    setSubtopicId(newSubtopic?.id ?? null);
  };

  // Create subtopic
  const handleCreateSubtopic = () => {
    if (!topicId) return;
    
    const subtopicName = prompt('Subtopic name:');
    if (!subtopicName) return;
    
    const newSubtopic = manager.createSubtopic(
      subjectId, 
      topicId, 
      subtopicName
    );
    setSubtopicId(newSubtopic?.id ?? null);
  };

  // Create note
  const handleCreateNote = () => {
    if (!topicId || !subtopicId) {
      alert('Please select or create a topic and subtopic first.');
      return;
    }

    if (!validateJson(contentJson)) {
      alert('Please fix JSON errors before creating the note.');
      return;
    }

    const content = JSON.parse(contentJson);
    const noteTitle = title || `${noteType} - ${new Date().toLocaleString()}`;

    const note = manager.createNoteBox(
      subjectId,
      topicId,
      subtopicId,
      noteType,
      content,
      themeId
    );

    if (note) {
      alert(`Note created successfully!\nID: ${note.id}`);
      
      // Reset form
      setTitle('');
      setContentJson(JSON.stringify(CONTENT_TEMPLATES[noteType], null, 2));
      
      // Call callback if provided
      onNoteCreated?.();
    } else {
      alert('Failed to create note. Check console for details.');
    }
  };

  // Generate preview note
  const previewNote: NoteBox = {
    id: 'preview',
    type: noteType,
    title: title || 'Preview Note',
    content: (() => {
      try {
        return JSON.parse(contentJson);
      } catch {
        return CONTENT_TEMPLATES[noteType];
      }
    })(),
    themeId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Form Column */}
      <div className="col-span-12 lg:col-span-6 space-y-4">
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <div className="flex gap-2">
            <select 
              value={topicId ?? ''} 
              onChange={(e) => {
                setTopicId(e.target.value);
                const topic = topics.find(t => t.id === e.target.value);
                setSubtopicId(topic?.subtopics[0]?.id ?? null);
              }}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select topic...</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
            <button 
              onClick={handleCreateTopic}
              className="px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              + New
            </button>
          </div>
        </div>

        {/* Subtopic Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Subtopic</label>
          <div className="flex gap-2">
            <select 
              value={subtopicId ?? ''} 
              onChange={(e) => setSubtopicId(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!topicId}
            >
              <option value="">Select subtopic...</option>
              {subtopics.map(subtopic => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.title}
                </option>
              ))}
            </select>
            <button 
              onClick={handleCreateSubtopic}
              disabled={!topicId}
              className="px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + New
            </button>
          </div>
        </div>

        {/* Note Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Note Type</label>
          <select 
            value={noteType} 
            onChange={(e) => setNoteType(e.target.value as NoteBoxType)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {NOTE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select 
            value={themeId} 
            onChange={(e) => setThemeId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(themeMap).map(([id, theme]) => (
              <option key={id} value={id}>
                {theme.name} ({theme.id})
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title (optional)
          </label>
          <input 
            type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Content JSON */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content (JSON)
          </label>
          <textarea 
            value={contentJson} 
            onChange={(e) => {
              setContentJson(e.target.value);
              validateJson(e.target.value);
            }}
            className={`
              w-full h-48 px-3 py-2 font-mono text-sm border rounded-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${jsonError ? 'border-red-500' : 'border-slate-200'}
            `}
            placeholder="Enter JSON content..."
          />
          {jsonError && (
            <p className="mt-1 text-sm text-red-500">{jsonError}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Tip: Content structure depends on the selected note type
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateNote}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Note
          </button>
          <button 
            onClick={() => {
              setTitle('');
              setContentJson(JSON.stringify(CONTENT_TEMPLATES[noteType], null, 2));
              setJsonError('');
            }}
            className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* Preview Column */}
      <div className="col-span-12 lg:col-span-6">
        <div className="sticky top-6">
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <h4 className="font-semibold mb-3">Live Preview</h4>
            <div className="bg-white rounded-lg p-4">
              <NoteBoxPreview note={previewNote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
