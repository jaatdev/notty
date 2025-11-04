'use client'
import { brandMap, BrandKey } from '@/lib/brand'
import Toolbar from './Toolbar'

export default function SubjectHeader({
  title, description, brand,
  focusMode, setFocusMode,
  instantQuiz, setInstantQuiz,
  exportPDF, copyMnemonics,
  onOpenRefsAll,
}: {
  title: string
  description?: string
  brand: BrandKey
  focusMode: boolean
  setFocusMode: (v:boolean)=>void
  instantQuiz: boolean
  setInstantQuiz: (v:boolean)=>void
  exportPDF: ()=>void
  copyMnemonics: ()=>void
  onOpenRefsAll: ()=>void
}) {
  return (
    <header className="hero-bg text-white relative overflow-hidden no-print">
      <div className="p-10 md:p-14 shadow-2xl relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3">{title}</h1>
          {description && <p className="text-lg md:text-2xl opacity-90">{description}</p>}
          <Toolbar
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            instantQuiz={instantQuiz}
            setInstantQuiz={setInstantQuiz}
            exportPDF={exportPDF}
            copyMnemonics={copyMnemonics}
            onOpenRefsAll={onOpenRefsAll}
          />
        </div>
        <div className="hero-dots"></div>
      </div>
    </header>
  )
}