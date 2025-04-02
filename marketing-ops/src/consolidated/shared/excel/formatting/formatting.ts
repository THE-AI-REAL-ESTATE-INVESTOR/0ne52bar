import { ExcelComponent } from '../base';
import { ExcelRange, ExcelFormat } from '../types';

/**
 * Component for managing Excel formatting
 */
export class FormattingComponent extends ExcelComponent {
  /**
   * Apply number formatting to a range of cells
   */
  async formatNumber(range: ExcelRange, format: string): Promise<void> {
    await this.formatRange(range, { numberFormat: format });
  }

  /**
   * Apply currency formatting to a range of cells
   */
  async formatCurrency(range: ExcelRange, currencyCode: string = 'USD'): Promise<void> {
    const format = `"${currencyCode}"#,##0.00`;
    await this.formatRange(range, { numberFormat: format });
  }

  /**
   * Apply percentage formatting to a range of cells
   */
  async formatPercentage(range: ExcelRange, decimalPlaces: number = 2): Promise<void> {
    const format = `0.${'0'.repeat(decimalPlaces)}%`;
    await this.formatRange(range, { numberFormat: format });
  }

  /**
   * Apply date formatting to a range of cells
   */
  async formatDate(range: ExcelRange, format: string = 'yyyy-mm-dd'): Promise<void> {
    await this.formatRange(range, { numberFormat: format });
  }

  /**
   * Apply bold formatting to a range of cells
   */
  async formatBold(range: ExcelRange, bold: boolean = true): Promise<void> {
    await this.formatRange(range, { font: { bold } });
  }

  /**
   * Apply italic formatting to a range of cells
   */
  async formatItalic(range: ExcelRange, italic: boolean = true): Promise<void> {
    await this.formatRange(range, { font: { italic } });
  }

  /**
   * Apply font size to a range of cells
   */
  async formatFontSize(range: ExcelRange, size: number): Promise<void> {
    await this.formatRange(range, { font: { size } });
  }

  /**
   * Apply font color to a range of cells
   */
  async formatFontColor(range: ExcelRange, color: string): Promise<void> {
    await this.formatRange(range, { font: { color } });
  }

  /**
   * Apply background color to a range of cells
   */
  async formatBackgroundColor(range: ExcelRange, color: string): Promise<void> {
    await this.formatRange(range, { fill: { type: 'solid', color } });
  }

  /**
   * Apply horizontal alignment to a range of cells
   */
  async formatHorizontalAlignment(range: ExcelRange, alignment: 'left' | 'center' | 'right'): Promise<void> {
    await this.formatRange(range, { alignment: { horizontal: alignment, vertical: 'middle' } });
  }

  /**
   * Apply vertical alignment to a range of cells
   */
  async formatVerticalAlignment(range: ExcelRange, alignment: 'top' | 'middle' | 'bottom'): Promise<void> {
    await this.formatRange(range, { alignment: { horizontal: 'left', vertical: alignment } });
  }

  /**
   * Apply borders to a range of cells
   */
  async formatBorders(range: ExcelRange, style: 'thin' | 'medium' | 'thick' = 'thin', color: string = '000000'): Promise<void> {
    await this.formatRange(range, { border: { style, color } });
  }

  /**
   * Apply custom formatting to a range of cells
   */
  async applyCustomFormat(range: ExcelRange, format: ExcelFormat): Promise<void> {
    await this.formatRange(range, format);
  }
} 