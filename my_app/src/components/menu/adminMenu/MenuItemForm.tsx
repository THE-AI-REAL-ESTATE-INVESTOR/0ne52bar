'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createMenuItem } from '@/actions/menu/admin';
import type { Category, MenuItemStatus } from '@/types/menu';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string()
    .min(1, 'Price is required')
    .transform((val) => {
      // Remove any existing $ and format as number with 2 decimal places
      const price = parseFloat(val.replace('$', ''));
      if (isNaN(price)) throw new Error('Invalid price format');
      return price.toFixed(2);
    }),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(100),
  imageUrl: z.string().optional(),
  status: z.enum(['AVAILABLE', 'NEEDS_PRICING', 'COMING_SOON', 'ARCHIVED']).default('AVAILABLE')
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  categories: Category[];
  initialData?: MenuItemFormData;
  onSubmit?: (data: MenuItemFormData) => Promise<void>;
  onCancel?: () => void;
}

export function MenuItemForm({ categories, initialData, onSubmit, onCancel }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      name: '',
      price: '',
      description: '',
      categoryId: '',
      isActive: true,
      sortOrder: 100,
      imageUrl: '',
      status: 'AVAILABLE'
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = async (data: MenuItemFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (onSubmit) {
        await onSubmit(data);
      } else {
        const response = await createMenuItem(data);
        if (!response.success) {
          throw new Error(response.error || 'Failed to create menu item');
        }
        form.reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...form.register('name')}
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          {...form.register('price')}
          placeholder="0.00"
          onChange={(e) => {
            // Remove non-numeric characters except decimal point
            const value = e.target.value.replace(/[^\d.]/g, '');
            // Ensure only one decimal point
            const parts = value.split('.');
            const formatted = parts.length > 1 
              ? `${parts[0]}.${parts[1].slice(0, 2)}`
              : value;
            form.setValue('price', formatted);
          }}
          disabled={isSubmitting}
        />
        {form.formState.errors.price && (
          <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select
          value={form.watch('categoryId')}
          onValueChange={(value) => form.setValue('categoryId', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
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
          <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.watch('status')}
          onValueChange={(value) => form.setValue('status', value as MenuItemStatus)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="NEEDS_PRICING">Needs Pricing</SelectItem>
            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.status && (
          <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch('isActive')}
          onCheckedChange={(checked) => form.setValue('isActive', checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div>
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          {...form.register('sortOrder', { valueAsNumber: true })}
          disabled={isSubmitting}
        />
        {form.formState.errors.sortOrder && (
          <p className="text-sm text-red-500">{form.formState.errors.sortOrder.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-500'}`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="relative aspect-square w-full max-w-xs mx-auto">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl(null);
                  form.setValue('imageUrl', '');
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="text-gray-500">
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag and drop an image here, or click to select</p>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-amber-500 hover:bg-amber-600"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Menu Item' : 'Create Menu Item'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
} 