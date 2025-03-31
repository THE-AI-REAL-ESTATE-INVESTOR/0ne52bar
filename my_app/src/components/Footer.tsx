'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">© 2016 - {new Date().getFullYear()} ONE-52 BAR & GRILL. All rights reserved.</p>
        <p className="text-sm">
          Made with{' '}
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              color: ['#FF0000', '#FF3333', '#FF0000'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            ❤️
          </motion.span>{' '}
          by{' '}
          <Link 
            href="https://aireinvestor.com/" 
            target="_blank"
            className="inline-block bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent hover:from-blue-400 hover:to-gray-300 transition-all duration-300"
          >
            aireinvestor.com
          </Link>
        </p>
      </div>
    </footer>
  );
} 