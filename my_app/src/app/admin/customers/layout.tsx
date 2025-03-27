import React from 'react'

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-500">Customer Management</h1>
      </div>
      {children}
    </div>
  );
}