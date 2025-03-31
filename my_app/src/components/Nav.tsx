"use client";

import React from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export default function Nav() {
  const navItems: NavItem[] = [
    { label: 'TAP PASS', href: '/tappass', icon: '🍺' },
    { label: 'Menu', href: '/menu' },
    { label: 'Merch', href: '/merch', icon: '👕' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events', icon: '📅' },
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-x-4 gap-y-3 mb-4 w-full">
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href} 
          className="text-white hover:text-blue-300 transition-colors text-sm sm:text-base md:text-lg whitespace-nowrap"
        >
          {item.icon ? (
            <span className="flex items-center">
              <span className="mr-1">{item.label}</span>
              <span className="inline-block">{item.icon}</span>
            </span>
          ) : (
            item.label
          )}
        </Link>
      ))}
    </nav>
  );
} 