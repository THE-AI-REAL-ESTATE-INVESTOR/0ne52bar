import { TypeScriptAnalyzer } from './file/typescript-analyzer.mts';
import { MarkdownHistoryAnalyzer } from './file/markdown-history-analyzer.mts';
import { CodeFixer } from './file/code-fixer.mts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting code analysis...');

  // Define the target directory
  const targetDir = path.join(__dirname, '../../../one-52-excell-marketing-app');

  // Test TypeScript Analyzer
  console.log('\nTesting TypeScript Analyzer...');
  const tsAnalyzer = new TypeScriptAnalyzer();
  const tsMetrics = await tsAnalyzer.analyzeDirectory(path.join(targetDir, 'src'));
  console.log('TypeScript Analysis Complete!');
  console.log('Metrics:', tsMetrics);

  // Test History Analyzer
  console.log('\nTesting History Analyzer...');
  const historyAnalyzer = new MarkdownHistoryAnalyzer();
  const historyMetrics = await historyAnalyzer.analyze();
  console.log('History Analysis Complete!');
  console.log('Metrics:', {
    totalLines: historyMetrics.totalLines,
    codeLines: historyMetrics.codeLines,
    commentLines: historyMetrics.commentLines,
    blankLines: historyMetrics.blankLines,
    complexity: historyMetrics.complexity
  });

  // Test Code Fixer
  console.log('\nTesting Code Fixer...');
  const codeFixer = new CodeFixer();
  await codeFixer.fixDirectory(targetDir);
  console.log('Code Fixer Analysis Complete!');
  console.log('Reports generated in output/ directory');

  console.log('\nAll tests completed successfully!');
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 