import ExcelJS from 'exceljs';
import {
  ExcelWorkbook,
  ExcelWorksheet,
  ExcelCell,
  ExcelStyle,
} from '../types';
import { EXCEL } from '../config/constants';
import {
  defaultCellStyle,
  headerCellStyle,
  alternateRowStyle,
} from '../config/styles';
import { formatDateForExcel } from '../utils/formatting';

/**
 * Base Excel generator class for ONE52 Bar & Grill marketing operations
 */
export abstract class BaseExcelGenerator {
  protected workbook: ExcelJS.Workbook;
  protected styles: Map<string, ExcelJS.Style>;

  constructor() {
    this.workbook = new ExcelJS.Workbook();
    this.styles = new Map();
    this.initializeStyles();
  }

  /**
   * Initializes the workbook styles
   */
  protected initializeStyles(): void {
    // Add default styles
    this.addStyle('default', defaultCellStyle);
    this.addStyle('header', headerCellStyle);
    this.addStyle('alternateRow', alternateRowStyle);
  }

  /**
   * Adds a style to the workbook
   */
  protected addStyle(name: string, style: ExcelStyle): void {
    const excelStyle = this.workbook.addStyle(style);
    this.styles.set(name, excelStyle);
  }

  /**
   * Creates a new worksheet
   */
  protected createWorksheet(config: ExcelWorksheet): ExcelJS.Worksheet {
    const worksheet = this.workbook.addWorksheet(config.name);

    // Set column widths
    if (config.columnWidths) {
      config.columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });
    }

    // Set row heights
    if (config.rowHeights) {
      config.rowHeights.forEach((height, index) => {
        worksheet.getRow(index + 1).height = height;
      });
    }

    // Set freeze panes
    if (config.freezePanes) {
      worksheet.views = [
        {
          state: 'frozen',
          xSplit: config.freezePanes.column,
          ySplit: config.freezePanes.row,
        },
      ];
    }

    // Add data
    config.data.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(rowIndex + 1);
      row.forEach((cell, colIndex) => {
        this.setCellValue(excelRow.getCell(colIndex + 1), cell);
      });
    });

    // Set auto filter
    if (config.autoFilter) {
      worksheet.autoFilter = {
        from: {
          row: config.autoFilter.startRow,
          column: config.autoFilter.startColumn,
        },
        to: {
          row: config.autoFilter.endRow,
          column: config.autoFilter.endColumn,
        },
      };
    }

    return worksheet;
  }

  /**
   * Sets a cell value with style
   */
  protected setCellValue(
    cell: ExcelJS.Cell,
    config: ExcelCell
  ): void {
    // Set value
    if (config.formula) {
      cell.value = { formula: config.formula };
    } else if (config.value instanceof Date) {
      cell.value = config.value;
      cell.numFmt = 'mm/dd/yyyy';
    } else {
      cell.value = config.value;
    }

    // Set style
    if (config.style) {
      const styleName = this.getStyleName(config.style);
      if (styleName) {
        cell.style = this.styles.get(styleName)!;
      } else {
        const newStyle = this.workbook.addStyle(config.style);
        cell.style = newStyle;
      }
    }

    // Set comment
    if (config.comment) {
      cell.addComment({
        text: config.comment,
        author: 'ONE52 Bar & Grill',
      });
    }

    // Set merge
    if (config.merge) {
      cell.merge(
        cell.row.number,
        cell.col.number,
        cell.row.number + config.merge.rows - 1,
        cell.col.number + config.merge.columns - 1
      );
    }
  }

  /**
   * Gets the style name for a given style
   */
  protected getStyleName(style: ExcelStyle): string | null {
    for (const [name, excelStyle] of this.styles.entries()) {
      if (JSON.stringify(style) === JSON.stringify(excelStyle)) {
        return name;
      }
    }
    return null;
  }

  /**
   * Generates the Excel workbook
   */
  public abstract generate(): Promise<ExcelJS.Workbook>;

  /**
   * Saves the Excel workbook to a file
   */
  public async save(filename: string): Promise<void> {
    await this.workbook.xlsx.writeFile(filename);
  }

  /**
   * Gets the Excel workbook as a buffer
   */
  public async getBuffer(): Promise<Buffer> {
    return await this.workbook.xlsx.writeBuffer();
  }
} 