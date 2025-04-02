import { ExcelStyle } from '../types/excel';
import { EXCEL } from './constants';

/**
 * Common Excel styles used across ONE52 Bar & Grill marketing operations
 */

/** Default cell style */
export const defaultCellStyle: ExcelStyle = {
  font: {
    family: EXCEL.defaultFontFamily,
    size: EXCEL.defaultFontSize,
  },
  alignment: {
    vertical: 'middle',
  },
  border: {
    style: 'thin',
    color: EXCEL.borderColor,
  },
};

/** Header cell style */
export const headerCellStyle: ExcelStyle = {
  font: {
    family: EXCEL.defaultFontFamily,
    size: EXCEL.headerFontSize,
    bold: true,
    color: EXCEL.headerTextColor,
  },
  fill: {
    type: 'pattern',
    color: EXCEL.headerColor,
    pattern: 'solid',
  },
  alignment: {
    horizontal: 'center',
    vertical: 'middle',
  },
  border: {
    style: 'thin',
    color: EXCEL.borderColor,
  },
};

/** Alternate row style */
export const alternateRowStyle: ExcelStyle = {
  fill: {
    type: 'pattern',
    color: EXCEL.alternateRowColor,
    pattern: 'solid',
  },
};

/** Currency cell style */
export const currencyCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  numFmt: '$#,##0.00',
  alignment: {
    horizontal: 'right',
    vertical: 'middle',
  },
};

/** Percentage cell style */
export const percentageCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  numFmt: '0.00%',
  alignment: {
    horizontal: 'right',
    vertical: 'middle',
  },
};

/** Whole number cell style */
export const wholeNumberCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  numFmt: '#,##0',
  alignment: {
    horizontal: 'right',
    vertical: 'middle',
  },
};

/** Decimal cell style */
export const decimalCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  numFmt: '#,##0.00',
  alignment: {
    horizontal: 'right',
    vertical: 'middle',
  },
};

/** Date cell style */
export const dateCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  numFmt: 'mm/dd/yyyy',
  alignment: {
    horizontal: 'center',
    vertical: 'middle',
  },
};

/** Warning cell style */
export const warningCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  font: {
    ...defaultCellStyle.font,
    color: '#FF0000',
    bold: true,
  },
};

/** Success cell style */
export const successCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  font: {
    ...defaultCellStyle.font,
    color: '#008000',
    bold: true,
  },
};

/** Formula cell style */
export const formulaCellStyle: ExcelStyle = {
  ...defaultCellStyle,
  font: {
    ...defaultCellStyle.font,
    italic: true,
  },
}; 