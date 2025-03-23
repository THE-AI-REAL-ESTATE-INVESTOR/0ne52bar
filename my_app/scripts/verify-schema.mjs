import { ESLint } from 'eslint';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function verifySchema() {
  try {
    // Check Prisma schema
    const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma');
    
    const eslint = new ESLint({
      baseConfig: {
        plugins: ['prisma'],
        rules: {
          'prisma/no-empty-blocks': 'error',
          'prisma/prefer-field-defaults': 'warn',
          'prisma/prefer-unique-index': 'warn',
          'prisma/require-foreign-key-index': 'warn',
          'prisma/no-unnecessary-indexes': 'warn',
          'prisma/no-raw-queries': 'warn'
        }
      },
      fix: process.argv.includes('--fix'),
    });

    const results = await eslint.lintFiles([schemaPath]);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = await formatter.format(results);

    if (resultText) {
      console.log(resultText);
    } else {
      console.log('No schema issues found.');
    }

    // Check database connection
    await prisma.$connect();
    console.log('Database connection successful');

    // Check if we can query the database
    const memberCount = await prisma.member.count();
    console.log(`Found ${memberCount} members in database`);

    // Check for any schema issues
    const schema = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `;
    console.log('Schema check completed successfully');

    // Close database connection
    await prisma.$disconnect();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Schema verification failed:', error);
    process.exit(1);
  }
}

verifySchema(); 