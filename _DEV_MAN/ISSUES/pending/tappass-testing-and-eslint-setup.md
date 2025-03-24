# TapPass Testing and ESLint Setup Documentation

## Overview

This document outlines the testing infrastructure and ESLint configuration for the TapPass feature. We've implemented a comprehensive testing suite that verifies both the Prisma database operations and the application logic.

## Test Infrastructure

### Jest Configuration (`jest.config.mjs`)

```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  // ... other config
}
```

Key features:
- Uses Node.js test environment for Prisma operations
- Global setup file for test initialization
- Coverage reporting configuration
- Path alias support (@/*)
- Babel transformation for Next.js compatibility

### Test Setup (`jest.setup.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

const prisma = new PrismaClient();
global.prisma = prisma;
```

Features:
- Single PrismaClient instance for all tests
- Global cleanup after test completion
- Test suite logging
- Proper TypeScript declarations

## Test Suites

### 1. TapPass Prisma Integration Tests (`tappass-prisma-verification.test.ts`)

This suite verifies the core database operations:

```typescript
describe('TapPass Prisma Integration', () => {
  // Test cases:
  // 1. Member retrieval
  // 2. Member registration
  // 3. Visit recording
  // 4. Member listing with visit history
})
```

Key aspects:
- Uses real database operations
- Creates test data in beforeAll
- Cleans up test data in afterAll
- Verifies all CRUD operations
- Tests relationship handling

### 2. Form Data Tests (`tapPassFormData.test.ts`)

Validates form data handling:
- Input validation
- Data transformation
- Error handling

### 3. Member Service Tests (`tapPassMember.test.ts`)

Tests the member service layer:
- Member creation
- Member updates
- Points calculation
- Membership level updates

## ESLint Configuration

### Prisma-Specific Rules (`.eslintrc.prisma.json`)

```json
{
  "rules": {
    "prisma/no-empty-blocks": "error",
    "prisma/prefer-field-defaults": "warn",
    "prisma/prefer-unique-index": "warn",
    "prisma/require-foreign-key-index": "warn"
  }
}
```

Key rules:
- Prevents empty Prisma blocks
- Enforces default values
- Recommends unique indexes
- Requires foreign key indexes

### Schema Verification Script (`verify-schema.mjs`)

```javascript
// Verifies:
// 1. Database connection
// 2. Schema validity
// 3. Member count
// 4. ESLint compliance
```

## Current Status

### Working Features
1. ✅ Database connection verification
2. ✅ Schema validation
3. ✅ Member operations testing
4. ✅ Visit history testing
5. ✅ ESLint Prisma rules
6. ✅ Test data cleanup

### Known Issues
1. ⚠️ TextEncoder polyfill needed for Node.js environment
2. ⚠️ Prisma client bundling in test environment
3. ⚠️ Some ESLint warnings about ignored files

### Next Steps
1. Add more specific test cases for edge cases
2. Implement test database isolation
3. Add performance testing
4. Enhance ESLint rules for specific patterns
5. Add pre-commit hooks for automatic verification

## Usage

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test src/app/tappass/__tests__/tappass-prisma-verification.test.ts

# Run with coverage
pnpm test --coverage
```

### Schema Verification
```bash
# Verify schema and database
pnpm run verify-schema
```

## Best Practices

1. **Test Data Management**
   - Use unique identifiers for test data
   - Clean up after tests
   - Isolate test data from production

2. **Database Operations**
   - Use transactions where appropriate
   - Verify both success and failure cases
   - Test relationship integrity

3. **Code Quality**
   - Follow ESLint rules strictly
   - Document complex test cases
   - Keep tests focused and isolated

4. **Performance**
   - Use appropriate indexes
   - Optimize database queries
   - Monitor test execution time

## Future Improvements

1. **Testing Infrastructure**
   - Add test database seeding
   - Implement parallel test execution
   - Add performance benchmarks

2. **ESLint Rules**
   - Add more specific Prisma patterns
   - Implement custom rules for our use cases
   - Add automatic fixes where possible

3. **Documentation**
   - Add more test examples
   - Document common issues and solutions
   - Create troubleshooting guide 