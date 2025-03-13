"use client";

import React from 'react';

interface OrderButtonProps {
  className?: string;
}

const OrderButton: React.FC<OrderButtonProps> = ({ className }) => {
  const handleClick = () => {
    const orderSystem = document.getElementById('menu-order-system');
    if (orderSystem) {
      orderSystem.classList.remove('hidden');
      
      // Set a custom attribute or class to indicate it should be visible
      orderSystem.setAttribute('data-visible', 'true');
      
      // Dispatch a custom event that the MenuOrderSystem can listen for
      const event = new CustomEvent('open-menu-order');
      document.dispatchEvent(event);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`order-now-btn bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-full text-xl shadow-lg transform transition-all ${className || ''}`}
    >
      ORDER NOW
    </button>
  );
};

export default OrderButton; 