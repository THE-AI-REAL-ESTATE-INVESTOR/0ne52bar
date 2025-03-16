# Jest Testing Guide for Next.js API Actions

This guide will help you set up and run Jest tests for your Next.js server actions.

## Setup Instructions

1. **Install Jest and related dependencies**:

```bash
pnpm add -D jest @jest/globals jest-environment-jsdom @types/jest ts-jest

# For testing Next.js specific features
pnpm add -D @testing-library/react @testing-library/jest-dom
```

2. **Add Jest types to your `tsconfig.json`**:

```json
{
  "compilerOptions": {
    "types": [
      "jest",
      "@testing-library/jest-dom"
    ]
  }
}
```

3. **Create Jest configuration file**:

The `jest.config.mjs` file has been created at the root of your project. This file configures Jest to work with Next.js and your project structure.

4. **Create Jest setup file**:

The `jest.setup.js` file has been created at the root of your project. This file contains global setup code that runs before your tests, including:
- Environment variable mocking
- Next.js cache function mocks
- UUID mocking
- Custom matchers for API responses

## Running Tests

Run all tests:

```bash
pnpm test
```

Run specific test files:

```bash
pnpm test -- src/actions/tapPassMember.test.ts
```

Run tests in watch mode:

```bash
pnpm test -- --watch
```

## Test Structure

Tests are organized by feature, with separate test files for each server action file. Each file follows the Arrange-Act-Assert pattern:

1. **Arrange**: Set up test data and mock dependencies
2. **Act**: Call the function being tested
3. **Assert**: Verify the expected behavior

Example test structure:

```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('functionName', () => {
    it('should do something when condition', async () => {
      // Arrange
      // Set up test data and mocks

      // Act
      // Call the function being tested

      // Assert
      // Verify the expected behavior
    });
  });
});
```

## Mocking Prisma

The Prisma client is mocked to avoid making actual database calls during tests. The mock is defined in `src/lib/__mocks__/prisma.ts` and automatically used when you call `jest.mock('@/lib/prisma')` in your test files.

To mock a Prisma method for a specific test:

```typescript
// Mock the Prisma create method to return a specific value
(prisma.modelName.create as jest.Mock).mockResolvedValue(mockData);

// Mock the Prisma create method to throw an error
(prisma.modelName.create as jest.Mock).mockRejectedValue(new Error('Some error'));
```

## Testing API Responses

The API response utilities include custom Jest matchers to make testing easier:

```typescript
// Test a success response
expect(result).toBeApiSuccess();
expect(result).toBeApiSuccess({ 
  data: expectedData 
});

// Test an error response
expect(result).toBeApiError();
expect(result).toBeApiError({ 
  code: ErrorCode.NOT_FOUND 
});
```

## Troubleshooting

### Module Not Found Errors

If you encounter module not found errors, make sure:

1. All required dependencies are installed
2. Jest module mapper is configured correctly in `jest.config.mjs`
3. Path aliases match your tsconfig.json configuration

### Test Files Not Being Detected

Ensure your test files follow the naming convention:
- `*.test.ts` or `*.test.tsx` for TypeScript files
- `*.test.js` or `*.test.jsx` for JavaScript files

### Type Errors in Test Files

Make sure you have the Jest types installed and configured:

```bash
pnpm add -D @types/jest
```

And update your tsconfig.json:

```json
{
  "compilerOptions": {
    "types": ["jest"]
  }
}
```

## Best Practices

1. **Mock external dependencies**: Always mock external services like databases, APIs, etc.
2. **Test both success and error cases**: Ensure your tests cover both happy paths and error scenarios
3. **Keep tests isolated**: Tests should not depend on each other or external state
4. **Use descriptive test names**: Test names should clearly describe what is being tested
5. **Focus on behavior, not implementation**: Test what the function does, not how it does it 