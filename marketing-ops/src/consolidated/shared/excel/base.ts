import { ExcelRange, ExcelFormat, WorksheetOptions } from './types';

/**
 * Base class for Excel components
 */
export abstract class ExcelComponent {
  protected workbook: any; // ExcelJS Workbook
  protected worksheet: any; // ExcelJS Worksheet

  constructor(workbook: any) {
    this.workbook = workbook;
  }

  /**
   * Get or create a worksheet
   */
  protected async getWorksheet(options: WorksheetOptions): Promise<any> {
    const existingSheet = this.workbook.getWorksheet(options.name);
    if (existingSheet) {
      return existingSheet;
    }

    const newSheet = this.workbook.addWorksheet(options.name);
    if (options.protection) {
      await this.protectWorksheet(newSheet, options.protection);
    }
    return newSheet;
  }

  /**
   * Apply formatting to a range of cells
   */
  protected async formatRange(range: ExcelRange, format: ExcelFormat): Promise<void> {
    const sheet = this.workbook.getWorksheet(range.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${range.sheet} not found`);
    }

    const startCell = sheet.getCell(range.startCell);
    const endCell = sheet.getCell(range.endCell);

    // Apply number format
    if (format.numberFormat) {
      sheet.getCell(`${range.startCell}:${range.endCell}`).numFmt = format.numberFormat;
    }

    // Apply font formatting
    if (format.font) {
      const fontOptions: any = {};
      if (format.font.bold !== undefined) fontOptions.bold = format.font.bold;
      if (format.font.italic !== undefined) fontOptions.italic = format.font.italic;
      if (format.font.size !== undefined) fontOptions.size = format.font.size;
      if (format.font.color !== undefined) fontOptions.color = { argb: format.font.color };
      sheet.getCell(`${range.startCell}:${range.endCell}`).font = fontOptions;
    }

    // Apply fill formatting
    if (format.fill) {
      const fillOptions: any = {
        type: format.fill.type,
      };
      if (format.fill.color) {
        fillOptions.fgColor = { argb: format.fill.color };
      }
      sheet.getCell(`${range.startCell}:${range.endCell}`).fill = fillOptions;
    }

    // Apply alignment
    if (format.alignment) {
      sheet.getCell(`${range.startCell}:${range.endCell}`).alignment = format.alignment;
    }

    // Apply borders
    if (format.border) {
      const borderOptions: any = {
        style: format.border.style,
        color: { argb: format.border.color },
      };
      sheet.getCell(`${range.startCell}:${range.endCell}`).border = {
        top: borderOptions,
        left: borderOptions,
        bottom: borderOptions,
        right: borderOptions,
      };
    }
  }

  /**
   * Protect a worksheet with specified options
   */
  protected async protectWorksheet(worksheet: any, protection: WorksheetOptions['protection']): Promise<void> {
    if (!protection) return;

    const protectOptions: any = {};
    if (protection.password) protectOptions.password = protection.password;
    if (protection.allowSelectLockedCells !== undefined) protectOptions.selectLockedCells = protection.allowSelectLockedCells;
    if (protection.allowSelectUnlockedCells !== undefined) protectOptions.selectUnlockedCells = protection.allowSelectUnlockedCells;
    if (protection.allowFormatCells !== undefined) protectOptions.formatCells = protection.allowFormatCells;
    if (protection.allowFormatColumns !== undefined) protectOptions.formatColumns = protection.allowFormatColumns;
    if (protection.allowFormatRows !== undefined) protectOptions.formatRows = protection.allowFormatRows;
    if (protection.allowInsertColumns !== undefined) protectOptions.insertColumns = protection.allowInsertColumns;
    if (protection.allowInsertRows !== undefined) protectOptions.insertRows = protection.allowInsertRows;
    if (protection.allowInsertHyperlinks !== undefined) protectOptions.insertHyperlinks = protection.allowInsertHyperlinks;
    if (protection.allowDeleteColumns !== undefined) protectOptions.deleteColumns = protection.allowDeleteColumns;
    if (protection.allowDeleteRows !== undefined) protectOptions.deleteRows = protection.allowDeleteRows;
    if (protection.allowSort !== undefined) protectOptions.sort = protection.allowSort;
    if (protection.allowAutoFilter !== undefined) protectOptions.autoFilter = protection.allowAutoFilter;
    if (protection.allowPivotTables !== undefined) protectOptions.pivotTables = protection.allowPivotTables;

    await worksheet.protect(protectOptions);
  }

  /**
   * Get the range string from ExcelRange
   */
  protected getRangeString(range: ExcelRange): string {
    return `${range.startCell}:${range.endCell}`;
  }
} 