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

  // Set up Direct Mail Parameters worksheet with editable cells
  directMailParamsWs.columns = [
    { header: 'Parameter', key: 'parameter', width: 40 },
    { header: 'Value', key: 'value', width: 25 },
    { header: 'Unit', key: 'unit', width: 15 },
    { header: 'Notes', key: 'notes', width: 60 }
  ];

  // Style the header row
  const headerRow = directMailParamsWs.getRow(1);
  headerRow.font = { ...styles.header.font, size: 20 };
  headerRow.fill = styles.header.fill;
  headerRow.alignment = styles.header.alignment;

  // Add Direct Mail Parameters with empty, editable cells
  const directMailParams = [
    ['Available Stamps', '', 'stamps', 'Total stamps available for campaign'],
    ['Cost per Stamp', '', '$', 'Cost per stamp including printing'],
    ['Weekly Target Recipients', '', 'recipients', 'Number of recipients per week'],
    ['Conversion Rate', '', '%', 'Expected conversion rate'],
    ['Current Weekly Revenue', '', '$', 'Current weekly revenue before campaign'],
    ['Average Customer Value', '', '$', 'Average revenue per customer']
  ];

  // Add parameters with data validation
  directMailParams.forEach(([name, value, unit, note], index) => {
    const row = directMailParamsWs.addRow([name, value, unit, note]);
    row.height = 30;

    // Style the cells
    row.getCell(1).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };

    // Make value cell editable with validation
    const valueCell = row.getCell(2);
    valueCell.style = { 
      ...styles.input,
      font: { size: 20 },
      protection: { locked: false }
    };

    // Add data validation based on parameter type
    if (unit === '%') {
      valueCell.dataValidation = {
        type: 'decimal',
        operator: 'between',
        formulae: [0, 100],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Invalid Percentage',
        error: 'Please enter a value between 0 and 100'
      };
    } else if (unit === '$' || unit === 'stamps' || unit === 'recipients') {
      valueCell.dataValidation = {
        type: 'decimal',
        operator: 'greaterThan',
        formulae: [0],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Invalid Value',
        error: 'Please enter a value greater than 0'
      };
    }

    // Style unit and notes cells
    row.getCell(3).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };
    row.getCell(4).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };
  });

  // Add named ranges for easy formula reference
  directMailParamsWs.getCell('B2').name = 'AvailableStamps';
  directMailParamsWs.getCell('B3').name = 'CostPerStamp';
  directMailParamsWs.getCell('B4').name = 'WeeklyTargetRecipients';
  directMailParamsWs.getCell('B5').name = 'ConversionRate';
  directMailParamsWs.getCell('B6').name = 'CurrentWeeklyRevenue';
  directMailParamsWs.getCell('B7').name = 'AverageCustomerValue';

  // Add formulas to Direct Mail Growth Projection that reference the parameter cells
  directMailGrowthWs.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Weekly', key: 'weekly', width: 25 },
    { header: 'Monthly', key: 'monthly', width: 25 },
    { header: 'Annual', key: 'annual', width: 25 }
  ];

  const directMailGrowthMetrics = [
    ['Recipients', '=WeeklyTargetRecipients', '=WeeklyTargetRecipients*4', '=WeeklyTargetRecipients*52'],
    ['New Customers', '=B2*ConversionRate/100', '=C2*ConversionRate/100', '=D2*ConversionRate/100'],
    ['Revenue from New Customers', '=B3*AverageCustomerValue', '=C3*AverageCustomerValue', '=D3*AverageCustomerValue'],
    ['Total Revenue', '=CurrentWeeklyRevenue+B4', '=CurrentWeeklyRevenue*4+C4', '=CurrentWeeklyRevenue*52+D4'],
    ['Stamp Cost', '=B2*CostPerStamp', '=C2*CostPerStamp', '=D2*CostPerStamp'],
    ['Net Revenue', '=B5-B6', '=C5-C6', '=D5-D6']
  ];

  directMailGrowthMetrics.forEach(([metric, weekly, monthly, annual]) => {
    const row = directMailGrowthWs.addRow([metric, weekly, monthly, annual]);
    row.height = 30;
    row.eachCell(cell => {
      cell.style = {
        ...styles.result,
        font: { ...styles.result.font, size: 20 },
        alignment: { horizontal: 'center', vertical: 'middle' }
      };
    });
  });

  // Set up Direct Mail Validation worksheet
  directMailValidationWs.columns = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Result', key: 'result', width: 15 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

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

  // Set up ONE52 Bar App worksheet with editable cells
  appWs.columns = [
    { header: 'Parameter', key: 'parameter', width: 40 },
    { header: 'Value', key: 'value', width: 25 },
    { header: 'Unit', key: 'unit', width: 15 },
    { header: 'Notes', key: 'notes', width: 60 }
  ];

  // Style the header row
  const appHeaderRow = appWs.getRow(1);
  appHeaderRow.font = { ...styles.header.font, size: 20 };
  appHeaderRow.fill = styles.header.fill;
  appHeaderRow.alignment = styles.header.alignment;

  // Add app parameters with empty, editable cells
  const appParamsList = [
    ['Weekly App Signups', '', 'users', 'New app signups per week'],
    ['Monthly Organic Signups', '', 'users', 'Additional TapPass signups per month'],
    ['Opt-out Rate', '', '%', 'Percentage of users who opt out'],
    ['Push Notification Cost', '', '$ per push', 'Cost per push notification sent'],
    ['Average Order Value', '', '$', 'Average order value through app'],
    ['Postmates Delivery Rate', '', '%', 'Percentage of orders through Postmates'],
    ['Postmates Fee', '', '%', 'Postmates fee percentage'],
    ['Stripe Fee', '', '%', 'Stripe processing fee for app payments'],
    ['Shift4 Fee', '', '%', 'Shift4 POS interchange fee'],
    ['Order Processing Time Savings', '', 'minutes', 'Time saved per order'],
    ['152 Hoodie Price', '', '$', 'Price of 152 hoodie merchandise'],
    ['152 Shirt Price', '', '$', 'Price of 152 shirt merchandise'],
    ['Coozie Price', '', '$', 'Price of coozie merchandise'],
    ['Pool Stick Bag Price', '', '$', 'Price of pool stick bag merchandise'],
    ['Merch Sales per Customer', '', '%', 'Percentage of customers who purchase merchandise'],
    ['Vercel Hosting Cost', '', '$ per month', 'Monthly cost for Vercel hosting'],
    ['Marketing Revenue Rider', '', '$ per week', 'Weekly payment to marketing director'],
    ['Revenue Rider Percentage', '', '%', 'Percentage of new revenue above $8,000/week'],
    ['Curbside Order Rate', '', '%', 'Percentage of orders through curbside service'],
    ['Cook Hourly Rate', '', '$', 'Hourly rate for the full-time cook'],
    ['Cook Hours Per Day', '', 'hours', 'Hours worked by cook per day'],
    ['Cook Days Per Week', '', 'days', 'Days worked by cook per week']
  ];

  // Add parameters with data validation
  appParamsList.forEach(([name, value, unit, note], index) => {
    const row = appWs.addRow([name, value, unit, note]);
    row.height = 30;

    // Style the cells
    row.getCell(1).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };

    // Make value cell editable with validation
    const valueCell = row.getCell(2);
    valueCell.style = { 
      ...styles.input,
      font: { size: 20 },
      protection: { locked: false }
    };

    // Add data validation based on parameter type
    if (unit.includes('%')) {
      valueCell.dataValidation = {
        type: 'decimal',
        operator: 'between',
        formulae: [0, 100],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Invalid Percentage',
        error: 'Please enter a value between 0 and 100'
      };
    } else if (unit.includes('$') || unit === 'users' || unit === 'hours' || unit === 'days') {
      valueCell.dataValidation = {
        type: 'decimal',
        operator: 'greaterThan',
        formulae: [0],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Invalid Value',
        error: 'Please enter a value greater than 0'
      };
    }

    // Style unit and notes cells
    row.getCell(3).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };
    row.getCell(4).style = { 
      ...styles.header,
      font: { ...styles.header.font, size: 20, color: { argb: '000000' } }
    };

    // Add named range for the parameter
    valueCell.name = `App_${name.replace(/\s+/g, '')}`;
  });

  // Add formulas to App Growth Projection that reference the parameter cells
  appGrowthWs.columns = [
    { header: 'Month', key: 'month', width: 20 },
    { header: 'Base Revenue', key: 'baseRevenue', width: 25 },
    { header: 'Recipients', key: 'recipients', width: 25 },
    { header: 'New Customers', key: 'newCustomers', width: 25 },
    { header: 'New Revenue', key: 'newRevenue', width: 25 },
    { header: 'Total Revenue', key: 'totalRevenue', width: 25 },
    { header: 'Marketing Cost', key: 'marketingCost', width: 25 },
    { header: 'Curbside Revenue', key: 'curbsideRevenue', width: 25 },
    { header: 'Cook Cost', key: 'cookCost', width: 25 },
    { header: 'Net Revenue', key: 'netRevenue', width: 25 }
  ];

  const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 
                 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  
  months.forEach((month, index) => {
    const row = appGrowthWs.addRow({
      month,
      baseRevenue: index === 0 ? '=CurrentWeeklyRevenue' : `=F${index + 2}`,
      recipients: '=App_WeeklyAppSignups*(1-App_OptoutRate/100)',
      newCustomers: `=C${index + 2}`,
      newRevenue: `=D${index + 2}*App_AverageOrderValue`,
      totalRevenue: `=B${index + 2}+E${index + 2}`,
      marketingCost: '=App_PushNotificationCost*C2',
      curbsideRevenue: `=D${index + 2}*App_CurbsideOrderRate/100*App_AverageOrderValue`,
      cookCost: '=App_CookHourlyRate*App_CookHoursPerDay*App_CookDaysPerWeek*4',
      netRevenue: `=F${index + 2}+H${index + 2}-I${index + 2}-G${index + 2}`
    });
    row.height = 30;
    row.eachCell(cell => {
      cell.style = {
        ...styles.result,
        font: { ...styles.result.font, size: 20 },
        alignment: { horizontal: 'center', vertical: 'middle' }
      };
    });
  });

  // Add growth metrics
  growthMetrics.forEach((metric: { name: string; formula: string }) => {
    const row = appGrowthWs.addRow([metric.name, metric.formula]);
    const cellStyle = {
      font: { bold: true },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' } // Light gray background
      } as Fill,
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      } as Partial<Alignment>
    };
    row.getCell(1).style = cellStyle;
    row.getCell(2).style = cellStyle;
  });

  // Add validation checks with proper font size
  validationChecks.forEach((check) => {
    const row = appValidationWs.addRow([check.name, `=IF(${check.formula}=${check.expected},"✓","✗")`, '']);
    row.height = 30;
    row.eachCell(cell => {
      cell.style = {
        ...styles.result,
        font: { ...styles.result.font, size: 20 },
        alignment: { horizontal: 'center', vertical: 'middle' }
      };
    });
  });

  // Create Combined Growth Projection worksheet
  combinedGrowthWs.columns = [
    { header: 'Month', key: 'month', width: 15 },
    { header: 'Direct Mail Revenue', key: 'directMailRevenue', width: 20 },
    { header: 'App Revenue', key: 'appRevenue', width: 15 },
    { header: 'Total Revenue', key: 'totalRevenue', width: 15 },
    { header: 'Total Cost', key: 'totalCost', width: 15 },
    { header: 'Net Revenue', key: 'netRevenue', width: 15 }
  ];

  // Add combined monthly projections with proper font size
  for (let month = 1; month <= 12; month++) {
    const directMailRevenue = data.monthlyCalculations.monthlyRevenueFromNewCustomers;
    const appRevenue = data.monthlyCalculations.monthlyRevenueFromNewCustomers * 0.5;
    const totalRevenue = directMailRevenue + appRevenue;
    const totalCost = data.monthlyCalculations.monthlyStampCost + (20 * 12);
    const netRevenue = totalRevenue - totalCost;

    const row = combinedGrowthWs.addRow({
      month: `Month ${month}`,
      directMailRevenue,
      appRevenue,
      totalRevenue,
      totalCost,
      netRevenue
    });
    row.height = 30;
    row.eachCell(cell => {
      cell.style = {
        ...styles.result,
        font: { ...styles.result.font, size: 20 },
        alignment: { horizontal: 'center', vertical: 'middle' }
      };
    });
  }

  // Enable worksheet protection with editable cells
  await directMailParamsWs.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false,
    sort: true,
    autoFilter: true,
    pivotTables: true
  });

  await appWs.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false,
    sort: true,
    autoFilter: true,
    pivotTables: true
  });

  // Save the workbook with version number
  const outputPath = join(process.cwd(), 'dist', 'marketing-campaign-v0.2.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Spreadsheet generated successfully at: ${outputPath}`);

  // Open the file automatically
  const open = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
  const { exec } = require('child_process');
  exec(`${open} "${outputPath}"`);
  console.log('✅ Opening spreadsheet in Excel...');
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