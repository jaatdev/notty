// lib/supabase/notesManager.ts - Cloud-synced notes manager with real-time
// @ts-nocheck - Type inference issues with Supabase client, to be fixed with generated types
import { supabase } from '../supabase';
import type { Database } from './database.types';
import type { NoteBoxType } from '@/lib/admin-types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Import types from notesManager
import type { 
  Subject, 
  NoteTopic, 
  NoteSubtopic, 
} from '@/lib/notesManager';
import type { NoteBox } from '@/lib/admin-types';

// Map to local types
type Topic = NoteTopic;
type Subtopic = NoteSubtopic;

type Tables = Database['public']['Tables'];

export class SupabaseNotesManager {
  private channel: RealtimeChannel | null = null;
  private subscribers: Set<(event: any) => void> = new Set();

  constructor() {
    this.initializeRealtime();
  }

  // =====================================================
  // REAL-TIME SUBSCRIPTIONS
  // =====================================================
  private initializeRealtime() {
    this.channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subjects' },
        (payload) => this.notifySubscribers({ type: 'subjects', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'topics' },
        (payload) => this.notifySubscribers({ type: 'topics', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subtopics' },
        (payload) => this.notifySubscribers({ type: 'subtopics', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'note_boxes' },
        (payload) => this.notifySubscribers({ type: 'note_boxes', payload })
      )
      .subscribe();
  }

  subscribe(callback: (event: any) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(event: any) {
    this.subscribers.forEach(callback => callback(event));
  }

  async cleanup() {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
    }
  }

  // =====================================================
  // SUBJECTS
  // =====================================================
  async listSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        topics:topics(
          *,
          subtopics:subtopics(
            *,
            note_boxes:note_boxes(*)
          )
        )
      `)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }

    return this.transformSubjects(data || []);
  }

  async getSubject(id: string): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        topics:topics(
          *,
          subtopics:subtopics(
            *,
            note_boxes:note_boxes(*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subject:', error);
      return null;
    }

    return this.transformSubject(data);
  }

  async createSubject(title: string, description?: string): Promise<Subject> {
    const user = await supabase.auth.getUser();
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        title,
        slug,
        description: description || null,
        created_by: user.data.user?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subject:', error);
      throw error;
    }

    await this.logActivity('create', 'subject', data.id, { title });

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      icon: data.icon || undefined,
      color: data.color || undefined,
      topics: []
    };
  }

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .update({
        title: updates.title,
        description: updates.description || null,
        icon: updates.icon || null,
        color: updates.color || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subject:', error);
      throw error;
    }

    await this.logActivity('update', 'subject', id, updates);

    return this.transformSubject(data);
  }

  async deleteSubject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subject:', error);
      return false;
    }

    await this.logActivity('delete', 'subject', id);
    return true;
  }

  // =====================================================
  // TOPICS
  // =====================================================
  async createTopic(subjectId: string, title: string): Promise<Topic> {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    const { data, error } = await supabase
      .from('topics')
      .insert({
        subject_id: subjectId,
        title,
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating topic:', error);
      throw error;
    }

    await this.logActivity('create', 'topic', data.id, { title, subjectId });

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      subtopics: []
    };
  }

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic> {
    const { data, error } = await supabase
      .from('topics')
      .update({
        title: updates.title,
        description: updates.description || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating topic:', error);
      throw error;
    }

    await this.logActivity('update', 'topic', id, updates);

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      subtopics: []
    };
  }

  async deleteTopic(subjectId: string, topicId: string): Promise<boolean> {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
      return false;
    }

    await this.logActivity('delete', 'topic', topicId);
    return true;
  }

  // =====================================================
  // SUBTOPICS
  // =====================================================
  async createSubtopic(topicId: string, title: string): Promise<Subtopic> {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    const { data, error } = await supabase
      .from('subtopics')
      .insert({
        topic_id: topicId,
        title,
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subtopic:', error);
      throw error;
    }

    await this.logActivity('create', 'subtopic', data.id, { title, topicId });

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      notes: []
    };
  }

  async updateSubtopic(id: string, updates: Partial<Subtopic>): Promise<Subtopic> {
    const { data, error } = await supabase
      .from('subtopics')
      .update({
        title: updates.title,
        description: updates.description || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subtopic:', error);
      throw error;
    }

    await this.logActivity('update', 'subtopic', id, updates);

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      notes: []
    };
  }

  async deleteSubtopic(topicId: string, subtopicId: string): Promise<boolean> {
    const { error } = await supabase
      .from('subtopics')
      .delete()
      .eq('id', subtopicId);

    if (error) {
      console.error('Error deleting subtopic:', error);
      return false;
    }

    await this.logActivity('delete', 'subtopic', subtopicId);
    return true;
  }

  // =====================================================
  // NOTE BOXES
  // =====================================================
  async createNoteBox(
    subtopicId: string,
    type: NoteBoxType,
    title: string,
    content: any,
    themeId?: string
  ): Promise<NoteBox> {
    const user = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('note_boxes')
      .insert({
        subtopic_id: subtopicId,
        type,
        title,
        content,
        theme_id: themeId || 'default',
        created_by: user.data.user?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note box:', error);
      throw error;
    }

    await this.logActivity('create', 'note_box', data.id, { 
      title, 
      type, 
      subtopicId 
    });

    return {
      id: data.id,
      type: data.type as NoteBoxType,
      title: data.title,
      content: data.content,
      themeId: data.theme_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async updateNoteBox(id: string, updates: Partial<NoteBox>): Promise<NoteBox> {
    const { data, error } = await supabase
      .from('note_boxes')
      .update({
        title: updates.title,
        content: updates.content,
        theme_id: updates.themeId,
        type: updates.type,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note box:', error);
      throw error;
    }

    await this.logActivity('update', 'note_box', id, updates);

    return {
      id: data.id,
      type: data.type as NoteBoxType,
      title: data.title,
      content: data.content,
      themeId: data.theme_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async deleteNoteBox(noteId: string): Promise<boolean> {
    const { error } = await supabase
      .from('note_boxes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note box:', error);
      return false;
    }

    await this.logActivity('delete', 'note_box', noteId);
    return true;
  }

  // =====================================================
  // REORDERING
  // =====================================================
  async reorderNoteBoxes(subtopicId: string, noteIds: string[]): Promise<boolean> {
    const updates = noteIds.map((id, index) => ({
      id,
      order_index: index
    }));

    const { error } = await supabase.rpc('batch_update_note_order', {
      updates
    });

    if (error) {
      console.error('Error reordering notes:', error);
      return false;
    }

    await this.logActivity('reorder', 'note_boxes', subtopicId, { noteIds });
    return true;
  }

  // =====================================================
  // COLLABORATION
  // =====================================================
  async addCollaborator(
    subjectId: string,
    email: string,
    role: 'viewer' | 'editor' | 'admin'
  ): Promise<boolean> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!profile) {
      console.error('User not found');
      return false;
    }

    const { error } = await supabase
      .from('collaborators')
      .insert({
        subject_id: subjectId,
        user_id: profile.id,
        role
      });

    if (error) {
      console.error('Error adding collaborator:', error);
      return false;
    }

    await this.logActivity('add_collaborator', 'subject', subjectId, {
      email,
      role
    });

    return true;
  }

  async removeCollaborator(subjectId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('subject_id', subjectId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing collaborator:', error);
      return false;
    }

    await this.logActivity('remove_collaborator', 'subject', subjectId, {
      userId
    });

    return true;
  }

  async getCollaborators(subjectId: string) {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error fetching collaborators:', error);
      return [];
    }

    return data;
  }

  // =====================================================
  // ACTIVITY LOGGING
  // =====================================================
  private async logActivity(
    action: string,
    entityType: string,
    entityId: string | null,
    metadata?: any
  ) {
    const user = await supabase.auth.getUser();
    
    await supabase
      .from('activity_log')
      .insert({
        user_id: user.data.user?.id || null,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata
      });
  }

  async getActivityLog(limit: number = 50) {
    const { data, error } = await supabase
      .from('activity_log')
      .select(`
        *,
        user:profiles(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity log:', error);
      return [];
    }

    return data;
  }

  // =====================================================
  // HELPERS
  // =====================================================
  private transformSubjects(data: any[]): Subject[] {
    return data.map(subject => this.transformSubject(subject));
  }

  private transformSubject(data: any): Subject {
    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      icon: data.icon || undefined,
      color: data.color || undefined,
      topics: (data.topics || []).map((topic: any) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description || undefined,
        subtopics: (topic.subtopics || []).map((subtopic: any) => ({
          id: subtopic.id,
          title: subtopic.title,
          description: subtopic.description || undefined,
          notes: (subtopic.note_boxes || []).map((note: any) => ({
            id: note.id,
            type: note.type as NoteBoxType,
            title: note.title,
            content: note.content,
            themeId: note.theme_id,
            createdAt: note.created_at,
            updatedAt: note.updated_at
          }))
        }))
      }))
    };
  }
}

// Singleton instance
let instance: SupabaseNotesManager | null = null;

export function getSupabaseNotesManager(): SupabaseNotesManager {
  if (!instance) {
    instance = new SupabaseNotesManager();
  }
  return instance;
}
