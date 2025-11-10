import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

// Simple HTML sanitizer
function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '');
}

export default async function NoteDetail({ params }: { params: Promise<{ noteKey: string }> }) {
  const { noteKey } = await params;
  if (!noteKey) return <div>Note Key required</div>;

  const { data, error } = await supa
    .from('published_notes')
    .select('note_key, title, excerpt, body_html, payload, subject_slug, topic_id, published_at')
    .eq('note_key', noteKey)
    .single();

  if (error || !data) {
    return <main className="container mx-auto p-6"><p>Note not found.</p></main>;
  }

  const safeHtml = typeof data.body_html === 'string' ? sanitizeHtml(data.body_html) : '';

  return (
    <main className="container mx-auto p-6">
      <article>
        <header className="mb-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-sm text-slate-500">{data.excerpt}</p>
          <div className="mt-2 text-xs text-slate-400">{data.subject_slug} • {data.topic_id}</div>
        </header>

        <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml }} />

        <footer className="mt-8">
          <Link href={`/notes/${encodeURIComponent(noteKey)}/flashcard`} className="inline-block px-3 py-2 bg-indigo-600 text-white rounded">
            Quiz / Flashcards
          </Link>
        </footer>
      </article>
    </main>
  );
}
