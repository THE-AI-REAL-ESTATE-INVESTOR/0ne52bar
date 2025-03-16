# Database Implementation Plan

This document outlines the systematic approach to implementing database connectivity across the application, focusing on making all UI elements fully functional with proper CRUD operations.

## Phase 1: Analysis and Planning

### Step 1: Run Database Analysis Scripts
```bash
# Install dependencies needed for scripts
npm install chalk

# Make scripts executable
chmod +x scripts/analyze-database-needs.ts
chmod +x scripts/test-database-connections.ts

# Run analysis script
npx ts-node scripts/analyze-database-needs.ts

# Test database connections
npx ts-node scripts/test-database-connections.ts
```

### Step 2: Review Generated Reports
1. Review `scripts/database-needs-report.md` to identify models needing server actions
2. Review `scripts/database-tables-report.md` to ensure database schema is correct
3. Prioritize models based on application functionality

## Phase 2: Core Infrastructure

### Step 1: Set Up Prisma Client Helper
Verify `/src/lib/prisma.ts` exists and is properly configured:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

### Step 2: Create Core Server Action Utilities
Create reusable utilities for error handling, validation, and response formatting:

```bash
# Create utilities directory
mkdir -p src/lib/utils

# Create utility files
touch src/lib/utils/api-response.ts
touch src/lib/utils/validation.ts
touch src/lib/utils/error-handler.ts
```

## Phase 3: Implementation By Feature Area

Implement server actions systematically by feature area, starting with the most critical:

### 1. User Authentication (Priority: HIGH)
- Implement User-related server actions
- Connect NextAuth to Prisma

### 2. TapPass Membership System (Priority: HIGH)
- Migrate in-memory actions to Prisma
- Test data persistence

### 3. Menu Management (Priority: MEDIUM)
- Implement MenuItem and Category server actions
- Connect admin UI

### 4. Event Management (Priority: MEDIUM)
- Implement Event server actions
- Connect with Facebook events integration

### 5. Business Information (Priority: LOW)
- Implement BusinessInfo and BusinessHours server actions
- Connect settings UI

## Phase 4: Implementation Process for Each Model

For each model, follow these steps:

1. **Create Server Action File**
   ```bash
   # Example for MenuItem model
   cp scripts/templates/server-action-template.ts src/app/actions/menuitem-actions.ts
   ```

2. **Customize the Server Action**
   - Update the model name and schema
   - Implement proper validation
   - Add business logic specific to the model

3. **Connect to UI**
   - Update forms to use server actions
   - Implement loading and error states
   - Add optimistic updates where appropriate

4. **Test**
   - Test CRUD operations
   - Verify UI updates correctly
   - Test error handling

## Phase 5: Testing and Verification

### 1. Create Database Testing Script
```bash
# Run comprehensive tests
npx ts-node scripts/test-database-implementation.ts
```

### 2. Manual Testing Checklist
- [ ] Create new records through UI
- [ ] View records in admin panels
- [ ] Edit existing records
- [ ] Delete records
- [ ] Verify frontend reflects changes
- [ ] Test error scenarios
- [ ] Check validation

## Implementation Timeline

### Week 1: Core Infrastructure & Authentication
- Day 1-2: Analysis, planning, and core utilities
- Day 3-5: User authentication and TapPass

### Week 2: Main Features
- Day 1-2: Menu management
- Day 3-4: Event management
- Day 5: Business information

### Week 3: Refinement
- Day 1-3: Testing and bug fixes
- Day 4-5: Performance optimization and polishing

## Progress Tracking

| Feature Area       | Analysis | Server Actions | UI Connection | Testing | Complete |
|--------------------|----------|---------------|---------------|---------|----------|
| Authentication     | ✅       | □             | □             | □       | □        |
| TapPass            | ✅       | ✅            | ✅            | □       | □        |
| Menu Management    | ✅       | □             | □             | □       | □        |
| Event Management   | ✅       | □             | □             | □       | □        |
| Business Info      | ✅       | □             | □             | □       | □        |

## Completed Tasks

### Core Infrastructure
- [x] Set up Prisma client helper
- [x] Create standardized API response utilities
- [x] Create error handling utilities
- [x] Create server action factories
- [x] Set up Jest testing environment
- [x] Create Prisma client mock for testing

### TapPass Feature
- [x] Create TapPassMember model and schema
- [x] Create TapPassFormData model and schema
- [x] Create validation schemas with Zod
- [x] Implement server actions for TapPass models
- [x] Implement unit tests for TapPass server actions

## Next Steps

1. Fix dependency issues:
   ```bash
   ./scripts/setup-jest.sh
   pnpm exec ts-node scripts/fix-dependencies.ts
   ```

2. Run the unit tests to ensure server actions are working correctly:
   ```bash
   pnpm test
   ```

3. Generate actions for remaining models:
   ```bash
   pnpm exec ts-node scripts/generate-model-actions.ts --model=<ModelName>
   ```

4. Update UI components to use server actions
5. Test the database implementation end-to-end

## Troubleshooting Common Issues

### Database Connection Issues
- Verify `.env.local` has correct DATABASE_URL
- Check PostgreSQL server is running
- Run `npx prisma db pull` to test connection

### Model Not Found in Prisma Client
- Run `npx prisma generate` to update client
- Check model name capitalization (Prisma uses camelCase for models)

### Server Action Not Working
- Check server action is using "use server" directive
- Verify form is properly submitting data
- Check console for errors
- Confirm revalidatePath is called with correct path

---

**Note**: Update this document as implementation progresses to track status and add any learned lessons or optimizations. 