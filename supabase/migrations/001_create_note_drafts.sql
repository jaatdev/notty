-- Create a draft table for admin note drafts
create table if not exists note_drafts (
  id uuid default gen_random_uuid() primary key,
  note_key text not null unique,    -- e.g. draft::<subjectId>::<topicId>::<subtopicId>::<type>
  subject_id text,
  topic_id text,
  subtopic_id text,
  type text,
  user_id text,                      -- optional: who saved this draft
  payload jsonb not null,            -- the draft JSON: title, bodyHtml, pointsText, flashText, meta...
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_note_drafts_note_key on note_drafts (note_key);
create index if not exists idx_note_drafts_subject on note_drafts (subject_id);
create index if not exists idx_note_drafts_updated on note_drafts (updated_at desc);

-- Add comment
comment on table note_drafts is 'Stores auto-saved drafts for notes being edited in the admin interface';
