"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MenuManagement() {
  const { status } = useSession();
  const router = useRouter();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // New/Edit item form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: '',
    categoryId: '',
    description: '',
    sortOrder: 100,
    isActive: true
  });
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Load menu data
  useEffect(() => {
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/menu-items').then(res => res.json())
      ])
      .then(([categoriesData, menuItemsData]) => {
        setCategories(categoriesData);
        setMenuItems(menuItemsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
    }
  }, [status]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      categoryId: '',
      description: ''
    });
    setEditingItem(null);
  };
  
  // Open form for new item
  const handleAddNewItem = () => {
    resetForm();
    setIsFormOpen(true);
  };
  
  // Open form for editing
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description || ''
    });
    setIsFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert('Please fill out all required fields');
      return;
    }
    
    try {
      const response = await fetch(
        editingItem ? `/api/menu-items/${editingItem.id}` : '/api/menu-items',
        {
          method: editingItem ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            price: formData.price,
            categoryId: formData.categoryId
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to save menu item');

      const updatedItem = await response.json();
      
      // Update state
      if (editingItem) {
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
      } else {
        setMenuItems([...menuItems, updatedItem]);
      }

      // Close form and reset
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item. Please try again.');
    }
  };

  // Handle item deletion with API call
  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`/api/menu-items/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete menu item');

        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
      }
    }
  };
  
  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-lg text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-lg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-amber-500">Menu Management</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Control bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="category-filter" className="text-gray-300 mr-2">Filter by Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAddNewItem}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Add New Item
          </button>
        </div>
        
        {/* Menu items table */}
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-white">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-white">
                      {categories.find(c => c.id === item.categoryId)?.name || item.categoryId}
                    </td>
                    <td className="px-6 py-4 text-lg text-white">
                      {item.description || <span className="text-gray-500">No description</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-amber-500 hover:text-amber-400 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-lg text-gray-400">
                    No menu items found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Add/Edit form modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-amber-500">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="price" className="block text-gray-300 mb-2">Price * ($)</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    required
                    pattern="^\d+(\.\d{1,2})?$"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="categoryId" className="block text-gray-300 mb-2">Category *</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 h-24 text-lg"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md text-lg"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-base text-gray-400">
          <p>* In this demo, changes are not persisted to a database. Refreshing the page will reset all changes.</p>
        </div>
      </div>
    </div>
  );
} 