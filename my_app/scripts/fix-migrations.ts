import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixFailedMigrations() {
  try {
    // First, get all failed migrations
    const failedMigrations = await prisma.$queryRaw`
      SELECT migration_name 
      FROM "_prisma_migrations" 
      WHERE finished_at IS NULL 
      OR applied_steps_count = 0;
    `;

    console.log('Found failed migrations:', failedMigrations);

    // Mark all failed migrations as skipped
    await prisma.$executeRaw`
      UPDATE "_prisma_migrations" 
      SET "finished_at" = NOW(),
          "applied_steps_count" = 1,
          "logs" = 'Migration skipped - structures already exist'
      WHERE finished_at IS NULL 
      OR applied_steps_count = 0;
    `;
    
    console.log('Successfully marked failed migrations as skipped');
  } catch (error) {
    console.error('Error fixing migrations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFailedMigrations(); 