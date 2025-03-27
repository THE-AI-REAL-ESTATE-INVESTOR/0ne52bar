'use client';

import MenuDisplay from './MenuDisplay';
import MenuOrderModal from './MenuOrderModal';
import OrderButton from './OrderButton';
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
    <>
      <MenuDisplay items={items} />
      <MenuOrderModal />
      <OrderButton />
    </>
  );
} 