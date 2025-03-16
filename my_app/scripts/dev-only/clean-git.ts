#!/usr/bin/env ts-node

/**
 * Script to clean the git repository and remove node_modules
 * This script will:
 * 1. Update .gitignore
 * 2. Remove node_modules from git tracking
 * 3. Commit the changes
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

// Convert exec to promise-based
const execPromise = util.promisify(exec);

// Get the root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Checks if a pattern exists in the .gitignore file
 */
async function patternExistsInGitignore(pattern: string): Promise<boolean> {
  try {
    const gitignorePath = path.join(ROOT_DIR, '.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
      return false;
    }
    
    const content = fs.readFileSync(gitignorePath, 'utf8');
    const lines = content.split('\n');
    
    return lines.some(line => 
      line.trim() === pattern || 
      line.trim() === `/${pattern}` || 
      line.trim() === `${pattern}/`
    );
  } catch (err) {
    console.error(`Error checking .gitignore: ${err}`);
    return false;
  }
}

/**
 * Adds a pattern to .gitignore if it doesn't exist
 */
async function addToGitignore(pattern: string): Promise<void> {
  const gitignorePath = path.join(ROOT_DIR, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `${pattern}\n`);
    console.log(`Created .gitignore with ${pattern}`);
    return;
  }
  
  const exists = await patternExistsInGitignore(pattern);
  
  if (!exists) {
    fs.appendFileSync(gitignorePath, `\n${pattern}`);
    console.log(`Added ${pattern} to .gitignore`);
  } else {
    console.log(`${pattern} already in .gitignore`);
  }
}

/**
 * Checks if a pattern is tracked by git
 */
async function isTrackedByGit(pattern: string): Promise<boolean> {
  try {
    const { stdout } = await execPromise(`git ls-files | grep "${pattern}"`, { cwd: ROOT_DIR });
    return stdout.trim().length > 0;
  } catch (err) {
    // grep returns exit code 1 if no matches found, which causes exec to throw
    return false;
  }
}

/**
 * Remove a pattern from git tracking without deleting files
 */
async function removeFromGitTracking(pattern: string): Promise<void> {
  try {
    await execPromise(`git rm -r --cached "${pattern}"`, { cwd: ROOT_DIR });
    console.log(`✅ ${pattern} removed from git tracking`);
  } catch (err) {
    console.error(`Error removing ${pattern} from git tracking: ${err}`);
    throw err;
  }
}

/**
 * Commit changes to .gitignore and untracking files
 */
async function commitChanges(): Promise<void> {
  try {
    await execPromise(`git add .gitignore`, { cwd: ROOT_DIR });
    await execPromise(`git commit -m "chore: Remove files from git tracking and update .gitignore"`, { cwd: ROOT_DIR });
    console.log(`✅ Changes committed successfully`);
  } catch (err) {
    console.error(`Error committing changes: ${err}`);
    throw err;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🧹 Cleaning git repository...");
  
  const filesToIgnore = [
    'node_modules',
    '.env',
    '.DS_Store',
    '*.log',
    'dist',
    'build',
    '.next',
    'coverage'
  ];
  
  let changesNeeded = false;
  
  // Process each file pattern
  for (const pattern of filesToIgnore) {
    // Check if it's tracked by git
    const isTracked = await isTrackedByGit(pattern);
    
    if (isTracked) {
      console.log(`⚠️ ${pattern} is tracked by git. Removing...`);
      
      // Make sure it's in .gitignore
      await addToGitignore(pattern);
      
      // Remove from git tracking
      await removeFromGitTracking(pattern);
      
      changesNeeded = true;
    } else {
      // Still ensure it's in .gitignore
      const existsInGitignore = await patternExistsInGitignore(pattern);
      
      if (!existsInGitignore) {
        await addToGitignore(pattern);
        changesNeeded = true;
      }
    }
  }
  
  // Commit if changes were made
  if (changesNeeded) {
    try {
      await commitChanges();
      console.log(`🎉 Done! Git repository is now clean.`);
    } catch (err) {
      console.log(`Changes to .gitignore made, but commit failed. You may need to commit manually.`);
    }
  } else {
    console.log(`✅ Git repository is already clean.`);
  }
}

// Run the script
main().catch(err => {
  console.error(`Failed to clean git repository: ${err}`);
  process.exit(1);
}); 