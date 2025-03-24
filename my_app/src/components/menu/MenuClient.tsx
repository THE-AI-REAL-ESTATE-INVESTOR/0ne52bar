'use client';

import MenuDisplay from '@/components/menu/MenuDisplay';
import MenuOrderSystem from '@/components/MenuOrderSystem';
import OrderButton from '@/components/OrderButton';
import type { MenuItem, Category } from '@prisma/client';

type MenuItemWithCategory = MenuItem & {
  category: Category & {
    sortOrder: number;
    description?: string;
  };
};

interface MenuClientProps {
  items: MenuItemWithCategory[];
}

export default function MenuClient({ items }: MenuClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <MenuDisplay items={items} />
      <MenuOrderSystem />
      <OrderButton />
    </div>
  );
} 