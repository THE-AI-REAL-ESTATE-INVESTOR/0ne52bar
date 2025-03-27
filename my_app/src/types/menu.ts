import { MenuItem as PrismaMenuItem, Category as PrismaCategory } from '@prisma/client';

export type MenuItemStatus = 'AVAILABLE' | 'NEEDS_PRICING' | 'COMING_SOON' | 'ARCHIVED';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  status: MenuItemStatus;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  total: number;
  memberId?: string;
  customerId: string;
  phoneNumber: string;
  customerName: string;
  marketingConsent: boolean;
  points: number;
  createdAt: Date;
  updatedAt: Date;
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