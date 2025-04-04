import { promises as fs } from 'fs';
import path from 'path';
import { getFullPath } from '../config.mts';

export interface CodeAnalysisResult {
  issues: {
    type: 'missing_import' | 'invalid_syntax' | 'type_error';
    message: string;
    location: string;
    expected: string;
    actual: string;
  }[];
}

export async function analyzeCode(): Promise<CodeAnalysis> {
  const result: CodeAnalysis = {
    syntaxIssues: [],
    typeIssues: [],
    styleIssues: []
  };

  try {
    const srcDir = getFullPath('src');
    const files = await fs.readdir(srcDir);
    for (const file of files) {
      if (file.endsWith('.mts')) {
        const content = await fs.readFile(path.join(srcDir, file), 'utf-8');
        
        // Check for ExcelJS imports
        if (content.includes('Workbook') && !content.includes('import { Workbook } from \'exceljs\'')) {
          result.typeIssues.push({
            type: 'missing_import',
            message: 'Missing ExcelJS Workbook import',
            location: file,
            expected: 'import { Workbook } from \'exceljs\'',
            actual: ''
          });
        }

        if (content.includes('Worksheet') && !content.includes('import { Worksheet } from \'exceljs\'')) {
          result.typeIssues.push({
            type: 'missing_import',
            message: 'Missing ExcelJS Worksheet import',
            location: file,
            expected: 'import { Worksheet } from \'exceljs\'',
            actual: ''
          });
        }

        if (content.includes('Style') && !content.includes('import { Style } from \'exceljs\'')) {
          result.typeIssues.push({
            type: 'missing_import',
            message: 'Missing ExcelJS Style import',
            location: file,
            expected: 'import { Style } from \'exceljs\'',
            actual: ''
          });
        }
      }
    }
  } catch (error) {
    console.error('Error analyzing code:', error);
  }

  return result;
}

export async function fixCode(): Promise<void> {
  const { issues } = await analyzeCode();
  const fixesDir = path.join(process.cwd(), 'src', 'fixes');

  for (const issue of issues) {
    if (issue.type === 'missing_import') {
      try {
        const filePath = path.join(fixesDir, issue.location);
        const content = await fs.readFile(filePath, 'utf-8');
        const newContent = `${issue.expected}\n${content}`;
        await fs.writeFile(filePath, newContent);
      } catch (error) {
        console.error(`Error fixing ${issue.location}:`, error);
      }
    }
  }
} 