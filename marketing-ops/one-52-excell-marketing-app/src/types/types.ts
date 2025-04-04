import { 
  Workbook, 
  Worksheet, 
  Style, 
  Font, 
  Alignment, 
  Border, 
  Fill, 
  Protection, 
  CellValue, 
  CellFormulaValue,
  CellRichTextValue,
  CellHyperlinkValue,
  CellSharedFormulaValue
} from 'exceljs';
import { z } from 'zod';

export interface CodeMetrics {
  linesOfCode: number;
  commentLines: number;
  functions: number;
  classes: number;
  complexity: number;
  branchesAnalyzed?: number;
  historyEntries?: number;
  markdownFiles?: number;
} 

// Utility Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: ValidationError;
}

// Excel Types
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

// Excel Style Types
export interface ExcelStyle {
  font?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    size?: number;
    name?: string;
  };
  fill?: {
    type: 'solid' | 'pattern' | 'gradient';
    pattern?: string;
    fgColor?: string;
    bgColor?: string;
  };
  alignment?: {
    horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
    vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
    wrapText?: boolean;
    indent?: number;
    readingOrder?: number;
    textRotation?: number;
  };
  border?: {
    style?: 'thin' | 'medium' | 'thick' | 'dotted' | 'dashed' | 'double' | 'hair' | 'mediumDashed' | 'dashDot' | 'mediumDashDot' | 'dashDotDot' | 'mediumDashDotDot' | 'slantDashDot';
    color?: string;
  };
  protection?: {
    locked?: boolean;
    hidden?: boolean;
  };
}

// Excel Cell Types
export interface ExcelCell {
  row: number;
  col: number;
  value: string | number | boolean | Date | null;
  style?: ExcelStyle;
  merge?: boolean;
  mergeEndRow?: number;
  mergeEndCol?: number;
  formula?: string;
  hyperlink?: string;
  comment?: string;
}

// Excel Worksheet Types
export interface ExcelWorksheet {
  name: string;
  cells: ExcelCell[];
  columnWidths: number[];
  rowHeights?: number[];
  freezePane?: {
    xSplit?: number;
    ySplit?: number;
    topLeftCell?: string;
    activePane?: 'split' | 'frozen' | 'frozenSplit';
  };
  pageSetup?: {
    orientation?: 'portrait' | 'landscape';
    paperSize?: number;
    fitToPage?: boolean;
    fitToHeight?: number;
    fitToWidth?: number;
    scale?: number;
    margins?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
      header?: number;
      footer?: number;
    };
  };
}

export interface ExcelWorkbook {
  creator: string;
  lastModifiedBy: string;
  created: Date;
  modified: Date;
  worksheets: ExcelWorksheet[];
}

// Marketing Campaign Types

// Campaign Parameters
export interface CampaignParameters {
  availableStamps: number;
  costPerStamp: number;
  weeklyTargetRecipients: number;
  conversionRate: number;
  currentWeeklyRevenue: number;
  averageCustomerValue: number;
}

export const campaignParametersSchema = z.object({
  availableStamps: z.number().min(0),
  costPerStamp: z.number().min(0),
  weeklyTargetRecipients: z.number().min(0),
  conversionRate: z.number().min(0).max(1),
  currentWeeklyRevenue: z.number().min(0),
  averageCustomerValue: z.number().min(0)
});

// Weekly Calculations
export interface WeeklyCalculations {
  recipients: number;
  newCustomers: number;
  weeklyRevenueFromNewCustomers: number;
  totalWeeklyRevenueWithNewCustomers: number;
  weeklyStampCost: number;
  netWeeklyRevenue: number;
}

export const weeklyCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  weeklyRevenueFromNewCustomers: z.number().min(0),
  totalWeeklyRevenueWithNewCustomers: z.number().min(0),
  weeklyStampCost: z.number().min(0),
  netWeeklyRevenue: z.number()
});

// Monthly Calculations
export interface MonthlyCalculations {
  recipients: number;
  newCustomers: number;
  monthlyRevenueFromNewCustomers: number;
  totalMonthlyRevenueWithNewCustomers: number;
  monthlyStampCost: number;
  netMonthlyRevenue: number;
}

export const monthlyCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  monthlyRevenueFromNewCustomers: z.number().min(0),
  totalMonthlyRevenueWithNewCustomers: z.number().min(0),
  monthlyStampCost: z.number().min(0),
  netMonthlyRevenue: z.number()
});

// Annual Calculations
export interface AnnualCalculations {
  recipients: number;
  newCustomers: number;
  annualRevenueFromNewCustomers: number;
  totalAnnualRevenueWithNewCustomers: number;
  annualStampCost: number;
  netAnnualRevenue: number;
}

export const annualCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  annualRevenueFromNewCustomers: z.number().min(0),
  totalAnnualRevenueWithNewCustomers: z.number().min(0),
  annualStampCost: z.number().min(0),
  netAnnualRevenue: z.number()
});

// Additional Revenue Considerations
export interface AdditionalRevenue {
  repeatCustomerRate: number;
  repeatVisitsPerCustomer: number;
  averageSpendIncrease: number;
  wordOfMouthReferrals: number;
  referralConversionRate: number;
  socialMediaShares: number;
  socialMediaConversionRate: number;
  additionalAnnualRevenueFromRepeatCustomers: number;
  netAnnualRevenueWithRepeatCustomers: number;
  wordOfMouthEffect: number;
  additionalAnnualRevenueFromWordOfMouth: number;
}

export const additionalRevenueSchema = z.object({
  repeatCustomerRate: z.number().min(0).max(1),
  repeatVisitsPerCustomer: z.number().min(0),
  averageSpendIncrease: z.number().min(0),
  wordOfMouthReferrals: z.number().min(0),
  referralConversionRate: z.number().min(0).max(1),
  socialMediaShares: z.number().min(0),
  socialMediaConversionRate: z.number().min(0).max(1),
  additionalAnnualRevenueFromRepeatCustomers: z.number().min(0),
  netAnnualRevenueWithRepeatCustomers: z.number(),
  wordOfMouthEffect: z.number().min(0).max(1),
  additionalAnnualRevenueFromWordOfMouth: z.number().min(0)
});

// Break-Even Analysis
export interface BreakEvenAnalysis {
  totalMarketingCost: number;
  revenuePerCustomer: number;
  customersNeededForBreakEven: number;
  estimatedBreakEvenWeeks: number;
  returnOnInvestment: number;
  requiredNewCustomersToBreakEven: number;
  requiredConversionRateToBreakEven: number;
}

export const breakEvenAnalysisSchema = z.object({
  totalMarketingCost: z.number().min(0),
  revenuePerCustomer: z.number().min(0),
  customersNeededForBreakEven: z.number().min(0),
  estimatedBreakEvenWeeks: z.number().min(0),
  returnOnInvestment: z.number(),
  requiredNewCustomersToBreakEven: z.number().min(0),
  requiredConversionRateToBreakEven: z.number().min(0).max(1)
});

// Complete Marketing Campaign Data
export interface MarketingCampaignData {
  parameters: CampaignParameters;
  weeklyCalculations: WeeklyCalculations;
  monthlyCalculations: MonthlyCalculations;
  annualCalculations: AnnualCalculations;
  additionalRevenueConsiderations: AdditionalRevenue;
  breakEvenAnalysis: BreakEvenAnalysis;
}

export const marketingCampaignDataSchema = z.object({
  parameters: campaignParametersSchema,
  weeklyCalculations: weeklyCalculationsSchema,
  monthlyCalculations: monthlyCalculationsSchema,
  annualCalculations: annualCalculationsSchema,
  additionalRevenueConsiderations: additionalRevenueSchema,
  breakEvenAnalysis: breakEvenAnalysisSchema
});

// App Types
export interface AppParameters {
  targetNewAppUsers: number;
  appUserAcquisitionCost: number;
  appUserLifetimeValue: number;
  appUserEngagementRate: number;
  appUserRetentionRate: number;
}

export const appParametersSchema = z.object({
  targetNewAppUsers: z.number().min(0),
  appUserAcquisitionCost: z.number().min(0),
  appUserLifetimeValue: z.number().min(0),
  appUserEngagementRate: z.number().min(0).max(1),
  appUserRetentionRate: z.number().min(0).max(1)
});

export interface AppMarketingData {
  currentAppUsers: number;
  averageAppUserValue: number;
  appUserRetentionRate: number;
  appUserReferralRate: number;
}

export const appMarketingDataSchema = z.object({
  currentAppUsers: z.number().min(0),
  averageAppUserValue: z.number().min(0),
  appUserRetentionRate: z.number().min(0).max(1),
  appUserReferralRate: z.number().min(0).max(1)
});

export interface AppCalculations {
  projectedNewAppUsers: number;
  projectedRetainedUsers: number;
  projectedAppRevenue: number;
  appAcquisitionCost: number;
  netAppRevenue: number;
  projectedLifetimeValue: number;
}

export const appCalculationsSchema = z.object({
  projectedNewAppUsers: z.number().min(0),
  projectedRetainedUsers: z.number().min(0),
  projectedAppRevenue: z.number().min(0),
  appAcquisitionCost: z.number().min(0),
  netAppRevenue: z.number(),
  projectedLifetimeValue: z.number().min(0)
});

// Excel Types
export interface AppParameter {
  name: string;
  value: number | string;
  unit: string;
}

export interface GrowthMetric {
  name: string;
  formula: string;
}

export interface ValidationCheck {
  name: string;
  expected: number;
  formula: string;
}

export interface ExcelStyles {
  header: Style;
  input: Style;
  result: Style;
  growth: Style;
  cost: Style;
  warning: Style;
}

// App Metrics Types
export interface AppMetrics {
  name: string;
  value: number;
  target: number;
}

export interface RevenueImpact {
  name: string;
  formula: string;
  unit: string;
}

// Re-export ExcelJS types
export {
  Workbook,
  Worksheet,
  Style,
  Font,
  Alignment,
  Border,
  Fill,
  Protection,
  CellValue,
  CellFormulaValue,
  CellRichTextValue,
  CellHyperlinkValue,
  CellSharedFormulaValue
}; 