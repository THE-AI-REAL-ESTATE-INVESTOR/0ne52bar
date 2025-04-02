// Marketing Campaign Types

// Campaign Parameters
export interface CampaignParameters {
  availableStamps: number 
  costPerStamp: number;
  weeklyTargetRecipients: number;
  conversionRate: number;
  currentWeeklyRevenue: number;
  averageCustomerValue: number;
}

// Weekly Calculations
export interface WeeklyCalculations {
  recipients: number;
  newCustomers: number;
  weeklyRevenueFromNewCustomers: number;
  totalWeeklyRevenueWithNewCustomers: number;
  weeklyStampCost: number;
  netWeeklyRevenue: number;
}

// Monthly Calculations
export interface MonthlyCalculations {
  recipients: number;
  newCustomers: number;
  monthlyRevenueFromNewCustomers: number;
  totalMonthlyRevenueWithNewCustomers: number;
  monthlyStampCost: number;
  netMonthlyRevenue: number;
}

// Annual Calculations
export interface AnnualCalculations {
  recipients: number;
  newCustomers: number;
  annualRevenueFromNewCustomers: number;
  totalAnnualRevenueWithNewCustomers: number;
  annualStampCost: number;
  netAnnualRevenue: number;
}

// Additional Revenue Considerations
export interface AdditionalRevenueConsiderations {
  repeatCustomerRate: number;
  repeatVisitsPerCustomer: number;
  additionalAnnualRevenueFromRepeatCustomers: number;
  netAnnualRevenueWithRepeatCustomers: number;
  wordOfMouthEffect: number;
  additionalAnnualRevenueFromWordOfMouth: number;
}

// Break-Even Analysis
export interface BreakEvenAnalysis {
  requiredNewCustomersToBreakEven: number;
  requiredConversionRateToBreakEven: number;
}

// Complete Marketing Campaign Data
export interface MarketingCampaignData {
  parameters: CampaignParameters;
  weeklyCalculations: WeeklyCalculations;
  monthlyCalculations: MonthlyCalculations;
  annualCalculations: AnnualCalculations;
  additionalRevenueConsiderations: AdditionalRevenueConsiderations;
  breakEvenAnalysis: BreakEvenAnalysis;
}

// Excel Style Types
export interface ExcelStyle {
  font?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
  };
  fill?: {
    type: string;
    pattern: string;
    fgColor: string;
  };
  alignment?: {
    horizontal?: string;
    vertical?: string;
    wrapText?: boolean;
  };
}

// Excel Cell Types
export interface ExcelCell {
  row: number;
  col: number;
  value: string | number;
  style?: ExcelStyle;
  merge?: boolean;
  mergeEndRow?: number;
  mergeEndCol?: number;
}

// Excel Worksheet Types
export interface ExcelWorksheet {
  name: string;
  cells: ExcelCell[];
  columnWidths: number[];
} 