-- migrations/002_note_drafts_presence.sql
-- Create/ensure note_drafts and note_edit_presence schemas used by Notty.
-- Idempotent: safe to re-run without conflicts.

create extension if not exists pgcrypto;

-- note_drafts table
create table if not exists note_drafts (
  id uuid default gen_random_uuid() primary key,
  note_key text not null,
  subject_id text,
  topic_id text,
  subtopic_id text,
  type text,
  user_id text,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists idx_note_drafts_note_key
  on note_drafts (note_key);

-- note_edit_presence table
create table if not exists note_edit_presence (
  id uuid default gen_random_uuid() primary key,
  note_key text not null,
  user_id text not null,
  display_name text,
  last_active timestamptz default now(),
  cursor jsonb
);

-- ✅ Safely add the unique constraint if missing
-- Uses DO $$ block (idempotent) since IF NOT EXISTS not supported for ALTER TABLE ADD CONSTRAINT
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'uniq_note_user'
  ) then
    alter table note_edit_presence
      add constraint uniq_note_user unique (note_key, user_id);
  end if;
end $$;

-- Helpful indexes
create index if not exists idx_presence_note_key
  on note_edit_presence (note_key);

create index if not exists idx_presence_user_id
  on note_edit_presence (user_id);
