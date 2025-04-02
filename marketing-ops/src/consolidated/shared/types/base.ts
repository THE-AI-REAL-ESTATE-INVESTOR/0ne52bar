import { z } from 'zod';

/**
 * Base parameters for marketing campaigns
 */
export interface CampaignParameters {
  /** Number of stamps available for the campaign */
  availableStamps: number;
  /** Cost per stamp in dollars */
  costPerStamp: number;
  /** Target number of recipients per week */
  weeklyTargetRecipients: number;
  /** Expected conversion rate (0-1) */
  conversionRate: number;
  /** Current weekly revenue in dollars */
  currentWeeklyRevenue: number;
  /** Average customer value in dollars */
  averageCustomerValue: number;
}

/**
 * Weekly calculations for marketing campaigns
 */
export interface WeeklyCalculations {
  /** Number of recipients this week */
  recipients: number;
  /** Number of new customers this week */
  newCustomers: number;
  /** Revenue from new customers this week */
  weeklyRevenueFromNewCustomers: number;
  /** Total weekly revenue including new customers */
  totalWeeklyRevenueWithNewCustomers: number;
  /** Cost of stamps this week */
  weeklyStampCost: number;
  /** Net weekly revenue */
  netWeeklyRevenue: number;
}

/**
 * Monthly calculations for marketing campaigns
 */
export interface MonthlyCalculations {
  /** Number of recipients this month */
  recipients: number;
  /** Number of new customers this month */
  newCustomers: number;
  /** Revenue from new customers this month */
  monthlyRevenueFromNewCustomers: number;
  /** Total monthly revenue including new customers */
  totalMonthlyRevenueWithNewCustomers: number;
  /** Cost of stamps this month */
  monthlyStampCost: number;
  /** Net monthly revenue */
  netMonthlyRevenue: number;
}

/**
 * Annual calculations for marketing campaigns
 */
export interface AnnualCalculations {
  /** Number of recipients this year */
  recipients: number;
  /** Number of new customers this year */
  newCustomers: number;
  /** Revenue from new customers this year */
  annualRevenueFromNewCustomers: number;
  /** Total annual revenue including new customers */
  totalAnnualRevenueWithNewCustomers: number;
  /** Cost of stamps this year */
  annualStampCost: number;
  /** Net annual revenue */
  netAnnualRevenue: number;
}

/**
 * Additional revenue considerations for marketing campaigns
 */
export interface AdditionalRevenueConsiderations {
  /** Rate of repeat customers (0-1) */
  repeatCustomerRate: number;
  /** Average number of visits per customer */
  repeatVisitsPerCustomer: number;
  /** Additional annual revenue from repeat customers */
  additionalAnnualRevenueFromRepeatCustomers: number;
  /** Net annual revenue including repeat customers */
  netAnnualRevenueWithRepeatCustomers: number;
  /** Word of mouth effect multiplier */
  wordOfMouthEffect: number;
  /** Additional annual revenue from word of mouth */
  additionalAnnualRevenueFromWordOfMouth: number;
}

/**
 * Break-even analysis for marketing campaigns
 */
export interface BreakEvenAnalysis {
  /** Required number of new customers to break even */
  requiredNewCustomersToBreakEven: number;
  /** Required conversion rate to break even */
  requiredConversionRateToBreakEven: number;
}

/**
 * Complete marketing campaign data
 */
export interface MarketingCampaignData {
  /** Campaign parameters */
  parameters: CampaignParameters;
  /** Weekly calculations */
  weeklyCalculations: WeeklyCalculations;
  /** Monthly calculations */
  monthlyCalculations: MonthlyCalculations;
  /** Annual calculations */
  annualCalculations: AnnualCalculations;
  /** Additional revenue considerations */
  additionalRevenueConsiderations: AdditionalRevenueConsiderations;
  /** Break-even analysis */
  breakEvenAnalysis: BreakEvenAnalysis;
}

// Zod Schemas

export const campaignParametersSchema = z.object({
  availableStamps: z.number().min(0),
  costPerStamp: z.number().min(0),
  weeklyTargetRecipients: z.number().min(0),
  conversionRate: z.number().min(0).max(1),
  currentWeeklyRevenue: z.number().min(0),
  averageCustomerValue: z.number().min(0),
});

export const weeklyCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  weeklyRevenueFromNewCustomers: z.number().min(0),
  totalWeeklyRevenueWithNewCustomers: z.number().min(0),
  weeklyStampCost: z.number().min(0),
  netWeeklyRevenue: z.number(),
});

export const monthlyCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  monthlyRevenueFromNewCustomers: z.number().min(0),
  totalMonthlyRevenueWithNewCustomers: z.number().min(0),
  monthlyStampCost: z.number().min(0),
  netMonthlyRevenue: z.number(),
});

export const annualCalculationsSchema = z.object({
  recipients: z.number().min(0),
  newCustomers: z.number().min(0),
  annualRevenueFromNewCustomers: z.number().min(0),
  totalAnnualRevenueWithNewCustomers: z.number().min(0),
  annualStampCost: z.number().min(0),
  netAnnualRevenue: z.number(),
});

export const additionalRevenueConsiderationsSchema = z.object({
  repeatCustomerRate: z.number().min(0).max(1),
  repeatVisitsPerCustomer: z.number().min(0),
  additionalAnnualRevenueFromRepeatCustomers: z.number().min(0),
  netAnnualRevenueWithRepeatCustomers: z.number().min(0),
  wordOfMouthEffect: z.number().min(0),
  additionalAnnualRevenueFromWordOfMouth: z.number().min(0),
});

export const breakEvenAnalysisSchema = z.object({
  requiredNewCustomersToBreakEven: z.number().min(0),
  requiredConversionRateToBreakEven: z.number().min(0).max(1),
});

export const marketingCampaignDataSchema = z.object({
  parameters: campaignParametersSchema,
  weeklyCalculations: weeklyCalculationsSchema,
  monthlyCalculations: monthlyCalculationsSchema,
  annualCalculations: annualCalculationsSchema,
  additionalRevenueConsiderations: additionalRevenueConsiderationsSchema,
  breakEvenAnalysis: breakEvenAnalysisSchema,
});

// Type Guards

export function isCampaignParameters(data: unknown): data is CampaignParameters {
  return campaignParametersSchema.safeParse(data).success;
}

export function isWeeklyCalculations(data: unknown): data is WeeklyCalculations {
  return weeklyCalculationsSchema.safeParse(data).success;
}

export function isMonthlyCalculations(data: unknown): data is MonthlyCalculations {
  return monthlyCalculationsSchema.safeParse(data).success;
}

export function isAnnualCalculations(data: unknown): data is AnnualCalculations {
  return annualCalculationsSchema.safeParse(data).success;
}

export function isAdditionalRevenueConsiderations(data: unknown): data is AdditionalRevenueConsiderations {
  return additionalRevenueConsiderationsSchema.safeParse(data).success;
}

export function isBreakEvenAnalysis(data: unknown): data is BreakEvenAnalysis {
  return breakEvenAnalysisSchema.safeParse(data).success;
}

export function isMarketingCampaignData(data: unknown): data is MarketingCampaignData {
  return marketingCampaignDataSchema.safeParse(data).success;
} 