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

import {
  CampaignParameters,
  WeeklyCalculations,
  MonthlyCalculations,
  AnnualCalculations,
  AdditionalRevenue,
  BreakEvenAnalysis,
  AppMetrics,
  RevenueImpact
} from '@/types/types';

export const CAMPAIGN_PARAMETERS: CampaignParameters = {
  availableStamps: 10000,
  costPerStamp: 0.50,
  weeklyTargetRecipients: 1000,
  conversionRate: 0.02,
  currentWeeklyRevenue: 50000,
  averageCustomerValue: 100
};

export const WEEKLY_CALCULATIONS: WeeklyCalculations = {
  recipients: 1000,
  newCustomers: 20,
  weeklyRevenueFromNewCustomers: 2000,
  totalWeeklyRevenueWithNewCustomers: 52000,
  weeklyStampCost: 500,
  netWeeklyRevenue: 51500
};

export const MONTHLY_CALCULATIONS: MonthlyCalculations = {
  recipients: 4000,
  newCustomers: 80,
  monthlyRevenueFromNewCustomers: 8000,
  totalMonthlyRevenueWithNewCustomers: 208000,
  monthlyStampCost: 2000,
  netMonthlyRevenue: 206000
};

export const ANNUAL_CALCULATIONS: AnnualCalculations = {
  recipients: 48000,
  newCustomers: 960,
  annualRevenueFromNewCustomers: 96000,
  totalAnnualRevenueWithNewCustomers: 2496000,
  annualStampCost: 24000,
  netAnnualRevenue: 2472000
};

export const ADDITIONAL_REVENUE: AdditionalRevenue = {
  repeatCustomerRate: 0.3,
  repeatVisitsPerCustomer: 4,
  averageSpendIncrease: 0.15,
  wordOfMouthReferrals: 2,
  referralConversionRate: 0.25,
  socialMediaShares: 10,
  socialMediaConversionRate: 0.1,
  additionalAnnualRevenueFromRepeatCustomers: 115200,
  netAnnualRevenueWithRepeatCustomers: 2587200,
  wordOfMouthEffect: 0.1,
  additionalAnnualRevenueFromWordOfMouth: 172800
};

export const BREAK_EVEN: BreakEvenAnalysis = {
  totalMarketingCost: 24000,
  revenuePerCustomer: 100,
  customersNeededForBreakEven: 240,
  estimatedBreakEvenWeeks: 12,
  returnOnInvestment: 0.2,
  requiredNewCustomersToBreakEven: 240,
  requiredConversionRateToBreakEven: 0.005
};

export const APP_METRICS: AppMetrics[] = [
  { name: 'App Downloads', value: 0, target: 1000 },
  { name: 'Active Users', value: 0, target: 500 },
  { name: 'User Retention', value: 0, target: 30 },
  { name: 'App Rating', value: 0, target: 4.5 }
];

export const REVENUE_IMPACT: RevenueImpact[] = [
  { name: 'Direct Revenue', formula: '=B2*B3', unit: '$' },
  { name: 'Indirect Revenue', formula: '=B3*B4', unit: '$' },
  { name: 'Total Revenue Impact', formula: '=B2+B3', unit: '$' }
]; 