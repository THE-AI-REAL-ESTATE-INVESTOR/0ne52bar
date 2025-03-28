'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createCategory } from '@/actions/menu/admin';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sortOrder: z.number().default(100)
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      sortOrder: 100
    }
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await createCategory(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create category');
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

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
          Sort Order
        </label>
        <Input
          id="sortOrder"
          type="number"
          {...form.register('sortOrder', { valueAsNumber: true })}
          className={form.formState.errors.sortOrder ? 'border-red-500' : ''}
        />
        {form.formState.errors.sortOrder && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.sortOrder.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  );
} 