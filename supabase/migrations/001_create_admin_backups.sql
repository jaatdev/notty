-- supabase/migrations/001_create_admin_backups.sql
-- Creates a simple table to store admin backups (single-row upserts)

CREATE TABLE IF NOT EXISTS public.admin_backups (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Grant minimal privileges to anon for reading backups (adjust for your security model)
-- NOTE: For production, prefer server-side operations using service role key.

GRANT SELECT ON public.admin_backups TO anon;
GRANT INSERT, UPDATE ON public.admin_backups TO authenticated;
