-- Migration: Create published_notes table for student-facing public content
-- Purpose: Separate admin drafts from published content for performance, security, and SEO

-- Create published_notes table
CREATE TABLE IF NOT EXISTS public.published_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_key TEXT UNIQUE NOT NULL,
  subject_slug TEXT NOT NULL,
  topic_id TEXT,
  subtopic_id TEXT,
  title TEXT NOT NULL,
  body_html TEXT, -- Sanitized HTML for rendering
  payload JSONB, -- Full note structure (boxes, sections, metadata)
  published_by TEXT NOT NULL, -- Clerk userId who published
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata for SEO and display
  description TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  
  -- Soft delete support
  is_archived BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT published_notes_note_key_key UNIQUE (note_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_published_notes_subject_slug ON public.published_notes(subject_slug);
CREATE INDEX IF NOT EXISTS idx_published_notes_topic_id ON public.published_notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_published_notes_published_at ON public.published_notes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_notes_archived ON public.published_notes(is_archived) WHERE is_archived = FALSE;

-- Full-text search index on title and body_html
CREATE INDEX IF NOT EXISTS idx_published_notes_search 
  ON public.published_notes 
  USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(body_html, '')));

-- Trigger to update updated_at on modification
CREATE OR REPLACE FUNCTION update_published_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_published_notes_updated_at
  BEFORE UPDATE ON public.published_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_published_notes_updated_at();

-- RLS policies (Row Level Security)
ALTER TABLE public.published_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read non-archived published notes
CREATE POLICY "Published notes are publicly readable"
  ON public.published_notes
  FOR SELECT
  USING (is_archived = FALSE);

-- Policy: Only authenticated users (admins) can insert/update
CREATE POLICY "Admins can insert published notes"
  ON public.published_notes
  FOR INSERT
  WITH CHECK (TRUE); -- We'll enforce admin check in API layer

CREATE POLICY "Admins can update published notes"
  ON public.published_notes
  FOR UPDATE
  USING (TRUE);

-- Policy: Only admins can delete (soft delete via is_archived)
CREATE POLICY "Admins can archive published notes"
  ON public.published_notes
  FOR UPDATE
  USING (TRUE);

-- Add comment for documentation
COMMENT ON TABLE public.published_notes IS 'Stores published (public) versions of notes for student view. Separate from note_drafts for security and performance.';
