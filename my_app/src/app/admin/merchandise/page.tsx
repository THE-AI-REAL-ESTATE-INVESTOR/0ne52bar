"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getMerchandise, deleteMerchandise, updateMerchandiseStatus } from '@/actions/merchandiseActions';
import Link from 'next/link';
import { Merchandise, MerchandiseCategory } from '@prisma/client';

type MerchandiseWithCategory = Merchandise & {
  category: MerchandiseCategory;
};

export default function MerchandiseAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [categories, setCategories] = useState<MerchandiseCategory[]>([]);
  const [items, setItems] = useState<MerchandiseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load categories
      const categoryResponse = await getCategories();
      if (categoryResponse.success) {
        setCategories(categoryResponse.categories);
      } else {
        setError(`Error loading categories: ${categoryResponse.error}`);
      }

      // Load merchandise items
      const itemResponse = await getMerchandise();
      if (itemResponse.success) {
        setItems(itemResponse.items);
      } else {
        setError(`Error loading merchandise: ${itemResponse.error}`);
      }
    } catch (e) {
      setError('Error loading data. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    try {
      const itemResponse = await getMerchandise(categoryId === 'all' ? undefined : categoryId);
      if (itemResponse.success) {
        setItems(itemResponse.items);
      } else {
        setError(`Error loading merchandise: ${itemResponse.error}`);
      }
    } catch (e) {
      setError('Error loading data. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        const response = await deleteMerchandise(id);
        if (response.success) {
          setActionMessage('Item deleted successfully');
          // Remove item from state
          setItems(items.filter(item => item.id !== id));
        } else {
          setError(`Error deleting item: ${response.error}`);
        }
      } catch (e) {
        setError('Error deleting item. Please try again.');
        console.error(e);
      }
    }
  };

  const handleBulkAction = async (action: 'makeAvailable' | 'markComingSoon' | 'delete') => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item');
      return;
    }

    switch (action) {
      case 'makeAvailable':
        if (window.confirm(`Make ${selectedItems.length} item(s) available for purchase?`)) {
          const response = await updateMerchandiseStatus(selectedItems, true, false);
          if (response.success) {
            setActionMessage(`${response.count} item(s) updated successfully`);
            loadData();
          } else {
            setError(`Error updating items: ${response.error}`);
          }
        }
        break;
        
      case 'markComingSoon':
        if (window.confirm(`Mark ${selectedItems.length} item(s) as "Coming Soon"?`)) {
          const response = await updateMerchandiseStatus(selectedItems, false, true);
          if (response.success) {
            setActionMessage(`${response.count} item(s) updated successfully`);
            loadData();
          } else {
            setError(`Error updating items: ${response.error}`);
          }
        }
        break;
        
      case 'delete':
        if (window.confirm(`Delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
          try {
            let successCount = 0;
            for (const id of selectedItems) {
              const response = await deleteMerchandise(id);
              if (response.success) {
                successCount++;
              }
            }
            
            if (successCount > 0) {
              setActionMessage(`${successCount} item(s) deleted successfully`);
              loadData();
            } else {
              setError('Failed to delete items');
            }
          } catch (e) {
            setError('Error deleting items. Please try again.');
            console.error(e);
          }
        }
        break;
    }
    
    setSelectedItems([]);
  };

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Merchandise Management</h1>
      
      {actionMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold">&times;</button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'items' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('items')}
          >
            Merchandise Items
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>
      </div>
      
      {activeTab === 'items' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Link 
                href="/admin/merchandise/item/new" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add New Item
              </Link>
              
              <select 
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkAction('makeAvailable')}
                disabled={selectedItems.length === 0}
                className={`px-3 py-1 rounded-md ${selectedItems.length > 0 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                Make Available
              </button>
              <button 
                onClick={() => handleBulkAction('markComingSoon')}
                disabled={selectedItems.length === 0}
                className={`px-3 py-1 rounded-md ${selectedItems.length > 0 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                Mark Coming Soon
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                disabled={selectedItems.length === 0}
                className={`px-3 py-1 rounded-md ${selectedItems.length > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                Delete Selected
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-300">Loading merchandise...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === items.length && items.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded bg-gray-800 border-gray-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded bg-gray-800 border-gray-600"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-white">{item.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-300">{item.category.name}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.comingSoon ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-800 text-yellow-200">
                            Coming Soon
                          </span>
                        ) : item.inStock ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-800 text-green-200">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-800 text-red-200">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/merchandise/item/${item.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-300 mb-4">No merchandise items found.</p>
              <Link 
                href="/admin/merchandise/item/new" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Your First Item
              </Link>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'categories' && (
        <>
          <div className="mb-4">
            <Link 
              href="/admin/merchandise/category/new" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add New Category
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-300">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-white">{category.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-300">{category.description || '—'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/merchandise/category/${category.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => router.push(`/admin/merchandise?filter=${category.id}`)}
                            className="text-green-400 hover:text-green-300"
                          >
                            View Items
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-300 mb-4">No categories found.</p>
              <Link 
                href="/admin/merchandise/category/new" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Your First Category
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
} 