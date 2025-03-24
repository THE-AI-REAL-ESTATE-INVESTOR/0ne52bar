'use client';

import React from 'react';

interface LicensePlateTextProps {
  text: string;
  className?: string;
}

const LicensePlateText: React.FC<LicensePlateTextProps> = ({ text, className = '' }) => {
  return (
    <div
      className={`font-mono font-bold tracking-wider uppercase bg-gray-100 border-2 border-gray-300 rounded px-4 py-2 inline-block ${className}`}
    >
      {text}
    </div>
  );
};

export default LicensePlateText; 