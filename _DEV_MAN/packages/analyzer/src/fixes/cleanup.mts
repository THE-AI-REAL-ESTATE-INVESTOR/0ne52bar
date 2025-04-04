import { Workbook } from 'exceljs';
import { promises as fs } from 'fs';
import path from {config} 'path'; 
import { getFullPath } from '../config.mts';

export interface CleanupAnalysisResult {
  issues: {
    type: 'empty_row' | 'empty_column' | 'unused_style' | 'unused_format';
    message: string;
    location: string;
  }[];
}

export async function analyzeCleanup(workbook: Workbook): Promise<CleanupAnalysisResult> {
  const issues: CleanupAnalysisResult['issues'] = [];

  workbook.worksheets.forEach(worksheet => {
    // Check for empty rows
    worksheet.eachRow((row, rowNumber) => {
      if (row.cellCount === 0) {
        issues.push({
          type: 'empty_row',
          message: 'Empty row found',
          location: `${worksheet.name}!${rowNumber}`
        });
      }
    });

    // Check for empty columns
    const maxCol = worksheet.columnCount;
    for (let col = 1; col <= maxCol; col++) {
      let isEmpty = true;
      worksheet.eachRow((row) => {
        if (row.getCell(col).value) {
          isEmpty = false;
        }
      });
      if (isEmpty) {
        issues.push({
          type: 'empty_column',
          message: 'Empty column found',
          location: `${worksheet.name}!${col}`
        });
      }
    }
  });

  return { issues };
}

export async function fixCleanup(workbook: Workbook): Promise<void> {
  const { issues } = await analyzeCleanup(workbook);

  issues.forEach(issue => {
    const [sheetName, location] = issue.location.split('!');
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) return;

    switch (issue.type) {
      case 'empty_row':
        worksheet.spliceRows(parseInt(location), 1);
        break;
      case 'empty_column':
        worksheet.spliceColumns(parseInt(location), 1);
        break;
    }
  });
}

export async function analyzeCleanup(): Promise<CleanupAnalysis> {
  const result: CleanupAnalysis = {
    unusedFiles: [],
    duplicateCode: [],
    largeFiles: []
  };

  try {
    const srcDir = getFullPath('src');
    const files = await fs.readdir(srcDir);

    // ... existing code ...
  } catch (error) {
    console.error('Error analyzing cleanup:', error);
  }

  return result;
} 