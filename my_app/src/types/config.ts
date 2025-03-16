/**
 * Utility module for testing and improving the ts2prisma watch mode
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

/**
 * Configuration structure for ts2prisma
 */
interface Ts2PrismaConfig {
  rootDir: string;
  outputPath: string;
  dbProvider: string;
  watch?: {
    enabled: boolean;
    usePolling: boolean;
    pollInterval: number;
  };
  includeComments?: boolean;
  preserveDirectives?: boolean;
  excludePatterns?: string[];
  verbose?: boolean;
}

/**
 * Default configuration
 */
const defaultConfig: Ts2PrismaConfig = {
  rootDir: './src',
  outputPath: './prisma/schema.prisma',
  dbProvider: 'sqlite',
  watch: {
    enabled: false,
    usePolling: true,
    pollInterval: 1000
  },
  includeComments: true,
  preserveDirectives: true,
  excludePatterns: ['node_modules', '.next', 'dist'],
  verbose: false
};

/**
 * Load configuration from file if it exists
 */
function loadConfig(configPath?: string): Ts2PrismaConfig {
  const defaultPath = path.resolve(process.cwd(), '.prisma-ts-generator.json');
  const targetPath = configPath ? path.resolve(process.cwd(), configPath) : defaultPath;
  
  try {
    if (fs.existsSync(targetPath)) {
      const fileContent = fs.readFileSync(targetPath, 'utf8');
      const config = JSON.parse(fileContent);
      return { ...defaultConfig, ...config };
    }
  } catch (error) {
    console.error(`Error loading config file: ${error}`);
  }
  
  return defaultConfig;
}

/**
 * Test the watch functionality with the current configuration
 */
function testWatch(config: Ts2PrismaConfig): void {
  const rootDir = path.resolve(process.cwd(), config.rootDir);
  
  console.log(`Testing watch functionality with config:`, JSON.stringify(config, null, 2));
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
    ignoreInitial: true,
    usePolling: config.watch?.usePolling || false,
    interval: config.watch?.pollInterval || 1000,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  };
  
  const watcher = chokidar.watch(patterns, {
    ...watchOptions,
    ignored
  });
  
  // Setup event handlers
  watcher
    .on('ready', () => {
      console.log('Initial scan complete. Ready for changes...');
      const watchedPaths = watcher.getWatched();
      console.log('Watched paths:', Object.keys(watchedPaths).length > 0 
        ? Object.keys(watchedPaths) 
        : 'No paths being watched');
      
      // Output detailed watched directories
      console.log('Watched directories:');
      if (Object.keys(watchedPaths).length === 0) {
        console.log('  No directories are being watched! Check your watch pattern.');
      } else {
        Object.keys(watchedPaths).forEach((dir: string) => {
          console.log(`  ${dir}:`, watchedPaths[dir]);
        });
      }
    })
    .on('add', (filePath: string) => console.log(`File ${filePath} has been added`))
    .on('change', (filePath: string) => console.log(`File ${filePath} has been changed`))
    .on('unlink', (filePath: string) => console.log(`File ${filePath} has been removed`))
    .on('error', (error: Error) => console.error(`Watcher error: ${error}`));
  
  console.log('Watching for changes...');
}

// Run the test if this module is executed directly
if (require.main === module) {
  const config = loadConfig();
  console.log('Loaded config:', config);
  testWatch(config);
}

module.exports = {
  loadConfig,
  testWatch,
  defaultConfig
}; 