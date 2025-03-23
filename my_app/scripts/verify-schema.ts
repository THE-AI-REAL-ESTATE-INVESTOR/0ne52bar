import { ESLint } from 'eslint';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifySchema(): Promise<void> {
  const eslint = new ESLint({
    overrideConfigFile: '.eslintrc.json',
    fix: process.argv.includes('--fix'),
  });

  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  const dbPath = path.resolve(__dirname, '../src/lib/db');

  if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.prisma not found!');
    process.exit(1);
  }

  console.log('🔍 Verifying Prisma schema and database code...');

  // Check schema.prisma
  const schemaResults = await eslint.lintFiles([schemaPath]);
  
  // Check database code
  const dbResults = await eslint.lintFiles([`${dbPath}/**/*.ts`]);
  
  const results = [...schemaResults, ...dbResults];

  // Apply fixes if --fix flag is present
  if (process.argv.includes('--fix')) {
    await ESLint.outputFixes(results);
  }

  // Format results
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = await formatter.format(results);

  if (resultText) {
    console.log(resultText);
  }

  // Check if there are any errors
  const hasErrors = results.some(result => result.errorCount > 0);
  
  if (hasErrors) {
    console.error('❌ Schema verification failed!');
    process.exit(1);
  } else {
    console.log('✅ Schema verification passed!');
  }
}

verifySchema().catch((error) => {
  console.error('Error running schema verification:', error);
  process.exit(1);
}); 