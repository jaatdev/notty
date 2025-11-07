-- Supabase Database Schema for Notty Admin System
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xssifztpwvoythpkpwkr/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY DEFAULT ('sub_' || substr(md5(random()::text), 1, 8)),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY DEFAULT ('top_' || substr(md5(random()::text), 1, 8)),
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, slug)
);

-- Subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
  id TEXT PRIMARY KEY DEFAULT ('subt_' || substr(md5(random()::text), 1, 8)),
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, slug)
);

-- Note boxes table
CREATE TABLE IF NOT EXISTS note_boxes (
  id TEXT PRIMARY KEY DEFAULT ('note_' || substr(md5(random()::text), 1, 8)),
  subtopic_id TEXT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'big-notes', 'small-notes', 'right-wrong', 
    'mnemonic-magic', 'mnemonic-card', 'container-notes', 
    'quick-reference', 'flashcard'
  )),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  theme_id TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_note_boxes_subtopic_id ON note_boxes(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_note_boxes_type ON note_boxes(type);
CREATE INDEX IF NOT EXISTS idx_note_boxes_theme_id ON note_boxes(theme_id);
CREATE INDEX IF NOT EXISTS idx_note_boxes_order ON note_boxes("order");

-- Triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtopics_updated_at BEFORE UPDATE ON subtopics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_boxes_updated_at BEFORE UPDATE ON note_boxes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_boxes ENABLE ROW LEVEL SECURITY;

-- Policies (allow all operations for now - add authentication later)
CREATE POLICY "Allow all operations on subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on topics" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all operations on subtopics" ON subtopics FOR ALL USING (true);
CREATE POLICY "Allow all operations on note_boxes" ON note_boxes FOR ALL USING (true);

-- Sample data migration helper function
CREATE OR REPLACE FUNCTION migrate_sample_data()
RETURNS void AS $$
BEGIN
  -- This function can be called to populate initial data
  -- You can run this manually after creating tables
  RAISE NOTICE 'Database schema created successfully. Ready for data migration.';
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Notty database schema created successfully!' AS status;
