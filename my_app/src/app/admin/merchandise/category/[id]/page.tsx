"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, updateCategory } from '@/actions/merchandiseActions';
import { MerchandiseCategory } from '@prisma/client';

interface CategoryFormProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryForm({ params }: CategoryFormProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    const loadCategory = async () => {
      if (isNew) return;
      
      try {
        const response = await getCategories();
        if (response.success && response.categories) {
          const category = response.categories.find(
            (c: MerchandiseCategory) => c.id === resolvedParams.id
          );
          
          if (category) {
            setFormData({
              id: category.id,
              name: category.name,
              description: category.description || '',
            });
          } else {
            setError('Category not found');
          }
        } else {
          setError(`Error loading category: ${response.error}`);
        }
      } catch (e) {
        setError('Error loading data. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [isNew, resolvedParams.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Prepare form data for submission
      const submitFormData = new FormData();
      
      if (!isNew) {
        submitFormData.append('id', formData.id);
      }
      
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);

      // Submit form
      const response = isNew 
        ? await createCategory(submitFormData)
        : await updateCategory(submitFormData);

      if (response.success) {
        router.push('/admin/merchandise?tab=categories');
      } else {
        setError(`Error saving category: ${response.error}`);
      }
    } catch (e) {
      setError('Error saving data. Please try again.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-lg text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          {isNew ? 'Create New Category' : 'Edit Category'}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/merchandise?tab=categories')}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 