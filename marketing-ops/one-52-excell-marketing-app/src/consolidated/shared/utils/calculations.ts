import { z } from 'zod';
import { 
  CampaignParameters, 
  MarketingCampaignData,
  AppParameters,
  AppCalculations
} from '@/types/types';

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
  params: CampaignParameters
): MarketingCampaignData {
  const customersAcquired = calculateCustomersAcquired(
    params.weeklyTargetRecipients,
    params.conversionRate
  );

  const totalRevenue = customersAcquired * params.averageCustomerValue;
  const totalCosts = params.availableStamps * params.costPerStamp;
  const netProfit = totalRevenue - totalCosts;
  const roi = calculateROI(totalRevenue, totalCosts);
  const costPerAcquisition = calculateCostPerAcquisition(
    totalCosts,
    customersAcquired
  );
  const breakEvenCustomers = calculateBreakEvenCustomers(
    totalCosts,
    params.averageCustomerValue
  );
  const breakEvenRevenue = calculateBreakEvenRevenue(totalCosts, roi);

  return {
    parameters: params,
    weeklyCalculations: {
      recipients: params.weeklyTargetRecipients,
      newCustomers: customersAcquired,
      weeklyRevenueFromNewCustomers: totalRevenue,
      totalWeeklyRevenueWithNewCustomers: params.currentWeeklyRevenue + totalRevenue,
      weeklyStampCost: totalCosts,
      netWeeklyRevenue: netProfit
    },
    monthlyCalculations: {
      recipients: params.weeklyTargetRecipients * 4,
      newCustomers: customersAcquired * 4,
      monthlyRevenueFromNewCustomers: totalRevenue * 4,
      totalMonthlyRevenueWithNewCustomers: (params.currentWeeklyRevenue + totalRevenue) * 4,
      monthlyStampCost: totalCosts * 4,
      netMonthlyRevenue: netProfit * 4
    },
    annualCalculations: {
      recipients: params.weeklyTargetRecipients * 52,
      newCustomers: customersAcquired * 52,
      annualRevenueFromNewCustomers: totalRevenue * 52,
      totalAnnualRevenueWithNewCustomers: (params.currentWeeklyRevenue + totalRevenue) * 52,
      annualStampCost: totalCosts * 52,
      netAnnualRevenue: netProfit * 52
    },
    additionalRevenueConsiderations: {
      repeatCustomerRate: 0.3,
      repeatVisitsPerCustomer: 2,
      averageSpendIncrease: 0.1,
      wordOfMouthEffect: 0.2,
      wordOfMouthReferrals: 5,
      referralConversionRate: 0.3,
      socialMediaShares: 10,
      socialMediaConversionRate: 0.1,
      additionalAnnualRevenueFromRepeatCustomers: 0,
      netAnnualRevenueWithRepeatCustomers: 0,
      additionalAnnualRevenueFromWordOfMouth: 0
    },
    breakEvenAnalysis: {
      totalMarketingCost: totalCosts * 52,
      revenuePerCustomer: params.averageCustomerValue,
      customersNeededForBreakEven: breakEvenCustomers,
      estimatedBreakEvenWeeks: Math.ceil(breakEvenCustomers / customersAcquired),
      returnOnInvestment: roi,
      requiredNewCustomersToBreakEven: breakEvenCustomers,
      requiredConversionRateToBreakEven: breakEvenCustomers / params.weeklyTargetRecipients
    }
  };
} 