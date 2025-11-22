'use client'
import { useState, useEffect } from 'react'

interface ImageZoomProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  zoomable?: boolean
}

export default function ImageZoom({ zoomable = true, className, alt, ...props }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isZoomed])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false)
    }
    if (isZoomed) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isZoomed])

  if (!zoomable) {
    return <img className={className} alt={alt} {...props} />
  }

  return (
    <>
      <img 
        className={`${className} cursor-zoom-in hover:opacity-90 transition-opacity`}
        style={{maxHeight: '300px', height: 'auto', objectFit: 'contain', ...props.style}}
        alt={alt}
        onClick={() => setIsZoomed(true)}
        {...props}
      />
      
      {isZoomed && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-emerald-400 transition-colors z-10"
            aria-label="Close"
          >
            ✕
          </button>
          
          <img
            src={props.src}
            alt={alt}
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(false)
            }}
          />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-gray-900/80 px-4 py-2 rounded-full backdrop-blur-sm">
            Press <kbd className="px-2 py-1 bg-gray-800 rounded text-emerald-400 font-mono">ESC</kbd> or click to close
          </div>
        </div>
      )}
    </>
  )
}
