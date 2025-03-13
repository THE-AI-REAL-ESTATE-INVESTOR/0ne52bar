"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// Define card types for the dashboard
interface AdminCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  implemented: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Define admin modules with implementation status
  const adminModules: AdminCard[] = [
    {
      title: 'Menu Management',
      description: 'Add, edit, or remove items from your menu',
      icon: '🍔',
      link: '/admin/menu',
      implemented: true
    },
    {
      title: 'Events Management',
      description: 'Manage upcoming events and promotions',
      icon: '🎵',
      link: '/admin/events',
      implemented: true
    },
    {
      title: 'Website Settings',
      description: 'Configure general business information',
      icon: '⚙️',
      link: '/admin/settings',
      implemented: true
    },
    {
      title: 'Orders Management',
      description: 'View and manage online orders',
      icon: '🛒',
      link: '/admin/orders',
      implemented: false
    },
    {
      title: 'Analytics',
      description: 'View website traffic and engagement',
      icon: '📊',
      link: '/admin/analytics',
      implemented: false
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions',
      icon: '👥',
      link: '/admin/users',
      implemented: false
    }
  ];

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-lg text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-lg">
      <div className="max-w-6xl mx-auto">
        {/* Header with admin info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-amber-500">Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-gray-300">
              Logged in as <span className="text-white font-semibold">{session?.user?.email}</span>
            </div>
            <Link 
              href="/admin/help" 
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-md font-medium"
            >
              Help Guide
            </Link>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Welcome message for first-time users */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 flex items-start">
          <div className="text-3xl mr-4">👋</div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome to your dashboard!</h2>
            <p className="text-lg text-gray-300 mb-3">
              This is where you can manage your website content. Click on any card below to get started.
            </p>
            <p className="text-base text-gray-400">
              New to the admin dashboard? Check out our <Link href="/admin/help" className="text-amber-500 hover:text-amber-400 underline">help guides</Link> or view the <Link href="/admin/Admin.md" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline">full documentation</Link>.
            </p>
          </div>
        </div>

        {/* Admin modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                module.implemented 
                  ? 'hover:shadow-lg hover:shadow-amber-500/20 hover:translate-y-[-2px]' 
                  : 'opacity-60'
              }`}
            >
              {module.implemented ? (
                <Link href={module.link} className="block p-6">
                  <div className="flex flex-col h-full">
                    <div className="text-5xl mb-4">{module.icon}</div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{module.title}</h2>
                    <p className="text-lg text-gray-400 flex-grow">{module.description}</p>
                    <div className="text-lg text-amber-500 mt-4 flex items-center">
                      <span>Manage</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="text-5xl mb-4">{module.icon}</div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{module.title}</h2>
                    <p className="text-lg text-gray-400 flex-grow">{module.description}</p>
                    <div className="text-lg text-gray-500 mt-4 flex items-center">
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick stats section */}
        <div className="mt-10 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-base text-gray-400">Total Menu Items</div>
              <div className="text-3xl font-bold text-white mt-1">24</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-base text-gray-400">Upcoming Events</div>
              <div className="text-3xl font-bold text-white mt-1">3</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-base text-gray-400">Website Visits (Monthly)</div>
              <div className="text-3xl font-bold text-white mt-1">1,240</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-base text-gray-400">
          <p>Note: This is a demo dashboard. The data shown here is for illustration purposes only.</p>
        </div>
      </div>
    </div>
  );
} 