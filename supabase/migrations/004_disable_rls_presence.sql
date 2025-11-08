-- Disable RLS or add permissive policies for note_edit_presence table
-- This allows the anon key to read/write presence data

-- Option 1: Disable RLS entirely (simpler, but less secure)
ALTER TABLE note_edit_presence DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with permissive policies (more secure)
-- ALTER TABLE note_edit_presence ENABLE ROW LEVEL SECURITY;
-- 
-- -- Allow anyone to read presence data
-- CREATE POLICY "Allow public read access" ON note_edit_presence
--   FOR SELECT
--   USING (true);
-- 
-- -- Allow service role to insert/update/delete (already works via service role key)
-- -- No additional policy needed since service role bypasses RLS

-- For now, use Option 1 (disable RLS) to get it working
-- You can enable RLS later with proper auth
