/**
 * components/ui/RemoteDraftAlert.tsx
 * Shows a banner when remote changes are detected (newer draft from another user).
 */

'use client';

import React from 'react';

interface RemoteDraftAlertProps {
  remoteUser: string;
  remoteTimestamp: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export default function RemoteDraftAlert({
  remoteUser,
  remoteTimestamp,
  onAccept,
  onDismiss,
}: RemoteDraftAlertProps) {
  const time = new Date(remoteTimestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-900">
      <div>
        <strong>{remoteUser}</strong> saved changes at <strong>{time}</strong>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
        >
          Merge
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 bg-slate-300 text-slate-900 rounded hover:bg-slate-400 transition-colors text-xs font-medium"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
