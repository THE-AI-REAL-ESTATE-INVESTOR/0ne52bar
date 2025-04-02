import ExcelJS from 'exceljs';
import path from 'path';
import { appParameters, growthMetrics, validationChecks } from './config/constants';
import { styles } from './config/styles';

async function generateMarketingSpreadsheet(): Promise<void> {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ONE52 Bar & Grill';
  workbook.lastModifiedBy = 'ONE52 Bar & Grill';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Add worksheets
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
  validationChecks.forEach((check, index) => {
    const row = validationWs.addRow([check.name, check.expected, { formula: check.formula }]);
    row.getCell(2).style = styles.input;
    row.getCell(3).style = styles.input;
  });

  // Save the workbook
  const outputPath = path.join(__dirname, '..', 'dist', 'ONE52-Marketing-Campaign-Calculator.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Marketing campaign calculator spreadsheet created at: ${outputPath}`);
}

// Run the generator
generateMarketingSpreadsheet().catch(error => {
  console.error('Error generating spreadsheet:', error);
  process.exit(1);
}); 