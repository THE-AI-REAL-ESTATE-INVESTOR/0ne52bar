import { Workbook } from 'exceljs';
import { ExcelStyle } from '@/types/types.mts';
import { promises as fs } from 'fs';
import path from 'path';
import { getFullPath } from '../config.mts';

export interface CompatibilityAnalysisResult {
  issues: {
    type: 'style' | 'formula' | 'reference';
    message: string;
    location: string;
  }[];
}

export interface CompatibilityAnalysis {
  versionIssues: string[];
  dependencyIssues: string[];
  apiIssues: string[];
}

export async function analyzeCompatibility(): Promise<CompatibilityAnalysis> {
  const result: CompatibilityAnalysis = {
    versionIssues: [],
    dependencyIssues: [],
    apiIssues: []
  };

  try {
    const packageJsonPath = getFullPath('package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    const issues: CompatibilityAnalysisResult['issues'] = [];

    // Check style compatibility
    workbook.worksheets.forEach(worksheet => {
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (cell.style) {
            const style = cell.style as ExcelStyle;
            if (style.font?.name && !['Arial', 'Calibri'].includes(style.font.name)) {
              issues.push({
                type: 'style',
                message: `Unsupported font: ${style.font.name}`,
                location: `${worksheet.name}!${cell.address}`
              });
            }
          }
        });
      });
    });

    // Check formula compatibility
    workbook.worksheets.forEach(worksheet => {
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (cell.formula) {
            if (cell.formula.includes('INDIRECT')) {
              issues.push({
                type: 'formula',
                message: 'INDIRECT function not supported in ExcelJS',
                location: `${worksheet.name}!${cell.address}`
              });
            }
          }
        });
      });
    });

    return { issues };
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    return result;
  }
}

export async function fixCompatibility(workbook: Workbook): Promise<void> {
  const { issues } = await analyzeCompatibility(workbook);

  issues.forEach(issue => {
    if (issue.type === 'style') {
      const [sheetName, cellAddress] = issue.location.split('!');
      const worksheet = workbook.getWorksheet(sheetName);
      const cell = worksheet.getCell(cellAddress);
      
      if (cell.style?.font?.name) {
        cell.style.font.name = 'Arial';
      }
    }
  });
} 