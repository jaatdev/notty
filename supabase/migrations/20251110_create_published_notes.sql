-- supabase/migrations/20251110_create_published_notes.sql
-- Create published_notes table for public student-facing content

CREATE TABLE IF NOT EXISTS public.published_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  note_key text NOT NULL UNIQUE,
  subject_slug text,
  topic_id text,
  subtopic_id text,
  title text,
  description text,          -- short summary/excerpt
  body_html text,            -- sanitized HTML for display
  payload jsonb,             -- original note payload (structured)
  tags text[] DEFAULT '{}',  -- array of tags
  view_count integer DEFAULT 0,
  is_archived boolean DEFAULT false,
  published_by text,
  published_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for filtering & search
CREATE INDEX IF NOT EXISTS idx_published_notes_subject ON public.published_notes (subject_slug);
CREATE INDEX IF NOT EXISTS idx_published_notes_topic ON public.published_notes (topic_id);
CREATE INDEX IF NOT EXISTS idx_published_notes_note_key ON public.published_notes (note_key);
CREATE INDEX IF NOT EXISTS idx_published_notes_archived ON public.published_notes (is_archived);
CREATE INDEX IF NOT EXISTS idx_published_notes_published_at ON public.published_notes (published_at DESC);
