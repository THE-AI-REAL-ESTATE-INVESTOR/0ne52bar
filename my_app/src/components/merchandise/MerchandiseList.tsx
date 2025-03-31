'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Merchandise } from '@prisma/client';
import { useCart } from './cart/CartContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface MerchandiseListProps {
  items: Merchandise[];
}

export function MerchandiseList({ items }: MerchandiseListProps) {
  const { addItem } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleAddToCart = (item: Merchandise) => {
    const quantity = quantities[item.id] || 1;
    const size = selectedSizes[item.id];
    addItem(item, quantity, size);
    
    // Reset after adding to cart
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    setSelectedSizes(prev => ({ ...prev, [item.id]: '' }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex flex-col bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          {item.imagePath ? (
            <div className="h-48 bg-gray-800 relative">
              <div className="h-full w-full flex items-center justify-center">
                <Image 
                  src={item.imagePath}
                  alt={item.name}
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            </div>
          ) : (
            <div className="h-48 bg-gray-800 flex items-center justify-center">
              <span className="text-gray-600">No image</span>
            </div>
          )}
          
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-300 line-clamp-2 mb-4">{item.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-amber-500 font-bold">
                  ${parseFloat(item.price).toFixed(2)}
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.inStock ? (
                    <span className="text-green-400 text-sm">In Stock</span>
                  ) : (
                    <span className="text-red-400 text-sm">Out of Stock</span>
                  )}
                  
                  {item.comingSoon && (
                    <span className="text-blue-400 text-sm">Coming Soon</span>
                  )}
                </div>
              </div>

              {item.inStock && !item.comingSoon && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={selectedSizes[item.id] || ''}
                      onValueChange={(value) => 
                        setSelectedSizes(prev => ({ ...prev, [item.id]: value }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">Small</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="L">Large</SelectItem>
                        <SelectItem value="XL">X-Large</SelectItem>
                        <SelectItem value="2XL">2X-Large</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) => 
                        setQuantities(prev => ({ 
                          ...prev, 
                          [item.id]: Math.max(1, parseInt(e.target.value) || 1)
                        }))
                      }
                      className="w-20"
                    />
                  </div>

                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full"
                    variant="default"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 