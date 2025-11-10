'use client';
import React from 'react';
import NoteCard from './NoteCard';

export default function NotesList({ notes }: { notes: any[] }) {
  if (!notes || notes.length === 0) return <p>No notes found.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((n) => <NoteCard key={n.note_key} note={n} />)}
    </div>
  );
}
