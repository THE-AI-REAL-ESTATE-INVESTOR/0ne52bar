import { promises as fs } from 'fs';
import path from 'path';
import { CodeMetrics } from '@/types/types.mts';

export class TypeScriptAnalyzer {
  async analyze(filePath: string): Promise<CodeMetrics> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const metrics: CodeMetrics = {
      totalLines: lines.length,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
      complexity: 0
    };

    let inMultiLineComment = false;

    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        metrics.blankLines++;
      } else if (inMultiLineComment) {
        metrics.commentLines++;
        if (trimmedLine.includes('*/')) {
          inMultiLineComment = false;
        }
      } else if (trimmedLine.startsWith('//')) {
        metrics.commentLines++;
      } else if (trimmedLine.startsWith('/*')) {
        metrics.commentLines++;
        if (!trimmedLine.includes('*/')) {
          inMultiLineComment = true;
        }
      } else {
        metrics.codeLines++;
        // Simple complexity metric: count control flow statements
        if (
          trimmedLine.includes('if ') ||
          trimmedLine.includes('else ') ||
          trimmedLine.includes('for ') ||
          trimmedLine.includes('while ') ||
          trimmedLine.includes('switch ') ||
          trimmedLine.includes('case ')
        ) {
          metrics.complexity++;
        }
      }
    });

    return metrics;
  }

  async analyzeDirectory(dirPath: string): Promise<{ [key: string]: CodeMetrics }> {
    const results: { [key: string]: CodeMetrics } = {};
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          results[file] = await this.analyze(filePath);
        }
      }
    }

    return results;
  }
} 