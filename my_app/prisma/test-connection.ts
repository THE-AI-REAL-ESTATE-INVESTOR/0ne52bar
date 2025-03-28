import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful:', result);
    
    // Try to create a test category
    const category = await prisma.category.create({
      data: {
        name: 'TEST',
        sortOrder: 1
      }
    });
    console.log('Successfully created category:', category);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 