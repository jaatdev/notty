'use client'

// ============================================================================
// RICH TEXT EDITOR - TipTap WYSIWYG Editor
// Full-featured rich text editor with formatting toolbar
// ============================================================================

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import { useEffect } from 'react'

// Create lowlight instance with common languages
const lowlight = createLowlight()
lowlight.register('typescript', typescript)
lowlight.register('javascript', javascript)
lowlight.register('python', python)

// Simple HTML to Markdown converter (lightweight alternative to turndown)
function htmlToMarkdown(html: string): string {
  let markdown = html
    // Remove HTML tags
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<b>(.*?)<\/b>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<i>(.*?)<\/i>/g, '*$1*')
    .replace(/<u>(.*?)<\/u>/g, '$1')
    .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<ul>([\s\S]*?)<\/ul>/g, '$1')
    .replace(/<ol>([\s\S]*?)<\/ol>/g, '$1')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, '> $1\n')
    .replace(/<hr\s*\/?>/g, '\n---\n')
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  return markdown
}

// Toolbar Button Icons
const BoldIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
const ItalicIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m2 2h6M2 18h6"/></svg>
const UnderlineIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 5v8a5 5 0 0010 0V5M5 19h14"/></svg>
const StrikeIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2-10V4H7v2M5 20h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z"/></svg>
const H1Icon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><text x="2" y="18" fontSize="16" fontWeight="bold">H1</text></svg>
const H2Icon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><text x="2" y="18" fontSize="16" fontWeight="bold">H2</text></svg>
const H3Icon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><text x="2" y="18" fontSize="16" fontWeight="bold">H3</text></svg>
const BulletListIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
const OrderedListIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
const CodeIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
const QuoteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
const LinkIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
const HRIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14"/></svg>
const UndoIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
const RedoIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>

interface RichTextEditorProps {
  content: string
  onChange: (content: string, markdown: string) => void
  placeholder?: string
  className?: string
}

// Toolbar Button Component
const ToolbarButton = ({ 
  onClick, 
  active, 
  disabled, 
  icon, 
  label, 
  title 
}: { 
  onClick: () => void
  active?: boolean
  disabled?: boolean
  icon: React.ReactNode
  label?: string
  title: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded transition-colors flex items-center gap-1
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
  >
    {icon}
    {label && <span className="text-xs font-medium">{label}</span>}
  </button>
)

// Toolbar Divider
const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
)

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Write your note...', 
  className = '' 
}: RichTextEditorProps) {
  
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use lowlight version
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-600 cursor-pointer',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded p-4 font-mono text-sm',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const markdown = htmlToMarkdown(html)
      onChange(html, markdown)
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+B or Cmd+B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        editor.chain().focus().toggleBold().run()
      }
      // Ctrl+I or Cmd+I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        editor.chain().focus().toggleItalic().run()
      }
      // Ctrl+U or Cmd+U for underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        editor.chain().focus().toggleUnderline().run()
      }
      // Ctrl+Shift+X for strikethrough
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault()
        editor.chain().focus().toggleStrike().run()
      }
      // Ctrl+Shift+K for link
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        setLink(editor)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded h-96" />
  }

  // Link handler
  const setLink = (editor: Editor) => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className={`border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<BoldIcon />}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<ItalicIcon />}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={<UnderlineIcon />}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={<StrikeIcon />}
          title="Strikethrough (Ctrl+Shift+X)"
        />

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={<H1Icon />}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={<H2Icon />}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          icon={<H3Icon />}
          title="Heading 3"
        />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<BulletListIcon />}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<OrderedListIcon />}
          title="Numbered List"
        />

        <ToolbarDivider />

        {/* Code & Quote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={<CodeIcon />}
          title="Code Block"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={<QuoteIcon />}
          title="Blockquote"
        />

        <ToolbarDivider />

        {/* Link & HR */}
        <ToolbarButton
          onClick={() => setLink(editor)}
          active={editor.isActive('link')}
          icon={<LinkIcon />}
          title="Insert Link (Ctrl+Shift+K)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<HRIcon />}
          title="Horizontal Rule"
        />

        <ToolbarDivider />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<UndoIcon />}
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<RedoIcon />}
          title="Redo (Ctrl+Y)"
        />
      </div>

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-900 max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
