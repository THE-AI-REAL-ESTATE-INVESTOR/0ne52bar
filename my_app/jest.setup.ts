import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

// Create a single PrismaClient instance for all tests
const prisma = new PrismaClient();

// Make prisma available globally for tests
global.prisma = prisma;

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Log test suite start/end
beforeAll(() => {
  console.log('🧪 Starting test suite');
});

afterAll(() => {
  console.log('✅ Test suite completed');
}); 