import { PrismaClient } from '@prisma/client';

declare global {
  // This prevents multiple instances of Prisma Client in development
  var prisma: PrismaClient | undefined;
}

// Use existing Prisma instance or create a new one
export const db = global.prisma || new PrismaClient();

// In development, attach Prisma to global to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
} 