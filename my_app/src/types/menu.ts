import { MenuItem as PrismaMenuItem, Category as PrismaCategory } from '@prisma/client';

export interface MenuItem extends Omit<PrismaMenuItem, 'category'> {
  category?: Category;
}

export interface Category extends PrismaCategory {}

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
  price: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
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