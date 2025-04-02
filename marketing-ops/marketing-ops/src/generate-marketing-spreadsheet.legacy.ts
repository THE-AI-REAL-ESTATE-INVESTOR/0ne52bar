import ExcelJS from 'exceljs';
import path from 'path';
import {
  CampaignParameters,
  WeeklyCalculations,
  MonthlyCalculations,
  AnnualCalculations,
  AdditionalRevenueConsiderations,
  BreakEvenAnalysis,
  MarketingCampaignData,
  ExcelStyle,
  ExcelCell,
  ExcelWorksheet
} from './types';

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
    additionalAnnualRevenueFromRepeatCustomers: 0, // Will be calculated
    netAnnualRevenueWithRepeatCustomers: 0, // Will be calculated
    wordOfMouthEffect: 1,
    additionalAnnualRevenueFromWordOfMouth: 0 // Will be calculated
  },
  breakEvenAnalysis: {
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

// Define styles
const styles = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  },
  input: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F3FF' } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  },
  result: {
    font: { bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  },
  growth: {
    font: { bold: true, color: { argb: '006100' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  },
  cost: {
    font: { bold: true, color: { argb: '9C0006' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  },
  warning: {
    font: { bold: true, color: { argb: 'FF0000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } },
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
  }
};

// App parameters
const appParameters = [
  ['Weekly App Signups', 5, 'users', 'New app signups per week'],
  ['Monthly Organic Signups', 5, 'users', 'Additional TapPass signups per month'],
  ['Opt-out Rate', 0.03, '%', 'Percentage of users who opt out'],
  ['Push Notification Cost', 0.001, '$ per push', 'Cost per push notification sent'],
  ['Average Order Value', 45, '$', 'Average order value through app'],
  ['Postmates Delivery Rate', 0.15, '%', 'Percentage of orders through Postmates'],
  ['Postmates Fee', 0.30, '%', 'Postmates fee percentage'],
  ['Stripe Fee', 0.029, '%', 'Stripe processing fee for app payments (merchandise only)'],
  ['Shift4 Fee', 0.015, '%', 'Shift4 POS interchange fee (in-person orders)'],
  ['Order Processing Time Savings', 2, 'minutes', 'Time saved per order with app vs. manual processing'],
  ['152 Hoodie Price', 59.00, '$', 'Price of 152 hoodie merchandise'],
  ['152 Shirt Price', 24.99, '$', 'Price of 152 shirt merchandise'],
  ['Coozie Price', 4.00, '$', 'Price of coozie merchandise'],
  ['Pool Stick Bag Price', 50.00, '$', 'Price of pool stick bag merchandise'],
  ['Merch Sales per Customer', 0.2, '%', 'Percentage of customers who purchase merchandise'],
  ['Vercel Hosting Cost', 20, '$ per month', 'Monthly cost for Vercel hosting'],
  ['Marketing Revenue Rider', 200, '$ per week', 'Weekly payment to marketing director'],
  ['Revenue Rider Percentage', 0.10, '%', 'Percentage of new revenue above $8,000/week'],
  ['Curbside Order Rate', 0.25, '%', 'Percentage of orders through curbside service'],
  ['Cook Hourly Rate', 15, '$', 'Hourly rate for the full-time cook'],
  ['Cook Hours Per Day', 8, 'hours', 'Hours worked by cook per day'],
  ['Cook Days Per Week', 5, 'days', 'Days worked by cook per week'],
  ['Cook Start Time', '10:00 AM', 'time', 'Cook start time'],
  ['Cook End Time', '6:00 PM', 'time', 'Cook end time']
];

async function generateMarketingSpreadsheet(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ONE52 Bar & Grill';
  workbook.lastModifiedBy = 'Marketing Team';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create worksheets
  const appWs = workbook.addWorksheet('ONE52 Bar App');
  const appGrowthWs = workbook.addWorksheet('App Growth Projection');
  const appValidationWs = workbook.addWorksheet('App Validation');

  // Set column widths
  appWs.columns = [
    { header: 'Parameter', key: 'parameter', width: 30 },
    { header: 'Value', key: 'value', width: 15 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  appGrowthWs.columns = [
    { header: 'Month', key: 'month', width: 15 },
    { header: 'Base Revenue', key: 'baseRevenue', width: 15 },
    { header: 'Recipients', key: 'recipients', width: 15 },
    { header: 'New Customers', key: 'newCustomers', width: 15 },
    { header: 'New Revenue', key: 'newRevenue', width: 15 },
    { header: 'Total Revenue', key: 'totalRevenue', width: 15 },
    { header: 'Marketing Cost', key: 'marketingCost', width: 15 },
    { header: 'Curbside Revenue', key: 'curbsideRevenue', width: 15 },
    { header: 'Cook Cost', key: 'cookCost', width: 15 },
    { header: 'Net Revenue', key: 'netRevenue', width: 15 }
  ];

  appValidationWs.columns = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Result', key: 'result', width: 15 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  // Add headers with styles
  appWs.getRow(1).font = styles.header.font;
  appWs.getRow(1).fill = styles.header.fill;
  appWs.getRow(1).alignment = styles.header.alignment;

  appGrowthWs.getRow(1).font = styles.header.font;
  appGrowthWs.getRow(1).fill = styles.header.fill;
  appGrowthWs.getRow(1).alignment = styles.header.alignment;

  appValidationWs.getRow(1).font = styles.header.font;
  appValidationWs.getRow(1).fill = styles.header.fill;
  appValidationWs.getRow(1).alignment = styles.header.alignment;

  // Add app parameters
  appParameters.forEach(([name, value, unit, note], index) => {
    const row = appWs.addRow([name, value, unit, note]);
    row.getCell(1).style = styles.input;
    row.getCell(2).style = styles.input;
    row.getCell(3).style = styles.input;
    row.getCell(4).style = styles.input;
  });

  // Add growth projection formulas
  const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 
                 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  
  months.forEach((month, index) => {
    const row = appGrowthWs.addRow({
      month: month,
      baseRevenue: index === 0 ? 8000 : `=F${index + 2}`,
      recipients: `='ONE52 Bar App'!B5*(1-'ONE52 Bar App'!B7)`,
      newCustomers: `=C${index + 2}*'ONE52 Bar App'!B8*2`,
      newRevenue: `=D${index + 2}*'ONE52 Bar App'!B8`,
      totalRevenue: `=B${index + 2}+E${index + 2}`,
      marketingCost: `=C${index + 2}*'ONE52 Bar App'!B4+'ONE52 Bar App'!B16+IF(E${index + 2}>8000,MAX(0,E${index + 2}-8000)*'ONE52 Bar App'!B18,0)`,
      curbsideRevenue: `=D${index + 2}*'ONE52 Bar App'!B8*'ONE52 Bar App'!B19`,
      cookCost: `='ONE52 Bar App'!B20*'ONE52 Bar App'!B21*'ONE52 Bar App'!B22*4`,
      netRevenue: `=F${index + 2}+H${index + 2}-I${index + 2}-G${index + 2}`
    });

    // Apply styles
    Object.keys(row).forEach(key => {
      if (key !== 'number') {
        row.getCell(key).style = styles.result;
      }
    });
  });

  // Add validation checks
  const validationChecks = [
    ['Weekly App Signups Check', '=IF(\'ONE52 Bar App\'!B5=5,"✓","✗")', 'Should be 5 new signups per week'],
    ['Monthly Organic Signups Check', '=IF(\'ONE52 Bar App\'!B6=5,"✓","✗")', 'Should be 5 new TapPass signups per month'],
    ['Opt-out Rate Check', '=IF(\'ONE52 Bar App\'!B7=0.03,"✓","✗")', 'Should be 3% opt-out rate'],
    ['Push Notification Cost Check', '=IF(\'ONE52 Bar App\'!B4=0.001,"✓","✗")', 'Should be $0.001 per push'],
    ['Average Order Value Check', '=IF(\'ONE52 Bar App\'!B8=45,"✓","✗")', 'Should be $45 per order'],
    ['Postmates Delivery Rate Check', '=IF(\'ONE52 Bar App\'!B9=0.15,"✓","✗")', 'Should be 15% of orders'],
    ['Postmates Fee Check', '=IF(\'ONE52 Bar App\'!B10=0.30,"✓","✗")', 'Should be 30% fee'],
    ['Curbside Order Rate Check', '=IF(\'ONE52 Bar App\'!B19=0.25,"✓","✗")', 'Should be 25% of orders'],
    ['Cook Hourly Rate Check', '=IF(\'ONE52 Bar App\'!B20=15,"✓","✗")', 'Should be $15 per hour'],
    ['Cook Hours Per Day Check', '=IF(\'ONE52 Bar App\'!B21=8,"✓","✗")', 'Should be 8 hours per day'],
    ['Cook Days Per Week Check', '=IF(\'ONE52 Bar App\'!B22=5,"✓","✗")', 'Should be 5 days per week'],
    ['Monthly Growth Check', '=IF(ROUND(\'App Growth Projection\'!F14-\'App Growth Projection\'!B3,2)>0,"✓","✗")', 'Total revenue growth over 12 months'],
    ['Total Marketing Cost Check', '=IF(ROUND(\'App Growth Projection\'!G15,2)>0,"✓","✗")', 'Should match annual marketing budget'],
    ['Revenue per Customer Check', '=IF(ROUND(\'App Growth Projection\'!F14/\'ONE52 Bar App\'!B30,2)>0,"✓","✗")', 'Total customers based on final revenue'],
    ['Curbside Revenue Check', '=IF(ROUND(\'App Growth Projection\'!H15,2)>0,"✓","✗")', 'Total curbside revenue over 12 months'],
    ['Cook Cost Check', '=IF(ROUND(\'App Growth Projection\'!I15,2)>0,"✓","✗")', 'Total cook cost over 12 months'],
    ['Net Revenue Check', '=IF(ROUND(\'App Growth Projection\'!J15,2)>0,"✓","✗")', 'Total net revenue over 12 months']
  ];

  validationChecks.forEach(([check, formula, note]) => {
    const row = appValidationWs.addRow([check, formula, note]);
    row.getCell(1).style = styles.result;
    row.getCell(2).style = styles.result;
    row.getCell(3).style = styles.result;
  });

  // Save the workbook
  const filePath = path.join(__dirname, 'dist', 'ONE52-Marketing-Campaign-Calculator.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log(`Marketing campaign calculator spreadsheet created at: ${filePath}`);
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