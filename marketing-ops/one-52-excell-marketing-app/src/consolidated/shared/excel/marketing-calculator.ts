import { Worksheet, Workbook } from 'exceljs';
import { MarketingCampaignData } from '@/types/types.js';
import { BaseExcelGenerator } from './generator.js';
import {
  headerStyle,
  inputStyle,
  resultStyle,
  noteStyle
} from '../config/styles.js';
import { CURRENT_VERSION } from './version.js';

export class MarketingCalculatorGenerator extends BaseExcelGenerator {
  private data: MarketingCampaignData;

  constructor(data: MarketingCampaignData) {
    super();
    this.data = data;
  }

  protected initializeStyles(): void {
    // Use styles from config/styles.ts as defined in the consolidation plan
    this.addStyle('header', headerStyle);
    this.addStyle('input', inputStyle);
    this.addStyle('result', resultStyle);
    this.addStyle('note', noteStyle);
  }

  public async generate(): Promise<Workbook> {
    // Initialize styles
    this.initializeStyles();

    // Create all required worksheets
    CURRENT_VERSION.worksheets.forEach(worksheetName => {
      const worksheet = this.workbook.addWorksheet(worksheetName);
      this.setStandardColumns(worksheet);
    });

    // Populate worksheets
    this.populateCampaignParameters(this.workbook.getWorksheet('Campaign Parameters')!);
    this.populateWeeklyCalculations(this.workbook.getWorksheet('Weekly Calculations')!);
    this.populateMonthlyCalculations(this.workbook.getWorksheet('Monthly Calculations')!);
    this.populateAnnualCalculations(this.workbook.getWorksheet('Annual Calculations')!);
    this.populateAdditionalRevenue(this.workbook.getWorksheet('Additional Revenue')!);
    this.populateBreakEven(this.workbook.getWorksheet('Break-Even Analysis')!);
    this.populateAppParameters(this.workbook.getWorksheet('App Parameters')!);
    this.populateGrowthMetrics(this.workbook.getWorksheet('Growth Metrics')!);
    this.populateValidationChecks(this.workbook.getWorksheet('Validation Checks')!);

    return this.workbook;
  }

  private setStandardColumns(worksheet: Worksheet): void {
    worksheet.columns = [
      { header: 'Metric', key: 'metric', width: 40 },
      { header: 'Value', key: 'value', width: 20 },
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Note', key: 'note', width: 20 }
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    
    headerRow.eachCell((cell) => {
      this.applyStyle(cell, 'header');
    });
  }

  private populateCampaignParameters(worksheet: Worksheet): void {
    const { parameters } = this.data;
    const data = [
      ['Available Stamps', parameters.availableStamps, 'stamps', 'Input your available stamps'],
      ['Cost per Stamp', parameters.costPerStamp, '$', 'Input cost per stamp'],
      ['Weekly Target Recipients', parameters.weeklyTargetRecipients, 'recipients', 'Input target recipients per week'],
      ['Conversion Rate', parameters.conversionRate, '%', 'Input expected conversion rate'],
      ['Current Weekly Revenue', parameters.currentWeeklyRevenue, '$', 'Input current weekly revenue'],
      ['Average Customer Value', parameters.averageCustomerValue, '$', 'Input average customer value']
    ];

    data.forEach(([metric, value, unit, note]) => {
      const row = worksheet.addRow([metric, value, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'input'));
    });
  }

  private populateWeeklyCalculations(worksheet: Worksheet): void {
    const data = [
      ['Recipients', '=B2', 'people', '=Campaign Parameters!B3'],
      ['New Customers', '=B2*B3', 'customers', '=Recipients × Conversion Rate'],
      ['Revenue from New Customers', '=B3*B6', '$', '=New Customers × Average Customer Value'],
      ['Total Revenue with New Customers', '=B5+B4', '$', '=Current Weekly Revenue + Revenue from New Customers'],
      ['Weekly Stamp Cost', '=B2*B3', '$', '=Recipients × Cost per Stamp'],
      ['Net Weekly Revenue', '=B5-B6', '$', '=Total Revenue - Stamp Cost']
    ];

    data.forEach(([metric, formula, unit, note]) => {
      const row = worksheet.addRow([metric, formula, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateMonthlyCalculations(worksheet: Worksheet): void {
    const data = [
      ['Recipients', '=Weekly Calculations!B2*4', 'people', '=Weekly Recipients × 4'],
      ['New Customers', '=Weekly Calculations!B3*4', 'customers', '=Weekly New Customers × 4'],
      ['Revenue from New Customers', '=Weekly Calculations!B4*4', '$', '=Weekly Revenue from New Customers × 4'],
      ['Total Revenue with New Customers', '=Weekly Calculations!B5*4', '$', '=Weekly Total Revenue × 4'],
      ['Monthly Stamp Cost', '=Weekly Calculations!B6*4', '$', '=Weekly Stamp Cost × 4'],
      ['Net Monthly Revenue', '=Weekly Calculations!B7*4', '$', '=Weekly Net Revenue × 4']
    ];

    data.forEach(([metric, formula, unit, note]) => {
      const row = worksheet.addRow([metric, formula, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateAnnualCalculations(worksheet: Worksheet): void {
    const data = [
      ['Recipients', '=Weekly Calculations!B2*52', 'people', '=Weekly Recipients × 52'],
      ['New Customers', '=Weekly Calculations!B3*52', 'customers', '=Weekly New Customers × 52'],
      ['Revenue from New Customers', '=Weekly Calculations!B4*52', '$', '=Weekly Revenue from New Customers × 52'],
      ['Total Revenue with New Customers', '=Weekly Calculations!B5*52', '$', '=Weekly Total Revenue × 52'],
      ['Annual Stamp Cost', '=Weekly Calculations!B6*52', '$', '=Weekly Stamp Cost × 52'],
      ['Net Annual Revenue', '=Weekly Calculations!B7*52', '$', '=Weekly Net Revenue × 52']
    ];

    data.forEach(([metric, formula, unit, note]) => {
      const row = worksheet.addRow([metric, formula, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateAdditionalRevenue(worksheet: Worksheet): void {
    const data = [
      ['Repeat Customer Rate', '0.8', '%', 'Input expected repeat customer rate'],
      ['Repeat Visits per Customer', '3', 'visits', 'Input expected repeat visits'],
      ['Additional Revenue from Repeat Customers', '=B2*B3*B4', '$', '=Repeat Rate × Visits × Average Value'],
      ['Net Annual Revenue with Repeat Customers', '=Annual Calculations!B6+B4', '$', '=Annual Net Revenue + Additional Revenue'],
      ['Word of Mouth Effect', '1.5', 'multiplier', 'Input word of mouth multiplier'],
      ['Additional Revenue from Word of Mouth', '=B5*B6', '$', '=Net Revenue × Word of Mouth Effect']
    ];

    data.forEach(([metric, value, unit, note]) => {
      const row = worksheet.addRow([metric, value, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateBreakEven(worksheet: Worksheet): void {
    const data = [
      ['Required New Customers to Break Even', '=B2/B3', 'customers', '=Stamp Cost / Average Customer Value'],
      ['Required Conversion Rate to Break Even', '=B2/B3', '%', '=Required Customers / Target Recipients']
    ];

    data.forEach(([metric, formula, unit, note]) => {
      const row = worksheet.addRow([metric, formula, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateAppParameters(worksheet: Worksheet): void {
    const data = [
      ['App Version', CURRENT_VERSION.version, '', ''],
      ['Last Updated', CURRENT_VERSION.date, '', ''],
      ['Features', CURRENT_VERSION.features.join('\n'), '', '']
    ];

    data.forEach(([metric, value, unit, note]) => {
      const row = worksheet.addRow([metric, value, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'note'));
    });
  }

  private populateGrowthMetrics(worksheet: Worksheet): void {
    const data = [
      ['Customer Growth Rate', '=B2/B3', '%', ''],
      ['Revenue Growth Rate', '=B4/B5', '%', ''],
      ['ROI', '=B6/B7', '%', '']
    ];

    data.forEach(([metric, formula, unit, note]) => {
      const row = worksheet.addRow([metric, formula, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });
  }

  private populateValidationChecks(worksheet: Worksheet): void {
    const data = [
      ['Data Validation', 'Valid/Invalid', '', ''],
      ['Formula Validation', 'Valid/Invalid', '', ''],
      ['Version Check', 'Valid/Invalid', '', '']
    ];

    data.forEach(([metric, value, unit, note], index) => {
      const row = worksheet.addRow([metric, value, unit, note]);
      row.eachCell((cell) => this.applyStyle(cell, 'result'));
    });

    // Set validation formulas
    worksheet.getCell('B2').value = { formula: '=IF(COUNTBLANK(B2:B10)=0, "Valid", "Invalid")' };
    worksheet.getCell('B3').value = { formula: '=IF(ISERROR(B2), "Error", "Valid")' };
    worksheet.getCell('B4').value = { formula: `=IF(B2="${CURRENT_VERSION.version}", "Valid", "Invalid")` };
  }
} 