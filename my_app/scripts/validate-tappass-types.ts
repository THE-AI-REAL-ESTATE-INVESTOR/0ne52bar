#!/usr/bin/env ts-node

/**
 * TapPass Type Validation Script
 * 
 * This script validates that all types used in the TapPass feature
 * are properly represented in the Prisma schema.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { MemberRecord } from '../src/app/tappass/types';

// Initialize Prisma client
const prisma = new PrismaClient();

// Track validation results
const results = {
  success: true,
  missingFields: [] as string[],
  typeDiscrepancies: [] as string[],
  suggestions: [] as string[],
};

/**
 * Main validation function
 */
async function validateTapPassTypes() {
  console.log(chalk.cyan('\n🔍 Starting TapPass type validation...\n'));

  try {
    // Get Prisma schema definition
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Prisma schema not found at: ' + schemaPath);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    
    // Validate Member model
    console.log(chalk.cyan('Validating Member model against MemberRecord type...'));
    validateMemberModel(schemaContent);

    // Inspect database models
    await inspectDatabaseModels();

    // Output validation results
    outputResults();

  } catch (error) {
    console.error(chalk.red('❌ Error during validation:'), error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Validate the Member model against MemberRecord type
 */
function validateMemberModel(schemaContent: string) {
  // Extract Member model from schema
  const memberModelMatch = schemaContent.match(/model\s+Member\s+{[\s\S]*?}/);
  if (!memberModelMatch) {
    results.success = false;
    results.suggestions.push('Member model not found in Prisma schema. Please add it.');
    return;
  }

  const memberModel = memberModelMatch[0];
  
  // Check required fields from MemberRecord type
  const requiredFields: Record<keyof MemberRecord, string> = {
    memberId: 'String',
    name: 'String',
    email: 'String',
    birthday: 'DateTime',
    phoneNumber: 'String',
    agreeToTerms: 'Boolean',
    joinDate: 'DateTime',
    membershipLevel: 'String',
  };

  // Validate each required field
  Object.entries(requiredFields).forEach(([field, expectedType]) => {
    // Check if field exists
    const fieldRegex = new RegExp(`\\s${field}\\s+([A-Za-z]+)`);
    const match = memberModel.match(fieldRegex);
    
    if (!match) {
      results.success = false;
      results.missingFields.push(field);
      results.suggestions.push(`Add "${field}" field to Member model`);
    } else {
      // Check field type
      const actualType = match[1];
      if (actualType !== expectedType) {
        results.success = false;
        results.typeDiscrepancies.push(`${field}: expected ${expectedType}, found ${actualType}`);
      }
    }
  });
}

/**
 * Inspect database models using Prisma introspection
 */
async function inspectDatabaseModels() {
  console.log(chalk.cyan('\nInspecting database models...'));
  
  try {
    // Check if Member model exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _memberModel = await prisma.member.findFirst();
    console.log(chalk.green('✓ Member model is accessible'));
    
    // Check if Visit model exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _visitModel = await prisma.visit.findFirst();
    console.log(chalk.green('✓ Visit model is accessible'));
    
    // Check if Reward model exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _rewardModel = await prisma.reward.findFirst();
    console.log(chalk.green('✓ Reward model is accessible'));
    
  } catch (error) {
    console.error(chalk.red('Error accessing models:'), error);
    results.success = false;
    results.suggestions.push('Error accessing database models. Make sure to run prisma generate and prisma db push before validation.');
  }
}

/**
 * Format and output validation results
 */
function outputResults() {
  console.log(chalk.cyan('\n📋 TapPass Type Validation Results:'));
  
  if (results.success) {
    console.log(chalk.green('\n✅ All TapPass types are properly represented in the Prisma schema.\n'));
  } else {
    console.log(chalk.red('\n❌ TapPass types are not fully aligned with Prisma schema.\n'));
    
    if (results.missingFields.length > 0) {
      console.log(chalk.yellow('Missing fields:'));
      results.missingFields.forEach(field => {
        console.log(chalk.yellow(`  - ${field}`));
      });
      console.log();
    }
    
    if (results.typeDiscrepancies.length > 0) {
      console.log(chalk.yellow('Type discrepancies:'));
      results.typeDiscrepancies.forEach(discrepancy => {
        console.log(chalk.yellow(`  - ${discrepancy}`));
      });
      console.log();
    }
    
    console.log(chalk.cyan('Suggestions:'));
    results.suggestions.forEach(suggestion => {
      console.log(chalk.cyan(`  - ${suggestion}`));
    });
    console.log();
  }
  
  console.log(chalk.cyan('Next steps:'));
  if (results.success) {
    console.log(chalk.green('  1. Proceed with the TapPass migration'));
    console.log(chalk.green('  2. Run the migrate-tappass.sh script'));
  } else {
    console.log(chalk.yellow('  1. Update the Prisma schema to fix the issues'));
    console.log(chalk.yellow('  2. Run prisma generate && prisma db push'));
    console.log(chalk.yellow('  3. Run this validation script again'));
  }
  console.log();
}

// Run the validation
validateTapPassTypes().catch(e => {
  console.error(chalk.red('\nUnhandled error:'), e);
  process.exit(1);
}); 