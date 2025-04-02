/**
 * Base types for Excel component operations
 */

export interface ExcelRange {
  sheet: string;
  startCell: string;
  endCell: string;
}

export interface ExcelFormat {
  numberFormat?: string;
  font?: {
    bold?: boolean;
    italic?: boolean;
    size?: number;
    color?: string;
  };
  fill?: {
    type: 'solid' | 'pattern';
    color?: string;
  };
  alignment?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'middle' | 'bottom';
  };
  border?: {
    style: 'thin' | 'medium' | 'thick';
    color: string;
  };
}

export interface ChartOptions {
  type: 'bar' | 'line' | 'pie';
  title: string;
  dataRange: ExcelRange;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: boolean;
  style?: {
    colors?: string[];
    fontSize?: number;
    titleSize?: number;
  };
}

export interface WorksheetOptions {
  name: string;
  protection?: {
    password?: string;
    allowSelectLockedCells?: boolean;
    allowSelectUnlockedCells?: boolean;
    allowFormatCells?: boolean;
    allowFormatColumns?: boolean;
    allowFormatRows?: boolean;
    allowInsertColumns?: boolean;
    allowInsertRows?: boolean;
    allowInsertHyperlinks?: boolean;
    allowDeleteColumns?: boolean;
    allowDeleteRows?: boolean;
    allowSort?: boolean;
    allowAutoFilter?: boolean;
    allowPivotTables?: boolean;
  };
}

export interface FormulaOptions {
  type: 'sum' | 'average' | 'count' | 'max' | 'min' | 'custom';
  range: ExcelRange;
  customFormula?: string;
}

export interface ValidationRule {
  type: 'list' | 'number' | 'date' | 'text' | 'custom';
  operator?: 'between' | 'notBetween' | 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
  value1?: string | number | Date;
  value2?: string | number | Date;
  list?: string[];
  customFormula?: string;
  errorMessage?: string;
  errorTitle?: string;
}

export interface ConditionalFormat {
  type: 'cellIs' | 'expression';
  operator?: 'between' | 'notBetween' | 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
  value1?: string | number | Date;
  value2?: string | number | Date;
  format: ExcelFormat;
  customFormula?: string;
} 