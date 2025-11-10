# Patch A: Published Notes Foundation

## What's Included

This patch adds the foundational infrastructure for the Student View:

1. **Database Migration** (`supabase/migrations/20250109_published_notes.sql`)
   - Creates `published_notes` table
   - Adds indexes for performance (subject, topic, published_at, full-text search)
   - Sets up RLS policies (public read, admin write)
   - Includes view counter and soft delete support

2. **List API** (`app/api/published/notes/list/route.ts`)
   - Paginated list of published notes
   - Filters: subject, topic, subtopic, search query
   - Sorting: latest, title, popular
   - Returns metadata without full content

3. **Detail API** (`app/api/published/notes/[noteKey]/route.ts`)
   - Fetch single note by noteKey
   - Returns full content (body_html, payload)
   - Increments view counter
   - Returns 404 for archived/missing notes

## How to Apply & Test

### Step 1: Run Migration

**Option A - Supabase Dashboard:**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/20250109_published_notes.sql`
4. Paste and run the SQL

**Option B - Supabase CLI (if installed):**
```bash
supabase db push
```

### Step 2: Seed Test Data

Add a sample published note for testing:

```sql
INSERT INTO public.published_notes (
  note_key,
  subject_slug,
  topic_id,
  subtopic_id,
  title,
  description,
  body_html,
  payload,
  published_by,
  tags
) VALUES (
  'test-note-polity-001',
  'polity',
  'topic-001',
  'subtopic-001',
  'Test Note: Indian Constitution Basics',
  'A sample note about constitutional fundamentals',
  '<h1>Indian Constitution</h1><p>The Constitution of India is the supreme law...</p>',
  '{"boxes": [], "sections": []}',
  'admin-user-id',
  ARRAY['polity', 'constitution', 'basics']
);
```

### Step 3: Test the APIs

**Start dev server:**
```bash
npm run dev
```

**Test List API:**
```bash
# All notes
curl http://localhost:3000/api/published/notes/list

# Filter by subject
curl "http://localhost:3000/api/published/notes/list?subject=polity"

# Search
curl "http://localhost:3000/api/published/notes/list?q=constitution"

# Pagination
curl "http://localhost:3000/api/published/notes/list?page=1&limit=10"
```

**Test Detail API:**
```bash
curl http://localhost:3000/api/published/notes/test-note-polity-001
```

### Step 4: Verify Build

```bash
npm run build
```

Should compile successfully with no errors.

## Expected Results

### List API Response:
```json
{
  "notes": [
    {
      "id": "uuid...",
      "note_key": "test-note-polity-001",
      "subject_slug": "polity",
      "topic_id": "topic-001",
      "title": "Test Note: Indian Constitution Basics",
      "description": "A sample note...",
      "tags": ["polity", "constitution"],
      "published_at": "2025-01-09T...",
      "view_count": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Detail API Response:
```json
{
  "note": {
    "noteKey": "test-note-polity-001",
    "title": "Test Note: Indian Constitution Basics",
    "bodyHtml": "<h1>Indian Constitution</h1>...",
    "payload": {...},
    "viewCount": 1
  }
}
```

## Commit Message

```
feat(published): add published_notes table + public notes list/detail API

- Add published_notes table migration with RLS policies
- Add GET /api/published/notes/list with pagination and filters
- Add GET /api/published/notes/[noteKey] with view tracking
- Foundation for student view (D.1 + D.2)
```

## Next Steps (After This Patch)

- **D.3**: Create student-facing pages (`/notes`, `/notes/[noteKey]`)
- **D.4**: Add quiz/flashcard mode
- **D.5**: Add publish endpoint for admins to publish drafts

## Notes

- APIs use Supabase service role key for read access
- RLS policies ensure only non-archived notes are public
- View counter increments asynchronously (doesn't block response)
- Full-text search uses Postgres GIN index for performance
