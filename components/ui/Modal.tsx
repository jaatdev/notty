// components/ui/Modal.tsx
'use client';
import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl p-6 bg-slate-900/80 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="px-2 py-1 rounded bg-slate-800/30">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
