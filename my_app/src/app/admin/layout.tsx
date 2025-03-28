import React from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      {/* Admin Header */}
      <header className="bg-gray-900/50 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ONE-52 Admin</h1>
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            View Site
          </Link>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Admin Navigation */}
        <AdminNavbar />

        {/* Main Content */}
        <main className="bg-gray-900/50 p-6 rounded-lg">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ONE-52 Bar & Grill - Admin Portal</p>
        </footer>
      </div>
    </div>
  );
} 