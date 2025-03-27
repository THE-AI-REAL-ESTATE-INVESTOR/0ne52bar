'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { updateMenuItem, deleteMenuItem, getMenuItems } from '@/actions/menu/admin';
import type { MenuItem, Category, MenuItemFormData, MenuItemStatus } from '@/types/menu';
import { MenuItemForm } from './MenuItemForm';

type SortField = 'name' | 'category' | 'price' | 'status';
type SortDirection = 'asc' | 'desc';

interface MenuItemTableProps {
  items: MenuItem[];
  categories: Category[];
  onItemsUpdate: (items: MenuItem[]) => void;
}

export function MenuItemTable({ items, categories, onItemsUpdate }: MenuItemTableProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState<MenuItemStatus>('AVAILABLE');
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Sorting function
  const sortItems = (a: MenuItem, b: MenuItem) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'category':
        const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
        const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
        return direction * categoryA.localeCompare(categoryB);
      case 'price':
        return direction * (parseFloat(a.price) - parseFloat(b.price));
      case 'status':
        return direction * (a.status || 'AVAILABLE').localeCompare(b.status || 'AVAILABLE');
      default:
        return 0;
    }
  };

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter(item => filterCategory === 'all' || item.categoryId === filterCategory)
    .sort(sortItems);

  // Sort indicator component
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await deleteMenuItem(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete item');
      }

      // Refresh items after deletion
      const updatedItems = await getMenuItems();
      if (updatedItems.success) {
        onItemsUpdate(updatedItems.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: MenuItemFormData) => {
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await updateMenuItem(editingItem.id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update item');
      }
      
      // Refresh items after update
      const updatedItems = await getMenuItems();
      if (updatedItems.success) {
        onItemsUpdate(updatedItems.data);
      }
      
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedItems.size === 0) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setShowLoadingDialog(true);

      const promises = Array.from(selectedItems).map(async (itemId) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        
        return updateMenuItem(itemId, {
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: item.categoryId,
          isActive: item.isActive,
          status: selectedStatus
        });
      });

      await Promise.all(promises.filter(Boolean));
      
      // Refresh items after bulk update
      const updatedItems = await getMenuItems();
      if (updatedItems.success) {
        onItemsUpdate(updatedItems.data);
      }
      
      setSelectedItems(new Set());
    } catch (err) {
      setError('Failed to update items. Please try again.');
      console.error('Error updating items:', err);
    } finally {
      setIsSubmitting(false);
      setShowLoadingDialog(false);
    }
  };

  const getStatusColor = (status: MenuItemStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500/10 text-green-500';
      case 'NEEDS_PRICING':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'COMING_SOON':
        return 'bg-blue-500/10 text-blue-500';
      case 'ARCHIVED':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Dialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
        <DialogContent className="bg-[#0A0B0D] border-gray-800">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-white">Updating Status</p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we update {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {editingItem ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Edit Menu Item</h3>
          <MenuItemForm
            initialData={editingItem}
            categories={categories}
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] bg-[#0A0B0D] border-gray-800 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0B0D] border-gray-800">
                <SelectItem value="all" className="text-white hover:bg-gray-800">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id}
                    className="text-white hover:bg-gray-800"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItems.size > 0 && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedStatus} onValueChange={(value: MenuItemStatus) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-[180px] bg-[#0A0B0D] border-gray-800 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0B0D] border-gray-800">
                    <SelectItem value="AVAILABLE" className="text-white hover:bg-gray-800">Available</SelectItem>
                    <SelectItem value="NEEDS_PRICING" className="text-white hover:bg-gray-800">Needs Pricing</SelectItem>
                    <SelectItem value="COMING_SOON" className="text-white hover:bg-gray-800">Coming Soon</SelectItem>
                    <SelectItem value="ARCHIVED" className="text-white hover:bg-gray-800">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleBulkStatusUpdate}
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-[#0A0B0D]">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.size === items.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    NAME <SortIndicator field="name" />
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    CATEGORY <SortIndicator field="category" />
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    PRICE <SortIndicator field="price" />
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    STATUS <SortIndicator field="status" />
                  </TableHead>
                  <TableHead className="text-gray-400">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedItems.map((item) => (
                  <TableRow key={item.id} className="border-gray-800 hover:bg-[#0A0B0D]">
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell className="text-white">{item.name}</TableCell>
                    <TableCell className="text-white">
                      {categories.find(c => c.id === item.categoryId)?.name}
                    </TableCell>
                    <TableCell className="text-white">
                      ${parseFloat(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status || 'AVAILABLE')}`}>
                        {(item.status || 'AVAILABLE').replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
} 