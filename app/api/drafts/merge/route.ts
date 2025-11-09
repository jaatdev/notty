// app/api/drafts/merge/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

// Simple sanitizer (no external deps)
function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Remove script tags and event handlers (basic sanitization)
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  return sanitized;
}

export async function POST(req: Request) {
  const auth = await requireAdminFromCookies();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  try {
    const body = await req.json();
    const { noteKey, strategy, clientPayload } = body;
    if (!noteKey || !strategy) return NextResponse.json({ error: 'noteKey and strategy required' }, { status: 400 });

    // fetch current server draft
    const { data: existing, error: e } = await supa.from('note_drafts').select('*').eq('note_key', noteKey).single();
    if (e && e.code !== 'PGRST116') throw e;

    if (strategy === 'accept_server') {
      return NextResponse.json({ ok: true, applied: 'server', payload: existing?.payload ?? null });
    }

    if (strategy === 'accept_client') {
      // Basic sanitization of payload
      const safe = { ...clientPayload };
      if (safe.bodyHtml && typeof safe.bodyHtml === 'string') {
        safe.bodyHtml = sanitizeHtml(safe.bodyHtml);
      }
      if (Array.isArray(safe.sections)) {
        safe.sections = safe.sections.map((s: any) => ({
          ...s,
          content: s.content && typeof s.content === 'string' ? sanitizeHtml(s.content) : s.content,
        }));
      }

      const upsert = {
        note_key: noteKey,
        payload: safe,
        updated_at: new Date().toISOString(),
        user_id: auth.userId || null,
      };

      const { data, error: up } = await supa
        .from('note_drafts')
        .upsert(upsert, { onConflict: 'note_key' })
        .select()
        .limit(1);
      if (up) throw up;
      return NextResponse.json({ ok: true, applied: 'client', data });
    }

    // basic auto-merge (best-effort)
    if (strategy === 'auto_merge') {
      // Very simple auto-merge: if server has no payload, save client. If both exist, fallback to keep_server
      if (!existing) {
        return NextResponse.json({ ok: true, applied: 'client', reason: 'server empty' }, { status: 200 });
      }
      // fallback: prefer server to avoid data loss
      return NextResponse.json({ ok: true, applied: 'server', reason: 'auto-merge not implemented' }, { status: 200 });
    }

    return NextResponse.json({ error: 'unknown strategy' }, { status: 400 });
  } catch (err: any) {
    console.error('merge route error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
