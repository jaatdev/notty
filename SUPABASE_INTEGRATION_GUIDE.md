# Step 5B: Supabase Integration - Complete Setup Guide

🎉 **You're upgrading to cloud-powered collaboration!**

This guide will help you set up Supabase authentication, real-time sync, and cloud storage for your Notty admin system.

---

## 📋 What You'll Get

- ☁️ **Cloud Storage** - All data backed up to PostgreSQL
- 🔐 **Authentication** - Secure user accounts with email/password
- 🔄 **Real-time Sync** - Live collaboration across devices
- 👥 **Team Features** - Role-based access control
- 📊 **Activity Tracking** - Full audit trail
- 🚀 **Production Ready** - Scales automatically

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Run Database Migration

1. Open your Supabase project: https://supabase.com/dashboard/project/xssifztpwvoythpkpwkr
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/002_add_auth_and_collaboration.sql`
5. Paste into the SQL editor
6. Click **Run** button
7. You should see: "Step 5B: Authentication and collaboration features added!"

### Step 2: Enable Real-time (Already Done!)

Your Supabase project already has real-time enabled for:
- ✅ subjects
- ✅ topics
- ✅ subtopics
- ✅ note_boxes
- ✅ activity_log

### Step 3: Verify Environment Variables

Check your `.env.local` file has these (already configured):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xssi.........supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 4: Test the Integration

```bash
# Start your dev server
npm run dev

# Open in browser
# Navigate to: http://localhost:3000/login

# Try the demo credentials or create an account
```

---

## 🗄️ Database Schema Overview

### Core Tables

1. **profiles** - User accounts (extends Supabase auth.users)
   - `id` (UUID, references auth.users)
   - `email`, `full_name`, `role`, `avatar_url`
   
2. **subjects** - Top-level content categories
   - Enhanced with `created_by`, `description`, `icon`, `color`, `order_index`
   
3. **topics** - Second-level organization
   - Enhanced with `description`, `order_index`
   
4. **subtopics** - Third-level organization
   - Enhanced with `description`, `order_index`
   
5. **note_boxes** - Actual educational content
   - Enhanced with `created_by`, `order_index`
   
6. **collaborators** - Team access control
   - Links users to subjects with roles (viewer/editor/admin)
   
7. **activity_log** - Audit trail
   - Tracks all create/update/delete operations
   
8. **admin_backups** - localStorage migration helper
   - For migrating from local-only to cloud storage

### Security (Row Level Security)

All tables have RLS enabled with these rules:

- **Read** - Public (everyone can view)
- **Create** - Authenticated users only
- **Update** - Subject owners + collaborators with editor/admin role
- **Delete** - Subject owners only

---

## 🔐 Authentication Flow

### Sign Up

```typescript
import { useAuth } from '@/components/auth/AuthProvider';

const { signUp } = useAuth();

await signUp('user@example.com', 'password123', 'Full Name');
// Automatically creates profile in database
```

### Sign In

```typescript
const { signIn } = useAuth();

await signIn('user@example.com', 'password123');
// Redirects to /admin on success
```

### Sign Out

```typescript
const { signOut } = useAuth();

await signOut();
// Redirects to /login
```

### Check Auth Status

```typescript
const { user, loading } = useAuth();

if (loading) return <Spinner />;
if (!user) return <LoginPrompt />;

return <AdminDashboard user={user} />;
```

---

## 🔄 Real-time Collaboration

### Using the Real-time Hook

```typescript
import { useRealtimeNotes } from '@/hooks/useRealtimeNotes';

function NotesPage() {
  const { subjects, loading, error, reload, manager } = useRealtimeNotes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {subjects.map(subject => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}
```

### Direct Manager Usage

```typescript
import { getSupabaseNotesManager } from '@/lib/supabase/notesManager';

const manager = getSupabaseNotesManager();

// Create a subject
const subject = await manager.createSubject('Math', 'Mathematics notes');

// Create a topic
const topic = await manager.createTopic(subject.id, 'Algebra');

// Create a note box
const note = await manager.createNoteBox(
  subtopicId,
  'big-notes',
  'Quadratic Formula',
  { heading: 'Formula', body: 'ax² + bx + c = 0' },
  'theme-ocean'
);

// Subscribe to real-time updates
const unsubscribe = manager.subscribe((event) => {
  console.log('Change detected:', event);
  // Refresh your UI
});

// Clean up
manager.cleanup();
```

---

## 👥 Team Collaboration

### Add a Collaborator

```typescript
const manager = getSupabaseNotesManager();

await manager.addCollaborator(
  subjectId,
  'teammate@example.com',
  'editor' // or 'viewer' or 'admin'
);
```

### Remove a Collaborator

```typescript
await manager.removeCollaborator(subjectId, userId);
```

### List Collaborators

```typescript
const collaborators = await manager.getCollaborators(subjectId);

collaborators.forEach(collab => {
  console.log(`${collab.user.full_name} - ${collab.role}`);
});
```

### Roles Explained

- **viewer** - Can read all content, cannot edit
- **editor** - Can create, update, delete note boxes
- **admin** - Can edit subject settings + manage collaborators
- **owner** - Original creator (created_by), full control

---

## 📊 Activity Tracking

### View Recent Activity

```typescript
const manager = getSupabaseNotesManager();

const activities = await manager.getActivityLog(50); // last 50 actions

activities.forEach(activity => {
  console.log(`${activity.user.full_name} ${activity.action} ${activity.entity_type}`);
  console.log(`Timestamp: ${activity.created_at}`);
});
```

### Example Activity Log Entry

```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "action": "create",
  "entity_type": "note_box",
  "entity_id": "note-uuid",
  "metadata": {
    "title": "Pythagorean Theorem",
    "type": "big-notes",
    "subtopicId": "subtopic-uuid"
  },
  "created_at": "2025-11-06T10:30:00Z"
}
```

---

## 🔧 Troubleshooting

### "User not found" error when adding collaborator

**Problem**: The email doesn't have an account yet.

**Solution**: Ask them to sign up first at `/signup`, then add them as collaborator.

---

### Real-time updates not working

**Problem**: WebSocket connection failed.

**Solutions**:
1. Check Supabase dashboard → Settings → API → Realtime is enabled
2. Verify tables are added to `supabase_realtime` publication
3. Check browser console for connection errors
4. Try refreshing the page

---

### "Row Level Security" errors

**Problem**: RLS policies blocking your operations.

**Solutions**:
1. Make sure you're signed in (`useAuth` returns a user)
2. Check you have permission (owner or collaborator)
3. Review policies in `002_add_auth_and_collaboration.sql`
4. Temporarily disable RLS for testing (not recommended for production):
   ```sql
   ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
   ```

---

### Migration SQL fails

**Problem**: Constraints or columns already exist.

**Solutions**:
1. Check if migration already ran (query existing tables)
2. Run individual CREATE TABLE IF NOT EXISTS statements
3. Check for typos in table/column names
4. Review Supabase logs for specific error

---

## 🚀 Next Steps

### Option 1: Migrate Existing Data

If you have data in localStorage:

```typescript
import { getNotesManager } from '@/lib/notesManager';
import { getSupabaseNotesManager } from '@/lib/supabase/notesManager';

const localManager = getNotesManager();
const cloudManager = getSupabaseNotesManager();

// Get all local data
const localDB = localManager.exportJSON();

// Create subjects in cloud
for (const subject of localDB.subjects) {
  const cloudSubject = await cloudManager.createSubject(
    subject.title,
    subject.description
  );

  // Create topics...
  for (const topic of subject.topics) {
    const cloudTopic = await cloudManager.createTopic(
      cloudSubject.id,
      topic.title
    );

    // Create subtopics and notes...
  }
}
```

### Option 2: Start Fresh

Just start creating content in the admin panel. Everything will automatically sync to Supabase.

### Option 3: Import from JSON

Use the admin backup/restore feature:

1. Export your localStorage data as JSON
2. Upload to `admin_backups` table
3. Restore from cloud backup

---

## 📚 API Reference

### SupabaseNotesManager Methods

#### Subjects
- `listSubjects(): Promise<Subject[]>`
- `getSubject(id): Promise<Subject | null>`
- `createSubject(title, description?): Promise<Subject>`
- `updateSubject(id, updates): Promise<Subject>`
- `deleteSubject(id): Promise<boolean>`

#### Topics
- `createTopic(subjectId, title): Promise<Topic>`
- `updateTopic(id, updates): Promise<Topic>`
- `deleteTopic(subjectId, topicId): Promise<boolean>`

#### Subtopics
- `createSubtopic(topicId, title): Promise<Subtopic>`
- `updateSubtopic(id, updates): Promise<Subtopic>`
- `deleteSubtopic(topicId, subtopicId): Promise<boolean>`

#### Note Boxes
- `createNoteBox(subtopicId, type, title, content, themeId?): Promise<NoteBox>`
- `updateNoteBox(id, updates): Promise<NoteBox>`
- `deleteNoteBox(noteId): Promise<boolean>`
- `reorderNoteBoxes(subtopicId, noteIds[]): Promise<boolean>`

#### Collaboration
- `addCollaborator(subjectId, email, role): Promise<boolean>`
- `removeCollaborator(subjectId, userId): Promise<boolean>`
- `getCollaborators(subjectId): Promise<Collaborator[]>`

#### Activity
- `getActivityLog(limit?): Promise<Activity[]>`

#### Real-time
- `subscribe(callback): () => void` - Returns unsubscribe function
- `cleanup(): Promise<void>` - Clean up subscriptions

---

## 💡 Tips & Best Practices

### 1. Always Handle Errors

```typescript
try {
  await manager.createSubject('New Subject');
} catch (error) {
  console.error('Failed to create subject:', error);
  toast.error('Could not create subject. Please try again.');
}
```

### 2. Use Optimistic Updates

```typescript
// Show change immediately
setSubjects(prev => [...prev, newSubject]);

// Sync to database in background
manager.createSubject(title).catch(() => {
  // Rollback on error
  setSubjects(prev => prev.filter(s => s.id !== newSubject.id));
});
```

### 3. Clean Up Subscriptions

```typescript
useEffect(() => {
  const unsubscribe = manager.subscribe(handleUpdate);
  return () => unsubscribe(); // Important!
}, []);
```

### 4. Batch Operations

Instead of:
```typescript
for (const note of notes) {
  await manager.deleteNoteBox(note.id); // Slow!
}
```

Use bulk operations or Promise.all:
```typescript
await Promise.all(
  notes.map(note => manager.deleteNoteBox(note.id))
);
```

---

## ✅ Checklist: Verify Everything Works

- [ ] Database migration ran successfully
- [ ] Can sign up for a new account
- [ ] Can sign in with email/password
- [ ] Can create a subject in admin panel
- [ ] Subject appears in database (check Supabase dashboard)
- [ ] Open app in two browser tabs → changes sync instantly
- [ ] Can add a collaborator to a subject
- [ ] Activity log shows recent actions
- [ ] Sign out redirects to login page

---

## 🎉 You're Done!

Your Notty admin is now cloud-powered with:
- ✅ Real-time collaboration
- ✅ Secure authentication
- ✅ Team features
- ✅ Production-ready infrastructure

**Ready to commit?**

```bash
git add .
git commit -m "feat(backend): integrate Supabase with auth, real-time sync, and collaboration

- Add database schema with profiles, collaborators, activity log
- Implement cloud-synced notes manager with real-time subscriptions
- Create authentication flow with protected routes
- Add team collaboration with role-based access
- Include comprehensive setup documentation"
git push
```

---

**Questions?** Check the troubleshooting section or review the code comments in:
- `lib/supabase/notesManager.ts`
- `components/auth/AuthProvider.tsx`
- `hooks/useRealtimeNotes.ts`
