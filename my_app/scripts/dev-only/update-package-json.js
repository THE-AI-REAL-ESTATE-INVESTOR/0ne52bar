#!/usr/bin/env node

/**
 * This script updates package.json to add Jest test commands
 */

const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read the current package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add test scripts
  packageJson.scripts = packageJson.scripts || {};
  
  // Add Jest test commands
  packageJson.scripts.test = 'jest';
  packageJson.scripts['test:watch'] = 'jest --watch';
  packageJson.scripts['test:coverage'] = 'jest --coverage';
  
  // Write back the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log('✅ Successfully updated package.json with Jest test commands');
} catch (error) {
  console.error('❌ Error updating package.json:', error.message);
  process.exit(1);
} 