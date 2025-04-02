import { z } from 'zod';
import { MarketingCampaignData, marketingCampaignDataSchema } from './base';

/**
 * App-specific parameters for marketing campaigns
 */
export interface AppParameters {
  /** Number of new app signups per week from engagement */
  weeklyAppSignups: number;
  /** Number of new organic signups per month from TapPass */
  monthlyOrganicSignups: number;
  /** Opt-out rate for push notifications (0-1) */
  optOutRate: number;
  /** Cost per push notification in dollars */
  pushNotificationCost: number;
  /** Average order value through app in dollars */
  averageOrderValue: number;
  /** Percentage of orders through Postmates (0-1) */
  postmatesDeliveryRate: number;
  /** Postmates fee percentage (0-1) */
  postmatesFee: number;
}

/**
 * App-specific metrics for marketing campaigns
 */
export interface AppMetrics {
  /** Push notification engagement rate (0-1) */
  pushNotificationEngagementRate: number;
  /** Average number of orders per user */
  averageOrdersPerUser: number;
  /** Percentage of orders that are delivery (0-1) */
  deliveryOrderPercentage: number;
  /** Customer retention rate (0-1) */
  customerRetentionRate: number;
  /** Average points earned per visit */
  averagePointsPerVisit: number;
  /** Point redemption rate (0-1) */
  pointRedemptionRate: number;
}

/**
 * Revenue projections for app marketing
 */
export interface RevenueProjections {
  /** Revenue from in-app orders */
  inAppOrderRevenue: number;
  /** Revenue from delivery orders */
  deliveryOrderRevenue: number;
  /** Value of points redeemed */
  pointsRedemptionValue: number;
  /** Total revenue driven by app */
  totalAppDrivenRevenue: number;
  /** Cost savings from digital marketing */
  costSavingsFromDigitalMarketing: number;
  /** Net impact of app on revenue */
  netAppImpact: number;
}

/**
 * Complete app marketing data
 */
export interface AppMarketingData extends MarketingCampaignData {
  /** App-specific parameters */
  appParameters: AppParameters;
  /** App-specific metrics */
  appMetrics: AppMetrics;
  /** Revenue projections */
  revenueProjections: RevenueProjections;
}

// Zod Schemas

export const appParametersSchema = z.object({
  weeklyAppSignups: z.number().min(0),
  monthlyOrganicSignups: z.number().min(0),
  optOutRate: z.number().min(0).max(1),
  pushNotificationCost: z.number().min(0),
  averageOrderValue: z.number().min(0),
  postmatesDeliveryRate: z.number().min(0).max(1),
  postmatesFee: z.number().min(0).max(1),
});

export const appMetricsSchema = z.object({
  pushNotificationEngagementRate: z.number().min(0).max(1),
  averageOrdersPerUser: z.number().min(0),
  deliveryOrderPercentage: z.number().min(0).max(1),
  customerRetentionRate: z.number().min(0).max(1),
  averagePointsPerVisit: z.number().min(0),
  pointRedemptionRate: z.number().min(0).max(1),
});

export const revenueProjectionsSchema = z.object({
  inAppOrderRevenue: z.number().min(0),
  deliveryOrderRevenue: z.number().min(0),
  pointsRedemptionValue: z.number().min(0),
  totalAppDrivenRevenue: z.number().min(0),
  costSavingsFromDigitalMarketing: z.number().min(0),
  netAppImpact: z.number(),
});

export const appMarketingDataSchema = marketingCampaignDataSchema.extend({
  appParameters: appParametersSchema,
  appMetrics: appMetricsSchema,
  revenueProjections: revenueProjectionsSchema,
});

// Type Guards

export function isAppParameters(data: unknown): data is AppParameters {
  return appParametersSchema.safeParse(data).success;
}

export function isAppMetrics(data: unknown): data is AppMetrics {
  return appMetricsSchema.safeParse(data).success;
}

export function isRevenueProjections(data: unknown): data is RevenueProjections {
  return revenueProjectionsSchema.safeParse(data).success;
}

export function isAppMarketingData(data: unknown): data is AppMarketingData {
  return appMarketingDataSchema.safeParse(data).success;
} 