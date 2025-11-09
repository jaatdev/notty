// app/api/presence/leave/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

/**
 * POST { noteKey, userId }
 * Removes presence row when user leaves
 */
export async function POST(req: Request) {
  // Verify Clerk auth via cookies (App Router)
  const auth = await requireAdminFromCookies();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status || 401 });

  try {
    const { noteKey, userId } = await req.json();
    
    if (!noteKey || !userId) {
      return NextResponse.json({ error: 'noteKey and userId required' }, { status: 400 });
    }

    const { error } = await supa
      .from('note_edit_presence')
      .delete()
      .match({ note_key: noteKey, user_id: userId });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('presence leave error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
