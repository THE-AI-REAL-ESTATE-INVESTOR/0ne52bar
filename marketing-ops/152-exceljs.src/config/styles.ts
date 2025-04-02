import { ExcelStyles } from '../types';

export const styles: ExcelStyles = {
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