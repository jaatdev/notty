'use client'

import { NoteBox } from '@/lib/admin-types'

type Props = {
  note: NoteBox
  index: number
}

export default function NoteBoxRenderer({ note }: Props) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h3 className="text-xl font-semibold mb-4">{note.title}</h3>
      <div className="text-slate-300">
        <pre className="whitespace-pre-wrap">{JSON.stringify(note.content, null, 2)}</pre>
      </div>
    </div>
  )
}
