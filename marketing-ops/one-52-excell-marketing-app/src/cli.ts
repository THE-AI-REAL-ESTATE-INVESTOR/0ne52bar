#!/usr/bin/env node
import { createVersionedCopy, getNextVersion } from './utils/versioning.js';
import { buildVersion } from './utils/build-version.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { getConfig, saveConfig, ProjectConfig } from './config.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSIONS_DIR = join(process.cwd(), 'src', 'versions');

interface VersionInfo {
  version: string;
  file: string;
  lastModified: Date;
}

async function listVersions() {
  try {
    const files = await readdir(VERSIONS_DIR);
    const versions = files
      .filter(file => file.endsWith('.ts'))
      .map(file => file.match(/v(\d+\.\d+)/)?.[1])
      .filter(Boolean);
    
    console.log('Available versions:');
    versions.forEach(version => console.log(`- v${version}`));
    return versions;
  } catch (error) {
    console.error('Error listing versions:', error);
    return [];
  }
}

async function runVersion(version: string) {
  try {
    // First build the version
    await buildVersion(version);
    
    // Then run it
    console.log(`Running version ${version}...`);
    const { stdout, stderr } = await execAsync(
      `node --experimental-specifier-resolution=node dist/versions/generate-marketing-spreadsheet.v${version}.js`
    );
    
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
  } catch (error) {
    console.error(`Error running version ${version}:`, error);
  }
}

async function createVersion(version?: string) {
  const config = getConfig();
  const sourceFile = join(__dirname, 'generate-marketing-spreadsheet.current.ts');
  const targetDir = join(__dirname, config.versionsDir);
  
  try {
    if (!version) {
      version = await getNextVersion(targetDir);
    }
    
    await createVersionedCopy(sourceFile, version, targetDir);
    console.log(`✅ Created version ${version} in ${targetDir}`);
  } catch (error) {
    console.error('❌ Error creating version:', error);
    process.exit(1);
  }
}

async function showVersionInfo(version: string) {
  const config = getConfig();
  const versionFile = path.join(config.versionsDir, `${config.filePrefix}.v${version}.ts`);
  if (!fs.existsSync(versionFile)) {
    console.error(`\n❌ Version ${version} not found`);
    return;
  }

  const content = fs.readFileSync(versionFile, 'utf-8');
  const headerMatch = content.match(/\/\*\*\s*\n\s*\*\s*Version:\s*(\d+\.\d+)\s*\n\s*\*\s*Last Updated:\s*(.*?)\s*\n\s*\*\s*Changes:\s*\n([\s\S]*?)\s*\*\//);
  
  if (headerMatch) {
    console.log('\n📋 Version Information:');
    console.log(`Version: ${headerMatch[1]}`);
    console.log(`Last Updated: ${headerMatch[2]}`);
    console.log('\nChanges:');
    console.log(headerMatch[3].trim());
  } else {
    console.log('\nℹ️ No version information found in file header');
  }
}

async function updateConfig(key: string, value: string) {
  const config = getConfig();
  const newConfig: ProjectConfig = { ...config };
  
  switch (key) {
    case 'name':
      newConfig.name = value;
      break;
    case 'filePrefix':
      newConfig.filePrefix = value;
      break;
    case 'outputDir':
      newConfig.outputDir = value;
      break;
    case 'versionsDir':
      newConfig.versionsDir = value;
      break;
    default:
      console.error(`\n❌ Invalid config key: ${key}`);
      return;
  }

  saveConfig(newConfig);
  console.log(`\n✅ Updated ${key} to ${value}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'list':
      await listVersions();
      break;
    case 'run':
      const version = args[1];
      if (!version) {
        console.error('Please specify a version to run');
        process.exit(1);
      }
      await runVersion(version);
      break;
    case 'create':
      await createVersion();
      break;
    case 'info':
      if (!args[1]) {
        console.error('\n❌ Please specify a version to show info for (e.g., "pnpm cli info 1.0")');
        process.exit(1);
      }
      await showVersionInfo(args[1]);
      break;
    case 'config':
      if (!args[1] || !args[2]) {
        console.error('\n❌ Please specify a key and value (e.g., "pnpm cli config filePrefix my-project")');
        process.exit(1);
      }
      await updateConfig(args[1], args[2]);
      break;
    case 'version':
      const subcommand = args[1];
      if (subcommand === 'create') {
        const version = args[2];
        await createVersion(version);
        process.exit(0);
      }
      break;
    default:
      console.log(`
📊 Marketing Spreadsheet Generator CLI

Usage:
  pnpm cli <command> [options]

Commands:
  list                    List all available versions
  run <version>          Run a specific version
  create                 Create a new version
  info <version>         Show information about a version
  config <key> <value>   Update configuration
  version create <version> Create a specific version

Configuration Keys:
  name                   Project name
  filePrefix            File prefix for versioned files
  outputDir             Output directory for compiled files
  versionsDir           Directory for versioned files

Examples:
  pnpm cli list
  pnpm cli run 1.0
  pnpm cli create
  pnpm cli info 1.0
  pnpm cli config filePrefix one-52-marketing
  pnpm cli version create 1.0
      `);
  }
}

main().catch(console.error); 