// app/api/drafts/delete/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';
import rateLimit from '@/lib/rateLimiter';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

export async function POST(req: Request) {
  // Verify Clerk auth via cookies (App Router)
  const auth = await requireAdminFromCookies();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status || 401 });

  try {
    const { noteKey } = await req.json();
    
    if (!noteKey) {
      return NextResponse.json({ error: 'missing noteKey' }, { status: 400 });
    }

    // Rate limit: 20 deletes per minute per user (deletes should be rare)
    const rlKey = `delete:${auth.userId}`;
    const rl = rateLimit.inMemory(rlKey, 20, 60 * 1000, 1);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Delete rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
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
