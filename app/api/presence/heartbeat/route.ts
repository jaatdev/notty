// app/api/presence/heartbeat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';
import rateLimit from '@/lib/rateLimiter';

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPA_URL || !SUPA_SERVICE_ROLE) {
  console.warn('Supabase env missing for presence API.');
}

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, {
  auth: { persistSession: false },
});

/**
 * POST { noteKey, userId, displayName, cursor }
 * Upserts a presence row for (noteKey, userId)
 */
export async function POST(req: Request) {
  // Verify Clerk auth via cookies (App Router)
  const auth = await requireAdminFromCookies();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status || 401 });

  try {
    const body = await req.json();
    const { noteKey, userId, displayName, cursor } = body;
    
    if (!noteKey || !userId) {
      return NextResponse.json({ error: 'noteKey and userId required' }, { status: 400 });
    }

    // Rate limit: 6 heartbeats per second per user-note pair (token bucket: 6 capacity, 1 refill/sec)
    const rlKey = `heartbeat:${noteKey}:${userId}`;
    const rl = rateLimit.inMemory(rlKey, 6, 1000, 1);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many heartbeats, please slow down' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
    }

    const payload = {
      note_key: noteKey,
      user_id: userId,
      display_name: displayName || null,
      last_active: new Date().toISOString(),
      cursor: cursor || null,
    };

    // Upsert using the unique index on (note_key, user_id)
    const { data, error } = await supa
      .from('note_edit_presence')
      .upsert(payload, { onConflict: 'note_key,user_id' })
      .select()
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('presence heartbeat error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
