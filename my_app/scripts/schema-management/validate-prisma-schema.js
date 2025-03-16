#!/usr/bin/env node

/**
 * Prisma Schema Validation Script
 * 
 * This script analyzes the Prisma schema to identify:
 * 1. Test models that can be removed
 * 2. Models that are actually used in the application
 * 3. Potential improvements to the schema
 * 
 * Usage:
 *   node scripts/validate-prisma-schema.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');
const SRC_PATH = path.join(process.cwd(), 'src');
const TEST_MODEL_PREFIX = 'Test';

// Helper functions
function readSchema() {
  return fs.readFileSync(SCHEMA_PATH, 'utf8');
}

function extractModels(schema) {
  const modelRegex = /model\s+(\w+)\s+{[^}]*}/g;
  const models = [];
  let match;
  
  while ((match = modelRegex.exec(schema)) !== null) {
    models.push(match[1]);
  }
  
  return models;
}

function findTestModels(models) {
  return models.filter(model => model.startsWith(TEST_MODEL_PREFIX));
}

function searchForModelUsage(model) {
  try {
    // Exclude the schema itself and node_modules
    const result = execSync(
      `grep -r "${model}" --include="*.{ts,tsx,js,jsx}" ${SRC_PATH} | grep -v "node_modules"`,
      { encoding: 'utf8' }
    );
    return result.split('\n').filter(line => line.trim()).length;
  } catch (error) {
    // grep returns exit code 1 if no matches are found
    return 0;
  }
}

function analyzeSchema() {
  console.log('🔍 Analyzing Prisma schema...');
  
  // Read the schema
  const schema = readSchema();
  
  // Extract models
  const allModels = extractModels(schema);
  console.log(`📊 Found ${allModels.length} models in the schema.`);
  
  // Find test models
  const testModels = findTestModels(allModels);
  console.log(`🧪 Found ${testModels.length} test models that can be removed:`);
  testModels.forEach(model => console.log(`  - ${model}`));
  
  // Check for used models
  console.log('\n🔎 Checking which models are actually used in the code:');
  const productionModels = allModels.filter(model => !model.startsWith(TEST_MODEL_PREFIX));
  
  const usedModels = [];
  const unusedModels = [];
  
  productionModels.forEach(model => {
    const usageCount = searchForModelUsage(model);
    if (usageCount > 0) {
      usedModels.push({ name: model, usageCount });
    } else {
      unusedModels.push(model);
    }
  });
  
  console.log('\n✅ Models found in application code:');
  usedModels.forEach(model => {
    console.log(`  - ${model.name} (found in ${model.usageCount} places)`);
  });
  
  if (unusedModels.length > 0) {
    console.log('\n⚠️ Models NOT found in application code (may still be used indirectly):');
    unusedModels.forEach(model => {
      console.log(`  - ${model}`);
    });
  }
  
  // Calculate size impact
  const schemaSize = schema.length;
  const testModelRegex = new RegExp(`model\\s+(${testModels.join('|')})\\s+{[^}]*}`, 'g');
  const schemaWithoutTests = schema.replace(testModelRegex, '');
  const sizeReduction = ((schemaSize - schemaWithoutTests.length) / schemaSize * 100).toFixed(2);
  
  console.log(`\n📏 Removing test models would reduce schema size by approximately ${sizeReduction}%`);
  
  return {
    allModels,
    testModels,
    usedModels: usedModels.map(m => m.name),
    unusedModels
  };
}

// Main execution
try {
  const analysis = analyzeSchema();
  
  // Summary
  console.log('\n📝 SUMMARY:');
  console.log(`  Total models: ${analysis.allModels.length}`);
  console.log(`  Test models to remove: ${analysis.testModels.length}`);
  console.log(`  Production models used: ${analysis.usedModels.length}`);
  console.log(`  Production models potentially unused: ${analysis.unusedModels.length}`);
  
  // Recommendations
  console.log('\n🛠️ RECOMMENDATIONS:');
  console.log('  1. Remove all test models by removing "model Test..." blocks');
  console.log('  2. Organize remaining models by feature (TapPass, Menu, Merchandise, Events)');
  console.log('  3. Add clear documentation to each model');
  console.log('  4. Add appropriate indexes for frequently queried fields');
  console.log('  5. Review potentially unused models to confirm if they should be kept');
  
} catch (error) {
  console.error('❌ Error analyzing schema:', error);
  process.exit(1);
} 