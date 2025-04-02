import { ExcelComponent } from '../base';
import { ExcelRange, ExcelFormat, WorksheetOptions, ValidationRule, ConditionalFormat } from '../types';

/**
 * Component for managing Excel worksheets
 */
export class WorksheetComponent extends ExcelComponent {
  /**
   * Create a new worksheet with the specified options
   */
  async createWorksheet(options: WorksheetOptions): Promise<any> {
    return this.getWorksheet(options);
  }

  /**
   * Set values in a range of cells
   */
  async setValues(range: ExcelRange, values: any[][]): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    sheet.getCell(range.startCell).value = values;
  }

  /**
   * Apply validation rules to a range of cells
   */
  async applyValidation(range: ExcelRange, rule: ValidationRule): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    const validationOptions: any = {
      type: rule.type,
      operator: rule.operator,
      formulae: [rule.value1?.toString() || '', rule.value2?.toString() || ''],
      error: rule.errorMessage,
      errorTitle: rule.errorTitle,
    };

    if (rule.type === 'list' && rule.list) {
      validationOptions.formulae = [rule.list.join(',')];
    }

    if (rule.type === 'custom' && rule.customFormula) {
      validationOptions.formulae = [rule.customFormula];
    }

    sheet.getCell(this.getRangeString(range)).dataValidation = validationOptions;
  }

  /**
   * Apply conditional formatting to a range of cells
   */
  async applyConditionalFormat(range: ExcelRange, format: ConditionalFormat): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    const conditionalFormatOptions: any = {
      type: format.type,
      operator: format.operator,
      formulae: [format.value1?.toString() || '', format.value2?.toString() || ''],
      style: format.format,
    };

    if (format.type === 'expression' && format.customFormula) {
      conditionalFormatOptions.formulae = [format.customFormula];
    }

    sheet.getCell(this.getRangeString(range)).conditionalFormatting = conditionalFormatOptions;
  }

  /**
   * Merge cells in a range
   */
  async mergeCells(range: ExcelRange): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    sheet.mergeCells(this.getRangeString(range));
  }

  /**
   * Set column widths
   */
  async setColumnWidths(columns: { [key: string]: number }): Promise<void> {
    Object.entries(columns).forEach(([column, width]) => {
      this.worksheet.getColumn(column).width = width;
    });
  }

  /**
   * Set row heights
   */
  async setRowHeights(rows: { [key: number]: number }): Promise<void> {
    Object.entries(rows).forEach(([row, height]) => {
      this.worksheet.getRow(parseInt(row)).height = height;
    });
  }

  /**
   * Auto-fit columns in a range
   */
  async autoFitColumns(range: ExcelRange): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    const startCol = range.startCell.match(/[A-Z]+/)?.[0];
    const endCol = range.endCell.match(/[A-Z]+/)?.[0];

    if (startCol && endCol) {
      sheet.getColumn(startCol).width = null;
      sheet.getColumn(endCol).width = null;
    }
  }
} 