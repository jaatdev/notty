// app/admin/subjects/page.tsx
'use client';
import React from 'react';
import SubjectManager from '@/components/admin/SubjectManager';

export default function AdminSubjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Subjects</h2>
          <p className="text-sm text-slate-400">Create and organize Subjects → Topics → Subtopics</p>
        </div>
      </div>

      <SubjectManager />
    </div>
  );
}
