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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 