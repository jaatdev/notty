// components/admin/NoteBoxCreator.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createNotesManager } from "@/lib/notesManager";
import { NoteBoxType, NoteBox } from "@/lib/admin-types";
import { boxThemes, themeMap } from "@/lib/admin-themes";
import NoteBoxPreview from "./NoteBoxPreview";

type CreatorProps = {
  subjectId: string;
  topicId: string;
  subtopicId: string;
  onCreated?: (note: NoteBox) => void;
};

const NOTES_MANAGER = createNotesManager();

const BOX_TYPES: { key: NoteBoxType; label: string; hint?: string }[] = [
  { key: "big-notes", label: "Big Notes", hint: "Long explanation, headings" },
  { key: "small-notes", label: "Small Notes", hint: "Bullet points / quick facts" },
  { key: "right-wrong", label: "Right / Wrong", hint: "T/F statements" },
  { key: "mnemonic-magic", label: "Mnemonic Magic", hint: "Mnemonic breakdown" },
  { key: "mnemonic-card", label: "Mnemonic Card", hint: "Cards for quick recall" },
  { key: "container-notes", label: "Container Notes", hint: "Sections / containers" },
  { key: "quick-reference", label: "Quick Reference", hint: "Short labels & values" },
  { key: "flashcard", label: "Flashcard", hint: "Q/A pairs" },
];

export default function NoteBoxCreator({ subjectId, topicId, subtopicId, onCreated }: CreatorProps) {
  const [type, setType] = useState<NoteBoxType>("big-notes");
  const [themeId, setThemeId] = useState<string>(() => {
    const first = Object.keys(themeMap)[0];
    return first || "";
  });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [points, setPoints] = useState<string>("");
  const [flashQA, setFlashQA] = useState<string>("");

  useEffect(() => {
    const tlist = boxThemes[type] || [];
    if (tlist.length && !tlist.find(t => t.id === themeId)) {
      setThemeId(tlist[0].id);
    }
  }, [type, themeId]);

  const suggestedThemes = boxThemes[type] || [];

  const contentForType = useMemo(() => {
    switch (type) {
      case "big-notes":
        return { heading: title || "Heading", body: body || "Long-form explanation..." };
      case "small-notes":
        return { title: title || "Quick points", points: (points || "Point 1\nPoint 2").split("\n").filter(Boolean) };
      case "right-wrong":
        return { title: title || "True / False", statements: [{ id: "r1", statement: body || "Sample statement", isCorrect: true }] };
      case "mnemonic-magic":
        return { title: title || "Mnemonic", mnemonic: title || "RRCSP", breakdown: [{ letter: "R", word: "Rule", meaning: "..." }] };
      case "mnemonic-card":
        return { title: title || "Cards", items: [{ id: "c1", term: "Term", definition: "Definition" }] };
      case "container-notes":
        return { title: title || "Container", sections: [{ id: "s1", heading: "Section", content: body || "..." }] };
      case "quick-reference":
        return { title: title || "Ref", facts: [{ id: "q1", label: "Fact", value: "Value" }] };
      case "flashcard":
        return {
          title: title || "Flashcards",
          cards: (flashQA || "What is X?|X is Y").split("\n").map((line, i) => {
            const [q, a] = line.split("|").map(s => s?.trim() || "");
            return { id: `f${i}`, question: q || `Q${i}`, answer: a || `A${i}` };
          }),
        };
      default:
        return {};
    }
  }, [type, title, body, points, flashQA]);

  async function handleCreate() {
    const nb = NOTES_MANAGER.createNoteBox(subjectId, topicId, subtopicId, type, contentForType, themeId);
    if (nb) {
      if (onCreated) onCreated(nb);
      setTitle("");
      setBody("");
      setPoints("");
      setFlashQA("");
      alert("Note created");
    } else {
      alert("Failed to create note. Check IDs");
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
                className={`text-left px-3 py-2 rounded-md border ${type === b.key ? "border-indigo-500 bg-slate-800/30" : "border-slate-700"}`}
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
            {suggestedThemes.length ? suggestedThemes.map(t => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`px-2 py-1 rounded-md text-sm ${themeId === t.id ? "ring-2 ring-indigo-500" : "opacity-90"}`}
              >
                {t.name}
              </button>
            )) : (
              Object.values(themeMap).slice(0, 6).map(t => (
                <button key={t.id} onClick={() => setThemeId(t.id)} className={`px-2 py-1 rounded-md text-sm ${themeId === t.id ? "ring-2 ring-indigo-500" : ""}`}>{t.name}</button>
              ))
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card">
          <div className="text-sm text-slate-300 mb-2">Content (minimal)</div>
          <div className="space-y-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title / Heading" className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body (long text)" rows={4} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            <textarea value={points} onChange={e => setPoints(e.target.value)} placeholder="Points (newline separated)" rows={3} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
            <textarea value={flashQA} onChange={e => setFlashQA(e.target.value)} placeholder="Flashcards Q|A (newline separated)" rows={3} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCreate} className="rounded-md px-4 py-2 bg-linear-to-r from-indigo-600 to-cyan-500 text-white">Create Note</button>
          <button onClick={() => { setTitle(""); setBody(""); setPoints(""); setFlashQA(""); }} className="rounded-md px-4 py-2 border border-slate-700">Reset</button>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg admin-card">
          <div className="mb-3 text-sm text-slate-300">Editor (live preview source)</div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Minimal JSON content (for debugging)</div>
            <pre className="rounded bg-[#061022] p-3 text-xs overflow-auto">{JSON.stringify(contentForType, null, 2)}</pre>
          </div>
        </div>

        <div className="p-4 rounded-lg admin-card col-span-1">
          <div className="mb-3 text-sm text-slate-300">Preview</div>
          <NoteBoxPreview note={{
            id: "preview",
            type,
            title: title || "Preview Title",
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
