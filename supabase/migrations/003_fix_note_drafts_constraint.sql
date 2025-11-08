-- Fix note_drafts table to support multi-user drafts
-- Drop the old unique constraint on note_key alone
ALTER TABLE note_drafts DROP CONSTRAINT IF EXISTS note_drafts_note_key_key;

-- Add a composite unique constraint on (note_key, user_id)
-- This allows multiple users to have their own drafts for the same note
CREATE UNIQUE INDEX IF NOT EXISTS idx_note_drafts_key_user 
  ON note_drafts (note_key, COALESCE(user_id, 'anonymous'));

-- Alternative: if you want ONE draft per note_key regardless of user:
-- Just keep note_key unique, but ensure upsert uses only note_key
-- (This is what we currently have, so the migration above adds multi-user support)
