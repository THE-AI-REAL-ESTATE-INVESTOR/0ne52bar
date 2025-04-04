import { Worksheet } from 'exceljs';
import { z } from 'zod';

export const ExcelVersionSchema = z.object({
  version: z.string(),
  date: z.string(),
  changes: z.array(z.string()),
  worksheets: z.array(z.string()),
  features: z.array(z.string()),
  tests: z.array(z.string())
});

export type ExcelVersion = z.infer<typeof ExcelVersionSchema>;

export const CURRENT_VERSION: ExcelVersion = {
  version: "1.0.0",
  date: "2024-04-03",
  changes: [
    "Initial consolidated implementation",
    "Merged Excel4Node and ExcelJS features",
    "Added proper TypeScript types",
    "Implemented Zod validation"
  ],
  worksheets: [
    "Campaign Parameters",
    "Weekly Calculations",
    "Monthly Calculations",
    "Annual Calculations",
    "Additional Revenue",
    "Break-Even Analysis",
    "App Parameters",
    "Growth Metrics",
    "Validation Checks"
  ],
  features: [
    "Excel styling with proper formatting",
    "Formulas and calculations",
    "Data validation",
    "Error handling",
    "Type safety"
  ],
  tests: [
    "Basic spreadsheet generation",
    "Worksheet creation",
    "Formula validation",
    "Style application",
    "Data population"
  ]
}; 