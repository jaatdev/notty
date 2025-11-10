'use client';
import React, { useState } from 'react';

type Card = { q: string; a: string; id?: string };

export default function Flashcard({ cards }: { cards: Card[] }) {
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  if (!cards || cards.length === 0) return <div>No flashcards.</div>;
  const card = cards[idx];

  function next() {
    setShowBack(false);
    setIdx((i) => (i + 1) % cards.length);
  }
  function prev() {
    setShowBack(false);
    setIdx((i) => (i - 1 + cards.length) % cards.length);
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="p-6 border rounded shadow-md text-center">
        <div className="text-xl min-h-16">{showBack ? card.a : card.q}</div>
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <button onClick={prev} className="px-3 py-1 border rounded">Prev</button>
        <button onClick={() => setShowBack((s) => !s)} className="px-3 py-1 bg-indigo-600 text-white rounded">{showBack ? 'Hide' : 'Flip'}</button>
        <button onClick={next} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
