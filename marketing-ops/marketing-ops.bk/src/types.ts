import { Style, Fill, Alignment } from 'exceljs';

export interface CampaignParameters {
  availableStamps: number;
  costPerStamp: number;
  weeklyTargetRecipients: number;
  conversionRate: number;
  currentWeeklyRevenue: number;
  averageCustomerValue: number;
}

export interface WeeklyCalculations {
  recipients: number;
  newCustomers: number;
  weeklyRevenueFromNewCustomers: number;
  totalWeeklyRevenueWithNewCustomers: number;
  weeklyStampCost: number;
  netWeeklyRevenue: number;
}

export interface MonthlyCalculations {
  recipients: number;
  newCustomers: number;
  monthlyRevenueFromNewCustomers: number;
  totalMonthlyRevenueWithNewCustomers: number;
  monthlyStampCost: number;
  netMonthlyRevenue: number;
}

export interface AnnualCalculations {
  recipients: number;
  newCustomers: number;
  annualRevenueFromNewCustomers: number;
  totalAnnualRevenueWithNewCustomers: number;
  annualStampCost: number;
  netAnnualRevenue: number;
}

export interface AdditionalRevenueConsiderations {
  repeatCustomerRate: number;
  repeatVisitsPerCustomer: number;
  additionalAnnualRevenueFromRepeatCustomers: number;
  netAnnualRevenueWithRepeatCustomers: number;
  wordOfMouthEffect: number;
  additionalAnnualRevenueFromWordOfMouth: number;
}

export interface BreakEvenAnalysis {
  requiredNewCustomersToBreakEven: number;
  requiredConversionRateToBreakEven: number;
}

export interface MarketingCampaignData {
  parameters: CampaignParameters;
  weeklyCalculations: WeeklyCalculations;
  monthlyCalculations: MonthlyCalculations;
  annualCalculations: AnnualCalculations;
  additionalRevenueConsiderations: AdditionalRevenueConsiderations;
  breakEvenAnalysis: BreakEvenAnalysis;
}

export interface ExcelStyle {
  font?: Partial<Style['font']>;
  fill?: Fill;
  alignment?: Partial<Alignment>;
}

export interface ExcelCell {
  value: string | number;
  style?: ExcelStyle;
}

export interface ExcelWorksheet {
  name: string;
  columns: Array<{
    header: string;
    key: string;
    width: number;
  }>;
  rows: ExcelCell[][];
} 