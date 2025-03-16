import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

interface DiagramConfig {
  watchMode: boolean;
  sourceDir: string;
  outputDir: string;
}

function parseArgs(): DiagramConfig {
  const args = process.argv.slice(2);
  return {
    watchMode: args.includes('--watch'),
    sourceDir: path.resolve(process.cwd(), 'src'),
    outputDir: path.resolve(process.cwd(), 'docs/diagrams')
  };
}

function generateDiagrams(config: DiagramConfig): void {
  // Implementation of diagram generation
  console.log('Generating diagrams...');
  // TODO: Add actual diagram generation logic
}

function watchForChanges(config: DiagramConfig): void {
  console.log('Watching for changes...');
  
  const watcher = chokidar.watch(config.sourceDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  
  watcher
    .on('change', (path) => {
      console.log(`File ${path} has been changed`);
      generateDiagrams(config);
    })
    .on('error', error => console.error(`Watcher error: ${error}`));
}

function main(): void {
  const config = parseArgs();
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  generateDiagrams(config);
  
  if (config.watchMode) {
    watchForChanges(config);
  }
}

main(); 