"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminRedirect() {
  const router = useRouter();
  const { status } = useSession();
  
  useEffect(() => {
    // If the user is loading, do nothing yet
    if (status === 'loading') return;
    
    // If the user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    
    // If authenticated, redirect to dashboard
    router.push('/admin/dashboard');
  }, [router, status]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white">
        <p className="text-lg">Redirecting to admin dashboard...</p>
        <div className="mt-4 w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 