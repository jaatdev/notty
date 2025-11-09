// app/admin/notes/new/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import NoteBoxCreatorModern from '@/components/admin/NoteBoxCreatorModern';
import type { NoteBox } from '@/lib/admin-types';
import { createNotesManager } from '@/lib/notesManager';
import { getAllSubjects } from '@/lib/data';

const NOTES_MANAGER = createNotesManager();

export default function NewNotePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [ids, setIds] = useState({ subjectId: '', topicId: '', subtopicId: '' });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [existingNotes, setExistingNotes] = useState<NoteBox[]>([]);

  useEffect(() => {
    // First, check if notesManager has data
    let allSubjects = NOTES_MANAGER.listSubjects();
    
    // If empty, import from notes.json
    if (allSubjects.length === 0) {
      console.log('📥 Importing data from notes.json into notesManager...');
      const dataFromJson = getAllSubjects();
      
      // Convert and import the data
      dataFromJson.forEach(subject => {
        const newSubject = NOTES_MANAGER.createSubject(subject.title, subject.slug);
        
        subject.topics.forEach(topic => {
          const newTopic = NOTES_MANAGER.createTopic(newSubject.id, topic.title);
          
          if (newTopic) {
            topic.subTopics?.forEach(subtopic => {
              NOTES_MANAGER.createSubtopic(newSubject.id, newTopic.id, subtopic.title);
            });
          }
        });
      });
      
      console.log('✅ Data imported successfully!');
      allSubjects = NOTES_MANAGER.listSubjects();
    }
    
    console.log('📚 Loaded subjects from notesManager:', allSubjects);
    setSubjects(allSubjects);
    
    if (allSubjects.length > 0) {
      const firstSubject = allSubjects[0];
      const firstTopic = firstSubject.topics[0];
      const firstSubtopic = firstTopic?.subtopics?.[0];
      
      console.log('🎯 First subject:', firstSubject.id, firstSubject.title);
      console.log('🎯 First topic:', firstTopic?.id, firstTopic?.title);
      console.log('🎯 First subtopic:', firstSubtopic?.id, firstSubtopic?.title);
      
      if (firstTopic) {
        const subtopicId = firstSubtopic?.id || '';
        setIds({ 
          subjectId: firstSubject.id, 
          topicId: firstTopic.id, 
          subtopicId: subtopicId
        });
        setTopics(firstSubject.topics);
        setSubtopics(firstTopic.subtopics || []);
        console.log('✅ IDs set:', { subjectId: firstSubject.id, topicId: firstTopic.id, subtopicId });
      } else {
        console.warn('⚠️ No topics found in first subject!');
      }
    } else {
      console.warn('⚠️ No subjects found!');
    }
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject && subject.topics.length > 0) {
      const topic = subject.topics[0];
      const subtopic = topic.subtopics[0];
      setIds({ subjectId, topicId: topic.id, subtopicId: subtopic?.id || '' });
      setTopics(subject.topics);
      setSubtopics(topic.subtopics || []);
    }
  };

  const handleTopicChange = (topicId: string) => {
    const subject = subjects.find(s => s.id === ids.subjectId);
    if (subject) {
      const topic = subject.topics.find((t: any) => t.id === topicId);
      if (topic) {
        const subtopic = topic.subtopics[0];
        setIds({ ...ids, topicId, subtopicId: subtopic?.id || '' });
        setSubtopics(topic.subtopics || []);
      }
    }
  };

  const handleSubtopicChange = (subtopicId: string) => {
    setIds({ ...ids, subtopicId });
    refreshNotes(ids.subjectId, ids.topicId, subtopicId);
  };

  const refreshNotes = (subjectId: string, topicId: string, subtopicId: string) => {
    if (subjectId && topicId && subtopicId) {
      const subject = NOTES_MANAGER.getSubject(subjectId);
      const topic = subject?.topics.find(t => t.id === topicId);
      const subtopic = topic?.subtopics.find(st => st.id === subtopicId);
      setExistingNotes(subtopic?.notes || []);
      console.log('📝 Existing notes in this subtopic:', subtopic?.notes.length || 0);
    } else {
      setExistingNotes([]);
    }
  };

  const handleExportToJSON = () => {
    try {
      // Export the current notesManager state (returns a JSON string)
      const jsonString = NOTES_MANAGER.exportJSON();
      
      // Parse it to get the database object
      const db = JSON.parse(jsonString);
      
      // Subject emoji and brand color mappings for common subjects
      const subjectDefaults: Record<string, { emoji: string; brandColor: string; description: string }> = {
        'polity': { emoji: '🏛️', brandColor: 'indigo', description: 'Master Indian Constitution, Governance, and Political System' },
        'history': { emoji: '📜', brandColor: 'amber', description: 'Journey through Indian History and Heritage' },
        'geography': { emoji: '🌍', brandColor: 'green', description: 'Explore World and Indian Geography' },
        'economics': { emoji: '📊', brandColor: 'blue', description: 'Understand Economic Concepts and Indian Economy' },
        'science': { emoji: '🔬', brandColor: 'purple', description: 'Master Science and Technology Concepts' },
        'environment': { emoji: '🌱', brandColor: 'teal', description: 'Environmental Studies and Ecology' },
        'current-affairs': { emoji: '📰', brandColor: 'red', description: 'Stay Updated with Current Affairs' },
      };
      
      // Add required metadata to subjects and ensure correct structure
      const enrichedSubjects = (db.subjects || []).map((subject: any) => {
        // Get defaults based on slug
        const defaults = subjectDefaults[subject.slug] || subjectDefaults[subject.id] || {
          emoji: '📚',
          brandColor: 'blue',
          description: `${subject.title} - Comprehensive Study Notes`
        };
        
        // Ensure subject has ALL required fields in correct order
        const enrichedSubject = {
          id: subject.id || `sub_${subject.slug}`,
          title: subject.title,
          slug: subject.slug || subject.id,
          description: subject.description || defaults.description,
          emoji: subject.emoji || defaults.emoji,
          brandColor: subject.brandColor || defaults.brandColor,
          topics: []
        };
        
        // Transform topics with proper structure
        if (subject.topics && subject.topics.length > 0) {
          enrichedSubject.topics = subject.topics.map((topic: any) => {
            const topicId = topic.id || `top_${topic.slug || topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
            const topicSlug = topic.slug || topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            return {
              id: topicId,
              title: topic.title,
              slug: topicSlug,
              subTopics: (topic.subtopics || topic.subTopics || []).map((subtopic: any) => {
                const subtopicId = subtopic.id || `subt_${subtopic.slug || subtopic.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
                const subtopicSlug = subtopic.slug || subtopic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                // Get notes and ensure they have proper NoteBox structure
                const notes = (subtopic.notes || subtopic.content || []).map((note: any, idx: number) => {
                  // Ensure note has all required fields
                  return {
                    id: note.id || `note_${Date.now()}_${idx}`,
                    type: note.type || 'big-notes',
                    title: note.title || 'Untitled Note',
                    content: note.content || {},
                    themeId: note.themeId || 'ocean-blue',
                    order: note.order !== undefined ? note.order : idx,
                    createdAt: note.createdAt || new Date().toISOString(),
                    updatedAt: note.updatedAt || new Date().toISOString()
                  };
                });
                
                return {
                  id: subtopicId,
                  title: subtopic.title,
                  slug: subtopicSlug,
                  content: notes  // Must be 'content', not 'notes'
                };
              })
            };
          });
        }
        
        return enrichedSubject;
      });
      
      // Final export data with correct structure
      const exportData = {
        subjects: enrichedSubjects
      };
      
      // Validate the export before downloading
      console.log('📦 Export Data Preview:', JSON.stringify(exportData, null, 2).substring(0, 500));
      
      // Create a blob and download it
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`✅ Notes exported successfully!

📊 Export Summary:
• ${enrichedSubjects.length} subject(s)
• ${enrichedSubjects.reduce((acc: number, s: any) => acc + (s.topics?.length || 0), 0)} topic(s)
• Total notes exported with proper structure

📝 Next steps:
1. Find notes.json in your Downloads folder
2. Replace data/notes.json with this file
3. Refresh the main pages to see your notes

✨ All metadata, slugs, IDs, and NoteBox structure included!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Failed to export notes: ' + (error as Error).message);
    }
  };

  const handleAddSubject = () => {
    const title = prompt('Enter new subject title:');
    if (!title) return;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newSubject = {
      id: slug,
      slug,
      title,
      topics: []
    };
    
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    setIds({ subjectId: slug, topicId: '', subtopicId: '' });
    setTopics([]);
    setSubtopics([]);
  };

  const handleDeleteSubject = () => {
    if (!ids.subjectId) return;
    if (!confirm(`Delete subject "${subjects.find(s => s.id === ids.subjectId)?.title}"?`)) return;
    
    const updated = subjects.filter(s => s.id !== ids.subjectId);
    setSubjects(updated);
    
    if (updated.length > 0) {
      const firstSubject = updated[0];
      const firstTopic = firstSubject.topics[0];
      const firstSubtopic = firstTopic?.subtopics?.[0];
      setIds({
        subjectId: firstSubject.id,
        topicId: firstTopic?.id || '',
        subtopicId: firstSubtopic?.id || ''
      });
      setTopics(firstSubject.topics);
      setSubtopics(firstTopic?.subtopics || []);
    } else {
      setIds({ subjectId: '', topicId: '', subtopicId: '' });
      setTopics([]);
      setSubtopics([]);
    }
  };

  const handleAddTopic = () => {
    if (!ids.subjectId) {
      alert('Please select a subject first');
      return;
    }
    
    const title = prompt('Enter new topic title:');
    if (!title) return;
    
    const topicId = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const newTopic = {
      id: topicId,
      title,
      subtopics: []
    };
    
    const updatedSubjects = subjects.map(s => {
      if (s.id === ids.subjectId) {
        return { ...s, topics: [...s.topics, newTopic] };
      }
      return s;
    });
    
    setSubjects(updatedSubjects);
    const subject = updatedSubjects.find(s => s.id === ids.subjectId);
    if (subject) {
      setTopics(subject.topics);
      setIds({ ...ids, topicId, subtopicId: '' });
      setSubtopics([]);
    }
  };

  const handleDeleteTopic = () => {
    if (!ids.subjectId || !ids.topicId) return;
    if (!confirm(`Delete topic "${topics.find(t => t.id === ids.topicId)?.title}"?`)) return;
    
    const updatedSubjects = subjects.map(s => {
      if (s.id === ids.subjectId) {
        return { ...s, topics: s.topics.filter((t: any) => t.id !== ids.topicId) };
      }
      return s;
    });
    
    setSubjects(updatedSubjects);
    const subject = updatedSubjects.find(s => s.id === ids.subjectId);
    if (subject && subject.topics.length > 0) {
      const firstTopic = subject.topics[0];
      const firstSubtopic = firstTopic.subtopics?.[0];
      setIds({
        ...ids,
        topicId: firstTopic.id,
        subtopicId: firstSubtopic?.id || ''
      });
      setTopics(subject.topics);
      setSubtopics(firstTopic.subtopics || []);
    } else {
      setIds({ ...ids, topicId: '', subtopicId: '' });
      setTopics([]);
      setSubtopics([]);
    }
  };

  const handleAddSubtopic = () => {
    if (!ids.subjectId || !ids.topicId) {
      alert('Please select a subject and topic first');
      return;
    }
    
    const title = prompt('Enter new subtopic title:');
    if (!title) return;
    
    const subtopicId = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const newSubtopic = {
      id: subtopicId,
      title
    };
    
    const updatedSubjects = subjects.map(s => {
      if (s.id === ids.subjectId) {
        return {
          ...s,
          topics: s.topics.map((t: any) => {
            if (t.id === ids.topicId) {
              return { ...t, subtopics: [...(t.subtopics || []), newSubtopic] };
            }
            return t;
          })
        };
      }
      return s;
    });
    
    setSubjects(updatedSubjects);
    const subject = updatedSubjects.find(s => s.id === ids.subjectId);
    if (subject) {
      const topic = subject.topics.find((t: any) => t.id === ids.topicId);
      if (topic) {
        setSubtopics(topic.subtopics || []);
        setIds({ ...ids, subtopicId });
      }
    }
  };

  const handleDeleteSubtopic = () => {
    if (!ids.subjectId || !ids.topicId || !ids.subtopicId) return;
    if (!confirm(`Delete subtopic "${subtopics.find(st => st.id === ids.subtopicId)?.title}"?`)) return;
    
    const updatedSubjects = subjects.map(s => {
      if (s.id === ids.subjectId) {
        return {
          ...s,
          topics: s.topics.map((t: any) => {
            if (t.id === ids.topicId) {
              return { ...t, subtopics: (t.subtopics || []).filter((st: any) => st.id !== ids.subtopicId) };
            }
            return t;
          })
        };
      }
      return s;
    });
    
    setSubjects(updatedSubjects);
    const subject = updatedSubjects.find(s => s.id === ids.subjectId);
    if (subject) {
      const topic = subject.topics.find((t: any) => t.id === ids.topicId);
      if (topic && topic.subtopics && topic.subtopics.length > 0) {
        const firstSubtopic = topic.subtopics[0];
        setIds({ ...ids, subtopicId: firstSubtopic.id });
        setSubtopics(topic.subtopics);
      } else {
        setIds({ ...ids, subtopicId: '' });
        setSubtopics([]);
      }
    }
  };

  // Auth guard: show login message if not authenticated
  if (!isLoaded) {
    return <div className="p-6 text-slate-400 text-center">🔄 Loading Clerk auth...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 text-slate-400 text-center max-w-md mx-auto mt-20">
        <div className="text-6xl mb-6">🔐</div>
        <div className="text-2xl mb-4 text-white font-semibold">Access Denied</div>
        <p className="mb-6">You must be signed in to access the admin panel.</p>
        <a 
          href="/sign-in" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Sign In →
        </a>
      </div>
    );
  }

  if (!ids.subjectId) return <div className="p-4 text-slate-400">Loading subjects...</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <NoteBoxCreatorModern 
        subjectId={ids.subjectId} 
        topicId={ids.topicId} 
        subtopicId={ids.subtopicId} 
        subjects={subjects}
        onSubjectChange={handleSubjectChange}
        onTopicChange={handleTopicChange}
        onSubtopicChange={handleSubtopicChange}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
        onAddTopic={handleAddTopic}
        onDeleteTopic={handleDeleteTopic}
        onAddSubtopic={handleAddSubtopic}
        onDeleteSubtopic={handleDeleteSubtopic}
        onCreated={(n: NoteBox) => {
          console.log('✅ Note created:', n);
          refreshNotes(ids.subjectId, ids.topicId, ids.subtopicId);
        }} 
      />
    </div>
  );
}

