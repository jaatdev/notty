# Data Sync Guide

## Understanding the Data Flow

### Current Architecture

The application uses **two separate data stores**:

1. **localStorage (Admin Interface)** 
   - Location: Browser localStorage with key `ADMIN_NOTES_DB`
   - Used by: `/admin/notes/new` page via `notesManager`
   - Purpose: Create, edit, and manage notes in the admin interface
   
2. **notes.json (Public Pages)**
   - Location: `data/notes.json` file
   - Used by: Subject pages (e.g., `/subjects/polity`) via `getSubjectBySlug()`
   - Purpose: Display notes to users on the main application pages

### The Problem

When you create notes in the admin interface:
- ✅ Notes are saved to localStorage
- ❌ Notes are **NOT automatically synced** to `notes.json`
- ❌ Main subject pages **don't see** the new notes

## Syncing Your Notes

### Step 1: Create Notes
1. Go to `/admin/notes/new`
2. Select Subject → Topic → Subtopic (or create new ones)
3. Create your notes using the editor
4. Save them successfully

### Step 2: Export from localStorage
1. Click the **"💾 Export to notes.json"** button at the top right
2. A `notes.json` file will be downloaded to your Downloads folder

### Step 3: Replace the Static File
1. Locate the downloaded `notes.json` file
2. Navigate to your project: `data/notes.json`
3. **Backup the current file** (rename to `notes.json.backup`)
4. **Replace** `data/notes.json` with the downloaded file

### Step 4: Verify
1. Refresh your main subject pages (e.g., `/subjects/polity`)
2. Your newly created notes should now appear!

## Testing Collaboration

Once you've synced your notes:

1. **Open two browser windows** (or different browsers)
2. Navigate both to `/admin/notes/new`
3. **Select the SAME subject/topic/subtopic** in both windows
4. You should see:
   - "Total users: 2" in the collaboration section
   - NoteKey matching in both browsers
   
5. **Test real-time features:**
   - Edit content in Browser 1
   - Click "Save Draft"
   - Browser 2 should show "🔔 Remote changes detected"
   - Click "Apply changes" in Browser 2
   - Content should sync!

## Future Improvements

Potential solutions to automate this workflow:

### Option A: Server-Side API
Create an API endpoint that writes localStorage changes directly to `notes.json`:
```typescript
// api/admin/sync-notes/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  await fs.writeFile('data/notes.json', JSON.stringify(data, null, 2));
  return Response.json({ success: true });
}
```

### Option B: Unified Data Source
Make subject pages read from localStorage instead of `notes.json`:
- Modify `lib/data.ts` to use `notesManager`
- Requires client-side rendering for subject pages
- Removes need for static file sync

### Option C: Database Backend
Use Supabase for all note storage:
- Create `notes` table in Supabase
- Admin writes to database
- Subject pages read from database
- Automatic sync everywhere

## Troubleshooting

### "No notes appearing after export"
- Verify the `notes.json` file was replaced correctly
- Check browser console for errors
- Clear browser cache and refresh

### "Export button not working"
- Check browser console for JavaScript errors
- Ensure localStorage has data (check DevTools → Application → Local Storage)

### "Draft save errors"
Currently there's a known issue with the `note_drafts` table constraint. This doesn't affect manual saves but autosave may fail. Will be fixed in next update.

