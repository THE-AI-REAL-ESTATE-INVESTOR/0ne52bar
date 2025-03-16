#!/usr/bin/env node

/**
 * Find Duplicate Scripts
 * 
 * This script analyzes the scripts directory to find potentially duplicate
 * or very similar script files. It compares file contents using similarity
 * metrics to identify scripts that might have overlapping functionality.
 * 
 * Usage:
 *   node find-duplicate-scripts.js [--threshold=0.7]
 * 
 * Options:
 *   --threshold   Similarity threshold (0-1, default: 0.7)
 *   --help        Show help message
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const SCRIPTS_DIR = path.resolve(__dirname, '..');
const DEFAULT_THRESHOLD = 0.7;
const SKIP_DIRS = ['node_modules', '.git'];
const SKIP_FILES = ['.DS_Store', 'thumbs.db', 'README.md', '.cursorrules'];
const EXTENSIONS = ['.js', '.ts', '.mjs', '.sh'];

// Parse command line arguments
const args = process.argv.slice(2);
let threshold = DEFAULT_THRESHOLD;
let showHelp = false;

args.forEach(arg => {
  if (arg.startsWith('--threshold=')) {
    threshold = parseFloat(arg.split('=')[1]);
  }
  if (arg === '--help' || arg === '-h') {
    showHelp = true;
  }
});

if (showHelp) {
  console.log(`
Find Duplicate Scripts

This script analyzes the scripts directory to find potentially duplicate
or very similar script files. It compares file contents using similarity
metrics to identify scripts that might have overlapping functionality.

Usage:
  node find-duplicate-scripts.js [--threshold=0.7]

Options:
  --threshold   Similarity threshold (0-1, default: 0.7)
                Higher values mean more similar files will be reported
  --help        Show this help message
  `);
  process.exit(0);
}

// Validate threshold
if (isNaN(threshold) || threshold < 0 || threshold > 1) {
  console.error('Error: Threshold must be a number between 0 and 1');
  process.exit(1);
}

/**
 * Get all script files in a directory recursively
 */
function getScriptFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (EXTENSIONS.includes(ext) && !SKIP_FILES.includes(entry.name)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDir(dir);
  return files;
}

/**
 * Calculate similarity between two strings using Jaccard index
 */
function calculateSimilarity(str1, str2) {
  // For very different size files, they're likely not duplicates
  const lengthRatio = Math.min(str1.length, str2.length) / Math.max(str1.length, str2.length);
  if (lengthRatio < 0.5) {
    return 0;
  }
  
  // Convert strings to sets of words
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 0));
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 0));
  
  // Find intersection
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  
  // Calculate Jaccard index
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

/**
 * Get file hash for quick comparison
 */
function getFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Main execution
console.log('🔍 Scanning scripts directory for potential duplicates...');
console.log(`Using similarity threshold: ${threshold}\n`);

const scriptFiles = getScriptFiles(SCRIPTS_DIR);
console.log(`Found ${scriptFiles.length} script files to analyze\n`);

// Generate file content and hashes
const fileData = scriptFiles.map(file => {
  const relativePath = path.relative(SCRIPTS_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  const hash = getFileHash(file);
  return { path: file, relativePath, content, hash };
});

// Find exact duplicates by hash
const hashGroups = {};
fileData.forEach(file => {
  if (!hashGroups[file.hash]) {
    hashGroups[file.hash] = [];
  }
  hashGroups[file.hash].push(file);
});

const exactDuplicates = Object.values(hashGroups).filter(group => group.length > 1);

if (exactDuplicates.length > 0) {
  console.log('⚠️ EXACT DUPLICATES FOUND:');
  exactDuplicates.forEach(group => {
    console.log('\nThe following files are exact duplicates:');
    group.forEach(file => console.log(`  - ${file.relativePath}`));
    console.log('Recommendation: Keep only one copy, preferably in the most appropriate directory.');
  });
  console.log('\n---\n');
} else {
  console.log('✅ No exact duplicates found.\n');
}

// Find similar files
console.log('Analyzing file similarities...');
const similarFiles = [];

for (let i = 0; i < fileData.length; i++) {
  for (let j = i + 1; j < fileData.length; j++) {
    // Skip files with same hash (exact duplicates already reported)
    if (fileData[i].hash === fileData[j].hash) continue;
    
    const similarity = calculateSimilarity(fileData[i].content, fileData[j].content);
    if (similarity >= threshold) {
      similarFiles.push({
        file1: fileData[i].relativePath,
        file2: fileData[j].relativePath,
        similarity: similarity.toFixed(2)
      });
    }
  }
}

if (similarFiles.length > 0) {
  console.log(`\n⚠️ SIMILAR FILES FOUND (${similarFiles.length} pairs):`);
  
  // Sort by similarity
  similarFiles.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));
  
  similarFiles.forEach(pair => {
    console.log(`\nSimilarity: ${parseFloat(pair.similarity) * 100}%`);
    console.log(`  - ${pair.file1}`);
    console.log(`  - ${pair.file2}`);
    console.log('Recommendation: Review these files for potential consolidation.');
  });
} else {
  console.log('✅ No significantly similar files found.');
}

console.log('\n---\n');
console.log('Analysis complete.');
console.log('Recommendations:');
console.log('  1. For exact duplicates, delete redundant copies');
console.log('  2. For similar files, review and potentially consolidate');
console.log('  3. Keep scripts organized in their appropriate directories');
console.log('  4. Update the README.md with any changes made'); 