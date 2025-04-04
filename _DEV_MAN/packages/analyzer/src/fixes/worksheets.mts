import { Workbook, Worksheet, Column } from 'exceljs';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getExcelDir, getOutputDir } from '../config.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WorksheetAnalysis {
  layoutIssues: string[];
  columnIssues: string[];
  styleIssues: string[];
  formulaIssues: string[];
}

interface WorksheetFix {
  name: string;
  changes: {
    type: 'layout' | 'column' | 'style' | 'formula';
    description: string;
    fix: string;
  }[];
}

interface WorksheetTemplate {
  name: string;
  columns: {
    header: string;
    key: string;
    width: number;
  }[];
  styles: {
    header: any;
    input: any;
    result: any;
    note: any;
  };
  formulas: {
    [key: string]: string;
  };
}

const EXPECTED_TEMPLATES: WorksheetTemplate[] = [
  {
    name: 'Campaign Parameters',
    columns: [
      { header: 'Parameter', key: 'parameter', width: 30 },
      { header: 'Value', key: 'value', width: 15 },
      { header: 'Unit', key: 'unit', width: 15 }
    ],
    styles: {
      header: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } } },
      input: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F3FF' } } },
      result: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } } },
      note: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } } }
    },
    formulas: {}
  },
  {
    name: 'Weekly Calculations',
    columns: [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 15 },
      { header: 'Unit', key: 'unit', width: 15 }
    ],
    styles: {
      header: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } } },
      input: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F3FF' } } },
      result: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } } },
      note: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } } }
    },
    formulas: {
      'B5': '=B2*B3',
      'B6': '=B4+B5',
      'B7': '=B2*B3'
    }
  }
  // Add other worksheet templates...
];

export async function analyzeWorksheets(): Promise<WorksheetAnalysis> {
  const result: WorksheetAnalysis = {
    layoutIssues: [],
    columnIssues: [],
    styleIssues: [],
    formulaIssues: []
  };

  try {
    const excelDir = getExcelDir();
    const files = await fs.readdir(excelDir);

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('styles')) {
        const content = await fs.readFile(path.join(excelDir, file), 'utf-8');
        
        // Check worksheet creation
        if (content.includes('addWorksheet')) {
          const template = EXPECTED_TEMPLATES.find(t => 
            content.includes(`name: '${t.name}'`) || 
            content.includes(`name: "${t.name}"`)
          );

          if (template) {
            // Check column definitions
            if (!content.includes(`width: ${template.columns[0].width}`)) {
              result.layoutIssues.push(`Worksheet '${template.name}' has incorrect column width in column A`);
            }

            // Check style definitions
            if (!content.includes('4F81BD')) {
              result.styleIssues.push(`Worksheet '${template.name}' missing header style`);
            }

            // Check formula definitions
            for (const [cell, formula] of Object.entries(template.formulas)) {
              if (!content.includes(formula)) {
                result.formulaIssues.push(`Worksheet '${template.name}' missing formula in ${cell}`);
              }
            }
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error during worksheet analysis:', error);
    throw error;
  }
}

export async function fixWorksheets(): Promise<WorksheetFix[]> {
  const fixes: WorksheetFix[] = [];

  try {
    const excelDir = getExcelDir();
    const files = await fs.readdir(excelDir);

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('styles')) {
        const filePath = path.join(excelDir, file);
        let content = await fs.readFile(filePath, 'utf-8');
        const fileFixes: WorksheetFix = {
          name: file,
          changes: []
        };

        for (const template of EXPECTED_TEMPLATES) {
          if (content.includes(`name: '${template.name}'`) || content.includes(`name: "${template.name}"`)) {
            // Fix column definitions
            const columnFix = `columns: [\n${template.columns.map(col => 
              `    { header: '${col.header}', key: '${col.key}', width: ${col.width} }`
            ).join(',\n')}\n  ]`;
            
            if (!content.includes(columnFix)) {
              content = content.replace(
                /columns: \[([^\]]+)\]/,
                columnFix
              );
              fileFixes.changes.push({
                type: 'column',
                description: `Updated column definitions for ${template.name}`,
                fix: columnFix
              });
            }

            // Fix style definitions
            const styleFix = `styles: {\n    header: ${JSON.stringify(template.styles.header)},\n    input: ${JSON.stringify(template.styles.input)},\n    result: ${JSON.stringify(template.styles.result)},\n    note: ${JSON.stringify(template.styles.note)}\n  }`;
            
            if (!content.includes(styleFix)) {
              content = content.replace(
                /styles: \{([^}]+)\}/,
                styleFix
              );
              fileFixes.changes.push({
                type: 'style',
                description: `Updated style definitions for ${template.name}`,
                fix: styleFix
              });
            }

            // Fix formula definitions
            for (const [cell, formula] of Object.entries(template.formulas)) {
              if (!content.includes(formula)) {
                const formulaFix = `worksheet.getCell('${cell}').value = { formula: '${formula}' };`;
                content = content.replace(
                  /worksheet\.getCell\('([^']+)'\)\.value =/,
                  formulaFix
                );
                fileFixes.changes.push({
                  type: 'formula',
                  description: `Added formula for ${cell} in ${template.name}`,
                  fix: formulaFix
                });
              }
            }
          }
        }

        if (fileFixes.changes.length > 0) {
          await fs.writeFile(filePath, content);
          fixes.push(fileFixes);
        }
      }
    }

    // Save fixes report
    const outputDir = getOutputDir();
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      path.join(outputDir, 'worksheet-fixes.json'),
      JSON.stringify(fixes, null, 2)
    );

    return fixes;
  } catch (error) {
    console.error('Error during worksheet fixes:', error);
    throw error;
  }
}

// Main execution
if (import.meta.url === fileURLToPath(process.argv[1])) {
  const isFixMode = process.argv.includes('--fix');
  
  if (isFixMode) {
    fixWorksheets()
      .then(fixes => {
        console.log('Worksheet fixes completed:');
        console.log(JSON.stringify(fixes, null, 2));
      })
      .catch(error => console.error('Worksheet fixes failed:', error));
  } else {
    analyzeWorksheets()
      .then(result => {
        console.log('Worksheet analysis completed:');
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(error => console.error('Worksheet analysis failed:', error));
  }
}