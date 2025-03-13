"use client";

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Component to handle search params with suspense
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Redirect to dashboard or callback URL
      router.push(callbackUrl);
    } catch (_error) {
      console.error('Login error:', _error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-amber-500 mb-6 text-center">One-52 Bar Admin Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
            placeholder="admin@one52bar.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Access restricted to authorized personnel only.</p>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoginFormLoading() {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-amber-500 mb-6 text-center">One-52 Bar Admin Login</h1>
      <div className="text-white text-center">Loading login form...</div>
    </div>
  );
}

// Main component with Suspense
export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Suspense fallback={<LoginFormLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 