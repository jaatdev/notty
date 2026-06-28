'use client';

import { useEffect, useRef } from 'react';

interface CanvasOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  questionIndex?: number;
}

export default function CanvasOverlay({ isOpen, onClose, questionIndex }: CanvasOverlayProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Disable body scroll when drawing
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle cross-origin messages from Cosmic Canvas
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // For security, you might want to verify origin here
      // if (event.origin !== 'https://trickfunda-canvas.vercel.app') return;
      
      if (event.data?.type === 'CLOSE_CANVAS') {
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  // Auto-clear canvas when question changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_CANVAS' }, '*');
    }
  }, [questionIndex]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col pointer-events-auto bg-black/20 ${isOpen ? 'block' : 'hidden'}`}>
      <iframe
        ref={iframeRef}
        src="https://trickfunda-canvas.vercel.app/?mode=overlay"
        className="w-full h-full border-none bg-transparent"
        allowTransparency={true}
      />
    </div>
  );
}
