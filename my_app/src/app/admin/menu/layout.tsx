import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Management | Admin Dashboard',
  description: 'Manage menu items and categories for the restaurant.',
};

export default function AdminMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <div className="container mx-auto py-8">
        <div className="bg-gray-900/50 rounded-lg shadow-sm border border-gray-800 p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 