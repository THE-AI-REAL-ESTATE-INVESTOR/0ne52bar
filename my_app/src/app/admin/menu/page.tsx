"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
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
    category: '',
    description: ''
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
      // This is a placeholder - in a real implementation, you would fetch from your API
      const demoCategories: Category[] = [
        { id: 'kickstarters', name: 'KICK STARTERS' },
        { id: 'maindishes', name: 'MAIN DISHES' },
        { id: 'salads', name: 'SALADS & WRAPS' },
        { id: 'extras', name: 'EXTRAS' },
        { id: 'burgers', name: 'BURGERS & SANDWICHES' },
      ];
      
      const demoMenuItems: MenuItem[] = [
        { id: 'chips-salsa', name: 'CHIPS & SALSA', price: '6.00', category: 'kickstarters' },
        { id: 'chips-queso', name: 'CHIPS AND QUESO', price: '7.50', category: 'kickstarters' },
        { id: 'quesadillas-half', name: 'QUESADILLAS - Half', price: '6.50', category: 'maindishes', description: 'Your Choice of Steak or Chicken Stuffed with Cheese & Onions' },
        { id: 'chicken-wrap', name: 'CHICKEN WRAP', price: '8.00', category: 'salads', description: 'Grilled or breaded chicken, lettuce, tomatoes, bacon, cheese and ranch wrapped up in a flour tortilla.' },
        { id: 'bowl-chili', name: 'BOWL OF CHILI', price: '4.50', category: 'extras' },
        { id: 'one-52-burger', name: 'ONE-52 BURGER', price: '8.00', category: 'burgers', description: '½ lb 100% Beef Patty Topped with Lettuce, Tomato, Onion and Pickle' },
      ];
      
      setCategories(demoCategories);
      setMenuItems(demoMenuItems);
      setLoading(false);
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
      category: '',
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
      category: item.category,
      description: item.description || ''
    });
    setIsFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create or update the item
    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, price: formData.price || '' } 
          : item
      );
      setMenuItems(updatedItems);
    } else {
      // Create new item with a unique ID
      const newId = `item-${Date.now()}`;
      const newItem: MenuItem = {
        id: newId,
        name: formData.name || '',
        price: formData.price || '',
        category: formData.category || '',
        description: formData.description
      };
      setMenuItems([...menuItems, newItem]);
    }
    
    // Close form and reset
    setIsFormOpen(false);
    resetForm();
  };
  
  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };
  
  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
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
                      {categories.find(c => c.id === item.category)?.name || item.category}
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
                  <label htmlFor="category" className="block text-gray-300 mb-2">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
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