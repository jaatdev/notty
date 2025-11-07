'use client';

// hooks/useRealtimeNotes.ts - Real-time updates hook
import { useEffect, useState } from 'react';
import { getSupabaseNotesManager } from '@/lib/supabase/notesManager';
import type { Subject } from '@/lib/notesManager';

export function useRealtimeNotes() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const manager = getSupabaseNotesManager();

  useEffect(() => {
    // Initial load
    loadSubjects();

    // Subscribe to real-time updates
    const unsubscribe = manager.subscribe((event) => {
      console.log('Real-time update:', event);
      // Reload data on any change
      loadSubjects();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await manager.listSubjects();
      setSubjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading subjects:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return {
    subjects,
    loading,
    error,
    reload: loadSubjects,
    manager
  };
}
