'use client';
import React from 'react';
import Link from 'next/link';

type Props = {
  note: {
    note_key: string;
    title: string;
    excerpt?: string;
    subject_slug?: string;
    topic_id?: string;
    published_at?: string;
  };
};

export default function NoteCard({ note }: Props) {
  const url = `/notes/${encodeURIComponent(note.note_key)}`;
  return (
    <article className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
      <Link href={url} className="block">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        {note.excerpt && <p className="text-sm mt-1 line-clamp-3 text-slate-700">{note.excerpt}</p>}
        <div className="mt-3 text-xs text-slate-500">
          {note.subject_slug && <span className="mr-2">{note.subject_slug}</span>}
          {note.published_at && <span>{new Date(note.published_at).toLocaleDateString()}</span>}
        </div>
      </Link>
    </article>
  );
}
