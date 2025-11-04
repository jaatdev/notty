'use client'
import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import type { MarkdownNode } from '@/lib/types'
import BookmarkButton from '../ui/BookmarkButton'
import MetaBar from '../ui/MetaBar'
import RefChip from '../ui/RefChip'
import ReferencesDrawer from '../ui/ReferencesDrawer'
import NodeReadMeta, { estimateMinutes } from '../ui/NodeReadMeta'
import ImageZoom from '../ui/ImageZoom'
import CodeBlock from '../ui/CodeBlock'

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}

// [[case: Label|https://...]] or [[article: Art. 368]]
function transformInlineRefs(md: string) {
  const re = /\[\[(\w+):\s*([^\]|]+?)(?:\|([^\]]+))?\]\]/g
  return md.replace(re, (_m, type, label, url) => {
    return `<ref-chip data-type="${String(type).toLowerCase()}" data-label="${escapeHtml(label.trim())}" data-href="${url ? escapeHtml(url.trim()) : ''}"></ref-chip>`
  })
}

function MarkdownImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { className, ...rest } = props
  return (
    <ImageZoom 
      className={`rounded-lg border border-gray-700 shadow-lg my-4 mx-auto hover:border-emerald-500/50 transition-colors ${className || ''}`} 
      {...rest} 
    />
  )
}

export default function NodeMarkdown({
  node, bookmarked, onToggleBookmark
}: { node: MarkdownNode, bookmarked: boolean, onToggleBookmark: ()=>void }) {
  const [showRefs, setShowRefs] = useState(false)
  const body = useMemo(()=>transformInlineRefs(node.body), [node.body])
  const minutes = useMemo(() => estimateMinutes(node.body), [node.body])

  return (
    <section id={node.id} data-node-id={node.id} className="bg-gray-900 dark:bg-gray-950 p-6 rounded-2xl card border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="text-lg md:text-xl font-bold text-gray-200">{node.title}</h4>
        <div className="flex items-center gap-2">
          {node.meta?.refs?.length ? (
            <button onClick={()=>setShowRefs(true)} className="text-xs border px-2 py-1 rounded bg-emerald-900/30 text-emerald-300 border-emerald-700 hover:bg-emerald-800/40">References</button>
          ) : null}
          <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
        </div>
      </div>
      {node.mnemonic && <p className="mt-1 text-sm text-gray-300">💡 Mnemonic: <span className="mnemonic-text">{node.mnemonic}</span></p>}
      <MetaBar meta={node.meta} />
      <NodeReadMeta targetId={node.id} minutes={minutes} />
      <div className="prose prose-slate prose-invert max-w-none text-gray-300 mt-3">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw as any, rehypeHighlight as any]}
          components={{
            // open links in new tab
            a: ({node: _n, ...p}) => <a {...p} target="_blank" rel="noopener noreferrer" className="underline text-emerald-400 hover:text-emerald-300" />,
            img: (p) => <MarkdownImage {...p} />,
            // enhanced code blocks with copy button
            code: ({node: _n, inline, className, children, ...p}: any) => {
              if (inline) {
                return <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-sm font-mono" {...p}>{children}</code>
              }
              return <CodeBlock className={className} language={className?.replace('language-', '')}>{String(children).replace(/\n$/, '')}</CodeBlock>
            },
            // custom inline chips rendered from <ref-chip ...>
            // @ts-expect-error custom tag from rehypeRaw
            'ref-chip': (p: any) => <RefChip type={p['data-type']} label={p['data-label']} href={p['data-href'] || undefined} />,
          }}
        >
          {body}
        </ReactMarkdown>
      </div>

      {node.meta?.refs?.length ? (
        <ReferencesDrawer open={showRefs} refs={node.meta.refs} onClose={()=>setShowRefs(false)} />
      ) : null}
    </section>
  )
}