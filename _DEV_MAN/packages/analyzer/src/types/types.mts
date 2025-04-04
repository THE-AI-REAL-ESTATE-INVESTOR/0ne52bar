import { Style, Font, Fill, Border, Alignment } from 'exceljs';

export interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  complexity: number;
}

export interface ExcelStyle {
  font?: Partial<Font>;
  fill?: Partial<Fill>;
  border?: Partial<Border>;
  alignment?: Partial<Alignment>;
  numberFormat?: string;

} 


import { Workbook } from 'exceljs';
import { promises as fs } from 'fs';
import path from 'path';

export interface TypeAnalysisResult {
  issues: {
    type: 'type_mismatch' | 'invalid_format' | 'missing_value';
    message: string;
    location: string;
    expected: string;
    actual: string;
  }[];
}

export interface VersionUpdate {
  version: string;
  changes: {
    type: 'fix' | 'update' | 'create' | 'delete';
    component: string;
    description: string;
  }[];
  timestamp: string;
}

export interface AnalyzerConfig {
  rootDir: string;
  outputDir: string;
  version: string;
}

export interface FixerTask {
  phase: 'types' | 'styles' | 'features' | 'cleanup';
  target: string;
  action: 'update' | 'create' | 'delete';
  version: string;
}

export async function analyzeTypes(): Promise<TypeAnalysisResult> {
  const result: TypeAnalysisResult = {
    issues: []
  };

  try {
    // 1. Scan consolidated types
    const typesDir = path.join(process.cwd(), 'src/consolidated/shared/types');
    const files = await fs.readdir(typesDir);

    // 2. Check ExcelJS compatibility
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const content = await fs.readFile(path.join(typesDir, file), 'utf-8');
        
        // Check for ExcelJS type usage
        if (content.includes('Workbook') || content.includes('Worksheet')) {
          // Verify type imports
          if (!content.includes('import { Workbook, Worksheet } from \'exceljs\'')) {
            result.issues.push({
              type: 'missing_value',
              message: 'Missing ExcelJS type imports in the type analysis',
              location: file,
              expected: 'import { Workbook, Worksheet } from \'exceljs\'',
              actual: ''
            });
          }
        }
      }
    }

    // 3. Check style definitions
    const stylesDir = path.join(process.cwd(), 'src/consolidated/shared/excel/styles');
    if (await fs.access(stylesDir).then(() => true).catch(() => false)) {
      const styleFiles = await fs.readdir(stylesDir);
      for (const file of styleFiles) {
        if (file.endsWith('.ts')) {
          const content = await fs.readFile(path.join(stylesDir, file), 'utf-8');
          if (content.includes('Style') && !content.includes('import { Style } from \'exceljs\'')) {
            result.issues.push({
              type: 'missing_value',
              message: 'Missing ExcelJS Style import in the type analysis',
              location: file,
              expected: 'import { Style } from \'exceljs\'',
              actual: ''
            });
          }
        }
      }
    }

    // 4. Check worksheet implementations
    const excelDir = path.join(process.cwd(), 'src/consolidated/shared/excel');
    const excelFiles = await fs.readdir(excelDir);
    for (const file of excelFiles) {
      if (file.endsWith('.ts') && !file.includes('styles')) {
        const content = await fs.readFile(path.join(excelDir, file), 'utf-8');
        if (content.includes('Worksheet') && !content.includes('import { Worksheet } from \'exceljs\'')) {
          result.issues.push({
            type: 'missing_value',
            message: 'Missing ExcelJS Worksheet import in the type analysis',
            location: file,
            expected: 'import { Worksheet } from \'exceljs\'',
            actual: ''
          });
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error during type analysis:', error);
    throw error;
  }
}

export async function fixTypes(): Promise<VersionUpdate> {
  const update: VersionUpdate = {
    version: '1.0.0',
    changes: [],
    timestamp: new Date().toISOString()
  };

  try {
    await updateTypeDefinitions();
    await updateStyleDefinitions();
    await updateWorksheetDefinitions();
    await saveVersionUpdate(update);
    return update;
  } catch (error) {
    console.error('Error during type fixes:', error);
    throw error;
  }
}

async function updateTypeDefinitions(): Promise<void> {
  const typesDir = path.join(process.cwd(), 'src/consolidated/shared/types');
  const files = await fs.readdir(typesDir);

  for (const file of files) {
    if (file.endsWith('.ts')) {
      const filePath = path.join(typesDir, file);
      let content = await fs.readFile(filePath, 'utf-8');
      
      if (content.includes('Workbook') || content.includes('Worksheet')) {
        if (!content.includes('import { Workbook, Worksheet } from \'exceljs\'')) {
          content = `import { Workbook, Worksheet } from 'exceljs';\n${content}`;
          await fs.writeFile(filePath, content);
        }
      }
    }
  }
}

async function updateStyleDefinitions(): Promise<void> {
  const stylesDir = path.join(process.cwd(), 'src/consolidated/shared/excel/styles');
  if (await fs.access(stylesDir).then(() => true).catch(() => false)) {
    const files = await fs.readdir(stylesDir);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const filePath = path.join(stylesDir, file);
        let content = await fs.readFile(filePath, 'utf-8');
        
        if (content.includes('Style') && !content.includes('import { Style } from \'exceljs\'')) {
          content = `import { Style } from 'exceljs';\n${content}`;
          await fs.writeFile(filePath, content);
        }
      }
    }
  }
}

async function updateWorksheetDefinitions(): Promise<void> {
  const excelDir = path.join(process.cwd(), 'src/consolidated/shared/excel');
  const files = await fs.readdir(excelDir);
  
  for (const file of files) {
    if (file.endsWith('.ts') && !file.includes('styles')) {
      const filePath = path.join(excelDir, file);
      let content = await fs.readFile(filePath, 'utf-8');
      
      if (content.includes('Worksheet') && !content.includes('import { Worksheet } from \'exceljs\'')) {
        content = `import { Worksheet } from 'exceljs';\n${content}`;
        await fs.writeFile(filePath, content);
      }
    }
  }
}

async function saveVersionUpdate(update: VersionUpdate): Promise<void> {
  const versionDir = path.join(process.cwd(), 'output/version');
  if (!await fs.access(versionDir).then(() => true).catch(() => false)) {
    await fs.mkdir(versionDir, { recursive: true });
  }
  
  const versionFile = path.join(versionDir, 'version-history.json');
  let history: VersionUpdate[] = [];
  
  try {
    const content = await fs.readFile(versionFile, 'utf-8');
    history = JSON.parse(content);
  } catch (error) {
    // File doesn't exist or is invalid JSON, start fresh
  }
  
  history.push(update);
  await fs.writeFile(versionFile, JSON.stringify(history, null, 2));
}

// Main execution
if (require.main === module) {
  const isFixMode = process.argv.includes('--fix');
  
  if (isFixMode) {
    fixTypes()
      .then(() => console.log('Type fixes completed successfully'))
      .catch(error => console.error('Type fixes failed:', error));
  } else {
    analyzeTypes()
      .then(result => {
        console.log('Type analysis completed:');
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(error => console.error('Type analysis failed:', error));
  }
} 