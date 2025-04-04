import { Style, Fill, Font, Border, Alignment } from 'exceljs';
import { EXCEL } from './constants';

/**
 * Common Excel styles used across ONE52 Bar & Grill marketing operations
 */

/** Default cell style */
export const defaultCellStyle: Partial<Style> = {
  font: {
    name: EXCEL.defaultFontFamily,
    size: Number(EXCEL.defaultFontSize)
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'left'
  },
  border: {
    top: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    left: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    bottom: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    right: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } }
  }
};

/** Header cell style */
export const headerStyle: Partial<Style> = {
  font: {
    name: EXCEL.defaultFontFamily,
    size: Number(EXCEL.headerFontSize),
    bold: true,
    color: { argb: 'FF' + EXCEL.headerTextColor.substring(1) }
  },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF' + EXCEL.headerColor.substring(1) }
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'center'
  },
  border: {
    top: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    left: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    bottom: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    right: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } }
  }
};

/** Input cell style */
export const inputStyle: Partial<Style> = {
  font: {
    name: EXCEL.defaultFontFamily,
    size: Number(EXCEL.defaultFontSize)
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'right'
  },
  border: {
    top: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    left: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    bottom: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    right: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } }
  }
};

/** Result cell style */
export const resultStyle: Partial<Style> = {
  font: {
    name: EXCEL.defaultFontFamily,
    size: Number(EXCEL.defaultFontSize),
    bold: true
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'right'
  },
  border: {
    top: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    left: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    bottom: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } },
    right: { style: 'thin', color: { argb: 'FF' + EXCEL.borderColor.substring(1) } }
  }
};

/** Note cell style */
export const noteStyle: Partial<Style> = {
  font: {
    name: EXCEL.defaultFontFamily,
    size: Number(EXCEL.defaultFontSize),
    italic: true,
    color: { argb: 'FF666666' }
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'left',
    wrapText: true
  }
};

/** Currency cell style */
export const currencyCellStyle: Partial<Style> = {
  ...defaultCellStyle,
  numFmt: '$#,##0.00',
  alignment: {
    horizontal: 'right',
    vertical: 'middle'
  }
};

/** Percentage cell style */
export const percentageCellStyle: Partial<Style> = {
  ...defaultCellStyle,
  numFmt: '0.00%',
  alignment: {
    horizontal: 'right',
    vertical: 'middle'
  }
};

/** Whole number cell style */
export const wholeNumberCellStyle: Partial<Style> = {
  ...defaultCellStyle,
  numFmt: '#,##0',
  alignment: {
    horizontal: 'right',
    vertical: 'middle'
  }
};

/** Decimal cell style */
export const decimalCellStyle: Partial<Style> = {
  ...defaultCellStyle,
  numFmt: '#,##0.00',
  alignment: {
    horizontal: 'right',
    vertical: 'middle'
  }
};

/** Date cell style */
export const dateCellStyle: Partial<Style> = {
  ...defaultCellStyle,
  numFmt: 'mm/dd/yyyy',
  alignment: {
    horizontal: 'center',
    vertical: 'middle'
  }
}; 