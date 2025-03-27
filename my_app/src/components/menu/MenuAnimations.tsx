"use client";

import React from 'react';

const MenuStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes pulse-glow {
        0% {
          box-shadow: 0 0 5px 0 rgba(245, 158, 11, 0.7);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 20px 5px rgba(245, 158, 11, 0.9);
          transform: scale(1.05);
        }
        100% {
          box-shadow: 0 0 5px 0 rgba(245, 158, 11, 0.7);
          transform: scale(1);
        }
      }
      
      .order-now-btn {
        animation: pulse-glow 2s infinite;
      }
    `}</style>
  );
};

export default MenuStyles; 