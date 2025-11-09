/**
 * components/ui/PresenceBadge.tsx
 * Shows avatars of active collaborators with tooltips.
 */

'use client';

import React from 'react';

interface PresenceMember {
  userId: string;
  displayName?: string | null;
  lastActive?: string | null;
  cursor?: any;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return 'unknown';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  } catch {
    return 'unknown';
  }
}

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

function getColorForUser(userId: string): string {
  const hash = userId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
}

export default function PresenceBadge({ members = [] }: { members?: PresenceMember[] }) {
  if (!members || members.length === 0) {
    return null;
  }

  const displayMembers = members.slice(0, 5);
  const remaining = Math.max(0, members.length - 5);

  return (
    <div className="flex items-center gap-1">
      {displayMembers.map((member) => (
        <div
          key={member.userId}
          title={`${member.displayName || member.userId}\n${timeAgo(member.lastActive)}`}
          className={`w-8 h-8 rounded-full ${getColorForUser(member.userId)} text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform`}
        >
          {getInitials(member.displayName)}
        </div>
      ))}
      {remaining > 0 && (
        <div className="text-xs text-slate-500 font-medium px-2">
          +{remaining}
        </div>
      )}
    </div>
  );
}
