// components/ui/ConfirmDialog.tsx
'use client';
import React from 'react';

type Props = {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl p-6 bg-slate-900/80 border border-slate-800 shadow-lg">
        <div className="text-lg font-semibold mb-4">Confirm</div>
        <div className="text-sm text-slate-300 mb-6">{title}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-1 rounded border border-slate-700">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-rose-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
