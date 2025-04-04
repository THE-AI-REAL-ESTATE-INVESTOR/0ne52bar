/**
 * CURRENT IMPLEMENTATION
 * VERSION 1.1
 * This is the main spreadsheet generator for marketing analysis
 * Handles both direct mail and app marketing calculations
 * Last updated: 2024-04-04
 */

import ExcelJS from 'exceljs';
import path from 'path';
import { MarketingCampaignData } from '@/types/types';
import { Fill, Style, Alignment } from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { styles, campaignData, appParameters, growthMetrics, AppParameter } from '@/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function generateMarketingSpreadsheet(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ONE52 Bar & Grill';
  workbook.lastModifiedBy = 'Marketing Team';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Calculate campaign data
  const data = calculateMarketingCampaignData(campaignData);

  // Create worksheets
  const directMailParamsWs = workbook.addWorksheet('Direct Mail Parameters');
  const directMailGrowthWs = workbook.addWorksheet('Direct Mail Growth Projection');
  const directMailValidationWs = workbook.addWorksheet('Direct Mail Validation');
  const appWs = workbook.addWorksheet('ONE52 Bar App');
  const appGrowthWs = workbook.addWorksheet('App Growth Projection');
  const appValidationWs = workbook.addWorksheet('App Validation');
  const combinedGrowthWs = workbook.addWorksheet('Combined Growth Projection');

  // Set up Direct Mail Parameters worksheet with styling
  const directMailColumns = [
    { header: 'Parameter', key: 'parameter', width: 30 },
    { header: 'Value', key: 'value', width: 15 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  directMailParamsWs.columns = directMailColumns;
  directMailParamsWs.getRow(1).font = styles.header.font;
  directMailParamsWs.getRow(1).fill = styles.header.fill;
  directMailParamsWs.getRow(1).alignment = styles.header.alignment;

  // Add Direct Mail Parameters
  const directMailParams = [
    ['Available Stamps', data.parameters.availableStamps, 'stamps', 'Total stamps available for campaign'],
    ['Cost per Stamp', data.parameters.costPerStamp, '$', 'Cost per stamp including printing'],
    ['Weekly Target Recipients', data.parameters.weeklyTargetRecipients, 'recipients', 'Number of recipients per week'],
    ['Conversion Rate', data.parameters.conversionRate * 100, '%', 'Expected conversion rate'],
    ['Current Weekly Revenue', data.parameters.currentWeeklyRevenue, '$', 'Current weekly revenue before campaign'],
    ['Average Customer Value', data.parameters.averageCustomerValue, '$', 'Average revenue per customer']
  ];

  directMailParams.forEach(([name, value, unit, note]) => {
    const row = directMailParamsWs.addRow([name, value, unit, note]);
    row.getCell(1).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(2).style = { ...styles.result, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(3).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(4).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
  });

  // Set up Direct Mail Growth Projection worksheet with styling
  const directMailGrowthColumns = [
    { header: 'Week', key: 'week', width: 15 },
    { header: 'Recipients', key: 'recipients', width: 15 },
    { header: 'New Customers', key: 'newCustomers', width: 15 },
    { header: 'Revenue', key: 'revenue', width: 15 },
    { header: 'Cost', key: 'cost', width: 15 },
    { header: 'Net Revenue', key: 'netRevenue', width: 15 }
  ];

  directMailGrowthWs.columns = directMailGrowthColumns;
  directMailGrowthWs.getRow(1).font = styles.header.font;
  directMailGrowthWs.getRow(1).fill = styles.header.fill;
  directMailGrowthWs.getRow(1).alignment = styles.header.alignment;

  // Add weekly projections
  for (let week = 1; week <= 52; week++) {
    const row = directMailGrowthWs.addRow({
      week: `Week ${week}`,
      recipients: data.weeklyCalculations.recipients,
      newCustomers: data.weeklyCalculations.newCustomers,
      revenue: data.weeklyCalculations.weeklyRevenueFromNewCustomers,
      cost: data.weeklyCalculations.weeklyStampCost,
      netRevenue: data.weeklyCalculations.netWeeklyRevenue
    });
    row.eachCell(cell => cell.style = styles.result);
  }

  // Add monthly and annual summaries
  directMailGrowthWs.addRow({});
  directMailGrowthWs.addRow({
    week: 'Monthly Average',
    recipients: data.monthlyCalculations.recipients / 4,
    newCustomers: data.monthlyCalculations.newCustomers / 4,
    revenue: data.monthlyCalculations.monthlyRevenueFromNewCustomers / 4,
    cost: data.monthlyCalculations.monthlyStampCost / 4,
    netRevenue: data.monthlyCalculations.netMonthlyRevenue / 4
  }).eachCell(cell => cell.style = styles.growth);

  directMailGrowthWs.addRow({
    week: 'Annual Total',
    recipients: data.annualCalculations.recipients,
    newCustomers: data.annualCalculations.newCustomers,
    revenue: data.annualCalculations.annualRevenueFromNewCustomers,
    cost: data.annualCalculations.annualStampCost,
    netRevenue: data.annualCalculations.netAnnualRevenue
  }).eachCell(cell => cell.style = styles.growth);

  // Set up Direct Mail Validation worksheet with styling
  const directMailValidationColumns = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Result', key: 'result', width: 15 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  directMailValidationWs.columns = directMailValidationColumns;
  directMailValidationWs.getRow(1).font = styles.header.font;
  directMailValidationWs.getRow(1).fill = styles.header.fill;
  directMailValidationWs.getRow(1).alignment = styles.header.alignment;

  // Add validation checks for direct mail
  const directMailValidationChecks = [
    ['Break-even Analysis', data.breakEvenAnalysis.estimatedBreakEvenWeeks <= 52 ? 'PASS' : 'FAIL', 
     `Break-even in ${data.breakEvenAnalysis.estimatedBreakEvenWeeks} weeks`],
    ['ROI Check', data.breakEvenAnalysis.returnOnInvestment >= 1 ? 'PASS' : 'FAIL',
     `ROI: ${(data.breakEvenAnalysis.returnOnInvestment * 100).toFixed(2)}%`],
    ['Conversion Rate Check', data.parameters.conversionRate >= data.breakEvenAnalysis.requiredConversionRateToBreakEven ? 'PASS' : 'FAIL',
     `Required: ${(data.breakEvenAnalysis.requiredConversionRateToBreakEven * 100).toFixed(2)}%`],
    ['Budget Check', data.annualCalculations.annualStampCost <= data.parameters.availableStamps * data.parameters.costPerStamp ? 'PASS' : 'FAIL',
     `Using ${((data.annualCalculations.annualStampCost / (data.parameters.availableStamps * data.parameters.costPerStamp)) * 100).toFixed(2)}% of budget`]
  ];

  directMailValidationChecks.forEach(([check, result, note]) => {
    const row = directMailValidationWs.addRow([check, result, note]);
    row.getCell(1).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(2).style = result === 'PASS' ? 
      { ...styles.growth, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } } :
      { ...styles.warning, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(3).style = { ...styles.result, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
  });

  // Set up App worksheet with styling
  const appColumns = [
    { header: 'Parameter', key: 'parameter', width: 30 },
    { header: 'Value', key: 'value', width: 15 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  appWs.columns = appColumns;
  appWs.getRow(1).font = styles.header.font;
  appWs.getRow(1).fill = styles.header.fill;
  appWs.getRow(1).alignment = styles.header.alignment;

  // Set up App Growth Projection worksheet with styling
  const appGrowthColumns = [
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

  appGrowthWs.columns = appGrowthColumns;
  appGrowthWs.getRow(1).font = styles.header.font;
  appGrowthWs.getRow(1).fill = styles.header.fill;
  appGrowthWs.getRow(1).alignment = styles.header.alignment;

  // Set up App Validation worksheet with styling
  const appValidationColumns = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Result', key: 'result', width: 15 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  appValidationWs.columns = appValidationColumns;
  appValidationWs.getRow(1).font = styles.header.font;
  appValidationWs.getRow(1).fill = styles.header.fill;
  appValidationWs.getRow(1).alignment = styles.header.alignment;

  // Add app parameters
  appParameters.forEach(([name, value, unit, note]: AppParameter) => {
    const row = appWs.addRow([name, value, unit, note]);
    row.getCell(1).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(2).style = { ...styles.result, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(3).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(4).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
  });

  // Add monthly projections for app growth
  for (let month = 1; month <= 12; month++) {
    const baseRevenue = appParameters[4][1] * (appParameters[0][1] * month + appParameters[1][1] * month);
    const recipients = appParameters[0][1] * month + appParameters[1][1] * month;
    const newCustomers = recipients * (1 - appParameters[2][1]);
    const newRevenue = newCustomers * appParameters[4][1];
    const totalRevenue = baseRevenue + newRevenue;
    const marketingCost = appParameters[3][1] * recipients;
    const curbsideRevenue = totalRevenue * appParameters[18][1];
    const cookCost = appParameters[19][1] * appParameters[20][1] * appParameters[21][1] * 4;
    const netRevenue = totalRevenue - marketingCost - cookCost;

    const row = appGrowthWs.addRow({
      month: `Month ${month}`,
      baseRevenue,
      recipients,
      newCustomers,
      newRevenue,
      totalRevenue,
      marketingCost,
      curbsideRevenue,
      cookCost,
      netRevenue
    });
    row.eachCell(cell => cell.style = styles.result);
  }

  // Add validation checks for app
  const appValidationChecks = [
    ['Break-even Analysis', appParameters[3][1] * appParameters[0][1] * 52 <= appParameters[4][1] * appParameters[0][1] * 52 ? 'PASS' : 'FAIL', 
     `Marketing cost vs revenue`],
    ['User Growth Check', appParameters[0][1] > 0 ? 'PASS' : 'FAIL',
     `${appParameters[0][1]} new users per week`],
    ['Cost Check', appParameters[3][1] * appParameters[0][1] * 52 <= appParameters[4][1] * appParameters[0][1] * 52 ? 'PASS' : 'FAIL',
     `Marketing cost vs revenue`]
  ];

  appValidationChecks.forEach(([check, result, note]) => {
    const row = appValidationWs.addRow([check, result, note]);
    row.getCell(1).style = { ...styles.input, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(2).style = result === 'PASS' ? 
      { ...styles.growth, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } } :
      { ...styles.warning, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
    row.getCell(3).style = { ...styles.result, alignment: { horizontal: 'center' as const, vertical: 'middle' as const } };
  });

  // Set up Combined Growth Projection worksheet with styling
  const combinedGrowthColumns = [
    { header: 'Month', key: 'month', width: 15 },
    { header: 'Direct Mail Revenue', key: 'directMailRevenue', width: 15 },
    { header: 'App Revenue', key: 'appRevenue', width: 15 },
    { header: 'Total Revenue', key: 'totalRevenue', width: 15 },
    { header: 'Direct Mail Cost', key: 'directMailCost', width: 15 },
    { header: 'App Cost', key: 'appCost', width: 15 },
    { header: 'Total Cost', key: 'totalCost', width: 15 },
    { header: 'Net Revenue', key: 'netRevenue', width: 15 }
  ];

  combinedGrowthWs.columns = combinedGrowthColumns;
  combinedGrowthWs.getRow(1).font = styles.header.font;
  combinedGrowthWs.getRow(1).fill = styles.header.fill;
  combinedGrowthWs.getRow(1).alignment = styles.header.alignment;

  // Add monthly projections for combined growth
  for (let month = 1; month <= 12; month++) {
    const directMailRevenue = data.monthlyCalculations.monthlyRevenueFromNewCustomers * month;
    const appRevenue = appParameters[4][1] * (appParameters[0][1] * month + appParameters[1][1] * month);
    const totalRevenue = directMailRevenue + appRevenue;
    const directMailCost = data.monthlyCalculations.monthlyStampCost * month;
    const appCost = appParameters[3][1] * (appParameters[0][1] * month + appParameters[1][1] * month);
    const totalCost = directMailCost + appCost;
    const netRevenue = totalRevenue - totalCost;

    const row = combinedGrowthWs.addRow({
      month: `Month ${month}`,
      directMailRevenue,
      appRevenue,
      totalRevenue,
      directMailCost,
      appCost,
      totalCost,
      netRevenue
    });
    row.eachCell(cell => cell.style = styles.result);
  }

  // Save the workbook
  const outputPath = path.join(__dirname, '..', '..', 'dist', 'marketing-analysis.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Marketing analysis spreadsheet generated at ${outputPath}`);
}

// Main function to handle errors
async function main(): Promise<void> {
  try {
    await generateMarketingSpreadsheet();
  } catch (error) {
    console.error('Error generating spreadsheet:', error);
    process.exit(1);
  }
}

main();