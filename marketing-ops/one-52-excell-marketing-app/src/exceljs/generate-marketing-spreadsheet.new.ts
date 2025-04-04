import { Cell } from 'exceljs';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConfig } from '@/config';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the config
const config = getConfig();
console.log('Using config:', config);

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
    { width: 30 }, // Parameter
    { width: 15 }, // Value
    { width: 10 }, // Unit
    { width: 40 }  // Notes
  ];

  appGrowthWs.columns = [
    { width: 15 }, // Month
    { width: 15 }, // Base Revenue
    { width: 15 }, // Recipients
    { width: 15 }, // New Customers
    { width: 15 }, // New Revenue
    { width: 15 }, // Total Revenue
    { width: 15 }, // Marketing Cost
    { width: 15 }, // Curbside Revenue
    { width: 15 }, // Cook Cost
    { width: 15 }  // Net Revenue
  ];

  appValidationWs.columns = [
    { width: 30 }, // Check
    { width: 15 }, // Result
    { width: 40 }  // Notes
  ];

  // Add headers
  appWs.addRow(['Parameter', 'Value', 'Unit', 'Notes']);
  appGrowthWs.addRow(['Month', 'Base Revenue', 'Recipients', 'New Customers', 'New Revenue', 'Total Revenue', 'Marketing Cost', 'Curbside Revenue', 'Cook Cost', 'Net Revenue']);
  appValidationWs.addRow(['Check', 'Result', 'Notes']);

  // Style headers
  [appWs, appGrowthWs, appValidationWs].forEach(ws => {
    const headerRow = ws.getRow(1);
    headerRow.eachCell((cell: Cell) => {
      cell.font = styles.header.font;
      cell.fill = styles.header.fill;
      cell.alignment = styles.header.alignment;
    });
  });

  // Add app parameters
  appParameters.forEach(([name, value, unit, note]) => {
    const row = appWs.addRow([name, value, unit, note]);
    row.eachCell((cell: Cell) => {
      cell.style = styles.input;
    });
  });

  // Add growth projection formulas
  const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 
                 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  
  months.forEach((month, index) => {
    const rowNum = index + 2;
    const row = appGrowthWs.addRow([
      month,
      index === 0 ? 8000 : `=F${rowNum - 1}`,
      `='ONE52 Bar App'!B5*(1-'ONE52 Bar App'!B7)`,
      `=C${rowNum}*'ONE52 Bar App'!B8*2`,
      `=D${rowNum}*'ONE52 Bar App'!B8`,
      `=B${rowNum}+E${rowNum}`,
      `=C${rowNum}*'ONE52 Bar App'!B4+'ONE52 Bar App'!B16+IF(E${rowNum}>8000,MAX(0,E${rowNum}-8000)*'ONE52 Bar App'!B18,0)`,
      `=D${rowNum}*'ONE52 Bar App'!B8*'ONE52 Bar App'!B19`,
      `='ONE52 Bar App'!B20*'ONE52 Bar App'!B21*'ONE52 Bar App'!B22*4`,
      `=F${rowNum}+H${rowNum}-I${rowNum}-G${rowNum}`
    ]);

    row.eachCell((cell: Cell) => {
      cell.style = styles.result;
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
    ['Cook Days Per Week Check', '=IF(\'ONE52 Bar App\'!B22=5,"✓","✗")', 'Should be 5 days per week']
  ];

  validationChecks.forEach(([check, formula, note]) => {
    const row = appValidationWs.addRow([check, formula, note]);
    row.eachCell((cell: Cell) => {
      cell.style = styles.result;
    });
  });

  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, 'dist');
  mkdirSync(distDir, { recursive: true });

  // Save the workbook
  const filePath = path.join(distDir, 'ONE52-Marketing-Campaign-Calculator.xlsx');
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