// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard • Notty',
  description: 'Manage your educational content'
};

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
              N
            </div>
            <div>
              <h1 className="text-lg font-semibold">Notty Admin</h1>
              <p className="text-sm text-slate-500">Content Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="text-sm px-3 py-2 rounded-md bg-white border border-slate-200 hover:shadow-sm transition-shadow"
            >
              View Site
            </Link>
            <button className="text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Publish Changes
            </button>
          </div>
        </header>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 h-fit">
            <nav className="space-y-1">
              {[
                { href: '/admin', label: 'Dashboard', icon: '📊' },
                { href: '/admin/notes', label: 'Manage Notes', icon: '�' },
                { href: '/admin/subjects', label: 'Subjects', icon: '📚' },
                { href: '/admin/import', label: 'Import/Export', icon: '📦' },
                { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9 xl:col-span-10">
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
