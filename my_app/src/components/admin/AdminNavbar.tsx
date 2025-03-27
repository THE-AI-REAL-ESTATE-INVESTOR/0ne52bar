'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/menu/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/tappass', label: 'TapPass' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/merchandise', label: 'Merchandise' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/help', label: 'Help', className: 'ml-auto' }
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900/50 p-4 mb-6 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              ${item.className || ''} 
              ${pathname.startsWith(item.href) 
                ? 'text-amber-500 font-medium' 
                : 'text-gray-300'
              } 
              hover:text-white transition-colors
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
} 