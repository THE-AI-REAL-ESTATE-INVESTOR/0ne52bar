#!/bin/bash

# Script to set up Jest testing for the project

echo "🧪 Setting up Jest testing environment..."

# Install Jest and related dependencies
echo "📦 Installing Jest dependencies..."
pnpm add -D jest @jest/globals jest-environment-jsdom @types/jest ts-jest
pnpm add -D @testing-library/react @testing-library/jest-dom

# Update package.json with test scripts
echo "📝 Adding test scripts to package.json..."
node scripts/update-package-json.js

# Make the Prisma mock directory if it doesn't exist
mkdir -p src/lib/__mocks__

# Create a .env.test file if it doesn't exist
if [ ! -f .env.test ]; then
  echo "📄 Creating .env.test file..."
  echo "# Test environment variables" > .env.test
  echo "NODE_ENV=test" >> .env.test
  echo "DATABASE_URL=\"file:./test.db\"" >> .env.test
fi

# Add Jest ignore to .gitignore if not already there
if ! grep -q ".coverage" .gitignore; then
  echo "📄 Updating .gitignore with Jest entries..."
  echo "" >> .gitignore
  echo "# Jest" >> .gitignore
  echo ".coverage" >> .gitignore
fi

# Make the script executable
chmod +x scripts/update-package-json.js

echo "✅ Jest testing environment setup complete!"
echo "🏃‍♂️ Run tests with 'pnpm test'" 