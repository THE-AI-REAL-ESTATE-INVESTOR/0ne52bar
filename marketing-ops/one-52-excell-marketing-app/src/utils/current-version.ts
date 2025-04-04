/**
 * CURRENT IMPLEMENTATION
 * This is the main spreadsheet generator for marketing analysis
 * Handles both direct mail and app marketing calculations
 * Last updated: 2024-04-03
 */

import ExcelJS from 'exceljs';
import { dirname, join } from 'path';
import { MarketingCampaignData, AppParameter } from '@/types/types';
import type { Fill, Alignment, Style, Font } from 'exceljs';
import { fileURLToPath } from 'url';
import { campaignData as configCampaignData, styles as configStyles, appParameters as configAppParameters } from '@/config';
import { appParameters as configAppParams, growthMetrics as configGrowthMetrics, validationChecks as configValidationChecks } from '@/exceljs/config/constants';
import { styles as excelStyles } from '@/exceljs/config/styles';
import { generateMarketingSpreadsheet } from '../versions/generate-marketing-spreadsheet.v0.5';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the marketing campaign data using config
const campaignData: MarketingCampaignData = {
  ...configCampaignData,
  // Override specific values if needed
  parameters: {
    ...configCampaignData.parameters,
    conversionRate: 0.0005 // 0.05% - specific to this version
  }
};

// Calculate all the values
function calculateMarketingCampaignData(data: MarketingCampaignData): MarketingCampaignData {
  // Weekly calculations
  data.weeklyCalculations.recipients = data.parameters.weeklyTargetRecipients;
  data.weeklyCalculations.newCustomers = data.weeklyCalculations.recipients * data.parameters.conversionRate;
  data.weeklyCalculations.weeklyRevenueFromNewCustomers = data.weeklyCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.weeklyCalculations.totalWeeklyRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue + data.weeklyCalculations.weeklyRevenueFromNewCustomers;
  data.weeklyCalculations.weeklyStampCost = data.weeklyCalculations.recipients * data.parameters.costPerStamp;
  data.weeklyCalculations.netWeeklyRevenue = data.weeklyCalculations.totalWeeklyRevenueWithNewCustomers - data.weeklyCalculations.weeklyStampCost;

  // Monthly calculations
  data.monthlyCalculations.recipients = data.parameters.weeklyTargetRecipients * 4;
  data.monthlyCalculations.newCustomers = data.monthlyCalculations.recipients * data.parameters.conversionRate;
  data.monthlyCalculations.monthlyRevenueFromNewCustomers = data.monthlyCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.monthlyCalculations.totalMonthlyRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue * 4 + data.monthlyCalculations.monthlyRevenueFromNewCustomers;
  data.monthlyCalculations.monthlyStampCost = data.monthlyCalculations.recipients * data.parameters.costPerStamp;
  data.monthlyCalculations.netMonthlyRevenue = data.monthlyCalculations.totalMonthlyRevenueWithNewCustomers - data.monthlyCalculations.monthlyStampCost;

  // Annual calculations
  data.annualCalculations.recipients = data.parameters.weeklyTargetRecipients * 52;
  data.annualCalculations.newCustomers = data.annualCalculations.recipients * data.parameters.conversionRate;
  data.annualCalculations.annualRevenueFromNewCustomers = data.annualCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.annualCalculations.totalAnnualRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue * 52 + data.annualCalculations.annualRevenueFromNewCustomers;
  data.annualCalculations.annualStampCost = data.annualCalculations.recipients * data.parameters.costPerStamp;
  data.annualCalculations.netAnnualRevenue = data.annualCalculations.totalAnnualRevenueWithNewCustomers - data.annualCalculations.annualStampCost;

  // Additional revenue considerations
  data.additionalRevenueConsiderations.additionalAnnualRevenueFromRepeatCustomers = 
    data.annualCalculations.newCustomers * 
    data.additionalRevenueConsiderations.repeatVisitsPerCustomer * 
    data.parameters.averageCustomerValue * 
    data.additionalRevenueConsiderations.repeatCustomerRate;
  
  data.additionalRevenueConsiderations.netAnnualRevenueWithRepeatCustomers = 
    data.annualCalculations.netAnnualRevenue + 
    data.additionalRevenueConsiderations.additionalAnnualRevenueFromRepeatCustomers;
  
  data.additionalRevenueConsiderations.additionalAnnualRevenueFromWordOfMouth = 
    data.annualCalculations.newCustomers * 
    data.additionalRevenueConsiderations.wordOfMouthEffect * 
    data.parameters.averageCustomerValue;

  // Break-even analysis
  data.breakEvenAnalysis.totalMarketingCost = data.annualCalculations.annualStampCost;
  data.breakEvenAnalysis.revenuePerCustomer = data.parameters.averageCustomerValue;
  data.breakEvenAnalysis.customersNeededForBreakEven = Math.ceil(data.breakEvenAnalysis.totalMarketingCost / data.parameters.averageCustomerValue);
  data.breakEvenAnalysis.estimatedBreakEvenWeeks = Math.ceil(data.breakEvenAnalysis.totalMarketingCost / (data.parameters.averageCustomerValue * data.parameters.conversionRate * data.parameters.weeklyTargetRecipients));
  data.breakEvenAnalysis.returnOnInvestment = data.annualCalculations.netAnnualRevenue / data.breakEvenAnalysis.totalMarketingCost;
  data.breakEvenAnalysis.requiredNewCustomersToBreakEven = Math.ceil(data.breakEvenAnalysis.totalMarketingCost / data.parameters.averageCustomerValue);
  data.breakEvenAnalysis.requiredConversionRateToBreakEven = data.breakEvenAnalysis.totalMarketingCost / (data.parameters.averageCustomerValue * data.parameters.weeklyTargetRecipients * 52);

  return data;
}

// Use styles from config with type safety
interface CellStyle {
  font: Partial<Font>;
  fill: Fill;
  alignment: Partial<Alignment>;
}

const styles = {
  header: excelStyles.header as CellStyle,
  input: excelStyles.input as CellStyle,
  result: excelStyles.result as CellStyle,
  growth: excelStyles.growth as CellStyle,
  cost: excelStyles.cost as CellStyle,
  warning: excelStyles.warning as CellStyle
};

// Use app parameters from config
const appParameters = configAppParams;
const growthMetrics = configGrowthMetrics;
const validationChecks = configValidationChecks;

// Export the imported generateMarketingSpreadsheet function
export { generateMarketingSpreadsheet };

// Main function to run the spreadsheet generation
async function main(): Promise<void> {
  try {
    await generateMarketingSpreadsheet();
    console.log('Marketing spreadsheet generated successfully!');
  } catch (error) {
    console.error('Error generating marketing spreadsheet:', error);
    throw error;
  }
}

// Run the main function if this is the entry point
if (import.meta.url === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}