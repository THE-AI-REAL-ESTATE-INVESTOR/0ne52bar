#!/usr/bin/env ts-node
/**
 * Fix Dependencies Script
 * 
 * This script checks all TypeScript files for common import errors
 * and ensures necessary packages are installed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(process.cwd(), 'src');
const PACKAGE_JSON = path.join(process.cwd(), 'package.json');

// Logging with colors
const log = {
  info: (msg: string) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warn: (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg: string) => console.log(`\x1b[31m${msg}\x1b[0m`),
};

// Find all TypeScript files
function findTypeScriptFiles(): string[] {
  const findCmd = `find ${SRC_DIR} -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next"`;
  try {
    return execSync(findCmd).toString().split('\n').filter(Boolean);
  } catch (error) {
    log.error(`Failed to find TypeScript files: ${error}`);
    return [];
  }
}

// Check if package is installed
function isPackageInstalled(packageName: string): boolean {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
    return (
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    log.error(`Failed to read package.json: ${error}`);
    return false;
  }
}

// Install package using pnpm
function installPackage(packageName: string, isDev = false): boolean {
  try {
    log.info(`Installing ${packageName}...`);
    const cmd = `pnpm add ${isDev ? '-D' : ''} ${packageName}`;
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Failed to install ${packageName}: ${error}`);
    return false;
  }
}

// Check for missing imports in files
function checkForMissingImports(files: string[]): Set<string> {
  const missingImports = new Set<string>();

  log.info(`Checking ${files.length} files for missing imports...`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Common imports that might need to be fixed
      if (content.includes('import') && content.includes('from')) {
        // Check for zod
        if (content.includes('from \'zod\'') || content.includes('from "zod"')) {
          missingImports.add('zod');
        }
        
        // Check for chalk
        if (content.includes('from \'chalk\'') || content.includes('from "chalk"')) {
          missingImports.add('chalk');
        }

        // Add more package checks as needed
      }
    } catch (error) {
      log.error(`Failed to read ${file}: ${error}`);
    }
  }

  return missingImports;
}

// Fix createPaginatedResponse usage
function fixCreatePaginatedResponse(files: string[]): void {
  log.info('Checking for createPaginatedResponse usage...');
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Look for incorrect usage of createPaginatedResponse
      if (content.includes('createPaginatedResponse(') && 
          content.includes('Expected 4-5 arguments, but got 3')) {
        
        log.warn(`Found incorrect createPaginatedResponse usage in ${file}`);
        
        // Update the file content with fixed function call
        const updatedContent = content.replace(
          /createPaginatedResponse\(\s*([^,]+),\s*{\s*([^}]+)\s*},\s*(['"][^'"]+['"])\s*\)/g,
          (match, data, pagination, message) => {
            return `createPaginatedResponse(${data}, ${pagination.includes('total') ? pagination.match(/total[^,]*/)[0].trim() : 'total'}, ${pagination.includes('page') ? pagination.match(/page[^,]*/)[0].trim() : 'page'}, ${pagination.includes('pageSize') ? pagination.match(/pageSize[^,]*/)[0].trim() : 'pageSize'}, ${message})`;
          }
        );
        
        if (content !== updatedContent) {
          fs.writeFileSync(file, updatedContent);
          log.success(`Fixed createPaginatedResponse in ${file}`);
        }
      }
    } catch (error) {
      log.error(`Failed to process ${file}: ${error}`);
    }
  }
}

// Fix TypeScript 'any' types by replacing them with more specific types
function fixAnyTypes(files: string[]): void {
  log.info('Checking for excessive "any" usage...');
  
  const anyReplacements = [
    {
      pattern: /as any\)/g,
      replacement: 'as unknown)'
    },
    {
      pattern: /\) as any/g,
      replacement: ') as unknown'
    },
    {
      pattern: /Record<string, any>/g,
      replacement: 'Record<string, unknown>'
    }
  ];
  
  for (const file of files) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let madeChanges = false;
      
      for (const { pattern, replacement } of anyReplacements) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          madeChanges = true;
        }
      }
      
      if (madeChanges) {
        fs.writeFileSync(file, content);
        log.success(`Fixed "any" types in ${file}`);
      }
    } catch (error) {
      log.error(`Failed to process ${file}: ${error}`);
    }
  }
}

// Main function
async function main() {
  log.info('Starting dependency fixing script...');
  
  // Find all TypeScript files
  const files = findTypeScriptFiles();
  if (files.length === 0) {
    log.error('No TypeScript files found!');
    process.exit(1);
  }
  
  // Check for missing imports
  const missingImports = checkForMissingImports(files);
  
  // Install missing packages
  if (missingImports.size > 0) {
    log.warn(`Found ${missingImports.size} missing packages: ${Array.from(missingImports).join(', ')}`);
    
    for (const pkg of missingImports) {
      if (!isPackageInstalled(pkg)) {
        installPackage(pkg);
      } else {
        log.success(`${pkg} is already installed`);
      }
    }
  } else {
    log.success('No missing packages found!');
  }
  
  // Fix common linter errors
  fixCreatePaginatedResponse(files);
  fixAnyTypes(files);
  
  log.success('Dependency fixing complete!');
}

// Run the script
main().catch(err => {
  log.error(`Error: ${err.message}`);
  process.exit(1);
}); 