import { z } from 'zod';

/**
 * Base parameters for all marketing campaigns
 */
export interface BaseCampaignParameters {
  /** Total budget for the campaign */
  budget: number;
  /** Start date of the campaign */
  startDate: Date;
  /** End date of the campaign */
  endDate: Date;
  /** Type of campaign */
  campaignType: 'current' | 'direct-mail' | 'app';
  /** Target audience size */
  targetAudience: number;
  /** Expected conversion rate (0-1) */
  expectedConversionRate: number;
  /** Customer lifetime value */
  customerLifetimeValue: number;
}

/**
 * Base calculations for all marketing campaigns
 */
export interface BaseCampaignCalculations {
  /** Total revenue generated */
  totalRevenue: number;
  /** Total costs incurred */
  totalCosts: number;
  /** Net profit */
  netProfit: number;
  /** Return on investment (0-1) */
  roi: number;
  /** Number of customers acquired */
  customersAcquired: number;
  /** Cost per customer acquisition */
  costPerAcquisition: number;
  /** Break-even point in customers */
  breakEvenCustomers: number;
  /** Break-even point in revenue */
  breakEvenRevenue: number;
}

/**
 * Zod schema for base campaign parameters
 */
export const baseCampaignParametersSchema = z.object({
  budget: z.number().positive(),
  startDate: z.date(),
  endDate: z.date(),
  campaignType: z.enum(['current', 'direct-mail', 'app']),
  targetAudience: z.number().positive(),
  expectedConversionRate: z.number().min(0).max(1),
  customerLifetimeValue: z.number().positive(),
});

/**
 * Zod schema for base campaign calculations
 */
export const baseCampaignCalculationsSchema = z.object({
  totalRevenue: z.number(),
  totalCosts: z.number(),
  netProfit: z.number(),
  roi: z.number(),
  customersAcquired: z.number(),
  costPerAcquisition: z.number(),
  breakEvenCustomers: z.number(),
  breakEvenRevenue: z.number(),
}); 