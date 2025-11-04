'use client'
export default function Toolbar({
  focusMode, setFocusMode,
  instantQuiz, setInstantQuiz,
  exportPDF, copyMnemonics,
  onOpenRefsAll,
}: {
  focusMode: boolean
  setFocusMode: (v:boolean)=>void
  instantQuiz: boolean
  setInstantQuiz: (v:boolean)=>void
  exportPDF: ()=>void
  copyMnemonics: ()=>void
  onOpenRefsAll: ()=>void
}) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center hero-buttons">
      <button onClick={onOpenRefsAll} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur transition">All References</button>
      <button onClick={()=>setFocusMode(!focusMode)} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur transition">Focus Mode</button>
      <button onClick={copyMnemonics} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur transition">Copy Mnemonics</button>
      <button onClick={exportPDF} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur transition">📄 Export PDF</button>
      <button onClick={()=>window.print()} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur transition">🖨️ Print</button>
      <label className="ml-0 sm:ml-3 mt-1 sm:mt-0 inline-flex items-center gap-2 text-white/90 text-sm">
        <input type="checkbox" checked={instantQuiz} onChange={(e)=>setInstantQuiz(e.target.checked)} />
        Instant Quiz
      </label>
    </div>
  )
}