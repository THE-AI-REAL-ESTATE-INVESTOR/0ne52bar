"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, updateCategory } from '@/actions/merchandiseActions';
import { MerchandiseCategory } from '@prisma/client';

interface CategoryFormProps {
  params: {
    id: string;
  };
}

export default function CategoryForm({ params }: CategoryFormProps) {
  const router = useRouter();
  const isNew = params.id === 'new';
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
        if (response.success) {
          const category = response.categories.find(
            (c: MerchandiseCategory) => c.id === params.id
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
  }, [isNew, params.id]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-2">
        <button 
          onClick={() => router.push('/admin/merchandise?tab=categories')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Back to Categories
        </button>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Add New Category' : 'Edit Category'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-300">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Category Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/merchandise?tab=categories')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-md ${saving 
                ? 'bg-blue-800 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {saving ? 'Saving...' : isNew ? 'Create Category' : 'Update Category'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 