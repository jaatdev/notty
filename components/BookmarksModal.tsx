'use client'
export default function BookmarksModal({
  open, bookmarks, titles, onClose, onRemove, onJump
}: {
  open: boolean
  bookmarks: string[]
  titles: Record<string,string>
  onClose: ()=>void
  onRemove: (id:string)=>void
  onJump: (id:string)=>void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print" onClick={(e)=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md max-h-[80vh] flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-gray-900">📌 Bookmarks</h3>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {bookmarks.length===0 ? <p className="text-gray-500">No bookmarks yet.</p> :
            bookmarks.map(id => (
              <div key={id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-gray-900">
                <a onClick={()=>{ onJump(id); onClose() }} className="flex-1 cursor-pointer hover:underline">{titles[id] || id}</a>
                <button className="ml-2 text-xs text-red-500 hover:underline" onClick={()=>onRemove(id)}>Remove</button>
              </div>
            ))
          }
        </div>
        <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg">Close</button>
      </div>
    </div>
  )
}