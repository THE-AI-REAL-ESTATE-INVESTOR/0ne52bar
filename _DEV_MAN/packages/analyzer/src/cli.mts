#!/usr/bin/env node
import { Workbook } from 'exceljs';
import { analyze, fix, verify } from './index.mjs';
import { promises as fs } from 'fs';
import path from 'path';
import { updateConfig, getFullPath } from './config.mts';
import { analyzeWorksheets, fixWorksheets } from './fixes/worksheets.mts';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const filePath = args[1];

  if (!command || !filePath) {
    console.error('Usage: marketing-analyzer <command> <file>');
    console.error('Commands:');
    console.error('  analyze  Analyze the workbook');
    console.error('  fix      Fix issues in the workbook');
    console.error('  verify   Verify the workbook is clean');
    process.exit(1);
  }

  try {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);

    switch (command) {
      case 'analyze':
        const result = await analyze(workbook);
        console.log('Analysis Results:');
        console.log('Types:', result.types.issues.length, 'issues');
        console.log('Styles:', result.styles.issues.length, 'issues');
        console.log('Cleanup:', result.cleanup.issues.length, 'issues');
        console.log('Code:', result.code.issues.length, 'issues');
        break;

      case 'fix':
        await fix(workbook);
        const outputPath = path.join(
          path.dirname(filePath),
          `${path.basename(filePath, '.xlsx')}-fixed.xlsx`
        );
        await workbook.xlsx.writeFile(outputPath);
        console.log('Fixed workbook saved to:', outputPath);
        break;

      case 'verify':
        const isClean = await verify(workbook);
        console.log('Workbook is', isClean ? 'clean' : 'not clean');
        break;

      default:
        console.error('Unknown command:', command);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

export async function runCLI(args: string[]): Promise<void> {
  const targetPath = args[0];
  if (!targetPath) {
    console.error('Please provide a target path');
    process.exit(1);
  }

  // Update configuration with target path
  updateConfig({ targetPath });

  const isFixMode = args.includes('--fix');
  
  try {
    if (isFixMode) {
      const fixes = await fixWorksheets();
      console.log('Worksheet fixes completed:');
      console.log(JSON.stringify(fixes, null, 2));
    } else {
      const result = await analyzeWorksheets();
      console.log('Worksheet analysis completed:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 