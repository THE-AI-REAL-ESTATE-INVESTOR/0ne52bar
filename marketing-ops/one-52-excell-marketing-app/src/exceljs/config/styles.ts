import { Fill, Style, Alignment } from 'exceljs';

export interface ExcelStyles {
  header: Partial<Style>;
  input: Partial<Style>;
  result: Partial<Style>;
  growth: Partial<Style>;
  cost: Partial<Style>;
  warning: Partial<Style>;
}

export const styles: ExcelStyles = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle' } as Partial<Alignment>
  },
  input: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F3FF' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle' } as Partial<Alignment>
  },
  result: {
    font: { bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle' } as Partial<Alignment>
  },
  growth: {
    font: { bold: true, color: { argb: '006100' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle' } as Partial<Alignment>
  },
  cost: {
    font: { bold: true, color: { argb: '9C0006' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle' } as Partial<Alignment>
  },
  warning: {
    font: { bold: true, color: { argb: 'FF0000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } } as Fill,
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true } as Partial<Alignment>
  }
}; 