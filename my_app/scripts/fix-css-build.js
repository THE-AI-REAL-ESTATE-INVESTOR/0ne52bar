// Script to fix the entryCSSFiles error in Next.js 15
const fs = require('fs');
const path = require('path');

console.log('🛠 Starting CSS fix for Next.js 15 build...');

// Helper function to find the next-server compiled files
function findNextServerDir() {
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  
  // Try to find Next.js modules in different formats (direct or pnpm)
  const possiblePaths = [
    path.join(nodeModulesPath, 'next', 'dist', 'compiled', 'next-server'),
    path.join(nodeModulesPath, '.pnpm', 'next@15*', 'node_modules', 'next', 'dist', 'compiled', 'next-server')
  ];
  
  // Find the first path that exists
  for (const p of possiblePaths) {
    try {
      // Use glob pattern to find all matching directories
      const potentialDirs = fs.readdirSync(path.dirname(p), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('next@15'))
        .map(dirent => path.join(path.dirname(p), dirent.name, 'node_modules', 'next', 'dist', 'compiled', 'next-server'));
        
      // Check each directory
      for (const dir of [p, ...potentialDirs]) {
        if (fs.existsSync(dir)) {
          console.log(`✅ Found Next.js server directory at: ${dir}`);
          return dir;
        }
      }
    } catch (err) {
      // Continue to the next path if this one fails
    }
  }
  
  console.log('❌ Could not find Next.js server directory. Make sure Next.js 15 is installed.');
  return null;
}

// Find target files that need patching
function findTargetFiles(serverDir) {
  if (!serverDir) return [];
  
  try {
    // Get all files in the server directory
    const allFiles = [];
    
    // Recursively get all files
    function getAllFiles(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          getAllFiles(fullPath);
        } else {
          allFiles.push(fullPath);
        }
      }
    }
    
    getAllFiles(serverDir);
    
    // Filter for app-page runtime files that might contain entryCSSFiles
    const targetFiles = allFiles.filter(file => 
      file.includes('app-page') || 
      file.includes('app-render')
    );
    
    console.log(`🔍 Found ${targetFiles.length} potential files to patch.`);
    return targetFiles;
  } catch (err) {
    console.error('❌ Error finding target files:', err);
    return [];
  }
}

// Patch a file to fix the entryCSSFiles error
function patchFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains entryCSSFiles
    if (content.includes('entryCSSFiles')) {
      console.log(`🔧 Patching file: ${path.basename(filePath)}`);
      
      // Create a backup
      fs.writeFileSync(`${filePath}.backup`, content);
      
      // Replace direct access to entryCSSFiles with a safe version
      // This creates a fallback empty object when entryCSSFiles is undefined
      content = content.replace(/(\w+)\.entryCSSFiles/g, '($1 && $1.entryCSSFiles ? $1.entryCSSFiles : {})');
      
      // Write the patched file
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`❌ Error patching file ${filePath}:`, err);
    return false;
  }
}

// Main function
function main() {
  // Find the Next.js server directory
  const serverDir = findNextServerDir();
  if (!serverDir) return;
  
  // Find target files
  const targetFiles = findTargetFiles(serverDir);
  if (targetFiles.length === 0) {
    console.log('❌ No files found to patch.');
    return;
  }
  
  // Patch each file
  let patchedCount = 0;
  for (const file of targetFiles) {
    if (patchFile(file)) {
      patchedCount++;
    }
  }
  
  console.log(`✅ Successfully patched ${patchedCount} files.`);
  console.log('🚀 You can now run "next build" to build your application!');
}

// Run the script
main(); 