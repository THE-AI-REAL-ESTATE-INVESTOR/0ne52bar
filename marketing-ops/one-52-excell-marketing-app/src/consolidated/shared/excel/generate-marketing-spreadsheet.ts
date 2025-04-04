import { MarketingCalculatorGenerator } from '@/consolidated/shared/excel/marketing-calculator';
import { MarketingCampaignData } from '@/types/types';
import {
  CAMPAIGN_PARAMETERS,
  WEEKLY_CALCULATIONS,
  MONTHLY_CALCULATIONS,
  ANNUAL_CALCULATIONS,
  ADDITIONAL_REVENUE,
  BREAK_EVEN
} from '../config/constants';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

export async function generateMarketingSpreadsheet(): Promise<void> {
  try {
    // Create campaign data with all required properties
    const campaignData: MarketingCampaignData = {
      parameters: CAMPAIGN_PARAMETERS,
      weeklyCalculations: WEEKLY_CALCULATIONS,
      monthlyCalculations: MONTHLY_CALCULATIONS,
      annualCalculations: ANNUAL_CALCULATIONS,
      additionalRevenueConsiderations: ADDITIONAL_REVENUE,
      breakEvenAnalysis: BREAK_EVEN
    };

    // Create and configure the generator
    const generator = new MarketingCalculatorGenerator(campaignData);
    
    // Generate the workbook
    const workbook = await generator.generate();

    // Save the workbook
    const currentDir = process.cwd();
    const outputDir = join(currentDir, 'dist');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filePath = join(outputDir, 'ONE52-Marketing-Campaign-Calculator.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`Marketing campaign calculator spreadsheet created at: ${filePath}`);
  } catch (error) {
    console.error('Error generating spreadsheet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Run the generator
generateMarketingSpreadsheet().catch(error => {
  console.error('Failed to generate marketing spreadsheet:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 