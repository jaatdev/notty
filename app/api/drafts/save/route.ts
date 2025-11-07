// app/api/drafts/save/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPA_URL || !SUPA_SERVICE_ROLE) {
  console.warn('Supabase env missing for drafts API.');
}

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expect body: { noteKey, subjectId, topicId, subtopicId, type, userId?, payload }
    const { noteKey, subjectId, topicId, subtopicId, type, userId, payload } = body;
    
    if (!noteKey || !payload) {
      return NextResponse.json({ error: 'missing noteKey or payload' }, { status: 400 });
    }

    // Note: HTML sanitization happens on render (NoteBoxPreview) using isomorphic-dompurify
    // Storing raw HTML here for draft flexibility
    const safePayload = { ...payload };

    // Upsert by note_key
    const upsert = {
      note_key: noteKey,
      subject_id: subjectId || null,
      topic_id: topicId || null,
      subtopic_id: subtopicId || null,
      type: type || null,
      user_id: userId || null,
      payload: safePayload,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supa
      .from('note_drafts')
      .upsert(upsert, { onConflict: 'note_key' })
      .select('*')
      .single();

    if (error) throw error;
    
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('save draft error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
