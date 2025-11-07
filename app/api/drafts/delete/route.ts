// app/api/drafts/delete/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

export async function POST(req: Request) {
  try {
    const { noteKey } = await req.json();
    
    if (!noteKey) {
      return NextResponse.json({ error: 'missing noteKey' }, { status: 400 });
    }

    const { error } = await supa
      .from('note_drafts')
      .delete()
      .eq('note_key', noteKey);

    if (error) throw error;
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('delete drafts error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
