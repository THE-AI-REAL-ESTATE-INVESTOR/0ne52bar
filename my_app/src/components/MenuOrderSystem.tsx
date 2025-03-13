"use client";

import React, { useState, useEffect, useRef } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description?: string;
}

const MenuOrderSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize menu items - in a real app, this would come from an API or database
  useEffect(() => {
    const items: MenuItem[] = [
      // Kick Starters
      { id: 'chips-salsa', name: 'CHIPS & SALSA', price: '$6.00', category: 'KICK STARTERS' },
      { id: 'chips-queso', name: 'CHIPS AND QUESO', price: '$7.50', category: 'KICK STARTERS' },
      { id: 'chips-salsa-queso', name: 'CHIPS SALSA & QUESO', price: '$8.50', category: 'KICK STARTERS' },
      { id: 'fried-mushrooms', name: 'FRIED MUSHROOMS', price: '$6.00', category: 'KICK STARTERS' },
      { id: 'fried-green-beans', name: 'FRIED GREEN BEANS', price: '$6.00', category: 'KICK STARTERS' },
      { id: 'cheese-sticks', name: 'CHEESE STICKS', price: '$7.50', category: 'KICK STARTERS' },
      { id: 'fried-pickles', name: 'FRIED PICKLES', price: '$6.00', category: 'KICK STARTERS' },
      { id: 'fried-okra', name: 'FRIED OKRA', price: '$6.00', category: 'KICK STARTERS' },
      { id: 'hot-wings', name: 'HOT WINGS', price: '$8.50', category: 'KICK STARTERS', description: 'Buffalo, Teriyaki, Honey BBQ, Garlic Parmesan' },
      { id: 'basket-fries-tots', name: 'BASKET OF FRIES/TOTS', price: '$4.00', category: 'KICK STARTERS', description: 'Add all your favorite toppings for an additional charge' },
      { id: 'onion-ring', name: 'ONION RING', price: '$4.00', category: 'KICK STARTERS' },
      { id: 'madatots', name: 'Madatots', price: '$8.50', category: 'KICK STARTERS', description: 'Chili, Queso Cheese, Sour Cream, Tomatoes and Salsa' },
      { id: 'sampler', name: 'ONE - 52 SAMPLER - Pick 3', price: '$15.00', category: 'KICK STARTERS', description: 'Cheese Sticks, Mushrooms, Pickles, Okra, Green beans' },
      
      // Main Dishes
      { id: 'quesadillas-half', name: 'QUESADILLAS - Half', price: '$6.50', category: 'MAIN DISHES', description: 'Your Choice of Steak or Chicken Stuffed with Cheese & Onions' },
      { id: 'quesadillas-full', name: 'QUESADILLAS - Full', price: '$10.00', category: 'MAIN DISHES', description: 'Your Choice of Steak or Chicken Stuffed with Cheese & Onions' },
      { id: 'tacos-classic', name: 'CLASSIC TACO', price: '$3.50', category: 'MAIN DISHES', description: 'Lightly Fried Corn tortilla with Lettuce, Tomato, Cheese and Onions' },
      { id: 'tacos-soft', name: 'SOFT TACO', price: '$3.50', category: 'MAIN DISHES', description: 'Flour Tortilla filled with Ground Beef, Lettuce, Tomato, Cheese' },
      { id: 'tacos-street', name: 'STREET TACO', price: '$4.00', category: 'MAIN DISHES', description: 'Warm Corn Tortilla, filled with Steak or Chicken, Onion & Cilantro' },
      { id: 'nachos', name: 'NACHOS', price: '$8.00', category: 'MAIN DISHES', description: 'Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream, & Salsa' },
      { id: 'nachos-grande', name: 'Nachos Grande', price: '$13.50', category: 'MAIN DISHES', description: 'Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream, & Salsa' },
      { id: 'fajitas', name: 'FAJITAS', price: '$4.00', category: 'MAIN DISHES', description: 'Beef or Chicken, Green Peppers & Onions & cheese' },
      
      // Salads & Wraps
      { id: 'chicken-wrap', name: 'CHICKEN WRAP', price: '$8.00', category: 'SALADS & WRAPS', description: 'Grilled or breaded chicken, lettuce, tomatoes, bacon, cheese and ranch wrapped up in a flour tortilla.' },
      { id: 'pile-up-salad', name: 'PILE UP SALAD', price: '$8.50', category: 'SALADS & WRAPS', description: 'Lettuce, tomatoes, cucumbers, cheese, bacon and your choice of fried or grilled chicken' },
      { id: 'house-salad', name: 'HOUSE SALAD', price: '$4.50', category: 'SALADS & WRAPS' },
      
      // Extras
      { id: 'bowl-chili', name: 'BOWL OF CHILI', price: '$4.50', category: 'EXTRAS' },
      { id: 'frito-chili-pie', name: 'FRITO CHILI PIE', price: '$6.50', category: 'EXTRAS' },
      
      // Burgers & Sandwiches
      { id: 'one-52-burger', name: 'ONE-52 BURGER', price: '$8.00', category: 'BURGERS & SANDWICHES', description: '½ lb 100% Beef Patty Topped with Lettuce, Tomato, Onion and Pickle, choice of Fries, Tots or Onion Rings.' },
      { id: 'philly-steak', name: 'PHILLY STEAK', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Philly Steak Grilled Onions, Bell Peppers and Cheese' },
      { id: 'club-special', name: 'CLUB SPECIAL', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Sliced Ham, Turkey & Bacon topped with Swiss & Cheddar Cheese, Lettuce & Tomato Served on Sough dough' },
      { id: 'patty-melt', name: 'PATTY MELT', price: '$8.00', category: 'BURGERS & SANDWICHES', description: 'Topped with Cheese and Grilled Onions. Served on Sough Dough.' },
      { id: 'blt', name: 'BLT', price: '$7.50', category: 'BURGERS & SANDWICHES' },
      { id: 'grilled-cheese', name: 'GRILLED CHEESE', price: '$7.00', category: 'BURGERS & SANDWICHES', description: 'Texas toast with melted cheese' },
      { id: 'yard-bird-sandwich', name: 'YARD BIRD SANDWICH', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Grilled chicken with Lettuce, Tomato and Honey Mustard' },
      { id: 'chicken-strip-sandwich', name: 'CHICKEN STRIP SANDWICH', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Chicken Strips with swiss cheese on Texas Toast' },
      { id: 'chicken-strip-basket', name: 'CHICKEN STRIP BASKET', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Pick a Side (Tots, Fries, Onion Rings)' },
      { id: 'hot-dog', name: 'HOT DOG', price: '$3.25', category: 'BURGERS & SANDWICHES' },
    ];
    
    setMenuItems(items);
    setFilteredItems(items);
  }, []);

  // Listen for the custom event from OrderButton
  useEffect(() => {
    const handleOpenMenu = () => {
      setIsVisible(true);
    };
    
    // Listen for the custom event
    document.addEventListener('open-menu-order', handleOpenMenu);
    
    // Also check for the data attribute that may have been set
    const checkVisibilityAttribute = () => {
      const orderSystem = document.getElementById('menu-order-system');
      if (orderSystem && orderSystem.getAttribute('data-visible') === 'true') {
        setIsVisible(true);
        // Reset the attribute to prevent repeated showing
        orderSystem.removeAttribute('data-visible');
      }
    };
    
    // Check when component mounts and periodically
    checkVisibilityAttribute();
    const intervalId = setInterval(checkVisibilityAttribute, 500);
    
    return () => {
      document.removeEventListener('open-menu-order', handleOpenMenu);
      clearInterval(intervalId);
    };
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, menuItems]);

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem => 
          cartItem.item.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 } 
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.item.id !== itemId);
      }
    });
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => {
      const price = parseFloat(cartItem.item.price.replace('$', ''));
      return total + (price * cartItem.quantity);
    }, 0).toFixed(2);
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Submit order (this would connect to your backend in a real app)
  const submitOrder = () => {
    // Here you would handle the order submission to your backend
    alert(`Order submitted! Total: $${calculateTotal()}`);
    setCart([]);
    setIsVisible(false);
  };

  return (
    <div id="menu-order-system" className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${isVisible ? 'block' : 'hidden'}`}>
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-500">Order Menu</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Menu Items</h3>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                        {item.description && (
                          <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-amber-500">{item.price}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="mt-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black rounded-full text-sm"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No items match your search.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Your Order</h3>
            {cart.length > 0 ? (
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{cartItem.item.name}</h4>
                      <p className="text-amber-500 font-mono">{cartItem.item.price} × {cartItem.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFromCart(cartItem.item.id)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-full text-sm"
                      >
                        −
                      </button>
                      <span className="text-white">{cartItem.quantity}</span>
                      <button 
                        onClick={() => addToCart(cartItem.item)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black rounded-full text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-white">Total:</span>
                    <span className="text-lg font-bold text-amber-500">${calculateTotal()}</span>
                  </div>
                  
                  <button 
                    onClick={submitOrder}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
                  >
                    Submit Order
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Your order is empty. Add items from the menu to get started.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOrderSystem; 