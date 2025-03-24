import React from 'react';
import Link from 'next/link';

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
        <nav className="bg-gray-900/50 p-4 mb-6 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/tappass" className="text-gray-300 hover:text-white transition-colors">
              TapPass
            </Link>
            <Link href="/admin/menu" className="text-gray-300 hover:text-white transition-colors">
              Menu
            </Link>
            <Link href="/admin/merchandise" className="text-gray-300 hover:text-white transition-colors">
              Merchandise
            </Link>
            <Link href="/admin/events" className="text-gray-300 hover:text-white transition-colors">
              Events
            </Link>
            <Link href="/admin/settings" className="text-gray-300 hover:text-white transition-colors">
              Settings
            </Link>
            <Link href="/admin/help" className="text-gray-300 hover:text-white transition-colors ml-auto">
              Help
            </Link>
          </div>
        </nav>

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