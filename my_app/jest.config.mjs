import nextJest from 'next/jest.js';

// Create a Next.js configured Jest setup
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // The directory where Jest should output its coverage files
  coverageDirectory: '.coverage',
  
  // Collect coverage from these directories
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  // Test environment setup
  testEnvironment: 'jest-environment-jsdom',
  
  // Files to consider as tests
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  ],
  
  // Modules to transform with Jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Directories to consider for module imports
  moduleDirectories: [
    'node_modules',
    '<rootDir>',
  ],
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Optionally configure Babel to transpile ES modules
  transformIgnorePatterns: [
    '/node_modules/(?![@autofilled/autofilled]).+\\.js$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Do not watch for file changes by default
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/.coverage/',
  ],
};

// Export the combined configuration
export default createJestConfig(customJestConfig); 