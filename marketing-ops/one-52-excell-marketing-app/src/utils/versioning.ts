import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { getConfig } from '@/config';
import fs from 'fs';
import path from 'path';

const VERSIONS_DIR = join(process.cwd(), 'src', 'versions');

/**
 * Gets the next version number based on existing versions
 */
export async function getNextVersion(targetDir: string): Promise<string> {
  const files = await fs.promises.readdir(targetDir);
  const versionRegex = /v(\d+\.\d+)/;
  let maxVersion = 0;
  
  files.forEach((file: string) => {
    const match = file.match(versionRegex);
    if (match) {
      const version = parseFloat(match[1]);
      maxVersion = Math.max(maxVersion, version);
    }
  });
  
  return (maxVersion + 0.1).toFixed(1);
}

/**
 * Creates a versioned copy of a file
 */
export async function createVersionedCopy(sourceFile: string, version: string, targetDir: string): Promise<void> {
  // Ensure target directory exists
  await fs.promises.mkdir(targetDir, { recursive: true });
  
  // Create versioned filename
  const versionedFileName = `generate-marketing-spreadsheet.v${version}.ts`;
  const targetFile = path.join(targetDir, versionedFileName);
  
  // Copy the file
  await fs.promises.copyFile(sourceFile, targetFile);
  console.log(`✅ Created versioned file: ${versionedFileName}`);
} 