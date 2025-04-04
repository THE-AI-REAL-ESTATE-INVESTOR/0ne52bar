import { CodeFixer } from './file/code-fixer.mts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  const fixer = new CodeFixer();
  const testDir = path.join(__dirname, 'test');

  console.log('Starting test analysis...');
  
  try {
    // Fix TypeScript file
    const tsFile = path.join(testDir, 'test-file.ts');
    console.log(`\nAnalyzing TypeScript file: ${tsFile}`);
    await fixer.fix(tsFile);
    console.log('TypeScript file fixed successfully');

    // Fix Markdown file
    const mdFile = path.join(testDir, 'test-file.md');
    console.log(`\nAnalyzing Markdown file: ${mdFile}`);
    await fixer.fix(mdFile);
    console.log('Markdown file fixed successfully');

    // Fix entire directory
    console.log('\nAnalyzing test directory...');
    await fixer.fixDirectory(testDir);
    console.log('Directory analysis complete');

  } catch (error) {
    console.error('Error during test:', error);
  }
}

runTest().catch(console.error); 