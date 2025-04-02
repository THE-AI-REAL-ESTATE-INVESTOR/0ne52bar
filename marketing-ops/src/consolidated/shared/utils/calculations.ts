import { BaseCampaignParameters, BaseCampaignCalculations } from '../types';

/**
 * Calculates the number of customers acquired based on target audience and conversion rate
 */
export function calculateCustomersAcquired(
  targetAudience: number,
  conversionRate: number
): number {
  return Math.floor(targetAudience * conversionRate);
}

/**
 * Calculates the cost per customer acquisition
 */
export function calculateCostPerAcquisition(
  totalCost: number,
  customersAcquired: number
): number {
  return customersAcquired > 0 ? totalCost / customersAcquired : 0;
}

/**
 * Calculates the return on investment (ROI)
 */
export function calculateROI(
  totalRevenue: number,
  totalCost: number
): number {
  return totalCost > 0 ? (totalRevenue - totalCost) / totalCost : 0;
}

/**
 * Calculates the break-even point in customers
 */
export function calculateBreakEvenCustomers(
  totalCost: number,
  customerLifetimeValue: number
): number {
  return customerLifetimeValue > 0
    ? Math.ceil(totalCost / customerLifetimeValue)
    : 0;
}

/**
 * Calculates the break-even point in revenue
 */
export function calculateBreakEvenRevenue(
  totalCost: number,
  roi: number
): number {
  return roi > 0 ? totalCost * (1 + roi) : totalCost;
}

/**
 * Calculates the campaign duration in days
 */
export function calculateCampaignDuration(
  startDate: Date,
  endDate: Date
): number {
  return Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Calculates the daily budget
 */
export function calculateDailyBudget(
  totalBudget: number,
  duration: number
): number {
  return duration > 0 ? totalBudget / duration : 0;
}

/**
 * Calculates the weekly budget
 */
export function calculateWeeklyBudget(
  totalBudget: number,
  duration: number
): number {
  return duration > 0 ? totalBudget / (duration / 7) : 0;
}

/**
 * Calculates the monthly budget
 */
export function calculateMonthlyBudget(
  totalBudget: number,
  duration: number
): number {
  return duration > 0 ? totalBudget / (duration / 30) : 0;
}

/**
 * Calculates all campaign metrics
 */
export function calculateCampaignMetrics(
  params: BaseCampaignParameters
): BaseCampaignCalculations {
  const customersAcquired = calculateCustomersAcquired(
    params.targetAudience,
    params.expectedConversionRate
  );

  const totalRevenue = customersAcquired * params.customerLifetimeValue;
  const totalCosts = params.budget;
  const netProfit = totalRevenue - totalCosts;
  const roi = calculateROI(totalRevenue, totalCosts);
  const costPerAcquisition = calculateCostPerAcquisition(
    totalCosts,
    customersAcquired
  );
  const breakEvenCustomers = calculateBreakEvenCustomers(
    totalCosts,
    params.customerLifetimeValue
  );
  const breakEvenRevenue = calculateBreakEvenRevenue(totalCosts, roi);

  return {
    totalRevenue,
    totalCosts,
    netProfit,
    roi,
    customersAcquired,
    costPerAcquisition,
    breakEvenCustomers,
    breakEvenRevenue,
  };
} 