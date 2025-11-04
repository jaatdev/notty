'use client'
export default function Toc({ items, activeId, onJump }: { items: {id:string,title:string,level:number}[], activeId?: string|null, onJump:(id:string)=>void }) {
  return (
    <ul className="space-y-2">
      {items.map(t => (
        <li key={t.id}>
          <a 
            onClick={(e)=>{e.preventDefault(); onJump(t.id)}} 
            className={`cursor-pointer text-gray-300 hover:text-white transition-colors block ${activeId===t.id ? 'active bg-emerald-900/40! border-emerald-600! text-emerald-300!' : ''}`}
            title={t.title}
          >
            <span className="inline-block mr-2">📄</span>
            <span className="wrap-break-word">{t.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}