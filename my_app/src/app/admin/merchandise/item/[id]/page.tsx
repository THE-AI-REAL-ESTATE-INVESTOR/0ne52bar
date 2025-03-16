"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { 
  getCategories, 
  getMerchandiseById, 
  createMerchandise, 
  updateMerchandise 
} from '@/actions/merchandiseActions';
import { MerchandiseCategory } from '@prisma/client';

interface MerchandiseItemFormProps {
  params: {
    id: string;
  };
}

export default function MerchandiseItemForm({ params }: MerchandiseItemFormProps) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<MerchandiseCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    categoryId: '',
    sortOrder: '100',
    inStock: false,
    comingSoon: true,
    imagePath: '',
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
    multiple: false,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load categories
        const categoryResponse = await getCategories();
        if (categoryResponse.success) {
          setCategories(categoryResponse.categories);
          
          // If there are categories, set the first one as default for new items
          if (!isNew || categoryResponse.categories.length === 0) return;
          
          setFormData(prev => ({
            ...prev,
            categoryId: categoryResponse.categories[0]?.id || '',
          }));
        } else {
          setError(`Error loading categories: ${categoryResponse.error}`);
        }

        // Load merchandise item if editing
        if (!isNew) {
          const itemResponse = await getMerchandiseById(params.id);
          if (itemResponse.success && itemResponse.item) {
            const item = itemResponse.item;
            setFormData({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              categoryId: item.categoryId,
              sortOrder: item.sortOrder.toString(),
              inStock: item.inStock,
              comingSoon: item.comingSoon,
              imagePath: item.imagePath || '',
            });
            
            if (item.imagePath) {
              setPreviewImage(item.imagePath);
            }
          } else {
            setError(`Error loading merchandise item: ${itemResponse.error}`);
          }
        }
      } catch (e) {
        setError('Error loading data. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isNew, params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
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
      submitFormData.append('price', formData.price);
      submitFormData.append('categoryId', formData.categoryId);
      submitFormData.append('sortOrder', formData.sortOrder);
      submitFormData.append('inStock', formData.inStock.toString());
      submitFormData.append('comingSoon', formData.comingSoon.toString());
      
      // Image handling would normally go here
      // For now, we'll just use the imagePath field
      if (formData.imagePath) {
        submitFormData.append('imagePath', formData.imagePath);
      }
      
      // If there's a new image file, you would upload it here
      // and then get the path to include in the merchandise record
      if (imageFile) {
        // This is where you would upload the file
        // For now, we'll just simulate it
        const mockUploadedPath = `/images/merch/${imageFile.name}`;
        submitFormData.append('imagePath', mockUploadedPath);
      }

      // Submit form
      const response = isNew 
        ? await createMerchandise(submitFormData)
        : await updateMerchandise(submitFormData);

      if (response.success) {
        router.push('/admin/merchandise');
      } else {
        setError(`Error saving merchandise: ${response.error}`);
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
          onClick={() => router.push('/admin/merchandise')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Back to Merchandise
        </button>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Add New Merchandise Item' : 'Edit Merchandise Item'}
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
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="name">
                  Name*
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
                <label className="block text-gray-300 mb-2" htmlFor="price">
                  Price*
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="$24.99"
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="categoryId">
                  Category*
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="sortOrder">
                  Sort Order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                />
                <p className="text-gray-400 text-sm mt-1">Lower numbers appear first</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="inStock"
                    name="inStock"
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={handleCheckboxChange}
                    className="mr-2 bg-gray-700 border-gray-600"
                  />
                  <label className="text-gray-300" htmlFor="inStock">
                    In Stock
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="comingSoon"
                    name="comingSoon"
                    type="checkbox"
                    checked={formData.comingSoon}
                    onChange={handleCheckboxChange}
                    className="mr-2 bg-gray-700 border-gray-600"
                  />
                  <label className="text-gray-300" htmlFor="comingSoon">
                    Coming Soon
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="description">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Product Image
                </label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600'} rounded-lg p-6 text-center cursor-pointer`}
                >
                  <input {...getInputProps()} />
                  {previewImage ? (
                    <div className="mb-2 relative h-48 mx-auto">
                      <Image 
                        src={previewImage} 
                        alt="Product preview" 
                        className="mx-auto object-contain h-full" 
                        width={200}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="text-5xl mb-2">📷</div>
                  )}
                  <p className="text-gray-300">
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop an image here, or click to select"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    JPEG, PNG or WebP, max 5MB
                  </p>
                </div>
                
                {/* Alternative manual image path input */}
                <div className="mt-4">
                  <label className="block text-gray-300 mb-2" htmlFor="imagePath">
                    Image Path (alternative to upload)
                  </label>
                  <input
                    id="imagePath"
                    name="imagePath"
                    type="text"
                    value={formData.imagePath}
                    onChange={handleInputChange}
                    placeholder="/images/merch/your-image.jpg"
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/merchandise')}
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
              {saving ? 'Saving...' : isNew ? 'Create Item' : 'Update Item'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 