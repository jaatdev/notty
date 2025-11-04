'use client'
export default function SearchBar({ value, onChange, placeholder='Search...' }: { value: string, onChange: (v: string)=>void, placeholder?: string }) {
  return (
    <div className="relative">
      <input 
        value={value} 
        onChange={(e)=>onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
      />
      {value && (
        <button 
          onClick={()=>onChange('')} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-xs transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}