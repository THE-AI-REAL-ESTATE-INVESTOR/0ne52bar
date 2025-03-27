import { MenuItem as PrismaMenuItem, Category as PrismaCategory } from '@prisma/client';

export type MenuItemStatus = 'AVAILABLE' | 'NEEDS_PRICING' | 'COMING_SOON' | 'ARCHIVED';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId: string;
  isActive: boolean;
  status: MenuItemStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  memberId?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface MenuItemFormData {
  name: string;
  description?: string;
  price: string;
  categoryId: string;
  isActive: boolean;
  status: MenuItemStatus;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  sortOrder: number;
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}

export interface MenuState {
  items: MenuItemWithCategory[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  items: OrderItem[];
  total: number;
  memberId?: string;
  status: Order['status'];
} 