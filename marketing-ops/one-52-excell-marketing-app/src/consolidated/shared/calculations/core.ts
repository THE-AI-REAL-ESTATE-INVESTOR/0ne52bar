import { z } from 'zod';
import {
  CampaignParameters,
  WeeklyCalculations,
  MonthlyCalculations,
  AnnualCalculations,
  AdditionalRevenue,
  BreakEvenAnalysis,
  MarketingCampaignData,
  campaignParametersSchema,
  weeklyCalculationsSchema,
  monthlyCalculationsSchema,
  annualCalculationsSchema,
  additionalRevenueSchema,
  breakEvenAnalysisSchema,
  marketingCampaignDataSchema
} from '../../../types/types';

/**
 * Calculates weekly metrics based on campaign parameters
 * @param parameters Campaign parameters
 * @returns Weekly calculations
 */
export function calculateWeeklyMetrics(
  parameters: CampaignParameters
): WeeklyCalculations {
  // Validate parameters
  const validatedParams = campaignParametersSchema.parse(parameters);

  // Extract parameters
  const {
    availableStamps,
    costPerStamp,
    weeklyTargetRecipients,
    conversionRate,
    currentWeeklyRevenue,
    averageCustomerValue,
  } = validatedParams;

  // Calculate metrics
  const recipients = Math.min(availableStamps, weeklyTargetRecipients);
  const newCustomers = recipients * conversionRate;
  const weeklyRevenueFromNewCustomers = newCustomers * averageCustomerValue;
  const totalWeeklyRevenueWithNewCustomers =
    currentWeeklyRevenue + weeklyRevenueFromNewCustomers;
  const weeklyStampCost = recipients * costPerStamp;
  const netWeeklyRevenue =
    totalWeeklyRevenueWithNewCustomers - weeklyStampCost;

  // Create result object
  const result: WeeklyCalculations = {
    recipients,
    newCustomers,
    weeklyRevenueFromNewCustomers,
    totalWeeklyRevenueWithNewCustomers,
    weeklyStampCost,
    netWeeklyRevenue,
  };

  // Validate result
  return weeklyCalculationsSchema.parse(result);
}

/**
 * Calculates monthly metrics based on campaign parameters
 * @param parameters Campaign parameters
 * @returns Monthly calculations
 */
export function calculateMonthlyMetrics(
  parameters: CampaignParameters
): MonthlyCalculations {
  // Validate parameters
  const validatedParams = campaignParametersSchema.parse(parameters);

  // Extract parameters
  const {
    availableStamps,
    costPerStamp,
    weeklyTargetRecipients,
    conversionRate,
    currentWeeklyRevenue,
    averageCustomerValue,
  } = validatedParams;

  // Calculate metrics (assuming 4 weeks per month)
  const recipients = Math.min(availableStamps, weeklyTargetRecipients * 4);
  const newCustomers = recipients * conversionRate;
  const monthlyRevenueFromNewCustomers = newCustomers * averageCustomerValue;
  const totalMonthlyRevenueWithNewCustomers =
    currentWeeklyRevenue * 4 + monthlyRevenueFromNewCustomers;
  const monthlyStampCost = recipients * costPerStamp;
  const netMonthlyRevenue =
    totalMonthlyRevenueWithNewCustomers - monthlyStampCost;

  // Create result object
  const result: MonthlyCalculations = {
    recipients,
    newCustomers,
    monthlyRevenueFromNewCustomers,
    totalMonthlyRevenueWithNewCustomers,
    monthlyStampCost,
    netMonthlyRevenue,
  };

  // Validate result
  return monthlyCalculationsSchema.parse(result);
}

/**
 * Calculates annual metrics based on campaign parameters
 * @param parameters Campaign parameters
 * @returns Annual calculations
 */
export function calculateAnnualMetrics(
  parameters: CampaignParameters
): AnnualCalculations {
  // Validate parameters
  const validatedParams = campaignParametersSchema.parse(parameters);

  // Extract parameters
  const {
    availableStamps,
    costPerStamp,
    weeklyTargetRecipients,
    conversionRate,
    currentWeeklyRevenue,
    averageCustomerValue,
  } = validatedParams;

  // Calculate metrics (assuming 52 weeks per year)
  const recipients = Math.min(availableStamps, weeklyTargetRecipients * 52);
  const newCustomers = recipients * conversionRate;
  const annualRevenueFromNewCustomers = newCustomers * averageCustomerValue;
  const totalAnnualRevenueWithNewCustomers =
    currentWeeklyRevenue * 52 + annualRevenueFromNewCustomers;
  const annualStampCost = recipients * costPerStamp;
  const netAnnualRevenue =
    totalAnnualRevenueWithNewCustomers - annualStampCost;

  // Create result object
  const result: AnnualCalculations = {
    recipients,
    newCustomers,
    annualRevenueFromNewCustomers,
    totalAnnualRevenueWithNewCustomers,
    annualStampCost,
    netAnnualRevenue,
  };

  // Validate result
  return annualCalculationsSchema.parse(result);
}

/**
 * Calculates break-even analysis based on campaign parameters
 * @param parameters Campaign parameters
 * @returns Break-even analysis
 */
export function calculateBreakEvenAnalysis(
  parameters: CampaignParameters
): BreakEvenAnalysis {
  const totalMarketingCost = parameters.availableStamps * parameters.costPerStamp;
  const revenuePerCustomer = parameters.averageCustomerValue;
  const customersNeededForBreakEven = Math.ceil(totalMarketingCost / revenuePerCustomer);
  const estimatedBreakEvenWeeks = Math.ceil(customersNeededForBreakEven / (parameters.weeklyTargetRecipients * parameters.conversionRate));
  const returnOnInvestment = ((customersNeededForBreakEven * revenuePerCustomer) - totalMarketingCost) / totalMarketingCost;
  
  const result: BreakEvenAnalysis = {
    totalMarketingCost,
    revenuePerCustomer,
    customersNeededForBreakEven,
    estimatedBreakEvenWeeks,
    returnOnInvestment,
    requiredNewCustomersToBreakEven: customersNeededForBreakEven,
    requiredConversionRateToBreakEven: customersNeededForBreakEven / parameters.weeklyTargetRecipients
  };

  return breakEvenAnalysisSchema.parse(result);
}

/**
 * Calculates additional revenue considerations based on campaign parameters and annual calculations
 * @param parameters Campaign parameters
 * @param repeatCustomerRate Rate of repeat customers (0-1)
 * @param repeatVisitsPerCustomer Average number of visits per customer
 * @param wordOfMouthEffect Word of mouth effect multiplier
 * @returns Additional revenue considerations
 */
export function calculateAdditionalRevenue(
  parameters: CampaignParameters,
  repeatCustomerRate: number,
  repeatVisitsPerCustomer: number,
  wordOfMouthEffect: number
): AdditionalRevenue {
  const validatedParams = campaignParametersSchema.parse(parameters);
  const { weeklyTargetRecipients, conversionRate, averageCustomerValue } = validatedParams;

  const newCustomers = weeklyTargetRecipients * conversionRate;
  const annualNewCustomers = newCustomers * 52;
  const baseAnnualRevenue = annualNewCustomers * averageCustomerValue;

  const averageSpendIncrease = 0.15; // 15% increase in spending per repeat visit
  const wordOfMouthReferrals = 2; // Each customer refers 2 others on average
  const referralConversionRate = 0.25; // 25% of referrals convert
  const socialMediaShares = 10; // Each customer shares on social media 10 times
  const socialMediaConversionRate = 0.1; // 10% of social media shares convert

  const additionalAnnualRevenueFromRepeatCustomers = baseAnnualRevenue * repeatCustomerRate * repeatVisitsPerCustomer * (1 + averageSpendIncrease);
  const netAnnualRevenueWithRepeatCustomers = baseAnnualRevenue + additionalAnnualRevenueFromRepeatCustomers;
  const additionalAnnualRevenueFromWordOfMouth = baseAnnualRevenue * wordOfMouthEffect;

  const result: AdditionalRevenue = {
    repeatCustomerRate,
    repeatVisitsPerCustomer,
    averageSpendIncrease,
    wordOfMouthReferrals,
    referralConversionRate,
    socialMediaShares,
    socialMediaConversionRate,
    additionalAnnualRevenueFromRepeatCustomers,
    netAnnualRevenueWithRepeatCustomers,
    wordOfMouthEffect,
    additionalAnnualRevenueFromWordOfMouth
  };

  return additionalRevenueSchema.parse(result);
}

/**
 * Calculates all marketing metrics based on campaign parameters
 * @param parameters Campaign parameters
 * @param repeatCustomerRate Rate of repeat customers (0-1)
 * @param repeatVisitsPerCustomer Average number of visits per customer
 * @param wordOfMouthEffect Word of mouth effect multiplier
 * @returns Object containing all calculations
 */
export function calculateAllMetrics(
  parameters: CampaignParameters,
  repeatCustomerRate: number = 0.3,
  repeatVisitsPerCustomer: number = 2,
  wordOfMouthEffect: number = 0.5
) {
  // Calculate core metrics
  const weeklyCalculations = calculateWeeklyMetrics(parameters);
  const monthlyCalculations = calculateMonthlyMetrics(parameters);
  const annualCalculations = calculateAnnualMetrics(parameters);
  const breakEvenAnalysis = calculateBreakEvenAnalysis(parameters);
  const additionalRevenueConsiderations = calculateAdditionalRevenue(
    parameters,
    repeatCustomerRate,
    repeatVisitsPerCustomer,
    wordOfMouthEffect
  );

  // Return all calculations
  return {
    weeklyCalculations,
    monthlyCalculations,
    annualCalculations,
    breakEvenAnalysis,
    additionalRevenueConsiderations,
  };
} 