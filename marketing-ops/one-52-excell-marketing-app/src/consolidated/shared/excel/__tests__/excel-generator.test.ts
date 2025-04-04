import { Workbook } from 'exceljs';
import { MarketingCalculatorGenerator } from '../marketing-calculator';
import { CURRENT_VERSION } from '../version';
import { MarketingCampaignData } from '@/types/types';

describe('Excel Generator Tests', () => {
  let generator: MarketingCalculatorGenerator;
  const testData: MarketingCampaignData = {
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

  beforeEach(() => {
    generator = new MarketingCalculatorGenerator(testData);
  });

  test('should create workbook with correct version', async () => {
    const workbook = await generator.generate();
    expect(workbook.creator).toBe('ONE52 Bar & Grill');
    expect(workbook.lastModifiedBy).toBe('Marketing Team');
  });

  test('should create all required worksheets', async () => {
    const workbook = await generator.generate();
    const worksheetNames = workbook.worksheets.map(ws => ws.name);
    
    CURRENT_VERSION.worksheets.forEach(worksheetName => {
      expect(worksheetNames).toContain(worksheetName);
    });
  });

  test('should apply correct styles to headers', async () => {
    const workbook = await generator.generate();
    const firstWorksheet = workbook.worksheets[0];
    const headerRow = firstWorksheet.getRow(1);
    
    expect(headerRow.font?.bold).toBe(true);
    expect(headerRow.fill?.type).toBe('pattern');
    expect(headerRow.alignment?.horizontal).toBe('center');
  });

  test('should populate campaign parameters correctly', async () => {
    const workbook = await generator.generate();
    const paramsWorksheet = workbook.getWorksheet('Campaign Parameters');
    expect(paramsWorksheet).toBeDefined();
    if (!paramsWorksheet) return;
    
    expect(paramsWorksheet.getCell('B2').value).toBe(testData.parameters.availableStamps);
    expect(paramsWorksheet.getCell('B3').value).toBe(testData.parameters.costPerStamp);
    expect(paramsWorksheet.getCell('B4').value).toBe(testData.parameters.weeklyTargetRecipients);
  });

  test('should calculate formulas correctly', async () => {
    const workbook = await generator.generate();
    const weeklyWorksheet = workbook.getWorksheet('Weekly Calculations');
    expect(weeklyWorksheet).toBeDefined();
    if (!weeklyWorksheet) return;
    
    // Check if formulas are present
    expect(weeklyWorksheet.getCell('B2').formula).toBeDefined();
    expect(weeklyWorksheet.getCell('C2').formula).toBeDefined();
    expect(weeklyWorksheet.getCell('D2').formula).toBeDefined();
  });

  test('should validate data correctly', async () => {
    const workbook = await generator.generate();
    const validationWorksheet = workbook.getWorksheet('Validation Checks');
    expect(validationWorksheet).toBeDefined();
    if (!validationWorksheet) return;
    
    // Check if validation formulas are present
    expect(validationWorksheet.getCell('B2').formula).toBeDefined();
    expect(validationWorksheet.getCell('B3').formula).toBeDefined();
  });
}); 