import { promises as fs } from 'fs';
import path from 'path';
import { TypeScriptAnalyzer } from './typescript-analyzer.mts';
import { MarkdownHistoryAnalyzer } from './markdown-history-analyzer.mts';
import { CodeMetrics } from '../types/types.mts';

export class CodeFixer {
  private tsAnalyzer: TypeScriptAnalyzer;
  private mdAnalyzer: MarkdownHistoryAnalyzer;

  constructor() {
    this.tsAnalyzer = new TypeScriptAnalyzer();
    this.mdAnalyzer = new MarkdownHistoryAnalyzer();
  }

  async fix(filePath: string): Promise<void> {
    const ext = path.extname(filePath);
    
    switch (ext) {
      case '.ts':
      case '.tsx':
        await this.fixTypeScript(filePath);
        break;
      case '.md':
        await this.fixMarkdown(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  private async fixTypeScript(filePath: string): Promise<void> {
    const metrics = await this.tsAnalyzer.analyze(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    let fixedContent = content;

    // Add missing imports if needed
    if (!content.includes('import')) {
      fixedContent = `import { ExcelJS } from 'exceljs';\n${fixedContent}`;
    }

    // Add type annotations if missing
    if (!content.includes(': ')) {
      fixedContent = fixedContent.replace(
        /function\s+(\w+)\s*\(([\w\s,]*)\)/g,
        'function $1($2): void'
      );
    }

    await fs.writeFile(filePath, fixedContent);
  }

  private async fixMarkdown(filePath: string): Promise<void> {
    const metrics = await this.mdAnalyzer.analyze();
    const content = await fs.readFile(filePath, 'utf-8');
    let fixedContent = content;

    // Add missing headers if needed
    if (!content.includes('#')) {
      const fileName = path.basename(filePath, '.md');
      fixedContent = `# ${fileName}\n\n${fixedContent}`;
    }

    // Add code block markers if missing
    if (content.includes('```') && !content.includes('```typescript')) {
      fixedContent = fixedContent.replace(/```\n/g, '```typescript\n');
    }

    await fs.writeFile(filePath, fixedContent);
  }

  async fixDirectory(dirPath: string): Promise<void> {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const ext = path.extname(file);
        if (['.ts', '.tsx', '.md'].includes(ext)) {
          await this.fix(filePath);
        }
      }
    }
  }
} 