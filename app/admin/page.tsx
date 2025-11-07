// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createNotesManager, NotesManager } from '@/lib/notesManager';
import type { Subject } from '@/lib/notesManager';
import { useAuth } from '@/components/auth/AuthProvider';
import NoteBoxCreator from '@/components/admin/NoteBoxCreator';
// Import sample data if available
// import sampleData from '@/data/sample-notes.json';

export default function AdminDashboard() {
  const [manager] = useState<NotesManager>(() => createNotesManager());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  // Load subjects only on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const loadedSubjects = manager.listSubjects();
    setSubjects(loadedSubjects);
    if (loadedSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(loadedSubjects[0].id);
    }
  }, [manager, selectedSubjectId]);

  // Refresh subjects list helper
  const refreshSubjects = () => {
    const updated = manager.listSubjects();
    setSubjects(updated);
    return updated;
  };

  // Create new subject
  const handleCreateSubject = () => {
    const timestamp = new Date().toLocaleTimeString();
    const newSubject = manager.createSubject(`New Subject (${timestamp})`);
    refreshSubjects();
    setSelectedSubjectId(newSubject.id);
  };

  // Delete subject
  const handleDeleteSubject = (id: string) => {
    if (!confirm('Delete this subject and all its content?')) return;
    
    manager.deleteSubject(id);
    const updated = refreshSubjects();
    
    if (selectedSubjectId === id) {
      setSelectedSubjectId(updated[0]?.id ?? null);
    }
  };

  // Load sample data
  const handleLoadSample = async () => {
    try {
      // Dynamic import for sample data
      const sampleModule = await import('@/data/sample-notes.json');
      manager.loadSample(sampleModule.default as any);
      refreshSubjects();
      alert('Sample data loaded successfully!');
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Failed to load sample data. Check console for details.');
    }
  };

  // Export current data
  const handleExportData = () => {
    const jsonData = manager.exportJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notty-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
          <p className="text-sm text-slate-400">
            {user?.email ? `Welcome, ${user.email}` : 'Manage your educational content'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to logout?')) {
                  await signOut();
                }
              }}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-md hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}
          <button 
            onClick={handleCreateSubject}
            className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-md hover:opacity-90 transition-opacity"
          >
            New Subject
          </button>
          <button 
            onClick={() => {
              if (confirm('Reset all data to defaults?')) {
                manager.resetToDefault();
                refreshSubjects();
              }
            }}
            className="px-4 py-2 bg-amber-900/40 border border-amber-700/50 text-amber-200 rounded-md hover:bg-amber-900/60 transition-colors"
          >
            Reset Database
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Subjects List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="p-4 border border-slate-700 bg-slate-800/30 rounded-xl">
            <h3 className="font-semibold mb-3 text-slate-100">Subjects</h3>
            
            {!mounted ? (
              <p className="text-sm text-slate-400 text-center py-4">
                Loading...
              </p>
            ) : subjects.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No subjects yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div 
                    key={subject.id} 
                    className="flex items-center justify-between group"
                  >
                    <button 
                      className={`
                        flex-1 text-left p-3 rounded-md transition-colors
                        ${selectedSubjectId === subject.id 
                          ? 'bg-indigo-900/40 border border-indigo-700/50 text-slate-100' 
                          : 'hover:bg-slate-700/40 text-slate-300'
                        }
                      `}
                      onClick={() => setSelectedSubjectId(subject.id)}
                    >
                      <div className="font-medium">{subject.title}</div>
                      <div className="text-xs text-slate-500">
                        {subject.topics.length} topics
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="opacity-0 group-hover:opacity-100 text-sm text-red-500 hover:text-red-700 px-3 py-1 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-4 border border-slate-100 rounded-xl">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold">{subjects.length}</div>
                <div className="text-xs text-slate-500">Subjects</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {subjects.reduce((acc, s) => acc + s.topics.length, 0)}
                </div>
                <div className="text-xs text-slate-500">Topics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Note Creator */}
          <div className="p-4 border border-slate-100 rounded-xl">
            <h3 className="font-semibold mb-3">Create Note Box</h3>
            {selectedSubjectId ? (
              <NoteBoxCreator 
                subjectId={selectedSubjectId} 
                manager={manager}
                onNoteCreated={() => refreshSubjects()}
              />
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Select a subject to start creating notes</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border border-slate-100 rounded-xl">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                Load Sample Data
              </button>
              <button 
                onClick={handleExportData}
                className="px-4 py-2 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Export JSON
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(manager.exportJSON());
                  alert('Data copied to clipboard!');
                }}
                className="px-4 py-2 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
