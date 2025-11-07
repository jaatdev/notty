-- Step 5B: Add Authentication and Collaboration Features
-- Migration 002: Extends existing schema with auth, profiles, and collaboration

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COLLABORATORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, user_id)
);

-- =====================================================
-- ACTIVITY LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADMIN BACKUPS TABLE (for localStorage migration)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_backups (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADD OWNERSHIP COLUMNS TO EXISTING TABLES
-- =====================================================
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

ALTER TABLE public.subtopics ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.subtopics ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

ALTER TABLE public.note_boxes ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.note_boxes ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_subjects_created_by ON public.subjects(created_by);
CREATE INDEX IF NOT EXISTS idx_subjects_order_index ON public.subjects(order_index);
CREATE INDEX IF NOT EXISTS idx_topics_order_index ON public.topics(order_index);
CREATE INDEX IF NOT EXISTS idx_subtopics_order_index ON public.subtopics(order_index);
CREATE INDEX IF NOT EXISTS idx_note_boxes_created_by ON public.note_boxes(created_by);
CREATE INDEX IF NOT EXISTS idx_note_boxes_order_index ON public.note_boxes(order_index);
CREATE INDEX IF NOT EXISTS idx_collaborators_subject_id ON public.collaborators(subject_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_backups ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all operations on subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow all operations on topics" ON public.topics;
DROP POLICY IF EXISTS "Allow all operations on subtopics" ON public.subtopics;
DROP POLICY IF EXISTS "Allow all operations on note_boxes" ON public.note_boxes;

-- =====================================================
-- RLS POLICIES - PROFILES
-- =====================================================
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS POLICIES - SUBJECTS
-- =====================================================
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create subjects" ON public.subjects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Subject owners and editors can update" ON public.subjects
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.collaborators 
      WHERE subject_id = subjects.id 
      AND user_id = auth.uid() 
      AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Subject owners can delete" ON public.subjects
  FOR DELETE USING (auth.uid() = created_by);

-- =====================================================
-- RLS POLICIES - TOPICS
-- =====================================================
CREATE POLICY "Topics are viewable by everyone" ON public.topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics" ON public.topics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Topic owners and editors can update" ON public.topics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = topics.subject_id 
      AND (created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.collaborators 
        WHERE subject_id = subjects.id 
        AND user_id = auth.uid() 
        AND role IN ('editor', 'admin')
      ))
    )
  );

CREATE POLICY "Topic owners can delete" ON public.topics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = topics.subject_id 
      AND created_by = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - SUBTOPICS
-- =====================================================
CREATE POLICY "Subtopics are viewable by everyone" ON public.subtopics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create subtopics" ON public.subtopics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Subtopic owners and editors can update" ON public.subtopics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.topics t
      JOIN public.subjects s ON t.subject_id = s.id
      WHERE t.id = subtopics.topic_id 
      AND (s.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.collaborators 
        WHERE subject_id = s.id 
        AND user_id = auth.uid() 
        AND role IN ('editor', 'admin')
      ))
    )
  );

CREATE POLICY "Subtopic owners can delete" ON public.subtopics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.topics t
      JOIN public.subjects s ON t.subject_id = s.id
      WHERE t.id = subtopics.topic_id 
      AND s.created_by = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - NOTE BOXES
-- =====================================================
CREATE POLICY "Note boxes are viewable by everyone" ON public.note_boxes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create note boxes" ON public.note_boxes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Note box owners and editors can update" ON public.note_boxes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subtopics st
      JOIN public.topics t ON st.topic_id = t.id
      JOIN public.subjects s ON t.subject_id = s.id
      WHERE st.id = note_boxes.subtopic_id 
      AND (s.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.collaborators 
        WHERE subject_id = s.id 
        AND user_id = auth.uid() 
        AND role IN ('editor', 'admin')
      ))
    )
  );

CREATE POLICY "Note box owners can delete" ON public.note_boxes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.subtopics st
      JOIN public.topics t ON st.topic_id = t.id
      JOIN public.subjects s ON t.subject_id = s.id
      WHERE st.id = note_boxes.subtopic_id 
      AND s.created_by = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - COLLABORATORS
-- =====================================================
CREATE POLICY "Collaborators are viewable by subject members" ON public.collaborators
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = collaborators.subject_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Subject owners can add collaborators" ON public.collaborators
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = subject_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Subject owners can update collaborators" ON public.collaborators
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = subject_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Subject owners can remove collaborators" ON public.collaborators
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE id = subject_id 
      AND created_by = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - ACTIVITY LOG
-- =====================================================
CREATE POLICY "Activity log viewable by authenticated users" ON public.activity_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can log activity" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- RLS POLICIES - ADMIN BACKUPS
-- =====================================================
CREATE POLICY "Backups viewable by authenticated users" ON public.admin_backups
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create backups" ON public.admin_backups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update backups" ON public.admin_backups
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Batch update note order (for drag-drop reordering)
CREATE OR REPLACE FUNCTION batch_update_note_order(updates JSONB)
RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE public.note_boxes
    SET order_index = (item->>'order_index')::INTEGER
    WHERE id = (item->>'id')::TEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REAL-TIME SUBSCRIPTIONS
-- =====================================================
-- Enable real-time for collaborative editing
ALTER PUBLICATION supabase_realtime ADD TABLE public.subjects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.topics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subtopics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.note_boxes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- Success message
SELECT 'Step 5B: Authentication and collaboration features added!' AS status;
