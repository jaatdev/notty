// ============================================================================
// CLIENT-SIDE ADMIN NOTES MANAGER
// CRUD operations for subjects → topics → subtopics → noteBoxes
// Local persistence using localStorage (browser) for dev
// ============================================================================

import {
  NoteBox,
  NoteBoxType,
  BigNotesContent,
  SmallNotesContent,
  RightWrongContent,
  MnemonicMagicContent,
  MnemonicCardContent,
  ContainerNotesContent,
  QuickReferenceContent,
  FlashcardContent,
} from '@/lib/admin-types';

import { themeMap } from '@/lib/admin-themes';

type ID = string;

function generateId(prefix = ''): ID {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/**
 * Data shapes:
 *  - subjects: { id, title, slug, topics: [ { id, title, slug, subtopics: [ { id, title, slug, notes: NoteBox[] } ] } ] }
 */
export interface NoteSubtopic {
  id: ID;
  title: string;
  slug?: string;
  notes: NoteBox[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteTopic {
  id: ID;
  title: string;
  slug?: string;
  subtopics: NoteSubtopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: ID;
  title: string;
  slug?: string;
  topics: NoteTopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NotesDB {
  subjects: Subject[];
  meta?: { version?: number; updatedAt?: string };
}

const LOCALSTORAGE_KEY = 'admin_content_v1';

const defaultDB: NotesDB = {
  subjects: [],
  meta: { version: 1, updatedAt: new Date().toISOString() },
};

/* -------------------------
   Low-level persistence
   ------------------------- */

function loadFromLocalStorage(): NotesDB {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LOCALSTORAGE_KEY) : null;
    if (!raw) return deepClone(defaultDB);
    return JSON.parse(raw) as NotesDB;
  } catch (err) {
    console.warn('Failed to load notes from localStorage', err);
    return deepClone(defaultDB);
  }
}

function saveToLocalStorage(db: NotesDB) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(db));
    }
  } catch (err) {
    console.warn('Failed to save notes to localStorage', err);
  }
}

/* -------------------------
   Validation helper
   ------------------------- */

function isValidThemeId(themeId?: string) {
  if (!themeId) return false;
  return !!themeMap[themeId];
}

/* -------------------------
   Manager (singleton factory)
   ------------------------- */

export function createNotesManager(initial?: NotesDB) {
  let db: NotesDB = initial ? deepClone(initial) : loadFromLocalStorage();

  // persist wrapper
  function persist() {
    db.meta = db.meta || { version: 1 };
    db.meta.updatedAt = new Date().toISOString();
    saveToLocalStorage(db);
  }

  /* -------------------------
     Subject CRUD
     ------------------------- */

  function listSubjects(): Subject[] {
    return deepClone(db.subjects);
  }

  function getSubject(subjectId: ID): Subject | undefined {
    return deepClone(db.subjects.find(s => s.id === subjectId));
  }

  function createSubject(title: string, slug?: string): Subject {
    const subject: Subject = {
      id: generateId('sub_'),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      topics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.subjects.push(subject);
    persist();
    return deepClone(subject);
  }

  function updateSubject(subjectId: ID, patch: Partial<Subject>): Subject | undefined {
    const idx = db.subjects.findIndex(s => s.id === subjectId);
    if (idx === -1) return undefined;
    db.subjects[idx] = { ...db.subjects[idx], ...patch, updatedAt: new Date().toISOString() };
    persist();
    return deepClone(db.subjects[idx]);
  }

  function deleteSubject(subjectId: ID): boolean {
    const before = db.subjects.length;
    db.subjects = db.subjects.filter(s => s.id !== subjectId);
    persist();
    return db.subjects.length !== before;
  }

  /* -------------------------
     Topic CRUD
     ------------------------- */

  function createTopic(subjectId: ID, title: string, slug?: string): NoteTopic | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic: NoteTopic = {
      id: generateId('top_'),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      subtopics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    subject.topics.push(topic);
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(topic);
  }

  function updateTopic(subjectId: ID, topicId: ID, patch: Partial<NoteTopic>): NoteTopic | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const idx = subject.topics.findIndex(t => t.id === topicId);
    if (idx === -1) return undefined;
    subject.topics[idx] = { ...subject.topics[idx], ...patch, updatedAt: new Date().toISOString() };
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(subject.topics[idx]);
  }

  function deleteTopic(subjectId: ID, topicId: ID): boolean {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return false;
    const before = subject.topics.length;
    subject.topics = subject.topics.filter(t => t.id !== topicId);
    subject.updatedAt = new Date().toISOString();
    persist();
    return subject.topics.length !== before;
  }

  /* -------------------------
     Subtopic CRUD
     ------------------------- */

  function createSubtopic(subjectId: ID, topicId: ID, title: string, slug?: string): NoteSubtopic | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return undefined;
    const subtopic: NoteSubtopic = {
      id: generateId('subt_'),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    topic.subtopics.push(subtopic);
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(subtopic);
  }

  function updateSubtopic(subjectId: ID, topicId: ID, subtopicId: ID, patch: Partial<NoteSubtopic>): NoteSubtopic | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return undefined;
    const idx = topic.subtopics.findIndex(st => st.id === subtopicId);
    if (idx === -1) return undefined;
    topic.subtopics[idx] = { ...topic.subtopics[idx], ...patch, updatedAt: new Date().toISOString() };
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(topic.subtopics[idx]);
  }

  function deleteSubtopic(subjectId: ID, topicId: ID, subtopicId: ID): boolean {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return false;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return false;
    const before = topic.subtopics.length;
    topic.subtopics = topic.subtopics.filter(st => st.id !== subtopicId);
    subject.updatedAt = new Date().toISOString();
    persist();
    return topic.subtopics.length !== before;
  }

  /* -------------------------
     NoteBox CRUD
     ------------------------- */

  function createNoteBox(
    subjectId: ID,
    topicId: ID,
    subtopicId: ID,
    type: NoteBoxType,
    content: any,
    themeId?: string
  ): NoteBox | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return undefined;
    const subtopic = topic.subtopics.find(st => st.id === subtopicId);
    if (!subtopic) return undefined;

    const nb: NoteBox = {
      id: generateId('note_'),
      type,
      title: (content && content.title) || `${type} - ${new Date().toLocaleString()}`,
      content,
      themeId: isValidThemeId(themeId) ? (themeId as string) : Object.keys(themeMap)[0],
      order: subtopic.notes.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    subtopic.notes.push(nb);
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(nb);
  }

  function updateNoteBox(
    subjectId: ID,
    topicId: ID,
    subtopicId: ID,
    noteId: ID,
    patch: Partial<NoteBox>
  ): NoteBox | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return undefined;
    const subtopic = topic.subtopics.find(st => st.id === subtopicId);
    if (!subtopic) return undefined;
    const idx = subtopic.notes.findIndex(n => n.id === noteId);
    if (idx === -1) return undefined;

    // ensure theme validity if passed
    if (patch.themeId && !isValidThemeId(patch.themeId)) {
      delete patch.themeId;
    }

    subtopic.notes[idx] = { ...subtopic.notes[idx], ...patch, updatedAt: new Date().toISOString() };
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(subtopic.notes[idx]);
  }

  function deleteNoteBox(subjectId: ID, topicId: ID, subtopicId: ID, noteId: ID): boolean {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return false;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return false;
    const subtopic = topic.subtopics.find(st => st.id === subtopicId);
    if (!subtopic) return false;
    const before = subtopic.notes.length;
    subtopic.notes = subtopic.notes.filter(n => n.id !== noteId);
    subject.updatedAt = new Date().toISOString();
    persist();
    return subtopic.notes.length !== before;
  }

  function reorderNotes(subjectId: ID, topicId: ID, subtopicId: ID, orderedIds: ID[]): NoteBox[] | undefined {
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return undefined;
    const subtopic = topic.subtopics.find(st => st.id === subtopicId);
    if (!subtopic) return undefined;

    const map = new Map(subtopic.notes.map(n => [n.id, n]));
    const newNotes: NoteBox[] = [];
    orderedIds.forEach((id, idx) => {
      const found = map.get(id);
      if (found) {
        found.order = idx;
        newNotes.push(found);
      }
    });
    // append any notes not included in orderedIds at the end
    subtopic.notes.forEach(n => {
      if (!orderedIds.includes(n.id)) {
        newNotes.push(n);
      }
    });

    subtopic.notes = newNotes;
    subject.updatedAt = new Date().toISOString();
    persist();
    return deepClone(subtopic.notes);
  }

  /* -------------------------
     Querying helpers
     ------------------------- */

  function findNoteById(noteId: ID): { subject?: Subject; topic?: NoteTopic; subtopic?: NoteSubtopic; note?: NoteBox } | null {
    for (const s of db.subjects) {
      for (const t of s.topics) {
        for (const st of t.subtopics) {
          const n = st.notes.find(x => x.id === noteId);
          if (n) return { subject: deepClone(s), topic: deepClone(t), subtopic: deepClone(st), note: deepClone(n) };
        }
      }
    }
    return null;
  }

  function search(query: string): Array<{ subjectId: ID; topicId: ID; subtopicId: ID; note: NoteBox }> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ subjectId: ID; topicId: ID; subtopicId: ID; note: NoteBox }> = [];
    for (const s of db.subjects) {
      for (const t of s.topics) {
        for (const st of t.subtopics) {
          for (const n of st.notes) {
            const text = `${n.title} ${JSON.stringify(n.content)}`.toLowerCase();
            if (text.includes(q)) {
              results.push({ subjectId: s.id, topicId: t.id, subtopicId: st.id, note: deepClone(n) });
            }
          }
        }
      }
    }
    return results;
  }

  /* -------------------------
     Export / Import
     ------------------------- */

  function exportJSON(): string {
    return JSON.stringify(db, null, 2);
  }

  function importJSON(raw: string): { success: boolean; message?: string } {
    try {
      const parsed = JSON.parse(raw) as NotesDB;
      // Basic validation
      if (!parsed || !Array.isArray(parsed.subjects)) {
        return { success: false, message: 'Invalid format: missing subjects array' };
      }
      db = parsed;
      persist();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to parse JSON' };
    }
  }

  /* -------------------------
     Utility: dev load & reset
     ------------------------- */

  function resetToDefault() {
    db = deepClone(defaultDB);
    persist();
  }

  function loadSample(sample: NotesDB) {
    db = deepClone(sample);
    persist();
  }

  function getRawDB() {
    return deepClone(db);
  }

  return {
    // persistence
    exportJSON,
    importJSON,
    resetToDefault,
    loadSample,
    getRawDB,

    // subjects
    listSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,

    // topics
    createTopic,
    updateTopic,
    deleteTopic,

    // subtopics
    createSubtopic,
    updateSubtopic,
    deleteSubtopic,

    // note boxes
    createNoteBox,
    updateNoteBox,
    deleteNoteBox,
    reorderNotes,
    findNoteById,
    search,
  };
}

export type NotesManager = ReturnType<typeof createNotesManager>;
