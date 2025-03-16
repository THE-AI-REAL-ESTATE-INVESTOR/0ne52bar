#!/usr/bin/env ts-node
/**
 * Database Connection Test Script
 * 
 * This script tests connections to the database and verifies that models
 * are properly configured in Prisma. It helps identify any issues with
 * database connectivity or model definitions.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// This script will dynamically import the Prisma client
async function main() {
  console.log(chalk.blue.bold('🔌 Testing Database Connections...'));
  
  // Step 1: Test basic database connection
  console.log(chalk.blue('1️⃣ Testing basic database connection...'));
  
  try {
    // We'll use the Prisma CLI to check connection
    console.log(chalk.gray('Running prisma db pull...'));
    execSync('npx prisma db pull --print', { stdio: 'pipe' });
    console.log(chalk.green('✅ Database connection successful!'));
  } catch (error) {
    console.error(chalk.red('❌ Database connection failed!'));
    console.error(chalk.red(error));
    process.exit(1);
  }
  
  // Step 2: Test Prisma client connection
  console.log(chalk.blue('2️⃣ Testing Prisma client connection...'));
  
  // Generate temporary test file
  const testFile = path.join(process.cwd(), 'scripts/temp-db-test.ts');
  
  const testFileContent = `
  import { PrismaClient } from '@prisma/client';
  
  async function testConnection() {
    const prisma = new PrismaClient();
    try {
      // Try to connect and run a simple query
      console.log("Connecting to database...");
      
      // Get database information
      const result = await prisma.$queryRaw\`SELECT current_database() as db\`;
      console.log("Connected to database:", result);
      
      // Check if we can get model counts
      const modelCounts = [];
      
      const models = Object.keys(prisma).filter(key => 
        !key.startsWith('$') && 
        !key.startsWith('_') && 
        typeof prisma[key] === 'object'
      );
      
      console.log("Found", models.length, "models in Prisma client");
      
      // Try to count records for each model
      for (const model of models) {
        try {
          const count = await prisma[model].count();
          modelCounts.push({ model, count });
          console.log(\`Model '\${model}' count: \${count}\`);
        } catch (err) {
          console.log(\`Error counting model '\${model}': \${err.message}\`);
        }
      }
      
      return {
        success: true,
        modelCounts
      };
    } catch (error) {
      console.error("Error connecting to database:", error);
      return {
        success: false,
        error
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  
  testConnection()
    .then(result => {
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
  `;
  
  try {
    fs.writeFileSync(testFile, testFileContent);
    console.log(chalk.gray('Running Prisma client test...'));
    
    const result = execSync(`npx ts-node ${testFile}`, { stdio: 'pipe' }).toString();
    console.log(chalk.green('✅ Prisma client connection successful!'));
    console.log(chalk.gray(result));
    
    // Clean up temporary file
    fs.unlinkSync(testFile);
  } catch (error) {
    console.error(chalk.red('❌ Prisma client connection failed!'));
    console.error(chalk.red(error.toString()));
    
    // Clean up temporary file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    process.exit(1);
  }
  
  // Step 3: Generate a report of existing tables
  console.log(chalk.blue('3️⃣ Generating database tables report...'));
  
  const tablesReportPath = path.join(process.cwd(), 'scripts/database-tables-report.md');
  
  try {
    // Use introspection to get the current database schema
    console.log(chalk.gray('Running database introspection...'));
    
    const introspectionOutput = execSync('npx prisma db pull --print', { stdio: 'pipe' }).toString();
    
    // Extract model definitions from introspection output
    const modelRegex = /model\s+(\w+)\s+\{([^}]+)\}/g;
    const models = [];
    let match;
    
    while ((match = modelRegex.exec(introspectionOutput)) !== null) {
      models.push({
        name: match[1],
        definition: match[0]
      });
    }
    
    // Generate report
    const report = `# Database Tables Report
Generated on: ${new Date().toISOString()}

## Summary

Found ${models.length} tables in the database.

## Tables

${models.map((model, index) => `
### ${index + 1}. ${model.name}

\`\`\`prisma
${model.definition}
\`\`\`
`).join('\n')}

## Next Steps

1. Compare this report with your Prisma schema to ensure tables match your model definitions
2. Check for any missing tables or fields
3. Use this information to help create appropriate server actions for each model
`;
    
    fs.writeFileSync(tablesReportPath, report);
    console.log(chalk.green(`✅ Tables report generated: ${tablesReportPath}`));
  } catch (error) {
    console.error(chalk.red('❌ Failed to generate tables report!'));
    console.error(chalk.red(error.toString()));
  }
  
  console.log(chalk.green.bold('✅ Database connection tests complete!'));
}

// Run the script
main().catch(err => {
  console.error(chalk.red('Error running script:'), err);
  process.exit(1);
}); 