// components/admin/NoteBoxPreview.tsx
import React from "react";
import { NoteBox } from "@/lib/admin-types";
import { themeMap } from "@/lib/admin-themes";

type Props = { note: NoteBox; interactive?: boolean };

export default function NoteBoxPreview({ note, interactive = true }: Props) {
  const theme = themeMap[note.themeId] || Object.values(themeMap)[0];

  return (
    <div className="rounded-lg p-4" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-slate-400">{note.type}</div>
          <div className="text-lg font-semibold">{note.title}</div>
        </div>
        <div className="text-xs text-slate-400">{new Date(note.updatedAt || "").toLocaleString()}</div>
      </div>

      <div className="text-sm text-slate-200">
        {note.type === "big-notes" && (
          <div>
            <div className="font-medium mb-2">{(note.content as any).heading}</div>
            <div className="text-sm text-slate-300">{(note.content as any).body}</div>
          </div>
        )}

        {note.type === "small-notes" && (
          <ul className="list-disc list-inside text-slate-300">
            {((note.content as any).points || []).map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        )}

        {note.type === "flashcard" && (
          <div>
            {((note.content as any).cards || []).slice(0, 2).map((c: any) => (
              <div key={c.id} className="mb-2">
                <div className="text-slate-100 font-medium">{c.question}</div>
                <div className="text-slate-400 text-sm">Ans: {c.answer}</div>
              </div>
            ))}
          </div>
        )}

        {!(note.type === "big-notes" || note.type === "small-notes" || note.type === "flashcard") && (
          <pre className="text-xs text-slate-300">{JSON.stringify(note.content, null, 2)}</pre>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <div className="text-xs px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>{theme?.name}</div>
        <div className="text-xs px-2 py-1 rounded text-slate-400">Theme id: {note.themeId}</div>
      </div>
    </div>
  );
}
