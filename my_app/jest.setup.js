/**
 * Jest Setup File
 * 
 * This file contains setup code that runs before Jest executes the tests.
 * It includes mocking global objects and adding custom matchers.
 */

// Mock environment variables
process.env.NODE_ENV = 'test';

// Mock Next.js features
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

// Mock UUID generation
jest.mock('crypto', () => {
  const originalModule = jest.requireActual('crypto');
  return {
    ...originalModule,
    randomUUID: jest.fn(() => 'mock-uuid'),
  };
});

// Add global hooks
beforeAll(() => {
  console.log('🧪 Starting test suite');
});

afterAll(() => {
  console.log('✅ Test suite completed');
  jest.clearAllMocks();
});

// Define custom matchers for API responses
expect.extend({
  toBeApiSuccess(received, expected = {}) {
    const pass = received && 
                received.success === true && 
                (expected.data ? this.equals(received.data, expected.data) : true);
    
    return {
      pass,
      message: () => pass
        ? `Expected ${this.utils.printReceived(received)} not to be a success response`
        : `Expected ${this.utils.printReceived(received)} to be a success response${
            expected.data ? ` with data ${this.utils.printExpected(expected.data)}` : ''
          }`,
    };
  },
  
  toBeApiError(received, expected = {}) {
    const pass = received && 
                received.success === false && 
                Boolean(received.error) &&
                (expected.code ? received.error.code === expected.code : true);
    
    return {
      pass,
      message: () => pass
        ? `Expected ${this.utils.printReceived(received)} not to be an error response`
        : `Expected ${this.utils.printReceived(received)} to be an error response${
            expected.code ? ` with code ${this.utils.printExpected(expected.code)}` : ''
          }`,
    };
  },
}); 