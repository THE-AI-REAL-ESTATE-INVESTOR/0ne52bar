import { z } from 'zod';
import {
  AppParameters,
  AppMarketingData,
  AppCalculations,
  appParametersSchema,
  appMarketingDataSchema,
  appCalculationsSchema
} from '@/types/types';

/**
 * Calculates app-specific metrics based on marketing data and parameters
 * @param marketingData App marketing data
 * @param parameters App parameters
 * @returns App calculations
 */
export function calculateAppMetrics(
  marketingData: AppMarketingData,
  parameters: AppParameters
): AppCalculations {
  // Validate inputs
  const validatedData = appMarketingDataSchema.parse(marketingData);
  const validatedParams = appParametersSchema.parse(parameters);

  // Extract data
  const {
    currentAppUsers,
    averageAppUserValue,
    appUserRetentionRate,
    appUserReferralRate,
  } = validatedData;

  // Extract parameters
  const {
    targetNewAppUsers,
    appUserAcquisitionCost,
    appUserLifetimeValue,
    appUserEngagementRate,
  } = validatedParams;

  // Calculate metrics
  const projectedNewAppUsers = Math.min(
    targetNewAppUsers,
    currentAppUsers * appUserReferralRate
  );
  const projectedRetainedUsers =
    (currentAppUsers + projectedNewAppUsers) * appUserRetentionRate;
  const projectedAppRevenue =
    projectedRetainedUsers * averageAppUserValue * appUserEngagementRate;
  const appAcquisitionCost = projectedNewAppUsers * appUserAcquisitionCost;
  const netAppRevenue = projectedAppRevenue - appAcquisitionCost;
  const projectedLifetimeValue =
    projectedRetainedUsers * appUserLifetimeValue * appUserEngagementRate;

  // Create result object
  const result: AppCalculations = {
    projectedNewAppUsers,
    projectedRetainedUsers,
    projectedAppRevenue,
    appAcquisitionCost,
    netAppRevenue,
    projectedLifetimeValue,
  };

  // Validate result
  return appCalculationsSchema.parse(result);
}

/**
 * Calculates app ROI based on app calculations
 * @param calculations App calculations
 * @returns ROI percentage
 */
export function calculateAppROI(calculations: AppCalculations): number {
  // Validate calculations
  const validatedCalculations = appCalculationsSchema.parse(calculations);

  // Extract values
  const { netAppRevenue, appAcquisitionCost } = validatedCalculations;

  // Calculate ROI
  return (netAppRevenue / appAcquisitionCost) * 100;
}

/**
 * Calculates app user engagement score based on app parameters
 * @param parameters App parameters
 * @returns Engagement score (0-100)
 */
export function calculateEngagementScore(
  parameters: AppParameters
): number {
  // Validate parameters
  const validatedParams = appParametersSchema.parse(parameters);

  // Extract parameters
  const { appUserEngagementRate, appUserRetentionRate } = validatedParams;

  // Calculate engagement score (weighted average of engagement and retention)
  const engagementWeight = 0.6;
  const retentionWeight = 0.4;
  const score =
    appUserEngagementRate * engagementWeight +
    appUserRetentionRate * retentionWeight;

  // Convert to 0-100 scale and round to 2 decimal places
  return Math.round(score * 100 * 100) / 100;
}

/**
 * Calculates app marketing efficiency score based on app calculations
 * @param calculations App calculations
 * @returns Efficiency score (0-100)
 */
export function calculateEfficiencyScore(
  calculations: AppCalculations
): number {
  // Validate calculations
  const validatedCalculations = appCalculationsSchema.parse(calculations);

  // Extract values
  const {
    projectedAppRevenue,
    appAcquisitionCost,
    projectedNewAppUsers,
  } = validatedCalculations;

  // Calculate cost per acquired user
  const costPerUser = appAcquisitionCost / projectedNewAppUsers;

  // Calculate revenue per dollar spent
  const revenuePerDollar = projectedAppRevenue / appAcquisitionCost;

  // Calculate efficiency score (weighted average of metrics)
  const costPerUserWeight = 0.4;
  const revenuePerDollarWeight = 0.6;

  // Normalize cost per user (lower is better)
  const normalizedCostPerUser = Math.max(0, 1 - costPerUser / 100);

  // Calculate final score
  const score =
    normalizedCostPerUser * costPerUserWeight +
    revenuePerDollar * revenuePerDollarWeight;

  // Convert to 0-100 scale and round to 2 decimal places
  return Math.round(score * 100 * 100) / 100;
} 