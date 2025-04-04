import { MarketingCalculatorGenerator } from './marketing-calculator';
import { MarketingCampaignData } from '@/types/types';

const sampleData: MarketingCampaignData = {
  parameters: {
    availableStamps: 10000,
    costPerStamp: 0.50,
    weeklyTargetRecipients: 1000,
    conversionRate: 0.02,
    currentWeeklyRevenue: 50000,
    averageCustomerValue: 100
  },
  weeklyCalculations: {
    recipients: 1000,
    newCustomers: 20,
    weeklyRevenueFromNewCustomers: 2000,
    totalWeeklyRevenueWithNewCustomers: 52000,
    weeklyStampCost: 500,
    netWeeklyRevenue: 51500
  },
  monthlyCalculations: {
    recipients: 4000,
    newCustomers: 80,
    monthlyRevenueFromNewCustomers: 8000,
    totalMonthlyRevenueWithNewCustomers: 208000,
    monthlyStampCost: 2000,
    netMonthlyRevenue: 206000
  },
  annualCalculations: {
    recipients: 48000,
    newCustomers: 960,
    annualRevenueFromNewCustomers: 96000,
    totalAnnualRevenueWithNewCustomers: 2496000,
    annualStampCost: 24000,
    netAnnualRevenue: 2472000
  },
  additionalRevenueConsiderations: {
    repeatCustomerRate: 0.3,
    repeatVisitsPerCustomer: 4,
    averageSpendIncrease: 0.15,
    wordOfMouthReferrals: 2,
    referralConversionRate: 0.25,
    socialMediaShares: 10,
    socialMediaConversionRate: 0.1,
    additionalAnnualRevenueFromRepeatCustomers: 259200,
    netAnnualRevenueWithRepeatCustomers: 2731200,
    wordOfMouthEffect: 0.1,
    additionalAnnualRevenueFromWordOfMouth: 172800
  },
  breakEvenAnalysis: {
    totalMarketingCost: 24000,
    revenuePerCustomer: 100,
    customersNeededForBreakEven: 240,
    estimatedBreakEvenWeeks: 12,
    returnOnInvestment: 0.2,
    requiredNewCustomersToBreakEven: 240,
    requiredConversionRateToBreakEven: 0.005
  }
};

async function generateSpreadsheet() {
  const generator = new MarketingCalculatorGenerator(sampleData);
  const workbook = await generator.generate();
  await workbook.xlsx.writeFile('marketing-calculator.xlsx');
  console.log('Spreadsheet generated successfully at marketing-calculator.xlsx');
  console.log('Please open the spreadsheet and input your values in the Campaign Parameters sheet.');
}

generateSpreadsheet().catch(console.error); 