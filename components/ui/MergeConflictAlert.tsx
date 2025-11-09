'use client';
import React from 'react';

type Props = {
  serverMeta: any; // { updatedAt, userId, payload }
  onApplyServer: () => void;
  onApplyClient: () => void;
  onAttemptMerge?: () => void;
};

export default function MergeConflictAlert({ serverMeta, onApplyServer, onApplyClient, onAttemptMerge }: Props) {
  if (!serverMeta) return null;

  const user = serverMeta?.userId ?? 'someone';
  const updated = serverMeta?.updatedAt ? new Date(serverMeta.updatedAt).toLocaleString() : 'unknown';

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4 shadow-sm">
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
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            onClick={onApplyServer}
          >
            Load Server Version
          </button>
          <button
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded"
            onClick={onApplyClient}
          >
            Overwrite with Mine
          </button>
          {onAttemptMerge && (
            <button
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              onClick={onAttemptMerge}
            >
              Attempt Auto-Merge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
