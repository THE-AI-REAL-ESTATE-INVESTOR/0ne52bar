/**
 * Common constants used across ONE52 Bar & Grill marketing operations
 */

/** Default currency settings */
export const CURRENCY = {
  /** Currency code */
  code: 'USD',
  /** Currency symbol */
  symbol: '$',
  /** Number of decimal places */
  decimals: 2,
  /** Thousands separator */
  thousandsSeparator: ',',
  /** Decimal separator */
  decimalSeparator: '.',
} as const;

/** Default date settings */
export const DATE = {
  /** Date format for display */
  displayFormat: 'MM/DD/YYYY',
  /** Date format for Excel */
  excelFormat: 'mm/dd/yyyy',
  /** Date format for filenames */
  filenameFormat: 'YYYY-MM-DD',
} as const;

/** Default number settings */
export const NUMBER = {
  /** Number format for currency */
  currencyFormat: '$#,##0.00',
  /** Number format for percentages */
  percentFormat: '0.00%',
  /** Number format for whole numbers */
  wholeNumberFormat: '#,##0',
  /** Number format for decimals */
  decimalFormat: '#,##0.00',
} as const;

/** Default Excel settings */
export const EXCEL = {
  /** Default column width */
  defaultColumnWidth: 15,
  /** Default row height */
  defaultRowHeight: 20,
  /** Maximum column width */
  maxColumnWidth: 50,
  /** Maximum row height */
  maxRowHeight: 100,
  /** Default font family */
  defaultFontFamily: 'Arial',
  /** Default font size */
  defaultFontSize: 11,
  /** Header font size */
  headerFontSize: 12,
  /** Default header color */
  headerColor: '#4472C4',
  /** Default header text color */
  headerTextColor: '#FFFFFF',
  /** Default alternate row color */
  alternateRowColor: '#F2F2F2',
  /** Default border color */
  borderColor: '#CCCCCC',
} as const;

/** Default validation settings */
export const VALIDATION = {
  /** Minimum budget amount */
  minBudget: 100,
  /** Maximum budget amount */
  maxBudget: 1000000,
  /** Minimum conversion rate */
  minConversionRate: 0,
  /** Maximum conversion rate */
  maxConversionRate: 1,
  /** Minimum customer lifetime value */
  minCustomerLifetimeValue: 10,
  /** Maximum customer lifetime value */
  maxCustomerLifetimeValue: 10000,
  /** Minimum target audience size */
  minTargetAudience: 100,
  /** Maximum target audience size */
  maxTargetAudience: 1000000,
} as const; 