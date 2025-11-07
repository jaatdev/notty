// components/admin/NoteBoxCreator.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { createNotesManager } from '@/lib/notesManager';
import { NoteBoxType, NoteBox } from '@/lib/admin-types';
import { boxThemes, themeMap } from '@/lib/admin-themes';
import NoteBoxPreview from './NoteBoxPreview';
import RichTextEditor from './RichTextEditor';

const NOTES_MANAGER = createNotesManager();

const BOX_TYPES: { key: NoteBoxType; label: string; hint?: string }[] = [
  { key: 'big-notes', label: 'Big Notes', hint: 'Long explanation, headings' },
  { key: 'small-notes', label: 'Small Notes', hint: 'Bullet points / quick facts' },
  { key: 'right-wrong', label: 'Right / Wrong', hint: 'T/F statements' },
  { key: 'mnemonic-magic', label: 'Mnemonic Magic', hint: 'Mnemonic breakdown' },
  { key: 'mnemonic-card', label: 'Mnemonic Card', hint: 'Cards for quick recall' },
  { key: 'container-notes', label: 'Container Notes', hint: 'Sections / containers' },
  { key: 'quick-reference', label: 'Quick Reference', hint: 'Short labels & values' },
  { key: 'flashcard', label: 'Flashcard', hint: 'Q/A pairs' },
];

const DRAFT_KEY = (subjectId: string, topicId: string, subtopicId: string, type: string) =>
  `draft::${subjectId}::${topicId}::${subtopicId}::${type}`;

const DRAFT_HISTORY_KEY = (subjectId: string, topicId: string, subtopicId: string, type: string) =>
  `draft-history::${subjectId}::${topicId}::${subtopicId}::${type}`;

const PRESETS: Record<string, { title?: string; content: any }[]> = {
  'big-notes': [
    { title: 'Concept Explainer', content: { heading: 'Concept', body: '<p>Explain concept clearly in steps</p>' } },
    { title: 'Example + Summary', content: { heading: 'Example', body: '<p>Example here</p><p><strong>Summary:</strong> </p>' } },
  ],
  'small-notes': [
    { title: 'Quick Facts', content: { title: 'Quick facts', points: ['Point 1', 'Point 2', 'Point 3'] } },
  ],
  'flashcard': [
    { title: 'Basic Q/A', content: { title: 'Flashcards', cards: [{ id: 'f1', question: 'Q1', answer: 'A1' }] } },
  ],
};

type Props = {
  subjectId: string;
  topicId: string;
  subtopicId: string;
  onCreated?: (note: NoteBox) => void;
};

export default function NoteBoxCreator({ subjectId, topicId, subtopicId, onCreated }: Props) {
  const [type, setType] = useState<NoteBoxType>('big-notes');
  const [themeId, setThemeId] = useState<string>(() => Object.keys(themeMap)[0] || '');

  const [title, setTitle] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [pointsText, setPointsText] = useState('');
  const [flashText, setFlashText] = useState('');

  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const key = DRAFT_KEY(subjectId, topicId, subtopicId, type);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTitle(parsed.title || '');
        setBodyHtml(parsed.bodyHtml || '');
        setPointsText(parsed.pointsText || '');
        setFlashText(parsed.flashText || '');
        setLastSaved(parsed.savedAt || null);
      }
    } catch (e) {
      console.warn('draft parse fail', e);
    }
    try {
      const hk = DRAFT_HISTORY_KEY(subjectId, topicId, subtopicId, type);
      const hr = localStorage.getItem(hk);
      if (hr) setHistory(JSON.parse(hr));
    } catch {}
  }, [subjectId, topicId, subtopicId, type]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDirty) return;
      saveDraft();
    }, 5000);
    return () => clearInterval(interval);
  }, [isDirty, title, bodyHtml, pointsText, flashText, subjectId, topicId, subtopicId, type]);

  async function saveDraft() {
    try {
      const key = DRAFT_KEY(subjectId, topicId, subtopicId, type);
      const payload = { title, bodyHtml, pointsText, flashText, savedAt: Date.now() };
      
      // Save to localStorage first (immediate, offline-safe)
      localStorage.setItem(key, JSON.stringify(payload));
      setLastSaved(payload.savedAt);
      setIsDirty(false);
      
      // Update history
      const hk = DRAFT_HISTORY_KEY(subjectId, topicId, subtopicId, type);
      const entry = JSON.stringify({ ...payload, ts: payload.savedAt });
      const existing = localStorage.getItem(hk);
      const arr = existing ? JSON.parse(existing) as string[] : [];
      arr.unshift(entry);
      const sliced = arr.slice(0, 5);
      localStorage.setItem(hk, JSON.stringify(sliced));
      setHistory(sliced);

      // Sync to server (best-effort, non-blocking)
      try {
        await fetch('/api/drafts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noteKey: key,
            subjectId,
            topicId,
            subtopicId,
            type,
            userId: null, // TODO: Add actual user ID from auth
            payload,
          }),
        });
      } catch (serverErr) {
        console.warn('Server draft save failed (offline or error):', serverErr);
        // Continue - localStorage still works
      }
    } catch (err) {
      console.warn('draft save failed', err);
    }
  }

  function clearDraft() {
    try {
      const key = DRAFT_KEY(subjectId, topicId, subtopicId, type);
      localStorage.removeItem(key);
    } catch {}
    setTitle('');
    setBodyHtml('');
    setPointsText('');
    setFlashText('');
    setLastSaved(null);
    setIsDirty(false);
  }

  function restoreHistoryItem(index: number) {
    try {
      const hk = DRAFT_HISTORY_KEY(subjectId, topicId, subtopicId, type);
      const existing = localStorage.getItem(hk);
      if (!existing) return;
      const arr = JSON.parse(existing) as string[];
      const item = arr[index];
      if (!item) return;
      const parsed = JSON.parse(item);
      setTitle(parsed.title || '');
      setBodyHtml(parsed.bodyHtml || '');
      setPointsText(parsed.pointsText || '');
      setFlashText(parsed.flashText || '');
      setIsDirty(true);
    } catch (e) {
      console.warn('restore history failed', e);
    }
  }

  useEffect(() => {
    setIsDirty(true);
  }, [title, bodyHtml, pointsText, flashText, type]);

  useEffect(() => {
    const tlist = (boxThemes as any)[type] || [];
    if (tlist.length && !tlist.find((t: any) => t.id === themeId)) {
      setThemeId(tlist[0].id);
    }
  }, [type, themeId]);

  const suggestedThemes = (boxThemes as any)[type] || [];

  const contentForType = useMemo(() => {
    switch (type) {
      case 'big-notes':
        return { heading: title || 'Heading', body: bodyHtml || '<p>Long-form explanation...</p>' };
      case 'small-notes':
        return { title: title || 'Quick points', points: (pointsText || 'Point 1\nPoint 2').split('\n').filter(Boolean) };
      case 'right-wrong':
        return { title: title || 'True / False', statements: [{ id: 'r1', statement: bodyHtml || 'Sample statement', isCorrect: true }] };
      case 'mnemonic-magic':
        return { title: title || 'Mnemonic', mnemonic: title || 'RRCSP', breakdown: [{ letter: 'R', word: 'Rule', meaning: '...' }] };
      case 'mnemonic-card':
        return { title: title || 'Cards', items: [{ id: 'c1', term: 'Term', definition: 'Definition' }] };
      case 'container-notes':
        return { title: title || 'Container', sections: [{ id: 's1', heading: title || 'Section', content: bodyHtml || '<p>...</p>' }] };
      case 'quick-reference':
        return { title: title || 'Ref', facts: [{ id: 'q1', label: 'Fact', value: 'Value' }] };
      case 'flashcard':
        return {
          title: title || 'Flashcards',
          cards: (flashText || 'What is X?|X is Y').split('\n').map((line, i) => {
            const [q, a] = line.split('|').map((s: any) => (s?.trim() || ''));
            return { id: `f$i`, question: q || `Q$i`, answer: a || `A$i` };
          }),
        };
      default:
        return {};
    }
  }, [type, title, bodyHtml, pointsText, flashText]);

  function applyPreset(preset: any) {
    if (!preset) return;
    if (preset.title) setTitle(preset.title);
    if (preset.content) {
      if (preset.content.body) setBodyHtml(preset.content.body);
      if (preset.content.points) setPointsText((preset.content.points || []).join('\n'));
      if (preset.content.cards) setFlashText((preset.content.cards || []).map((c: any) => `${c.question}|${c.answer}`).join('\n'));
    }
    setIsDirty(true);
  }

  async function handleCreate() {
    if (!subjectId || !topicId || !subtopicId) {
      alert('Missing target IDs');
      return;
    }
    const nb = NOTES_MANAGER.createNoteBox(subjectId, topicId, subtopicId, type, contentForType, themeId);
    if (nb) {
      saveDraft();
      clearDraft();
      if (onCreated) onCreated(nb);
      alert('Created note');
    } else {
      alert('Failed to create note. Check IDs');
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <div className="p-4 rounded-lg admin-card">
          <div className="text-sm text-slate-300 mb-2">Box type</div>
          <div className="grid gap-2">
            {BOX_TYPES.map(b => (
              <button
                key={b.key}
                onClick={() => setType(b.key)}
                className={`text-left px-3 py-2 rounded-md border ${type === b.key ? 'border-indigo-500 bg-slate-800/30' : 'border-slate-700'}`}
              >
                <div className="font-medium">{b.label}</div>
                <div className="text-xs text-slate-400">{b.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card">
          <div className="text-sm text-slate-300 mb-2">Theme</div>
          <div className="flex flex-wrap gap-2">
            {suggestedThemes.length ? (suggestedThemes as any).map((t: any) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`px-2 py-1 rounded-md text-sm ${themeId === t.id ? 'ring-2 ring-indigo-500' : 'opacity-90'}`}
              >
                {t.name}
              </button>
            )) : (
              Object.values(themeMap).slice(0, 6).map((t: any) => (
                <button key={t.id} onClick={() => setThemeId(t.id)} className={`px-2 py-1 rounded-md text-sm ${themeId === t.id ? 'ring-2 ring-indigo-500' : ''}`}>{t.name}</button>
              ))
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card">
          <div className="text-sm text-slate-300 mb-2">Presets</div>
          <div className="flex flex-col gap-2">
            {(PRESETS as any)[type] ? (PRESETS as any)[type].map((p: any, i: number) => (
              <button key={i} className="text-left px-3 py-2 rounded bg-slate-800/30" onClick={() => applyPreset(p)}>{p.title}</button>
            )) : null}
            <button className="text-left px-3 py-2 rounded border border-slate-700" onClick={() => {
              setTitle(''); setBodyHtml(''); setPointsText(''); setFlashText('');
            }}>Clear</button>
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card">
          <div className="text-sm text-slate-300 mb-2">Drafts</div>
          <div className="text-xs text-slate-400 mb-3">Autosave every 5s. Manual save on Create.</div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-slate-300">Last saved: {lastSaved ? new Date(lastSaved).toLocaleString() : '—'}</div>
            <button onClick={saveDraft} className="px-2 py-1 rounded bg-slate-800/30 text-sm">Save Draft</button>
            <button onClick={clearDraft} className="px-2 py-1 rounded border border-slate-700 text-sm">Clear Draft</button>
            {history.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-slate-400 mb-1">History</div>
                <div className="flex flex-col gap-1">
                  {history.map((h, idx) => {
                    const parsed = JSON.parse(h);
                    return (
                      <button key={idx} onClick={() => restoreHistoryItem(idx)} className="text-left px-2 py-1 rounded bg-slate-800/20 text-xs">
                        {new Date(parsed.ts).toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCreate} className="rounded-md px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Create Note</button>
          <button onClick={() => { setTitle(''); setBodyHtml(''); setPointsText(''); setFlashText(''); }} className="rounded-md px-4 py-2 border border-slate-700">Reset</button>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg admin-card col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-300">Editor</div>
            <div className="text-xs text-slate-400">Type: {type}</div>
          </div>

          <div>
            <div className="mb-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700 mb-2" />
            </div>

            {(type === 'big-notes' || type === 'container-notes') ? (
              <RichTextEditor value={bodyHtml} onChange={setBodyHtml} placeholder="Write full content here (supports images)" />
            ) : (type === 'small-notes') ? (
              <textarea value={pointsText} onChange={(e) => setPointsText(e.target.value)} placeholder="Points, newline separated" rows={8} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            ) : (type === 'flashcard') ? (
              <textarea value={flashText} onChange={(e) => setFlashText(e.target.value)} placeholder="Flashcards: Q|A (newline per card)" rows={8} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            ) : (
              <textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} placeholder="Content (HTML or JSON preview)" rows={8} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            )}
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-2">Preview JSON (editable raw)</div>
            <pre className="rounded bg-[#061022] p-3 text-xs overflow-auto">{JSON.stringify(contentForType, null, 2)}</pre>
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card">
          <div className="mb-3 text-sm text-slate-300">Preview</div>
          <NoteBoxPreview note={{
            id: 'preview',
            type,
            title: title || 'Preview Title',
            content: contentForType as any,
            themeId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }} />
        </div>
      </div>
    </div>
  );
}
