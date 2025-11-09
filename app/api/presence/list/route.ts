/**
 * app/api/presence/list/route.ts
 * Fetch all presence rows for a given noteKey (initial client snapshot + poll fallback)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPA_URL || !SUPA_SERVICE_ROLE) {
  console.warn('Supabase env missing for presence API.');
}

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, {
  auth: { persistSession: false },
});

/**
 * GET /api/presence/list?noteKey=xxx
 * Returns all active presence rows for a note
 */
export async function GET(req: Request) {
  const authz = await requireAdminFromCookies();
  
  // Log auth failure but don't block presence reads in development
  if (!authz.ok) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Presence] Auth failed but processing in dev:', authz.message);
    } else {
      return NextResponse.json({ error: authz.message }, { status: authz.status || 401 });
    }
  }

  try {
    const url = new URL(req.url);
    const noteKey = url.searchParams.get('noteKey');

    if (!noteKey) {
      return NextResponse.json({ error: 'noteKey query param required' }, { status: 400 });
    }

    const { data, error } = await supa
      .from('note_edit_presence')
      .select('*')
      .eq('note_key', noteKey)
      .order('last_active', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ ok: true, presence: data || [] }, { status: 200 });
  } catch (err: any) {
    console.error('presence list error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
