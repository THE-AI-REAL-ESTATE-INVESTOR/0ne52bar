'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateMenuItemStatus } from '@/actions/menu/admin';
import type { MenuItemStatus } from '@/types/menu';

interface BulkStatusActionsProps {
  selectedItems: string[];
  onStatusUpdate: () => void;
}

export function BulkStatusActions({ selectedItems, onStatusUpdate }: BulkStatusActionsProps) {
  const [status, setStatus] = useState<MenuItemStatus>('AVAILABLE');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0) return;

    setIsUpdating(true);
    setError(null);

    try {
      const promises = selectedItems.map(itemId =>
        updateMenuItemStatus(itemId, status)
      );

      await Promise.all(promises);
      onStatusUpdate();
    } catch (err) {
      setError('Failed to update items. Please try again.');
      console.error('Error updating items:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="text-sm text-gray-600">
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={(value: MenuItemStatus) => setStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="NEEDS_PRICING">Needs Pricing</SelectItem>
            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={handleBulkUpdate}
          disabled={isUpdating}
          variant="default"
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 