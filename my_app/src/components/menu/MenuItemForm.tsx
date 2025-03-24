'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createMenuItem } from '@/actions/menu/admin';
import type { Category } from '@/types/menu';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(100)
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  categories: Category[];
}

export function MenuItemForm({ categories }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      price: '',
      description: '',
      categoryId: '',
      isActive: true,
      sortOrder: 100
    }
  });

  const onSubmit = async (data: MenuItemFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await createMenuItem(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create menu item');
      }
      
      // Reset form on success
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input
          id="name"
          {...form.register('name')}
          className={form.formState.errors.name ? 'border-red-500' : ''}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <Input
          id="price"
          type="text"
          {...form.register('price')}
          className={form.formState.errors.price ? 'border-red-500' : ''}
        />
        {form.formState.errors.price && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={form.watch('categoryId')}
          onValueChange={(value) => form.setValue('categoryId', value)}
        >
          <SelectTrigger className={form.formState.errors.categoryId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.categoryId && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.categoryId.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          {...form.register('description')}
          className={form.formState.errors.description ? 'border-red-500' : ''}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch('isActive')}
          onCheckedChange={(checked) => form.setValue('isActive', checked)}
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Active
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Menu Item'}
      </Button>
    </form>
  );
} 