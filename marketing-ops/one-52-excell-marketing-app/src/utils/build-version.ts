import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildVersion(version: string): Promise<void> {
  try {
    // Ensure dist directory exists
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Ensure versions directory exists in dist
    const versionsDir = path.join(distDir, 'versions');
    if (!fs.existsSync(versionsDir)) {
      fs.mkdirSync(versionsDir, { recursive: true });
    }

    // Build the project with proper path resolution
    console.log('Building project...');
    await execAsync('pnpm build');

    // Copy the config file to dist
    const configSource = path.join(process.cwd(), 'src', 'config.ts');
    const configDest = path.join(distDir, 'config.js');
    if (fs.existsSync(configSource)) {
      fs.copyFileSync(configSource, configDest);
    }

    // Copy types directory
    const typesSource = path.join(process.cwd(), 'src', 'types');
    const typesDest = path.join(distDir, 'types');
    if (fs.existsSync(typesSource)) {
      if (!fs.existsSync(typesDest)) {
        fs.mkdirSync(typesDest, { recursive: true });
      }
      fs.readdirSync(typesSource).forEach(file => {
        fs.copyFileSync(
          path.join(typesSource, file),
          path.join(typesDest, file)
        );
      });
    }

    // Verify the version file exists
    const versionFile = path.join(process.cwd(), 'src', 'versions', `generate-marketing-spreadsheet.v${version}.ts`);
    if (!fs.existsSync(versionFile)) {
      throw new Error(`Version file not found: ${versionFile}`);
    }

    console.log(`✅ Version ${version} built successfully`);
  } catch (error) {
    console.error('❌ Error building version:', error);
    throw error;
  }
}

// If this file is run directly
if (import.meta.url === fileURLToPath(import.meta.url)) {
  const version = process.argv[2];
  if (!version) {
    console.error('Please provide a version number');
    process.exit(1);
  }
  buildVersion(version).catch(console.error);
} 