/**
 * Simple test script for chokidar watching
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Load configuration
const configFile = path.resolve(process.cwd(), '.prisma-ts-generator.json');
let config = {
  rootDir: './src/types',
  watch: {
    usePolling: true,
    pollInterval: 1000
  },
  excludePatterns: ['node_modules', '.next', 'dist']
};

try {
  if (fs.existsSync(configFile)) {
    const fileContent = fs.readFileSync(configFile, 'utf8');
    config = { ...config, ...JSON.parse(fileContent) };
    console.log('Loaded config from file');
  }
} catch (error) {
  console.error(`Error loading config file: ${error}`);
}

console.log('Using config:', JSON.stringify(config, null, 2));

// Test watch functionality
function testWatch() {
  const rootDir = path.resolve(process.cwd(), config.rootDir);
  console.log(`Absolute root dir: ${rootDir}`);
  
  // Create patterns
  const patterns = [`${rootDir}/**/*.ts`, `${rootDir}/**/*.tsx`];
  const ignored = config.excludePatterns?.map(pattern => 
    pattern.startsWith('**/') ? pattern : `**/${pattern}/**`
  ) || ['**/node_modules/**', '**/.next/**', '**/dist/**'];
  
  console.log(`Watch patterns:`, patterns);
  console.log(`Excluded patterns:`, ignored);
  
  // Initialize watcher
  const watchOptions = {
    persistent: true,
    ignoreInitial: false, // Important: set to false to see initial files
    usePolling: config.watch?.usePolling || true,
    interval: config.watch?.pollInterval || 1000,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  };
  
  console.log('Starting watcher with options:', watchOptions);
  
  const watcher = chokidar.watch(patterns, {
    ...watchOptions,
    ignored
  });
  
  // Setup event handlers
  watcher
    .on('ready', () => {
      console.log('Initial scan complete. Ready for changes...');
      const watchedPaths = watcher.getWatched();
      
      // Output detailed watched directories
      console.log('Watched directories:');
      if (Object.keys(watchedPaths).length === 0) {
        console.log('  No directories are being watched! Check your watch pattern.');
      } else {
        Object.keys(watchedPaths).forEach(dir => {
          console.log(`  ${dir}:`, watchedPaths[dir]);
        });
      }
    })
    .on('add', filePath => console.log(`File ${filePath} has been added`))
    .on('change', filePath => console.log(`File ${filePath} has been changed`))
    .on('unlink', filePath => console.log(`File ${filePath} has been removed`))
    .on('error', error => console.error(`Watcher error: ${error}`));
  
  console.log('Watching for changes...');
}

testWatch(); 