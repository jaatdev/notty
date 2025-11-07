// app/admin/page.tsx
import Link from "next/link";
import React from "react";

export default function AdminHome() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Welcome, Admin</h2>
          <p className="text-sm text-slate-400">Overview of site content and quick actions</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/notes/new" className="rounded-md bg-linear-to-r from-indigo-600 to-cyan-500 px-3 py-2 text-sm font-medium shadow">Create Note</Link>
          <Link href="/admin/import" className="rounded-md bg-slate-800/40 px-3 py-2 text-sm">Import</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="admin-card p-4 rounded-lg">
          <div className="text-sm text-slate-400">Subjects</div>
          <div className="text-2xl font-bold mt-2">—</div>
        </div>
        <div className="admin-card p-4 rounded-lg">
          <div className="text-sm text-slate-400">Notes</div>
          <div className="text-2xl font-bold mt-2">—</div>
        </div>
        <div className="admin-card p-4 rounded-lg">
          <div className="text-sm text-slate-400">Drafts</div>
          <div className="text-2xl font-bold mt-2">—</div>
        </div>
      </div>
    </div>
  );
}
