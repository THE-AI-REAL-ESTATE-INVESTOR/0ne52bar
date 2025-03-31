'use client';

import { motion } from 'framer-motion';

function RackIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block ml-3 mb-1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pool rack shape */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        d="M12 4L4 20H20L12 4Z"
        stroke="url(#rackGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#rackFillGradient)"
      />
      {/* Ball placement dots */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        d="M12 8L8 16M12 8L16 16M8 16H16"
        stroke="url(#rackGradient)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="rackGradient" x1="4" y1="4" x2="20" y2="20">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="rackFillGradient" x1="4" y1="4" x2="20" y2="20">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PoolSticks() {
  return (
    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-[500px] h-[100px]">
      {/* First pool stick */}
      <div className="absolute left-0 top-1/2 w-full h-6 transform -rotate-12">
        {/* Stick body */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] rounded-full shadow-lg" />
        {/* Cue tip */}
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 flex items-center">
          <div className="w-4 h-4 bg-[#DEB887] rounded-full shadow-md" />
          <div className="w-3 h-3 bg-[#F5DEB3] rounded-full shadow-md -ml-1" />
          <div className="w-2 h-2 bg-blue-200 rounded-full shadow-md -ml-1" />
        </div>
      </div>
      
      {/* Second pool stick */}
      <div className="absolute left-0 top-1/2 w-full h-6 transform rotate-12">
        {/* Stick body */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] rounded-full shadow-lg" />
        {/* Cue tip */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 flex items-center flex-row-reverse">
          <div className="w-4 h-4 bg-[#DEB887] rounded-full shadow-md" />
          <div className="w-3 h-3 bg-[#F5DEB3] rounded-full shadow-md -mr-1" />
          <div className="w-2 h-2 bg-blue-200 rounded-full shadow-md -mr-1" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black overflow-hidden">
      {/* Background pool table */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[900px] mx-auto">
          {/* Pool table frame */}
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden border-[16px] border-black bg-[#0B4619]">
            {/* Top pockets */}
            <div className="absolute top-[-14px] left-[calc(50%-20px)] w-10 h-10 rounded-full bg-black" />
            <div className="absolute top-[-14px] left-[-14px] w-10 h-10 rounded-full bg-black" />
            <div className="absolute top-[-14px] right-[-14px] w-10 h-10 rounded-full bg-black" />
            
            {/* Bottom pockets */}
            <div className="absolute bottom-[-14px] left-[calc(50%-20px)] w-10 h-10 rounded-full bg-black" />
            <div className="absolute bottom-[-14px] left-[-14px] w-10 h-10 rounded-full bg-black" />
            <div className="absolute bottom-[-14px] right-[-14px] w-10 h-10 rounded-full bg-black" />
            
            {/* Rails */}
            <div className="absolute inset-[-2px] border-[4px] border-[#2d1810] rounded-sm" />
            
            {/* Pool sticks */}
            <PoolSticks />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 text-transparent bg-clip-text">
            ONE-52 BAR
          </span>
          <div className="text-2xl md:text-3xl font-medium text-blue-300 mt-2">
            & GRILL
          </div>
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold text-blue-300"
        >
          211 N Trade Center Terrace
        </motion.h2>
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-3xl font-semibold text-blue-300"
        >
          MUSTANG, OKLAHOMA
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-3xl font-bold mt-8 flex items-center justify-center"
        >
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            BREAKING BALLS SINCE 2016
          </span>
          <RackIcon />
        </motion.div>
      </div>
    </section>
  );
} 