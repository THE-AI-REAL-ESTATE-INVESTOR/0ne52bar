import { Workbook } from 'exceljs';
import { analyzeTypes, fixTypes } from './fixes/types.mjs';
import { analyzeStyles, fixStyles } from './fixes/styles.mjs';
import { analyzeCleanup, fixCleanup } from './fixes/cleanup.mjs';
import { analyzeCode, fixCode } from './fixes/code.mjs';
import { updateConfig } from './config.mts';
import { analyzeWorksheets, fixWorksheets } from './fixes/worksheets.mts';

export interface AnalysisResult {
  types: Awaited<ReturnType<typeof analyzeTypes>>;
  styles: Awaited<ReturnType<typeof analyzeStyles>>;
  cleanup: Awaited<ReturnType<typeof analyzeCleanup>>;
  code: Awaited<ReturnType<typeof analyzeCode>>;
}

export interface AnalyzerOptions {
  targetPath: string;
  fix?: boolean;
}

export async function analyze(options: AnalyzerOptions): Promise<any> {
  // Update configuration with target path
  updateConfig({ targetPath: options.targetPath });

  if (options.fix) {
    return await fixWorksheets();
  } else {
    return await analyzeWorksheets();
  }
}

export async function fix(workbook: Workbook): Promise<void> {
  await Promise.all([
    fixTypes(workbook),
    fixStyles(workbook),
    fixCleanup(workbook),
    fixCode()
  ]);
}

export async function verify(workbook: Workbook): Promise<boolean> {
  const result = await analyze(workbook);
  return (
    result.types.issues.length === 0 &&
    result.styles.issues.length === 0 &&
    result.cleanup.issues.length === 0 &&
    result.code.issues.length === 0
  );
}

export { updateConfig } from './config.mts'; 