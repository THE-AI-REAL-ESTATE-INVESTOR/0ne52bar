
import ExcelJS from 'exceljs';
import path from 'path';
import {
  CampaignParameters,
  WeeklyCalculations,
  MonthlyCalculations,
  AnnualCalculations,
  AdditionalRevenue,
  BreakEvenAnalysis,
  MarketingCampaignData,
  ExcelStyle,
  ExcelCell,
  ExcelWorksheet,
  AppParameter,
  GrowthMetric,
  ValidationCheck
} from '@/types/types';

// Define the marketing campaign data
const campaignData: MarketingCampaignData = {
  parameters: {
    availableStamps: 2000,
    costPerStamp: 0.56,
    weeklyTargetRecipients: 500,
    conversionRate: 0.0005, // 0.05%
    currentWeeklyRevenue: 8000,
    averageCustomerValue: 50
  },
  weeklyCalculations: {
    recipients: 0, // Will be calculated
    newCustomers: 0, // Will be calculated
    weeklyRevenueFromNewCustomers: 0, // Will be calculated
    totalWeeklyRevenueWithNewCustomers: 0, // Will be calculated
    weeklyStampCost: 0, // Will be calculated
    netWeeklyRevenue: 0 // Will be calculated
  },
  monthlyCalculations: {
    recipients: 0, // Will be calculated
    newCustomers: 0, // Will be calculated
    monthlyRevenueFromNewCustomers: 0, // Will be calculated
    totalMonthlyRevenueWithNewCustomers: 0, // Will be calculated
    monthlyStampCost: 0, // Will be calculated
    netMonthlyRevenue: 0 // Will be calculated
  },
  annualCalculations: {
    recipients: 0, // Will be calculated
    newCustomers: 0, // Will be calculated
    annualRevenueFromNewCustomers: 0, // Will be calculated
    totalAnnualRevenueWithNewCustomers: 0, // Will be calculated
    annualStampCost: 0, // Will be calculated
    netAnnualRevenue: 0 // Will be calculated
  },
  additionalRevenueConsiderations: {
    repeatCustomerRate: 0.5, // 50%
    repeatVisitsPerCustomer: 3,
    averageSpendIncrease: 0.1, // 10%
    wordOfMouthReferrals: 2,
    referralConversionRate: 0.3, // 30%
    socialMediaShares: 5,
    socialMediaConversionRate: 0.1, // 10%
    additionalAnnualRevenueFromRepeatCustomers: 0, // Will be calculated
    netAnnualRevenueWithRepeatCustomers: 0, // Will be calculated
    wordOfMouthEffect: 1,
    additionalAnnualRevenueFromWordOfMouth: 0 // Will be calculated
  },
  breakEvenAnalysis: {
    totalMarketingCost: 0, // Will be calculated
    revenuePerCustomer: 50,
    customersNeededForBreakEven: 0, // Will be calculated
    estimatedBreakEvenWeeks: 0, // Will be calculated
    returnOnInvestment: 0, // Will be calculated
    requiredNewCustomersToBreakEven: 0, // Will be calculated
    requiredConversionRateToBreakEven: 0 // Will be calculated
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
  data.breakEvenAnalysis.requiredNewCustomersToBreakEven = data.annualCalculations.annualStampCost / data.parameters.averageCustomerValue;
  data.breakEvenAnalysis.requiredConversionRateToBreakEven = data.breakEvenAnalysis.requiredNewCustomersToBreakEven / data.annualCalculations.recipients;

  return data;
}

// Define styles with correct ExcelJS types
const styles = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: '4F81BD' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const }
  },
  input: {
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'E6F3FF' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const }
  },
  result: {
    font: { bold: true },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'F2F2F2' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const }
  },
  growth: {
    font: { bold: true, color: { argb: '006100' } },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'C6EFCE' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const }
  },
  cost: {
    font: { bold: true, color: { argb: '9C0006' } },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFC7CE' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const }
  },
  warning: {
    font: { bold: true, color: { argb: 'FF0000' } },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFCC' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  }
};

// App parameters with their values and units
const appParameters = [
  { name: 'Weekly App Signups', value: 100, unit: 'number' },
  { name: 'Monthly Organic Signups', value: 50, unit: 'number' },
  { name: 'Opt-out Rate', value: 0.15, unit: 'percentage' },
  { name: 'Push Notification Cost', value: 0.02, unit: 'currency' },
  { name: 'Average Order Value', value: 25, unit: 'currency' },
  { name: 'Postmates Delivery Rate', value: 0.30, unit: 'percentage' },
  { name: 'Postmates Fee', value: 0.15, unit: 'percentage' },
  { name: 'Monthly Growth', value: 0.10, unit: 'percentage' },
  { name: 'Total Marketing Cost', value: 5000, unit: 'currency' },
  { name: 'Revenue per Customer', value: 75, unit: 'currency' },
  { name: 'Curbside Order Rate', value: 0.25, unit: 'percentage' },
  { name: 'Cook Hourly Rate', value: 15, unit: 'currency' },
  { name: 'Cook Hours Per Day', value: 8, unit: 'number' },
  { name: 'Cook Days Per Week', value: 5, unit: 'number' },
  { name: 'Cook Start Time', value: '10:00', unit: 'time' },
  { name: 'Cook End Time', value: '18:00', unit: 'time' }
];

async function generateMarketingSpreadsheet(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ONE52 Bar & Grill';
  workbook.lastModifiedBy = 'ONE52 Bar & Grill';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create worksheets
  const appWs = workbook.addWorksheet('ONE52 Bar App');
  const growthWs = workbook.addWorksheet('App Growth Projection');
  const validationWs = workbook.addWorksheet('App Validation');

  // Set column widths
  appWs.getColumn(1).width = 30;
  appWs.getColumn(2).width = 15;
  appWs.getColumn(3).width = 15;

  growthWs.getColumn(1).width = 30;
  growthWs.getColumn(2).width = 15;
  growthWs.getColumn(3).width = 15;
  growthWs.getColumn(4).width = 15;
  growthWs.getColumn(5).width = 15;

  validationWs.getColumn(1).width = 30;
  validationWs.getColumn(2).width = 15;
  validationWs.getColumn(3).width = 15;

  // Add headers to ONE52 Bar App worksheet
  appWs.addRow(['Parameter', 'Value', 'Unit']);
  appWs.getRow(1).font = styles.header.font;
  appWs.getRow(1).fill = styles.header.fill;
  appWs.getRow(1).alignment = styles.header.alignment;

  // Add app parameters
  appParameters.forEach((param, index) => {
    const row = appWs.addRow([param.name, param.value, param.unit]);
    row.getCell(2).style = styles.input;
    row.getCell(3).style = styles.input;
  });

  // Add headers to App Growth Projection worksheet
  growthWs.addRow(['Metric', 'Month 1', 'Month 2', 'Month 3', 'Month 4']);
  growthWs.getRow(1).font = styles.header.font;
  growthWs.getRow(1).fill = styles.header.fill;
  growthWs.getRow(1).alignment = styles.header.alignment;

  // Add growth projection formulas
  const growthMetrics = [
    { name: 'Recipients', formula: '=B5+B7' },
    { name: 'New Customers', formula: '=B8*(1-B9)' },
    { name: 'New Revenue', formula: '=B10*B11' },
    { name: 'Marketing Cost', formula: '=B4' },
    { name: 'Curbside Revenue', formula: '=B12*B13*B14' },
    { name: 'Cook Cost', formula: '=B15*B16*B17*4' },
    { name: 'Net Revenue', formula: '=B12+B18-B19-B20' }
  ];

  growthMetrics.forEach((metric, index) => {
    const row = growthWs.addRow([metric.name]);
    for (let i = 2; i <= 5; i++) {
      const cell = row.getCell(i);
      cell.value = { formula: metric.formula.replace('B', String.fromCharCode(64 + i)) };
      cell.style = styles.result;
    }
  });

  // Add headers to App Validation worksheet
  validationWs.addRow(['Validation Check', 'Expected', 'Actual']);
  validationWs.getRow(1).font = styles.header.font;
  validationWs.getRow(1).fill = styles.header.fill;
  validationWs.getRow(1).alignment = styles.header.alignment;

  // Add validation checks
  const validationChecks = [
    { name: 'Weekly App Signups', expected: 100, formula: '=B5' },
    { name: 'Monthly Organic Signups', expected: 50, formula: '=B7' },
    { name: 'Opt-out Rate', expected: 0.15, formula: '=B9' },
    { name: 'Push Notification Cost', expected: 0.02, formula: '=B10' },
    { name: 'Average Order Value', expected: 25, formula: '=B11' },
    { name: 'Postmates Delivery Rate', expected: 0.30, formula: '=B12' },
    { name: 'Postmates Fee', expected: 0.15, formula: '=B13' },
    { name: 'Monthly Growth', expected: 0.10, formula: '=B14' },
    { name: 'Total Marketing Cost', expected: 5000, formula: '=B15' },
    { name: 'Revenue per Customer', expected: 75, formula: '=B16' },
    { name: 'Curbside Order Rate', expected: 0.25, formula: '=B17' },
    { name: 'Cook Hourly Rate', expected: 15, formula: '=B18' },
    { name: 'Cook Hours Per Day', expected: 8, formula: '=B19' },
    { name: 'Cook Days Per Week', expected: 5, formula: '=B20' }
  ];

  validationChecks.forEach((check, index) => {
    const row = validationWs.addRow([check.name, check.expected, { formula: check.formula }]);
    row.getCell(2).style = styles.input;
    row.getCell(3).style = styles.input;
  });

  // Save the workbook
  const outputPath = path.join(__dirname, 'dist', 'ONE52-Marketing-Campaign-Calculator.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Marketing campaign calculator spreadsheet created at: ${outputPath}`);
}

// Main function
async function main(): Promise<void> {
  try {
    await generateMarketingSpreadsheet();
  } catch (error) {
    console.error('Error generating spreadsheet:', error);
    process.exit(1);
  }
}

// Run the main function
main();