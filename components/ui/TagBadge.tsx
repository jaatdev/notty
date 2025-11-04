export default function TagBadge({ tag }: { tag: string }) {
  return <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 mr-1">{tag}</span>
}