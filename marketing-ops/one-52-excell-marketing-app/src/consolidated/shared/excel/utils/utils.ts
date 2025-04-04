import { ExcelComponent } from '../base';
import { ExcelRange, FormulaOptions } from '@/types/types';

/**
 * Component for managing Excel utilities
 */
export class UtilityComponent extends ExcelComponent {
  /**
   * Generate a formula for a range of cells
   */
  async generateFormula(options: FormulaOptions): Promise<string> {
    const { type, range, customFormula } = options;
    const rangeString = this.getRangeString(range);

    switch (type) {
      case 'sum':
        return `=SUM(${rangeString})`;
      case 'average':
        return `=AVERAGE(${rangeString})`;
      case 'count':
        return `=COUNT(${rangeString})`;
      case 'max':
        return `=MAX(${rangeString})`;
      case 'min':
        return `=MIN(${rangeString})`;
      case 'custom':
        if (!customFormula) {
          throw new Error('Custom formula is required for custom formula type');
        }
        return customFormula;
      default:
        throw new Error(`Invalid formula type: ${type}`);
    }
  }

  /**
   * Validate a range of cells
   */
  async validateRange(range: ExcelRange): Promise<boolean> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    try {
      const startCell = sheet.getCell(range.startCell);
      const endCell = sheet.getCell(range.endCell);
      return startCell && endCell;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the next available row in a worksheet
   */
  async getNextRow(sheetName: string): Promise<number> {
    const sheet = this.workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`Worksheet ${sheetName} not found`);
    }

    return sheet.rowCount + 1;
  }

  /**
   * Get the next available column in a worksheet
   */
  async getNextColumn(sheetName: string): Promise<string> {
    const sheet = this.workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`Worksheet ${sheetName} not found`);
    }

    const lastColumn = sheet.columnCount;
    return this.getColumnLetter(lastColumn + 1);
  }

  /**
   * Convert column number to letter
   */
  private getColumnLetter(column: number): string {
    let temp: number;
    let letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }

  /**
   * Convert column letter to number
   */
  private getColumnNumber(letter: string): number {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  }

  /**
   * Get cell reference from row and column
   */
  async getCellReference(row: number, column: number | string): Promise<string> {
    const columnLetter = typeof column === 'string' ? column : this.getColumnLetter(column);
    return `${columnLetter}${row}`;
  }

  /**
   * Get range reference from start and end cells
   */
  async getRangeReference(startRow: number, startColumn: number | string, endRow: number, endColumn: number | string): Promise<string> {
    const startCell = await this.getCellReference(startRow, startColumn);
    const endCell = await this.getCellReference(endRow, endColumn);
    return `${startCell}:${endCell}`;
  }
} 