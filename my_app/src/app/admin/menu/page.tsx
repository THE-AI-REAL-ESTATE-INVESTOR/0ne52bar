"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMenuItems, getCategories } from '@/actions/menu/admin';
import { MenuItemTable } from '@/components/menu/MenuItemTable';
import { CategoryTable } from '@/components/menu/CategoryTable';
import { MenuItemForm } from '@/components/menu/MenuItemForm';
import { CategoryForm } from '@/components/menu/CategoryForm';
import { MenuSkeleton } from '@/components/menu/MenuSkeleton';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

export default async function AdminMenuPage() {
  const [menuItemsResponse, categoriesResponse] = await Promise.all([
    getMenuItems(),
    getCategories()
  ]);

  if (!menuItemsResponse.success || !categoriesResponse.success) {
    throw new Error('Failed to load menu data');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
          <Suspense fallback={<MenuSkeleton />}>
            <MenuItemForm categories={categoriesResponse.data} />
          </Suspense>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
          <Suspense fallback={<MenuSkeleton />}>
            <CategoryForm />
          </Suspense>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
        <Suspense fallback={<MenuSkeleton />}>
          <MenuItemTable items={menuItemsResponse.data} categories={categoriesResponse.data} />
        </Suspense>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <Suspense fallback={<MenuSkeleton />}>
          <CategoryTable categories={categoriesResponse.data} />
        </Suspense>
      </div>
    </div>
  );
} 