import { Style, Fill, Font, Alignment } from 'exceljs';

export interface AppParameter {
  name: string;
  value: number | string;
  unit: string;
}

export interface GrowthMetric {
  name: string;
  formula: string;
}

export interface ValidationCheck {
  name: string;
  expected: number;
  formula: string;
}

export interface ExcelStyles {
  header: Style;
  input: Style;
  result: Style;
  growth: Style;
  cost: Style;
  warning: Style;
}

export interface ExcelStyle {
  font?: Partial<Font>;
  fill?: Partial<Fill>;
  alignment?: Partial<Alignment>;
} 