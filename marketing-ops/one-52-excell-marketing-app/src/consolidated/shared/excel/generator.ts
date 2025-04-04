import { Workbook, Worksheet, Cell, Row, Style } from 'exceljs';
import { EXCEL } from '../config/constants.js';
import { defaultCellStyle } from '../config/styles.js';
import { formatDateForExcel } from '../utils/formatting.js';

/**
 * Base Excel generator class for ONE52 Bar & Grill marketing operations
 */
export abstract class BaseExcelGenerator {
  protected workbook: Workbook;
  protected styles: Map<string, Partial<Style>>;

  constructor() {
    this.workbook = new Workbook();
    this.styles = new Map();
    this.initializeWorkbook();
    this.initializeStyles();
  }

  /**
   * Initialize workbook properties
   */
  protected initializeWorkbook(): void {
    this.workbook.creator = 'ONE52 Bar & Grill';
    this.workbook.lastModifiedBy = 'Marketing Team';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
  }

  /**
   * Initialize styles for the workbook
   */
  protected abstract initializeStyles(): void;

  /**
   * Add a style to the workbook
   * @param name Style name
   * @param style Style definition
   */
  protected addStyle(name: string, style: Partial<Style>): void {
    this.styles.set(name, style);
  }

  /**
   * Apply a style to a cell
   * @param cell Cell to style
   * @param styleName Name of the style to apply
   */
  protected applyStyle(cell: Cell, styleName: string): void {
    const style = this.styles.get(styleName);
    if (style) {
      Object.assign(cell, style);
    }
  }

  /**
   * Apply a style to a row
   * @param row Row to style
   * @param styleName Name of the style to apply
   */
  protected applyRowStyle(row: Row, styleName: string): void {
    const style = this.styles.get(styleName);
    if (style) {
      Object.assign(row, style);
    }
  }

  /**
   * Create a worksheet with the given name
   * @param name Worksheet name
   * @returns Created worksheet
   */
  protected createWorksheet(name: string): Worksheet {
    return this.workbook.addWorksheet(name);
  }

  /**
   * Set cell value with proper type handling
   * @param cell Cell to set
   * @param value Value to set
   */
  protected setCellValue(cell: Cell, value: any): void {
    if (typeof value === 'string' && value.startsWith('=')) {
      cell.value = { formula: value.substring(1) };
    } else {
      cell.value = value;
    }
  }

  /**
   * Add a comment to a cell
   * @param cell Cell to add comment to
   * @param comment Comment text
   * @param author Comment author
   */
  protected addComment(cell: Cell, comment: string, author: string = 'Marketing Team'): void {
    cell.note = {
      texts: [{ text: comment }],
      margins: { insetmode: 'auto' }
    };
  }

  /**
   * Generates the Excel workbook
   */
  public abstract generate(): Promise<Workbook>;

  /**
   * Saves the Excel workbook to a file
   */
  public async save(filename: string): Promise<void> {
    await this.workbook.xlsx.writeFile(filename);
  }

  /**
   * Gets the Excel workbook as a buffer
   */
  public async getBuffer(): Promise<Uint8Array> {
    return await this.workbook.xlsx.writeBuffer() as Uint8Array;
  }
} 