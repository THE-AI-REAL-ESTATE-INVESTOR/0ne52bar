#!/usr/bin/env node

/**
 * TapPass Schema Verification Script
 * 
 * This script verifies that the Prisma schema correctly represents all the types
 * used in the TapPass application and suggests schema updates if needed.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Define paths
const PRISMA_SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

// Define expected model fields
const expectedModels = {
  Member: {
    id: 'String',
    memberId: 'String',
    name: 'String',
    email: 'String',
    phoneNumber: 'String', 
    birthday: 'DateTime',
    joinDate: 'DateTime',
    membershipLevel: 'String',
    agreeToTerms: 'Boolean',
    visits: 'Visit[]',
    rewards: 'Reward[]',
    createdAt: 'DateTime',
    updatedAt: 'DateTime'
  },
  Visit: {
    id: 'String',
    member: 'Member',
    memberId: 'String',
    visitDate: 'DateTime',
    amount: 'Float',
    points: 'Int',
    createdAt: 'DateTime'
  },
  Reward: {
    id: 'String',
    member: 'Member',
    memberId: 'String',
    rewardType: 'String',
    description: 'String',
    value: 'Float',
    isRedeemed: 'Boolean',
    redeemedAt: 'DateTime?',
    expiresAt: 'DateTime?',
    createdAt: 'DateTime'
  }
};

// Track results
const results = {
  success: true,
  missingModels: [] as string[],
  missingFields: [] as { model: string, field: string, type: string }[],
  typeDiscrepancies: [] as { model: string, field: string, expected: string, actual: string }[],
  suggestions: [] as string[]
};

// Helper to log with color
function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Read and parse schema
function readSchema() {
  if (!fs.existsSync(PRISMA_SCHEMA_PATH)) {
    log('red', '❌ Prisma schema not found!');
    results.success = false;
    results.suggestions.push('Create a prisma/schema.prisma file');
    return null;
  }
  
  return fs.readFileSync(PRISMA_SCHEMA_PATH, 'utf-8');
}

// Extract models from schema
function extractModels(schema: string) {
  const models: Record<string, Record<string, string>> = {};
  const modelRegex = /model\s+(\w+)\s+{([^}]*)}/g;
  let match;
  
  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
    const modelContent = match[2];
    models[modelName] = {};
    
    // Extract fields
    const fieldLines = modelContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    for (const line of fieldLines) {
      const fieldMatch = line.match(/(\w+)\s+(\S+)/);
      if (fieldMatch) {
        const [, fieldName, fieldType] = fieldMatch;
        models[modelName][fieldName] = fieldType.replace(/\s+.*$/, ''); // Remove decorators
      }
    }
  }
  
  return models;
}

// Verify schema against expected models
function verifySchema(models: Record<string, Record<string, string>>) {
  log('cyan', '\n🔍 Verifying Prisma schema against expected models...\n');
  
  // Check for missing models
  for (const modelName of Object.keys(expectedModels)) {
    if (!models[modelName]) {
      results.success = false;
      results.missingModels.push(modelName);
      continue;
    }
    
    // Check for missing fields and type discrepancies
    const expectedFields = expectedModels[modelName as keyof typeof expectedModels];
    for (const [fieldName, expectedType] of Object.entries(expectedFields)) {
      if (!models[modelName][fieldName]) {
        results.success = false;
        results.missingFields.push({ model: modelName, field: fieldName, type: expectedType });
      } else if (models[modelName][fieldName] !== expectedType) {
        results.success = false;
        results.typeDiscrepancies.push({
          model: modelName,
          field: fieldName,
          expected: expectedType,
          actual: models[modelName][fieldName]
        });
      }
    }
  }
}

// Generate schema updates
function generateSchemaUpdates() {
  let schemaUpdates = '';
  
  // Handle missing models
  for (const modelName of results.missingModels) {
    log('yellow', `Generating model ${modelName}...`);
    
    schemaUpdates += `\n// ${modelName} model\nmodel ${modelName} {\n`;
    
    // Add fields
    const expectedFields = expectedModels[modelName as keyof typeof expectedModels];
    for (const [fieldName, fieldType] of Object.entries(expectedFields)) {
      let line = `  ${fieldName} ${fieldType}`;
      
      // Add decorators
      if (fieldName === 'id') {
        line += ' @id @default(cuid())';
      } else if (fieldName === 'memberId' && modelName === 'Member') {
        line += ' @unique';
      } else if (fieldName === 'email' && modelName === 'Member') {
        line += ' @unique';
      } else if (fieldName === 'phoneNumber' && modelName === 'Member') {
        line += ' @unique';
      } else if (fieldName === 'createdAt') {
        line += ' @default(now())';
      } else if (fieldName === 'updatedAt' && modelName === 'Member') {
        line += ' @updatedAt';
      } else if (fieldName === 'joinDate' && modelName === 'Member') {
        line += ' @default(now())';
      } else if (fieldName === 'isRedeemed' && modelName === 'Reward') {
        line += ' @default(false)';
      }
      
      // Add relations
      if (modelName !== 'Member') {
        if (fieldName === 'member') {
          line += ' @relation(fields: [memberId], references: [id], onDelete: Cascade)';
        } else if (fieldName === 'memberId') {
          line += '';
        }
      }
      
      schemaUpdates += `${line}\n`;
    }
    
    // Add indexes for better performance
    if (modelName !== 'Member') {
      schemaUpdates += '\n  @@index([memberId])\n';
    }
    
    schemaUpdates += '}\n';
  }
  
  // Handle missing fields
  if (results.missingFields.length > 0) {
    log('yellow', '\nMissing fields to add:');
    
    for (const { model, field, type } of results.missingFields) {
      let line = `  ${field} ${type}`;
      
      // Add decorators
      if (field === 'id') {
        line += ' @id @default(cuid())';
      } else if (field === 'memberId' && model === 'Member') {
        line += ' @unique';
      } else if (field === 'email' && model === 'Member') {
        line += ' @unique';
      } else if (field === 'phoneNumber' && model === 'Member') {
        line += ' @unique';
      } else if (field === 'createdAt') {
        line += ' @default(now())';
      } else if (field === 'updatedAt' && model === 'Member') {
        line += ' @updatedAt';
      } else if (field === 'joinDate' && model === 'Member') {
        line += ' @default(now())';
      } else if (field === 'isRedeemed' && model === 'Reward') {
        line += ' @default(false)';
      }
      
      // Add relations
      if (model !== 'Member') {
        if (field === 'member') {
          line += ' @relation(fields: [memberId], references: [id], onDelete: Cascade)';
        }
      }
      
      log('yellow', `Add to model ${model}: ${line}`);
    }
  }
  
  // Handle type discrepancies
  if (results.typeDiscrepancies.length > 0) {
    log('yellow', '\nType discrepancies to fix:');
    
    for (const { model, field, expected, actual } of results.typeDiscrepancies) {
      log('yellow', `In model ${model}, change field ${field} from ${actual} to ${expected}`);
    }
  }
  
  return schemaUpdates;
}

// Print results
function printResults() {
  log('cyan', '\n📋 Schema Verification Results:');
  
  if (results.success) {
    log('green', '\n✅ Prisma schema is properly aligned with TapPass types.\n');
  } else {
    log('red', '\n❌ Prisma schema is not fully aligned with TapPass types.\n');
    
    if (results.missingModels.length > 0) {
      log('yellow', 'Missing models:');
      results.missingModels.forEach(model => {
        log('yellow', `  - ${model}`);
      });
      console.log();
    }
    
    if (results.missingFields.length > 0) {
      log('yellow', 'Missing fields:');
      results.missingFields.forEach(({ model, field, type }) => {
        log('yellow', `  - ${model}.${field}: ${type}`);
      });
      console.log();
    }
    
    if (results.typeDiscrepancies.length > 0) {
      log('yellow', 'Type discrepancies:');
      results.typeDiscrepancies.forEach(({ model, field, expected, actual }) => {
        log('yellow', `  - ${model}.${field}: expected ${expected}, found ${actual}`);
      });
      console.log();
    }
  }
  
  log('cyan', 'Next steps:');
  if (results.success) {
    log('green', '  1. Proceed with the TapPass migration');
    log('green', '  2. Run npx prisma generate && npx prisma db push');
    log('green', '  3. Run the migration script: ./scripts/migrate-tappass.sh');
  } else {
    log('yellow', '  1. Update the Prisma schema using the suggestions above');
    log('yellow', '  2. Run npx prisma generate && npx prisma db push');
    log('yellow', '  3. Run this verification script again');
  }
  console.log();
}

// Save schema updates to file if needed
function saveSchemaUpdates(schemaUpdates: string) {
  if (!schemaUpdates) return;
  
  const shouldSave = process.argv.includes('--fix');
  
  if (shouldSave) {
    log('cyan', '\nUpdating schema.prisma with missing models and fields...');
    
    // Append to existing schema
    fs.appendFileSync(PRISMA_SCHEMA_PATH, schemaUpdates);
    log('green', '✅ Schema updated successfully!');
    
    // Generate Prisma client
    log('cyan', '\nGenerating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      log('green', '✅ Prisma client generated successfully!');
    } catch (error) {
      log('red', '❌ Failed to generate Prisma client.');
      console.error(error);
    }
  } else {
    log('cyan', '\nTo automatically fix the schema, run:');
    log('yellow', '  npm run verify-schema -- --fix');
    
    // Save suggestions to a file
    const suggestionsPath = path.join(process.cwd(), 'prisma', 'schema-suggestions.prisma');
    fs.writeFileSync(suggestionsPath, schemaUpdates);
    log('cyan', `\nSchema suggestions saved to: ${suggestionsPath}`);
  }
}

// Main function
async function main() {
  log('cyan', '🧪 Starting TapPass Schema Verification...');
  
  const schema = readSchema();
  if (!schema) return;
  
  const models = extractModels(schema);
  verifySchema(models);
  
  const schemaUpdates = generateSchemaUpdates();
  printResults();
  
  if (!results.success) {
    saveSchemaUpdates(schemaUpdates);
  }
}

// Run the script
main().catch(error => {
  log('red', '\n❌ Unhandled error:');
  console.error(error);
  process.exit(1);
}); 