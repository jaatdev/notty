# Supabase Setup (Notty Admin)

This document explains how to set up the minimal Supabase schema used by Notty's admin sync helpers.

Overview
- We store a simple JSON backup of the entire admin DB in `admin_backups` (one-row upserts keyed by `admin_content_v1_backup`).
- This is a minimal and safe starting point — later you can replace it with normalized tables (`subjects`, `topics`, `subtopics`, `note_boxes`).

1) Create the table
- Open the Supabase dashboard → SQL Editor and run the migration SQL in `supabase/migrations/001_create_admin_backups.sql`.

2) Add environment variables
- Copy `.env.local.example` to `.env.local` at the project root and fill your keys (do NOT commit `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3) Client usage (browser)
- The app contains `lib/supabase.ts` which creates a client from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Use `lib/notesSync.ts` helpers to `backupAdminDB(db)` and `getLatestBackup()` from the browser.

4) Server-side usage (recommended for privileged ops)
- Use the `SUPABASE_SERVICE_ROLE_KEY` with `createServerClient()` (or server-only code) to perform privileged operations.
- Example: server route to migrate a local backup to Supabase using service-role key.

5) Security note
- The anon key allows client-side access scoped by your Supabase RLS policies. For admin write operations, prefer server-side endpoints that use the service role key.

6) Next steps
- Normalize schema into `subjects`, `topics`, `subtopics`, `note_boxes` and implement upserts per entity.
- Add Row Level Security (RLS) policies and an `admins` role.

If you'd like, I can also:
- Add a server API route (`/app/api/admin/backup/route.ts`) to run backups using the service role key.
- Create normalized migrations for `subjects/topics/subtopics/note_boxes` and an import script to migrate the local JSON into normalized tables.
