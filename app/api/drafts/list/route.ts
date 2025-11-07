// app/api/drafts/list/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

export async function POST(req: Request) {
  try {
    const { noteKey, subjectId, limit = 10 } = await req.json();
    
    if (!noteKey && !subjectId) {
      return NextResponse.json({ error: 'provide noteKey or subjectId' }, { status: 400 });
    }

    let query = supa
      .from('note_drafts')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (noteKey) {
      query = query.eq('note_key', noteKey);
    } else if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('list drafts error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
