import React from 'react';
import { createClient } from '@supabase/supabase-js';
import NotesList from '@/components/student/NotesList';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export default async function NotesPage({ searchParams }: { searchParams?: { q?: string, subject?: string, page?: string } }) {
  const q = searchParams?.q ?? '';
  const subject = searchParams?.subject ?? '';
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const limit = 18;
  const offset = (page - 1) * limit;

  // simple search using ilike on title/excerpt
  let builder = supa
    .from('published_notes')
    .select('note_key, title, excerpt, subject_slug, topic_id, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (subject) builder = builder.eq('subject_slug', subject);
  if (q) builder = supa
    .from('published_notes')
    .select('note_key, title, excerpt, subject_slug, topic_id, published_at')
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error } = await builder;
  const notes = (data ?? []) as any[];

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-sm text-slate-600">Browse notes by subject and topic. Use search to find notes.</p>
      </header>

      <section>
        <NotesList notes={notes} />
      </section>
    </main>
  );
}
