import React from 'react';
import '../../globals.css';
import ClientApp from './client';

// Define the type for our params
type SlugParams = {
  slug: string[];
};

// Force dynamic rendering - this means this page won't be prerendered
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function Page({
  params
}: {
  params: { slug?: string[] }
}) {
  // In Next.js 15, the params object is no longer a Promise
  return <ClientApp path={params.slug?.join('/') || '/'} />;
} 