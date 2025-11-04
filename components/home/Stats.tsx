export default function Stats({ subjects, nodes, updated }: { subjects: number; nodes: number; updated?: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 -mt-8 grid sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 card">
        <div className="text-sm text-gray-500">Subjects</div>
        <div className="text-3xl font-extrabold">{subjects}</div>
      </div>
      <div className="bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 card">
        <div className="text-sm text-gray-500">Total Nodes</div>
        <div className="text-3xl font-extrabold">{nodes}</div>
      </div>
      <div className="bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 card">
        <div className="text-sm text-gray-500">Last Updated</div>
        <div className="text-3xl font-extrabold">{updated ? new Date(updated).toLocaleDateString() : '—'}</div>
      </div>
    </div>
  )
}