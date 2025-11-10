import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Flashcard from '@/components/student/Flashcard';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export default async function FlashcardPage({ params }: { params: Promise<{ noteKey: string }> }) {
  const { noteKey } = await params;
  if (!noteKey) return <div>NoteKey required</div>;

  const { data } = await supa
    .from('published_notes')
    .select('note_key, payload')
    .eq('note_key', noteKey)
    .single();

  if (!data || !data.payload) return <main className="container p-6">No flashcard data available</main>;

  // payload may include flashcards array; fallback to extracting from quick-reference or small-notes
  const payload = data.payload as any;
  let cards: { q: string; a: string }[] = [];

  if (Array.isArray(payload.flashcards) && payload.flashcards.length) {
    cards = payload.flashcards.map((f: any) => ({ q: f.q || f.front || '', a: f.a || f.back || '' }));
  } else if (payload.type === 'quick-reference' && Array.isArray(payload.items)) {
    // convert items into Q/A pairs heuristically
    cards = payload.items.map((it: any) => ({ q: it.title || '', a: it.text || '' }));
  } else if (payload.sections && Array.isArray(payload.sections)) {
    // fallback: create simple Q/A from sections (heading -> body)
    cards = payload.sections.filter((s:any)=>s.heading || s.title).map((s:any)=>({ q: s.heading||s.title||'?', a: s.content||'' }));
  }

  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
      <Flashcard cards={cards} />
    </main>
  );
}
