"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MenuItemForm } from "./MenuItemForm";
import { MenuItemTable } from "./MenuItemTable";
import type { MenuItem, Category, MenuItemFormData } from '@/types/menu';
import { createMenuItem } from '@/actions/menu/admin';

interface MenuAdminProps {
  initialMenuItems: MenuItem[];
  initialCategories: Category[];
}

export function MenuAdmin({ initialMenuItems, initialCategories }: MenuAdminProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemsUpdate = (updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems);
  };

  const handleCreateItem = async (data: MenuItemFormData) => {
    const result = await createMenuItem(data);
    if (result.success) {
      setMenuItems([...menuItems, result.data]);
      setIsDialogOpen(false);
    }
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
                  <DialogTitle className="text-white">Add New Item</DialogTitle>
                </DialogHeader>
                <MenuItemForm
                  categories={categories}
                  onSubmit={handleCreateItem}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <MenuItemTable
          items={menuItems}
          categories={categories}
          onItemsUpdate={handleItemsUpdate}
        />
      </div>
    </div>
  );
} 