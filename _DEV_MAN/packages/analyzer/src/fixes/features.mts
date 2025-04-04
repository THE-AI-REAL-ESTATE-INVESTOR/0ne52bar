import { Workbook } from 'exceljs';
import { promises as fs } from 'fs';
import path from 'path';
import { VersionUpdate } from '@/types/types.mts';
import { getFullPath } from '../config.mts';

interface FeatureAnalysisResult {
  missingWorksheets: string[];
  invalidFormulas: string[];
  styleIssues: string[];
  calculationIssues: string[];
}

const REQUIRED_WORKSHEETS = [
  'Campaign Parameters',
  'Weekly Calculations',
  'Monthly Calculations',
  'Annual Calculations',
  'App Metrics',
  'Revenue Impact'
];

export async function analyzeFeatures(): Promise<FeatureAnalysisResult> {
  const result: FeatureAnalysisResult = {
    missingWorksheets: [],
    invalidFormulas: [],
    styleIssues: [],
    calculationIssues: []
  };

  try {
    const featuresDir = getFullPath('src/features');
    const files = await fs.readdir(featuresDir);

    // 1. Check consolidated implementation
    const implPath = path.join(process.cwd(), 'src/consolidated/shared/excel/marketing-calculator.ts');
    const content = await fs.readFile(implPath, 'utf-8');

    // 2. Check worksheets
    for (const worksheet of REQUIRED_WORKSHEETS) {
      if (!content.includes(worksheet)) {
        result.missingWorksheets.push(worksheet);
      }
    }

    // 3. Check formulas
    if (!content.includes('formula:') || !content.includes('=')) {
      result.invalidFormulas.push('Missing formula definitions');
    }

    // 4. Check styles
    if (!content.includes('headerStyle') || !content.includes('inputStyle') || !content.includes('resultStyle')) {
      result.styleIssues.push('Missing style applications');
    }

    // 5. Check calculations
    if (!content.includes('calculateWeekly') || !content.includes('calculateMonthly')) {
      result.calculationIssues.push('Missing calculation methods');
    }

  } catch (error) {
    console.error('Error analyzing features:', error);
    throw error;
  }

  return result;
}

export async function fixFeatures(): Promise<VersionUpdate> {
  const analysisResult = await analyzeFeatures();
  const versionUpdate: VersionUpdate = {
    version: '1.0.0',
    changes: [],
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fix missing worksheets
    if (analysisResult.missingWorksheets.length > 0) {
      await addMissingWorksheets(analysisResult.missingWorksheets);
      versionUpdate.changes.push({
        type: 'fix',
        component: 'worksheets',
        description: 'Added missing worksheets'
      });
    }

    // 2. Fix formulas
    if (analysisResult.invalidFormulas.length > 0) {
      await fixFormulas();
      versionUpdate.changes.push({
        type: 'fix',
        component: 'formulas',
        description: 'Fixed calculation formulas'
      });
    }

    // 3. Fix styles
    if (analysisResult.styleIssues.length > 0) {
      await fixStyles();
      versionUpdate.changes.push({
        type: 'fix',
        component: 'styles',
        description: 'Fixed style applications'
      });
    }

    // 4. Fix calculations
    if (analysisResult.calculationIssues.length > 0) {
      await fixCalculations();
      versionUpdate.changes.push({
        type: 'fix',
        component: 'calculations',
        description: 'Fixed calculation methods'
      });
    }

    // Save version update
    await saveVersionUpdate(versionUpdate);

  } catch (error) {
    console.error('Error fixing features:', error);
    throw error;
  }

  return versionUpdate;
}

async function addMissingWorksheets(worksheets: string[]): Promise<void> {
  // Implementation will be added in the next phase
}

async function fixFormulas(): Promise<void> {
  // Implementation will be added in the next phase
}

async function fixStyles(): Promise<void> {
  // Implementation will be added in the next phase
}

async function fixCalculations(): Promise<void> {
  // Implementation will be added in the next phase
}

async function saveVersionUpdate(update: VersionUpdate): Promise<void> {
  const versionPath = path.join(process.cwd(), 'version.json');
  await fs.writeFile(versionPath, JSON.stringify(update, null, 2), 'utf-8');
} 