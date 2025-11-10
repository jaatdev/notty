import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminFromCookies } from '@/lib/adminAuth';

const supa = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Simple HTML sanitizer (replaces isomorphic-dompurify to avoid ESM issues)
function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '');
}

export async function POST(req: NextRequest) {
  try {
    // Admin auth check
    const auth = await requireAdminFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message || 'Unauthorized' }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { noteKey } = body;

    if (!noteKey) {
      return NextResponse.json({ error: 'noteKey required' }, { status: 400 });
    }

    // Fetch draft from note_drafts
    const { data: draft, error: fetchErr } = await supa
      .from('note_drafts')
      .select('payload, note_key, subject_slug, topic_id, subtopic_id')
      .eq('note_key', noteKey)
      .single();

    if (fetchErr && fetchErr.code && fetchErr.code !== 'PGRST116') {
      console.error('publish: fetch draft err', fetchErr);
      return NextResponse.json({ error: fetchErr.message || 'DB error' }, { status: 500 });
    }

    if (!draft) {
      return NextResponse.json({ error: 'draft not found' }, { status: 404 });
    }

    const payload = draft.payload ?? {};
    // Sanitize HTML content if present
    const bodyHtml = payload.bodyHtml
      ? sanitizeHtml(payload.bodyHtml)
      : payload.sections
        ? payload.sections.map((s: any) => s.content || '').join('\n')
        : '';

    const upsertData = {
      note_key: noteKey,
      subject_slug: draft.subject_slug || payload.subject_slug || null,
      topic_id: draft.topic_id || payload.topic_id || null,
      subtopic_id: draft.subtopic_id || payload.subtopic_id || null,
      title: payload.title || 'Untitled',
      description: payload.excerpt || '',
      body_html: bodyHtml,
      payload,
      published_by: auth.userId || null,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: pub, error: upErr } = await supa
      .from('published_notes')
      .upsert(upsertData, { onConflict: 'note_key' })
      .select()
      .limit(1);

    if (upErr) {
      console.error('publish upsert error', upErr);
      return NextResponse.json({ error: upErr.message || 'DB upsert error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, published: pub?.[0] ?? null });
  } catch (err: any) {
    console.error('publish route err', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
