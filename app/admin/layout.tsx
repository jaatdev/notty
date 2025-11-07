import React from 'react';
import Link from 'next/link';
import "@/styles/admin.css";

export const metadata = {
  title: "Admin - Notty",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-slate-900 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 p-4 border-r border-slate-800 bg-[#0b1220]">
          <div className="mb-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                N
              </div>
              <div>
                <div className="text-lg font-semibold">Notty Admin</div>
                <div className="text-sm text-slate-400">Control Center</div>
              </div>
            </Link>
          </div>
          <nav className="space-y-1">
            <Link href="/admin" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800/60">
              Dashboard
            </Link>
            <Link href="/admin/notes" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800/60">
              Notes
            </Link>
            <Link href="/subjects" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800/60">
              Subjects
            </Link>
            <Link href="/analytics" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800/60">
              Analytics
            </Link>
          </nav>
          <div className="mt-6 border-t border-slate-800 pt-4 text-sm text-slate-400">
            <div className="mb-2">Quick Actions</div>
            <div className="flex flex-col gap-2">
              <Link href="/admin" className="rounded px-2 py-1 bg-slate-800/40 hover:bg-slate-800/60">
                New Subject
              </Link>
              <Link href="/admin/notes" className="rounded px-2 py-1 bg-slate-800/40 hover:bg-slate-800/60">
                Manage Notes
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin</h1>
              <p className="text-sm text-slate-400">Manage content, themes, and users</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-slate-800/40 px-3 py-1 text-sm">
                DB: connected
              </div>
              <Link href="/" target="_blank" className="rounded-md bg-linear-to-r from-indigo-600 to-cyan-500 px-3 py-1 text-sm font-medium shadow hover:opacity-90">
                View Site
              </Link>
            </div>
          </header>
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-800/20 p-6 shadow-lg">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
