import { main } from './exceljs/generate-marketing-spreadsheet';

// Run the main function
main().catch(error => {
  console.error('Error running the marketing spreadsheet generator:', error);
  process.exit(1);
}); 