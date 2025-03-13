'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

// Define props interface
interface ClientAppProps {
  path: string;
}

// Client-side component that will handle all routing
export default function ClientApp({ path }: ClientAppProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Client-side initialization
    setIsLoading(false);
    
    // Log current path for debugging
    console.log('Current path from props:', path);
    console.log('Current pathname from hook:', pathname);
  }, [path, pathname]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading application...</div>;
  }

  // Render client-side only content
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">152 Bar & Restaurant</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover our upcoming events and join us for great food, drinks, and unforgettable moments.
            </p>
            <Link 
              href="/admin" 
              className="bg-white text-blue-800 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Client-side Only Version</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                This is a client-side only version of the application to bypass Next.js 15 build issues.
              </p>
              <p className="mb-4">
                Current path from props: <strong>{path}</strong>
              </p>
              <p className="mb-4">
                Current path from hook: <strong>{pathname}</strong>
              </p>
              <nav className="mt-6">
                <h3 className="font-bold mb-2">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-blue-600 hover:underline">Home</Link>
                  </li>
                  <li>
                    <Link href="/events" className="text-blue-600 hover:underline">Events</Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-blue-600 hover:underline">About</Link>
                  </li>
                  <li>
                    <Link href="/menu" className="text-blue-600 hover:underline">Menu</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">152 Bar & Restaurant</h3>
                <p className="text-gray-400 mt-1">Great drinks, great times.</p>
              </div>
              <div>
                <p className="text-gray-400">© {new Date().getFullYear()} 152 Bar. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
} 