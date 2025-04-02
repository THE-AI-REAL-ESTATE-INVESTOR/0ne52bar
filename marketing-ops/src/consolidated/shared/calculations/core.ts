import { z } from 'zod';
import {
  CampaignParameters,
  WeeklyCalculations,
  MonthlyCalculations,
  AnnualCalculations,
  AdditionalRevenueConsiderations,
  BreakEvenAnalysis,
  campaignParametersSchema,
  weeklyCalculationsSchema,
  monthlyCalculationsSchema,
  annualCalculationsSchema,
  additionalRevenueConsiderationsSchema,
  breakEvenAnalysisSchema,
} from '../types';

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
export function calculateBreakEven(
  parameters: CampaignParameters
): BreakEvenAnalysis {
  // Validate parameters
  const validatedParams = campaignParametersSchema.parse(parameters);

  // Extract parameters
  const { costPerStamp, weeklyTargetRecipients, averageCustomerValue } =
    validatedParams;

  // Calculate metrics
  const weeklyStampCost = weeklyTargetRecipients * costPerStamp;
  const requiredNewCustomersToBreakEven = weeklyStampCost / averageCustomerValue;
  const requiredConversionRateToBreakEven =
    requiredNewCustomersToBreakEven / weeklyTargetRecipients;

  // Create result object
  const result: BreakEvenAnalysis = {
    requiredNewCustomersToBreakEven,
    requiredConversionRateToBreakEven,
  };

  // Validate result
  return breakEvenAnalysisSchema.parse(result);
}

/**
 * Calculates additional revenue considerations based on campaign parameters and annual calculations
 * @param parameters Campaign parameters
 * @param annualCalculations Annual calculations
 * @param repeatCustomerRate Rate of repeat customers (0-1)
 * @param repeatVisitsPerCustomer Average number of visits per customer
 * @param wordOfMouthEffect Word of mouth effect multiplier
 * @returns Additional revenue considerations
 */
export function calculateAdditionalRevenue(
  parameters: CampaignParameters,
  annualCalculations: AnnualCalculations,
  repeatCustomerRate: number,
  repeatVisitsPerCustomer: number,
  wordOfMouthEffect: number
): AdditionalRevenueConsiderations {
  // Validate parameters
  const validatedParams = campaignParametersSchema.parse(parameters);
  const validatedAnnual = annualCalculationsSchema.parse(annualCalculations);

  // Extract parameters
  const { averageCustomerValue } = validatedParams;
  const { newCustomers } = validatedAnnual;

  // Calculate metrics
  const repeatCustomers = newCustomers * repeatCustomerRate;
  const additionalAnnualRevenueFromRepeatCustomers =
    repeatCustomers * repeatVisitsPerCustomer * averageCustomerValue;
  const netAnnualRevenueWithRepeatCustomers =
    validatedAnnual.netAnnualRevenue + additionalAnnualRevenueFromRepeatCustomers;
  const additionalAnnualRevenueFromWordOfMouth =
    newCustomers * wordOfMouthEffect * averageCustomerValue;

  // Create result object
  const result: AdditionalRevenueConsiderations = {
    repeatCustomerRate,
    repeatVisitsPerCustomer,
    additionalAnnualRevenueFromRepeatCustomers,
    netAnnualRevenueWithRepeatCustomers,
    wordOfMouthEffect,
    additionalAnnualRevenueFromWordOfMouth,
  };

  // Validate result
  return additionalRevenueConsiderationsSchema.parse(result);
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
  const breakEvenAnalysis = calculateBreakEven(parameters);
  const additionalRevenueConsiderations = calculateAdditionalRevenue(
    parameters,
    annualCalculations,
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