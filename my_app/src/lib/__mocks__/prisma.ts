import { jest } from '@jest/globals';
import { ErrorCode } from '@/lib/utils/error-handler';

/**
 * Prisma Client Mock for Testing
 * 
 * This file mocks the Prisma client for unit tests to avoid database connections.
 */

// Create mock Prisma error classes
export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: { target?: string[] };
  
  constructor(message: string, { code, meta }: { code: string; meta?: { target?: string[] } }) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
    this.meta = meta;
  }
}

export class PrismaClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaClientValidationError';
  }
}

// Create a mock implementation of common Prisma methods
const createMockPrismaMethod = () => {
  const mock = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  };

  // Set up default mock behavior for error cases
  mock.update.mockImplementation(async (args) => {
    // If the test sets this mock to return null, simulate a not found error
    if (mock.update.mockRejectedValueOnce) {
      const error = new PrismaClientKnownRequestError('Record to update not found', { 
        code: 'P2025'
      });
      throw error;
    }
    return args;
  });

  mock.delete.mockImplementation(async (args) => {
    // If the test sets this mock to return null, simulate a not found error
    if (mock.delete.mockRejectedValueOnce) {
      const error = new PrismaClientKnownRequestError('Record to delete not found', { 
        code: 'P2025'
      });
      throw error;
    }
    return args;
  });

  return mock;
};

// Create a mock of all Prisma models
const mockPrismaClient = {
  // TapPass models
  tapPassMember: createMockPrismaMethod(),
  tapPassFormData: createMockPrismaMethod(),
  
  // Add other Prisma models as needed
  user: createMockPrismaMethod(),
  event: createMockPrismaMethod(),
  businessInfo: createMockPrismaMethod(),
  businessHours: createMockPrismaMethod(),
  
  // Utilities
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $on: jest.fn(),
  $transaction: jest.fn((callback) => callback(mockPrismaClient)),
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
};

// Export mock Prisma errors for tests to use
export const Prisma = {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
};

// Export the mock
export const prisma = mockPrismaClient;
export default mockPrismaClient; 