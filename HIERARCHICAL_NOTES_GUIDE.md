# Hierarchical Notes System - Complete Guide

## 🎯 Overview

The new hierarchical notes system organizes user notes in a **Subject → Topic → Subtopic** structure, replacing the flat localStorage key-based system with a proper JSON hierarchy.

---

## 📊 Data Structure

### **Storage Location**
- **Key**: `notty_user_notes_v2` (single localStorage key)
- **Format**: JSON with nested hierarchy
- **Schema**: `data/user-notes-schema.json`
- **Example**: `data/user-notes.json`

### **Hierarchy Levels**

```
UserNotesData
├── version: "1.0.0"
├── lastSync: "2025-11-06T..."
└── subjects/
    └── [subjectSlug]/          (e.g., "polity")
        ├── metadata/
        │   ├── title: "Indian Polity"
        │   ├── slug: "polity"
        │   ├── totalNotes: 15
        │   └── lastUpdated: "..."
        └── topics/
            └── [topicId]/      (e.g., "preamble")
                ├── topicId: "preamble"
                ├── topicTitle: "The Preamble"
                ├── notes[]     ← Topic-level notes
                └── subtopics/
                    └── [subtopicId]/
                        ├── subtopicId: "keywords"
                        ├── subtopicTitle: "Keywords"
                        └── notes[]  ← Subtopic-level notes
```

---

## 🔄 Migration from Old System

### **Old System (Flat Keys)**
```
localStorage:
  notty_notes_polity_preamble = [Note, Note, Note]
  notty_notes_polity_fundamental-rights = [Note, Note]
  notty_notes_history_ancient-india = [Note, Note, Note]
  ...
```

### **New System (Hierarchical JSON)**
```
localStorage:
  notty_user_notes_v2 = {
    subjects: {
      polity: {
        topics: {
          preamble: { notes: [...] },
          "fundamental-rights": { notes: [...] }
        }
      },
      history: {
        topics: {
          "ancient-india": { notes: [...] }
        }
      }
    }
  }
```

### **Migration Function**
```typescript
import { migrateFromOldFormat } from '@/lib/notes-hierarchical'

// Run once to migrate all notes
migrateFromOldFormat()
```

---

## 📝 Usage Examples

### **1. Add a Note**

```typescript
import { addNote } from '@/lib/notes-hierarchical'

// Topic-level note
const note = addNote(
  'polity',           // subjectSlug
  'preamble',         // topicId
  'My notes content',
  'My Note Title',
  undefined,          // subtopicId (undefined = topic-level)
  'Indian Polity',    // subjectTitle (for auto-init)
  'The Preamble'      // topicTitle (for auto-init)
)

// Subtopic-level note
const subtopicNote = addNote(
  'polity',
  'preamble',
  'Keyword notes',
  'Important Keywords',
  'keywords',         // subtopicId
  'Indian Polity',
  'The Preamble',
  'Keywords'          // subtopicTitle
)
```

### **2. Get Notes**

```typescript
import { getNotesForTopic, getAllNotesForSubject } from '@/lib/notes-hierarchical'

// Get topic-level notes only
const topicNotes = getNotesForTopic('polity', 'preamble')

// Get subtopic-level notes only
const subtopicNotes = getNotesForTopic('polity', 'preamble', 'keywords')

// Get ALL notes for a subject (all topics + all subtopics)
const allPolityNotes = getAllNotesForSubject('polity')
```

### **3. Update a Note**

```typescript
import { updateNote } from '@/lib/notes-hierarchical'

const updated = updateNote(
  'polity',
  'preamble',
  'note-123-abc',
  {
    title: 'Updated Title',
    content: 'Updated content',
    tags: ['important', 'exam']
  }
)
```

### **4. Delete a Note**

```typescript
import { deleteNote } from '@/lib/notes-hierarchical'

const success = deleteNote('polity', 'preamble', 'note-123-abc')
```

### **5. Search Notes**

```typescript
import { searchNotes } from '@/lib/notes-hierarchical'

// Search all subjects
const allResults = searchNotes('constitution')

// Search specific subject
const polityResults = searchNotes('constitution', 'polity')
```

### **6. Get Statistics**

```typescript
import { getNotesStats } from '@/lib/notes-hierarchical'

// All subjects stats
const allStats = getNotesStats()

// Specific subject stats
const polityStats = getNotesStats('polity')

console.log(polityStats)
// {
//   total: 25,
//   byLevel: { topic: 15, subtopic: 10 },
//   last7Days: 5,
//   last30Days: 12,
//   topTags: [{ tag: 'important', count: 10 }, ...],
//   avgNotesPerDay: 1.5
// }
```

### **7. Export/Import**

```typescript
import { exportNotes, importNotes } from '@/lib/notes-hierarchical'

// Export all notes
const allNotesJson = exportNotes()

// Export single subject
const polityJson = exportNotes('polity')

// Import notes
const success = importNotes(jsonString)
```

### **8. Backup/Restore**

```typescript
import { getBackups, restoreFromBackup } from '@/lib/notes-hierarchical'

// Get available backups
const backups = getBackups()
// [
//   { timestamp: 1699200000000, date: '11/6/2025, 12:00:00 PM', totalNotes: 25 },
//   ...
// ]

// Restore from backup
const success = restoreFromBackup(1699200000000)
```

---

## 🎨 Note Object Structure

```typescript
interface Note {
  id: string                    // Auto-generated unique ID
  title: string                 // Note title
  content: string               // Note content (Markdown)
  tags: string[]                // Tags for organization
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  metadata?: {
    wordCount: number           // Auto-calculated
    readingTime: number         // Auto-calculated (minutes)
    isPinned?: boolean          // Pin to top
    isArchived?: boolean        // Archive note
  }
  // Runtime context (not stored in JSON)
  subjectSlug?: string
  topicId?: string
  subtopicId?: string
}
```

---

## ✨ Key Features

### **1. Automatic Hierarchy Initialization**
- If subject doesn't exist → creates it automatically
- If topic doesn't exist → creates it automatically
- If subtopic doesn't exist → creates it automatically

### **2. Automatic Metadata**
- `wordCount` - calculated from content
- `readingTime` - estimated reading time
- `totalNotes` - updated on every change
- `lastUpdated` - timestamp of last change

### **3. Automatic Backups**
- Created before every destructive operation (add/update/delete)
- Maximum 5 backups kept (oldest deleted automatically)
- Full data snapshots for safety

### **4. Context Injection**
- Notes returned with `subjectSlug`, `topicId`, `subtopicId`
- Enables easy navigation and breadcrumbs
- Not stored in JSON (added at runtime)

---

## 🔧 Implementation Checklist

### **Step 1: Create New Files** ✅
- [x] `data/user-notes-schema.json` - JSON schema
- [x] `data/user-notes.json` - Initial empty data
- [x] `lib/notes-hierarchical.ts` - New implementation

### **Step 2: Update Components** (Next)
- [ ] Update `TopicContent.tsx` to use new functions
- [ ] Update `NotesModal.tsx` to pass titles
- [ ] Update `NotesSearch.tsx` to use new search
- [ ] Update `NotesAnalytics.tsx` to use new stats
- [ ] Update `NotesExportImport.tsx` to use new export/import

### **Step 3: Migration** (Next)
- [ ] Add migration prompt on first load
- [ ] Run `migrateFromOldFormat()` once
- [ ] Verify all notes migrated successfully
- [ ] Keep old data for 30 days (safety)

### **Step 4: Testing** (Next)
- [ ] Test all CRUD operations
- [ ] Test search functionality
- [ ] Test export/import
- [ ] Test backup/restore
- [ ] Test migration from old format

---

## 📦 Benefits Over Old System

| Feature | Old System | New System |
|---------|-----------|-----------|
| **Storage** | Multiple keys | Single JSON key |
| **Structure** | Flat | Hierarchical |
| **Querying** | Iterate all keys | Direct object access |
| **Metadata** | Manual tracking | Auto-calculated |
| **Backups** | Per subject | Full snapshots |
| **Migration** | Difficult | Built-in support |
| **Scalability** | Poor (key limits) | Excellent (single JSON) |
| **Readability** | Low | High (structured) |

---

## 🚀 Next Steps

1. **Switch imports** from `lib/notes.ts` to `lib/notes-hierarchical.ts`
2. **Update all components** to use new API
3. **Run migration** on first load
4. **Test thoroughly** before deployment
5. **Keep old system** for 30 days as fallback

---

## 📚 Complete API Reference

```typescript
// CRUD Operations
addNote(subjectSlug, topicId, content, title?, subtopicId?, subjectTitle?, topicTitle?, subtopicTitle?)
getNotesForTopic(subjectSlug, topicId, subtopicId?)
updateNote(subjectSlug, topicId, noteId, updates, subtopicId?)
deleteNote(subjectSlug, topicId, noteId, subtopicId?)

// Queries
getAllNotesForSubject(subjectSlug)
searchNotes(query, subjectSlug?)
getNotesStats(subjectSlug?)

// Export/Import
exportNotes(subjectSlug?)
importNotes(jsonData, subjectSlug?)

// Backup/Restore
getBackups()
restoreFromBackup(timestamp)

// Migration
migrateFromOldFormat()
```

---

**Created**: November 6, 2025  
**Version**: 1.0.0  
**Status**: Ready for implementation
