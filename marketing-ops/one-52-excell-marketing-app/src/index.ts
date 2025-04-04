import { generateMarketingSpreadsheet } from './consolidated/shared/excel/generate-marketing-spreadsheet';

// Run the generator
generateMarketingSpreadsheet().catch((error: Error) => {
  console.error('Failed to generate marketing spreadsheet:', error.message);
  process.exit(1);
}); 