"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MenuItem, Category, MenuItemFormData, MenuItemStatus } from '@/types/menu';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/actions/menu/admin';

interface MenuAdminProps {
  initialMenuItems: MenuItem[];
  initialCategories: Category[];
}

export function MenuAdmin({ initialMenuItems, initialCategories }: MenuAdminProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MenuItemStatus>("AVAILABLE");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Filter menu items based on selected category
  const filteredItems = filterCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === filterCategory);

  // Menu Item Form Handlers
  const handleMenuItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const price = formData.get('price') as string;
    
    // Force NEEDS_PRICING status if price is 0.00 or empty
    const priceNum = parseFloat(price);
    const status = (priceNum === 0 || isNaN(priceNum)) ? "NEEDS_PRICING" : selectedStatus;

    const menuItemData: MenuItemFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: priceNum.toFixed(2),
      categoryId: selectedCategory,
      isActive: true,
      status: status
    };

    if (editingItem) {
      const result = await updateMenuItem(editingItem.id, menuItemData);
      if (result.success) {
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? { ...item, ...result.data } : item
        ));
        setIsDialogOpen(false);
      }
    } else {
      const result = await createMenuItem(menuItemData);
      if (result.success) {
        setMenuItems([...menuItems, result.data]);
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    const result = await deleteMenuItem(itemId);
    if (result.success) {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    }
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (selectedItems.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === menuItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(menuItems.map(item => item.id)));
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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as MenuItemStatus);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Menu Management</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Add New Item</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0B0D] border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleMenuItemSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingItem?.name}
                      className="bg-gray-800/50 border-gray-700"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingItem?.description}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={editingItem?.price || "0.00"}
                      className="bg-gray-800/50 border-gray-700"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={selectedStatus} 
                      onValueChange={handleStatusChange}
                      disabled={editingItem?.price === "0.00"}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="NEEDS_PRICING">Needs Pricing</SelectItem>
                        <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      {editingItem ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-[#0A0B0D] border-gray-800 text-white w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" disabled={selectedItems.size === 0}>
              Make Available
            </Button>
            <Button variant="secondary" disabled={selectedItems.size === 0}>
              Mark Coming Soon
            </Button>
            <Button variant="destructive" disabled={selectedItems.size === 0}>
              Delete Selected
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-[#0A0B0D]">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedItems.size === menuItems.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-gray-400">NAME</TableHead>
                <TableHead className="text-gray-400">CATEGORY</TableHead>
                <TableHead className="text-gray-400">PRICE</TableHead>
                <TableHead className="text-gray-400">STATUS</TableHead>
                <TableHead className="text-gray-400">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setSelectedCategory(item.categoryId);
                          setSelectedStatus(item.status);
                          setIsDialogOpen(true);
                        }}
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
      </div>
    </div>
  );
} 