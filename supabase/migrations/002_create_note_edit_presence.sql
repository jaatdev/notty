-- migrations/002_create_note_edit_presence.sql
-- Create presence table for realtime collaboration

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS note_edit_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  display_name TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presence_note_key ON note_edit_presence (note_key);
CREATE INDEX IF NOT EXISTS idx_presence_user_id ON note_edit_presence (user_id);

-- Add unique constraint for upsert capability
CREATE UNIQUE INDEX IF NOT EXISTS idx_presence_note_user ON note_edit_presence (note_key, user_id);
