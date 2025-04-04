import { Workbook, Style } from 'exceljs';
import { promises as fs } from 'fs';
import path from 'path';
import { getFullPath } from '../config.mts';

export interface StyleAnalysisResult {
  issues: {
    type: 'font' | 'alignment' | 'border' | 'fill';
    message: string;
    location: string;
  }[];
}

const DEFAULT_STYLES: Partial<Style> = {
  font: {
    name: 'Arial',
    size: 11,
    bold: false
  },
  alignment: {
    horizontal: 'left',
    vertical: 'middle'
  },
  border: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  }
};

export async function analyzeStyles(workbook: Workbook): Promise<StyleAnalysisResult> {
  const issues: StyleAnalysisResult['issues'] = [];

  workbook.worksheets.forEach(worksheet => {
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        if (cell.style) {
          const style = cell.style;
          
          // Check font
          if (style.font?.name && style.font.name !== DEFAULT_STYLES.font?.name) {
            issues.push({
              type: 'font',
              message: `Inconsistent font: ${style.font.name}`,
              location: `${worksheet.name}!${cell.address}`
            });
          }

          // Check alignment
          if (style.alignment?.horizontal && style.alignment.horizontal !== DEFAULT_STYLES.alignment?.horizontal) {
            issues.push({
              type: 'alignment',
              message: `Inconsistent horizontal alignment: ${style.alignment.horizontal}`,
              location: `${worksheet.name}!${cell.address}`
            });
          }
        }
      });
    });
  });

  return { issues };
}

export async function fixStyles(workbook: Workbook): Promise<void> {
  const { issues } = await analyzeStyles(workbook);

  issues.forEach(issue => {
    const [sheetName, cellAddress] = issue.location.split('!');
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) return;

    const cell = worksheet.getCell(cellAddress);
    
    switch (issue.type) {
      case 'font':
        cell.style = { ...cell.style, font: DEFAULT_STYLES.font };
        break;
      case 'alignment':
        cell.style = { ...cell.style, alignment: DEFAULT_STYLES.alignment };
        break;
    }
  });
}

export async function analyzeStyles(): Promise<StyleAnalysis> {
  const result: StyleAnalysis = {
    inconsistentStyles: [],
    deprecatedStyles: [],
    missingStyles: []
  };

  try {
    const stylesDir = getFullPath('src/styles');
    const files = await fs.readdir(stylesDir);

    // ... existing code ...
  } catch (error) {
    console.error('Error analyzing styles:', error);
  }

  return result;
} 