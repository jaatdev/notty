'use client';
import React from 'react';

export type ServerMeta = {
  updatedAt?: string | number | Date;
  userId?: string | null;
  payload?: any;
};

export type MergeConflictAlertProps = {
  serverMeta?: ServerMeta | null;
  onApplyServer: () => void;
  onApplyClient: () => void;
  onAttemptMerge?: () => void;
};

export function MergeConflictAlert({
  serverMeta,
  onApplyServer,
  onApplyClient,
  onAttemptMerge,
}: MergeConflictAlertProps) {
  if (!serverMeta) return null;

  const user = serverMeta.userId ?? 'someone';
  const updated = serverMeta.updatedAt
    ? new Date(serverMeta.updatedAt).toLocaleString()
    : 'unknown';

  const payloadSummary = React.useMemo(() => {
    try {
      if (!serverMeta.payload) return 'No server payload available.';
      if (typeof serverMeta.payload === 'string') return serverMeta.payload.slice(0, 200);
      return JSON.stringify(serverMeta.payload).slice(0, 300);
    } catch (err) {
      return 'Unable to show payload.';
    }
  }, [serverMeta.payload]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4 shadow-sm"
      data-testid="merge-conflict-alert"
    >
      <div className="flex flex-col gap-3">
        <div>
          <strong className="text-yellow-800">⚠️ Merge Conflict Detected</strong>
          <p className="text-sm text-yellow-700 mt-1">
            A newer version of this note was saved by <em>{user}</em> at {updated}.
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Choose how to resolve: load the server version, overwrite it with your local changes, or attempt an automatic merge.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="merge-actions">
          <button
            aria-label="Load server version"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            onClick={onApplyServer}
            data-testid="btn-load-server"
          >
            Load Server Version
          </button>
          <button
            aria-label="Overwrite with mine"
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded"
            onClick={onApplyClient}
            data-testid="btn-overwrite"
          >
            Overwrite with Mine
          </button>
          {onAttemptMerge && (
            <button
              aria-label="Attempt auto merge"
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              onClick={onAttemptMerge}
              data-testid="btn-merge"
            >
              Attempt Auto-Merge
            </button>
          )}
        </div>

        <details className="mt-2 text-xs text-gray-700">
          <summary className="cursor-pointer">View server payload summary</summary>
          <pre data-testid="payload-summary" className="whitespace-pre-wrap break-words mt-2 text-xs text-gray-600">{payloadSummary}</pre>
        </details>
      </div>
    </div>
  );
}

export default MergeConflictAlert;
