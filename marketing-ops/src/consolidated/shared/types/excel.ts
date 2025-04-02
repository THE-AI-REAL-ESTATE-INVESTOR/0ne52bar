import { z } from 'zod';
import { MarketingCampaignData, marketingCampaignDataSchema } from './base';

/**
 * Excel cell style configuration
 */
export interface ExcelStyle {
  /** Font configuration */
  font?: {
    /** Whether the font is bold */
    bold?: boolean;
    /** Whether the font is italic */
    italic?: boolean;
    /** Font color in hex format */
    color?: string;
  };
  /** Fill configuration */
  fill?: {
    /** Fill type */
    type: string;
    /** Fill pattern */
    pattern: string;
    /** Foreground color in hex format */
    fgColor: string;
  };
  /** Alignment configuration */
  alignment?: {
    /** Horizontal alignment */
    horizontal?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    vertical?: 'top' | 'middle' | 'bottom';
    /** Whether to wrap text */
    wrapText?: boolean;
  };
}

/**
 * Excel cell configuration
 */
export interface ExcelCell {
  /** Row number (1-based) */
  row: number;
  /** Column number (1-based) */
  col: number;
  /** Cell value */
  value: string | number;
  /** Cell style */
  style?: ExcelStyle;
  /** Whether to merge cells */
  merge?: boolean;
  /** End row for merged cells */
  mergeEndRow?: number;
  /** End column for merged cells */
  mergeEndCol?: number;
}

/**
 * Excel worksheet configuration
 */
export interface ExcelWorksheet {
  /** Worksheet name */
  name: string;
  /** Worksheet cells */
  cells: ExcelCell[];
  /** Column widths */
  columnWidths: number[];
}

/**
 * Excel generation data
 */
export interface ExcelGenerationData {
  /** Marketing campaign data */
  campaignData: MarketingCampaignData;
  /** Default style for the worksheet */
  style: ExcelStyle;
  /** Worksheet configuration */
  worksheet: ExcelWorksheet;
}

// Zod Schemas

export const excelStyleSchema = z.object({
  font: z.object({
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    color: z.string().optional(),
  }).optional(),
  fill: z.object({
    type: z.string(),
    pattern: z.string(),
    fgColor: z.string(),
  }).optional(),
  alignment: z.object({
    horizontal: z.enum(['left', 'center', 'right']).optional(),
    vertical: z.enum(['top', 'middle', 'bottom']).optional(),
    wrapText: z.boolean().optional(),
  }).optional(),
});

export const excelCellSchema = z.object({
  row: z.number().min(1),
  col: z.number().min(1),
  value: z.union([z.string(), z.number()]),
  style: excelStyleSchema.optional(),
  merge: z.boolean().optional(),
  mergeEndRow: z.number().min(1).optional(),
  mergeEndCol: z.number().min(1).optional(),
});

export const excelWorksheetSchema = z.object({
  name: z.string(),
  cells: z.array(excelCellSchema),
  columnWidths: z.array(z.number().min(0)),
});

export const excelGenerationDataSchema = z.object({
  campaignData: marketingCampaignDataSchema,
  style: excelStyleSchema,
  worksheet: excelWorksheetSchema,
});

// Type Guards

export function isExcelStyle(data: unknown): data is ExcelStyle {
  return excelStyleSchema.safeParse(data).success;
}

export function isExcelCell(data: unknown): data is ExcelCell {
  return excelCellSchema.safeParse(data).success;
}

export function isExcelWorksheet(data: unknown): data is ExcelWorksheet {
  return excelWorksheetSchema.safeParse(data).success;
}

export function isExcelGenerationData(data: unknown): data is ExcelGenerationData {
  return excelGenerationDataSchema.safeParse(data).success;
} 