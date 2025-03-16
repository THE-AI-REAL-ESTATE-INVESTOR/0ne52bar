#!/bin/bash

# Script to install all required dependencies for the project

echo "📦 Installing all required dependencies..."

# Production dependencies
echo "📦 Installing production dependencies..."
pnpm add zod uuid next-connect

# Development dependencies
echo "📦 Installing development dependencies..."
pnpm add -D @types/uuid jest @jest/globals jest-environment-jsdom @types/jest ts-jest
pnpm add -D @testing-library/react @testing-library/jest-dom

# Run the setup-jest script
echo "🧪 Setting up Jest testing environment..."
./scripts/setup-jest.sh

# Run the dependency fixer
echo "🔧 Running dependency fixer..."
pnpm exec ts-node scripts/fix-dependencies.ts

echo "✅ All dependencies installed successfully!"
echo "🚀 You can now run 'pnpm test' to run the tests" 